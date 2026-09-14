import { roles } from "@/content/roles"

export function getRole(slug: string) {
  return roles.find((role) => role.slug === slug)
}
