import mongoose, { Document, Schema } from "mongoose";
import { IUser } from './user';

export interface ILog extends Document {
    type: string; 
    message: string;
    userType?: string;
    userId: mongoose.Schema.Types.ObjectId | IUser;
    path?: string;
    timestamp: Date;
  }

const LogSchema = new Schema<ILog>({
    type: { type: String, required: true },
    message: { type: String, required: true },
    userType: { type: String, default: "Guest" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    path: { type: String },
    timestamp: { type: Date, default: Date.now },
  });
  
export default mongoose.model<ILog>("Log", LogSchema);
  