import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ViewType } from "@/types/habit";

interface PeriodSelectorProps {
  label: string;
  view: ViewType;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

const PeriodSelector = ({ label, view, onPrev, onNext, onToday }: PeriodSelectorProps) => {
  const todayLabel = view === "week" ? "Today" : view === "month" ? "This Month" : "This Year";

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={onPrev} className="rounded-full">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <motion.span
        key={label}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm font-medium min-w-[140px] text-center"
      >
        {label}
      </motion.span>
      <Button variant="ghost" size="icon" onClick={onNext} className="rounded-full">
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={onToday} className="ml-1 rounded-full text-xs">
        <CalendarDays className="h-3 w-3 mr-1" />
        {todayLabel}
      </Button>
    </div>
  );
};

export default PeriodSelector;
