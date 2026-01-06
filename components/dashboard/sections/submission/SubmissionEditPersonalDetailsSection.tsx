"use client";

import React from "react";
import Image from "next/image";
import { Flag, Info, MapPin, Phone, Shirt, User, User2, UserRound } from "lucide-react";
import { jysSectionTheme } from "@/lib/theme/jys-components";
import type { PersonalDetails } from "../SubmissionEditSection";

const submissionTheme = jysSectionTheme.dashboardSubmission;

function InputWrapper({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={submissionTheme.editInputWrapper}>
      <span className={submissionTheme.editInputIcon}>{icon}</span>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className={submissionTheme.editFieldLabelWrapper}>
      <span className={submissionTheme.editFieldLabelText}>{label}</span>
      {children}
    </label>
  );
}

function inputBaseClass() {
  return submissionTheme.editInputBase;
}

type Props = {
  personal: PersonalDetails;
  onChangePersonal: (value: PersonalDetails) => void;
  showErrors: boolean;
  onSaveAndContinue: () => void;
};

export default function SubmissionEditPersonalDetailsSection({
  personal,
  onChangePersonal,
  showErrors,
  onSaveAndContinue,
}: Props) {
  const base = inputBaseClass();
  const [showShirtSizeModal, setShowShirtSizeModal] = React.useState(false);

  return (
    <div className={submissionTheme.formSectionWrapper}>
      <div>
        <h2 className={submissionTheme.formSectionTitle}>Personal Details</h2>
        <p className={submissionTheme.formSectionSubtitle}>Update your basic personal information.</p>
      </div>

      <div className={submissionTheme.formGrid}>
        <Field label="Full Name">
          <InputWrapper icon={<User className="h-4 w-4" />}>
            <input
              type="text"
              className={`${base} pl-9 ${
                showErrors && !personal.fullName.trim() ? submissionTheme.editInputError : ""
              }`}
              value={personal.fullName}
              onChange={e =>
                onChangePersonal({
                  ...personal,
                  fullName: e.target.value,
                })
              }
            />
          </InputWrapper>
          {showErrors && !personal.fullName.trim() && (
            <p className={submissionTheme.errorText}>This field is required.</p>
          )}
        </Field>

        <Field label="Nick Name">
          <InputWrapper icon={<User2 className="h-4 w-4" />}>
            <input
              type="text"
              className={`${base} pl-9 ${
                showErrors && !personal.nickName.trim() ? submissionTheme.editInputError : ""
              }`}
              value={personal.nickName}
              onChange={e =>
                onChangePersonal({
                  ...personal,
                  nickName: e.target.value,
                })
              }
            />
          </InputWrapper>
          {showErrors && !personal.nickName.trim() && (
            <p className={submissionTheme.errorText}>This field is required.</p>
          )}
        </Field>

        <Field label="Gender">
          <InputWrapper icon={<UserRound className="h-4 w-4" />}>
            <select
              className={`${base} pl-9 ${
                showErrors && !personal.gender.trim() ? submissionTheme.editInputError : ""
              }`}
              value={personal.gender}
              onChange={e =>
                onChangePersonal({
                  ...personal,
                  gender: e.target.value,
                })
              }
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Prefer not to say</option>
            </select>
          </InputWrapper>
          {showErrors && !personal.gender.trim() && (
            <p className={submissionTheme.errorText}>This field is required.</p>
          )}
        </Field>

        <Field label="Birthdate">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <input
              type="date"
              className={`${base} pl-9 ${
                showErrors && !personal.birthdate.trim() ? submissionTheme.editInputError : ""
              }`}
              value={personal.birthdate}
              onChange={e =>
                onChangePersonal({
                  ...personal,
                  birthdate: e.target.value,
                })
              }
            />
          </InputWrapper>
          {showErrors && !personal.birthdate.trim() && (
            <p className={submissionTheme.errorText}>This field is required.</p>
          )}
        </Field>

        <Field label="Nationality">
          <InputWrapper icon={<Flag className="h-4 w-4" />}>
            <input
              type="text"
              className={`${base} pl-9 ${
                showErrors && !personal.nationality.trim() ? submissionTheme.editInputError : ""
              }`}
              value={personal.nationality}
              onChange={e =>
                onChangePersonal({
                  ...personal,
                  nationality: e.target.value,
                })
              }
            />
          </InputWrapper>
          {showErrors && !personal.nationality.trim() && (
            <p className={submissionTheme.errorText}>This field is required.</p>
          )}
        </Field>

        <Field label="Origin Address">
          <InputWrapper icon={<MapPin className="h-4 w-4" />}>
            <input
              type="text"
              className={`${base} pl-9 ${
                showErrors && !personal.originAddress.trim() ? submissionTheme.editInputError : ""
              }`}
              value={personal.originAddress}
              onChange={e =>
                onChangePersonal({
                  ...personal,
                  originAddress: e.target.value,
                })
              }
            />
          </InputWrapper>
          {showErrors && !personal.originAddress.trim() && (
            <p className={submissionTheme.errorText}>This field is required.</p>
          )}
        </Field>

        <Field label="Current Address">
          <InputWrapper icon={<MapPin className="h-4 w-4" />}>
            <input
              type="text"
              className={`${base} pl-9 ${
                showErrors && !personal.currentAddress.trim() ? submissionTheme.editInputError : ""
              }`}
              value={personal.currentAddress}
              onChange={e =>
                onChangePersonal({
                  ...personal,
                  currentAddress: e.target.value,
                })
              }
            />
          </InputWrapper>
          {showErrors && !personal.currentAddress.trim() && (
            <p className={submissionTheme.errorText}>This field is required.</p>
          )}
        </Field>

        <Field label="Phone Number">
          <InputWrapper icon={<Phone className="h-4 w-4" />}>
            <input
              type="tel"
              className={`${base} pl-9 ${
                showErrors && !personal.phoneNumber.trim() ? submissionTheme.editInputError : ""
              }`}
              value={personal.phoneNumber}
              onChange={e =>
                onChangePersonal({
                  ...personal,
                  phoneNumber: e.target.value,
                })
              }
            />
          </InputWrapper>
          {showErrors && !personal.phoneNumber.trim() && (
            <p className={submissionTheme.errorText}>This field is required.</p>
          )}
        </Field>

        <Field label="Emergency Phone Number">
          <InputWrapper icon={<Phone className="h-4 w-4" />}>
            <input
              type="tel"
              className={`${base} pl-9 ${
                showErrors && !personal.emergencyPhoneNumber.trim()
                  ? submissionTheme.editInputError
                  : ""
              }`}
              value={personal.emergencyPhoneNumber}
              onChange={e =>
                onChangePersonal({
                  ...personal,
                  emergencyPhoneNumber: e.target.value,
                })
              }
            />
          </InputWrapper>
          {showErrors && !personal.emergencyPhoneNumber.trim() && (
            <p className={submissionTheme.errorText}>This field is required.</p>
          )}
        </Field>

        <Field label="Emergency Contact Relationship">
          <InputWrapper icon={<User className="h-4 w-4" />}>
            <input
              type="text"
              className={`${base} pl-9 ${
                showErrors && !personal.emergencyRelationship.trim()
                  ? submissionTheme.editInputError
                  : ""
              }`}
              value={personal.emergencyRelationship}
              onChange={e =>
                onChangePersonal({
                  ...personal,
                  emergencyRelationship: e.target.value,
                })
              }
            />
          </InputWrapper>
          {showErrors && !personal.emergencyRelationship.trim() && (
            <p className={submissionTheme.errorText}>This field is required.</p>
          )}
        </Field>

        <Field label="T-Shirt Size">
          <InputWrapper icon={<Shirt className="h-4 w-4" />}>
            <div className="flex items-center gap-3">
              <select
                className={`${base} pl-9 flex-1 ${
                  showErrors && !personal.tshirtSize.trim() ? submissionTheme.editInputError : ""
                }`}
                value={personal.tshirtSize}
                onChange={e =>
                  onChangePersonal({
                    ...personal,
                    tshirtSize: e.target.value,
                  })
                }
              >
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>

              <button
                type="button"
                className={submissionTheme.shirtSizeButton}
                onClick={() => setShowShirtSizeModal(true)}
              >
                Shirt Size
              </button>
            </div>
          </InputWrapper>
          {showErrors && !personal.tshirtSize.trim() && (
            <p className={submissionTheme.errorText}>This field is required.</p>
          )}
        </Field>

        <Field label="Disease History">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <textarea
              rows={3}
              className={`${base} pl-9 ${
                showErrors && !personal.diseaseHistory.trim() ? submissionTheme.editInputError : ""
              }`}
              value={personal.diseaseHistory}
              onChange={e =>
                onChangePersonal({
                  ...personal,
                  diseaseHistory: e.target.value,
                })
              }
            />
          </InputWrapper>
          {showErrors && !personal.diseaseHistory.trim() && (
            <p className={submissionTheme.errorText}>This field is required.</p>
          )}
        </Field>
      </div>

      <div className={submissionTheme.buttonRow}>
        <button type="button" className={submissionTheme.secondaryButton}>
          Cancel
        </button>
        <button
          type="button"
          className={submissionTheme.primaryButton}
          onClick={onSaveAndContinue}
        >
          Save & Continue
        </button>
      </div>
 
      {showShirtSizeModal && (
        <div className={submissionTheme.modalOverlay}>
          <div className={submissionTheme.modalCard}>
            <h2 className={submissionTheme.modalTitle}>Shirt Size Guide</h2>
            <div className={submissionTheme.modalBody}>
              <Image
                src="/img/shirtSize.webp"
                alt="Shirt size guide"
                width={800}
                height={600}
                className="h-auto w-full rounded-lg object-contain"
              />
            </div>

            <div className={submissionTheme.modalButtonRow}>
              <button
                type="button"
                className={submissionTheme.modalSecondaryButton}
                onClick={() => setShowShirtSizeModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
