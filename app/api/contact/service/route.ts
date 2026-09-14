import { NextResponse } from "next/server"

import { sendServiceCall } from "@/lib/forms/email"
import { serviceCallSchema } from "@/lib/forms/schema"
import type { ContactApiResponse } from "@/lib/forms/schema"

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = serviceCallSchema.safeParse(body)

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
    console.log("[contact/service] honeypot triggered, discarding", {
      email: data.email,
    })
    return NextResponse.json({ ok: true } satisfies ContactApiResponse)
  }

  try {
    await sendServiceCall(data)
    console.log("[contact/service] call logged", {
      siteAddress: data.siteAddress,
      urgency: data.urgency,
      email: data.email,
    })
    return NextResponse.json({ ok: true } satisfies ContactApiResponse)
  } catch (error) {
    console.error("[contact/service] send failed", error)
    const response: ContactApiResponse = {
      ok: false,
      error: "Something went wrong sending this. Try again in a moment.",
    }
    return NextResponse.json(response, { status: 502 })
  }
}
