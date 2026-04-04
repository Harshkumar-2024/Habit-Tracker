import { Router, Response } from "express";
import Habit from "../models/Habit";
import authMiddleware, { AuthRequest } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const habits = await Habit.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json(habits);
});

router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { title } = req.body;

  const habit = await Habit.create({
    userId: req.userId,
    title,
  });

  res.json(habit);
});

router.patch("/:id", authMiddleware, async (req: AuthRequest, res) => {
  const habit = await Habit.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.userId,
    },
    req.body,
    { new: true }
  );

  res.json(habit);
});

export default router;