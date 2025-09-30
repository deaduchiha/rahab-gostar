import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string({ required_error: "نام کاربری باید حداقل 3 کاراکتر باشد" })
    .min(3, { message: "نام کاربری باید حداقل 3 کاراکتر باشد" }),
  password: z
    .string({ required_error: "رمز عبور باید حداقل 6 کاراکتر باشد" })
    .min(6, { message: "رمز عبور باید حداقل 6 کاراکتر باشد" }),
});

export type TLoginSchema = z.infer<typeof loginSchema>;
