export function formatDateTime(value) {
  try {
    return new Date(value).toLocaleString("th-TH");
  } catch {
    return value;
  }
}