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
import { PROGRAMS_REGISTRATION_COPY } from '@/data/programs/sections/registration-info/programsRegistrationInfo';
import type {
  RegistrationInfoInstruction,
  RegistrationInfoPricingTier,
} from '@/types/programs';
import { DATA_NOT_ADDED } from '@/data/programs/shared/constants';

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

export default function RegistrationTypePrograms({
  pricingTiers,
  instructions,
  title,
  description,
  status,
  registrationDates,
}: RegistrationTypeProgramsProps) {
  const primaryType = pricingTiers?.[0];
  const secondaryType = pricingTiers?.[1];

  const primaryBenefits = primaryType?.benefits ?? [];
  const secondaryBenefits = secondaryType?.benefits ?? [];

  const isOpen = (status || '').toLowerCase() === 'open';

  const formatDateRange = (open?: string | null, close?: string | null) => {
    if (!open && !close) return DATA_NOT_ADDED;

    const safeFormat = (value: string | null | undefined) => {
      if (!value) return '';
      try {
        return new Date(value).toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      } catch {
        return value;
      }
    };

    const openLabel = safeFormat(open ?? null);
    const closeLabel = safeFormat(close ?? null);

    if (openLabel && closeLabel) return `${openLabel} – ${closeLabel}`;
    return openLabel || closeLabel || DATA_NOT_ADDED;
  };

  const registrationPeriodLabel = formatDateRange(
    registrationDates?.open ?? null,
    registrationDates?.close ?? null,
  );

  const infoInstructions: RegistrationInfoInstruction[] =
    instructions && instructions.length > 0 ? instructions : [];

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
                      <p className={componentsTheme.applyRegistrationTypes.headerSubtitle}>
                        {PROGRAMS_REGISTRATION_COPY.selfFundedSubtitle}
                      </p>
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
                <div className={componentsTheme.applyRegistrationTypes.feeRow}>
                  <span className={componentsTheme.applyRegistrationTypes.priceText}>
                    {primaryType
                      ? `${primaryType.currency} ${primaryType.price}`
                      : DATA_NOT_ADDED}
                  </span>
                  <span className={componentsTheme.applyRegistrationTypes.feeLabel}>
                    {PROGRAMS_REGISTRATION_COPY.feeLabel}
                  </span>
                </div>
                <div className={componentsTheme.applyRegistrationTypes.periodRow}>
                  <Calendar className={componentsTheme.applyRegistrationTypes.calendarIcon} />
                  <span className={componentsTheme.applyRegistrationTypes.periodLabel}>
                    {PROGRAMS_REGISTRATION_COPY.periodLabel}
                  </span>
                  <span>{registrationPeriodLabel}</span>
                </div>
              </div>
              <div className={componentsTheme.applyRegistrationTypes.bodyWrapper}>
                <p className={componentsTheme.applyRegistrationTypes.sectionLabel}>
                  {PROGRAMS_REGISTRATION_COPY.requirementsTitle}
                </p>
                <ul className={componentsTheme.applyRegistrationTypes.list}>
                  {PROGRAMS_REGISTRATION_COPY.selfFundedRequirements.map((label, idx) => (
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
                <p className={componentsTheme.applyRegistrationTypes.bodySectionSpacer}>
                  {PROGRAMS_REGISTRATION_COPY.selfFundedBenefitTitle}
                </p>
                <ul className={componentsTheme.applyRegistrationTypes.list}>
                  {primaryBenefits.length > 0 ? (
                    primaryBenefits.map((label, idx) => (
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
                    ))
                  ) : (
                    <li className={componentsTheme.applyRegistrationTypes.listItemRow}>
                      <span
                        className={`${componentsTheme.applyRegistrationTypes.bulletCircle} shrink-0`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span className={componentsTheme.applyRegistrationTypes.listItemText}>
                        {DATA_NOT_ADDED}
                      </span>
                    </li>
                  )}
                </ul>
              </div>
              <div className={componentsTheme.applyRegistrationTypes.cardFooter}>
                <div className={componentsTheme.applyRegistrationTypes.ctaWrapper}>
                  <a
                    href="/apply/self-funded"
                    className={`${
                      componentsTheme.applyRegistrationTypes.ctaButton
                    } ${componentsTheme.applyRegistrationTypes.ctaButtonWide}`}
                  >
                    {PROGRAMS_REGISTRATION_COPY.selfFundedCtaLabel}
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
                      <p className={componentsTheme.applyRegistrationTypes.headerSubtitle}>
                        {PROGRAMS_REGISTRATION_COPY.fullyFundedSubtitle}
                      </p>
                    </div>
                  </div>
                  <span className={componentsTheme.applyRegistrationTypes.statusBadgeClosed}>
                    Closed
                  </span>
                </div>
                <div className={componentsTheme.applyRegistrationTypes.feeRow}>
                  <span className={componentsTheme.applyRegistrationTypes.priceText}>
                    {secondaryType
                      ? `${secondaryType.currency} ${secondaryType.price}`
                      : DATA_NOT_ADDED}
                  </span>
                  <span className={componentsTheme.applyRegistrationTypes.feeLabel}>
                    Registration Fee
                  </span>
                </div>
                <div className={componentsTheme.applyRegistrationTypes.periodRow}>
                  <Calendar className={componentsTheme.applyRegistrationTypes.calendarIcon} />
                  <span className={componentsTheme.applyRegistrationTypes.periodLabel}>
                    Registration Period:
                  </span>
                  <span>Aug 01 – Sep 30, 2025</span>
                </div>
              </div>
              <div className={componentsTheme.applyRegistrationTypes.bodyWrapper}>
                <p className={componentsTheme.applyRegistrationTypes.sectionLabel}>Requirements</p>
                <ul className={componentsTheme.applyRegistrationTypes.list}>
                  {PROGRAMS_REGISTRATION_COPY.fullyFundedRequirements.map((label, idx) => (
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
                <p className={componentsTheme.applyRegistrationTypes.bodySectionSpacer}>
                  {PROGRAMS_REGISTRATION_COPY.fullyFundedBenefitTitle}
                </p>
                <ul className={componentsTheme.applyRegistrationTypes.list}>
                  {secondaryBenefits.length > 0 ? (
                    secondaryBenefits.map((label, idx) => (
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
                    ))
                  ) : (
                    <li className={componentsTheme.applyRegistrationTypes.listItemRow}>
                      <span
                        className={`${componentsTheme.applyRegistrationTypes.bulletCircle} shrink-0`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span className={componentsTheme.applyRegistrationTypes.listItemText}>
                        {DATA_NOT_ADDED}
                      </span>
                    </li>
                  )}
                </ul>
              </div>
              <div className={componentsTheme.applyRegistrationTypes.cardFooter}>
                <div className={componentsTheme.applyRegistrationTypes.ctaWrapper}>
                  <button
                    type="button"
                    aria-disabled
                    className={componentsTheme.applyRegistrationTypes.ctaButtonDisabled}
                  >
                    {PROGRAMS_REGISTRATION_COPY.fullyFundedCtaLabel}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Kanan: informasi tambahan seputar registrasi */}
          <div className={componentsTheme.homeImportantPayment.infoSideWrapper}>
            <div className={componentsTheme.homeImportantPayment.infoSideCard}>
              <div>
                <h3 className={componentsTheme.homeImportantPayment.infoTitle}>
                  {PROGRAMS_REGISTRATION_COPY.infoSide.title}
                </h3>
                <p className={componentsTheme.homeImportantPayment.infoIntro}>
                  {PROGRAMS_REGISTRATION_COPY.infoSide.intro}
                </p>

                <div className={componentsTheme.homeImportantPayment.infoPointsWrapper}>
                  {infoInstructions.length > 0 ? (
                    infoInstructions.map(item => (
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
                    ))
                  ) : (
                    <p className={componentsTheme.homeImportantPayment.infoPointBody}>
                      {DATA_NOT_ADDED}
                    </p>
                  )}
                </div>
              </div>

              <div className={componentsTheme.homeImportantPayment.infoFooter}>
                {PROGRAMS_REGISTRATION_COPY.infoSide.footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
