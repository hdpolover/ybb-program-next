import { Building2, FileText, Mail, Phone, Tag, User } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

type RequireNowSectionProps = {
  slug?: string;
};

// Section: Require Now — partnership inquiry form
export default function RequireNowSection({ slug }: RequireNowSectionProps) {
  return (
    <section className={jysSectionTheme.partnersRequire.sectionWrapper} id="apply">
      <div className={jysSectionTheme.partnersRequire.container}>
        <SectionHeader eyebrow="Partnership" title="Require Now" />
        <p className={jysSectionTheme.partnersRequire.subtitle}>
          Share a few details about you and your organization, and our partnership team will get
          back to you shortly.
        </p>

        <form className={jysSectionTheme.partnersRequire.formGrid} action="#" method="post">
          <div className={jysSectionTheme.partnersRequire.fieldGroup}>
            <label className={jysSectionTheme.partnersRequire.label} htmlFor="fullName">
              Full Name
            </label>
            <div className={jysSectionTheme.partnersRequire.iconFieldWrapper}>
              <span className={jysSectionTheme.partnersRequire.icon}>
                <User className="h-4 w-4" />
              </span>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className={jysSectionTheme.partnersRequire.inputWithIcon}
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div className={jysSectionTheme.partnersRequire.fieldGroup}>
            <label className={jysSectionTheme.partnersRequire.label} htmlFor="workEmail">
              Work Email
            </label>
            <div className={jysSectionTheme.partnersRequire.iconFieldWrapper}>
              <span className={jysSectionTheme.partnersRequire.icon}>
                <Mail className="h-4 w-4" />
              </span>
              <input
                id="workEmail"
                name="workEmail"
                type="email"
                required
                className={jysSectionTheme.partnersRequire.inputWithIcon}
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div className={jysSectionTheme.partnersRequire.fieldGroup}>
            <label className={jysSectionTheme.partnersRequire.label} htmlFor="phone">
              Phone
            </label>
            <div className={jysSectionTheme.partnersRequire.iconFieldWrapper}>
              <span className={jysSectionTheme.partnersRequire.icon}>
                <Phone className="h-4 w-4" />
              </span>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className={jysSectionTheme.partnersRequire.inputWithIcon}
                placeholder="e.g. +60 12 345 6789"
              />
            </div>
          </div>

          <div className={jysSectionTheme.partnersRequire.fieldGroup}>
            <label className={jysSectionTheme.partnersRequire.label} htmlFor="company">
              Company
            </label>
            <div className={jysSectionTheme.partnersRequire.iconFieldWrapper}>
              <span className={jysSectionTheme.partnersRequire.icon}>
                <Building2 className="h-4 w-4" />
              </span>
              <input
                id="company"
                name="company"
                type="text"
                required
                className={jysSectionTheme.partnersRequire.inputWithIcon}
                placeholder="Organization / Institution name"
              />
            </div>
          </div>

          <div className={jysSectionTheme.partnersRequire.fieldGroupFull}>
            <label className={jysSectionTheme.partnersRequire.label} htmlFor="subject">
              Subject
            </label>
            <div className={jysSectionTheme.partnersRequire.iconFieldWrapper}>
              <span className={jysSectionTheme.partnersRequire.icon}>
                <Tag className="h-4 w-4" />
              </span>
              {slug === 'affiliate-program' ? (
                <select
                  id="subject"
                  name="subject"
                  required
                  className={jysSectionTheme.partnersRequire.inputWithIcon}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select affiliate type
                  </option>
                  <option value="Fully Funded Affiliate">Fully Funded Affiliate</option>
                  <option value="Self Funded Affiliate">Self Funded Affiliate</option>
                </select>
              ) : (
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  className={jysSectionTheme.partnersRequire.inputWithIcon}
                  placeholder="Brief topic of your partnership inquiry"
                />
              )}
            </div>
          </div>

          <div className={jysSectionTheme.partnersRequire.fieldGroupFull}>
            <label className={jysSectionTheme.partnersRequire.label} htmlFor="description">
              Description
            </label>
            <div className={jysSectionTheme.partnersRequire.iconFieldWrapperTextarea}>
              <span className={jysSectionTheme.partnersRequire.icon}>
                <FileText className="h-4 w-4" />
              </span>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                className={jysSectionTheme.partnersRequire.textareaWithIcon}
                placeholder="Tell us more about your goals, timeline, and how you would like to collaborate."
              />
            </div>
          </div>

          <div className="sm:col-span-2 mt-4 flex flex-col gap-3">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2"
            >
              Submit
            </button>

            <div className="flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              <span className="h-px w-8 bg-slate-200" aria-hidden="true" />
              <span>OR</span>
              <span className="h-px w-8 bg-slate-200" aria-hidden="true" />
            </div>

            <a
              href="mailto:partnership@ybbglobal.org"
              className="inline-flex w-full items-center justify-center rounded-xl border border-pink-500/70 bg-white px-6 py-3 text-sm font-semibold text-pink-600 shadow-sm transition hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            >
              Contact us Via Email
            </a>
          </div>
        </form>
      </div>
    </section>
  );
}
