import Log, { ILog } from "../models/log";
import mongoose from "mongoose";
import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Router, Request, Response, NextFunction } from 'express';

dotenv.config();

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
export const getTokenFromHeader = (req: Request): any | null => {
    const token = req.headers.authorization?.split(' ')[1]; // Get token after 'Bearer'

    if (!token) {
        return null; // No token provided
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET as Secret);
        return decoded; // Return decoded payload
    } catch (err) {
        console.error("Error verifying token:", err);
        return null; // Invalid token
    }
};