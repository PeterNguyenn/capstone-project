import apiClient from "../axios-config";
import { CreateEventDto, EventRo } from "../individual-queries/event/types";
import { ApiResponse } from "../types";



const eventService = {
  createEvent: async (data: CreateEventDto): Promise<ApiResponse<EventRo>> => {
    const response = await apiClient.post<ApiResponse<EventRo>>(
      '/api/events', 
      data
    );
    return response.data;
  },
}

export default eventService;