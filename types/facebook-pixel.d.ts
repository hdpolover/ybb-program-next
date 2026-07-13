// types/facebook-pixel.d.ts
interface Window {
  fbq?: (
    command: 'track' | 'trackCustom' | 'init',
    eventName: string,
    params?: Record<string, unknown>,
    options?: { eventID?: string },
  ) => void;
}
