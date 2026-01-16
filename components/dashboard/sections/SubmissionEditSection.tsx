"use client";

import { useMemo, useState } from "react";
import {
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Flag,
  Info,
  Lock,
  MapPin,
  Phone,
  Shirt,
  Upload,
  User,
  User2,
  UserRound,
  Users,
  PencilLine,
} from "lucide-react";
import { jysSectionTheme } from "@/lib/theme/jys-components";
import SubmissionEditPersonalDetailsSection from "./submission/SubmissionEditPersonalDetailsSection";
import SubmissionEditProfessionalProfileSection from "./submission/SubmissionEditProfessionalProfileSection";
import SubmissionEditEntryInformationSection from "./submission/SubmissionEditEntryInformationSection";
import SubmissionEditMiscSection from "./submission/SubmissionEditMiscSection";
import SubmissionEditPreviewSection from "./submission/SubmissionEditPreviewSection";
import SubmissionEditSubmitModalSection from "./submission/SubmissionEditSubmitModalSection";

const steps = [
  "Personal Details",
  "Professional Profile",
  "Entry Information",
  "Miscellaneous",
  "Preview",
] as const;

type StepKey = (typeof steps)[number];

export type PersonalDetails = {
  fullName: string;
  nickName: string;
  gender: string;
  birthdate: string;
  nationality: string;
  originAddress: string;
  currentAddress: string;
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
  fullName: "Hilmi Farrel Firjatullah",
  nickName: "Hilmi",
  gender: "male",
  birthdate: "1999-08-12",
  nationality: "Indonesia",
  originAddress: "Bandung, West Java",
  currentAddress: "Depok, West Java, 16423",
  phoneNumber: "0812-3456-7890",
  emergencyPhoneNumber: "0813-9876-5432",
  emergencyRelationship: "Father",
  tshirtSize: "L",
  diseaseHistory: "No chronic diseases. Mild seasonal allergies only.",
};

export const DUMMY_PROFESSIONAL_PROFILE: ProfessionalProfile = {
  educationLevel: "Bachelor's (S1)",
  institution: "Universitas Indonesia",
  major: "Informatics Engineering",
  occupation: "Software Engineer Intern",
  organization: "BEM UI – Public Relations",
  experiences: "Software Engineer Intern — Tokopedia (Jun–Aug 2023).",
  achievements: "1st Place — Jakarta Youth Innovation Hackathon 2024.",
  resumeName: "",
};

export const DUMMY_ENTRY_INFO: EntryInfo = {
  participationCategory: "Social Innovation — Youth Leadership",
  programSubtheme: "SDG 3: Good Health and Well-being",
  knowledgeSource: "Instagram Ads",
  essayTitle: "How youth can drive sustainable change in local communities",
  mainEssay:
    "In this essay, I describe how youth-led initiatives can create sustainable impact in local communities through collaboration, innovation, and long-term commitment to social change.",
  keywords: [
    "User Experience",
    "User Interface",
    "Muslims",
    "Society",
    "Sustainability",
  ],
  reference:
    "UN Sustainable Development Goals reports, local government publications, and community-based research related to youth empowerment and social innovation.",
  instagramAccount: "@hilmi_farrel",
  miscKnowledgeSource: "Instagram",
  sourceAccountName: "@youngbrightbanyuwangi",
  twibbonLink: "https://twb.nz/ybb-essay-campaign",
  requirementLink: "https://drive.google.com/requirements-folder",
  ambassadorReferralCode: "YBBJYS-AMB01",
};

const submissionTheme = jysSectionTheme.dashboardSubmission;

function inputBaseClass() {
  return submissionTheme.editInputBase;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className={submissionTheme.editFieldLabelWrapper}>
      <span className={submissionTheme.editFieldLabelText}>{label}</span>
      {children}
    </label>
  );
}

function InputWrapper({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={submissionTheme.editInputWrapper}>
      <span className={submissionTheme.editInputIcon}>{icon}</span>
      {children}
    </div>
  );
}

export default function SubmissionEditSection() {
  const [activeStep, setActiveStep] = useState<StepKey>("Personal Details");
  const [personal, setPersonal] = useState<PersonalDetails>(DUMMY_PERSONAL_DETAILS);

  const [professional, setProfessional] = useState<ProfessionalProfile>(
    DUMMY_PROFESSIONAL_PROFILE
  );

  const [entry, setEntry] = useState<EntryInfo>(DUMMY_ENTRY_INFO);
  const [personalShowErrors, setPersonalShowErrors] = useState(false);
  const [professionalShowErrors, setProfessionalShowErrors] = useState(false);
  const [entryShowErrors, setEntryShowErrors] = useState(false);
  const [miscShowErrors, setMiscShowErrors] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const base = inputBaseClass();

  const currentIndex = steps.indexOf(activeStep);

  const isPersonalValid = useMemo(() => {
    return (Object.keys(personal) as (keyof PersonalDetails)[]).every(
      key => String(personal[key]).trim().length > 0
    );
  }, [personal]);

  const isProfessionalValid = useMemo(() => {
    return (Object.keys(professional) as (keyof ProfessionalProfile)[]).every(
      key => String(professional[key]).trim().length > 0
    );
  }, [professional]);

  const isEntryValid = useMemo(() => {
    return (
      entry.participationCategory.trim().length > 0 &&
      entry.programSubtheme.trim().length > 0 &&
      entry.knowledgeSource.trim().length > 0 &&
      entry.essayTitle.trim().length > 0 &&
      entry.mainEssay.trim().length > 0 &&
      entry.keywords.length > 0 &&
      entry.reference.trim().length > 0
    );
  }, [entry]);

  const isMiscValid = useMemo(() => {
    return (
      (entry.instagramAccount ?? "").trim().length > 0 &&
      (entry.miscKnowledgeSource ?? "").trim().length > 0 &&
      (entry.sourceAccountName ?? "").trim().length > 0 &&
      (entry.twibbonLink ?? "").trim().length > 0 &&
      (entry.requirementLink ?? "").trim().length > 0
    );
  }, [entry]);

  const maxReachableIndex = useMemo(() => {
    // step 0 always reachable; advance only if previous step valid
    if (!isPersonalValid) return 0;
    if (!isProfessionalValid) return 1;
    if (!isEntryValid) return 2;
    if (!isMiscValid) return 3;
    return 4;
  }, [isPersonalValid, isProfessionalValid, isEntryValid, isMiscValid]);

  const goToStep = (target: StepKey) => {
    const targetIndex = steps.indexOf(target);
    if (targetIndex <= maxReachableIndex) {
      setActiveStep(target);
    }
  };

  const goNext = () => {
    if (activeStep === "Personal Details" && !isPersonalValid) {
      setPersonalShowErrors(true);
      return;
    }
    if (activeStep === "Professional Profile" && !isProfessionalValid) {
      setProfessionalShowErrors(true);
      return;
    }
    if (activeStep === "Entry Information" && !isEntryValid) {
      setEntryShowErrors(true);
      return;
    }
    if (activeStep === "Miscellaneous" && !isMiscValid) {
      setMiscShowErrors(true);
      return;
    }

    const nextIndex = Math.min(currentIndex + 1, steps.length - 1);
    if (nextIndex <= maxReachableIndex) {
      setActiveStep(steps[nextIndex]);
    }
  };

  const goBack = () => {
    const prevIndex = Math.max(currentIndex - 1, 0);
    setActiveStep(steps[prevIndex]);
  };

  return (
    <section className={submissionTheme.editSectionWrapper}>
      {/* Stepper */}
      <div className={submissionTheme.stepperCard}>
        <div className={submissionTheme.stepperRow}>
          {steps.map((step, index) => {
            const isActive = index === currentIndex;
            const isDone = index < currentIndex && index <= maxReachableIndex;
            const isLocked = index > maxReachableIndex;

            return (
              <button
                key={step}
                type="button"
                onClick={() => goToStep(step)}
                className={`${submissionTheme.stepperButtonBase} ${
                  isLocked ? submissionTheme.stepperButtonLocked : ""
                }`}
              >
                <div className={submissionTheme.stepperPillRow}>
                  <div
                    className={`${submissionTheme.stepperCircle} ${
                      isActive
                        ? submissionTheme.stepperCircleActive
                        : isDone
                        ? submissionTheme.stepperCircleDone
                        : submissionTheme.stepperCircleIdle
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={submissionTheme.stepperConnectorWrapper}>
                      <div
                        className={`${submissionTheme.stepperConnectorBar} ${
                          index < currentIndex
                            ? submissionTheme.stepperConnectorDone
                            : isActive
                            ? submissionTheme.stepperConnectorActive
                            : submissionTheme.stepperConnectorIdle
                        }`}
                      />
                    </div>
                  )}
                </div>

                <div className={submissionTheme.stepperTextWrapper}>
                  <p className={submissionTheme.stepperStepTitle}>
                    {step}
                  </p>
                  <span
                    className={`${submissionTheme.stepperStatusPill} ${
                      isActive
                        ? submissionTheme.stepperStatusActive
                        : isDone
                        ? submissionTheme.stepperStatusDone
                        : submissionTheme.stepperStatusIdle
                    }`}
                  >
                    {isDone ? "Done" : isActive ? "Process" : "Not yet"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Forms */}
      <div className={submissionTheme.formCard}>
        {activeStep === "Personal Details" && (
          <SubmissionEditPersonalDetailsSection
            personal={personal}
            onChangePersonal={setPersonal}
            showErrors={personalShowErrors}
            onSaveAndContinue={goNext}
          />
        )}

        {activeStep === "Professional Profile" && (
          <SubmissionEditProfessionalProfileSection
            professional={professional}
            onChangeProfessional={setProfessional}
            showErrors={professionalShowErrors}
            onBack={goBack}
            onSaveAndContinue={goNext}
          />
        )}

        {activeStep === "Entry Information" && (
          <SubmissionEditEntryInformationSection
            entry={entry}
            onChangeEntry={setEntry}
            showErrors={entryShowErrors}
            onBack={goBack}
            onGoToPreview={goNext}
          />
        )}

        {activeStep === "Miscellaneous" && (
          <SubmissionEditMiscSection
            entry={entry}
            onChangeEntry={setEntry}
            showErrors={miscShowErrors}
            onBack={goBack}
            onGoToPreview={goNext}
          />
        )}

        {activeStep === "Preview" && (
          <SubmissionEditPreviewSection
            personal={personal}
            professional={professional}
            entry={entry}
            onBack={goBack}
            onEditStep={setActiveStep}
            onSubmitClick={() => setShowSubmitModal(true)}
          />
        )}
      </div>

      {showSubmitModal && <SubmissionEditSubmitModalSection onClose={() => setShowSubmitModal(false)} />}
    </section>
  );
}
