import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ProfileForm } from "@/components/account/ProfileForm";
import { features } from "@/lib/features";
import { getProfile, requireUser } from "@/lib/server/session";

export const metadata: Metadata = { title: "Create your profile", robots: { index: false } };

export default async function SetupPage() {
  if (!features.accounts) notFound();
  const user = await requireUser("/account/setup");
  if (await getProfile(user.id)) redirect("/account");
  return (
    <section className="page grid-12 gap-y-10 py-16 md:py-24">
      <div className="col-span-12 lg:col-span-4">
        <p className="label">Account · Step 2 of 2</p>
        <h1 className="mt-4 font-serif text-h1 text-midnight">Create your profile</h1>
        <p className="mt-5 text-lead text-ink-soft">A few details so we can review your forum submissions. Only the SREI team can see them.</p>
        <ul className="mt-8 space-y-3 text-sm text-ink-soft">
          <li className="flex gap-3"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-turquoise" />Your profile is never shown on the public site.</li>
          <li className="flex gap-3"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-turquoise" />You can change or delete it at any time.</li>
          <li className="flex gap-3"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-turquoise" />Accounts are for students aged 13 and over.</li>
        </ul>
      </div>
      <div className="col-span-12 rounded-[28px] border border-cream-300 bg-paper p-6 md:p-10 lg:col-span-7 lg:col-start-6">
        <ProfileForm mode="setup" email={user.email} initial={{ fullName: user.name && user.name !== user.email ? user.name : "" }} />
      </div>
    </section>
  );
}
