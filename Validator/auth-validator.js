const { z, string } = require("zod");

const signupSchema = z.object({
  fname: z
    .string({ required_error: "First Name is required" })
    .trim()
    .min(2, { message: "Fisrt Name must be at lest of 2 chars." })
    .max(255, { message: "Fisrt Name must be at lest of 3 chars. " }),

  lname: z
    .string({ required_error: "Last Name is required" })
    .trim()
    .min(2, { message: "Last Name must be at lest of 2 chars." })
    .max(255, { message: "Last Name must be at lest of 3 chars. " }),

  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email must be at lest of 3 chars." })
    .max(100, { message: "Email must be at lest of 100 chars. " }),

  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(7, { message: "Password must be at lest of 6 chars." })
    .max(50, { message: "Password must be at lest of 50 chars. " })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character",
    }),
  aggre: z.boolean(),
});

const registerSchema = z.object({
  otp: z.any({ required_error: "Enter Number Otp" }),
  token: z.string({ required_error: "Invalid Token" }),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email must be at lest of 3 chars." })
    .max(100, { message: "Email must be at lest of 100 chars. " }),
  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(7, { message: "Password must be at lest of 6 chars." })
    .max(50, { message: "Password must be at lest of 50 chars. " })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character",
    }),
});

const newPwSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email must be at lest of 3 chars." })
    .max(100, { message: "Email must be at lest of 3 chars. " }),
  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(7, { message: "Password must be at lest of 6 chars." })
    .max(50, { message: "Password must be at lest of 50 chars. " })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character",
    }),
});

const profileUpdate = z.object({
  fname: z
    .string({ required_error: "First Name is required" })
    .trim()
    .min(2, { message: "Fisrt Name must be at lest of 2 chars." })
    .max(255, { message: "Fisrt Name must be at lest of 3 chars. " }),

  lname: z
    .string({ required_error: "Last Name is required" })
    .trim()
    .min(2, { message: "Last Name must be at lest of 2 chars." })
    .max(255, { message: "Last Name must be at lest of 3 chars. " }),

  token: z.any({ required_error: "Enter Valid Token" }),
});

module.exports = {
  signupSchema,
  registerSchema,
  loginSchema,
  newPwSchema,
  profileUpdate,
};
