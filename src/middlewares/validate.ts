import { ZodObject } from 'zod';
import type { Request, Response, NextFunction } from 'express';

export const validate = (schema: ZodObject) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body,"this is body")
        console.log(req.files,"this are the files")
      schema.parse(req.body); // Validate body
      next(); // Move to Controller
    } catch (e: any) {
        console.log(e.issues)
      return res.status(400).json(e.issues);
    }
};