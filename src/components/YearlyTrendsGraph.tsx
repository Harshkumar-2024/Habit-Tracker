import { YearStats } from "@/types/habit";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

interface YearlyTrendsGraphProps {
  yearStats: YearStats;
}

const YearlyTrendsGraph = ({ yearStats }: YearlyTrendsGraphProps) => {
  const data = yearStats.months.map((m) => ({
    name: m.monthShort,
    percentage: m.percentage,
    completed: m.totalCompleted,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card rounded-2xl p-6 shadow-sm border border-border"
    >
      <h3 className="font-display text-lg font-semibold mb-4">Yearly Trends</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              unit="%"
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                fontSize: "13px",
              }}
              formatter={(value: number, name: string) =>
                name === "percentage" ? [`${value}%`, "Completion"] : [`${value}`, "Completed"]
              }
            />
            <Bar dataKey="percentage" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default YearlyTrendsGraph;
