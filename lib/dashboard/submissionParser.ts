import type {
  PortalProgramOption,
  PortalSubmissionDetail,
  PortalSubmissionEssay,
  PortalSubmissionField,
  PortalSubmissionFieldOption,
  PortalSubmissionRequirement,
  PortalSubmissionSection,
} from "@/types/portal-submission";
import { isRecord } from "@/lib/api/response";

function toSubmissionFieldOption(value: unknown): PortalSubmissionFieldOption | null {
  if (typeof value === "string") return value;
  if (!isRecord(value)) return null;

  const label = typeof value.label === "string" ? value.label : null;
  const optionValue = typeof value.value === "string" ? value.value : null;
  if (!label || !optionValue) return null;

  return {
    label,
    value: optionValue,
    description: typeof value.description === "string" ? value.description : undefined,
  };
}

function toSubmissionField(value: unknown): PortalSubmissionField | null {
  if (!isRecord(value)) return null;

  const id = typeof value.id === "string" ? value.id : null;
  const name = typeof value.name === "string" ? value.name : null;
  const label = typeof value.label === "string" ? value.label : null;

  if (!id || !name || !label) return null;

  const options = (Array.isArray(value.options) ? value.options : [])
    .map(toSubmissionFieldOption)
    .filter((option): option is PortalSubmissionFieldOption => option !== null);

  return {
    id,
    name,
    label,
    type: typeof value.type === "string" ? value.type : "text",
    placeholder: typeof value.placeholder === "string" ? value.placeholder : undefined,
    helpText: typeof value.helpText === "string" ? value.helpText : undefined,
    mediaUrl: typeof value.mediaUrl === "string" ? value.mediaUrl : undefined,
    mediaAlt: typeof value.mediaAlt === "string" ? value.mediaAlt : undefined,
    options: options.length > 0 ? options : undefined,
    validationRules: isRecord(value.validationRules) ? value.validationRules : undefined,
    isRequired: typeof value.isRequired === "boolean" ? value.isRequired : false,
    order: typeof value.order === "number" && Number.isFinite(value.order) ? value.order : 0,
  };
}

function toSubmissionSection(value: unknown): PortalSubmissionSection | null {
  if (!isRecord(value)) return null;

  const id = typeof value.id === "string" ? value.id : null;
  const title = typeof value.title === "string" ? value.title : null;
  if (!id || !title) return null;

  const fields = (Array.isArray(value.fields) ? value.fields : [])
    .map(toSubmissionField)
    .filter((field): field is PortalSubmissionField => field !== null);

  return {
    id,
    title,
    description: typeof value.description === "string" ? value.description : undefined,
    fields,
    values: isRecord(value.values) ? value.values : {},
    status: typeof value.status === "string" ? value.status : "pending",
  };
}

function toSubmissionEssay(value: unknown): PortalSubmissionEssay | null {
  if (!isRecord(value)) return null;

  const id = typeof value.id === "string" ? value.id : null;
  const question = typeof value.question === "string" ? value.question : null;
  if (!id || !question) return null;

  return {
    id,
    question,
    isRequired: typeof value.isRequired === "boolean" ? value.isRequired : false,
    wordLimit: typeof value.wordLimit === "number" && Number.isFinite(value.wordLimit) ? value.wordLimit : undefined,
    order: typeof value.order === "number" && Number.isFinite(value.order) ? value.order : 0,
    answer: typeof value.answer === "string" ? value.answer : undefined,
  };
}

function toSubmissionRequirement(value: unknown): PortalSubmissionRequirement | null {
  if (!isRecord(value)) return null;

  const id = typeof value.id === "string" ? value.id : null;
  const name = typeof value.name === "string" ? value.name : null;
  if (!id || !name) return null;

  return {
    id,
    name,
    description: typeof value.description === "string" ? value.description : undefined,
    type: typeof value.type === "string" ? value.type : "document",
    isRequired: typeof value.isRequired === "boolean" ? value.isRequired : false,
    order: typeof value.order === "number" && Number.isFinite(value.order) ? value.order : 0,
    uploadedFile: isRecord(value.uploadedFile) ? value.uploadedFile : undefined,
  };
}

function toProgramOption(value: unknown): PortalProgramOption | null {
  if (!isRecord(value)) return null;

  const id = typeof value.id === "string" ? value.id : null;
  const name = typeof value.name === "string" ? value.name : null;
  if (!id || !name) return null;

  return { id, name };
}

export function toPortalSubmissionDetail(payload: unknown): PortalSubmissionDetail | null {
  if (!isRecord(payload)) return null;

  const applicationId = typeof payload.applicationId === "string" ? payload.applicationId : null;
  const programId = typeof payload.programId === "string" ? payload.programId : null;
  const programName = typeof payload.programName === "string" ? payload.programName : null;
  const status = typeof payload.status === "string" ? payload.status : null;

  if (!applicationId || !programId || !programName || !status) {
    return null;
  }

  const sections = (Array.isArray(payload.sections) ? payload.sections : [])
    .map(toSubmissionSection)
    .filter((section): section is PortalSubmissionSection => section !== null);
  const essays = (Array.isArray(payload.essays) ? payload.essays : [])
    .map(toSubmissionEssay)
    .filter((essay): essay is PortalSubmissionEssay => essay !== null);
  const requirements = (Array.isArray(payload.requirements) ? payload.requirements : [])
    .map(toSubmissionRequirement)
    .filter((requirement): requirement is PortalSubmissionRequirement => requirement !== null);
  const programs = (Array.isArray(payload.programs) ? payload.programs : [])
    .map(toProgramOption)
    .filter((program): program is PortalProgramOption => program !== null);

  return {
    applicationId,
    programId,
    programName,
    status,
    overallProgress:
      typeof payload.overallProgress === "number" && Number.isFinite(payload.overallProgress)
        ? payload.overallProgress
        : 0,
    sections,
    essays,
    requirements,
    programs: programs.length > 0 ? programs : undefined,
    participantName: typeof payload.participantName === "string" ? payload.participantName : undefined,
    participantId: typeof payload.participantId === "string" ? payload.participantId : undefined,
    participantAccountId:
      typeof payload.participantAccountId === "string" ? payload.participantAccountId : undefined,
    participantLocation:
      typeof payload.participantLocation === "string" ? payload.participantLocation : undefined,
    participantAvatarUrl:
      typeof payload.participantAvatarUrl === "string" ? payload.participantAvatarUrl : undefined,
  };
}