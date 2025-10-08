import { Schema, model, Document, Types } from 'mongoose';

export interface IRegistration extends Document {
  event: Types.ObjectId;  // references Event._id
  userId: string;         // mentor id stored as string (from x-user-id header)
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>(
  {
    // NOTE: no "index: true" here to avoid duplicating the explicit index below
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

// Prevent the same mentor from joining the same event twice
RegistrationSchema.index({ event: 1, userId: 1 }, { unique: true });

// Helpful single-field index for listing by event
RegistrationSchema.index({ event: 1 });

export default model<IRegistration>('Registration', RegistrationSchema);
