

import { z } from 'zod';
export const UserSchema = z.object({
  email: z.string().email("Invalid email address"),
  
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
    
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    
//   captcha: z.string().min(1, "Captcha is required"),
  
//   remember: z.boolean(),
  
//   // Optional fields: use .optional() or .nullable()
//   cover_image: z.string().url("Invalid cover image URL").optional(),
  
//   profile_photo_url: z.string().url("Invalid profile photo URL").optional(),
  
  // Date of Birth validation
  // dob: z.preprocess((arg) => {
  //   if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  // }, z.date().refine((date) => date < new Date(), {
  //   message: "Date of birth must be in the past",
  // })),
});

export const UpdateUserSchema = z.object({
    username : z.string().min(1).optional(),
    f_name : z.string().min(1).optional(),
    l_name : z.string().min(1).optional(),
    bio : z.string().max(160).optional(),
    profile_photo_url : z.url().optional(),
    cover_image_url : z.url().optional(),

})

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>