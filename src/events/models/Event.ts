import mongoose, {Document, Schema} from "mongoose";

export interface IEvent {
    id: number;
    name: string;
    description: string;
    date: Date;
    location: string;
    duration: string;
}

const EventSchema: Schema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    duration: { type: String, required: true },
});

const Event = mongoose.model<IEvent>('Event', EventSchema);

export default Event;