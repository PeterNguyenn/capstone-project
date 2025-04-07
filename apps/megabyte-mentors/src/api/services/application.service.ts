import apiClient from "../axios-config";
import { CreateApplicationDto } from "../individual-queries/appointments/types";
import { ApiResponse } from "../types";


const applicationService = {
  createApplication: async (data: CreateApplicationDto): Promise<ApiResponse<CreateApplicationDto>> => {
    const response = await apiClient.post<ApiResponse<CreateApplicationDto>>(
      '/api/applications', 
      data
    );
    return response.data;
  },
};

export default applicationService;