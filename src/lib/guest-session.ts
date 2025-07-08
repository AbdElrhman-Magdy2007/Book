import { v4 as uuidv4 } from "uuid";

export function ensureGuestSession() {
  if (typeof window === "undefined") return;
  if (
    !document.cookie.split("; ").find((row) => row.startsWith("cart_session="))
  ) {
    const sessionId = uuidv4();
    document.cookie = `cart_session=${sessionId}; path=/; max-age=31536000`; // 1 year
  }
}
