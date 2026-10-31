/** Only server-issued IDs grant catalogue access. An unverified email never grants it. */
export function canManageCatalogue(user: { id: number }) {
  const configured: string = process.env.BOULDY_ADMIN_USER_IDS ?? "";
  return configured
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .some((value) => /^\d+$/.test(value) && Number(value) === user.id);
}
