import { registerFields } from "./registerFields";

export const updatePatientFields = registerFields.filter(
  (field) => field.name !== "password" && field.name !== "confirmPassword",
);
