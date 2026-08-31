"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, ImageIcon, Info, Loader2, PencilLine } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  getCountryCallingCode,
  isSupportedCountry,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";
import { componentsTheme } from "@/lib/theme/components";
import {
  ACTIVE_PROGRAM_CHANGED_EVENT,
  appendProgramId,
  readActiveProgramId,
  resolveActiveProgramId,
  syncActiveProgramId,
} from "@/lib/dashboard/activeProgram";
import { getEnvelopeData, getErrorMessage } from "@/lib/api/response";
import { trackCompleteRegistration } from "@/lib/analytics/metaPixel";
import { useDashboardData } from "@/components/dashboard/DashboardDataContext";
import type {
  PortalSubmissionDetail,
  PortalSubmissionEssay,
  PortalSubmissionField,
  PortalSubmissionFieldOption,
  PortalSubmissionSection,
} from "@/types/portal-submission";
import Breadcrumb from "@/components/dashboard/ui/Breadcrumb";
import DashboardPageSkeleton from "@/components/dashboard/ui/DashboardPageSkeleton";
import EnglishTextInput from "@/components/ui/EnglishTextInput";
import EnglishTextArea from "@/components/ui/EnglishTextArea";
import { CountryField } from "@/components/dashboard/fields/CountryField";
import { PhoneField } from "@/components/dashboard/fields/PhoneField";
import { FieldHelpAssets } from "@/components/dashboard/sections/FieldHelpAssets";
import { FieldAssetDrawer } from "@/components/dashboard/sections/FieldAssetDrawer";
import { FieldHelpText, plainTextFromRichText } from "@/components/dashboard/sections/FieldHelpText";
import { toPortalSubmissionDetail } from "@/lib/dashboard/submissionParser";
import { formatSubmissionDateValue, isDateLikeField } from "@/lib/dashboard/dateDisplay";
import { useAutoSave, loadFromLocalStorage, clearLocalStorage, type DraftEnvelope } from "@/hooks/useAutoSave";
import { normalizeEmailInput } from "@/lib/utils";
import { isValidPhone, sanitizePhone } from "@/lib/phone";

const submissionTheme = componentsTheme.dashboardSubmission;

function sanitizeInlineHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/\s(href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, "");
}

export type PersonalDetails = {
  fullName: string;
  nickName: string;
  gender: string;
  birthdate: string;
  nationality: string;
  originState: string;
  originCity: string;
  currentState: string;
  currentCity: string;
  phoneNumber: string;
  emergencyPhoneNumber: string;
  emergencyRelationship: string;
  tshirtSize: string;
  diseaseHistory: string;
};

export type ProfessionalProfile = {
  educationLevel: string;
  institution: string;
  major: string;
  occupation: string;
  organization: string;
  experiences: string;
  achievements: string;
  resumeName: string;
};

export type EntryInfo = {
  participationCategory: string;
  programSubtheme: string;
  knowledgeSource: string;
  essayTitle: string;
  mainEssay: string;
  keywords: string[];
  reference: string;
  instagramAccount?: string;
  miscKnowledgeSource?: string;
  sourceAccountName?: string;
  twibbonLink?: string;
  requirementLink?: string;
  ambassadorReferralCode?: string;
};

export const DUMMY_PERSONAL_DETAILS: PersonalDetails = {
  fullName: "",
  nickName: "",
  gender: "",
  birthdate: "",
  nationality: "",
  originState: "",
  originCity: "",
  currentState: "",
  currentCity: "",
  phoneNumber: "",
  emergencyPhoneNumber: "",
  emergencyRelationship: "",
  tshirtSize: "",
  diseaseHistory: "",
};

export const DUMMY_PROFESSIONAL_PROFILE: ProfessionalProfile = {
  educationLevel: "",
  institution: "",
  major: "",
  occupation: "",
  organization: "",
  experiences: "",
  achievements: "",
  resumeName: "",
};

export const DUMMY_ENTRY_INFO: EntryInfo = {
  participationCategory: "",
  programSubtheme: "",
  knowledgeSource: "",
  essayTitle: "",
  mainEssay: "",
  keywords: [],
  reference: "",
  instagramAccount: "",
  miscKnowledgeSource: "",
  sourceAccountName: "",
  twibbonLink: "",
  requirementLink: "",
  ambassadorReferralCode: "",
};

function normalizeInputValue(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function fieldOptionValue(option: PortalSubmissionFieldOption) {
  return typeof option === "string" ? option : option.value;
}

function fieldOptionLabel(option: PortalSubmissionFieldOption) {
  return typeof option === "string" ? option : option.label;
}

function fieldOptionDescription(option: PortalSubmissionFieldOption) {
  return typeof option === "string" ? undefined : option.description;
}

function getSelectedOptionDescription(field: PortalSubmissionField, value: string) {
  if (!value || !field.options || field.options.length === 0) return "";

  const selected = field.options.find(option => fieldOptionValue(option) === value);
  if (!selected) return "";

  const description = fieldOptionDescription(selected);
  return typeof description === "string" ? description : "";
}

function normalizeFieldKey(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isCategoryField(field: PortalSubmissionField) {
  return isCategoryFieldKey(field.name);
}

function isCategoryFieldKey(key: string) {
  const normalized = normalizeFieldKey(key);
  return normalized === "category" || normalized === "applicationcategory" || normalized === "participationcategory" || normalized === "participationcategoryid";
}

function isDropdownLikeField(field: PortalSubmissionField) {
  const normalized = normalizeFieldKey(field.name);
  return normalized === "tshirtsize" || normalized === "shirtsize";
}

function getFieldInputType(field: PortalSubmissionField) {
  const rules = field.validationRules;
  if (!rules || typeof rules !== "object") return "";

  const inputType = (rules as Record<string, unknown>).inputType;
  return typeof inputType === "string" ? inputType.toLowerCase() : "";
}

function isCountrySelectorField(field: PortalSubmissionField) {
  if (field.type === "country") return true;

  const inputType = getFieldInputType(field);
  if (inputType === "country_select") return true;

  const normalized = normalizeFieldKey(field.name);
  return normalized === "nationality" || normalized === "nationalitycode" || normalized === "origincountry" || normalized === "currentcountry";
}

function isProfilePhotoField(field: PortalSubmissionField) {
  const normalized = normalizeFieldKey(field.name);
  const normalizedLabel = normalizeFieldKey(field.label);

  // Pattern buat field foto profil - cover lebih banyak variation
  // Check berdasarkan name DAN label biar lebih robust
  return (
    normalized === "pictureurl" ||
    normalized === "profilephotourl" ||
    normalized === "profilepictureurl" ||
    normalized === "profilephoto" ||
    normalized === "profile_photo" ||
    normalized === "photourl" ||
    normalized === "photo_url" ||
    normalized === "avatar" ||
    normalized === "avatarurl" ||
    normalized === "avatar_url" ||
    // Check label juga (case-insensitive)
    normalizedLabel === "profilephoto" ||
    normalizedLabel === "profile_photo" ||
    normalizedLabel === "photoprofile" ||
    normalizedLabel === "photo_profile" ||
    normalizedLabel === "profilepicture" ||
    normalizedLabel === "profile_picture" ||
    normalizedLabel === "passportphoto" ||
    normalizedLabel === "passport_photo"
  );
}

function isEmailField(field: PortalSubmissionField) {
  if (field.type === "email") return true;

  const inputType = getFieldInputType(field);
  if (inputType === "email") return true;

  const normalized = normalizeFieldKey(field.name);
  return normalized === "email" || normalized === "emailaddress";
}

type PhonePairKind =
  | "primary_country"
  | "primary_number"
  | "emergency_country"
  | "emergency_number";

function getPhonePairKind(field: PortalSubmissionField): PhonePairKind | null {
  const normalized = normalizeFieldKey(field.name);
  const inputType = getFieldInputType(field);

  if (inputType === "phone_country_code") {
    return normalized.includes("emergency") ? "emergency_country" : "primary_country";
  }

  if (inputType === "phone_number") {
    return normalized.includes("emergency") ? "emergency_number" : "primary_number";
  }

  if (normalized === "phonecountrycode") return "primary_country";
  if (normalized === "phonenumber") return "primary_number";
  if (normalized === "emergencycountrycode" || normalized === "emergencycontactcountrycode") {
    return "emergency_country";
  }
  if (
    normalized === "emergencyphonenumber" ||
    normalized === "emergencycontactphone" ||
    normalized === "emergencycontactphonenumber"
  ) {
    return "emergency_number";
  }

  return null;
}

function getPairedPhoneField(section: PortalSubmissionSection, field: PortalSubmissionField) {
  const kind = getPhonePairKind(field);
  if (!kind) return null;

  const targetKind: PhonePairKind = kind === "primary_country"
    ? "primary_number"
    : kind === "primary_number"
      ? "primary_country"
      : kind === "emergency_country"
        ? "emergency_number"
        : "emergency_country";

  return (
    section.fields.find(candidate => candidate.id !== field.id && getPhonePairKind(candidate) === targetKind) ||
    null
  );
}

/**
 * Derive the participant's country from any nationality/country selector in the
 * submission so the phone field can default to it (instead of always Indonesia).
 * Prefers an explicit "nationality" field, then current/origin country.
 */
function findNationalityCountryCode(
  sections: PortalSubmissionSection[],
  allSectionValues: Record<string, Record<string, string>>,
): CountryCode | undefined {
  let best: { priority: number; value: CountryCode } | null = null;
  for (const sec of sections) {
    for (const f of sec.fields) {
      if (!isCountrySelectorField(f)) continue;
      const raw = (allSectionValues[sec.id]?.[f.name] ?? "").trim().toUpperCase();
      if (!/^[A-Z]{2}$/.test(raw) || !isSupportedCountry(raw as CountryCode)) continue;
      const norm = normalizeFieldKey(f.name);
      const priority =
        norm === "nationality" || norm === "nationalitycode" ? 0 :
        norm === "currentcountry" ? 1 :
        norm === "origincountry" ? 2 : 3;
      if (!best || priority < best.priority) best = { priority, value: raw as CountryCode };
    }
  }
  return best?.value;
}

function normalizeDialCode(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const plusPrefixed = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D+/g, "");
  if (digits.length > 0) return `${plusPrefixed ? "+" : "+"}${digits}`;

  const countryCode = trimmed.toUpperCase();
  if (/^[A-Z]{2}$/.test(countryCode) && isSupportedCountry(countryCode as CountryCode)) {
    return `+${getCountryCallingCode(countryCode as CountryCode)}`;
  }

  return "";
}

function buildE164FromDialAndNumber(countryCode: string, phoneNumber: string) {
  const rawNumber = phoneNumber.trim();
  if (!rawNumber) return "";
  if (rawNumber.startsWith("+")) return rawNumber;

  const digits = rawNumber.replace(/\D+/g, "");
  if (!digits) return "";

  const dialCode = normalizeDialCode(countryCode);
  if (!dialCode) return `+${digits}`;

  const normalizedNumber = digits.replace(/^0+/, "") || digits;
  return `${dialCode}${normalizedNumber}`;
}

function splitE164ToDialAndNumber(value: string) {
  if (!value) {
    return { countryCode: "", phoneNumber: "" };
  }

  const parsed = parsePhoneNumberFromString(value);
  if (parsed) {
    return {
      countryCode: parsed.countryCallingCode ? `+${parsed.countryCallingCode}` : "",
      phoneNumber: parsed.nationalNumber,
    };
  }

  return {
    countryCode: "",
    phoneNumber: value.replace(/\D+/g, ""),
  };
}

/**
 * Normalize any phone-like fields in a section's save payload, mirroring the
 * backend's save-time behavior: parse with the nationality (or other country
 * selector) as the region hint, and if valid, store the E.164 form. If the
 * number doesn't parse as valid, the value is left exactly as entered — this
 * never blocks the save, it only cleans up numbers that already parse fine.
 */
function normalizeSectionPhoneFields(
  section: PortalSubmissionSection,
  payload: Record<string, string>,
  regionHint?: CountryCode,
): Record<string, string> {
  const next = { ...payload };

  for (const field of section.fields) {
    if (field.type === "phone") {
      const raw = next[field.name] ?? "";
      if (!raw) continue;
      next[field.name] = sanitizePhone(raw, regionHint).value;
      continue;
    }

    const kind = getPhonePairKind(field);
    if (kind !== "primary_number" && kind !== "emergency_number") continue;

    const pairedCountryField = getPairedPhoneField(section, field);
    if (!pairedCountryField) continue;

    const numberRaw = next[field.name] ?? "";
    const countryRaw = next[pairedCountryField.name] ?? "";
    if (!numberRaw) continue;

    const e164Candidate = buildE164FromDialAndNumber(countryRaw, numberRaw);
    const sanitized = sanitizePhone(e164Candidate, regionHint);
    if (!sanitized.isValid) continue; // keep the country/number pair exactly as entered

    const split = splitE164ToDialAndNumber(sanitized.value);
    next[pairedCountryField.name] = split.countryCode;
    next[field.name] = split.phoneNumber;
  }

  return next;
}

function shouldRenderField(section: PortalSubmissionSection, field: PortalSubmissionField) {
  if (isProfilePhotoField(field)) return false;
  if (isEmailField(field)) return false;
  if (section.id === "entry_information" && isLegacyEssayField(field)) return false;

  const kind = getPhonePairKind(field);
  if (kind === "primary_country" || kind === "emergency_country") {
    return getPairedPhoneField(section, field) === null;
  }

  return true;
}

function calculateSectionStatus(section: PortalSubmissionSection, sectionValues: Record<string, string>): 'pending' | 'in_progress' | 'completed' {
  const relevant = section.fields.filter(f => f.type !== 'header' && f.type !== 'divider' && f.isRequired);
  if (relevant.length === 0) return 'completed';

  const filled = relevant.filter(f => {
    const v = sectionValues[f.name];
    return v !== null && v !== undefined && v !== '' && v.trim() !== '';
  });

  const fillRate = filled.length / relevant.length;

  if (fillRate === 1) return 'completed';
  if (fillRate > 0) return 'in_progress';
  return 'pending';
}

// --- Local draft persistence -------------------------------------------------
// Server is the source of truth. localStorage is crash-recovery only: it must
// never resurrect a field the user didn't actually edit this session, and it
// must never let a stale/foreign draft outrank fresh server data. We do this by
// persisting ONLY the fields tracked as "dirty" (actually edited), plus a
// single timestamp for the whole draft blob.
//
// There's no per-field (or even per-application) "last updated at" timestamp
// in the submission-detail API response, so we can't compare draft freshness
// against a genuine server-side clock. Instead we use an absolute age window:
// a draft older than DRAFT_MAX_AGE_MS is treated as gone. This is a
// self-contained proxy (no backend change needed) that still fixes the
// reported bug (wholesale foreign/stale-draft overwrite) and keeps genuine
// same-session crash recovery working.
export const DRAFT_MAX_AGE_MS = 30 * 60 * 1000; // 30 minutes

export type SubmissionDraftPayload = {
  sectionValues: Record<string, Record<string, string>>;
  essayValues: Record<string, string>;
};

export function isSubmissionDraftEmpty(payload: SubmissionDraftPayload): boolean {
  return (
    Object.values(payload.sectionValues).every(fields => Object.keys(fields).length === 0) &&
    Object.keys(payload.essayValues).length === 0
  );
}

// Builds the persisted draft from only the dirty (user-touched) keys, so a
// field the user never touched can never come back from localStorage.
export function projectDirtyDraft(
  sectionValues: Record<string, Record<string, string>>,
  essayValues: Record<string, string>,
  dirtySectionFields: Record<string, Set<string>>,
  dirtyEssayIds: Set<string>,
): SubmissionDraftPayload {
  const projectedSectionValues: Record<string, Record<string, string>> = {};
  for (const [sectionId, fieldNames] of Object.entries(dirtySectionFields)) {
    if (fieldNames.size === 0) continue;
    const sourceFields = sectionValues[sectionId] || {};
    const pickedFields: Record<string, string> = {};
    for (const fieldName of fieldNames) {
      pickedFields[fieldName] = sourceFields[fieldName] ?? "";
    }
    projectedSectionValues[sectionId] = pickedFields;
  }

  const projectedEssayValues: Record<string, string> = {};
  for (const essayId of dirtyEssayIds) {
    projectedEssayValues[essayId] = essayValues[essayId] ?? "";
  }

  return { sectionValues: projectedSectionValues, essayValues: projectedEssayValues };
}

// A section save only persists that one section (plus its essays, for
// entry_information). Clearing dirty tracking must be scoped the same way:
// a different section the user also edited stays dirty, so the
// useAutoSave mirror effect keeps protecting it in localStorage for crash
// recovery instead of silently dropping it.
export function clearDirtyAfterSectionSave(
  dirtySectionFields: Record<string, Set<string>>,
  dirtyEssayIds: Set<string>,
  savedSectionId: string,
  savedEssayIds: string[] = [],
): { dirtySectionFields: Record<string, Set<string>>; dirtyEssayIds: Set<string> } {
  const nextSectionFields = { ...dirtySectionFields };
  delete nextSectionFields[savedSectionId];

  const nextEssayIds = new Set(dirtyEssayIds);
  for (const essayId of savedEssayIds) {
    nextEssayIds.delete(essayId);
  }

  return { dirtySectionFields: nextSectionFields, dirtyEssayIds: nextEssayIds };
}

// Server values are the baseline; a fresh draft may only override fields it
// actually tracked as dirty. A stale (or absent) draft contributes nothing.
export function mergeServerWithFreshDraft(
  serverSectionValues: Record<string, Record<string, string>>,
  serverEssayValues: Record<string, string>,
  draftEnvelope: DraftEnvelope<SubmissionDraftPayload> | null,
  now: number = Date.now(),
): {
  sectionValues: Record<string, Record<string, string>>;
  essayValues: Record<string, string>;
  dirtySectionFields: Record<string, Set<string>>;
  dirtyEssayIds: Set<string>;
  discardedStaleDraft: boolean;
} {
  const isFresh =
    !!draftEnvelope &&
    typeof draftEnvelope.savedAt === "number" &&
    now - draftEnvelope.savedAt <= DRAFT_MAX_AGE_MS;
  const draft = isFresh ? draftEnvelope!.data : null;
  const discardedStaleDraft = !!draftEnvelope && !isFresh;

  const mergedSectionValues = Object.fromEntries(
    Object.entries(serverSectionValues).map(([sectionId, fields]) => [
      sectionId,
      { ...fields, ...(draft?.sectionValues[sectionId] ?? {}) },
    ]),
  );
  const mergedEssayValues = { ...serverEssayValues, ...(draft?.essayValues ?? {}) };

  const dirtySectionFields: Record<string, Set<string>> = draft
    ? Object.fromEntries(
        Object.entries(draft.sectionValues).map(([sectionId, fields]) => [
          sectionId,
          new Set(Object.keys(fields)),
        ]),
      )
    : {};
  const dirtyEssayIds = draft ? new Set(Object.keys(draft.essayValues)) : new Set<string>();

  return {
    sectionValues: mergedSectionValues,
    essayValues: mergedEssayValues,
    dirtySectionFields,
    dirtyEssayIds,
    discardedStaleDraft,
  };
}

const PREVIEW_STEP_ID = "__preview__";

function getPreviewDisplayValue(
  section: PortalSubmissionSection,
  field: PortalSubmissionField,
  value: string,
  sectionVals: Record<string, string>,
) {
  if (!value) return "";

  const kind = getPhonePairKind(field);
  if (kind === "primary_number" || kind === "emergency_number") {
    const pairedCountryField = getPairedPhoneField(section, field);
    if (pairedCountryField) {
      const countryCode = sectionVals[pairedCountryField.name] ?? "";
      return buildE164FromDialAndNumber(countryCode, value);
    }
  }

  if ((field.options?.length ?? 0) > 0) {
    const option = field.options!.find(o => fieldOptionValue(o) === value);
    if (option) return fieldOptionLabel(option);
  }

  if (isDateLikeField(field.name, field.type)) {
    return formatSubmissionDateValue(value);
  }

  return value;
}

function shouldSpanFullWidth(field: PortalSubmissionField) {
  if (field.type === "textarea" || field.type === "file") return true;

  const normalized = normalizeFieldKey(field.name);
  const isAddressField = normalized.endsWith("address") && !normalized.includes("email");
  return isAddressField || /(experience|achievement|organization|portfolio|resume|medical|disease|specialneed|essay|twibbon|requirement|originaddress|currentaddress)/.test(normalized);
}

function isLegacyEssayField(field: PortalSubmissionField) {
  const normalized = normalizeFieldKey(field.name);
  if (normalized.includes("essay") || normalized.includes("keyword") || normalized.includes("reference")) {
    return true;
  }

  if (field.type !== "textarea") return false;

  const label = field.label.trim().toLowerCase().replace(/\s+/g, " ");
  const placeholder = (field.placeholder || "").trim().toLowerCase();
  const rules = field.validationRules;
  const hasWordLimitRule =
    rules &&
    typeof rules === "object" &&
    ["wordLimit", "maxWords", "minWords"].some(key =>
      Object.prototype.hasOwnProperty.call(rules, key)
    );
  const looksLikeEssayPrompt =
    label.endsWith("?") ||
    label.includes("word limit") ||
    placeholder.includes("word limit");

  return Boolean(hasWordLimitRule || looksLikeEssayPrompt);
}

function FieldMedia({ field }: { field: PortalSubmissionField }) {
  if (!field.mediaUrl) return null;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [assetDrawerOpen, setAssetDrawerOpen] = useState(false);
  const assetLabel = field.mediaAlt?.trim() || `${field.label} reference`;

  return (
    <>
      <button
        type="button"
        onClick={() => setAssetDrawerOpen(true)}
        className="border-primary/30 bg-primary/5 hover:bg-primary/10 mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium text-primary transition"
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
  );
}

export default function SubmissionEditSection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { me } = useDashboardData();
  const stepperScrollRef = useRef<HTMLDivElement | null>(null);
  const isUpdatingUrlRef = useRef(false);
  const [detail, setDetail] = useState<PortalSubmissionDetail | null>(null);
  const isLocked = detail ? detail.status !== "draft" : false;
  const [sectionValues, setSectionValues] = useState<Record<string, Record<string, string>>>({});
  const [essayValues, setEssayValues] = useState<Record<string, string>>({});
  // Fields the user actually edited this session (sectionId -> field names /
  // essay ids). Drives what gets persisted to the local draft, so a stale or
  // foreign localStorage blob can never resurrect a field nobody touched.
  const [dirtySectionFields, setDirtySectionFields] = useState<Record<string, Set<string>>>({});
  const [dirtyEssayIds, setDirtyEssayIds] = useState<Set<string>>(new Set());
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [previewVisited, setPreviewVisited] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [programSelectionReady, setProgramSelectionReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingSectionId, setSavingSectionId] = useState<string | null>(null);
  const [isPreviewSectionsExpanded, setIsPreviewSectionsExpanded] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [highlightChecklist, setHighlightChecklist] = useState(false);
  const checklistRef = useRef<HTMLDivElement | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [canScrollStepperPrev, setCanScrollStepperPrev] = useState(false);
  const [canScrollStepperNext, setCanScrollStepperNext] = useState(false);
  const [referralFieldStatuses, setReferralFieldStatuses] = useState<
    Record<string, 'idle' | 'checking' | 'valid' | 'invalid' | 'unknown'>
  >({});
  const [touchedPhoneKeys, setTouchedPhoneKeys] = useState<Set<string>>(new Set());

  // Generate localStorage key unik buat tiap user & program
  const localStorageKey = `submission_autosave_${me?.userId || "guest"}_${selectedProgramId || "default"}`;

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
      window.removeEventListener(ACTIVE_PROGRAM_CHANGED_EVENT, syncSelectedProgram as EventListener);
    };
  }, [me?.registeredPrograms]);

  useEffect(() => {
    if (!programSelectionReady) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(appendProgramId("/api/portal/submissions/detail", selectedProgramId), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        const json = (await res.json().catch(() => null)) as unknown;
        if (!res.ok) throw new Error(getErrorMessage(json, "Failed to load submission detail"));

        const nextDetail = toPortalSubmissionDetail(getEnvelopeData(json));
        if (!cancelled && nextDetail) {
          if (nextDetail.programId && nextDetail.programId !== selectedProgramId) {
            syncActiveProgramId(nextDetail.programId);
            setSelectedProgramId(nextDetail.programId);
          }
          setDetail(nextDetail);
          setActiveSectionId(current => {
            const rawStep = new URLSearchParams(window.location.search).get("step")?.trim();
            const requestedFromUrl = rawStep ? (rawStep === "preview" ? PREVIEW_STEP_ID : rawStep) : null;
            const validStepIds = new Set([
              ...nextDetail.sections.map(section => section.id),
              PREVIEW_STEP_ID,
            ]);

            if (requestedFromUrl && validStepIds.has(requestedFromUrl)) {
              return requestedFromUrl;
            }

            if (current && validStepIds.has(current)) {
              return current;
            }

            return nextDetail.sections[0]?.id ?? null;
          });

          // Server is the baseline. A local draft (crash-recovery only) may
          // only override fields it actually tracked as dirty, and only when
          // it's still fresh - see mergeServerWithFreshDraft for why we can't
          // compare against a real server-side timestamp here.
          const draftEnvelope = loadFromLocalStorage<DraftEnvelope<SubmissionDraftPayload> | null>(
            localStorageKey,
            null,
          );

          const serverSectionValues = Object.fromEntries(
            nextDetail.sections.map(section => [
              section.id,
              Object.fromEntries(
                section.fields.map(field => [field.name, normalizeInputValue(section.values[field.name])]),
              ),
            ]),
          );

          const serverEssayValues = Object.fromEntries(
            nextDetail.essays.map(essay => [essay.id, normalizeInputValue(essay.answer)])
          );

          const merged = mergeServerWithFreshDraft(serverSectionValues, serverEssayValues, draftEnvelope);
          setSectionValues(merged.sectionValues);
          setEssayValues(merged.essayValues);
          // Seed dirty tracking from whatever draft actually got reapplied, so a
          // later edit/save knows what's genuinely still unsaved.
          setDirtySectionFields(merged.dirtySectionFields);
          setDirtyEssayIds(merged.dirtyEssayIds);
          // A stale draft was found but ignored - wipe it now so it doesn't
          // keep lingering (and doesn't fool the mirror-effect empty check).
          if (merged.discardedStaleDraft) {
            clearLocalStorage(localStorageKey);
          }
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load submission detail");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [programSelectionReady, selectedProgramId, localStorageKey]);

  // Auto-save ke localStorage setiap data berubah (buat jaga kalau device mati).
  // Cuma field yang beneran dirty (user-edited) yang keprojeksi, biar draft
  // gak pernah nge-resurrect field yang gak pernah disentuh user.
  const autoSaveData = useMemo(
    () => projectDirtyDraft(sectionValues, essayValues, dirtySectionFields, dirtyEssayIds),
    [sectionValues, essayValues, dirtySectionFields, dirtyEssayIds],
  );
  useAutoSave(localStorageKey, autoSaveData, undefined, 3000, isSubmissionDraftEmpty);

  const activeSection = useMemo(() => {
    if (activeSectionId === PREVIEW_STEP_ID) return null;
    return detail?.sections.find(section => section.id === activeSectionId) ?? null;
  }, [activeSectionId, detail?.sections]);

  // Mark the Preview step as visited once the participant opens it, so the
  // stepper can show it "in progress" (and "done" once the app is submitted).
  useEffect(() => {
    if (activeSectionId === PREVIEW_STEP_ID) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewVisited(true);
    }
  }, [activeSectionId]);

  const stepperItems = useMemo(() => {
    if (!detail) return [] as Array<{ id: string; title: string; status: string | null | undefined }>;
    // Use only the monotonic previewVisited flag here. Depending on the live
    // activeSectionId made this memo reactive to the active tab, which fed the
    // step<->URL sync effects and caused the Preview tab to flicker (set-state
    // loop). previewVisited is set once (effect below) and never cleared.
    const previewOpened = previewVisited;
    const previewStatus = detail.status !== "draft"
      ? "completed"
      : previewOpened
        ? "in_progress"
        : undefined;
    return [
      ...detail.sections.map(s => {
        const currentValues = sectionValues[s.id] || {};
        const calculatedStatus = calculateSectionStatus(s, currentValues);
        return { id: s.id, title: s.title, status: calculatedStatus };
      }),
      { id: PREVIEW_STEP_ID, title: "Preview", status: previewStatus },
    ];
  }, [detail, sectionValues, previewVisited]);

  const activeSectionIndex = useMemo(() => {
    return stepperItems.findIndex(step => step.id === activeSectionId);
  }, [activeSectionId, stepperItems]);

  const requestedStepId = useMemo(() => {
    const rawStep = searchParams.get("step")?.trim();
    if (!rawStep) return null;
    return rawStep === "preview" ? PREVIEW_STEP_ID : rawStep;
  }, [searchParams]);

  useEffect(() => {
    if (!requestedStepId) return;
    // Skip if we're currently updating the URL (prevent loop)
    if (isUpdatingUrlRef.current) return;
    // Check if stepper has items before proceeding
    if (stepperItems.length === 0) return;
    const hasRequestedStep = stepperItems.some(step => step.id === requestedStepId);
    if (!hasRequestedStep) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveSectionId(current => (current === requestedStepId ? current : requestedStepId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedStepId, stepperItems, isUpdatingUrlRef]);

  // Ref guard so our own `router.replace` — which mutates `searchParams`, a dep
  // of this effect — cannot re-enter and re-fire the navigation in a loop.
  const lastSyncedStepRef = useRef<string | null>(null);
  useEffect(() => {
    if (!activeSectionId) return;

    const stepParamValue = activeSectionId === PREVIEW_STEP_ID ? "preview" : activeSectionId;
    const currentStepParam = searchParams.get("step");
    if (currentStepParam === stepParamValue) return;

    isUpdatingUrlRef.current = true;
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("step", stepParamValue);
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
    // Reset ref after a short delay to allow URL update to complete
    setTimeout(() => {
      isUpdatingUrlRef.current = false;
    }, 100);
  }, [activeSectionId, pathname, router]);

  const sectionEssays = useMemo(() => {
    if (!activeSection || activeSection.id !== "entry_information") return [];
    return [...(detail?.essays ?? [])].sort((left, right) => left.order - right.order);
  }, [activeSection, detail?.essays]);

  const sectionEssayGuideline = useMemo(() => {
    if (!detail) return null;
    const text = detail.essayGuidelineText?.trim() || "";
    const url = detail.essayGuidelineUrl?.trim() || "";
    if (!text && !url) return null;

    return {
      text,
      url,
    };
  }, [detail]);

  const updateFieldValue = (sectionId: string, fieldName: string, value: string) => {
    setSectionValues(current => ({
      ...current,
      [sectionId]: {
        ...(current[sectionId] || {}),
        [fieldName]: value,
      },
    }));
    setDirtySectionFields(current => {
      const existing = current[sectionId];
      if (existing?.has(fieldName)) return current;
      const nextFields = new Set(existing);
      nextFields.add(fieldName);
      return { ...current, [sectionId]: nextFields };
    });
  };

  // Soft, non-blocking phone validation: marked "touched" on blur so we don't
  // flash an error while the participant is still typing.
  const phoneTouchKey = (sectionId: string, fieldName: string) => `${sectionId}::${fieldName}`;
  const markPhoneTouched = (sectionId: string, fieldName: string) => {
    setTouchedPhoneKeys(prev => new Set(prev).add(phoneTouchKey(sectionId, fieldName)));
  };
  const isPhoneTouched = (sectionId: string, fieldName: string) =>
    touchedPhoneKeys.has(phoneTouchKey(sectionId, fieldName));

  // Dynamic fields are admin-defined in the DB, so a referral code field can
  // arrive under any key. Detect it resiliently from the key, the visible
  // label, or an explicit admin `fieldKind` flag, rather than a single rigid
  // key pattern. Covers ref_code / ref-code / refCode / referralCode /
  // "Referral Code" (UUID key) / ambassador_code, etc.
  const fieldLooksLikeReferral = (field: {
    name?: string;
    label?: string;
    validationRules?: Record<string, unknown> | null;
  }): boolean => {
    const kind = (field.validationRules as { fieldKind?: unknown } | null | undefined)?.fieldKind;
    if (typeof kind === 'string' && /referral|ambassador/i.test(kind)) return true;
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');
    const looks = (s: string) =>
      s.includes('referral') ||
      s.includes('refcode') ||
      s.includes('ambassadorcode') ||
      s.includes('ambassadorreferral');
    return looks(normalize(field.name ?? '')) || looks(normalize(field.label ?? ''));
  };

  // Resolve referral fields once from the full field definitions (which carry
  // label + validationRules), then key all the name-based checks off this set
  // so detection stays consistent across validation, save-stripping, and render.
  const referralFieldNames = useMemo(() => {
    const set = new Set<string>();
    for (const section of detail?.sections ?? []) {
      for (const field of section.fields) {
        if (fieldLooksLikeReferral(field)) set.add(field.name);
      }
    }
    return set;
  }, [detail?.sections]);

  const isReferralField = (fieldName: string) => referralFieldNames.has(fieldName);

  // Scoped to just the referral fields' own values (not the whole sectionValues
  // object) so a keystroke in an unrelated field - name, address, essay, anything
  // else on the page - doesn't re-run this effect. It previously depended on
  // sectionValues wholesale, so every keystroke anywhere in the form re-fired
  // setReferralFieldStatuses (a real render, on top of the render the keystroke
  // itself already caused) even though nothing referral-related had changed.
  const referralFieldEntries = useMemo(
    () =>
      Object.values(sectionValues).flatMap(sv =>
        Object.entries(sv).filter(([name]) => isReferralField(name)),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sectionValues, referralFieldNames],
  );
  const referralFieldEntriesKey = referralFieldEntries.map(([name, value]) => `${name}=${value}`).join('|');

  useEffect(() => {
    if (referralFieldEntries.length === 0) return;

    // Batch the immediate idle/checking statuses into a single state update
    // rather than one setState per entry inside the effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReferralFieldStatuses(prev => {
      const next = { ...prev };
      for (const [name, code] of referralFieldEntries) {
        next[name] = code.trim() ? 'checking' : 'idle';
      }
      return next;
    });

    const timers: ReturnType<typeof setTimeout>[] = [];

    for (const [name, code] of referralFieldEntries) {
      const trimmed = code.trim();
      if (!trimmed) {
        continue;
      }
      const timer = setTimeout(async () => {
        try {
          const res = await fetch(`/api/referral/validate?code=${encodeURIComponent(trimmed)}`);
          const json = await res.json().catch(() => ({})) as { valid: boolean | null };
          setReferralFieldStatuses(prev => ({
            ...prev,
            [name]: json.valid === true ? 'valid' : json.valid === false ? 'invalid' : 'unknown',
          }));
        } catch {
          setReferralFieldStatuses(prev => ({ ...prev, [name]: 'unknown' }));
        }
      }, 700);
      timers.push(timer);
    }

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referralFieldEntriesKey]);

  const saveActiveSection = async () => {
    if (!activeSection) return;

    setSavingSectionId(activeSection.id);
    setError(null);

    try {
      const rawPayload = sectionValues[activeSection.id] || {};

      // Strip referral fields already confirmed invalid so they don't block save
      const filteredPayload = Object.fromEntries(
        Object.entries(rawPayload)
          // Never send a blank category from a section save — applicationCategory is
          // owned by the switch-category flow, and an empty value previously wiped it
          // server-side. A real selection still flows through.
          .filter(([k, v]) => !(isCategoryFieldKey(k) && (v == null || String(v).trim() === '')))
          .map(([k, v]) =>
            isReferralField(k) && referralFieldStatuses[k] === 'invalid' ? [k, ''] : [k, v],
          ),
      );

      // Normalize phone fields to E.164 (mirrors the backend's save-time behavior).
      // Numbers that don't parse as valid are left exactly as entered — this never
      // blocks the save.
      const regionHint = findNationalityCountryCode(detail?.sections ?? [], sectionValues);
      const sectionPayload = normalizeSectionPhoneFields(activeSection, filteredPayload, regionHint);

      const buildRequests = (payload: Record<string, unknown>): Promise<Response>[] => {
        const reqs: Promise<Response>[] = [
          fetch(appendProgramId(`/api/portal/submissions/sections/${activeSection.id}`, selectedProgramId), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: payload }),
          }),
        ];
        if (activeSection.id === "entry_information" && sectionEssays.length > 0) {
          reqs.push(
            fetch(appendProgramId("/api/portal/submissions/sections/essays", selectedProgramId), {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ data: Object.fromEntries(sectionEssays.map(essay => [essay.id, essayValues[essay.id] || ""])) }),
            }),
          );
        }
        return reqs;
      };

      let responses = await Promise.all(buildRequests(sectionPayload));
      let results = await Promise.all(responses.map(r => r.json().catch(() => null)));
      let failed = responses.findIndex(r => !r.ok);

      // Auto-retry: if save failed and section has referral fields with values, strip them and retry
      if (failed >= 0) {
        const hasReferralValues = Object.entries(sectionPayload).some(
          ([k, v]) => isReferralField(k) && typeof v === 'string' && v.trim().length > 0,
        );
        if (hasReferralValues) {
          const strippedPayload = Object.fromEntries(
            Object.entries(sectionPayload).map(([k, v]) => isReferralField(k) ? [k, ''] : [k, v]),
          );
          const retryResponses = await Promise.all(buildRequests(strippedPayload));
          const retryResults = await Promise.all(retryResponses.map(r => r.json().catch(() => null)));
          const retryFailed = retryResponses.findIndex(r => !r.ok);
          if (retryFailed < 0) {
            // Retry succeeded — mark referral fields as invalid in state so user sees feedback
            const referralKeys = Object.keys(sectionPayload).filter(isReferralField);
            setReferralFieldStatuses(prev => ({
              ...prev,
              ...Object.fromEntries(referralKeys.map(k => [k, 'invalid' as const])),
            }));
            responses = retryResponses;
            results = retryResults;
            failed = -1;
          } else {
            results = retryResults;
            failed = retryFailed;
          }
        }
      }

      if (failed >= 0) {
        throw new Error(getErrorMessage(results[failed], "Failed to save submission section"));
      }

      // Reflect the normalized phone values locally so the field shows the same
      // E.164 form that was just persisted, without waiting for a full reload.
      setSectionValues(current => ({
        ...current,
        [activeSection.id]: { ...(current[activeSection.id] || {}), ...sectionPayload },
      }));

      toast.success(`${activeSection.title} saved successfully.`);

      // Only the active section (and its essays, for entry_information) was
      // actually persisted just now - clear dirty tracking for just that
      // scope. A different section the user also edited stays dirty; the
      // autoSaveData/useAutoSave mirror effect above reacts to that state
      // change on its own and rewrites localStorage to match (or removes it
      // entirely once nothing is left dirty), so no manual localStorage call
      // is needed here.
      const savedEssayIds =
        activeSection.id === "entry_information" ? sectionEssays.map(essay => essay.id) : [];
      const clearedDirty = clearDirtyAfterSectionSave(
        dirtySectionFields,
        dirtyEssayIds,
        activeSection.id,
        savedEssayIds,
      );
      setDirtySectionFields(clearedDirty.dirtySectionFields);
      setDirtyEssayIds(clearedDirty.dirtyEssayIds);

      try {
        const res = await fetch(appendProgramId("/api/portal/submissions/detail", selectedProgramId), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        const json = (await res.json().catch(() => null)) as unknown;
        if (res.ok) {
          const nextDetail = toPortalSubmissionDetail(getEnvelopeData(json));
          if (nextDetail) {
            setDetail(nextDetail);
          }
        }
      } catch (refreshError) {
        // Don't show error for refresh failure, save was successful
        console.error("Failed to refresh submission detail:", refreshError);
      }
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Failed to save submission section";
      setError(message);
      toast.error(message);
    } finally {
      setSavingSectionId(null);
    }
  };

  const goToAdjacentSection = (direction: -1 | 1) => {
    if (activeSectionIndex < 0) return;
    const next = stepperItems[activeSectionIndex + direction];
    if (next) setActiveSectionId(next.id);
  };

  const scrollStepper = (direction: -1 | 1) => {
    const container = stepperScrollRef.current;
    if (!container) return;
    const scrollAmount = Math.max(180, Math.floor(container.clientWidth * 0.7));
    container.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
  };

  useEffect(() => {
    const container = stepperScrollRef.current;
    if (!container) return;

    const updateScrollAffordance = () => {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      setCanScrollStepperPrev(container.scrollLeft > 6);
      setCanScrollStepperNext(container.scrollLeft < maxScrollLeft - 6);
    };

    updateScrollAffordance();
    container.addEventListener("scroll", updateScrollAffordance, { passive: true });
    window.addEventListener("resize", updateScrollAffordance);

    return () => {
      container.removeEventListener("scroll", updateScrollAffordance);
      window.removeEventListener("resize", updateScrollAffordance);
    };
  }, [activeSectionId, stepperItems.length]);

  useEffect(() => {
    if (!showSubmitConfirm) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowSubmitConfirm(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [showSubmitConfirm]);

  const renderFieldInput = (section: PortalSubmissionSection, field: PortalSubmissionField, locked: boolean) => {
    const value = sectionValues[section.id]?.[field.name] ?? "";
    // Default phone country follows the participant's selected nationality (else ID).
    const defaultPhoneCountry = findNationalityCountryCode(detail?.sections ?? [], sectionValues);
    const fieldType = field.type.toLowerCase();
    const isRadioField = fieldType === "radio";
    const treatAsSelect =
      fieldType === "select" ||
      getFieldInputType(field) === "select" ||
      isCategoryField(field) ||
      isDropdownLikeField(field);
    const phonePairKind = getPhonePairKind(field);

    if (phonePairKind === "primary_number" || phonePairKind === "emergency_number") {
      const pairedCountryField = getPairedPhoneField(section, field);

      if (pairedCountryField) {
        const countryCodeValue = sectionValues[section.id]?.[pairedCountryField.name] ?? "";
        const e164 = buildE164FromDialAndNumber(countryCodeValue, value);
        const phoneTouched = isPhoneTouched(section.id, field.name);
        const phoneInvalid = phoneTouched && e164.trim() !== "" && !isValidPhone(e164, defaultPhoneCountry);

        return (
          <div className="w-full">
            <PhoneField
              value={e164}
              defaultCountry={defaultPhoneCountry}
              hasError={phoneInvalid}
              onChange={nextE164 => {
                const normalized = splitE164ToDialAndNumber(nextE164);
                updateFieldValue(section.id, pairedCountryField.name, normalized.countryCode);
                updateFieldValue(section.id, field.name, normalized.phoneNumber);
              }}
              onBlur={() => markPhoneTouched(section.id, field.name)}
              disabled={locked}
            />
            {phoneInvalid ? (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-amber-500">
                <AlertTriangle className="h-3.5 w-3.5" /> This doesn&apos;t look like a valid phone number. You can still save, but please double-check it.
              </p>
            ) : null}
          </div>
        );
      }
    }

    if (field.type === "textarea") {
      return (
        <EnglishTextArea
          className={`${submissionTheme.essayTextarea} min-h-[140px]`}
          value={value}
          onChange={event => updateFieldValue(section.id, field.name, event.target.value)}
          placeholder={field.placeholder || plainTextFromRichText(field.helpText) || ""}
          disabled={locked}
          readOnly={locked}
        />
      );
    }

    if (isRadioField && !treatAsSelect && (field.options?.length ?? 0) > 0) {
      return (
        <div className="space-y-2">
          {(field.options || []).map(option => {
            const optionValue = fieldOptionValue(option);

            return (
              <div key={optionValue} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  name={`field-${field.id}`}
                  value={optionValue}
                  checked={value === optionValue}
                  onChange={event => updateFieldValue(section.id, field.name, event.target.value)}
                  className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                  disabled={locked}
                />
                <span>{fieldOptionLabel(option)}</span>
              </div>
            );
          })}
        </div>
      );
    }

    if (treatAsSelect) {
      return (
        <select
          className={submissionTheme.editInputBase}
          value={value}
          onChange={event => updateFieldValue(section.id, field.name, event.target.value)}
          disabled={locked}
        >
          <option value="">Select an option</option>
          {(field.options || []).map(option => (
            <option key={fieldOptionValue(option)} value={fieldOptionValue(option)}>
              {fieldOptionLabel(option)}
            </option>
          ))}
        </select>
      );
    }

    if (isCountrySelectorField(field)) {
      return (
        <CountryField
          value={value}
          onChange={code => updateFieldValue(section.id, field.name, code)}
          placeholder={field.placeholder}
          disabled={locked}
        />
      );
    }

    if (field.type === "phone") {
      const phoneTouched = isPhoneTouched(section.id, field.name);
      const phoneInvalid = phoneTouched && value.trim() !== "" && !isValidPhone(value, defaultPhoneCountry);

      return (
        <div className="w-full">
          <PhoneField
            value={value}
            defaultCountry={defaultPhoneCountry}
            hasError={phoneInvalid}
            onChange={e164 => updateFieldValue(section.id, field.name, e164)}
            onBlur={() => markPhoneTouched(section.id, field.name)}
            disabled={locked}
          />
          {phoneInvalid ? (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-amber-500">
              <AlertTriangle className="h-3.5 w-3.5" /> This doesn&apos;t look like a valid phone number. You can still save, but please double-check it.
            </p>
          ) : null}
        </div>
      );
    }

    const inputType = field.type === "date" || field.type === "url" ? field.type : "text";
    if (inputType === "text") {
      const isNameField = /name/i.test(field.name) || /name/i.test(field.label);

      if (isReferralField(field.name)) {
        const status = referralFieldStatuses[field.name] ?? 'idle';
        return (
          <div className="w-full">
            <EnglishTextInput
              type="text"
              className={`${submissionTheme.editInputBase} ${
                status === 'valid'
                  ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/20'
                  : status === 'invalid'
                    ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500/20'
                    : ''
              }`}
              value={value}
              onChange={event => updateFieldValue(section.id, field.name, event.target.value)}
              placeholder={field.placeholder || "ABC-123"}
              restrictMode="general"
              disabled={locked}
              readOnly={locked}
            />
            {status === 'idle' && (
              <p className="mt-1.5 text-xs text-slate-400">
                Optional. You can submit with or without a code.
              </p>
            )}
            {value.trim() && status === 'checking' && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                <Loader2 className="h-3 w-3 animate-spin" /> Checking code…
              </p>
            )}
            {status === 'valid' && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" /> Valid referral code.
              </p>
            )}
            {status === 'invalid' && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-amber-500">
                <AlertTriangle className="h-3.5 w-3.5" /> We don’t recognize this code, but that’s no problem. You can still submit without it.
              </p>
            )}
          </div>
        );
      }

      return (
        <EnglishTextInput
          type="text"
          className={submissionTheme.editInputBase}
          value={value}
          onChange={event => {
            const raw = event.target.value;
            updateFieldValue(section.id, field.name, isEmailField(field) ? normalizeEmailInput(raw) : raw);
          }}
          placeholder={field.placeholder || plainTextFromRichText(field.helpText) || ""}
          restrictMode={isNameField ? "name" : "general"}
          disabled={locked}
          readOnly={locked}
        />
      );
    }
    return (
      <input
        type={inputType}
        className={submissionTheme.editInputBase}
        value={value}
        onChange={event => updateFieldValue(section.id, field.name, event.target.value)}
        placeholder={field.placeholder || plainTextFromRichText(field.helpText) || ""}
        disabled={locked}
        readOnly={locked}
      />
    );
  };

  if (loading) {
    return <DashboardPageSkeleton variant="submission-edit" className={submissionTheme.editSectionWrapper} />;
  }

  return (
    <section className={submissionTheme.editSectionWrapper}>
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {!loading && detail ? (
        <>
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Submissions", href: "/dashboard/submission" },
              { label: "Registration Form", href: "/dashboard/submission" },
              { label: "Edit Form" },
            ]}
          />

          {/* Page Title */}
          <h1 className="text-2xl font-bold text-slate-900">
            Registration Form
          </h1>

          {/* Stepper */}
          <div className={submissionTheme.stepperCard}>
            <div className="mb-2 flex items-center justify-between md:hidden">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Swipe steps
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => scrollStepper(-1)}
                  disabled={!canScrollStepperPrev}
                  aria-label="Scroll to previous steps"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollStepper(1)}
                  disabled={!canScrollStepperNext}
                  aria-label="Scroll to next steps"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="relative">
              <div ref={stepperScrollRef} className={submissionTheme.stepperRow}>
              {stepperItems.map((step, index) => {
                const sectionStatus = String(step.status || "pending").toLowerCase();
                const isDone = sectionStatus === "completed";
                const isSectionInProgress = sectionStatus === "in_progress";
                const isActive = index === activeSectionIndex;
                const isLast = index === stepperItems.length - 1;

                const circleClass = isDone
                  ? submissionTheme.stepperCircleDone
                  : isActive || isSectionInProgress
                    ? submissionTheme.stepperCircleActive
                    : submissionTheme.stepperCircleIdle;

                const statusClass = isDone
                  ? submissionTheme.stepperStatusDone
                  : isSectionInProgress
                    ? submissionTheme.stepperStatusActive
                    : submissionTheme.stepperStatusIdle;

                const statusLabel = isDone ? "Done" : isSectionInProgress ? "In Progress" : "Not yet";

                const connectorBarClass = isDone
                  ? submissionTheme.stepperConnectorDone
                  : isSectionInProgress || isActive
                    ? submissionTheme.stepperConnectorActive
                    : submissionTheme.stepperConnectorIdle;

                return (
                  <div key={step.id} className={submissionTheme.stepperPillRow}>
                    <button
                      type="button"
                      className={submissionTheme.stepperButtonBase}
                      onClick={() => setActiveSectionId(step.id)}
                    >
                      <div className={`${submissionTheme.stepperCircle} ${circleClass}`}>
                        {isDone ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                      </div>
                      <div className={submissionTheme.stepperTextWrapper}>
                        <p className={submissionTheme.stepperStepTitle}>{step.title}</p>
                        <span className={`${submissionTheme.stepperStatusPill} ${statusClass}`}>
                          {statusLabel}
                        </span>
                      </div>
                    </button>
                    {!isLast && (
                      <div className={submissionTheme.stepperConnectorWrapper}>
                        <div className={`${submissionTheme.stepperConnectorBar} ${connectorBarClass}`} />
                      </div>
                    )}
                  </div>
                );
              })}
              </div>
              {canScrollStepperPrev ? (
                <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent md:hidden" />
              ) : null}
              {canScrollStepperNext ? (
                <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent md:hidden" />
              ) : null}
            </div>
          </div>

          {activeSectionId === PREVIEW_STEP_ID ? (() => {
            const checklistItems = detail.previewChecklistItems ?? [];
            const allChecked = checklistItems.every(item => checkedItems.has(item));
            const isDraftApplication = detail.status === "draft";
            const previewActionType = detail.previewPrimaryAction?.type;
            // serverReady reflects the server-side gate only (required sections/essays/
            // documents). The checklist is a client-side confirmation handled separately so
            // we can point the user straight at it instead of dead-disabling the button.
            const serverReady = detail.previewPrimaryAction?.enabled ?? false;
            const previewActionReason = detail.previewPrimaryAction?.reason;
            // A passed deadline is the one blocker the participant cannot act on, so the
            // button is genuinely disabled here rather than clickable-with-an-explanation.
            const deadlinePassed = detail.previewPrimaryAction?.deadlinePassed ?? false;
            const isPaymentRequired = detail.isRegistrationPaymentRequired ?? true;
            const isPaymentSettled = isPaymentRequired
              ? (detail.isRegistrationPaymentSettled ?? false)
              : true;
            // Past the deadline there is nothing left to pay for, so the closed state wins
            // over the payment prompt.
            const shouldGoToPayment =
              isDraftApplication &&
              !deadlinePassed &&
              (previewActionType === "complete_payment" || !isPaymentSettled);
            const validationMessages = [
              ...(isDraftApplication && !isPaymentSettled
                ? ["Registration payment is required before you can submit."]
                : []),
              ...(isDraftApplication && isPaymentSettled && !serverReady
                ? [previewActionReason || "Complete all required steps before submitting."]
                : []),
              ...(isDraftApplication && isPaymentSettled && serverReady && !allChecked
                ? ["Please confirm the items above to enable submission."]
                : []),
            ];

            const toggleSection = () => setIsPreviewSectionsExpanded(prev => !prev);

            const toggleItem = (item: string) => {
              setHighlightChecklist(false);
              setCheckedItems(prev => {
                const next = new Set(prev);
                if (next.has(item)) next.delete(item); else next.add(item);
                return next;
              });
            };

            const handleSubmit = async () => {
              if (!isDraftApplication) {
                return;
              }

              if (!isPaymentSettled) {
                const reason = "Registration payment is required before you can submit.";
                setError(reason);
                toast.error(reason);
                return;
              }

              // Server-side requirements (sections/essays/documents) come first so the
              // reason surfaced is the actual blocker.
              if (!serverReady) {
                const reason = previewActionReason || "Please complete all required steps before submitting.";
                setError(reason);
                toast.error(reason);
                return;
              }

              // Checklist is the last gate: instead of leaving the button dead, clicking
              // scrolls to and highlights the unconfirmed checklist so the fix is obvious.
              if (!allChecked) {
                setHighlightChecklist(true);
                checklistRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                const reason = "Please confirm the items above before submitting.";
                setError(reason);
                toast.error(reason);
                return;
              }

              setShowSubmitConfirm(true);
            };

            const performSubmit = async () => {
              setSubmitting(true);
              setError(null);
              try {
                const res = await fetch(appendProgramId("/api/portal/submissions/submit", selectedProgramId), {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                });
                const json = (await res.json().catch(() => null)) as unknown;
                if (!res.ok) throw new Error(getErrorMessage(json, "Failed to submit application"));
                toast.success("Application submitted successfully.");
                trackCompleteRegistration(undefined, me?.email ? { email: me.email } : undefined);
                router.push("/dashboard/submission");
              } catch (submitError) {
                const message = submitError instanceof Error ? submitError.message : "Failed to submit application";
                setError(message);
                toast.error(message);
              } finally {
                setSubmitting(false);
              }
            };

            return (
              <>
              <div className={submissionTheme.formCard}>
                <div className={submissionTheme.formSectionWrapper}>
                  <div>
                    <h2 className={submissionTheme.formSectionTitle}>Preview</h2>
                    <p className={submissionTheme.formSectionSubtitle}>
                      Review all your information before submitting.
                    </p>
                  </div>

                  <div className={submissionTheme.previewWrapper}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2"
                      onClick={toggleSection}
                    >
                      <h3 className={submissionTheme.previewCardTitle}>
                        Application Sections ({detail.sections.length})
                      </h3>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 transition-transform ${isPreviewSectionsExpanded ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isPreviewSectionsExpanded ? (
                      <div className="divide-y divide-slate-200">
                        {detail.sections.map(section => (
                          <div key={section.id} className="py-3">
                            <div className="mb-2 flex items-center justify-between gap-2">
                              <h4 className={submissionTheme.previewCardTitle}>{section.title}</h4>
                              {isDraftApplication ? (
                                <button
                                  type="button"
                                  className={submissionTheme.previewEditButton}
                                  onClick={() => setActiveSectionId(section.id)}
                                >
                                  <PencilLine className={submissionTheme.previewEditIcon} />
                                  <span>Edit</span>
                                </button>
                              ) : null}
                            </div>
                            <dl className={submissionTheme.previewDefinitionList}>
                              {section.fields
                                .filter(field => shouldRenderField(section, field))
                                .map(field => {
                                  const rawValue = sectionValues[section.id]?.[field.name] ?? "";
                                  const displayValue = getPreviewDisplayValue(section, field, rawValue, sectionValues[section.id] ?? {});
                                  return (
                                    <div key={field.id}>
                                      <dt className={submissionTheme.previewDt}>{field.label}</dt>
                                      <dd className={submissionTheme.previewDd}>{displayValue || "-"}</dd>
                                    </div>
                                  );
                                })}
                              {section.id === "entry_information" && detail.essays.length > 0
                                ? [...detail.essays]
                                    .sort((a, b) => a.order - b.order)
                                    .map(essay => (
                                      <div key={essay.id} className="md:col-span-2">
                                        <dt className={submissionTheme.previewDt}>{essay.question}</dt>
                                        <dd className={submissionTheme.previewDdMultiline}>{essayValues[essay.id] || "-"}</dd>
                                      </div>
                                    ))
                                : null}
                            </dl>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  {detail.termsAndConditions ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm text-slate-700">
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Disclaimer
                      </p>
                      <div
                        className="prose prose-sm max-w-none text-slate-700"
                        dangerouslySetInnerHTML={{ __html: detail.termsAndConditions }}
                      />
                    </div>
                  ) : null}

                  {checklistItems.length > 0 ? (
                    <div
                      ref={checklistRef}
                      className={`space-y-2 border-t border-slate-200 pt-4 ${
                        highlightChecklist
                          ? "rounded-xl border border-amber-300 bg-amber-50/60 p-3 ring-2 ring-amber-400 transition-shadow"
                          : ""
                      }`}
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Please confirm the following
                      </p>
                      {checklistItems.map(item => (
                        <label
                          key={item}
                          className={`flex items-start gap-3 text-sm text-slate-700 ${
                            isDraftApplication ? "cursor-pointer" : "cursor-default"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:opacity-100"
                            checked={!isDraftApplication || checkedItems.has(item)}
                            onChange={() => toggleItem(item)}
                            disabled={!isDraftApplication}
                          />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  ) : null}

                  {!isDraftApplication ? (
                    <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                      <div>
                        <p className="font-semibold">Application Submitted</p>
                        <p className="mt-0.5 text-xs text-emerald-700">Your application has been submitted and can no longer be edited.</p>
                      </div>
                    </div>
                  ) : null}

                  {validationMessages.length > 0 ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50/60 px-3 py-2 text-xs text-amber-900">
                      {validationMessages.map(message => (
                        <p key={message}>{message}</p>
                      ))}
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      className={submissionTheme.secondaryButton}
                      onClick={() => goToAdjacentSection(-1)}
                    >
                      Previous
                    </button>
                    {shouldGoToPayment ? (
                      <Link
                        href="/dashboard/payments"
                        className={submissionTheme.primaryButton}
                      >
                        Complete Payment
                      </Link>
                    ) : !isDraftApplication ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-700 disabled:cursor-not-allowed"
                        disabled
                        aria-disabled="true"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Application Submitted
                      </button>
                    ) : deadlinePassed ? (
                      <button
                        type="button"
                        className={`${submissionTheme.primaryButton} cursor-not-allowed opacity-60`}
                        disabled
                        aria-disabled="true"
                        title={previewActionReason}
                      >
                        Submission Closed
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={submissionTheme.primaryButton}
                        disabled={submitting}
                        onClick={() => void handleSubmit()}
                      >
                        {submitting ? "Submitting..." : "Submit Application"}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {showSubmitConfirm ? (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                  role="dialog"
                  aria-modal="true"
                  onClick={(e) => { if (e.target === e.currentTarget) setShowSubmitConfirm(false); }}
                >
                  <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" aria-hidden="true" onClick={() => setShowSubmitConfirm(false)} />
                  <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
                    <h3 className="text-base font-bold text-slate-900">Submit application?</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      Once you submit, your application is final and cannot be edited or undone. Please make sure all your information is correct before continuing.
                    </p>
                    <div className="mt-5 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        className={submissionTheme.secondaryButton}
                        onClick={() => setShowSubmitConfirm(false)}
                        disabled={submitting}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className={submissionTheme.primaryButton}
                        onClick={() => void performSubmit()}
                        disabled={submitting}
                        autoFocus
                      >
                        {submitting ? "Submitting..." : "Yes, submit"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
              </>
            );
          })() : activeSection ? (
            <div className={submissionTheme.formCard}>
              <div className={submissionTheme.formSectionWrapper}>
                <div>
                  <h2 className={submissionTheme.formSectionTitle}>{activeSection.title}</h2>
                  {activeSection.description ? (
                    <p className={submissionTheme.formSectionSubtitle}>{activeSection.description}</p>
                  ) : null}
                </div>

                {isLocked ? (
                  <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    <span>This application has been submitted and can no longer be edited.</span>
                  </div>
                ) : null}

                <div className={`${submissionTheme.formGrid} items-start`}>
                  {activeSection.fields.filter(field => shouldRenderField(activeSection, field)).map(field => {
                    const currentValue = sectionValues[activeSection.id]?.[field.name] ?? "";
                    const selectedDescription = getSelectedOptionDescription(field, currentValue);

                    return (
                      <div
                        key={field.id}
                        className={`${submissionTheme.editFieldLabelWrapper} ${
                          shouldSpanFullWidth(field) ? "md:col-span-2" : ""
                        }`}
                      >
                        <div className={submissionTheme.editFieldLabelText}>
                          <span dangerouslySetInnerHTML={{ __html: sanitizeInlineHtml(field.label) }} />
                          {field.isRequired ? " *" : ""}
                        </div>
                        {renderFieldInput(activeSection, field, isLocked)}
                        {selectedDescription ? (
                          <p className={submissionTheme.readSectionSubtitle}>{selectedDescription}</p>
                        ) : null}
                        <FieldHelpText html={field.helpText} className="mt-1" />
                        <FieldMedia field={field} />
                        <FieldHelpAssets items={field.helpAssets} className="mt-2" />
                      </div>
                    );
                  })}
                </div>

                {sectionEssays.length > 0 ? (
                  <div className={submissionTheme.mainEssaySectionWrapper}>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">Essay Questions</h3>
                      <p className="mt-1 text-[13px] text-slate-700">
                        Answer the program essay prompts below. These responses are saved separately from the form fields.
                      </p>
                    </div>

                    {sectionEssayGuideline ? (
                      <div className="flex flex-col gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5 text-[13px] text-blue-800">
                        {sectionEssayGuideline.text ? (
                          <div
                            className="prose prose-sm max-w-none text-blue-800 prose-headings:text-blue-900 prose-p:my-0 prose-a:text-blue-700"
                            dangerouslySetInnerHTML={{ __html: sectionEssayGuideline.text }}
                          />
                        ) : null}
                        {sectionEssayGuideline.url ? (
                          <a
                            href={sectionEssayGuideline.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-semibold text-blue-600 underline-offset-2 hover:underline"
                          >
                            View Essay Guidelines →
                          </a>
                        ) : null}
                      </div>
                    ) : null}

                    {sectionEssays.map((essay: PortalSubmissionEssay) => (
                      <div key={essay.id} className="space-y-2">
                        <label className={submissionTheme.editFieldLabelWrapper}>
                          <span className={submissionTheme.editFieldLabelText}>{essay.question}</span>
                          <EnglishTextArea
                            className={submissionTheme.essayTextarea}
                            value={essayValues[essay.id] || ""}
                            onChange={event => {
                              const nextValue = event.target.value;
                              setEssayValues(current => ({
                                ...current,
                                [essay.id]: nextValue,
                              }));
                              setDirtyEssayIds(current => {
                                if (current.has(essay.id)) return current;
                                const next = new Set(current);
                                next.add(essay.id);
                                return next;
                              });
                            }}
                            placeholder={essay.wordLimit ? `Word limit: ${essay.wordLimit}` : "Write your answer"}
                            disabled={isLocked}
                            readOnly={isLocked}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                ) : null}

                {detail.requirements.length > 0 ? (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <div>
                        <p className="font-semibold">Documents are handled in a separate submission flow.</p>
                        <p className="mt-1 text-xs text-amber-800">
                          Required documents: {detail.requirements.map(requirement => requirement.name).join(", ")}.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    className={submissionTheme.secondaryButton}
                    onClick={() => goToAdjacentSection(-1)}
                    disabled={activeSectionIndex <= 0}
                  >
                    Previous
                  </button>
                  <div className="flex gap-3">
                    {!isLocked ? (
                      <button
                        type="button"
                        className={submissionTheme.primaryButton}
                        onClick={saveActiveSection}
                        disabled={savingSectionId === activeSection.id}
                      >
                        {savingSectionId === activeSection.id ? "Saving..." : "Save Section"}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className={submissionTheme.secondaryButton}
                      onClick={() => goToAdjacentSection(1)}
                      disabled={activeSectionIndex >= stepperItems.length - 1}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-600 shadow-sm">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                No submission fields are configured for this program yet.
              </div>
            </div>
          )}
        </>
      ) : null}
    </section>
  );
}
