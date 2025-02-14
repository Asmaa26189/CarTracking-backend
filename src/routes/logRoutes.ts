import express, { Request, Response } from "express";
import Log , { ILog } from "../models/log";

const router = express.Router();

// Get logs
router.get("/", async (_req: Request, res: Response) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving logs", error });
  }
});

export default router;
