import { Schema, model, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  shortDescription: string;
  date: string;        // YYYY-MM-DD
  startTime: string;   // HH:mm
  endTime: string;     // HH:mm
  startsAt: Date;      // computed from date+startTime
  endsAt: Date;
  capacity: number;
  attendeesCount: number;  // current number of mentors joined
  campus: string;
  location: string;
  status: 'published' | 'cancelled';
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    startsAt: { type: Date, required: true, index: true },
    endsAt: { type: Date, required: true },
    capacity: { type: Number, required: true, min: 1 },
    attendeesCount: { type: Number, required: true, default: 0, min: 0 },
    campus: { type: String, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ['published', 'cancelled'], default: 'published', index: true },
    createdBy: { type: String },
  },
  { timestamps: true }
);

EventSchema.index({ status: 1, startsAt: 1 });

export default model<IEvent>('Event', EventSchema);
