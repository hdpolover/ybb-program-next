import { MapPin, Calendar, Check, CreditCard } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

export default function HomeRegistrationStrip() {
  return (
    <section className={jysSectionTheme.homeRegistration.sectionWrapper}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader eyebrow="Registration Types" title="Choose how you want to join" />
        <p className={jysSectionTheme.homeRegistration.introText}>
          Explore the available registration options and read the guidebook before you apply.
        </p>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.6fr)] xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1.7fr)]">
          {/* Kiri: Instagram feed + guidebook buttons */}
          <div className="flex flex-col gap-4">
            <div className={jysSectionTheme.homeRegistration.instagramCard}>
              <div className={jysSectionTheme.homeRegistration.instagramHeader}>
                Official Instagram Feed
              </div>
              <div className="relative h-[520px] w-full overflow-hidden">
                <iframe
                  src="https://www.instagram.com/p/DSURl6UEm0O/embed"
                  className="h-[650px] w-full origin-top scale-[0.8]"
                  loading="lazy"
                  allow="encrypted-media; picture-in-picture"
                  scrolling="no"
                  title="Japan Youth Summit Instagram post"
                />
              </div>
              <div className={jysSectionTheme.homeRegistration.instagramFooter}>
                <span>japanyouthsummit</span>
                <a
                  href="https://www.instagram.com/japanyouthsummitofficial/"
                  target="_blank"
                  rel="noreferrer"
                  className={jysSectionTheme.homeRegistration.instagramLink}
                >
                  View more on Instagram
                </a>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a href="#guidebook-en" className={jysSectionTheme.homeRegistration.guidePrimary}>
                Read Guidebook (Eng)
              </a>
              <a href="#guidebook-id" className={jysSectionTheme.homeRegistration.guideSecondary}>
                Read Guidebook (Ind)
              </a>
            </div>
          </div>

          {/* Kanan: kartu Self Funded & Fully Funded */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Self Funded */}
            <div className={jysSectionTheme.applyRegistrationTypes.card}>
              <div className="border-b border-slate-200 bg-gradient-to-b from-blue-50/70 to-transparent p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={jysSectionTheme.applyRegistrationTypes.iconCircle}>
                      <CreditCard className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-xl font-extrabold text-blue-900">Self Funded</h3>
                      <p className="text-xs font-medium text-slate-600">Standard Registration</p>
                    </div>
                  </div>
                  <span className="whitespace-nowrap rounded-full bg-green-100 px-3 py-1 text-[11px] font-semibold text-green-700">
                    Registration Open
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className={jysSectionTheme.applyRegistrationTypes.priceText}>$15.00</span>
                  <span className="text-xs font-medium text-slate-500">Registration Fee</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                  <Calendar className={jysSectionTheme.applyRegistrationTypes.calendarIcon} />
                  <span className="font-semibold text-slate-700">Registration Period:</span>
                  <span>Sep 01 – Dec 31, 2025</span>
                </div>
              </div>
              <div className="flex-1 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Requirements
                </p>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  {[
                    'Complete registration form and documentation',
                    'Submit required documents on time',
                    'Pay fees according to scheduled payment batches',
                  ].map((label, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span
                        className={`${jysSectionTheme.applyRegistrationTypes.bulletCircle} shrink-0`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="font-medium text-blue-950">{label}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Benefit
                </p>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  {[
                    'Guaranteed program participation',
                    'Faster application processing',
                    'You pay all scheduled fee batches yourself',
                  ].map((label, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span
                        className={`${jysSectionTheme.applyRegistrationTypes.bulletCircle} shrink-0`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="font-medium text-blue-950">{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-5 pt-0">
                <div className="flex justify-center">
                  <a
                    href="/apply#self-funded"
                    className={`${jysSectionTheme.applyRegistrationTypes.ctaButton} w-full max-w-xs justify-center py-3 text-sm`}
                  >
                    Register as Self Funded
                  </a>
                </div>
              </div>
            </div>

            {/* Fully Funded */}
            <div className={jysSectionTheme.applyRegistrationTypes.card}>
              <div className="border-b border-slate-200 bg-gradient-to-b from-blue-50/70 to-transparent p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className={jysSectionTheme.applyRegistrationTypes.iconCircle}>
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-xl font-extrabold text-blue-900">Fully Funded</h3>
                      <p className="text-xs font-medium text-slate-600">Reimbursement System</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700">
                    Not Available
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className={jysSectionTheme.applyRegistrationTypes.priceText}>$10.00</span>
                  <span className="text-xs font-medium text-slate-500">Registration Fee</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                  <Calendar className={jysSectionTheme.applyRegistrationTypes.calendarIcon} />
                  <span className="font-semibold text-slate-700">Registration Period:</span>
                  <span>Aug 01 – Sep 30, 2025</span>
                </div>
              </div>
              <div className="flex-1 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Requirements
                </p>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  {[
                    'Complete registration form and documentation',
                    'Submit detailed essays and applications',
                    'Participate in interviews and evaluations',
                  ].map((label, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span
                        className={`${jysSectionTheme.applyRegistrationTypes.bulletCircle} shrink-0`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="font-medium text-blue-950">{label}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Benefit (If Selected)
                </p>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  {[
                    'Full reimbursement of all payments',
                    'Enhanced program recognition',
                    'Access to exclusive fully funded activities',
                  ].map((label, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span
                        className={`${jysSectionTheme.applyRegistrationTypes.bulletCircle} shrink-0`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="font-medium text-blue-950">{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-5 pt-0">
                <div className="flex justify-center">
                  <button
                    type="button"
                    aria-disabled
                    className="inline-flex w-full max-w-xs cursor-not-allowed items-center justify-center rounded-md bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-500"
                  >
                    Registration Closed
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
