import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate and transform the data, throwing if invalid
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to more readable format
        const validationError = fromZodError(error);
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: validationError.details
        });
      }
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error during validation'
      });
    }
  };