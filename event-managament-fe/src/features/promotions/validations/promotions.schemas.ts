import * as Yup from "yup";

export const promotionValidationSchema = Yup.object().shape({
  name: Yup.string().required("Promotion Name is required"),
  code: Yup.string()
    .required("Code is required")
    .matches(/^[A-Z0-9]+$/, "Code must be uppercase letters and numbers only"),
  discountType: Yup.string().oneOf(["percentage", "amount"]).required(),
  discountPercentage: Yup.number().when("discountType", {
    is: "percentage",
    then: (schema) =>
      schema
        .required("Percentage is required")
        .min(1, "Min 1%")
        .max(100, "Max 100%"),
    otherwise: (schema) => schema.nullable(),
  }),
  discountAmount: Yup.number().when("discountType", {
    is: "amount",
    then: (schema) =>
      schema.required("Amount is required").min(1, "Min Amount is 1"),
    otherwise: (schema) => schema.nullable(),
  }),
  eventId: Yup.string().when("$isEdit", {
    is: false,
    then: (schema) => schema.required("Applicable Event is required"),
    otherwise: (schema) => schema.nullable(),
  }),
  startDate: Yup.date().required("Start Date is required"),
  endDate: Yup.date()
    .required("End Date is required")
    .min(Yup.ref("startDate"), "End date can't be before start date"),
  maxUsage: Yup.number().nullable().min(1, "Must be at least 1"),
});
