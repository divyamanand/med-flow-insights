export const toISO = (localValue?: string | null) => {
  if (!localValue) return undefined;
  const d = new Date(localValue);
  if (isNaN(d.getTime())) return undefined;
  return d.toISOString();
};

export const isoToLocalInput = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const tzOffset = d.getTimezoneOffset() * 60000;
  const local = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
  return local;
};
