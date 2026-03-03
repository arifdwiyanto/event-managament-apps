import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().required("Required"),
});

export const registerSchema = Yup.object().shape({
  name: Yup.string().required("Full name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  terms: Yup.boolean().oneOf([true], "You must accept Terms & Conditions"),
  role: Yup.string().optional(),
  organizerName: Yup.string().when("role", {
    is: "ORGANIZER",
    then: (schema) => schema.required("Organizer name is required"),
    otherwise: (schema) => schema.optional(),
  }),
});
