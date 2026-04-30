import SectionHeader from '@/components/ui/SectionHeader';
import {
  Calendar,
  Check,
  CreditCard,
  MapPin,
  Users,
  ShieldCheck,
  AlertTriangle,
  ClipboardCheck,
  BarChart3,
} from 'lucide-react';
import { componentsTheme } from '@/lib/theme/components';
import type {
  RegistrationInfoInstruction,
  RegistrationInfoPricingTier,
} from '@/types/programs';

type RegistrationTypeProgramsProps = {
  pricingTiers?: RegistrationInfoPricingTier[];
  instructions?: RegistrationInfoInstruction[];
  title?: string;
  description?: string;
  status?: string;
  registrationDates?: {
    open: string | null;
    close: string | null;
  } | null;
};

function normalizeDisplayValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint') {
    return String(value);
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'object') {
    const candidate = value as Record<string, unknown>;
    const nested = candidate.$date ?? candidate.date ?? candidate.value ?? candidate.iso;
    if (nested !== undefined) {
      return normalizeDisplayValue(nested);
    }
  }
  const text = String(value);
  return text === '[object Object]' ? '' : text;
}

export default function RegistrationTypePrograms({
  pricingTiers,
  instructions,
  title,
  description,
  status,
  registrationDates,
}: RegistrationTypeProgramsProps) {
  if (!pricingTiers && !instructions) return null;

  const primaryType = pricingTiers?.[0];
  const secondaryType = pricingTiers?.[1];

  const primaryBenefits = primaryType?.benefits ?? [];
  const secondaryBenefits = secondaryType?.benefits ?? [];

  const isOpen = (status || '').toLowerCase() === 'open';

  const formatDateRange = (open?: unknown, close?: unknown): string | null => {
    if (!open && !close) return null;

    const safeFormat = (value: unknown) => {
      const normalized = normalizeDisplayValue(value);
      if (!normalized) return '';
      const parsed = new Date(normalized);
      if (Number.isNaN(parsed.getTime())) return normalized;
      return parsed.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    };

    const openLabel = safeFormat(open);
    const closeLabel = safeFormat(close);

    if (openLabel && closeLabel) return `${openLabel} – ${closeLabel}`;
    return openLabel || closeLabel || null;
  };

  const formatTierPrice = (currency: string | undefined, price: unknown): string => {
    const normalizedCurrency = normalizeDisplayValue(currency ?? '');
    const normalizedPrice = normalizeDisplayValue(price);
    return `${normalizedCurrency} ${normalizedPrice}`.trim();
  };

  const registrationPeriodLabel = formatDateRange(
    registrationDates?.open ?? null,
    registrationDates?.close ?? null,
  );

  const infoInstructions: RegistrationInfoInstruction[] =
    instructions && instructions.length > 0 ? instructions : [];

  const selfFundedRequirements = primaryType?.requirements?.length
    ? primaryType.requirements
    : [
        'Complete registration form and documentation',
        'Submit required documents on time',
        'Pay fees according to scheduled payment batches',
      ];

  const fullyFundedRequirements = secondaryType?.requirements?.length
    ? secondaryType.requirements
    : [
        'Complete registration form and documentation',
        'Submit detailed essays and applications',
        'Participate in interviews and evaluations',
      ];

  const renderInstructionIcon = (icon: string) => {
    switch (icon) {
      case 'calendar':
        return <Calendar className="h-4 w-4" />;
      case 'chart':
        return <BarChart3 className="h-4 w-4" />;
      case 'clipboard-check':
        return <ClipboardCheck className="h-4 w-4" />;
      case 'shield-check':
        return <ShieldCheck className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <section className={componentsTheme.homeRegistration.sectionWrapper}>
      <div className={componentsTheme.homeRegistration.container}>
        <SectionHeader
          eyebrow="Registration"
          title={title || 'Choose Your Registration Type'}
          subtitle={description}
        />

        <div className={componentsTheme.homeRegistration.mainGrid}>
          {/* Kiri: kartu tipe registrasi (replikasi dari Registration Types di homepage) */}
          <div className={componentsTheme.homeRegistration.cardsGrid}>
            {/* Self Funded */}
            <div className={componentsTheme.applyRegistrationTypes.card}>
              <div className={componentsTheme.applyRegistrationTypes.headerWrapper}>
                <div className={componentsTheme.applyRegistrationTypes.headerRow}>
                  <div className={componentsTheme.applyRegistrationTypes.headerTitleRow}>
                    <span className={componentsTheme.applyRegistrationTypes.iconCircle}>
                      <CreditCard className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className={componentsTheme.applyRegistrationTypes.headerTitle}>
                        {primaryType?.name ?? 'Self Funded'}
                      </h3>
                    </div>
                  </div>
                  <span
                    className={
                      isOpen
                        ? componentsTheme.applyRegistrationTypes.statusBadgeOpen
                        : componentsTheme.applyRegistrationTypes.statusBadgeClosed
                    }
                  >
                    {isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
                {primaryType && (
                  <div className={componentsTheme.applyRegistrationTypes.feeRow}>
                    <span className={componentsTheme.applyRegistrationTypes.priceText}>
                      {formatTierPrice(primaryType.currency, primaryType.price)}
                    </span>
                    <span className={componentsTheme.applyRegistrationTypes.feeLabel}>
                      Registration Fee
                    </span>
                  </div>
                )}
                {registrationPeriodLabel && (
                  <div className={componentsTheme.applyRegistrationTypes.periodRow}>
                    <Calendar className={componentsTheme.applyRegistrationTypes.calendarIcon} />
                    <span className={componentsTheme.applyRegistrationTypes.periodLabel}>
                      Registration Period:
                    </span>
                    <span>{registrationPeriodLabel}</span>
                  </div>
                )}
              </div>
              <div className={componentsTheme.applyRegistrationTypes.bodyWrapper}>
                <p className={componentsTheme.applyRegistrationTypes.sectionLabel}>
                  Requirements
                </p>
                <ul className={componentsTheme.applyRegistrationTypes.list}>
                  {selfFundedRequirements.map((label, idx) => (
                    <li key={idx} className={componentsTheme.applyRegistrationTypes.listItemRow}>
                      <span
                        className={`${componentsTheme.applyRegistrationTypes.bulletCircle} shrink-0`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span className={componentsTheme.applyRegistrationTypes.listItemText}>
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>
                {primaryBenefits.length > 0 && (
                  <>
                    <p className={componentsTheme.applyRegistrationTypes.bodySectionSpacer}>
                      Benefit
                    </p>
                    <ul className={componentsTheme.applyRegistrationTypes.list}>
                      {primaryBenefits.map((label, idx) => (
                        <li key={idx} className={componentsTheme.applyRegistrationTypes.listItemRow}>
                          <span
                            className={`${componentsTheme.applyRegistrationTypes.bulletCircle} shrink-0`}
                          >
                            <Check className="h-3 w-3" />
                          </span>
                          <span className={componentsTheme.applyRegistrationTypes.listItemText}>
                            {label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              <div className={componentsTheme.applyRegistrationTypes.cardFooter}>
                <div className={componentsTheme.applyRegistrationTypes.ctaWrapper}>
                  <a
                    href="/apply/self-funded"
                    className={`${
                      componentsTheme.applyRegistrationTypes.ctaButton
                    } ${componentsTheme.applyRegistrationTypes.ctaButtonWide}`}
                  >
                    See Details
                  </a>
                </div>
              </div>
            </div>

            {/* Fully Funded */}
            <div className={componentsTheme.applyRegistrationTypes.card}>
              <div className={componentsTheme.applyRegistrationTypes.headerWrapper}>
                <div className={componentsTheme.applyRegistrationTypes.headerRowTopAligned}>
                  <div className={componentsTheme.applyRegistrationTypes.headerTitleRow}>
                    <span className={componentsTheme.applyRegistrationTypes.iconCircle}>
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className={componentsTheme.applyRegistrationTypes.headerTitle}>
                        {secondaryType?.name ?? 'Fully Funded'}
                      </h3>
                    </div>
                  </div>
                  <span
                    className={
                      isOpen
                        ? componentsTheme.applyRegistrationTypes.statusBadgeOpen
                        : componentsTheme.applyRegistrationTypes.statusBadgeClosed
                    }
                  >
                    {isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
                {secondaryType && (
                  <div className={componentsTheme.applyRegistrationTypes.feeRow}>
                    <span className={componentsTheme.applyRegistrationTypes.priceText}>
                      {formatTierPrice(secondaryType.currency, secondaryType.price)}
                    </span>
                    <span className={componentsTheme.applyRegistrationTypes.feeLabel}>
                      Registration Fee
                    </span>
                  </div>
                )}
                {registrationPeriodLabel && (
                  <div className={componentsTheme.applyRegistrationTypes.periodRow}>
                    <Calendar className={componentsTheme.applyRegistrationTypes.calendarIcon} />
                    <span className={componentsTheme.applyRegistrationTypes.periodLabel}>
                      Registration Period:
                    </span>
                    <span>{registrationPeriodLabel}</span>
                  </div>
                )}
              </div>
              <div className={componentsTheme.applyRegistrationTypes.bodyWrapper}>
                <p className={componentsTheme.applyRegistrationTypes.sectionLabel}>Requirements</p>
                <ul className={componentsTheme.applyRegistrationTypes.list}>
                  {fullyFundedRequirements.map((label, idx) => (
                    <li key={idx} className={componentsTheme.applyRegistrationTypes.listItemRow}>
                      <span
                        className={`${componentsTheme.applyRegistrationTypes.bulletCircle} shrink-0`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span className={componentsTheme.applyRegistrationTypes.listItemText}>
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>
                {secondaryBenefits.length > 0 && (
                  <>
                    <p className={componentsTheme.applyRegistrationTypes.bodySectionSpacer}>
                      Benefit (If Selected)
                    </p>
                    <ul className={componentsTheme.applyRegistrationTypes.list}>
                      {secondaryBenefits.map((label, idx) => (
                        <li key={idx} className={componentsTheme.applyRegistrationTypes.listItemRow}>
                          <span
                            className={`${componentsTheme.applyRegistrationTypes.bulletCircle} shrink-0`}
                          >
                            <Check className="h-3 w-3" />
                          </span>
                          <span className={componentsTheme.applyRegistrationTypes.listItemText}>
                            {label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              <div className={componentsTheme.applyRegistrationTypes.cardFooter}>
                <div className={componentsTheme.applyRegistrationTypes.ctaWrapper}>
                  {isOpen ? (
                    <a
                      href="/apply/fully-funded"
                      className={`${
                        componentsTheme.applyRegistrationTypes.ctaButton
                      } ${componentsTheme.applyRegistrationTypes.ctaButtonWide}`}
                    >
                      See Details
                    </a>
                  ) : (
                    <button
                      type="button"
                      aria-disabled
                      className={componentsTheme.applyRegistrationTypes.ctaButtonDisabled}
                    >
                      See Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Kanan: informasi tambahan seputar registrasi */}
          <div className={componentsTheme.homeImportantPayment.infoSideWrapper}>
            <div className={componentsTheme.homeImportantPayment.infoSideCard}>
              <div>
                <h3 className={componentsTheme.homeImportantPayment.infoTitle}>
                  Registration Information
                </h3>
                <p className={componentsTheme.homeImportantPayment.infoIntro}>
                  Make sure you understand the key details about payments, selection, guarantees, and important deadlines before choosing your registration type. This overview is designed to help you make a well-informed decision.
                </p>

                {infoInstructions.length > 0 && (
                  <div className={componentsTheme.homeImportantPayment.infoPointsWrapper}>
                    {infoInstructions.map(item => (
                      <div
                        key={item.title}
                        className={componentsTheme.homeImportantPayment.infoPointRow}
                      >
                        <span className={componentsTheme.homeImportantPayment.infoPointIcon}>
                          {renderInstructionIcon(item.icon)}
                        </span>
                        <div>
                          <p className={componentsTheme.homeImportantPayment.infoPointTitle}>
                            {item.title}
                          </p>
                          <p className={componentsTheme.homeImportantPayment.infoPointBody}>
                            {item.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={componentsTheme.homeImportantPayment.infoFooter}>
                For complete terms and conditions, please read the official guidebook and FAQ on the official program website and check regularly for the most recent updates from the organizing committee.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
