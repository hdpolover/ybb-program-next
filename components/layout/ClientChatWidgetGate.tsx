'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

type ClientChatWidgetGateProps = {
  enabled: boolean;
  botId: string;
  primaryColor: string;
};

export default function ClientChatWidgetGate({
  enabled,
  botId,
  primaryColor,
}: ClientChatWidgetGateProps) {
  const pathname = usePathname();

  if (!enabled || !botId) {
    return null;
  }

  if (
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/auth') ||
    pathname?.startsWith('/forgot-password') ||
    pathname?.startsWith('/reset-password') ||
    pathname?.startsWith('/verify-email') ||
    pathname?.startsWith('/onboarding') ||
    pathname?.startsWith('/dashboard')
  ) {
    return null;
  }

  return (
    <Script
      id="aksamu-chat-widget"
      src="https://aksamu.com/chat-widget.js"
      data-bot-id={botId}
      data-primary-color={primaryColor}
      strategy="lazyOnload"
    />
  );
}
