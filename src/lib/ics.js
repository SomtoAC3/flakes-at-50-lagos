export function makeICS(activity, dateStr) {
  const dt = dateStr.replace(/-/g, "");
  const uid = `${activity.id}@folakeat50`;
  const desc = (activity.description || "").replace(/\n/g, "\\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Folake at 50//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `SUMMARY:${activity.name}`,
    `DESCRIPTION:${desc}`,
    `LOCATION:${activity.location}`,
    `DTSTAMP:${dt}T000000Z`,
    `DTSTART;VALUE=DATE:${dt}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadICS(activity, dateStr) {
  const blob = new Blob([makeICS(activity, dateStr)], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${activity.name.replace(/[^\w]+/g, "-")}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
