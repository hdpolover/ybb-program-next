'use client';

import { Bot, Send, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { jysSectionTheme } from '@/lib/theme/jys-components';

type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  text: string;
};

function uid(): string {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function ChatWidget() {
  const theme = jysSectionTheme.chatWidget;

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Yoo wassup! I\'m Hilmi Farrel, your personal assistant. Ask me anything about the program.',
    },
  ]);

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [open, messages.length]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const unreadBadge = useMemo(() => {
    return open ? 0 : 1;
  }, [open]);

  const onSend = () => {
    const text = draft.trim();
    if (!text) return;

    setMessages(prev => [
      ...prev,
      { id: uid(), role: 'user', text },
      {
        id: uid(),
        role: 'assistant',
        text: "Thanks! (UI only for now) I'll be able to answer once the AI is connected.",
      },
    ]);
    setDraft('');
  };

  return (
    <div className={theme.wrapper}>
      {open ? (
        <section className={theme.panel} aria-label="AI Bot chat">
          <header className={theme.panelHeader}>
            <div>
              <div className={theme.panelTitle}>AI Bot</div>
              <div className={theme.panelSubtitle}>Ask about programs, payments, submissions.</div>
            </div>
            <button
              type="button"
              className={theme.closeButton}
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div ref={listRef} className={theme.messages}>
            {messages.map(m => (
              <div
                key={m.id}
                className={`${theme.messageRow} ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`${theme.messageBubbleBase} ${
                    m.role === 'user' ? theme.messageBubbleUser : theme.messageBubbleAssistant
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className={theme.inputRow}>
            <input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') onSend();
              }}
              placeholder="Type your message..."
              className={theme.input}
            />
            <button
              type="button"
              onClick={onSend}
              className={theme.sendButton}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </section>
      ) : null}

      <button
        type="button"
        className={theme.fab}
        onClick={() => setOpen(prev => !prev)}
        aria-label="Open AI Bot"
      >
        <Bot className={theme.fabIcon} />
        {unreadBadge ? <span className={theme.fabBadge} /> : null}
      </button>
    </div>
  );
}
