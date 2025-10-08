import { GetEventDto } from "./types";


export const eventKeys = {
  all: [{ scope: 'events' }],
  details: () => [{ ...eventKeys.all[0], entity: 'detail' }],
  detail: (params: { id: string }) => [
    { ...eventKeys.details()[0], params },
  ],
  lists: () => [{ ...eventKeys.all[0], entity: 'list' }],
  list: (
    params: GetEventDto,
  ) => [{ ...eventKeys.lists()[0], params }],
} as const;
