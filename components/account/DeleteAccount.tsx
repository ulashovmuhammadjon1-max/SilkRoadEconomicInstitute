"use client";

import { useState } from "react";
import { deleteAccount } from "@/app/account/actions";
import { inputCls } from "./Field";

/** Two-step account deletion: open the panel, type DELETE, confirm. */
export function DeleteAccount({ askedConfirm }: { askedConfirm: boolean }) {
  const [open, setOpen] = useState(askedConfirm);
  const [text, setText] = useState("");
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-ui font-medium text-rust underline underline-offset-4">
        Delete my account…
      </button>
    );
  }
  return (
    <form action={deleteAccount} className="space-y-4 rounded-2xl border border-rust/40 bg-[#FBE9E3] p-5">
      <p className="text-ink">
        This permanently deletes your account, your profile and any forum registrations. It can&rsquo;t be undone.
      </p>
      <label htmlFor="confirm" className="block text-ui font-medium text-midnight">
        Type <strong>DELETE</strong> to confirm
      </label>
      <input id="confirm" name="confirm" autoComplete="off" value={text} onChange={(e) => setText(e.target.value)} className={`${inputCls} max-w-xs`} />
      {askedConfirm && text === "" && <p className="text-sm text-rust">Please type DELETE to confirm.</p>}
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={text.trim().toUpperCase() !== "DELETE"} className="btn bg-rust text-paper hover:bg-[#8C3B2E] disabled:opacity-50">
          Permanently delete
        </button>
        <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost">
          Cancel
        </button>
      </div>
    </form>
  );
}
