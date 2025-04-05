import apiClient from "../axios-config";
import { ApiResponse } from "../types";


export type ApplicationDto = {
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

export type ApplicationRo = ApplicationDto & {
  _id: string,
  createdAt: string,
  updatedAt: string,
}



const applicationService = {
  createApplication: async (data: ApplicationDto): Promise<ApiResponse<ApplicationDto>> => {
    const response = await apiClient.post<ApiResponse<ApplicationDto>>(
      '/api/applications', 
      data
    );
    return response.data;
  },
};

export default applicationService;