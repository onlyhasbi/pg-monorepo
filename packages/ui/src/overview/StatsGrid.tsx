import { MessageCircle, UserPlus, Users, type LucideIcon } from "lucide-react";
import { cn } from "@repo/lib/utils";
import { Card, CardContent } from "@repo/ui/ui/card";

interface StatItem {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  iconColor: string;
  accent: string;
}

interface StatsGridProps {
  totalPengunjung: number;
  totalPendaftar: number;
  totalKlikWhatsapp: number;
}

export function StatsGrid({
  totalPengunjung,
  totalPendaftar,
  totalKlikWhatsapp,
}: StatsGridProps) {
  const stats: StatItem[] = [
    {
      label: "Total Pengunjung",
      value: totalPengunjung,
      icon: Users,
      color: "bg-red-50 text-red-600",
      iconColor: "text-red-600",
      accent: "border-red-100",
    },
    {
      label: "Total Pendaftar",
      value: totalPendaftar,
      icon: UserPlus,
      color: "bg-rose-50 text-rose-600",
      iconColor: "text-rose-600",
      accent: "border-rose-100",
    },
    {
      label: "Klik WhatsApp",
      value: totalKlikWhatsapp,
      icon: MessageCircle,
      color: "bg-emerald-50 text-emerald-600",
      iconColor: "text-emerald-600",
      accent: "border-emerald-100",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5 sm:gap-5">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className={cn(
            "relative rounded-2xl shadow-sm border p-3.5 sm:p-6 overflow-hidden group hover:shadow-md transition-all duration-300",
            stat.accent,
          )}
        >
          <stat.icon
            className={cn(
              "absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 w-16 h-16 sm:w-24 sm:h-24 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-300",
              stat.iconColor,
            )}
          />

          <CardContent className="p-0 relative z-10">
            <p className="text-2xl sm:text-4xl font-bold text-slate-800 tracking-tight">
              {(stat.value ?? 0).toLocaleString()}
            </p>
            <p className="text-slate-500 text-[10px] sm:text-sm font-medium mt-1 sm:mt-1.5 leading-tight">
              {stat.label}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
