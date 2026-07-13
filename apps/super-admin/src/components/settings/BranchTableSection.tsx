import { Button } from "@repo/ui/ui/button";
import { DataTable } from "@repo/ui/ui/data-table";
import { Plus } from "lucide-react";
import { type UnifiedBranch, useBranchColumns } from "../settings-branch-table/columns";

interface BranchTableSectionProps {
	unifiedBranches: UnifiedBranch[];
	countryFilter: "id" | "my";
	setCountryFilter: (val: "id" | "my") => void;
	onAddBranch: () => void;
	onEditBranch: (branch: UnifiedBranch) => void;
	onDeleteBranch: (branch: UnifiedBranch) => void;
}

export function BranchTableSection({
	unifiedBranches,
	countryFilter,
	setCountryFilter,
	onAddBranch,
	onEditBranch,
	onDeleteBranch,
}: BranchTableSectionProps) {
	const columns = useBranchColumns({
		onEdit: onEditBranch,
		onDelete: onDeleteBranch,
	});

	return (
		<section className="bg-white rounded-2xl shadow-sm border border-slate-200">
			<DataTable
				columns={columns}
				data={unifiedBranches.filter((b) => b.country === countryFilter)}
				enableSearch
				enablePagination
				defaultPageSize={10}
				actionElement={
					<div className="flex flex-col sm:flex-row items-center gap-4">
						<div className="flex items-center gap-4 sm:mr-2">
							<label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900">
								<input
									type="radio"
									name="countryFilter"
									value="id"
									checked={countryFilter === "id"}
									onChange={() => setCountryFilter("id")}
									className="w-4 h-4 text-primary focus:ring-primary border-slate-300 cursor-pointer"
								/>
								Indonesia
							</label>
							<label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900">
								<input
									type="radio"
									name="countryFilter"
									value="my"
									checked={countryFilter === "my"}
									onChange={() => setCountryFilter("my")}
									className="w-4 h-4 text-primary focus:ring-primary border-slate-300 cursor-pointer"
								/>
								Malaysia
							</label>
						</div>

						<Button onClick={onAddBranch} className="gap-2 w-full sm:w-auto">
							<Plus className="h-4 w-4" />
							Tambah Cabang
						</Button>
					</div>
				}
			/>
		</section>
	);
}
