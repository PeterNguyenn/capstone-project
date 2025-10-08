import { ApiResponse, PaginatedResponse } from "../../types";
import { fetchEvent, fetchEvents } from "./fetch";
import { eventKeys } from "./queryKeys";
import { EventRo, GetEventDto } from "./types";
import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';

export const useEvents = (
  params: GetEventDto,
): UseQueryResult<PaginatedResponse<EventRo>> => {
  return useQuery({
    queryKey: eventKeys.list({ ...params }),
    queryFn: ({ queryKey: [{ params }] }) => fetchEvents(params),
  });
};

export const useEvent = ({
    id,
  }: {
    id: string;
  },
): UseQueryResult<EventRo> => {
  return useQuery({
    queryKey: eventKeys.detail({ id }),
    queryFn: ({ queryKey: [{ params }] }) => fetchEvent(params),
    enabled: !!id,
  });
};
