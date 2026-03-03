import { z } from "zod";

export const createOrganizerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const updateOrganizerSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

export const addTeamMemberSchema = z.object({
  email: z.string().email("Invalid email format"),
  role: z.enum(["ADMIN", "MARKETING"]).optional(),
});

export const updateTeamMemberRoleSchema = z.object({
  role: z.enum(["ADMIN", "MARKETING"]),
});
