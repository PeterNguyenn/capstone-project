import apiClient from "../../axios-config";
import { ApiResponse, PaginatedResponse } from "../../types";
import { ApplicationRo, GetApplicationsDto } from "./types";


export const fetchApplications = async (
  params?: GetApplicationsDto,
): Promise<PaginatedResponse<ApplicationRo>> => {

  console.log(params)
  const { data } = await apiClient.get<PaginatedResponse<ApplicationRo>>(
    '/api/applications',
    {
      params,
    },
  );

  return data;
};

export const fetchApplication = async ({
  id,
}: {
  id: string;
}): Promise<ApiResponse<ApplicationRo>> => {
  const { data } = await apiClient.get<ApiResponse<ApplicationRo>>(`/api/applications/${id}`);

  return data;
};

