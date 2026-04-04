import { useState, useEffect, useCallback, useMemo } from "react";
import { Habit, DayStats, WeekStats, MonthStats, MonthWeekStats, YearStats, YearMonthStats, ViewType } from "@/types/habit";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  eachMonthOfInterval,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  addYears,
  subYears,
  getWeek,
  isToday,
  subDays,
  parseISO,
} from "date-fns";
import API from "../services/habitApi";

const STORAGE_KEY = "smart-habit-tracker-habits";

function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHabits(habits: Habit[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

function calculateStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;
  const sorted = [...completedDates].sort().reverse();
  const today = format(new Date(), "yyyy-MM-dd");
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;
  let streak = 1;
  for (let i = 0; i < sorted.length - 1; i++) {
    const current = parseISO(sorted[i]);
    const next = parseISO(sorted[i + 1]);
    const diff = (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24);
    if (Math.round(diff) === 1) {
      streak++;
    } else {
      break;
    }
  }
  return Math.max(streak, 1);
}

function buildDayStats(day: Date, habits: Habit[]): DayStats {
  const dateStr = format(day, "yyyy-MM-dd");
  const dayHabits = habits.map((habit) => ({
    habit,
    completed: habit.completedDates.includes(dateStr),
  }));
  const completedCount = dayHabits.filter((h) => h.completed).length;
  const totalCount = habits.length;
  return {
    date: dateStr,
    dayName: format(day, "EEEE"),
    dayShort: format(day, "EEE"),
    completedCount,
    totalCount,
    percentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
    habits: dayHabits,
  };
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]); // loadHabits() can be used here if you want to load from localStorage on init
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [currentMonthStart, setCurrentMonthStart] = useState(() =>
    startOfMonth(new Date())
  );
  const [currentYearStart, setCurrentYearStart] = useState(() =>
    startOfYear(new Date())
  );
  const [selectedView, setSelectedView] = useState<ViewType>("week");

  // Fetch habits from backend on mount
  useEffect(() => {
  API.get("/habits")
    .then((res) => {
      const formatted = res.data.map((h: any) => ({
        id: h._id,
        name: h.title,
        frequency: "daily",
        completedDates: h.completedDates || [],
        streak: calculateStreak(h.completedDates || []),
        createdAt: h.createdAt,
      }));

      setHabits(formatted);
    })
    .catch((err) => console.log("Habit fetch error:", err));
}, []);

  

  // CRUD operations
  const addHabit = useCallback(async (name: string) => {
  try {
    const res = await API.post("/habits", {
      title: name,
    });

    const newHabit: Habit = {
      id: res.data._id,
      name: res.data.title,
      frequency: "daily",
      completedDates: res.data.completedDates || [],
      streak: calculateStreak(res.data.completedDates || []),
      createdAt: res.data.createdAt,
    };

    setHabits((prev) => [...prev, newHabit]);
  } catch (error) {
    console.log("Add habit error:", error);
  }
}, []);

// You can expand it to call backend if needed.
  const editHabit = useCallback(async (id: string, name: string) => {
  try {
    await API.patch(`/habits/${id}`, {
      title: name,
    });

    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, name } : h))
    );
  } catch (error) {
    console.log("Edit habit error:", error);
  }
}, []);

// You can expand it to call backend if needed.
  const deleteHabit = useCallback(async (id: string) => {
  try {
    await API.delete(`/habits/${id}`);
    setHabits((prev) => prev.filter((h) => h.id !== id));
  } catch (error) {
    console.log("Delete habit error:", error);
  }
}, []);

  // Toggle completion for a specific date
 const toggleHabitCompletion = useCallback(
  async (habitId: string, date: string) => {
    try {
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) return;

      const updatedDates = habit.completedDates.includes(date)
        ? habit.completedDates.filter((d) => d !== date)
        : [...habit.completedDates, date];

      await API.patch(`/habits/${habitId}`, {
        completedDates: updatedDates,
      });

      setHabits((prev) =>
        prev.map((h) =>
          h.id === habitId
            ? {
                ...h,
                completedDates: updatedDates,
                streak: calculateStreak(updatedDates),
              }
            : h
        )
      );
    } catch (error) {
      console.log("Toggle habit error:", error);
    }
  },
  [habits]
);

  // WEEK
  const weekDays = useMemo(() => {
    const end = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: currentWeekStart, end });
  }, [currentWeekStart]);

  const weekStats: WeekStats = useMemo(() => {
    let totalCompleted = 0;
    let totalPossible = 0;
    const days: DayStats[] = weekDays.map((day) => {
      const ds = buildDayStats(day, habits);
      totalCompleted += ds.completedCount;
      totalPossible += ds.totalCount;
      return ds;
    });
    return {
      totalCompleted,
      totalPossible,
      percentage: totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0,
      days,
    };
  }, [weekDays, habits]);

  // MONTH
  const monthStats: MonthStats = useMemo(() => {
    const monthEnd = endOfMonth(currentMonthStart);
    const allDays = eachDayOfInterval({ start: currentMonthStart, end: monthEnd });

    let totalCompleted = 0;
    let totalPossible = 0;
    const days: DayStats[] = allDays.map((day) => {
      const ds = buildDayStats(day, habits);
      totalCompleted += ds.completedCount;
      totalPossible += ds.totalCount;
      return ds;
    });

    // Group by week number
    const weekMap = new Map<number, { completed: number; possible: number }>();
    allDays.forEach((day, i) => {
      const wk = getWeek(day, { weekStartsOn: 1 });
      const entry = weekMap.get(wk) || { completed: 0, possible: 0 };
      entry.completed += days[i].completedCount;
      entry.possible += days[i].totalCount;
      weekMap.set(wk, entry);
    });

    let weekIndex = 1;
    const weeks: MonthWeekStats[] = [];
    weekMap.forEach((val) => {
      weeks.push({
        label: `Week ${weekIndex}`,
        totalCompleted: val.completed,
        totalPossible: val.possible,
        percentage: val.possible > 0 ? Math.round((val.completed / val.possible) * 100) : 0,
      });
      weekIndex++;
    });

    const avgStreak = habits.length > 0
      ? Math.round(habits.reduce((s, h) => s + h.streak, 0) / habits.length)
      : 0;

    return {
      totalCompleted,
      totalPossible,
      percentage: totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0,
      days,
      weeks,
      averageStreak: avgStreak,
    };
  }, [currentMonthStart, habits]);

  // YEAR
  const yearStats: YearStats = useMemo(() => {
    const yearEnd = endOfYear(currentYearStart);
    const allMonths = eachMonthOfInterval({ start: currentYearStart, end: yearEnd });

    let totalCompleted = 0;
    let totalPossible = 0;
    let bestMonth = "";
    let bestPct = -1;

    const months: YearMonthStats[] = allMonths.map((monthStart) => {
      const mEnd = endOfMonth(monthStart);
      const mDays = eachDayOfInterval({ start: monthStart, end: mEnd });
      let mc = 0;
      let mp = 0;
      mDays.forEach((day) => {
        const dateStr = format(day, "yyyy-MM-dd");
        habits.forEach((h) => {
          mp++;
          if (h.completedDates.includes(dateStr)) mc++;
        });
      });
      totalCompleted += mc;
      totalPossible += mp;
      const pct = mp > 0 ? Math.round((mc / mp) * 100) : 0;
      if (pct > bestPct) {
        bestPct = pct;
        bestMonth = format(monthStart, "MMMM");
      }
      return {
        label: format(monthStart, "MMMM"),
        monthShort: format(monthStart, "MMM"),
        totalCompleted: mc,
        totalPossible: mp,
        percentage: pct,
      };
    });

    return {
      totalCompleted,
      totalPossible,
      percentage: totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0,
      months,
      bestMonth,
    };
  }, [currentYearStart, habits]);

  // Navigation
  const goToPreviousWeek = useCallback(() => setCurrentWeekStart((p) => subWeeks(p, 1)), []);
  const goToNextWeek = useCallback(() => setCurrentWeekStart((p) => addWeeks(p, 1)), []);
  const goToCurrentWeek = useCallback(() => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 })), []);

  const goToPreviousMonth = useCallback(() => setCurrentMonthStart((p) => subMonths(p, 1)), []);
  const goToNextMonth = useCallback(() => setCurrentMonthStart((p) => addMonths(p, 1)), []);
  const goToCurrentMonth = useCallback(() => setCurrentMonthStart(startOfMonth(new Date())), []);

  const goToPreviousYear = useCallback(() => setCurrentYearStart((p) => subYears(p, 1)), []);
  const goToNextYear = useCallback(() => setCurrentYearStart((p) => addYears(p, 1)), []);
  const goToCurrentYear = useCallback(() => setCurrentYearStart(startOfYear(new Date())), []);

  const weekLabel = useMemo(() => {
    const end = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    return `${format(currentWeekStart, "MMM d")} – ${format(end, "MMM d")}`;
  }, [currentWeekStart]);

  const monthLabel = useMemo(() => format(currentMonthStart, "MMMM yyyy"), [currentMonthStart]);
  const yearLabel = useMemo(() => format(currentYearStart, "yyyy"), [currentYearStart]);

  const todayStr = format(new Date(), "yyyy-MM-dd");

  return {
    habits,
    addHabit,
    editHabit,
    deleteHabit,
    toggleHabitCompletion,
    selectedView,
    setSelectedView,
    weekStats,
    monthStats,
    yearStats,
    weekLabel,
    monthLabel,
    yearLabel,
    currentWeekStart,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    goToPreviousYear,
    goToNextYear,
    goToCurrentYear,
    todayStr,
  };
}
