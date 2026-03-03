import * as Yup from "yup";

export const addTeamMemberSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  role: Yup.string()
    .oneOf(["ADMIN", "MARKETING"], "Invalid role selected")
    .required("Role is required"),
});
