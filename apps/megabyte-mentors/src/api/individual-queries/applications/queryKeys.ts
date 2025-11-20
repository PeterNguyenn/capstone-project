import { GetApplicationsDto } from "./types";


export const applicationKeys = {
  all: [{ scope: 'applications' }],
  details: () => [{ ...applicationKeys.all[0], entity: 'detail' }],
  detail: (params: { id: string }) => [
    { ...applicationKeys.details()[0], params },
  ],
  lists: () => [{ ...applicationKeys.all[0], entity: 'list' }],
  list: (
    params: GetApplicationsDto,
  ) => [{ ...applicationKeys.lists()[0], params }],
} as const;
