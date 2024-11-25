import mongoose, { Schema, model } from 'mongoose';

export interface IOwner {
  name: string;
  phone: string;
}

const OwnerSchema: Schema = new Schema({
  name: {type: String,required: true},
  phone: {type: String,required: true},
});


export default model<IOwner>('Owner', OwnerSchema);
