import { z } from 'zod';


export const CreatePostSchema = z.object({
    title: z.string(),
    description: z.string(),
  });

export type CreatePostDto = z.infer<typeof CreatePostSchema>;

