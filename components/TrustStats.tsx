import { UserGroupIcon, File01Icon, Building03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface TrustStat {
  value: string;
  label: string;
  description?: string;
  icon: typeof UserGroupIcon;
}

interface TrustStatsProps {
  totalUsers: number;
  totalExperiences: number;
  totalCompanies: number;
  className?: string;
}

export function TrustStats({ totalUsers, totalExperiences, totalCompanies, className }: TrustStatsProps) {
  const stats: TrustStat[] = [
    {
      value: `${totalUsers.toLocaleString()}+`,
      label: "Students",
      description: "sharing experiences",
      icon: UserGroupIcon,
    },
    {
      value: `${totalExperiences.toLocaleString()}+`,
      label: "Interview",
      description: "experiences",
      icon: File01Icon,
    },
    {
      value: `${totalCompanies.toLocaleString()}+`,
      label: "Companies",
      description: "covered",
      icon: Building03Icon,
    },
  ];

  return (
    <div className={`grid grid-cols-3 gap-1 sm:flex sm:items-center sm:divide-x sm:divide-border ${className ?? ""}`}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex min-w-0 flex-col items-center gap-2 px-1 text-center sm:flex-row sm:items-center sm:gap-3 sm:px-5 sm:text-left first:sm:pl-0 last:sm:pr-0"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 sm:size-11">
            <HugeiconsIcon
              icon={stat.icon}
              size={19}
              strokeWidth={1.8}
              className="text-primary sm:size-[22px]"
            />
          </div>

          <div className="min-w-0 leading-tight">
            <div className="text-base font-semibold text-primary sm:text-lg">{stat.value}</div>

            <div className="text-xs text-foreground/90 sm:text-sm">{stat.label}</div>

            {stat.description && <div className="hidden text-xs text-muted-foreground sm:block sm:text-sm">{stat.description}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
