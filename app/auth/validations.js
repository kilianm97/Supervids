import { z } from "zod"
export const email = z
  .string()
  .email()
  .transform((str) => str.toLowerCase().trim())
export const password = z
  .string()
  .min(10)
  .max(100)
  .transform((str) => str.trim())
export const passwordConfirmation = z.string().transform((str) => str.trim())
export const Signup = z
  .object({
    email,
    password,
    passwordConfirmation,
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"], // set the path of the error
  })
export const EditUser = z
  .object({
    email,
    currentPassword: z.string(),
    newPassword: password,
    passwordConfirmation,
  })
  .refine((data) => data.newPassword === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"], // set the path of the error
  })
export const Login = z.object({
  email,
  password: z.string(),
})
export const ForgotPassword = z.object({
  email,
})
export const ResetPassword = z
  .object({
    password: password,
    passwordConfirmation: password,
    token: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"], // set the path of the error
  })
export const ChangePassword = z.object({
  currentPassword: z.string(),
  c: password,
})
