import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../axios-config';
import { ApiResponse } from '../../types';
import {
  ApplicationRo,
  CreateApplicationDto,
  NotificationTokenRo,
  UpdateApplicationDto,
  NotificationTokenDto,
} from './types';
import { appointmentKeys } from './queryKeys';

export const createAppointment = async (
  createDto: CreateApplicationDto
): Promise<ApiResponse<ApplicationRo>> => {
  const { data } = await apiClient.post<ApiResponse<ApplicationRo>>(
    '/api/applications',
    createDto
  );
  return data;
};

export const createNotificationToken = async (
  tokenDto: NotificationTokenDto
): Promise<ApiResponse<NotificationTokenRo>> => {
  const { data } = await apiClient.post<ApiResponse<NotificationTokenRo>>(
    '/api/notifications/register-token',
    tokenDto
  );
  return data;
};

export const updateAppointmentStatus = async (
  id: string,
  updateDto: UpdateApplicationDto
): Promise<ApiResponse<ApplicationRo>> => {
  const { data } = await apiClient.put<ApiResponse<ApplicationRo>>(
    `/api/applications/${id}/review`,
    updateDto
  );
  return data;
};

export const useCreateAppointmentMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: ApiResponse<ApplicationRo>) => void;
  onError: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateApplicationDto) => createAppointment(params),
    onSuccess: async (data: ApiResponse<ApplicationRo>) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      onSuccess(data);
    },
    onError,
  });
};

export const useNotificationTokenMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: ApiResponse<NotificationTokenRo>) => void;
  onError: (error: Error) => void;
}) => {
  return useMutation({
    mutationFn: (params: NotificationTokenDto) => createNotificationToken(params),
    onSuccess: async (data: ApiResponse<NotificationTokenRo>) => {
      onSuccess(data);
    },
    onError,
  });
};

export const useUpdateAppointmentStatusMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: ApiResponse<ApplicationRo>) => void;
  onError: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      params,
    }: {
      id: string;
      params: UpdateApplicationDto;
    }) => updateAppointmentStatus(id, params),
    onSuccess: async (data: ApiResponse<ApplicationRo>) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.details() });
      onSuccess(data);
    },
    onError,
  });
};
