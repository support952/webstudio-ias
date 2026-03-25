/** Event name must match `live-chat-widget` listener. Kept in a tiny module so pages can open chat without importing the heavy widget bundle. */
export const OPEN_LIVE_CHAT_EVENT = "openLiveChat";

export function openLiveChat() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(OPEN_LIVE_CHAT_EVENT));
  }
}
