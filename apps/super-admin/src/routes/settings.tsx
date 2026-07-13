import { useConfigsMutation, useConfigsQuery } from "@repo/hooks/useConfigs";
import { useDebounce } from "@repo/hooks/useDebounce";
import { logout } from "@repo/lib/auth";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { AdminLayout } from "../components/AdminNav";
import { SecretCodeDialog } from "../components/SecretCodeDialog";
import { BaseInfoSection } from "../components/settings/BaseInfoSection";
import { BranchTableSection } from "../components/settings/BranchTableSection";
import { BranchDialog } from "../components/settings-branch-table/BranchDialog";
import type { UnifiedBranch } from "../components/settings-branch-table/columns";
import { useSecretCode } from "../hooks/useSecretCode";

export const Route = createFileRoute("/settings")({
	beforeLoad: ({ context }) => {
		if (!context.auth?.adminToken) {
			throw redirect({ to: "/signin" });
		}
	},
	component: SettingsPage,
});

const stripKeys = (items: UnifiedBranch[]) =>
	items.map(({ value, label }) => ({ value, label }));

function SettingsPage() {
	const navigate = useNavigate();
	const secretCode = useSecretCode();
	const idCounter = useRef(0);
	const getUniqueId = useCallback(() => {
		idCounter.current += 1;
		return `branch-${Date.now()}-${idCounter.current}`;
	}, []);

	const { data: configs, isLoading } = useConfigsQuery(true);
	const { mutate: updateConfigs, isPending } = useConfigsMutation();

	const [baseInfo, setBaseInfo] = useState({
		nasabah: 2.4,
		cabang: { indonesia: 7, malaysia: 21, lainnya: 0 },
		negara: 5,
	});

	const [unifiedBranches, setUnifiedBranches] = useState<UnifiedBranch[]>([]);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [branchToEdit, setBranchToEdit] = useState<UnifiedBranch | null>(null);
	const [countryFilter, setCountryFilter] = useState<"id" | "my">("id");

	const hasUserModified = useRef(false);
	const debouncedBaseInfo = useDebounce(baseInfo, 1000);
	const debouncedUnifiedBranches = useDebounce(unifiedBranches, 1000);

	const toUnifiedBranches = useCallback(
		(items: { value: string; label: string }[], country: "id" | "my"): UnifiedBranch[] =>
			items.map((item) => ({ ...item, country, _key: getUniqueId() })),
		[getUniqueId],
	);

	useEffect(() => {
		if (configs) {
			if (configs.base_info) {
				setBaseInfo({
					...configs.base_info,
					cabang: {
						...configs.base_info.cabang,
						lainnya: configs.base_info.cabang.lainnya || 0,
					},
				});
			}

			const idBranches = configs.branches_id ? toUnifiedBranches(configs.branches_id, "id") : [];
			const myBranches = configs.branches_my ? toUnifiedBranches(configs.branches_my, "my") : [];

			setUnifiedBranches([...idBranches, ...myBranches]);
		}
	}, [configs, toUnifiedBranches]);

	const handleLogout = () => {
		logout();
		navigate({ to: "/signin" });
	};

	const getDuplicateValues = (items: UnifiedBranch[]) => {
		const seen = new Map<string, number>();
		for (const item of items) {
			if (item.value.trim()) {
				seen.set(item.value.trim(), (seen.get(item.value.trim()) || 0) + 1);
			}
		}
		return new Set([...seen.entries()].filter(([, count]) => count > 1).map(([val]) => val));
	};

	const duplicateValues = getDuplicateValues(unifiedBranches);

	const stripKeys = (items: UnifiedBranch[]) => items.map(({ value, label }) => ({ value, label }));

	// Auto-save effect
	useEffect(() => {
		if (hasUserModified.current) {
			const branches_id = debouncedUnifiedBranches.filter((b) => b.country === "id");
			const branches_my = debouncedUnifiedBranches.filter((b) => b.country === "my");
			const lainnya = debouncedBaseInfo.cabang.lainnya || 0;
			const idCount = branches_id.length > 0 ? 1 : 0;
			const myCount = branches_my.length > 0 ? 1 : 0;

			updateConfigs(
				{
					base_info: {
						...debouncedBaseInfo,
						cabang: {
							indonesia: branches_id.length,
							malaysia: branches_my.length,
							lainnya,
						},
						negara: idCount + myCount + lainnya,
					},
					branches_id: stripKeys(branches_id),
					branches_my: stripKeys(branches_my),
				},
				{
					onSuccess: () => {
						hasUserModified.current = false;
					},
				},
			);
		}
	}, [debouncedBaseInfo, debouncedUnifiedBranches, updateConfigs, stripKeys]);

	const handleSaveBranch = (branch: UnifiedBranch) => {
		hasUserModified.current = true;
		if (branchToEdit) {
			setUnifiedBranches(unifiedBranches.map((b) => (b._key === branch._key ? branch : b)));
		} else {
			setUnifiedBranches([...unifiedBranches, branch]);
		}
		setDialogOpen(false);
	};

	const handleDeleteBranch = (branch: UnifiedBranch) => {
		if (confirm(`Yakin ingin menghapus cabang ${branch.label}?`)) {
			hasUserModified.current = true;
			setUnifiedBranches((prev) => prev.filter((b) => b._key !== branch._key));
		}
	};

	return (
		<AdminLayout onOpenSecret={() => secretCode.setIsSecretModalOpen(true)} onLogout={handleLogout}>
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
				<div className="flex items-center gap-4 w-full">
					<div>
						<h1 className="text-3xl font-black text-slate-900 tracking-tight">Pengaturan</h1>
						<p className="text-slate-500 mt-1">Kelola konfigurasi landing page dan data cabang.</p>
					</div>
					{isPending && (
						<span className="text-sm font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full animate-pulse ml-auto">
							Menyimpan...
						</span>
					)}
				</div>
			</div>

			{isLoading ? (
				<div>Loading...</div>
			) : (
				<div className="space-y-10 mt-8">
					<BaseInfoSection
						baseInfo={baseInfo}
						onBaseInfoChange={setBaseInfo}
						onUserModified={() => {
							hasUserModified.current = true;
						}}
					/>

					<BranchTableSection
						unifiedBranches={unifiedBranches}
						countryFilter={countryFilter}
						setCountryFilter={setCountryFilter}
						onAddBranch={() => {
							setBranchToEdit(null);
							setDialogOpen(true);
						}}
						onEditBranch={(branch) => {
							setBranchToEdit(branch);
							setDialogOpen(true);
						}}
						onDeleteBranch={handleDeleteBranch}
					/>
				</div>
			)}

			<BranchDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				branchToEdit={branchToEdit}
				onSave={handleSaveBranch}
				duplicateValues={duplicateValues}
			/>

			<SecretCodeDialog
				isOpen={secretCode.isSecretModalOpen}
				onOpenChange={secretCode.setIsSecretModalOpen}
				tempSecretCode={secretCode.tempSecretCode}
				onSecretCodeChange={secretCode.setTempSecretCode}
				showSecret={secretCode.showSecretInModal}
				onToggleShow={() => secretCode.setShowSecretInModal(!secretCode.showSecretInModal)}
				isAutoRotate={secretCode.isAutoRotate}
				onToggleAutoRotate={() => secretCode.setIsAutoRotate(!secretCode.isAutoRotate)}
				onGenerate={secretCode.generateRandom}
				onSave={() =>
					secretCode.updateSecretMutation.mutate({
						code: secretCode.tempSecretCode,
						auto_rotate: secretCode.isAutoRotate,
					})
				}
				isSaving={secretCode.updateSecretMutation.isPending}
			/>
		</AdminLayout>
	);
}
