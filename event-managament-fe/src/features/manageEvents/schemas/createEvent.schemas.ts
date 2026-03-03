import * as Yup from "yup";

export const createEventValidationSchema = Yup.object().shape({
  name: Yup
    .string()
    .required("Event name is required")
    .min(3, "Event name must be at least 3 characters")
    .max(100, "Event name must not exceed 100 characters"),
  categoryId: Yup
    .string()
    .required("Please select a category"),
  description: Yup
    .string()
    .max(2000, "Description must not exceed 2000 characters"),
  startDate: Yup
    .date()
    .required("Start date is required")
    .typeError("Start date must be a valid date"),
  endDate: Yup
    .date()
    .required("End date is required")
    .typeError("End date must be a valid date")
    .min(
      Yup.ref("startDate"),
      "End date must be after start date"
    ),
  location: Yup
    .string()
    .required("Location is required")
    .min(3, "Location must be at least 3 characters")
    .max(200, "Location must not exceed 200 characters"),
  tickets: Yup
    .array()
    .of(
      Yup.object().shape({
        name: Yup
          .string()
          .required("Ticket name is required"),
        quantity: Yup
          .number()
          .typeError("Quantity must be a number")
          .required("Quantity is required")
          .min(1, "Quantity must be at least 1"),
        price: Yup
          .number()
          .typeError("Price must be a number")
          .required("Price is required")
          .min(0, "Price cannot be negative"),
        description: Yup
          .string()
          .max(500, "Ticket description must not exceed 500 characters"),
      })
    ),
  imageFile: Yup
    .mixed()
    .nullable()
    .notRequired(),
});
