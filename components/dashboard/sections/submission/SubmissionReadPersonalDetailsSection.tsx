"use client";

import React from "react";
import { Flag, Info, MapPin, Phone, Shirt, User, User2, UserRound } from "lucide-react";
import { jysSectionTheme } from "@/lib/theme/jys-components";
import { DUMMY_PERSONAL_DETAILS } from "../SubmissionEditSection";
import { getCountries, getShirtSizes, getStates } from "@/lib/api/metadata";
import type { CountryMetadata, ShirtSizeMetadata, StateMetadata } from "@/types/metadata";
import StyledSelect from "@/components/ui/StyledSelect";

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
  const [countries, setCountries] = React.useState<CountryMetadata[] | null>(null);
  const [states, setStates] = React.useState<StateMetadata[] | null>(null);
  const [shirtSizes, setShirtSizes] = React.useState<ShirtSizeMetadata[] | null>(null);

  const selectedCountry = React.useMemo(() => {
    if (!countries || !personal.nationality) return null;
    return (
      countries.find(country => country.name === personal.nationality) ??
      countries.find(country => country.isoCode === personal.nationality) ??
      null
    );
  }, [countries, personal.nationality]);

  const stateLabelByCode = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const s of states ?? []) map.set(s.isoCode, s.name);
    return map;
  }, [states]);

  const originStateLabel = stateLabelByCode.get(personal.originState) ?? personal.originState;
  const currentStateLabel = stateLabelByCode.get(personal.currentState) ?? personal.currentState;
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const tshirtOptions = React.useMemo(() => {
    if (shirtSizes && shirtSizes.length > 0) {
      return shirtSizes.map(size => ({
        value: size.code,
        label: `${size.code} — ${size.name}`,
      }));
    }
    return [
      { value: "S", label: "S" },
      { value: "M", label: "M" },
      { value: "L", label: "L" },
      { value: "XL", label: "XL" },
      { value: "XXL", label: "XXL" },
    ];
  }, [shirtSizes]);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await getCountries();
        if (!cancelled) setCountries(res);
      } catch {
        // ignore
      }
    })();

    (async () => {
      try {
        const res = await getShirtSizes();
        if (!cancelled) setShirtSizes(res);
      } catch {
        // ignore
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (!selectedCountry?.isoCode) {
          setStates(null);
          return;
        }

        const res = await getStates(selectedCountry.isoCode);
        if (!cancelled) setStates(res);
      } catch {
        if (!cancelled) setStates(null);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry?.isoCode]);

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
            <StyledSelect
              value={personal.gender}
              onChange={() => {}}
              options={genderOptions}
              placeholder="Select gender"
              className={`${base} pl-9`}
              disabled
            />
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
          <div className="grid gap-3 md:grid-cols-2">
            <InputWrapper icon={<MapPin className="h-4 w-4" />}>
              <input type="text" className={`${base} pl-9`} defaultValue={originStateLabel} readOnly />
            </InputWrapper>
            <InputWrapper icon={<MapPin className="h-4 w-4" />}>
              <input type="text" className={`${base} pl-9`} defaultValue={personal.originCity} readOnly />
            </InputWrapper>
          </div>
        </Field>
        <Field label="Current Address">
          <div className="grid gap-3 md:grid-cols-2">
            <InputWrapper icon={<MapPin className="h-4 w-4" />}>
              <input type="text" className={`${base} pl-9`} defaultValue={currentStateLabel} readOnly />
            </InputWrapper>
            <InputWrapper icon={<MapPin className="h-4 w-4" />}>
              <input type="text" className={`${base} pl-9`} defaultValue={personal.currentCity} readOnly />
            </InputWrapper>
          </div>
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
            <StyledSelect
              value={personal.tshirtSize}
              onChange={() => {}}
              options={tshirtOptions}
              placeholder="Select size"
              className={`${base} pl-9`}
              disabled
            />
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
