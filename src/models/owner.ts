import mongoose, { Schema, model } from 'mongoose';

export interface IOwner {
  name: string;
  phone: string;
  notes: string;
}

const OwnerSchema: Schema = new Schema({
  name: {type: String,required: true},
  phone: {type: String,required: true},
  notes: {type: String },
});


export default model<IOwner>('Owner', OwnerSchema);
