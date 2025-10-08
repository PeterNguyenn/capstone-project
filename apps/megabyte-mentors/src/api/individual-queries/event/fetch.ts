import apiClient from "../../axios-config";
import { PaginatedResponse } from "../../types";
import { EventMentorRo, EventRo, GetEventDto } from "./types";


export const fetchEvents = async (
  params?: GetEventDto,
): Promise<PaginatedResponse<EventRo>> => {

  console.log(params)
  const { data } = await apiClient.get<PaginatedResponse<EventRo>>(
    '/api/events',
    {
      params,
    },
  );

  return data;
};

export const fetchEvent = async ({
  id,
}: {
  id: string;
}): Promise<EventRo> => {
  const { data } = await apiClient.get<EventRo>(`/api/events/${id}`);

  return data;
};

export const fetchEventMentors = async ({
  id,
}: {
  id: string;
}): Promise<PaginatedResponse<EventMentorRo>> => {
  const { data } = await apiClient.get<PaginatedResponse<EventMentorRo>>(`/api/events/${id}/mentors`);
  return data;
};

