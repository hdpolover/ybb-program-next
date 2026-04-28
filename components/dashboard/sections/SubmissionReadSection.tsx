'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  FileText,
  ImageIcon,
  Info,
  Pencil,
  TrendingUp,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { componentsTheme } from '@/lib/theme/components';
import SubmissionReadProfileHeaderSection from './submission/SubmissionReadProfileHeaderSection';
import {
  ACTIVE_PROGRAM_CHANGED_EVENT,
  appendProgramId,
  readActiveProgramId,
  resolveActiveProgramId,
  syncActiveProgramId,
} from '@/lib/dashboard/activeProgram';
import { getEnvelopeData, getMessage } from '@/lib/api/response';
import { toPortalSubmissionDetail } from '@/lib/dashboard/submissionParser';
import { FieldHelpAssets } from '@/components/dashboard/sections/FieldHelpAssets';
import { FieldAssetDrawer } from '@/components/dashboard/sections/FieldAssetDrawer';
import { useDashboardData } from '@/components/dashboard/DashboardDataContext';
import type {
  PortalSubmissionDetail,
  PortalSubmissionField,
  PortalSubmissionFieldOption,
  PortalSubmissionSection,
} from '@/types/portal-submission';
import Breadcrumb from '@/components/dashboard/ui/Breadcrumb';
import DashboardPageSkeleton from '@/components/dashboard/ui/DashboardPageSkeleton';
import { CountryDisplay } from '@/components/dashboard/fields/CountryDisplay';
import { PhoneDisplay } from '@/components/dashboard/fields/PhoneDisplay';

const submissionTheme = componentsTheme.dashboardSubmission;

function getOptionLabel(options: PortalSubmissionFieldOption[] | undefined, value: unknown) {
  if (value === null || value === undefined || value === '') return '-';

  const match = options?.find(option => {
    if (typeof option === 'string') return option === value;
    return option.value === value;
  });

  if (!match) return String(value);
  return typeof match === 'string' ? match : match.label;
}

function normalizeFieldKey(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function getFieldInputType(field: PortalSubmissionField) {
  const rules = field.validationRules;
  if (!rules || typeof rules !== 'object') return '';

  const inputType = (rules as Record<string, unknown>).inputType;
  return typeof inputType === 'string' ? inputType.toLowerCase() : '';
}

function isCountrySelectorField(field: PortalSubmissionField) {
  if (field.type === 'country') return true;
  return getFieldInputType(field) === 'country_select';
}

function isProfilePhotoField(field: PortalSubmissionField) {
  const normalized = normalizeFieldKey(field.name);
  return (
    normalized === 'pictureurl' ||
    normalized === 'profilephotourl' ||
    normalized === 'profilepictureurl'
  );
}

function isViewOnlyMetaField(field: PortalSubmissionField) {
  const normalized = normalizeFieldKey(field.name);
  return normalized.includes('labeltext') || normalized.includes('helptext');
}

function isLegacyEssayField(field: PortalSubmissionField) {
  const normalized = normalizeFieldKey(field.name);
  return (
    normalized.includes('essay') ||
    normalized.includes('keyword') ||
    normalized.includes('reference')
  );
}

function shouldRenderReadOnlyField(
  section: PortalSubmissionSection,
  field: PortalSubmissionField,
  hasEssayQuestions: boolean
) {
  if (isProfilePhotoField(field)) return false;
  if (isViewOnlyMetaField(field)) return false;
  if (hasEssayQuestions && section.id === 'entry_information' && isLegacyEssayField(field)) {
    return false;
  }
  return true;
}

function isCategoryField(field: PortalSubmissionField) {
  const normalized = normalizeFieldKey(field.name);
  return (
    normalized === 'category' ||
    normalized === 'applicationcategory' ||
    normalized === 'participationcategory' ||
    normalized === 'participationcategoryid'
  );
}

function renderFieldValue(field: PortalSubmissionField, value: unknown) {
  if (value === null || value === undefined || value === '') return '-';
  const treatAsOptionField =
    field.type === 'select' || field.type === 'radio' || isCategoryField(field);

  if (treatAsOptionField) {
    return getOptionLabel(field.options, value);
  }

  if (field.type === 'checkbox') {
    const arr = Array.isArray(value) ? value : [value];
    if (arr.length === 0) return '-';
    return arr
      .map(v => getOptionLabel(field.options, v))
      .filter(Boolean)
      .join(', ');
  }

  return String(value);
}

function isLongFormField(field: PortalSubmissionField) {
  return field.type === 'textarea';
}

function shouldSpanFullWidth(field: PortalSubmissionField) {
  if (isLongFormField(field)) return true;

  const normalized = normalizeFieldKey(field.name);
  const isAddressField = normalized.endsWith('address') && !normalized.includes('email');
  return (
    isAddressField ||
    /(experience|achievement|organization|portfolio|resume|medical|disease|specialneed|essay|twibbon|requirement)/.test(
      normalized
    )
  );
}

// ─── helpers for per-section fill rate ────────────────────────────────────────
function countSectionFields(section: PortalSubmissionSection) {
  const relevant = section.fields.filter(f => f.type !== 'header' && f.type !== 'divider');
  const filled = relevant.filter(f => {
    const v = section.values[f.name];
    return v !== null && v !== undefined && v !== '';
  });
  return { total: relevant.length, filled: filled.length };
}

function sectionStatusIcon(status: string) {
  if (status === 'completed')
    return <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />;
  if (status === 'in_progress') return <Clock className="h-4 w-4 shrink-0 text-amber-500" />;
  return <Circle className="h-4 w-4 shrink-0 text-slate-300" />;
}

// ─── Progress Drawer ──────────────────────────────────────────────────────────
function ProgressDrawer({
  open,
  onClose,
  detail,
}: {
  open: boolean;
  onClose: () => void;
  detail: PortalSubmissionDetail;
}) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  const progress = detail.overallProgress;
  const progressColor =
    progress >= 100
      ? 'bg-emerald-500'
      : progress >= 50
        ? 'bg-primary'
        : progress > 0
          ? 'bg-amber-500'
          : 'bg-slate-300';

  const statusLabel: Record<string, string> = {
    completed: 'Completed',
    in_progress: 'In Progress',
    pending: 'Not Started',
    issues: 'Needs Attention',
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Submission Progress"
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* panel */}
      <div className="relative z-10 flex h-screen w-full max-w-md flex-col bg-white shadow-2xl">
        {/* header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-slate-800">Submission Progress</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="focus:ring-primary/40 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2"
            aria-label="Close progress drawer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* program + overall progress */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 space-y-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Program
              </p>
              <p className="mt-0.5 text-sm font-semibold text-slate-900">{detail.programName}</p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">Overall Progress</span>
                <span
                  className={`font-bold ${progress >= 100 ? 'text-emerald-600' : 'text-slate-800'}`}
                >
                  {progress}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                {progress >= 100
                  ? 'All sections complete!'
                  : `${100 - progress}% remaining to complete`}
              </p>
            </div>
          </div>

          {/* per-section breakdown */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Sections ({detail.sections.length})
            </p>
            {detail.sections.map(section => {
              const { total, filled } = countSectionFields(section);
              const pct = total > 0 ? Math.round((filled / total) * 100) : 0;
              const sColor =
                section.status === 'completed'
                  ? 'bg-emerald-500'
                  : section.status === 'in_progress'
                    ? 'bg-primary'
                    : 'bg-slate-200';
              return (
                <div
                  key={section.id}
                  className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm space-y-2"
                >
                  <div className="flex items-center gap-2">
                    {sectionStatusIcon(section.status)}
                    <span className="flex-1 text-sm font-medium text-slate-800">
                      {section.title}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {statusLabel[section.status] ?? section.status}
                    </span>
                  </div>
                  {total > 0 && (
                    <div className="space-y-1">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${sColor}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {filled} / {total} fields filled
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* requirements */}
          {detail.requirements.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Required Documents ({detail.requirements.length})
              </p>
              {detail.requirements.map(req => (
                <div
                  key={req.id ?? req.name}
                  className="flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
                  <span className="flex-1 font-medium text-amber-900">{req.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* footer CTA */}
        <div className="border-t border-slate-200 px-5 py-4">
          <a
            href="/dashboard/submission/edit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            onClick={onClose}
          >
            <Pencil className="h-4 w-4" />
            Continue Filling Form
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}

function FieldRow({
  field,
  value,
  className,
}: {
  field: PortalSubmissionField;
  value: unknown;
  className?: string;
}) {
  const [assetDrawerOpen, setAssetDrawerOpen] = useState(false);
  const rendered = renderFieldValue(field, value);
  const isLong = isLongFormField(field) || rendered.length > 120;
  const stringValue = value === null || value === undefined ? '' : String(value);
  const isCountry = isCountrySelectorField(field);
  const isPhone = field.type === 'phone';

  const assetLabel = field.mediaAlt?.trim() || `${field.label} reference`;

  return (
    <div className={`${submissionTheme.readFieldLabelWrapper} ${className ?? ''}`}>
      <span className={submissionTheme.readFieldLabelText}>{field.label}</span>
      {isCountry ? (
        <div className={submissionTheme.readFieldValue}>
          <CountryDisplay value={stringValue} />
        </div>
      ) : isPhone ? (
        <div className={submissionTheme.readFieldValue}>
          <PhoneDisplay value={stringValue} />
        </div>
      ) : isLong ? (
        <div className={submissionTheme.readFieldValueMultiline}>{rendered}</div>
      ) : (
        <div className={submissionTheme.readFieldValue}>{rendered}</div>
      )}
      {field.mediaUrl ? (
        <>
          <button
            type="button"
            onClick={() => setAssetDrawerOpen(true)}
            className="border-primary/30 bg-primary/5 hover:bg-primary/10 mt-1 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium text-primary transition"
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>View Reference</span>
          </button>
          <FieldAssetDrawer
            open={assetDrawerOpen}
            onClose={() => setAssetDrawerOpen(false)}
            src={field.mediaUrl}
            alt={assetLabel}
          />
        </>
      ) : null}
      <FieldHelpAssets items={field.helpAssets} className="mt-2" />
    </div>
  );
}

export default function SubmissionReadSection() {
  const { me } = useDashboardData();
  const [detail, setDetail] = useState<PortalSubmissionDetail | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [showProgressDrawer, setShowProgressDrawer] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [programSelectionReady, setProgramSelectionReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const syncSelectedProgram = () => {
      setSelectedProgramId(
        resolveActiveProgramId(me?.registeredPrograms ?? [], readActiveProgramId()),
      );
      setProgramSelectionReady(true);
    };

    syncSelectedProgram();
    window.addEventListener(ACTIVE_PROGRAM_CHANGED_EVENT, syncSelectedProgram as EventListener);

    return () => {
      window.removeEventListener(
        ACTIVE_PROGRAM_CHANGED_EVENT,
        syncSelectedProgram as EventListener
      );
    };
  }, [me?.registeredPrograms]);

  useEffect(() => {
    if (!programSelectionReady) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          appendProgramId('/api/portal/submissions/detail', selectedProgramId),
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
          }
        );

        const json = (await res.json().catch(() => null)) as unknown;
        if (!res.ok) throw new Error(getMessage(json) ?? 'Failed to load submission detail');

        const nextDetail = toPortalSubmissionDetail(getEnvelopeData(json));
        if (!cancelled) {
          if (nextDetail?.programId && nextDetail.programId !== selectedProgramId) {
            syncActiveProgramId(nextDetail.programId);
            setSelectedProgramId(nextDetail.programId);
          }
          setDetail(nextDetail);
          setActiveSectionId(nextDetail?.sections?.[0]?.id ?? null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error ? loadError.message : 'Failed to load submission detail'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [programSelectionReady, selectedProgramId]);

  const activeSection = useMemo(() => {
    return (
      detail?.sections.find(section => section.id === activeSectionId) ??
      detail?.sections[0] ??
      null
    );
  }, [activeSectionId, detail?.sections]);

  const sectionEssays = useMemo(() => {
    if (!activeSection || activeSection.id !== 'entry_information') return [];
    return [...(detail?.essays ?? [])].sort((left, right) => left.order - right.order);
  }, [activeSection, detail?.essays]);

  if (loading) {
    return (
      <DashboardPageSkeleton variant="submission-read" className={submissionTheme.sectionWrapper} />
    );
  }

  return (
    <section className={submissionTheme.sectionWrapper}>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Submissions', href: '/dashboard/submission' },
          { label: 'Registration Form' },
        ]}
      />

      {/* Page Title */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Registration Form</h1>
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          {detail ? (
            <button
              type="button"
              onClick={() => setShowProgressDrawer(true)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm transition hover:border-primary/40 hover:bg-primary/5"
            >
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              <span className="font-semibold uppercase tracking-wide text-slate-500">Progress</span>
              <span className="text-sm font-bold text-slate-900">{detail.overallProgress}%</span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </button>
          ) : null}
          <Link
            href="/dashboard/submission/edit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            <Pencil className="h-4 w-4" />
            Fill Form
          </Link>
        </div>
      </div>

      {detail ? (
        <ProgressDrawer
          open={showProgressDrawer}
          onClose={() => setShowProgressDrawer(false)}
          detail={detail}
        />
      ) : null}

      <SubmissionReadProfileHeaderSection />

      {error ? (
        /no active application/i.test(error) ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-8 text-center shadow-sm">
            <FileText className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <p className="text-base font-semibold text-slate-800">No submission yet</p>
            <p className="mt-1 text-sm text-slate-500">
              You haven&apos;t started your application form. Click <strong>Fill Form</strong> to
              begin.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )
      ) : null}

      {!loading && detail ? (
        <>
          {/* Tab Buttons - Pill shaped using theme */}
          <div className="flex flex-wrap gap-2">
            {detail.sections.map(section => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSectionId(section.id)}
                className={`rounded-full border-2 px-8 py-2 text-base font-medium transition-colors ${
                  activeSection?.id === section.id
                    ? 'border-primary bg-primary text-white'
                    : 'hover:bg-primary/10 border-primary bg-transparent text-primary'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>

          {activeSection ? (
            <section className={submissionTheme.readSectionWrapper}>
              <div>
                <h2 className={submissionTheme.readSectionHeader}>
                  <span className={submissionTheme.readSectionIconCircle}>
                    <Info className="h-3.5 w-3.5" />
                  </span>
                  <span>{activeSection.title}</span>
                </h2>
                {activeSection.description ? (
                  <p className={submissionTheme.readSectionSubtitle}>{activeSection.description}</p>
                ) : null}
              </div>

              <div className={submissionTheme.readDetailsCard}>
                <div className={`${submissionTheme.readGrid} items-start gap-x-8 gap-y-6`}>
                  {activeSection.fields
                    .filter(field =>
                      shouldRenderReadOnlyField(
                        activeSection,
                        field,
                        (detail?.essays.length ?? 0) > 0
                      )
                    )
                    .map(field => (
                      <FieldRow
                        key={field.id}
                        field={field}
                        value={activeSection.values[field.name]}
                        className={shouldSpanFullWidth(field) ? 'md:col-span-2' : undefined}
                      />
                    ))}
                </div>
              </div>

              {sectionEssays.length > 0 ? (
                <div className={submissionTheme.readEssaySectionWrapper}>
                  <div>
                    <h3 className={submissionTheme.readEssaySectionTitle}>Essay Questions</h3>
                  </div>
                  {sectionEssays.map(essay => (
                    <div key={essay.id} className="border-primary/20 space-y-2 border-l-2 pl-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {essay.question}
                      </p>
                      {essay.wordLimit ? (
                        <p className="text-[11px] text-slate-500">Word limit: {essay.wordLimit}</p>
                      ) : null}
                      <div className={submissionTheme.readFieldValueMultiline}>
                        {essay.answer || '-'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {detail.requirements.length > 0 ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <p className="font-semibold">
                        Document uploads are handled in a separate flow.
                      </p>
                      <p className="mt-1 text-xs text-amber-800">
                        Required documents:{' '}
                        {detail.requirements.map(requirement => requirement.name).join(', ')}.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
