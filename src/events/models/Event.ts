// models/Event.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
    name: string;
    description: string;
    date: Date;
    location: string;
    duration: string;
}

const EventSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    duration: { type: String, required: true }
});

export const Event = mongoose.model<IEvent>('Event', EventSchema);
