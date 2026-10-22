export type Consent = "accepted" | "rejected";
const KEY = "taphub-consent";
export const CONSENT_EVENT = "taphub:consent";

export function readConsent(): Consent | null {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "accepted" || v === "rejected" ? v : null;
  } catch {
    return null;
  }
}

export function writeConsent(v: Consent) {
  try {
    window.localStorage.setItem(KEY, v);
  } catch {
    /* penyimpanan diblokir: pilihan tetap berlaku sampai halaman ditutup */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: v }));
}
