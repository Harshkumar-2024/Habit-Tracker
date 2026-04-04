import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User";

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req: Request, res: Response) => {
  try {
    const { token }: { token: string } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      ...(process.env.GOOGLE_CLIENT_ID && {
        audience: process.env.GOOGLE_CLIENT_ID,
      }),
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(400).json({ message: "Invalid Google token" });
    }

    let user = await User.findOne({ email: payload.email });

    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      });
    }

    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.json({ token: jwtToken, user });
  } catch (error) {
    res.status(500).json({ message: "Google login failed" });
  }
});

export default router;