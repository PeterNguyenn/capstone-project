import mongoose from 'mongoose';

const referenceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    emailAddress: { type: String, required: true },
  });

const applicationSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    studentNumber: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    alternateNumber: { type: String },
    emailAddress: { type: String, required: true },
    programOfStudy: { type: String, required: true },
    currentTerm: { type: String, required: true },
    numberOfTermsInProgram: { type: String, required: true },
    campus: { type: String, required: true },
    anticipatedGraduationDate: { type: String, required: true },
    dietaryRestrictions: { type: String, required: true },
    shirtSize: { type: String, required: true },
    accommodationsRequired: { type: String, required: true },
    references: { type: [referenceSchema], required: true },
    whyInterested: { type: String, required: true },
    makingDifference: { type: String, required: true },
    strengths: { type: String, required: true },
    areasOfGrowth: { type: String, required: true },
    extraSkills: { type: String, required: true },
    additionalInfo: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'], 
      default: 'pending', 
    }
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model('Application', applicationSchema);

export default Application;
