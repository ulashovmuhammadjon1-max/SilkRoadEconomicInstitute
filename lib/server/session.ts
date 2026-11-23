import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { query } from "./db";

export type Profile = {
  user_id: string;
  full_name: string;
  country: string;
  institution: string;
  education_level: "high_school" | "undergraduate" | "graduate";
  birth_year: number;
  telegram: string | null;
  bio: string | null;
};

/** The signed-in user, derived from the session cookie only (never from client input). */
export async function getUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

export async function requireUser(next = "/account") {
  const user = await getUser();
  if (!user) redirect(`/signin?next=${encodeURIComponent(next)}`);
  return user;
}

export async function getProfile(userId: string) {
  const rows = await query<Profile>("select user_id, full_name, country, institution, education_level, birth_year, telegram, bio from profiles where user_id = $1", [userId]);
  return rows[0] ?? null;
}

export async function isAdmin(email: string) {
  const rows = await query("select 1 from admin_users where email = $1", [email.toLowerCase()]);
  return rows.length > 0;
}
