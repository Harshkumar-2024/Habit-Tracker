import { useHabits } from "@/hooks/useHabits";
import PeriodSelector from "@/components/PeriodSelector";
import WeeklyTrendsGraph from "@/components/WeeklyTrendsGraph";
import MonthlyTrendsGraph from "@/components/MonthlyTrendsGraph";
import YearlyTrendsGraph from "@/components/YearlyTrendsGraph";
import WeeklySummaryCard from "@/components/WeeklySummaryCard";
import MonthlySummaryCard from "@/components/MonthlySummaryCard";
import YearlySummaryCard from "@/components/YearlySummaryCard";
import WeeklyStory from "@/components/WeeklyStory";
import DayCard from "@/components/DayCard";
import MonthDayGrid from "@/components/MonthDayGrid";
import YearMonthGrid from "@/components/YearMonthGrid";
import AddHabitDialog from "@/components/AddHabitDialog";
import HabitList from "@/components/HabitList";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Sparkles } from "lucide-react";
import { ViewType } from "@/types/habit";
import { AnimatePresence, motion } from "framer-motion";

const VIEW_OPTIONS: { value: ViewType; label: string }[] = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

const Index = () => {
  const {
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
  } = useHabits();

  const logToday = () => {
    habits.forEach((habit) => {
      if (!habit.completedDates.includes(todayStr)) {
        toggleHabitCompletion(habit.id, todayStr);
      }
    });
  };

  // Simple logout function that clears localStorage and redirects to login page
  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

// simle login in case problem remove it
const login = () => {
  window.location.href = "http://localhost:5000/auth/google";
};


  const periodLabel = selectedView === "week" ? weekLabel : selectedView === "month" ? monthLabel : yearLabel;
  const onPrev = selectedView === "week" ? goToPreviousWeek : selectedView === "month" ? goToPreviousMonth : goToPreviousYear;
  const onNext = selectedView === "week" ? goToNextWeek : selectedView === "month" ? goToNextMonth : goToNextYear;
  const onToday = selectedView === "week" ? goToCurrentWeek : selectedView === "month" ? goToCurrentMonth : goToCurrentYear;

  const currentPercentage = selectedView === "week" ? weekStats.percentage : selectedView === "month" ? monthStats.percentage : yearStats.percentage;
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Habit Tracker
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Build consistency, one day at a time.
            </p>
          </div>

      {/* Period Selector + Logout */}
          <div className="flex items-center gap-2">
  <PeriodSelector
    label={periodLabel}
    view={selectedView}
    onPrev={onPrev}
    onNext={onNext}
    onToday={onToday}
  />

 <Button
  size="sm"
  variant="outline"
  className="rounded-full"
  onClick={isLoggedIn ? logout : login}
>
  {isLoggedIn ? "Logout" : "Login"}
</Button>
</div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1 bg-muted rounded-full p-1">
            {VIEW_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                size="sm"
                className="rounded-full text-xs"
                variant={selectedView === opt.value ? "default" : "ghost"}
                onClick={() => setSelectedView(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
          <div className="flex gap-2 ml-auto">
            <AddHabitDialog onAdd={addHabit} />
            <Button
              size="sm"
              variant="outline"
              className="rounded-full gap-1.5"
              onClick={logToday}
              disabled={habits.length === 0}
            >
              <CalendarCheck className="h-4 w-4" />
              Log Today
            </Button>
          </div>
        </div>

        {/* Trends + Summary Row */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2">
              {selectedView === "week" && <WeeklyTrendsGraph weekStats={weekStats} />}
              {selectedView === "month" && <MonthlyTrendsGraph monthStats={monthStats} />}
              {selectedView === "year" && <YearlyTrendsGraph yearStats={yearStats} />}
            </div>
            {selectedView === "week" && <WeeklySummaryCard weekStats={weekStats} />}
            {selectedView === "month" && <MonthlySummaryCard monthStats={monthStats} />}
            {selectedView === "year" && <YearlySummaryCard yearStats={yearStats} />}
          </motion.div>
        </AnimatePresence>

        {/* Story */}
        <WeeklyStory percentage={currentPercentage} viewLabel={selectedView} />

        {/* Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`cards-${selectedView}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {selectedView === "week" && (
              <div>
                <h2 className="font-display text-xl font-semibold mb-4">Daily Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                  {weekStats.days.map((day, i) => (
                    <DayCard key={day.date} day={day} onToggleHabit={toggleHabitCompletion} index={i} />
                  ))}
                </div>
              </div>
            )}
            {selectedView === "month" && (
              <MonthDayGrid monthStats={monthStats} onToggleHabit={toggleHabitCompletion} />
            )}
            {selectedView === "year" && <YearMonthGrid yearStats={yearStats} />}
          </motion.div>
        </AnimatePresence>

        {/* Habit List */}
        <HabitList habits={habits} onEdit={editHabit} onDelete={deleteHabit} />
      </div>
    </div>
  );
};

export default Index;
