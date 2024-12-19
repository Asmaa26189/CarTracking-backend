import mongoose, { Schema, model } from 'mongoose';
import { ICar } from './car';
import { IOwner } from './owner';

export interface ICarTracking {
  userId: mongoose.Schema.Types.ObjectId | IOwner;
  carId: mongoose.Schema.Types.ObjectId | ICar;
  notes: string;
  date: Date;
}

const CarTrackingSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  notes: { type: String, required: false },
  date: { type: Date, required: true, default: Date.now },
});


export default model<ICarTracking>('CarTracking', CarTrackingSchema);
