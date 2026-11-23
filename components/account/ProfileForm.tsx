"use client";

import { track } from "@vercel/analytics";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { saveProfile } from "@/app/account/actions";
import { countryOptions } from "@/lib/countries";
import { isTooYoung, MIN_AGE, needsGuardian, profileSchema, type ProfileInput } from "@/lib/schemas";
import { Glyph } from "../ornaments/Glyph";
import { Field, inputCls } from "./Field";

type Initial = Partial<Omit<ProfileInput, "birthYear">> & { birthYear?: number | string };

export function ProfileForm({ initial, email, mode }: { initial: Initial; email: string; mode: "setup" | "edit" }) {
  const router = useRouter();
  const countries = useMemo(() => countryOptions(), []);
  const [v, setV] = useState<Initial>({ guardianConfirmed: false, ...initial });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [blocked, setBlocked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();
  const year = Number(v.birthYear);
  const validYear = Number.isInteger(year) && year > 1900;
  const minor = validYear && !isTooYoung(year) && needsGuardian(year);

  const set = (k: keyof Initial) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setSaved(false);
    setV((s) => ({ ...s, [k]: e.target instanceof HTMLInputElement && e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  };
  const err = (k: string) => (errors[k] ? { "aria-invalid": true, "aria-describedby": `${k}-error` } : {});

  function focusFirst(errs: Record<string, string>) {
    const order = ["fullName", "country", "institution", "educationLevel", "birthYear", "guardianConfirmed", "guardianEmail", "telegram", "bio"];
    const first = order.find((k) => errs[k]);
    if (first) document.getElementById(first)?.focus();
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const local = profileSchema.safeParse(v);
    if (!local.success) {
      const errs: Record<string, string> = {};
      for (const i of local.error.issues) errs[String(i.path[0])] ??= i.message;
      setErrors(errs);
      focusFirst(errs);
      if (validYear && isTooYoung(year)) {
        // Server also deletes any account data for under-13s.
        start(async () => {
          await saveProfile(v as ProfileInput);
          setBlocked(true);
        });
      }
      return;
    }
    setErrors({});
    start(async () => {
      const r = await saveProfile(v as ProfileInput);
      if (!r.ok) {
        setErrors(r.errors);
        if (r.blocked) setBlocked(true);
        focusFirst(r.errors);
        return;
      }
      if (r.created) track("account_created");
      setSaved(true);
      if (mode === "setup") router.push("/account?welcome=1");
      else router.refresh();
    });
  }

  if (blocked) {
    return (
      <div role="alert" className="border-l-2 border-rust pl-5">
        <p className="font-serif text-h3 text-navy">Sorry, you need to be at least {MIN_AGE}</p>
        <p className="mt-2 text-ink-soft">
          SREI accounts are for students aged {MIN_AGE} and over, so we haven&rsquo;t kept any of your details and you have been signed out. You can
          still read all our briefs and working papers.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-7">
      <p className="text-sm text-ink-muted">
        Signed in as <strong className="text-navy">{email}</strong>. Your profile is private: it is never shown on the public site.
      </p>
      <Field id="fullName" label="Full name" error={errors.fullName}>
        <input id="fullName" autoComplete="name" value={v.fullName ?? ""} onChange={set("fullName")} className={inputCls} {...err("fullName")} />
      </Field>
      <div className="grid gap-7 sm:grid-cols-2">
        <Field id="country" label="Country" error={errors.country}>
          <select id="country" autoComplete="country" value={v.country ?? ""} onChange={set("country")} className={inputCls} {...err("country")}>
            <option value="">Choose…</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field id="educationLevel" label="Level of study" error={errors.educationLevel}>
          <select id="educationLevel" value={v.educationLevel ?? ""} onChange={set("educationLevel")} className={inputCls} {...err("educationLevel")}>
            <option value="">Choose…</option>
            <option value="high_school">High school</option>
            <option value="undergraduate">University (undergraduate)</option>
            <option value="graduate">University (graduate)</option>
          </select>
        </Field>
      </div>
      <Field id="institution" label="School or university" error={errors.institution}>
        <input id="institution" autoComplete="organization" value={v.institution ?? ""} onChange={set("institution")} className={inputCls} {...err("institution")} />
      </Field>
      <Field id="birthYear" label="Year of birth" hint={`Only used to check that you are ${MIN_AGE} or older, and whether we need a parent's or guardian's agreement.`} error={errors.birthYear}>
        <input
          id="birthYear"
          inputMode="numeric"
          autoComplete="bday-year"
          maxLength={4}
          value={v.birthYear ?? ""}
          onChange={set("birthYear")}
          className={`${inputCls} max-w-[10rem]`}
          {...err("birthYear")}
          aria-describedby={errors.birthYear ? "birthYear-error" : "birthYear-hint"}
        />
      </Field>

      {minor && (
        <fieldset className="space-y-5 border-l-2 border-gold bg-cream-50 p-5">
          <legend className="sr-only">Parent or guardian agreement</legend>
          <p className="text-ink-soft">Because you are under 18, a parent or guardian needs to know about and agree to your participation.</p>
          <label htmlFor="guardianConfirmed" className="flex items-start gap-3">
            <input
              id="guardianConfirmed"
              type="checkbox"
              checked={Boolean(v.guardianConfirmed)}
              onChange={set("guardianConfirmed")}
              className="mt-1 h-5 w-5 accent-navy"
              {...err("guardianConfirmed")}
            />
            <span>My parent or guardian knows about my participation in SREI and agrees to it.</span>
          </label>
          {errors.guardianConfirmed && (
            <p id="guardianConfirmed-error" className="text-sm font-medium text-rust">
              {errors.guardianConfirmed}
            </p>
          )}
          <Field id="guardianEmail" label="Parent's or guardian's email" optional hint="We'll only use it if we need to contact them about your participation." error={errors.guardianEmail}>
            <input id="guardianEmail" type="email" autoComplete="off" value={v.guardianEmail ?? ""} onChange={set("guardianEmail")} className={inputCls} {...err("guardianEmail")} />
          </Field>
        </fieldset>
      )}

      <Field id="telegram" label="Telegram username" optional error={errors.telegram}>
        <input id="telegram" value={v.telegram ?? ""} onChange={set("telegram")} placeholder="@username" className={`${inputCls} max-w-xs`} {...err("telegram")} />
      </Field>
      <Field id="bio" label="A sentence about you" optional hint="For our team only. Up to 500 characters." error={errors.bio}>
        <textarea id="bio" rows={3} maxLength={500} value={v.bio ?? ""} onChange={set("bio")} className={`${inputCls} py-3`} {...err("bio")} />
      </Field>

      {errors.form && (
        <p role="alert" className="text-sm font-medium text-rust">
          {errors.form}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
          {pending ? "Saving…" : mode === "setup" ? "Create my profile" : "Save changes"} <Glyph name="arrow" className="arrow" />
        </button>
        <p aria-live="polite" className="text-sm text-ink-soft">
          {saved && mode === "edit" ? "Saved." : ""}
        </p>
      </div>
    </form>
  );
}
