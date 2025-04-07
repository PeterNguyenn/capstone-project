import { GetApplicationsDto } from "./types";


export const appointmentKeys = {
  all: [{ scope: 'appointments' }],
  details: () => [{ ...appointmentKeys.all[0], entity: 'detail' }],
  detail: (params: { id: string }) => [
    { ...appointmentKeys.details()[0], params },
  ],
  lists: () => [{ ...appointmentKeys.all[0], entity: 'list' }],
  list: (
    params: GetApplicationsDto,
  ) => [{ ...appointmentKeys.lists()[0], params }],
} as const;
