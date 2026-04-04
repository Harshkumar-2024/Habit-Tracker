import { YearStats } from "@/types/habit";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

interface YearlySummaryCardProps {
  yearStats: YearStats;
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
          stroke="hsl(var(--accent))" strokeWidth="6" fill="none" strokeLinecap="round"
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

const YearlySummaryCard = ({ yearStats }: YearlySummaryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-card rounded-2xl p-6 shadow-sm border border-border flex flex-col items-center gap-4"
    >
      <h3 className="font-display text-lg font-semibold self-start">Yearly Summary</h3>
      <CircularProgress percentage={yearStats.percentage} />
      <div className="text-center space-y-1">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{yearStats.totalCompleted}</span>
          {" / "}<span>{yearStats.totalPossible}</span> completions
        </p>
        {yearStats.bestMonth && (
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Trophy className="h-3 w-3 text-accent" />
            Best: <span className="font-semibold text-foreground">{yearStats.bestMonth}</span>
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default YearlySummaryCard;
