import SectionHeader from '@/components/ui/SectionHeader';
import {
  Calendar,
  Check,
  CreditCard,
  MapPin,
  Users,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { jysSectionTheme } from '@/lib/theme/jys-components';

type RegistrationType = {
  id: string;
  name: string;
  price: string;
  currency: string;
  benefits: string[];
};

type RegistrationTypeProgramsProps = {
  registrationTypes?: RegistrationType[];
};

export default function RegistrationTypePrograms({
  registrationTypes,
}: RegistrationTypeProgramsProps) {
  const primaryType = registrationTypes?.[0];
  const secondaryType = registrationTypes?.[1];

  return (
    <section className={jysSectionTheme.homeRegistration.sectionWrapper}>
      <div className={jysSectionTheme.homeRegistration.container}>
        <SectionHeader eyebrow="Registration" title="Choose Your Registration Type" />
        <p className={jysSectionTheme.homeRegistration.introText}>
          Select the registration scheme that best matches your needs, then review the important
          information about fees, selection, and guarantees.
        </p>

        <div className={jysSectionTheme.homeRegistration.mainGrid}>
          {/* Kiri: kartu tipe registrasi (replikasi dari Registration Types di homepage) */}
          <div className={jysSectionTheme.homeRegistration.cardsGrid}>
            {/* Self Funded */}
            <div className={jysSectionTheme.applyRegistrationTypes.card}>
              <div className={jysSectionTheme.applyRegistrationTypes.headerWrapper}>
                <div className={jysSectionTheme.applyRegistrationTypes.headerRow}>
                  <div className={jysSectionTheme.applyRegistrationTypes.headerTitleRow}>
                    <span className={jysSectionTheme.applyRegistrationTypes.iconCircle}>
                      <CreditCard className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className={jysSectionTheme.applyRegistrationTypes.headerTitle}>
                        {primaryType?.name ?? 'Self Funded'}
                      </h3>
                      <p className={jysSectionTheme.applyRegistrationTypes.headerSubtitle}>
                        Registration
                      </p>
                    </div>
                  </div>
                  <span className={jysSectionTheme.applyRegistrationTypes.statusBadgeOpen}>
                    Open
                  </span>
                </div>
                <div className={jysSectionTheme.applyRegistrationTypes.feeRow}>
                  <span className={jysSectionTheme.applyRegistrationTypes.priceText}>
                    {primaryType
                      ? `${primaryType.currency} ${primaryType.price}`
                      : '$15.00'}
                  </span>
                  <span className={jysSectionTheme.applyRegistrationTypes.feeLabel}>
                    Registration Fee
                  </span>
                </div>
                <div className={jysSectionTheme.applyRegistrationTypes.periodRow}>
                  <Calendar className={jysSectionTheme.applyRegistrationTypes.calendarIcon} />
                  <span className={jysSectionTheme.applyRegistrationTypes.periodLabel}>
                    Registration Period:
                  </span>
                  <span>Sep 01 – Dec 31, 2025</span>
                </div>
              </div>
              <div className={jysSectionTheme.applyRegistrationTypes.bodyWrapper}>
                <p className={jysSectionTheme.applyRegistrationTypes.sectionLabel}>Requirements</p>
                <ul className={jysSectionTheme.applyRegistrationTypes.list}>
                  {[
                    'Complete registration form and documentation',
                    'Submit required documents on time',
                    'Pay fees according to scheduled payment batches',
                  ].map((label, idx) => (
                    <li key={idx} className={jysSectionTheme.applyRegistrationTypes.listItemRow}>
                      <span
                        className={`${jysSectionTheme.applyRegistrationTypes.bulletCircle} shrink-0`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span className={jysSectionTheme.applyRegistrationTypes.listItemText}>
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className={jysSectionTheme.applyRegistrationTypes.bodySectionSpacer}>Benefit</p>
                <ul className={jysSectionTheme.applyRegistrationTypes.list}>
                  {(primaryType?.benefits ?? [
                    'Guaranteed program participation',
                    'Faster application processing',
                    'You pay all scheduled fee batches yourself',
                  ]).map((label, idx) => (
                    <li key={idx} className={jysSectionTheme.applyRegistrationTypes.listItemRow}>
                      <span
                        className={`${jysSectionTheme.applyRegistrationTypes.bulletCircle} shrink-0`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span className={jysSectionTheme.applyRegistrationTypes.listItemText}>
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={jysSectionTheme.applyRegistrationTypes.cardFooter}>
                <div className={jysSectionTheme.applyRegistrationTypes.ctaWrapper}>
                  <a
                    href="/apply/self-funded"
                    className={`${
                      jysSectionTheme.applyRegistrationTypes.ctaButton
                    } ${jysSectionTheme.applyRegistrationTypes.ctaButtonWide}`}
                  >
                    See Details
                  </a>
                </div>
              </div>
            </div>

            {/* Fully Funded */}
            <div className={jysSectionTheme.applyRegistrationTypes.card}>
              <div className={jysSectionTheme.applyRegistrationTypes.headerWrapper}>
                <div className={jysSectionTheme.applyRegistrationTypes.headerRowTopAligned}>
                  <div className={jysSectionTheme.applyRegistrationTypes.headerTitleRow}>
                    <span className={jysSectionTheme.applyRegistrationTypes.iconCircle}>
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className={jysSectionTheme.applyRegistrationTypes.headerTitle}>
                        {secondaryType?.name ?? 'Fully Funded'}
                      </h3>
                      <p className={jysSectionTheme.applyRegistrationTypes.headerSubtitle}>
                        Reimbursement System
                      </p>
                    </div>
                  </div>
                  <span className={jysSectionTheme.applyRegistrationTypes.statusBadgeClosed}>
                    Closed
                  </span>
                </div>
                <div className={jysSectionTheme.applyRegistrationTypes.feeRow}>
                  <span className={jysSectionTheme.applyRegistrationTypes.priceText}>
                    {secondaryType
                      ? `${secondaryType.currency} ${secondaryType.price}`
                      : '$10.00'}
                  </span>
                  <span className={jysSectionTheme.applyRegistrationTypes.feeLabel}>
                    Registration Fee
                  </span>
                </div>
                <div className={jysSectionTheme.applyRegistrationTypes.periodRow}>
                  <Calendar className={jysSectionTheme.applyRegistrationTypes.calendarIcon} />
                  <span className={jysSectionTheme.applyRegistrationTypes.periodLabel}>
                    Registration Period:
                  </span>
                  <span>Aug 01 – Sep 30, 2025</span>
                </div>
              </div>
              <div className={jysSectionTheme.applyRegistrationTypes.bodyWrapper}>
                <p className={jysSectionTheme.applyRegistrationTypes.sectionLabel}>Requirements</p>
                <ul className={jysSectionTheme.applyRegistrationTypes.list}>
                  {[
                    'Complete registration form and documentation',
                    'Submit detailed essays and applications',
                    'Participate in interviews and evaluations',
                  ].map((label, idx) => (
                    <li key={idx} className={jysSectionTheme.applyRegistrationTypes.listItemRow}>
                      <span
                        className={`${jysSectionTheme.applyRegistrationTypes.bulletCircle} shrink-0`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span className={jysSectionTheme.applyRegistrationTypes.listItemText}>
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className={jysSectionTheme.applyRegistrationTypes.bodySectionSpacer}>
                  Benefit (If Selected)
                </p>
                <ul className={jysSectionTheme.applyRegistrationTypes.list}>
                  {(secondaryType?.benefits ?? [
                    'Full reimbursement of all payments',
                    'Enhanced program recognition',
                    'Access to exclusive fully funded activities',
                  ]).map((label, idx) => (
                    <li key={idx} className={jysSectionTheme.applyRegistrationTypes.listItemRow}>
                      <span
                        className={`${jysSectionTheme.applyRegistrationTypes.bulletCircle} shrink-0`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span className={jysSectionTheme.applyRegistrationTypes.listItemText}>
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={jysSectionTheme.applyRegistrationTypes.cardFooter}>
                <div className={jysSectionTheme.applyRegistrationTypes.ctaWrapper}>
                  <button
                    type="button"
                    aria-disabled
                    className={jysSectionTheme.applyRegistrationTypes.ctaButtonDisabled}
                  >
                    See Details
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Kanan: informasi tambahan seputar registrasi */}
          <div className={jysSectionTheme.homeImportantPayment.infoSideWrapper}>
            <div className={jysSectionTheme.homeImportantPayment.infoSideCard}>
              <div>
                <h3 className={jysSectionTheme.homeImportantPayment.infoTitle}>
                  Registration Information
                </h3>
                <p className={jysSectionTheme.homeImportantPayment.infoIntro}>
                  Make sure you understand the key details about payments, selection, guarantees,
                  and important deadlines before choosing your registration type. This overview is
                  designed to help you make a well-informed decision.
                </p>

                <div className={jysSectionTheme.homeImportantPayment.infoPointsWrapper}>
                  <div className={jysSectionTheme.homeImportantPayment.infoPointRow}>
                    <span className={jysSectionTheme.homeImportantPayment.infoPointIcon}>
                      <Calendar className="h-4 w-4" />
                    </span>
                    <div>
                      <p className={jysSectionTheme.homeImportantPayment.infoPointTitle}>
                        Payment Schedule
                      </p>
                      <p className={jysSectionTheme.homeImportantPayment.infoPointBody}>
                        Fees are divided into several batches across the program timeline. Please
                        follow the dates stated in the official guidebook and payment instructions
                        so that every installment is completed on time.
                      </p>
                    </div>
                  </div>

                  <div className={jysSectionTheme.homeImportantPayment.infoPointRow}>
                    <span className={jysSectionTheme.homeImportantPayment.infoPointIcon}>
                      <Users className="h-4 w-4" />
                    </span>
                    <div>
                      <p className={jysSectionTheme.homeImportantPayment.infoPointTitle}>
                        Selection Quota
                      </p>
                      <p className={jysSectionTheme.homeImportantPayment.infoPointBody}>
                        Seats are limited for each registration type and will be allocated based on
                        the selection process. Successful applicants will be contacted via email in
                        line with the announced selection timeline.
                      </p>
                    </div>
                  </div>

                  <div className={jysSectionTheme.homeImportantPayment.infoPointRow}>
                    <span className={jysSectionTheme.homeImportantPayment.infoPointIcon}>
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    <div>
                      <p className={jysSectionTheme.homeImportantPayment.infoPointTitle}>
                        Self Funded Guarantee
                      </p>
                      <p className={jysSectionTheme.homeImportantPayment.infoPointBody}>
                        Self funded participants who complete all payments on time are guaranteed
                        participation in the program, as long as they follow the stated terms and
                        conditions communicated by the organizing committee.
                      </p>
                    </div>
                  </div>

                  <div className={jysSectionTheme.homeImportantPayment.infoPointRow}>
                    <span className={jysSectionTheme.homeImportantPayment.infoPointIcon}>
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div>
                      <p className={jysSectionTheme.homeImportantPayment.infoPointTitle}>
                        Fully Funded Process
                      </p>
                      <p className={jysSectionTheme.homeImportantPayment.infoPointBody}>
                        Fully funded slots, if available, use a reimbursement mechanism. Detailed
                        instructions about the process, timelines, and documentation will be shared
                        only with selected participants.
                      </p>
                    </div>
                  </div>

                  <div className={jysSectionTheme.homeImportantPayment.infoPointRow}>
                    <span className={jysSectionTheme.homeImportantPayment.infoPointIcon}>
                      <AlertTriangle className="h-4 w-4" />
                    </span>
                    <div>
                      <p className={jysSectionTheme.homeImportantPayment.infoPointTitle}>
                        Important Info
                      </p>
                      <p className={jysSectionTheme.homeImportantPayment.infoPointBody}>
                        Please always refer to the latest guidebook and official announcements from
                        the organizing committee for any updates related to the program, including
                        changes to fees, schedules, or selection policies.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={jysSectionTheme.homeImportantPayment.infoFooter}>
                For complete terms and conditions, please read the official guidebook and FAQ on the
                Japan Youth Summit website and check regularly for the most recent updates from the
                organizing committee.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
