import { Resend } from "resend"

import { getRole } from "@/lib/roles"
import type { CareersApplication, ServiceCall, TenderEnquiry } from "./schema"

/**
 * Server only. Never imported by a form component, only by a route handler.
 *
 * There is no verified sending domain for this concept project, so mail
 * goes from Resend's own shared address. Every path notifies the same
 * inbox for now; splitting by path only needs a different constant here.
 */
const FROM = "Harrow Mechanical <onboarding@resend.dev>"
const NOTIFY = "coreystephenr@gmail.com"

function client() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error("RESEND_API_KEY is not set")
  return new Resend(key)
}

/** Every value here is user submitted, so it goes into the HTML escaped. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/** Strips newlines from a value bound for a header, which some mail
 *  transfer agents will otherwise treat as the start of an injected header. */
function headerSafe(value: string) {
  return value.replace(/[\r\n]+/g, " ")
}

function paragraphs(lines: Array<[string, string]>) {
  return lines
    .map(
      ([label, value]) =>
        `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`
    )
    .join("\n")
}

export async function sendTenderEnquiry(data: TenderEnquiry) {
  await client().emails.send({
    from: FROM,
    to: NOTIFY,
    replyTo: data.email,
    subject: `Tender enquiry: ${headerSafe(data.company)}`,
    html: paragraphs([
      ["Contact", data.contactName],
      ["Company", data.company],
      ["Email", data.email],
      ["Phone", data.phone],
      ["Sector", data.sector],
      ["Project location", data.projectLocation],
      ["Contract scale", data.contractScale],
      ["Tender due date", data.tenderDueDate || "Not given"],
      ["Scope", data.scope],
    ]),
  })
}

export async function sendServiceCall(data: ServiceCall) {
  await client().emails.send({
    from: FROM,
    to: NOTIFY,
    replyTo: data.email,
    subject: `Service call, ${data.urgency}: ${headerSafe(data.siteAddress)}`,
    html: paragraphs([
      ["Contact", data.contactName],
      ["Email", data.email],
      ["Phone", data.phone],
      ["Site address", data.siteAddress],
      ["Building type", data.buildingType],
      ["Urgency", data.urgency],
      ["Issue", data.issue],
    ]),
  })
}

export async function sendCareersApplication(data: CareersApplication) {
  const role = getRole(data.roleSlug)

  await client().emails.send({
    from: FROM,
    to: NOTIFY,
    replyTo: data.email,
    subject: `Careers application: ${role?.title ?? "General enquiry"}`,
    html: paragraphs([
      ["Name", data.name],
      ["Email", data.email],
      ["Phone", data.phone],
      ["Role", role?.title ?? "General enquiry"],
      ["Background", data.background],
      ["Resume link", data.resumeLink || "Not given"],
    ]),
  })
}
