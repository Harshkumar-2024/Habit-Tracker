import { Habit } from "@/types/habit";
import { Flame, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface HabitListProps {
  habits: Habit[];
  onEdit: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

const HabitList = ({ habits, onEdit, onDelete }: HabitListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const startEdit = (habit: Habit) => {
    setEditingId(habit.id);
    setEditName(habit.name);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      onEdit(editingId, editName.trim());
      setEditingId(null);
    }
  };

  if (habits.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-card rounded-2xl p-6 shadow-sm border border-border"
    >
      <h3 className="font-display text-lg font-semibold mb-3">Your Habits</h3>
      <div className="space-y-2">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="flex items-center justify-between gap-2 py-2 px-3 rounded-xl bg-muted/50"
          >
            {editingId === habit.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveEdit();
                }}
                className="flex gap-2 flex-1"
              >
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-8 rounded-lg text-sm"
                  autoFocus
                />
                <Button type="submit" size="sm" className="rounded-lg h-8">
                  Save
                </Button>
              </form>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{habit.name}</span>
                  {habit.streak > 1 && (
                    <span className="flex items-center gap-0.5 text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full">
                      <Flame className="h-3 w-3" />
                      {habit.streak}
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg"
                    onClick={() => startEdit(habit)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg text-destructive"
                    onClick={() => onDelete(habit.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default HabitList;
