export type CreateApplicationDto = {
  studentName: string,
  studentNumber: string,
  address: string,
  phoneNumber: string,
  alternateNumber: string,
  emailAddress: string,
  programOfStudy: string,
  currentTerm: string,
  numberOfTermsInProgram: string,
  campus: string,
  anticipatedGraduationDate: string,
  dietaryRestrictions: string,
  shirtSize: string,
  accommodationsRequired: string,
  references: {
    name: string,
    relationship: string,
    phoneNumber: string,
    emailAddress: string,
  }[],
  whyInterested: string,
  makingDifference: string,
  strengths: string,
  areasOfGrowth: string,
  extraSkills: string,
  additionalInfo: string,
}

type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export type UpdateApplicationDto = {
  status: ApplicationStatus,
}

export type GetApplicationsDto = {
  page?: number,
  userId?: string,
  status?: ApplicationStatus,
}

export type ApplicationRo = CreateApplicationDto & {
  _id: string,
  createdAt: string,
  updatedAt: string,
  status: ApplicationStatus,
}