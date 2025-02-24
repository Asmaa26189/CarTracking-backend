import mongoose, { Schema, model } from 'mongoose';
import { IOwner } from './owner';

export interface ICar {
  code: string;
  type: string;
  description: string;
  ownerId: mongoose.Schema.Types.ObjectId | IOwner;
  date: Date;
  brand: string;
  model: string;
  year: number;
  color: string;
  engineNumber: string;
  chassisNumber: string;
  fuel: string;
  mileage: number;
  // lastMaintenance: Date;
  insurance: string;
  
}

// Define the Car schema
const CarSchema: Schema = new Schema({
  code: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: false },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
  date: { type: Date, required: true, default: Date.now },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  color: { type: String, required: true },
  engineNumber: { type: String, required: true },
  chassisNumber: { type: String, required: true },
  fuel: { type: String, required: true },
  mileage: { type: Number, required: true },
  // lastMaintenance: { type: Date, required: true ,default: Date.now },
  insurance: { type: String, required: true },
});

export default model<ICar>('Car', CarSchema);
