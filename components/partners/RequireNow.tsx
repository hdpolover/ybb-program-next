import { Building2, FileText, Mail, Phone, Tag, User } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';

type RequireNowSectionProps = {
  slug?: string;
};

// Section: Require Now — partnership inquiry form
export default function RequireNowSection({ slug }: RequireNowSectionProps) {
  return (
    <section className={componentsTheme.partnersRequire.sectionWrapper} id="apply">
      <div className={componentsTheme.partnersRequire.container}>
        <SectionHeader eyebrow="Partnership" title="Require Now" />
        <p className={componentsTheme.partnersRequire.subtitle}>
          Share a few details about you and your organization, and our partnership team will get
          back to you shortly.
        </p>

        <form className={componentsTheme.partnersRequire.formGrid} action="#" method="post">
          <div className={componentsTheme.partnersRequire.fieldGroup}>
            <label className={componentsTheme.partnersRequire.label} htmlFor="fullName">
              Full Name
            </label>
            <div className={componentsTheme.partnersRequire.iconFieldWrapper}>
              <span className={componentsTheme.partnersRequire.icon}>
                <User className="h-4 w-4" />
              </span>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className={componentsTheme.partnersRequire.inputWithIcon}
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div className={componentsTheme.partnersRequire.fieldGroup}>
            <label className={componentsTheme.partnersRequire.label} htmlFor="workEmail">
              Work Email
            </label>
            <div className={componentsTheme.partnersRequire.iconFieldWrapper}>
              <span className={componentsTheme.partnersRequire.icon}>
                <Mail className="h-4 w-4" />
              </span>
              <input
                id="workEmail"
                name="workEmail"
                type="email"
                required
                className={componentsTheme.partnersRequire.inputWithIcon}
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div className={componentsTheme.partnersRequire.fieldGroup}>
            <label className={componentsTheme.partnersRequire.label} htmlFor="phone">
              Phone
            </label>
            <div className={componentsTheme.partnersRequire.iconFieldWrapper}>
              <span className={componentsTheme.partnersRequire.icon}>
                <Phone className="h-4 w-4" />
              </span>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className={componentsTheme.partnersRequire.inputWithIcon}
                placeholder="e.g. +60 12 345 6789"
              />
            </div>
          </div>

          <div className={componentsTheme.partnersRequire.fieldGroup}>
            <label className={componentsTheme.partnersRequire.label} htmlFor="company">
              Company
            </label>
            <div className={componentsTheme.partnersRequire.iconFieldWrapper}>
              <span className={componentsTheme.partnersRequire.icon}>
                <Building2 className="h-4 w-4" />
              </span>
              <input
                id="company"
                name="company"
                type="text"
                required
                className={componentsTheme.partnersRequire.inputWithIcon}
                placeholder="Organization / Institution name"
              />
            </div>
          </div>

          <div className={componentsTheme.partnersRequire.fieldGroupFull}>
            <label className={componentsTheme.partnersRequire.label} htmlFor="subject">
              Subject
            </label>
            <div className={componentsTheme.partnersRequire.iconFieldWrapper}>
              <span className={componentsTheme.partnersRequire.icon}>
                <Tag className="h-4 w-4" />
              </span>
              {slug === 'affiliate-program' ? (
                <select
                  id="subject"
                  name="subject"
                  required
                  className={componentsTheme.partnersRequire.inputWithIcon}
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
                  className={componentsTheme.partnersRequire.inputWithIcon}
                  placeholder="Brief topic of your partnership inquiry"
                />
              )}
            </div>
          </div>

          <div className={componentsTheme.partnersRequire.fieldGroupFull}>
            <label className={componentsTheme.partnersRequire.label} htmlFor="description">
              Description
            </label>
            <div className={componentsTheme.partnersRequire.iconFieldWrapperTextarea}>
              <span className={componentsTheme.partnersRequire.icon}>
                <FileText className="h-4 w-4" />
              </span>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                className={componentsTheme.partnersRequire.textareaWithIcon}
                placeholder="Tell us more about your goals, timeline, and how you would like to collaborate."
              />
            </div>
          </div>

          <div className="sm:col-span-2 mt-4 flex flex-col gap-3">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
              className="inline-flex w-full items-center justify-center rounded-xl border border-primary/100/70 bg-white px-6 py-3 text-sm font-semibold text-primary shadow-sm transition hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/100 focus:ring-offset-2"
            >
              Contact us Via Email
            </a>
          </div>
        </form>
      </div>
    </section>
  );
}
