'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import {
  Calendar,
  Check,
  CreditCard,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  ClipboardCheck,
  BarChart3,
  ArrowRight,
  X,
} from 'lucide-react';
import { componentsTheme } from '@/lib/theme/components';
import { getRegistrationPeriodLabel } from '@/lib/format/registration-period';
import type {
  RegistrationInfoInstruction,
  RegistrationInfoPricingTier,
} from '@/types/programs';

type ValidityPeriod = {
  start_date: string;
  end_date: string;
};

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

function isRegistrationOpen(periods: ValidityPeriod[] | undefined, now: Date): boolean {
  if (!periods || periods.length === 0) return false;

  return periods.some((p) => {
    const start = new Date(p.start_date);
    const end = new Date(p.end_date);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;
    return start <= now && now <= end;
  });
}


function normalizeCategory(category: string): 'self_funded' | 'fully_funded' | null {
  const normalized = category.trim().toLowerCase();
  if (normalized === 'self_funded' || normalized === 'self-funded') return 'self_funded';
  if (normalized === 'fully_funded' || normalized === 'fully-funded') return 'fully_funded';
  return null;
}

function normalizeValidityPeriods(
  tier: RegistrationInfoPricingTier | undefined,
  fallbackDates?: { open: string | null; close: string | null } | null
): ValidityPeriod[] | undefined {
  if (!tier) return undefined;
  
  // Handle both snake_case (validity_periods) and camelCase (validityPeriods)
  const snakeCasePeriods = (tier as any).validity_periods;
  const camelCasePeriods = (tier as any).validityPeriods;
  
  if (snakeCasePeriods && Array.isArray(snakeCasePeriods) && snakeCasePeriods.length > 0) {
    return snakeCasePeriods;
  }
  
  if (camelCasePeriods && Array.isArray(camelCasePeriods) && camelCasePeriods.length > 0) {
    // Convert camelCase to snake_case format
    return camelCasePeriods.map((p: any) => ({
      start_date: p.startDate,
      end_date: p.endDate,
    }));
  }
  
  // Fallback to shared registration dates if individual validity periods are not available
  if (fallbackDates?.open && fallbackDates?.close) {
    return [{
      start_date: fallbackDates.open,
      end_date: fallbackDates.close,
    }];
  }
  
  return undefined;
}

function hasCategory(
  tier: RegistrationInfoPricingTier,
  target: 'self_funded' | 'fully_funded',
): boolean {
  const categories = [
    ...(tier.allowed_categories ?? []),
    ...(tier.target ? [tier.target] : []),
  ];

  return categories
    .map((item) => normalizeCategory(String(item)))
    .some((item) => item === target);
}

function isRegistrationFeeTier(tier: RegistrationInfoPricingTier): boolean {
  return (tier.fee_type ?? '').toLowerCase() === 'registration_fee';
}

function pickRegistrationTier(
  tiers: RegistrationInfoPricingTier[],
  target: 'self_funded' | 'fully_funded',
  excludeId?: string,
): RegistrationInfoPricingTier | undefined {
  const oppositeTarget = target === 'self_funded' ? 'fully_funded' : 'self_funded';
  const candidates = tiers.filter((tier) => tier.id !== excludeId);
  const exact = candidates.find(
    (tier) => hasCategory(tier, target) && !hasCategory(tier, oppositeTarget),
  );
  if (exact) return exact;

  const inclusive = candidates.find((tier) => hasCategory(tier, target));
  if (inclusive) return inclusive;

  if (candidates.length === 0) return undefined;

  const toPrice = (tier: RegistrationInfoPricingTier) => {
    const value = Number(String(tier.price).replace(/[^0-9.-]/g, ''));
    return Number.isFinite(value) ? value : 0;
  };

  return [...candidates].sort((a, b) => toPrice(a) - toPrice(b))[target === 'self_funded' ? candidates.length - 1 : 0];
}

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
  const [currentNow] = useState<Date>(() => new Date());
  const [descriptionDialog, setDescriptionDialog] = useState<{
    title: string;
    requirements: string[];
    benefits: string[];
    benefitsLabel: string;
  } | null>(null);
  const primaryContentRef = useRef<HTMLDivElement | null>(null);
  const secondaryContentRef = useRef<HTMLDivElement | null>(null);
  const [showPrimaryReadDetails, setShowPrimaryReadDetails] = useState(false);
  const [showSecondaryReadDetails, setShowSecondaryReadDetails] = useState(false);

  const hasData = Boolean(pricingTiers?.length || instructions?.length);

  const registrationFeeTypes = useMemo(() => (pricingTiers ?? []).filter(isRegistrationFeeTier), [pricingTiers]);
  const primaryType = useMemo(() => pickRegistrationTier(registrationFeeTypes, 'self_funded'), [registrationFeeTypes]);
  const secondaryType = useMemo(() => pickRegistrationTier(registrationFeeTypes, 'fully_funded', primaryType?.id), [registrationFeeTypes, primaryType?.id]);

  const primaryBenefits = useMemo(() => primaryType?.benefits ?? [], [primaryType?.benefits]);
  const secondaryBenefits = useMemo(() => secondaryType?.benefits ?? [], [secondaryType?.benefits]);

  const primaryOpen = currentNow ? isRegistrationOpen(normalizeValidityPeriods(primaryType, registrationDates), currentNow) : false;
  const secondaryOpen = currentNow ? isRegistrationOpen(normalizeValidityPeriods(secondaryType, registrationDates), currentNow) : false;

  const selfFundedRequirements = useMemo(
    () =>
      primaryType?.requirements?.length
        ? primaryType.requirements
        : [
            'Complete registration form and documentation',
            'Submit required documents on time',
            'Pay fees according to scheduled payment batches',
          ],
    [primaryType],
  );

  const fullyFundedRequirements = useMemo(
    () =>
      secondaryType?.requirements?.length
        ? secondaryType.requirements
        : [
            'Complete registration form and documentation',
            'Submit detailed essays and applications',
            'Participate in interviews and evaluations',
          ],
    [secondaryType],
  );

  useEffect(() => {
    const checkOverflow = () => {
      const primaryElement = primaryContentRef.current;
      const secondaryElement = secondaryContentRef.current;

      setShowPrimaryReadDetails(
        Boolean(primaryElement && primaryElement.scrollHeight > primaryElement.clientHeight),
      );
      setShowSecondaryReadDetails(
        Boolean(secondaryElement && secondaryElement.scrollHeight > secondaryElement.clientHeight),
      );
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [selfFundedRequirements, fullyFundedRequirements, primaryBenefits, secondaryBenefits]);

  if (!hasData) return null;

  const formatTierPrice = (currency: string | undefined, price: unknown): string => {
    const normalizedCurrency = normalizeDisplayValue(currency ?? '');
    const normalizedPrice = normalizeDisplayValue(price);
    return `${normalizedCurrency} ${normalizedPrice}`.trim();
  };

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

        <div className="relative">
          <p className="mb-2 flex items-center justify-end gap-1 text-xs font-medium text-slate-500 lg:hidden">
            Swipe for more
            <ArrowRight className="h-3.5 w-3.5" />
          </p>
          <div className="flex w-full min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pl-1 pr-8 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-2 lg:gap-6 lg:overflow-visible lg:pb-0 lg:pr-0 lg:pt-0">
            {/* Self Funded */}
            <div className={`${componentsTheme.applyRegistrationTypes.card} min-w-[calc(100%-2.75rem)] snap-start lg:min-w-0`}>
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
                      primaryOpen
                        ? componentsTheme.applyRegistrationTypes.statusBadgeOpen
                        : componentsTheme.applyRegistrationTypes.statusBadgeClosed
                    }
                  >
                    {primaryOpen ? 'Open' : 'Closed'}
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
                {(() => {
                  const periods = normalizeValidityPeriods(primaryType, registrationDates);
                  return periods && periods.length > 0 && (
                    <div className={componentsTheme.applyRegistrationTypes.periodRow}>
                      <Calendar className={componentsTheme.applyRegistrationTypes.calendarIcon} />
                      <span className={componentsTheme.applyRegistrationTypes.periodLabel}>
                        Registration Period:
                      </span>
                      <span>{getRegistrationPeriodLabel(periods)}</span>
                    </div>
                  );
                })()}
              </div>
              <div className={`${componentsTheme.applyRegistrationTypes.bodyWrapper} flex flex-col`}>
                <div ref={primaryContentRef} className="relative h-[360px] overflow-hidden">
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
                  {showPrimaryReadDetails && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/95 to-transparent"
                    />
                  )}
                </div>
                {showPrimaryReadDetails && (
                  <div className="mt-auto pt-3 flex justify-end">
                    <button
                      type="button"
                      className="text-xs font-semibold text-primary transition hover:text-primary/80"
                      onClick={() =>
                        setDescriptionDialog({
                          title: primaryType?.name ?? 'Self Funded',
                          requirements: selfFundedRequirements,
                          benefits: primaryBenefits,
                          benefitsLabel: 'Benefit',
                        })
                      }
                    >
                      Read details
                    </button>
                  </div>
                )}
              </div>
              <div className={componentsTheme.applyRegistrationTypes.cardFooter}>
                <div className={componentsTheme.applyRegistrationTypes.ctaWrapper}>
                  {primaryOpen ? (
                    <a
                      href="/apply/self-funded"
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

            {/* Fully Funded */}
            <div className={`${componentsTheme.applyRegistrationTypes.card} min-w-[calc(100%-2.5rem)] snap-start lg:min-w-0`}>
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
                      secondaryOpen
                        ? componentsTheme.applyRegistrationTypes.statusBadgeOpen
                        : componentsTheme.applyRegistrationTypes.statusBadgeClosed
                    }
                  >
                    {secondaryOpen ? 'Open' : 'Closed'}
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
                {(() => {
                  const periods = normalizeValidityPeriods(secondaryType, registrationDates);
                  return periods && periods.length > 0 && (
                    <div className={componentsTheme.applyRegistrationTypes.periodRow}>
                      <Calendar className={componentsTheme.applyRegistrationTypes.calendarIcon} />
                      <span className={componentsTheme.applyRegistrationTypes.periodLabel}>
                        Registration Period:
                      </span>
                      <span>{getRegistrationPeriodLabel(periods)}</span>
                    </div>
                  );
                })()}
              </div>
              <div className={`${componentsTheme.applyRegistrationTypes.bodyWrapper} flex flex-col`}>
                <div ref={secondaryContentRef} className="relative h-[360px] overflow-hidden">
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
                  {showSecondaryReadDetails && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/95 to-transparent"
                    />
                  )}
                </div>
                {showSecondaryReadDetails && (
                  <div className="mt-auto pt-3 flex justify-end">
                    <button
                      type="button"
                      className="text-xs font-semibold text-primary transition hover:text-primary/80"
                      onClick={() =>
                        setDescriptionDialog({
                          title: secondaryType?.name ?? 'Fully Funded',
                          requirements: fullyFundedRequirements,
                          benefits: secondaryBenefits,
                          benefitsLabel: 'Benefit (If Selected)',
                        })
                      }
                    >
                      Read details
                    </button>
                  </div>
                )}
              </div>
              <div className={componentsTheme.applyRegistrationTypes.cardFooter}>
                <div className={componentsTheme.applyRegistrationTypes.ctaWrapper}>
                  {secondaryOpen ? (
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
          <div className={`${componentsTheme.homeImportantPayment.infoSideWrapper} mt-8`}>
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

      {/* Description Dialog Modal */}
      {descriptionDialog && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
          onClick={() => setDescriptionDialog(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <h3 className="text-lg font-extrabold text-slate-900">{descriptionDialog.title}</h3>
              <button
                type="button"
                onClick={() => setDescriptionDialog(null)}
                className="rounded-md bg-slate-100 px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-sm font-semibold text-slate-900">Requirements</p>
              <ul className="mt-2 space-y-2">
                {descriptionDialog.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-3 w-3" />
                    </span>
                    {req}
                  </li>
                ))}
              </ul>
              {descriptionDialog.benefits.length > 0 && (
                <>
                  <p className="mt-4 text-sm font-semibold text-slate-900">{descriptionDialog.benefitsLabel}</p>
                  <ul className="mt-2 space-y-2">
                    {descriptionDialog.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Check className="h-3 w-3" />
                        </span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
