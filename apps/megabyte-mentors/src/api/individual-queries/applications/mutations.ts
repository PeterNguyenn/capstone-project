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
import { applicationKeys } from './queryKeys';

export const createApplication = async (
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

export const updateApplicationStatus = async (
  id: string,
  updateDto: UpdateApplicationDto
): Promise<ApiResponse<ApplicationRo>> => {
  const { data } = await apiClient.put<ApiResponse<ApplicationRo>>(
    `/api/applications/${id}/review`,
    updateDto
  );
  return data;
};

export const useCreateApplicationMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: ApiResponse<ApplicationRo>) => void;
  onError: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateApplicationDto) => createApplication(params),
    onSuccess: async (data: ApiResponse<ApplicationRo>) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
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

export const useUpdateApplicationStatusMutation = ({
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
    }) => updateApplicationStatus(id, params),
    onSuccess: async (data: ApiResponse<ApplicationRo>) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: applicationKeys.details() });
      onSuccess(data);
    },
    onError,
  });
};
