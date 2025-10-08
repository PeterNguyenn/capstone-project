import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiResponse } from '../../types';
import {
  EventRo,
  CreateEventDto,
} from './types';
import { eventKeys } from './queryKeys';
import eventService from '../../services/event.service';
import apiClient from '../../axios-config';

export const useCreateEventMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: ApiResponse<EventRo>) => void;
  onError: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateEventDto) => eventService.createEvent(params),
    onSuccess: async (data: ApiResponse<EventRo>) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      onSuccess(data);
    },
    onError,
  });
};

export const joinEvent = async (
  id: string,
): Promise<EventRo> => {
  const { data } = await apiClient.post(
    `/api/events/${id}/join`);
  return data;
};

export const useJoinEventMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: EventRo) => void;
  onError: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
    }: {
      id: string;
    }) => joinEvent(id),
    onSuccess: async (data: EventRo) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.details() });
      onSuccess(data);
    },
    onError,
  });
};