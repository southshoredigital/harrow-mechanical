import { z } from "zod"

import { roles } from "@/content/roles"
import { SCALES, SECTORS } from "@/content/types"

/**
 * Validation for the three contact paths. Each schema is imported by both
 * its client form (react-hook-form's zodResolver) and its route handler, so
 * client and server can never validate against a different shape.
 *
 * `website` is the honeypot: a field no sighted person fills in, laid out
 * off screen in the form component. A submission is treated as spam if it
 * arrives non-empty, never by failing validation, so a bot filling it still
 * gets a normal looking success response instead of a signal to adjust.
 */
const honeypot = z.string().optional()

const ROLE_SLUGS = [
  ...roles.map((role) => role.slug),
  "general",
] as unknown as [string, ...string[]]

export const tenderEnquirySchema = z.object({
  contactName: z.string().trim().min(2, "Enter your name"),
  company: z.string().trim().min(2, "Enter your company name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(8, "Enter a phone number"),
  sector: z.enum(SECTORS, { message: "Choose a sector" }),
  projectLocation: z.string().trim().min(2, "Enter the project location"),
  contractScale: z.enum(SCALES, { message: "Choose a contract scale" }),
  tenderDueDate: z.string().trim().optional().or(z.literal("")),
  scope: z.string().trim().min(20, "Describe the scope of work"),
  website: honeypot,
})
export type TenderEnquiry = z.infer<typeof tenderEnquirySchema>

export const URGENCY_LEVELS = ["Routine", "Urgent", "Emergency"] as const

export const serviceCallSchema = z.object({
  contactName: z.string().trim().min(2, "Enter your name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(8, "Enter a phone number"),
  siteAddress: z.string().trim().min(5, "Enter the site address"),
  buildingType: z.string().trim().min(2, "Enter the building type"),
  urgency: z.enum(URGENCY_LEVELS, { message: "Choose an urgency" }),
  issue: z.string().trim().min(20, "Describe the fault or issue"),
  website: honeypot,
})
export type ServiceCall = z.infer<typeof serviceCallSchema>

export const careersApplicationSchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(8, "Enter a phone number"),
  roleSlug: z.enum(ROLE_SLUGS, { message: "Choose a role" }),
  background: z.string().trim().min(20, "Tell us about your trade background"),
  resumeLink: z
    .string()
    .trim()
    .url("Enter a valid link")
    .optional()
    .or(z.literal("")),
  website: honeypot,
})
export type CareersApplication = z.infer<typeof careersApplicationSchema>

export type ContactPath = "tender" | "service" | "careers"

export type ContactApiResponse =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> }
