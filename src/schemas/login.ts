import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string({ error: "نام کاربری باید حداقل 3 کاراکتر باشد" })
    .min(3, { error: "نام کاربری باید حداقل 3 کاراکتر باشد" }),
  password: z
    .string({ error: "رمز عبور باید حداقل 6 کاراکتر باشد" })
    .min(6, { error: "رمز عبور باید حداقل 6 کاراکتر باشد" }),
});

export type TLoginSchema = z.infer<typeof loginSchema>;
