import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiResponse } from '../../types';
import {
  EventRo,
  CreateEventDto,
  CreateEventReminderDto,
  EventReminderRo,
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

const createEventReminder = async (data: CreateEventReminderDto): Promise<ApiResponse<EventReminderRo>> => {
    const response = await apiClient.post<ApiResponse<EventReminderRo>>(
      `/api/events/${data.id}/reminder`, 
      data
    );
    return response.data;
  };

export const useCreateEventReminderMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: ApiResponse<EventReminderRo>) => void;
  onError: (error: Error) => void;
}) => {

  return useMutation({
    mutationFn: (params: CreateEventReminderDto) => createEventReminder(params),
    onSuccess: async (data: ApiResponse<EventReminderRo>) => {
      onSuccess(data);
    },
    onError,
  });
};

export const joinEvent = async (
  id: string,
  userId: string,
): Promise<EventRo> => {

  const { data } = await apiClient.post(
    `/api/events/${id}/join`,{}, {
  headers: {
    'x-user-id': userId,
  }
});
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
      userId,
    }: {
      id: string;
      userId: string;
    }) => joinEvent(id, userId),
    onSuccess: async (data: EventRo) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.details() });
      onSuccess(data);
    },
    onError,
  });
};