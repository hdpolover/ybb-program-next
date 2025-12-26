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

export default function RegistrationTypePrograms() {
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
                        Self Funded
                      </h3>
                      <p className={jysSectionTheme.applyRegistrationTypes.headerSubtitle}>
                        Registration
                      </p>
                    </div>
                  </div>
                  <span className={jysSectionTheme.applyRegistrationTypes.statusBadgeOpen}>
                    Regist Open
                  </span>
                </div>
                <div className={jysSectionTheme.applyRegistrationTypes.feeRow}>
                  <span className={jysSectionTheme.applyRegistrationTypes.priceText}>$15.00</span>
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
                  {[
                    'Guaranteed program participation',
                    'Faster application processing',
                    'You pay all scheduled fee batches yourself',
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
                        Fully Funded
                      </h3>
                      <p className={jysSectionTheme.applyRegistrationTypes.headerSubtitle}>
                        Reimbursement System
                      </p>
                    </div>
                  </div>
                  <span className={jysSectionTheme.applyRegistrationTypes.statusBadgeClosed}>
                    Not Available
                  </span>
                </div>
                <div className={jysSectionTheme.applyRegistrationTypes.feeRow}>
                  <span className={jysSectionTheme.applyRegistrationTypes.priceText}>$10.00</span>
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
                  {[
                    'Full reimbursement of all payments',
                    'Enhanced program recognition',
                    'Access to exclusive fully funded activities',
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
                  Make sure you understand the key details about payments, selection, and guarantees
                  before choosing your registration type.
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
                        Fees are divided into several batches. Please follow the timeline stated in
                        the official guidebook and payment instructions.
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
                        Seats are limited for each registration type. Successful applicants will be
                        contacted via email according to the announced selection timeline.
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
                        participation in the program, following the stated terms and conditions.
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
                        instructions will be shared only with selected participants.
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
                        the organizing committee for any updates related to the program.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={jysSectionTheme.homeImportantPayment.infoFooter}>
                For detailed terms and conditions, please read the official guidebook and FAQ on the
                Japan Youth Summit website.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
