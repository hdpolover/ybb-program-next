"use client";

import { Flag, Info, MapPin, Phone, Shirt, User, User2, UserRound } from "lucide-react";
import { jysSectionTheme } from "@/lib/theme/jys-components";
import { DUMMY_PERSONAL_DETAILS } from "../SubmissionEditSection";

const submissionTheme = jysSectionTheme.dashboardSubmission;

function InputWrapper({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={submissionTheme.readInputWrapper}>
      <span className={submissionTheme.readInputIcon}>{icon}</span>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className={submissionTheme.readFieldLabelWrapper}>
      <span className={submissionTheme.readFieldLabelText}>{label}</span>
      {children}
    </label>
  );
}

function inputBaseClass() {
  return submissionTheme.readInputBase;
}

export default function SubmissionReadPersonalDetailsSection() {
  const base = inputBaseClass();
  const personal = DUMMY_PERSONAL_DETAILS;
  return (
    <section className={submissionTheme.readSectionWrapper}>
      <div>
        <h2 className={submissionTheme.readSectionHeader}>
          <span className={submissionTheme.readSectionIconCircle}>
            <Info className="h-3.5 w-3.5" />
          </span>
          <span>Personal Details</span>
        </h2>
        <p className={submissionTheme.readSectionSubtitle}>
          Fill in your basic personal information.
        </p>
      </div>

      <div className={submissionTheme.readGrid}>
        <Field label="Full Name">
          <InputWrapper icon={<User className="h-4 w-4" />}>
            <input type="text" className={`${base} pl-9`} defaultValue={personal.fullName} readOnly />
          </InputWrapper>
        </Field>
        <Field label="Nick Name">
          <InputWrapper icon={<User2 className="h-4 w-4" />}>
            <input type="text" className={`${base} pl-9`} defaultValue={personal.nickName} readOnly />
          </InputWrapper>
        </Field>
        <Field label="Gender">
          <InputWrapper icon={<UserRound className="h-4 w-4" />}>
            <select className={`${base} pl-9`} defaultValue={personal.gender} disabled>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Prefer not to say</option>
            </select>
          </InputWrapper>
        </Field>
        <Field label="Birthdate">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <input type="date" className={`${base} pl-9`} defaultValue={personal.birthdate} readOnly />
          </InputWrapper>
        </Field>
        <Field label="Nationality">
          <InputWrapper icon={<Flag className="h-4 w-4" />}>
            <input type="text" className={`${base} pl-9`} defaultValue={personal.nationality} readOnly />
          </InputWrapper>
        </Field>
        <Field label="Origin Address">
          <InputWrapper icon={<MapPin className="h-4 w-4" />}>
            <input type="text" className={`${base} pl-9`} defaultValue={personal.originAddress} readOnly />
          </InputWrapper>
        </Field>
        <Field label="Current Address">
          <InputWrapper icon={<MapPin className="h-4 w-4" />}>
            <input type="text" className={`${base} pl-9`} defaultValue={personal.currentAddress} readOnly />
          </InputWrapper>
        </Field>
        <Field label="Phone Number">
          <InputWrapper icon={<Phone className="h-4 w-4" />}>
            <input type="tel" className={`${base} pl-9`} defaultValue={personal.phoneNumber} readOnly />
          </InputWrapper>
        </Field>
        <Field label="Emergency Phone Number">
          <InputWrapper icon={<Phone className="h-4 w-4" />}>
            <input
              type="tel"
              className={`${base} pl-9`}
              defaultValue={personal.emergencyPhoneNumber}
              readOnly
            />
          </InputWrapper>
        </Field>
        <Field label="Emergency Contact Relationship">
          <InputWrapper icon={<User className="h-4 w-4" />}>
            <input
              type="text"
              className={`${base} pl-9`}
              defaultValue={personal.emergencyRelationship}
              readOnly
            />
          </InputWrapper>
        </Field>
        <Field label="T-Shirt Size">
          <InputWrapper icon={<Shirt className="h-4 w-4" />}>
            <select className={`${base} pl-9`} defaultValue={personal.tshirtSize} disabled>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </InputWrapper>
        </Field>
        <Field label="Disease History">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <textarea
              rows={3}
              className={`${base} pl-9`}
              defaultValue={personal.diseaseHistory}
              readOnly
            />
          </InputWrapper>
        </Field>
      </div>
    </section>
  );
}
