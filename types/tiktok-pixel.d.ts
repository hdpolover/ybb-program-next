// types/tiktok-pixel.d.ts
interface Window {
  ttq?: {
    // Standard and custom event names both go through `track`; the third arg
    // carries event_id, which is how TikTok dedupes browser vs Events API.
    track?: (eventName: string, params?: Record<string, unknown>, options?: { event_id?: string }) => void;
    page?: () => void;
    identify?: (params: Record<string, unknown>) => void;
  };
}
