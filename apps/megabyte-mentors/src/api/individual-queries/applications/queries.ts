import { ApiResponse, PaginatedResponse } from "../../types";
import { fetchApplication, fetchApplications } from "./fetch";
import { applicationKeys } from "./queryKeys";
import { ApplicationRo, GetApplicationsDto } from "./types";
import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';

export const useApplications = (
  params: GetApplicationsDto,
): UseQueryResult<PaginatedResponse<ApplicationRo>> => {
  return useQuery({
    queryKey: applicationKeys.list({ ...params }),
    queryFn: ({ queryKey: [{ params }] }) => fetchApplications(params),
  });
};

export const useApplication = ({
    id,
  }: {
    id: string;
  },
): UseQueryResult<ApiResponse<ApplicationRo>> => {
  return useQuery({
    queryKey: applicationKeys.detail({ id }),
    queryFn: ({ queryKey: [{ params }] }) => fetchApplication(params),
    enabled: !!id,
  });
};
