import mongoose, { Schema, model } from 'mongoose';
import { ICar } from './car';
import { IOwner } from './owner';
import { IUser } from './user';

export interface ICarTracking {
  ownerId: mongoose.Schema.Types.ObjectId | IOwner;
  carId: mongoose.Schema.Types.ObjectId | ICar;
  userId: mongoose.Schema.Types.ObjectId | IUser;
  notes: string;
  date: Date;
}

const CarTrackingSchema: Schema = new Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  notes: { type: String, required: false },
  date: { type: Date, required: true, default: Date.now },
});


export default model<ICarTracking>('CarTracking', CarTrackingSchema);
