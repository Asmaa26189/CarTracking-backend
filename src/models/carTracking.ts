import mongoose, { Schema, model } from 'mongoose';
import { ICar } from './car';
import { IUser } from './user';

export interface ICarTracking {
  carId: mongoose.Schema.Types.ObjectId | ICar;
  userId: mongoose.Schema.Types.ObjectId | IUser;
  notes: string;
  date: Date;
}

const CarTrackingSchema: Schema = new Schema({
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  notes: { type: String, required: false },
  date: { type: Date, required: true, default: Date.now },
});


export default model<ICarTracking>('CarTracking', CarTrackingSchema);
