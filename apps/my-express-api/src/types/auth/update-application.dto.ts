import { z } from "zod";

export const UpdateApplicationStatusSchema = z.object({
  status: z.enum(['pending', 'accepted', 'rejected'], {
    required_error: "Status is required",
    invalid_type_error: "Status must be either 'pending', 'accepted', or 'rejected'"
  })
});

export type UpdateApplicationStatusDto = z.infer<typeof UpdateApplicationStatusSchema>;