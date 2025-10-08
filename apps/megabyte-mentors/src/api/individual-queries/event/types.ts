export type CreateEventDto = {
  title: string,
  shortDescription: string,
  date: string,        // YYYY-MM-DD
  startTime: string,   // HH:mm
  endTime: string,     // HH:mm
  capacity: number,
  campus: string,
  location: string,
  status: 'published' | 'cancelled';
}

export type EventRo = CreateEventDto & {
  _id: string,
  attendeesCount: number,
  createdAt: string,
  updatedAt: string,
}

export type GetEventDto = {
  upcoming?: boolean,
}
