"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { features } from "@/lib/features";
import { profileSchema, isTooYoung, needsGuardian, type ProfileInput } from "@/lib/schemas";
import { auth } from "@/lib/server/auth";
import { pool, query } from "@/lib/server/db";
import { sendEmail } from "@/lib/server/email";
import { emails } from "@/lib/server/email-templates";
import { rateLimit } from "@/lib/server/ratelimit";
import { getProfile, getUser } from "@/lib/server/session";

export type SaveResult = { ok: true; created: boolean } | { ok: false; errors: Record<string, string>; blocked?: boolean };

/** Creates or updates the signed-in user's profile. The user id always comes from the session. */
export async function saveProfile(input: ProfileInput): Promise<SaveResult> {
  if (!features.accounts) return { ok: false, errors: { form: "Accounts are not enabled." } };
  const user = await getUser();
  if (!user) return { ok: false, errors: { form: "Your session has ended. Please sign in again." } };
  if (!(await rateLimit("profile", 20, 60))) return { ok: false, errors: { form: "Too many attempts. Please wait a minute." } };

  // Under-13 check first: such users must not have any data stored.
  const year = Number(input.birthYear);
  if (Number.isInteger(year) && isTooYoung(year)) {
    await deleteUserCompletely(user.id);
    return { ok: false, blocked: true, errors: { birthYear: "You need to be at least 13 to create an account." } };
  }

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0] ?? "form")] ??= i.message;
    return { ok: false, errors };
  }
  const p = parsed.data;
  const existed = Boolean(await getProfile(user.id));
  const client = await pool.connect();
  try {
    await client.query("begin");
    await client.query(
      `insert into profiles (user_id, full_name, country, institution, education_level, birth_year, telegram, bio)
       values ($1,$2,$3,$4,$5,$6,$7,$8)
       on conflict (user_id) do update set full_name=$2, country=$3, institution=$4, education_level=$5, birth_year=$6, telegram=$7, bio=$8, updated_at=now()`,
      [user.id, p.fullName, p.country, p.institution, p.educationLevel, p.birthYear, p.telegram, p.bio],
    );
    if (needsGuardian(p.birthYear)) {
      await client.query(
        `insert into guardian_consents (user_id, confirmed, guardian_email) values ($1, true, $2)
         on conflict (user_id) do update set guardian_email = $2, confirmed_at = now()`,
        [user.id, p.guardianEmail],
      );
    } else {
      await client.query("delete from guardian_consents where user_id = $1", [user.id]);
    }
    await client.query(`update "user" set name = $2, "updatedAt" = now() where id = $1`, [user.id, p.fullName]);
    await client.query("commit");
  } catch (e) {
    await client.query("rollback");
    console.error("[profile] save failed", (e as Error).message);
    return { ok: false, errors: { form: "Something went wrong while saving. Please try again." } };
  } finally {
    client.release();
  }
  return { ok: true, created: !existed };
}

async function deleteUserCompletely(userId: string) {
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch {}
  // Cascades to sessions, accounts, profile, guardian consent and (later) registrations.
  await query(`delete from "user" where id = $1`, [userId]);
}

/** Permanently deletes the signed-in user's account after typing DELETE. */
export async function deleteAccount(formData: FormData) {
  if (!features.accounts) return;
  const user = await getUser();
  if (!user) redirect("/signin");
  if (String(formData.get("confirm") ?? "").trim().toUpperCase() !== "DELETE") redirect("/account?delete=confirm");
  const email = user.email;
  await deleteUserCompletely(user.id);
  try {
    await sendEmail({ to: email, ...emails.accountDeleted() });
  } catch {}
  redirect("/account/deleted");
}

export async function signOutAction() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/");
}
