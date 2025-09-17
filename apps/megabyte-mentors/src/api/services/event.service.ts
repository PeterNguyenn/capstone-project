import apiClient from "../axios-config";
import { CreateEventDto } from "../individual-queries/event/types";
import { ApiResponse } from "../types";



const eventService = {
  createEvent: async (data: CreateEventDto): Promise<ApiResponse<CreateEventDto>> => {
    const response = await apiClient.post<ApiResponse<CreateEventDto>>(
      '/api/events', 
      data
    );
    return response.data;
  },
}

export default eventService;