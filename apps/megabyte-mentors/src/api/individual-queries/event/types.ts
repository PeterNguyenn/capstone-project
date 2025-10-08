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

export type EventReminderRo = {
  notified: number,
}

export type CreateEventReminderDto = {
  id: string,
  title: string,
  message: string,
}

export type GetEventDto = {
  upcoming?: boolean,
}

export type EventMentorRo = {
  name: string,
  studentId: string,
  currentTerm: number,
  phoneNumber: string,
  email: string,
}