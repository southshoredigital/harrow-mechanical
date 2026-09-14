import { NextResponse } from "next/server"

import { sendTenderEnquiry } from "@/lib/forms/email"
import { tenderEnquirySchema } from "@/lib/forms/schema"
import type { ContactApiResponse } from "@/lib/forms/schema"

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = tenderEnquirySchema.safeParse(body)

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
    console.log("[contact/tender] honeypot triggered, discarding", {
      email: data.email,
    })
    return NextResponse.json({ ok: true } satisfies ContactApiResponse)
  }

  try {
    await sendTenderEnquiry(data)
    console.log("[contact/tender] enquiry sent", {
      company: data.company,
      email: data.email,
      sector: data.sector,
    })
    return NextResponse.json({ ok: true } satisfies ContactApiResponse)
  } catch (error) {
    console.error("[contact/tender] send failed", error)
    const response: ContactApiResponse = {
      ok: false,
      error: "Something went wrong sending this. Try again in a moment.",
    }
    return NextResponse.json(response, { status: 502 })
  }
}
