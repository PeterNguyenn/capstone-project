import { Schema, model, Document, Types } from 'mongoose';

export interface IRegistration extends Document {
  event: Types.ObjectId;
  userId: string;     // mentor id (from header for now)
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>(
  {
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    userId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

// Prevent joining the same event twice
RegistrationSchema.index({ event: 1, userId: 1 }, { unique: true });

export default model<IRegistration>('Registration', RegistrationSchema);
