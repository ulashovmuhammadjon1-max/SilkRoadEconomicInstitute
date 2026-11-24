import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DeleteAccount } from "@/components/account/DeleteAccount";
import { ProfileForm } from "@/components/account/ProfileForm";
import { Glyph } from "@/components/ornaments/Glyph";
import { getForum } from "@/lib/content";
import type { COUNTRY_CODES } from "@/lib/countries";
import { features } from "@/lib/features";
import { query } from "@/lib/server/db";
import { getProfile, isAdmin, requireUser } from "@/lib/server/session";
import { signOutAction } from "./actions";

export const metadata: Metadata = { title: "My account", robots: { index: false } };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ welcome?: string; delete?: string }> }) {
  if (!features.accounts) notFound();
  const user = await requireUser("/account");
  const profile = await getProfile(user.id);
  if (!profile) redirect("/account/setup");
  const sp = await searchParams;
  const guardian = (await query<{ guardian_email: string | null }>("select guardian_email from guardian_consents where user_id = $1", [user.id]))[0];
  const admin = await isAdmin(user.email);
  const { current } = getForum();

  return (
    <section className="page py-14 md:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label">My account</p>
          <h1 className="mt-3 font-serif text-h1 text-midnight">{sp.welcome ? `Welcome, ${profile.full_name.split(" ")[0]}` : profile.full_name}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {admin && (
            <Link href="/dashboard" className="btn btn-ghost min-h-11">
              Dashboard
            </Link>
          )}
          <form action={signOutAction}>
            <button type="submit" className="btn btn-ghost min-h-11">
              Sign out
            </button>
          </form>
        </div>
      </div>
      {sp.welcome && (
        <p role="status" className="mt-6 rounded-2xl border border-turquoise/40 bg-[#E6F4F3] p-5 text-ink">
          Your profile is ready. When forum registration opens, you&rsquo;ll be able to submit your research from here.
        </p>
      )}

      <div className="mt-12 grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-5">
          <section aria-labelledby="regs" className="rounded-[28px] bg-midnight p-7 text-cream">
            <h2 id="regs" className="font-mono text-label uppercase text-turquoise-light">
              My forum registrations
            </h2>
            <p className="mt-4 font-serif text-h3">{current.name}</p>
            <p className="mt-2 text-cream/75">
              {current.registrationMode === "site" && current.registrationOpen
                ? "Registration is open."
                : "On-site registration opens soon. Until then, submissions go through the form on the Forum page."}
            </p>
            <p className="mt-5 text-sm text-cream/60">You have no registrations yet.</p>
            <Link href="/forum" className="mt-6 inline-flex items-center gap-2 text-sm text-turquoise-light hover:text-cream">
              Forum details <Glyph name="arrow" size={16} />
            </Link>
          </section>
          <section aria-labelledby="privacy-h" className="rounded-[28px] border border-cream-300 bg-paper p-7">
            <h2 id="privacy-h" className="font-mono text-label uppercase text-ink-muted">
              Your data
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-ink-muted">Email</dt>
                <dd className="text-ink">{user.email}</dd>
              </div>
              {guardian && (
                <div>
                  <dt className="text-ink-muted">Parent or guardian agreement</dt>
                  <dd className="text-ink">Confirmed{guardian.guardian_email ? ` · ${guardian.guardian_email}` : ""}</dd>
                </div>
              )}
            </dl>
            <p className="mt-4 text-sm text-ink-soft">
              Read how we handle it in our{" "}
              <Link href="/privacy" className="link">
                privacy notice
              </Link>
              .
            </p>
            <div className="mt-6 border-t border-cream-300 pt-5">
              <DeleteAccount askedConfirm={sp.delete === "confirm"} />
            </div>
          </section>
        </div>
        <section aria-labelledby="profile-h" className="rounded-[28px] border border-cream-300 bg-paper p-6 md:p-10 lg:col-span-7">
          <h2 id="profile-h" className="mb-6 font-serif text-h2 text-midnight">
            Profile
          </h2>
          <ProfileForm
            mode="edit"
            email={user.email}
            initial={{
              fullName: profile.full_name,
              country: profile.country as (typeof COUNTRY_CODES)[number],
              institution: profile.institution,
              educationLevel: profile.education_level,
              birthYear: profile.birth_year,
              telegram: profile.telegram ?? "",
              bio: profile.bio ?? "",
              guardianConfirmed: Boolean(guardian),
              guardianEmail: guardian?.guardian_email ?? "",
            }}
          />
        </section>
      </div>
    </section>
  );
}
