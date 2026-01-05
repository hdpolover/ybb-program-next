"use client";

import { Flag, Info, MapPin, Phone, Shirt, User, User2, UserRound } from "lucide-react";
import { jysSectionTheme } from "@/lib/theme/jys-components";

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
            <input
              type="text"
              className={`${base} pl-9`}
              defaultValue="Hilmi Farrel Firjatullah"
              readOnly
            />
          </InputWrapper>
        </Field>
        <Field label="Nick Name">
          <InputWrapper icon={<User2 className="h-4 w-4" />}>
            <input type="text" className={`${base} pl-9`} defaultValue="Hilmi" readOnly />
          </InputWrapper>
        </Field>
        <Field label="Gender">
          <InputWrapper icon={<UserRound className="h-4 w-4" />}>
            <select className={`${base} pl-9`} defaultValue="male" disabled>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Prefer not to say</option>
            </select>
          </InputWrapper>
        </Field>
        <Field label="Birthdate">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <input
              type="date"
              className={`${base} pl-9`}
              defaultValue="1999-08-12"
              readOnly
            />
          </InputWrapper>
        </Field>
        <Field label="Nationality">
          <InputWrapper icon={<Flag className="h-4 w-4" />}>
            <input
              type="text"
              className={`${base} pl-9`}
              defaultValue="Indonesia"
              readOnly
            />
          </InputWrapper>
        </Field>
        <Field label="Origin Address">
          <InputWrapper icon={<MapPin className="h-4 w-4" />}>
            <input
              type="text"
              className={`${base} pl-9`}
              defaultValue="Bandung, West Java"
              readOnly
            />
          </InputWrapper>
        </Field>
        <Field label="Current Address">
          <InputWrapper icon={<MapPin className="h-4 w-4" />}>
            <input
              type="text"
              className={`${base} pl-9`}
              defaultValue="Depok, West Java, 16423"
              readOnly
            />
          </InputWrapper>
        </Field>
        <Field label="Phone Number">
          <InputWrapper icon={<Phone className="h-4 w-4" />}>
            <input
              type="tel"
              className={`${base} pl-9`}
              defaultValue="0812-3456-7890"
              readOnly
            />
          </InputWrapper>
        </Field>
        <Field label="Emergency Phone Number">
          <InputWrapper icon={<Phone className="h-4 w-4" />}>
            <input
              type="tel"
              className={`${base} pl-9`}
              defaultValue="0813-9876-5432"
              readOnly
            />
          </InputWrapper>
        </Field>
        <Field label="Emergency Contact Relationship">
          <InputWrapper icon={<User className="h-4 w-4" />}>
            <input
              type="text"
              className={`${base} pl-9`}
              defaultValue="Father"
              readOnly
            />
          </InputWrapper>
        </Field>
        <Field label="T-Shirt Size">
          <InputWrapper icon={<Shirt className="h-4 w-4" />}>
            <select className={`${base} pl-9`} defaultValue="L" disabled>
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
              defaultValue="No chronic diseases. Mild seasonal allergies only."
              readOnly
            />
          </InputWrapper>
        </Field>
      </div>
    </section>
  );
}
