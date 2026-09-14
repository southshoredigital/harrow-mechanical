import { NextResponse } from "next/server"

import { sendCareersApplication } from "@/lib/forms/email"
import { careersApplicationSchema } from "@/lib/forms/schema"
import type { ContactApiResponse } from "@/lib/forms/schema"

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = careersApplicationSchema.safeParse(body)

  if (!parsed.success) {
    const response: ContactApiResponse = {
      ok: false,
      error: "Check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
    return NextResponse.json(response, { status: 400 })
  }

  const { website, ...data } = parsed.data

  if (website) {
    console.log("[contact/careers] honeypot triggered, discarding", {
      email: data.email,
    })
    return NextResponse.json({ ok: true } satisfies ContactApiResponse)
  }

  try {
    await sendCareersApplication(data)
    console.log("[contact/careers] application sent", {
      roleSlug: data.roleSlug,
      email: data.email,
    })
    return NextResponse.json({ ok: true } satisfies ContactApiResponse)
  } catch (error) {
    console.error("[contact/careers] send failed", error)
    const response: ContactApiResponse = {
      ok: false,
      error: "Something went wrong sending this. Try again in a moment.",
    }
    return NextResponse.json(response, { status: 502 })
  }
}
