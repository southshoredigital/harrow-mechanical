"use client"

import { zodResolver } from "@hookform/resolvers/zod"

import {
  ConfirmationPanel,
  ErrorBanner,
  SubmitButton,
} from "./ContactFormChrome"
import { FormField } from "./FormField"
import { Honeypot } from "./Honeypot"
import { fieldClass } from "./fieldStyles"
import { SCALES, SECTORS } from "@/content/types"
import { tenderEnquirySchema } from "@/lib/forms/schema"
import type { TenderEnquiry } from "@/lib/forms/schema"
import { useContactForm } from "@/lib/forms/useContactForm"

const DEFAULT_VALUES: TenderEnquiry = {
  contactName: "",
  company: "",
  email: "",
  phone: "",
  sector: SECTORS[0],
  projectLocation: "",
  contractScale: SCALES[0],
  tenderDueDate: "",
  scope: "",
  website: "",
}

export function TenderForm() {
  const { form, onSubmit, status, serverError } = useContactForm<TenderEnquiry>(
    zodResolver(tenderEnquirySchema),
    "/api/contact/tender",
    DEFAULT_VALUES
  )
  const { register, formState } = form

  if (status === "success") {
    return (
      <ConfirmationPanel
        heading="On the tender list."
        body="This enquiry has gone to our estimating team. We reply to every tender enquiry within one business day, ahead of any nominated due date."
      />
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8">
      <Honeypot {...register("website")} />

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Your name" error={formState.errors.contactName?.message}>
          {(field) => (
            <input
              {...field}
              {...register("contactName")}
              type="text"
              autoComplete="name"
              className={fieldClass(Boolean(formState.errors.contactName))}
            />
          )}
        </FormField>

        <FormField label="Company" error={formState.errors.company?.message}>
          {(field) => (
            <input
              {...field}
              {...register("company")}
              type="text"
              autoComplete="organization"
              className={fieldClass(Boolean(formState.errors.company))}
            />
          )}
        </FormField>

        <FormField label="Email" error={formState.errors.email?.message}>
          {(field) => (
            <input
              {...field}
              {...register("email")}
              type="email"
              autoComplete="email"
              className={fieldClass(Boolean(formState.errors.email))}
            />
          )}
        </FormField>

        <FormField label="Phone" error={formState.errors.phone?.message}>
          {(field) => (
            <input
              {...field}
              {...register("phone")}
              type="tel"
              autoComplete="tel"
              className={fieldClass(Boolean(formState.errors.phone))}
            />
          )}
        </FormField>

        <FormField label="Sector" error={formState.errors.sector?.message}>
          {(field) => (
            <select
              {...field}
              {...register("sector")}
              className={fieldClass(Boolean(formState.errors.sector))}
            >
              {SECTORS.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
          )}
        </FormField>

        <FormField
          label="Project location"
          error={formState.errors.projectLocation?.message}
        >
          {(field) => (
            <input
              {...field}
              {...register("projectLocation")}
              type="text"
              placeholder="Suburb, Victoria"
              className={fieldClass(Boolean(formState.errors.projectLocation))}
            />
          )}
        </FormField>

        <FormField
          label="Contract scale"
          error={formState.errors.contractScale?.message}
        >
          {(field) => (
            <select
              {...field}
              {...register("contractScale")}
              className={fieldClass(Boolean(formState.errors.contractScale))}
            >
              {SCALES.map((scale) => (
                <option key={scale} value={scale}>
                  {scale}
                </option>
              ))}
            </select>
          )}
        </FormField>

        <FormField
          label="Tender due date"
          hint="Optional"
          error={formState.errors.tenderDueDate?.message}
        >
          {(field) => (
            <input
              {...field}
              {...register("tenderDueDate")}
              type="date"
              className={fieldClass(Boolean(formState.errors.tenderDueDate))}
            />
          )}
        </FormField>
      </div>

      <div className="mt-6">
        <FormField label="Scope of work" error={formState.errors.scope?.message}>
          {(field) => (
            <textarea
              {...field}
              {...register("scope")}
              rows={5}
              placeholder="What the package covers, and anything that makes it a fit for us specifically."
              className={fieldClass(Boolean(formState.errors.scope))}
            />
          )}
        </FormField>
      </div>

      {status === "error" && serverError ? <ErrorBanner message={serverError} /> : null}

      <SubmitButton submitting={status === "submitting"}>
        Send tender enquiry
      </SubmitButton>
    </form>
  )
}
