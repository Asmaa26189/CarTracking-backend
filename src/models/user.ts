import { Schema, model } from 'mongoose';

export interface IUser {
  name: string;
  email:string;
  type:string;
  password:string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  type: { type: String, required: true, default: 'Admin'},
  password: { type: String, required: true },
});

export default model<IUser>('User', UserSchema);
