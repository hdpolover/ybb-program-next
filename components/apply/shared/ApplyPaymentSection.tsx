import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import { getSignupHref } from '@/lib/landing/cta';
import type { ApplyFeeCard } from '@/lib/apply/page-data';

function decodePossiblyEncodedHtml(value: string): string {
  if (!value.includes('&lt;')) return value;
  return value
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, '&');
}

function sanitizeRichHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/\s(href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, '');
}

function markdownToHtml(value: string): string {
  const escaped = value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const withBlocks = escaped
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/^\s*[-*] (.*)$/gm, '<li>$1</li>');

  const withInline = withBlocks
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');

  const groupedLists = withInline.replace(/(?:<li>.*<\/li>\n?)+/g, chunk => `<ul>${chunk}</ul>`);
  const paragraphs = groupedLists
    .split(/\n{2,}/)
    .map(block => block.trim())
    .filter(Boolean)
    .map(block => {
      if (block.startsWith('<h') || block.startsWith('<ul>')) return block;
      return `<p>${block.replace(/\n/g, '<br />')}</p>`;
    })
    .join('');

  return paragraphs || `<p>${escaped}</p>`;
}

function toRichHtml(value: string): string {
  const raw = decodePossiblyEncodedHtml((value ?? '').trim());
  if (!raw) return '';
  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(raw);
  const html = hasHtml ? raw : markdownToHtml(raw);
  return sanitizeRichHtml(html);
}

export type ApplyPaymentSectionProps = {
  schemeLabel: string;
  registrationCard: ApplyFeeCard | null;
  programCard: ApplyFeeCard | null;
  registrationWindow: string | null;
};

function renderCard(card: ApplyFeeCard | null) {
  if (!card) {
    return (
      <div className={componentsTheme.applyPayment.card}>
        <h3 className={componentsTheme.applyPayment.cardTitle}>Not configured</h3>
        <p className={componentsTheme.applyPayment.cardSubtitle}>
          Pricing information is managed from the backend and has not been configured yet.
        </p>
      </div>
    );
  }

  return (
    <div className={componentsTheme.applyPayment.card}>
      <h3 className={componentsTheme.applyPayment.cardTitle}>{card.title}</h3>
      <p className={componentsTheme.applyPayment.cardPrice}>{card.priceLabel}</p>
      <div
        className={`${componentsTheme.applyPayment.cardSubtitle} prose prose-sm max-w-none prose-p:my-0 prose-ul:my-1 prose-ol:my-1 prose-li:ml-4 prose-li:my-1 prose-a:text-primary prose-a:underline prose-a:underline-offset-4`}
        dangerouslySetInnerHTML={{ __html: toRichHtml(card.subtitle) }}
      />

      {card.periods.length > 0 && (
        <div className={componentsTheme.applyPayment.stagesList}>
          {card.periods.map((period, idx) => (
            <div key={`${period.label}-${idx}`} className={componentsTheme.applyPayment.stageItem}>
              <div>
                <p
                  className={
                    idx === 0
                      ? componentsTheme.applyPayment.stageLabel
                      : componentsTheme.applyPayment.stageLabelMuted
                  }
                >
                  {period.label}
                </p>
              </div>
              <div className="text-right">
                <p className={componentsTheme.applyPayment.stagePrice}>{period.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ApplyPaymentSection({
  schemeLabel,
  registrationCard,
  programCard,
  registrationWindow,
}: ApplyPaymentSectionProps) {
  return (
    <section className={componentsTheme.applyPayment.sectionWrapper}>
      <div className={componentsTheme.applyPayment.container}>
        <div className={componentsTheme.applyPayment.headerWrapper}>
          <SectionHeader eyebrow="Payment Information" title="Registration & Program Fees" />
          <p className={componentsTheme.applyPayment.headerSubtitle}>
            Review the backend-configured registration and program fees for the {schemeLabel} scheme.
          </p>
        </div>

        <div className={componentsTheme.applyPayment.cardsGrid}>
          {renderCard(registrationCard)}
          {renderCard(programCard)}
        </div>

        <div className={componentsTheme.applyPayment.footerWrapper}>
          <p className={componentsTheme.applyPayment.footerNote}>
            {registrationWindow ? (
              <>
                <span className={componentsTheme.applyPayment.footerNoteEmphasis}>
                  Registration window:
                </span>{' '}
                {registrationWindow}
              </>
            ) : (
              <span className={componentsTheme.applyPayment.footerNoteEmphasis}>
                Registration schedule is managed by the program team.
              </span>
            )}
          </p>
          <a href={getSignupHref()} className={componentsTheme.applyPayment.footerCta}>
            Register Now
          </a>
        </div>
      </div>
    </section>
  );
}
