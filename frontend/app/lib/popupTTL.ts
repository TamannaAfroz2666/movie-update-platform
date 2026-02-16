export const POPUP_KEY = "cineverse_updates_popup"; 
// export const POPUP_TTL_MS = 6 * 60 * 60 * 1000;  // 6 hours 
export const POPUP_TTL_MS = 1* 60 * 1000;  


type PopupRecord = {
  status: "dismissed" | "accepted";
  expiresAt: number;
};

export function getPopupRecord(): PopupRecord | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(POPUP_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as PopupRecord;
  } catch {
    localStorage.removeItem(POPUP_KEY);
    return null;
  }
}

export function isRecordValid(record: PopupRecord) {
  return Date.now() < record.expiresAt;
}

export function setPopupRecord(status: PopupRecord["status"]) {
  if (typeof window === "undefined") return;

  const record: PopupRecord = {
    status,
    expiresAt: Date.now() + POPUP_TTL_MS,
  };

  localStorage.setItem(POPUP_KEY, JSON.stringify(record));
}

export function clearPopupRecord() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(POPUP_KEY);
}
