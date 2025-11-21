import { z } from "zod";

const ReferenceSchema = z.object({
    name: z.string().min(1, "Name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    phoneNumber: z.string().min(1, "Invalid phone number format"),
    emailAddress: z.string().min(1, "Invalid email format")
  });
  
  export const ApplicationSchema = z.object({
    studentName: z.string().min(1, "Student name is required"),
    studentNumber: z.string().min(1, "Student number is required"),
    address: z.string().min(1, "Address is required"),
    phoneNumber: z.string().min(1, "Invalid phone number format"),
    alternateNumber: z.string().optional(),
    emailAddress: z.string().min(1, "Invalid email format"),
    programOfStudy: z.string().min(1, "Program of study is required"),
    currentTerm: z.string().min(1, "Current term is required"),
    numberOfTermsInProgram: z.string().min(1, "Number of terms is required"),
    campus: z.string().min(1, "Campus is required"),
    anticipatedGraduationDate: z.string().min(1, "Graduation date is required"),
    dietaryRestrictions: z.string().optional(),
    shirtSize: z.string().min(1, "Dietary restrictions information is required"),
    accommodationsRequired: z.string().optional(),
    references: z.array(ReferenceSchema).min(1, "At least one reference is required"),
    whyInterested: z.string().min(1, "Interest explanation is required"),
    makingDifference: z.string().min(1, "Making difference explanation is required"),
    strengths: z.string().min(1, "Strengths information is required"),
    areasOfGrowth: z.string().min(1, "Areas of growth information is required"),
    extraSkills: z.string().min(1, "Extra skills information is required"),
    additionalInfo: z.string().optional()
  });
  
  export type ApplicationDto = z.infer<typeof ApplicationSchema>;