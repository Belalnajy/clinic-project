import { z } from "zod";
import { BaseRegisterForm } from "./base-register-form";

const secretaryFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  role: z.literal("secretary")
});

export function SecretaryRegisterForm({ className, ...props }) {
  return (
    <BaseRegisterForm
      className={className}
      role="secretary"
      formSchema={secretaryFormSchema}
      {...props}
    />
  );
}
