'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function SubmissionPage() {
  const tabs = [
    'Personal Details',
    'Professional Profile',
    'Entry Information',
    'Miscellaneous',
  ] as const;
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Personal Details');
  const [essayExpanded, setEssayExpanded] = useState(false);
  return (
    <div>
      {/* Header: profile summary + breadcrumbs + actions */}
      <section className="relative mb-6 overflow-hidden rounded-2xl bg-[url('/img/bgprogramoverview.png')] bg-cover bg-center p-5 text-white ring-1 ring-white/10">
        <div className="absolute inset-0" />
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
          {/* left: avatar + name */}
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/25">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7 text-white/90">
                <path
                  fill="currentColor"
                  d="M12 12c2.761 0 5-2.462 5-5.5S14.761 1 12 1 7 3.462 7 6.5 9.239 12 12 12zm0 2c-4.418 0-8 2.239-8 5v1c0 .552.448 1 1 1h14c.552 0 1-.448 1-1v-1c0-2.761-3.582-5-8-5z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">HENDRA</h2>
              <p className="text-sm text-white/80">Registration Form</p>
              <p className="mt-1 flex items-center gap-2 text-xs text-white/80">
                <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
                  <path
                    fill="currentColor"
                    d="M10 1.75a5.75 5.75 0 0 0-5.75 5.75c0 4.313 5.75 10.75 5.75 10.75S15.75 11.813 15.75 7.5A5.75 5.75 0 0 0 10 1.75Zm0 8.25a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
                  />
                </svg>
                <span>Kuningan, South Jakarta • Indonesia</span>
              </p>
            </div>
          </div>

          {/* right: breadcrumbs + id + action */}
          <div className="flex flex-col items-end gap-2">
            <p className="text-xs text-white/80">Submission / Registration Form</p>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/25">
                Account ID: 991868dde4976465c
              </span>
              <Link
                href="/apply"
                className="rounded-md bg-white/15 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/25 transition hover:bg-black/10"
              >
                Edit Submission
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === t
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 ring-1 ring-transparent hover:ring-slate-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {activeTab === 'Personal Details' && (
        <section className="mt-4 rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Full Name + note vs Gender */}
            <div>
              <p className="text-sm font-semibold text-blue-950">Full Name</p>
              <p className="mt-1 text-sm text-slate-700">HENDRA</p>
              <p className="mt-1 text-xs text-emerald-700">
                This name will appear on all certificates
              </p>
            </div>

            {/* Next rows */}
            <Field label="Birthdate / Gender" value="12 Aug 1999 / male" />
            <Field label="Nationality" value="Indonesia" />
            <Field label="Origin Address" value="Bandung, West Java" />
            <Field label="Current Address" value="Kuningan, South Jakarta" />
            <Field label="Phone Number" value="0812-3456-7890" />
            <Field label="Emergency Phone Number" value="0813-9876-5432" />
            <Field label="Emergency Contact Relationship" value="Father" />
            <Field label="T-Shirt Size" value="L" />
            <Field label="Disease History" value="None" />
          </div>
        </section>
      )}

      {activeTab === 'Professional Profile' && (
        <section className="mt-4 rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Education Level" value="Bachelor's (S1)" />
            <Field label="Institution" value="Institut Teknologi Bandung (ITB)" />
            <Field label="Major" value="Informatics Engineering" />
            <Field label="Organizations" value="BEM ITB – Public Relations (2020)" />
            <Field
              label="Experiences"
              value="Software Engineer Intern — Tokopedia (Jun–Aug 2023)"
            />
            <Field
              label="Achievements & Awards"
              value="1st Place — Jakarta Youth Innovation Hackathon 2024"
            />
            <Field label="Resume" value="resume_hendra.pdf" />
          </div>
        </section>
      )}

      {activeTab === 'Entry Information' && (
        <section className="mt-4 rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
          <div className="grid gap-6 md:grid-cols-2">
            <Field
              label="Participant Competition Category"
              value="Social Innovation — Youth Leadership"
            />
            <Field label="Participant Program Subtheme" value="SDG 3: Good Health and Well-being" />
          </div>

          <div className="mt-6 space-y-3">
            <p className="text-sm font-semibold text-blue-950">Title of your essay</p>
            <p className="text-sm text-slate-700">
              Community-Driven Maternal Health Monitoring in Rural West Java
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <p className="text-sm font-semibold text-blue-950">Essay Files (PDF)</p>
            <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200">
              <li className="flex items-center justify-between gap-3 p-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-md bg-pink-50 text-pink-700 ring-1 ring-pink-200">
                    PDF
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-blue-950">Essay_Main.pdf</p>
                    <p className="text-xs text-slate-600">Uploaded: 12 Oct 2025 • 245 KB</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    View
                  </a>
                  <a
                    href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                    download
                    className="rounded-md bg-pink-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-pink-700"
                  >
                    Download
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-6 space-y-3">
            <p className="text-sm font-semibold text-blue-950">References</p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>WHO. (2022). Antenatal Care Guidelines — Evidence Synthesis.</li>
              <li>MoH Indonesia (2023). Puskesmas Performance Indicators 2023.</li>
              <li>Smith, J. (2021). Community Health Worker Programs in Southeast Asia.</li>
            </ul>
          </div>
        </section>
      )}

      {activeTab === 'Miscellaneous' && (
        <section className="mt-4 rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Knowledge Source" value="Instagram Ads" />
            <Field label="Source Account Name" value="@ybbfoundation" />
            <div>
              <p className="text-sm font-semibold text-blue-950">Twibbon Link</p>
              <a
                href="https://twb.nz/jys2026"
                target="_blank"
                rel="noreferrer noopener"
                className="mt-1 inline-block text-sm font-medium text-pink-700 hover:underline"
              >
                https://twb.nz/jys2026
              </a>
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-950">Requirement Link</p>
              <a
                href="https://drive.google.com/drive/folders/1JYS-REQ-2026"
                target="_blank"
                rel="noreferrer noopener"
                className="mt-1 inline-block text-sm font-medium text-pink-700 hover:underline"
              >
                Google Drive — JYS 2026 Requirements
              </a>
            </div>
          </div>

          {/* extra space utilization */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-blue-950">Quick Links</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href="https://twb.nz/jys2026"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-md bg-pink-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-pink-700"
                >
                  Open Twibbon
                </a>
                <a
                  href="https://drive.google.com/drive/folders/1JYS-REQ-2026"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-md border border-pink-200 bg-pink-50 px-3 py-1.5 text-xs font-semibold text-pink-700 hover:bg-pink-100"
                >
                  View Requirements
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-blue-950">Help & Support</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>
                  Email:{' '}
                  <a
                    href="mailto:support@ybbfoundation.org"
                    className="font-medium text-pink-700 hover:underline"
                  >
                    support@ybbfoundation.org
                  </a>
                </li>
                <li>
                  WhatsApp Group:{' '}
                  <a
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-medium text-pink-700 hover:underline"
                  >
                    Join Cohort Group
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-blue-950">{label}</p>
      <p className="mt-1 text-sm text-slate-700">{value}</p>
    </div>
  );
}
