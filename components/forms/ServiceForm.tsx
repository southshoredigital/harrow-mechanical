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
import { URGENCY_LEVELS, serviceCallSchema } from "@/lib/forms/schema"
import type { ServiceCall } from "@/lib/forms/schema"
import { useContactForm } from "@/lib/forms/useContactForm"

const DEFAULT_VALUES: ServiceCall = {
  contactName: "",
  email: "",
  phone: "",
  siteAddress: "",
  buildingType: "",
  urgency: "Routine",
  issue: "",
  website: "",
}

export function ServiceForm() {
  const { form, onSubmit, status, serverError } = useContactForm<ServiceCall>(
    zodResolver(serviceCallSchema),
    "/api/contact/service",
    DEFAULT_VALUES
  )
  const { register, formState } = form

  if (status === "success") {
    return (
      <ConfirmationPanel
        heading="Logged."
        body="This call has gone to our service team. Emergency calls are actioned the same day; routine and urgent calls within one business day."
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

        <FormField label="Urgency" error={formState.errors.urgency?.message}>
          {(field) => (
            <select
              {...field}
              {...register("urgency")}
              className={fieldClass(Boolean(formState.errors.urgency))}
            >
              {URGENCY_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          )}
        </FormField>

        <FormField
          label="Site address"
          error={formState.errors.siteAddress?.message}
        >
          {(field) => (
            <input
              {...field}
              {...register("siteAddress")}
              type="text"
              autoComplete="street-address"
              className={fieldClass(Boolean(formState.errors.siteAddress))}
            />
          )}
        </FormField>

        <FormField
          label="Building type"
          error={formState.errors.buildingType?.message}
        >
          {(field) => (
            <input
              {...field}
              {...register("buildingType")}
              type="text"
              placeholder="Aged care facility, office tower, warehouse"
              className={fieldClass(Boolean(formState.errors.buildingType))}
            />
          )}
        </FormField>
      </div>

      <div className="mt-6">
        <FormField
          label="Fault or issue"
          error={formState.errors.issue?.message}
        >
          {(field) => (
            <textarea
              {...field}
              {...register("issue")}
              rows={5}
              placeholder="What's happening, and what plant it involves if you know it."
              className={fieldClass(Boolean(formState.errors.issue))}
            />
          )}
        </FormField>
      </div>

      {status === "error" && serverError ? <ErrorBanner message={serverError} /> : null}

      <SubmitButton submitting={status === "submitting"}>
        Log service call
      </SubmitButton>
    </form>
  )
}
