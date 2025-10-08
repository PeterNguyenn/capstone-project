import { PaginatedResponse } from "../../types";
import { fetchEvent, fetchEventMentors, fetchEvents } from "./fetch";
import { eventKeys, eventMentorKeys } from "./queryKeys";
import { EventMentorRo, EventRo, GetEventDto } from "./types";
import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';

export const useEvents = (
  params: GetEventDto,
  enabled = true,
): UseQueryResult<PaginatedResponse<EventRo>> => {
  return useQuery({
    queryKey: eventKeys.list({ ...params }),
    queryFn: ({ queryKey: [{ params }] }) => fetchEvents(params),
    enabled: enabled
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

export const useEventMentors = ({
    id,
  }: {
    id: string;
  },
  enabled = true,
): UseQueryResult<EventMentorRo[]> => {
  return useQuery({
    queryKey: eventMentorKeys.list({ id }),
    queryFn: ({ queryKey: [{ params }] }) => fetchEventMentors(params),
    enabled: !!id && enabled,
  });
};