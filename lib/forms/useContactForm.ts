"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import type { DefaultValues, FieldValues, Path, Resolver } from "react-hook-form"

import type { ContactApiResponse } from "./schema"

export type SubmitStatus = "idle" | "submitting" | "success" | "error"

/**
 * The submit lifecycle shared by all three forms: post to the form's own
 * route, map field errors back onto the same fields the user filled in, and
 * surface a general error only when there is nothing more specific to say.
 *
 * Takes an already built `zodResolver(schema)` rather than the schema
 * itself: building it here, generically, runs into a real mismatch between
 * zod's inferred input/output types and react-hook-form's `Resolver<T>`.
 * Building it at each call site, against a concrete schema, avoids that and
 * still means client and server validate the one path against the one
 * schema, since both read from the same file in lib/forms/schema.ts.
 */
export function useContactForm<T extends FieldValues>(
  resolver: Resolver<T>,
  endpoint: string,
  defaultValues: DefaultValues<T>
) {
  const [status, setStatus] = useState<SubmitStatus>("idle")
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<T>({ resolver, defaultValues })

  const onSubmit = form.handleSubmit(async (values) => {
    setStatus("submitting")
    setServerError(null)

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const json: ContactApiResponse = await res.json()

      if (!json.ok) {
        if (json.fieldErrors) {
          for (const [field, messages] of Object.entries(json.fieldErrors)) {
            if (messages?.[0]) {
              form.setError(field as Path<T>, { message: messages[0] })
            }
          }
        }
        setServerError(json.error)
        setStatus("error")
        return
      }

      setStatus("success")
    } catch {
      setServerError(
        "Something went wrong sending this. Check your connection and try again."
      )
      setStatus("error")
    }
  })

  return { form, onSubmit, status, serverError }
}
