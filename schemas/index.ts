import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Введина не почта!",
  }),
  password: z.string().min(1, {
    message: "Пароль обязателен для входа!",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Введина не почта!",
  }),
  password: z.string().min(6, {
    message: "Пароль должен быть длинее 6 символов",
  }),
});

export const CreateCompanySchema = z.object({
  name: z.string(),
  description: z.string(),
  logoUrl: z.string(),
  userId: z.string(),
});

export const UpdateCompanySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  logoUrl: z.string(),
  socialLink: z.string().optional(),
});

export const CreateEventTypeSchema = z.object({
  value: z.string(),
});

export const CreateEventSchema = z.object({
  name: z.string(),
  logo: z.string(),
  description: z.string(),
  eventTypeId: z.string(),
  location: z.string(),
  date: z.coerce.date(),
  socialLink: z.string(),
  maxUserCount: z.coerce.number(),
  companyId: z.string(),
});

export const UpdateEventSchema = z.object({
  id: z.string(),
  name: z.string(),
  logo: z.string(),
  description: z.string(),
  eventTypeId: z.string(),
  location: z.string(),
  date: z.coerce.date(),
  socialLink: z.string(),
  maxUserCount: z.coerce.number(),
  companyId: z.string(),
});

export const UpdateUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
});
