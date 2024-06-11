import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  id: {
    type: Number,
    required: true,
    unique: true,
    auto: true,
  } | number;
  email: string;
  username?: string;
  password: string;
  city?:string
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String },
  password: { type: String, required: true },
  city:{ type: String }
});

export default mongoose.model<IUser>('User', UserSchema);
