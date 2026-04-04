import { MonthStats } from "@/types/habit";
import { motion } from "framer-motion";

interface MonthDayGridProps {
  monthStats: MonthStats;
  onToggleHabit: (habitId: string, date: string) => void;
}

const COLORS = [
  "bg-habit-pink",
  "bg-habit-green",
  "bg-habit-peach",
  "bg-habit-lavender",
  "bg-habit-sky",
];

const MonthDayGrid = ({ monthStats }: MonthDayGridProps) => {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-4">Weekly Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {monthStats.weeks.map((week, i) => {
          const colorClass = COLORS[i % COLORS.length];
          const circumference = 2 * Math.PI * 28;
          const offset = circumference - (week.percentage / 100) * circumference;

          return (
            <motion.div
              key={week.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`${colorClass} rounded-2xl p-5 border border-border/50 shadow-sm flex flex-col items-center gap-3`}
            >
              <span className="font-display text-sm font-semibold">{week.label}</span>

              {/* Circular progress */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-16 h-16 -rotate-90">
                  <circle
                    cx="32" cy="32" r="28"
                    stroke="hsl(var(--border))"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="32" cy="32" r="28"
                    stroke="hsl(var(--secondary))"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                  />
                </svg>
                <span className="absolute text-sm font-bold">{week.percentage}%</span>
              </div>

              <div className="text-center space-y-0.5">
                <p className="text-xs text-muted-foreground">
                  {week.totalCompleted} / {week.totalPossible} completed
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthDayGrid;
