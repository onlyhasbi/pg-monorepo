import type { PrintingCostRow } from "@repo/constant/products";

interface PrintingCostTableProps {
  title: string;
  columnHeader: string;
  accentColor: string;
  data: PrintingCostRow[];
}

export function PrintingCostTable({
  title,
  columnHeader,
  accentColor,
  data,
}: PrintingCostTableProps) {
  return (
    <div>
      <h4 className="font-bold text-slate-800 mb-3 text-lg flex items-center gap-2">
        <div className={`w-1.5 h-6 ${accentColor} rounded-full`}></div>
        {title}
      </h4>
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">{columnHeader}</th>
              <th className="px-4 py-3 font-semibold text-right">
                Biaya Cetak
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-700">
                  {item.label}
                </td>
                <td className="px-4 py-3 text-right text-slate-600 font-medium whitespace-nowrap">
                  Rp {item.cost.toLocaleString("id-ID")}{" "}
                  <span className="text-xs font-normal text-slate-400">
                    / pcs
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
