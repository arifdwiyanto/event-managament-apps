import * as Yup from "yup";

export const registerOrganizerSchema = Yup.object().shape({
  name: Yup.string()
    .required("Organizer name is required")
    .min(2, "Name must be at least 2 characters"),
  description: Yup.string().optional(),
});
