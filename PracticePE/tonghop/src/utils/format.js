export function formatPrice(v) {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isNaN(n) ? "$0.00" : `$${n.toFixed(2)}`;
}
export function assetUrl(p) {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p; // nếu là URL tuyệt đối
  return "/" + p.replace(/^\/+/, ""); // ép về /images/products/....
}
