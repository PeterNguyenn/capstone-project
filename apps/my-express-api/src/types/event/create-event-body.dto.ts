import { z } from "zod";

export const CreateEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid start time format (HH:mm)"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid end time format (HH:mm)"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  campus: z.string().min(1, "Campus is required"),
  location: z.string().min(1, "Location is required"),
  status: z.enum(["published", "cancelled"]).default("published"),
});

export type CreateEventDto = z.infer<typeof CreateEventSchema>;