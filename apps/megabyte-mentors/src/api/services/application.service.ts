import apiClient from "../axios-config";
import { ApiResponse } from "../types";


export interface ApplicationData {
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


const applicationService = {
  createApplication: async (data: ApplicationData): Promise<ApiResponse<ApplicationData>> => {
    const response = await apiClient.post<ApiResponse<ApplicationData>>(
      '/api/applications', 
      data
    );
    return response.data;
  },
};

export default applicationService;