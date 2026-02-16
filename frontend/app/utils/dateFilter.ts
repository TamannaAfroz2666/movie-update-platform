// src/app/utils/dateFilter.ts
export type DateWindowMode = "day" | "week";
export function isWithinWindow(dateStr: string | null | undefined, mode: "" | "day" | "week") {

 if (!mode) return true;
   if (!dateStr) return false;

  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return false;

  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const startOfItem = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate()
  );

  const diffDays = Math.floor(
    (startOfToday.getTime() - startOfItem.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (mode === "day") {
    return diffDays === 0;      //Today only
  }

  if (mode === "week") {
    return diffDays >= 0 && diffDays <= 7; //last 7 days
  }

  return true;
}
