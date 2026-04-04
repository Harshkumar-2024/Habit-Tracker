import { DayStats } from "@/types/habit";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { format, parseISO, isToday } from "date-fns";
import { useState } from "react";

interface DayCardProps {
  day: DayStats;
  onToggleHabit: (habitId: string, date: string) => void;
  index: number;
}

const CARD_COLORS = [
  "bg-habit-pink",
  "bg-habit-green",
  "bg-habit-peach",
  "bg-habit-lavender",
  "bg-habit-sky",
  "bg-habit-pink",
  "bg-habit-green",
];

const MiniProgress = ({ percentage }: { percentage: number }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-11 h-11 flex items-center justify-center">
      <svg className="w-11 h-11 -rotate-90">
        <circle cx="22" cy="22" r={radius} stroke="hsl(var(--border))" strokeWidth="3" fill="none" />
        <motion.circle
          cx="22"
          cy="22"
          r={radius}
          stroke="hsl(var(--secondary))"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          strokeDasharray={circumference}
        />
      </svg>
      <span className="absolute text-[10px] font-semibold">{percentage}%</span>
    </div>
  );
};

const DayCard = ({ day, onToggleHabit, index }: DayCardProps) => {
  const [activeTab, setActiveTab] = useState<"habits" | "tasks" | "journal">("habits");
  const dateObj = parseISO(day.date);
  const today = isToday(dateObj);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      className={`rounded-2xl p-4 shadow-sm border ${
        today ? "border-primary/40 ring-2 ring-primary/20" : "border-border"
      } ${CARD_COLORS[index]} flex flex-col gap-3`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{day.dayName}</p>
          <p className="font-display text-sm font-semibold">
            {format(dateObj, "MMM d")}
            {today && (
              <span className="ml-1.5 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                Today
              </span>
            )}
          </p>
        </div>
        <MiniProgress percentage={day.percentage} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1">
        {(["habits"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-[10px] px-2 py-1 rounded-full capitalize transition-colors ${
              activeTab === tab
                ? "bg-foreground/10 font-medium"
                : "text-muted-foreground hover:bg-foreground/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-[60px]">
        {activeTab === "habits" && (
          <div className="space-y-1.5">
            {day.habits.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No habits added yet</p>
            ) : (
              day.habits.map(({ habit, completed }) => (
                <button
                  key={habit.id}
                  onClick={() => onToggleHabit(habit.id, day.date)}
                  className="flex items-center gap-2 w-full text-left group"
                >
                  <div
                    className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-colors ${
                      completed
                        ? "bg-secondary border-secondary"
                        : "border-muted-foreground/30 group-hover:border-secondary"
                    }`}
                  >
                    {completed && <Check className="h-3 w-3 text-secondary-foreground" />}
                  </div>
                  <span
                    className={`text-xs transition-all ${
                      completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {habit.name}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
        {/* {activeTab === "tasks" && (
          <p className="text-xs text-muted-foreground italic">Tasks coming soon ✨</p>
        )}
        {activeTab === "journal" && (
          <p className="text-xs text-muted-foreground italic">Journal coming soon 📝</p>
        )} */}
      </div>
    </motion.div>
  );
};

export default DayCard;
