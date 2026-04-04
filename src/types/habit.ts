export type ViewType = "week" | "month" | "year";

export interface Habit {
  id: string;
  name: string;
  frequency: "daily";
  completedDates: string[]; // ISO date strings "YYYY-MM-DD"
  streak: number;
  createdAt: string;
}

export interface DayStats {
  date: string;
  dayName: string;
  dayShort: string;
  completedCount: number;
  totalCount: number;
  percentage: number;
  habits: { habit: Habit; completed: boolean }[];
}

export interface WeekStats {
  totalCompleted: number;
  totalPossible: number;
  percentage: number;
  days: DayStats[];
}

export interface MonthWeekStats {
  label: string;
  totalCompleted: number;
  totalPossible: number;
  percentage: number;
}

export interface MonthStats {
  totalCompleted: number;
  totalPossible: number;
  percentage: number;
  days: DayStats[];
  weeks: MonthWeekStats[];
  averageStreak: number;
}

export interface YearMonthStats {
  label: string;
  monthShort: string;
  totalCompleted: number;
  totalPossible: number;
  percentage: number;
}

export interface YearStats {
  totalCompleted: number;
  totalPossible: number;
  percentage: number;
  months: YearMonthStats[];
  bestMonth: string;
}
