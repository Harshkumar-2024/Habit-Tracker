import { motion } from "framer-motion";
import { ViewType } from "@/types/habit";

interface WeeklyStoryProps {
  percentage: number;
  viewLabel?: ViewType;
}

const WeeklyStory = ({ percentage, viewLabel = "week" }: WeeklyStoryProps) => {
  const periodName = viewLabel === "week" ? "week" : viewLabel === "month" ? "month" : "year";

  const getStory = () => {
    if (percentage === 0)
      return {
        emoji: "🔄",
        title: "Fresh Start Awaits",
        message: `Every expert was once a beginner. Start tracking this ${periodName} and build momentum!`,
        bg: "bg-habit-pink",
      };
    if (percentage < 30)
      return {
        emoji: "🌱",
        title: "Seeds of Change",
        message: `You've started planting habits this ${periodName}. Keep watering them and watch them grow!`,
        bg: "bg-habit-peach",
      };
    if (percentage < 60)
      return {
        emoji: "🚀",
        title: "Building Momentum",
        message: `Great progress this ${periodName} — now push to make it a lifestyle!`,
        bg: "bg-habit-lavender",
      };
    if (percentage < 90)
      return {
        emoji: "⚡",
        title: "Almost There!",
        message: `Incredible consistency this ${periodName}! You're in the top tier of habit builders.`,
        bg: "bg-habit-sky",
      };
    return {
      emoji: "🏆",
      title: "Perfect Discipline",
      message: `You've mastered this ${periodName}. This level of consistency is truly inspiring!`,
      bg: "bg-habit-green",
    };
  };

  const story = getStory();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`${story.bg} rounded-2xl p-6 shadow-sm`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{story.emoji}</span>
        <div>
          <h3 className="font-display text-base font-semibold">{story.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{story.message}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default WeeklyStory;
