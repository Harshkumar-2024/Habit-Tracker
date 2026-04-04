import mongoose, { Document, Schema } from "mongoose";

export interface IHabit extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  completedDates: string[];
  createdAt: Date;
}

const habitSchema = new Schema<IHabit>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  completedDates: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IHabit>("Habit", habitSchema);