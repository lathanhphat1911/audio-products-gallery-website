import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  change,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {change && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              <span
                className={cn(
                  change.value > 0 ? "text-green-500" : "text-red-500"
                )}
              >
                {change.value > 0 ? "+" : ""}
                {change.value}%
              </span>{" "}
              {change.label}
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </div>
  );
}