import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { WithPlaceholders } from "@/components/Placeholder";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: "What the Silk Road Economic Institute collects, why, where it is stored, and how to delete it.",
  alternates: { canonical: "/privacy" },
};

const SECTIONS: { h: string; p: string[] }[] = [
  {
    h: "Who we are",
    p: [
      `The Silk Road Economic Institute (SREI) is an independent, youth-led research initiative based in Tashkent, Uzbekistan. Contact: ${site.email}.`,
      "[placeholder: legal review — name of the person or entity responsible for the data, if different]",
    ],
  },
  {
    h: "What we collect, and why",
    p: [
      "Reading the website: we use Vercel Web Analytics, which counts page views without cookies and without identifying you.",
      "Newsletter: only your email address, to send you new briefs. Nothing is sent until you confirm by clicking the link in our email.",
      "Accounts: your email address; your name, country, school or university, level of study and year of birth; optionally your Telegram username and a short bio. We use these to review forum submissions and to contact you about the forum.",
      "Year of birth is used only to check that you are at least 13, and whether a parent's or guardian's agreement is needed (under 18). If you are under 13, no account is created and nothing is kept.",
      "For participants under 18: a record that a parent or guardian agreed, with the date, and optionally their email address.",
      "We do not collect phone numbers, home addresses or photos of participants, and we do not sell or share personal data for advertising.",
    ],
  },
  {
    h: "Who can see it",
    p: [
      "Profiles are never shown on the public website. Only the SREI team can see them. Nothing you enter is published unless your research is selected and you agreed to publication as an SREI Working Paper.",
      "Academic reviewers may see forum submissions to judge them. [placeholder: legal review — whether reviewers see names]",
    ],
  },
  {
    h: "Where it is stored",
    p: [
      "The website runs on Vercel. Account and newsletter data are stored in a Postgres database hosted by Neon. Emails are sent through Resend. [placeholder: legal review — hosting regions and transfer safeguards]",
    ],
  },
  {
    h: "How long we keep it",
    p: [
      "Account data: until you delete your account. Newsletter: until you unsubscribe. Unconfirmed newsletter sign-ups are not used and may be removed after 7 days. [placeholder: legal review — retention for forum submissions after an edition ends]",
    ],
  },
  {
    h: "Your choices",
    p: [
      "You can edit your profile or permanently delete your account at any time from My account. Deleting it removes your profile and registrations immediately.",
      "Every newsletter email has a one-click unsubscribe link.",
      `For any other request, write to ${site.email}.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Privacy" title="Privacy notice">
        Plain language: what we collect, why, where it is kept, and how to remove it. Last updated: <WithPlaceholders text="[date of legal review]" />.
      </PageHeader>
      <div className="page grid-12 py-12">
        <div className="col-span-12 space-y-12 lg:col-span-8 lg:col-start-3">
          <p className="rounded-2xl border border-dashed border-gold p-5 text-sm text-ink-soft">
            This notice has not yet been reviewed by a legal professional. Sections marked as placeholders will be completed before on-site registration opens.
          </p>
          {SECTIONS.map((s) => (
            <section key={s.h}>
              <h2 className="font-serif text-h2 text-midnight">{s.h}</h2>
              <div className="mt-4 space-y-4 text-lead text-ink-soft">
                {s.p.map((t) => (
                  <p key={t}>
                    <WithPlaceholders text={t} />
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
