import Log, { ILog } from "../models/log";
import mongoose from "mongoose";

export const saveLog = async (type: string, message: string, userType = "Guest",
    userId: mongoose.Schema.Types.ObjectId, path?: string): Promise<void> => {
    try {
        const log: ILog = new Log({ type, message, userType, userId, path });
        await log.save();
        console.log("Log saved successfully:", log);
    } catch (error) {
        console.error(" Error saving log:", error);
    }
};