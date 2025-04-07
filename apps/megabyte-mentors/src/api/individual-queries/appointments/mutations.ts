import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../axios-config";
import { ApiResponse } from "../../types";
import { ApplicationRo, CreateApplicationDto, UpdateApplicationDto } from "./types";
import { appointmentKeys } from "./queryKeys";


export const createAppointment = async (
  createDto: CreateApplicationDto,
): Promise<ApiResponse<ApplicationRo>> => {
  const { data } = await apiClient.post<ApiResponse<ApplicationRo>>(
    '/api/applications',
    createDto,
  );
  return data;
};


export const updateAppointmentStatus = async (
  id: string,
  updateDto: UpdateApplicationDto,
): Promise<ApiResponse<ApplicationRo>> => {
  const { data } = await apiClient.put<ApiResponse<ApplicationRo>>(
    `/api/applications/${id}/review`,
    updateDto,
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

  return useMutation(
    ({
      mutationFn: (params: CreateApplicationDto) => createAppointment(params),
      onSuccess: async (data: ApiResponse<ApplicationRo>) => {
        queryClient.invalidateQueries({queryKey: appointmentKeys.lists()});
        onSuccess(data);
      },
      onError,
    }
  ));
};

export const useUpdateAppointmentStatusMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: ApiResponse<ApplicationRo>) => void;
  onError: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation(
    ({
      mutationFn: ({
        id,
        params,
      }: {
        id: string;
        params: UpdateApplicationDto;
      }) => updateAppointmentStatus(id, params),
      onSuccess: async (data: ApiResponse<ApplicationRo>) => {
        queryClient.invalidateQueries({queryKey: appointmentKeys.lists()});
        queryClient.invalidateQueries({queryKey: appointmentKeys.details()});
        onSuccess(data);
      },
      onError,
    }
  ));
};