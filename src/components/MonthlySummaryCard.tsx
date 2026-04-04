import { MonthStats } from "@/types/habit";
import { motion } from "framer-motion";

interface MonthlySummaryCardProps {
  monthStats: MonthStats;
}

const CircularProgress = ({ percentage }: { percentage: number }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="w-24 h-24 -rotate-90">
        <circle cx="48" cy="48" r={radius} stroke="hsl(var(--muted))" strokeWidth="6" fill="none" />
        <motion.circle
          cx="48" cy="48" r={radius}
          stroke="hsl(var(--secondary))" strokeWidth="6" fill="none" strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeDasharray={circumference}
        />
      </svg>
      <span className="absolute font-display text-lg font-bold">{percentage}%</span>
    </div>
  );
};

const MonthlySummaryCard = ({ monthStats }: MonthlySummaryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-card rounded-2xl p-6 shadow-sm border border-border flex flex-col items-center gap-4"
    >
      <h3 className="font-display text-lg font-semibold self-start">Monthly Summary</h3>
      <CircularProgress percentage={monthStats.percentage} />
      <div className="text-center space-y-1">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{monthStats.totalCompleted}</span>
          {" / "}<span>{monthStats.totalPossible}</span> completions
        </p>
        <p className="text-xs text-muted-foreground">
          Avg streak: <span className="font-semibold text-foreground">{monthStats.averageStreak}</span> days
        </p>
      </div>
    </motion.div>
  );
};

export default MonthlySummaryCard;
