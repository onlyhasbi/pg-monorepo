import { Input } from "@repo/ui/ui/input";
import { Label } from "@repo/ui/ui/label";
export interface BaseInfo {
	nasabah: number;
	cabang: { indonesia: number; malaysia: number; lainnya: number };
	negara: number;
}

interface BaseInfoSectionProps {
	baseInfo: BaseInfo;
	onBaseInfoChange: (info: BaseInfo) => void;
	onUserModified: () => void;
}

export function BaseInfoSection({
	baseInfo,
	onBaseInfoChange,
	onUserModified,
}: BaseInfoSectionProps) {
	return (
		<section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-2">
					<Label>Total Nasabah (Juta)</Label>
					<Input
						type="number"
						step="0.1"
						value={baseInfo.nasabah}
						onChange={(e) => {
							onUserModified();
							onBaseInfoChange({ ...baseInfo, nasabah: parseFloat(e.target.value) });
						}}
					/>
				</div>
				<div className="space-y-2">
					<Label>Total Cabang di Negara Lain</Label>
					<Input
						type="number"
						value={baseInfo.cabang.lainnya || 0}
						onChange={(e) => {
							onUserModified();
							onBaseInfoChange({
								...baseInfo,
								cabang: { ...baseInfo.cabang, lainnya: parseInt(e.target.value, 10) || 0 },
							});
						}}
					/>
				</div>
			</div>
		</section>
	);
}
