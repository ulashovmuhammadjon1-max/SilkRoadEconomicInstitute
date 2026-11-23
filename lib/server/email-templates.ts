import "server-only";

/** Plain, brand-styled transactional emails (cream paper, serif headings). */
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function layout({ title, body, button, footer }: { title: string; body: string[]; button?: { label: string; url: string }; footer?: string }) {
  const html = `<!doctype html><html><body style="margin:0;background:#F5EFE3;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;color:#16202F">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#FBF8F2;border-top:3px solid #1B2A4A">
<tr><td style="padding:28px 32px 8px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#7A5F28">Silk Road Economic Institute</td></tr>
<tr><td style="padding:8px 32px 0;font-size:26px;line-height:1.25;color:#1B2A4A">${esc(title)}</td></tr>
${body.map((p) => `<tr><td style="padding:16px 32px 0;font-size:16px;line-height:1.6">${esc(p)}</td></tr>`).join("")}
${button ? `<tr><td style="padding:28px 32px 4px"><a href="${esc(button.url)}" style="display:inline-block;background:#1B2A4A;color:#F5EFE3;text-decoration:none;font-family:Arial,sans-serif;font-size:15px;padding:14px 22px">${esc(button.label)}</a></td></tr>
<tr><td style="padding:12px 32px 0;font-family:Arial,sans-serif;font-size:12px;line-height:1.5;color:#5B6475">If the button doesn't work, copy this link:<br>${esc(button.url)}</td></tr>` : ""}
<tr><td style="padding:28px 32px 28px;font-family:Arial,sans-serif;font-size:12px;line-height:1.5;color:#5B6475;border-bottom:1px solid #DDD0B5">${footer ? esc(footer) : "You received this email from silkroadecon.asia."}</td></tr>
</table></td></tr></table></body></html>`;
  const text = [title, "", ...body, ...(button ? ["", `${button.label}: ${button.url}`] : []), "", footer ?? "You received this email from silkroadecon.asia."].join("\n");
  return { html, text };
}

export const emails = {
  magicLink: (url: string) => ({
    subject: "Your sign-in link for SREI",
    ...layout({
      title: "Sign in to SREI",
      body: ["Use the button below to sign in. The link works once and expires in 10 minutes."],
      button: { label: "Sign in", url },
      footer: "If you didn't ask to sign in, you can ignore this email. Nobody can sign in without this link.",
    }),
  }),
  newsletterConfirm: (url: string) => ({
    subject: "Confirm your subscription to SREI briefs",
    ...layout({
      title: "One more step",
      body: ["Please confirm that you want to receive SREI's weekly briefs on remittances, exchange rates and labor migration."],
      button: { label: "Confirm subscription", url },
      footer: "If you didn't sign up, ignore this email and you won't hear from us.",
    }),
  }),
  newsletterWelcome: (unsubscribeUrl: string) => ({
    subject: "You're subscribed to SREI briefs",
    ...layout({
      title: "You're subscribed",
      body: ["Thank you. You'll receive new SREI briefs by email.", `To unsubscribe at any time, use this link: ${unsubscribeUrl}`],
      footer: "Silk Road Economic Institute · silkroadecon.asia",
    }),
  }),
  accountDeleted: () => ({
    subject: "Your SREI account has been deleted",
    ...layout({
      title: "Account deleted",
      body: ["Your SREI account and the information in it have been deleted, as you asked.", "If this wasn't you, please reply to this email."],
    }),
  }),
};
