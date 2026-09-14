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
import { roles } from "@/content/roles"
import { careersApplicationSchema } from "@/lib/forms/schema"
import type { CareersApplication } from "@/lib/forms/schema"
import { useContactForm } from "@/lib/forms/useContactForm"

const DEFAULT_VALUES: CareersApplication = {
  name: "",
  email: "",
  phone: "",
  roleSlug: "general",
  background: "",
  resumeLink: "",
  website: "",
}

export function CareersForm() {
  const { form, onSubmit, status, serverError } =
    useContactForm<CareersApplication>(
      zodResolver(careersApplicationSchema),
      "/api/contact/careers",
      DEFAULT_VALUES
    )
  const { register, formState } = form

  if (status === "success") {
    return (
      <ConfirmationPanel
        heading="Application received."
        body="This has gone to our team. We reply to every application, whether or not the role is still open, within a week."
      />
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8">
      <Honeypot {...register("website")} />

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Your name" error={formState.errors.name?.message}>
          {(field) => (
            <input
              {...field}
              {...register("name")}
              type="text"
              autoComplete="name"
              className={fieldClass(Boolean(formState.errors.name))}
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

        <FormField label="Role" error={formState.errors.roleSlug?.message}>
          {(field) => (
            <select
              {...field}
              {...register("roleSlug")}
              className={fieldClass(Boolean(formState.errors.roleSlug))}
            >
              {roles.map((role) => (
                <option key={role.slug} value={role.slug}>
                  {role.title}
                </option>
              ))}
              <option value="general">General enquiry</option>
            </select>
          )}
        </FormField>
      </div>

      <div className="mt-6">
        <FormField
          label="Your trade background"
          error={formState.errors.background?.message}
        >
          {(field) => (
            <textarea
              {...field}
              {...register("background")}
              rows={5}
              placeholder="Your ticket, your experience, and what you're looking for."
              className={fieldClass(Boolean(formState.errors.background))}
            />
          )}
        </FormField>
      </div>

      <div className="mt-6">
        <FormField
          label="Resume link"
          hint="Optional. A link to a Google Drive, Dropbox or LinkedIn profile."
          error={formState.errors.resumeLink?.message}
        >
          {(field) => (
            <input
              {...field}
              {...register("resumeLink")}
              type="url"
              placeholder="https://"
              className={fieldClass(Boolean(formState.errors.resumeLink))}
            />
          )}
        </FormField>
      </div>

      {status === "error" && serverError ? <ErrorBanner message={serverError} /> : null}

      <SubmitButton submitting={status === "submitting"}>
        Send application
      </SubmitButton>
    </form>
  )
}
