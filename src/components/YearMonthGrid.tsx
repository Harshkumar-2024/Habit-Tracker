import { YearStats } from "@/types/habit";
import { motion } from "framer-motion";

interface YearMonthGridProps {
  yearStats: YearStats;
}

const COLORS = [
  "bg-habit-pink", "bg-habit-green", "bg-habit-peach", "bg-habit-lavender",
  "bg-habit-sky", "bg-habit-pink", "bg-habit-green", "bg-habit-peach",
  "bg-habit-lavender", "bg-habit-sky", "bg-habit-pink", "bg-habit-green",
];

const YearMonthGrid = ({ yearStats }: YearMonthGridProps) => {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-4">Monthly Overview</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {yearStats.months.map((month, i) => {
          const isBest = month.label === yearStats.bestMonth && month.percentage > 0;
          return (
            <motion.div
              key={month.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 * i }}
              className={`${COLORS[i]} rounded-2xl p-4 border ${
                isBest ? "border-accent ring-2 ring-accent/30" : "border-border/50"
              } flex flex-col items-center gap-3`}
            >
              <p className="font-display text-sm font-semibold">{month.monthShort}</p>

              {/* Circle */}
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-14 h-14 -rotate-90">
                  <circle cx="28" cy="28" r="22" stroke="hsl(var(--border))" strokeWidth="4" fill="none" />
                  <circle
                    cx="28" cy="28" r="22"
                    stroke="hsl(var(--secondary))" strokeWidth="4" fill="none"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 22}
                    strokeDashoffset={2 * Math.PI * 22 - (month.percentage / 100) * 2 * Math.PI * 22}
                  />
                </svg>
                <span className="absolute text-[11px] font-bold">{month.percentage}%</span>
              </div>

              <p className="text-[10px] text-muted-foreground">
                {month.totalCompleted} done
              </p>
              {isBest && (
                <span className="text-[9px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full font-medium">
                  🏆 Best
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default YearMonthGrid;
