import mongoose, { Schema, model } from 'mongoose';
import { IOwner } from './owner';


export interface ICar {
  code: string;
  type: string;
  description: string;
  ownerId: mongoose.Schema.Types.ObjectId | IOwner;
  date: Date;
}

// Define the Car schema
const CarSchema: Schema = new Schema({
  code: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: false },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
  date: { type: Date, required: true, default: Date.now },
});

export default model<ICar>('Car', CarSchema);
