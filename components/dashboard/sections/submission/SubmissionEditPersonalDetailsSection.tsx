"use client";

import React from "react";
import Image from "next/image";
import { Flag, Info, MapPin, Phone, Shirt, User, User2, UserRound } from "lucide-react";
import { jysSectionTheme } from "@/lib/theme/jys-components";
import type { PersonalDetails } from "../SubmissionEditSection";
import { getCities, getCountries, getGenders, getShirtSizes, getStates } from "@/lib/api/metadata";
import type { CityMetadata, CountryMetadata, ShirtSizeMetadata, StateMetadata } from "@/types/metadata";
import StyledSelect from "@/components/ui/StyledSelect";

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
  const [genderOptions, setGenderOptions] = React.useState<string[] | null>(null);
  const [countryOptions, setCountryOptions] = React.useState<CountryMetadata[] | null>(null);
  const [stateOptions, setStateOptions] = React.useState<StateMetadata[] | null>(null);
  const [statesFailed, setStatesFailed] = React.useState(false);
  const [originCityOptions, setOriginCityOptions] = React.useState<CityMetadata[] | null>(null);
  const [currentCityOptions, setCurrentCityOptions] = React.useState<CityMetadata[] | null>(null);
  const [originCitiesFailed, setOriginCitiesFailed] = React.useState(false);
  const [currentCitiesFailed, setCurrentCitiesFailed] = React.useState(false);
  const [shirtSizeOptions, setShirtSizeOptions] = React.useState<ShirtSizeMetadata[] | null>(null);
  const genderSelectOptions = React.useMemo(() => {
    const values = genderOptions ?? ["male", "female", "other"];
    return values.map(value => ({
      value,
      label: value === "male" ? "Male" : value === "female" ? "Female" : "Other",
    }));
  }, [genderOptions]);

  const countrySelectOptions = React.useMemo(() => {
    return (countryOptions ?? []).map(country => ({
      value: country.name,
      label: `${country.flag ? `${country.flag} ` : ""}${country.name}`,
    }));
  }, [countryOptions]);

  const selectedCountry = React.useMemo(() => {
    if (!countryOptions || !personal.nationality) return null;
    return (
      countryOptions.find(country => country.name === personal.nationality) ??
      countryOptions.find(country => country.isoCode === personal.nationality) ??
      null
    );
  }, [countryOptions, personal.nationality]);

  const stateSelectOptions = React.useMemo(() => {
    return (stateOptions ?? []).map(state => ({
      value: state.isoCode,
      label: state.name,
    }));
  }, [stateOptions]);

  const originCitySelectOptions = React.useMemo(() => {
    return (originCityOptions ?? []).map(city => ({
      value: city.name,
      label: city.name,
    }));
  }, [originCityOptions]);

  const currentCitySelectOptions = React.useMemo(() => {
    return (currentCityOptions ?? []).map(city => ({
      value: city.name,
      label: city.name,
    }));
  }, [currentCityOptions]);

  const tshirtOptions = React.useMemo(() => {
    if (shirtSizeOptions && shirtSizeOptions.length > 0) {
      return shirtSizeOptions.map(size => ({
        value: size.code,
        label: `${size.code} — ${size.name}`,
      }));
    }

    return ["S", "M", "L", "XL", "XXL"].map(size => ({
      value: size,
      label: size,
    }));
  }, [shirtSizeOptions]);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const genders = await getGenders();
        if (!cancelled) setGenderOptions(genders);
      } catch {
        // fallback to hardcoded options
      }
    })();

    (async () => {
      try {
        const countries = await getCountries();
        if (!cancelled) setCountryOptions(countries);
      } catch {
        // fallback to text input
      }
    })();

    (async () => {
      try {
        const sizes = await getShirtSizes();
        if (!cancelled) setShirtSizeOptions(sizes);
      } catch {
        // fallback to hardcoded options
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
          setStateOptions(null);
          setStatesFailed(false);
          return;
        }

        setStatesFailed(false);
        const states = await getStates(selectedCountry.isoCode);
        if (cancelled) return;

        setStateOptions(states);

        setOriginCityOptions(null);
        setCurrentCityOptions(null);
        setOriginCitiesFailed(false);
        setCurrentCitiesFailed(false);

        // If previously chosen state isn't part of the current country, reset it.
        const stateCodes = new Set(states.map(s => s.isoCode));
        if (personal.originState && !stateCodes.has(personal.originState)) {
          onChangePersonal({
            ...personal,
            originState: "",
            originCity: "",
          });
        }
        if (personal.currentState && !stateCodes.has(personal.currentState)) {
          onChangePersonal({
            ...personal,
            currentState: "",
            currentCity: "",
          });
        }
      } catch {
        if (!cancelled) {
          setStateOptions(null);
          setStatesFailed(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // Intentionally depends on selectedCountry.isoCode.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry?.isoCode]);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (!selectedCountry?.isoCode || !personal.originState) {
          setOriginCityOptions(null);
          setOriginCitiesFailed(false);
          return;
        }

        setOriginCitiesFailed(false);
        const cities = await getCities(selectedCountry.isoCode, personal.originState);
        if (cancelled) return;
        setOriginCityOptions(cities);

        const cityNames = new Set(cities.map(c => c.name));
        if (personal.originCity && !cityNames.has(personal.originCity)) {
          onChangePersonal({
            ...personal,
            originCity: "",
          });
        }
      } catch {
        if (!cancelled) {
          setOriginCityOptions(null);
          setOriginCitiesFailed(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry?.isoCode, personal.originState]);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (!selectedCountry?.isoCode || !personal.currentState) {
          setCurrentCityOptions(null);
          setCurrentCitiesFailed(false);
          return;
        }

        setCurrentCitiesFailed(false);
        const cities = await getCities(selectedCountry.isoCode, personal.currentState);
        if (cancelled) return;
        setCurrentCityOptions(cities);

        const cityNames = new Set(cities.map(c => c.name));
        if (personal.currentCity && !cityNames.has(personal.currentCity)) {
          onChangePersonal({
            ...personal,
            currentCity: "",
          });
        }
      } catch {
        if (!cancelled) {
          setCurrentCityOptions(null);
          setCurrentCitiesFailed(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry?.isoCode, personal.currentState]);

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
            <StyledSelect
              value={personal.gender}
              onChange={value =>
                onChangePersonal({
                  ...personal,
                  gender: value,
                })
              }
              options={genderSelectOptions}
              placeholder="Select gender"
              className={`${base} pl-9 ${
                showErrors && !personal.gender.trim() ? submissionTheme.editInputError : ""
              }`}
            />
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
            {countryOptions && countryOptions.length > 0 ? (
              <StyledSelect
                value={personal.nationality}
                onChange={value =>
                  onChangePersonal({
                    ...personal,
                    nationality: value,
                  })
                }
                options={countrySelectOptions}
                placeholder="Search country"
                className={`${base} pl-9 ${
                  showErrors && !personal.nationality.trim() ? submissionTheme.editInputError : ""
                }`}
                searchable
              />
            ) : (
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
            )}
          </InputWrapper>
          {showErrors && !personal.nationality.trim() && (
            <p className={submissionTheme.errorText}>This field is required.</p>
          )}
        </Field>

        <Field label="Origin Address">
          <div className="grid gap-3 md:grid-cols-2">
            <InputWrapper icon={<MapPin className="h-4 w-4" />}>
              {selectedCountry?.isoCode && stateOptions && stateOptions.length > 0 ? (
                <StyledSelect
                  value={personal.originState}
                  onChange={value =>
                    onChangePersonal({
                      ...personal,
                      originState: value,
                      originCity: "",
                    })
                  }
                  options={stateSelectOptions}
                  placeholder="State/region"
                  className={`${base} pl-9 ${
                    showErrors && !personal.originState.trim() ? submissionTheme.editInputError : ""
                  }`}
                  searchable
                />
              ) : (
                <input
                  type="text"
                  className={`${base} pl-9 ${
                    showErrors && !personal.originState.trim() ? submissionTheme.editInputError : ""
                  }`}
                  value={personal.originState}
                  onChange={e =>
                    onChangePersonal({
                      ...personal,
                      originState: e.target.value,
                    })
                  }
                />
              )}
            </InputWrapper>

            <InputWrapper icon={<MapPin className="h-4 w-4" />}>
              {selectedCountry?.isoCode && personal.originState && originCityOptions && originCityOptions.length > 0 ? (
                <StyledSelect
                  value={personal.originCity}
                  onChange={value =>
                    onChangePersonal({
                      ...personal,
                      originCity: value,
                    })
                  }
                  options={originCitySelectOptions}
                  placeholder="City"
                  className={`${base} pl-9 ${
                    showErrors && !personal.originCity.trim() ? submissionTheme.editInputError : ""
                  }`}
                  searchable
                  disabled={!personal.originState}
                />
              ) : (
                <input
                  type="text"
                  className={`${base} pl-9 ${
                    showErrors && !personal.originCity.trim() ? submissionTheme.editInputError : ""
                  }`}
                  value={personal.originCity}
                  onChange={e =>
                    onChangePersonal({
                      ...personal,
                      originCity: e.target.value,
                    })
                  }
                />
              )}
            </InputWrapper>
          </div>
          {showErrors && (!personal.originState.trim() || !personal.originCity.trim()) && (
            <p className={submissionTheme.errorText}>This field is required.</p>
          )}
          {selectedCountry?.isoCode && statesFailed && (
            <p className={submissionTheme.errorText}>Could not load states/regions. You can type manually.</p>
          )}
          {selectedCountry?.isoCode && originCitiesFailed && (
            <p className={submissionTheme.errorText}>Could not load cities. You can type manually.</p>
          )}
        </Field>

        <Field label="Current Address">
          <div className="grid gap-3 md:grid-cols-2">
            <InputWrapper icon={<MapPin className="h-4 w-4" />}>
              {selectedCountry?.isoCode && stateOptions && stateOptions.length > 0 ? (
                <StyledSelect
                  value={personal.currentState}
                  onChange={value =>
                    onChangePersonal({
                      ...personal,
                      currentState: value,
                      currentCity: "",
                    })
                  }
                  options={stateSelectOptions}
                  placeholder="State/region"
                  className={`${base} pl-9 ${
                    showErrors && !personal.currentState.trim() ? submissionTheme.editInputError : ""
                  }`}
                  searchable
                />
              ) : (
                <input
                  type="text"
                  className={`${base} pl-9 ${
                    showErrors && !personal.currentState.trim() ? submissionTheme.editInputError : ""
                  }`}
                  value={personal.currentState}
                  onChange={e =>
                    onChangePersonal({
                      ...personal,
                      currentState: e.target.value,
                    })
                  }
                />
              )}
            </InputWrapper>

            <InputWrapper icon={<MapPin className="h-4 w-4" />}>
              {selectedCountry?.isoCode && personal.currentState && currentCityOptions && currentCityOptions.length > 0 ? (
                <StyledSelect
                  value={personal.currentCity}
                  onChange={value =>
                    onChangePersonal({
                      ...personal,
                      currentCity: value,
                    })
                  }
                  options={currentCitySelectOptions}
                  placeholder="City"
                  className={`${base} pl-9 ${
                    showErrors && !personal.currentCity.trim() ? submissionTheme.editInputError : ""
                  }`}
                  searchable
                  disabled={!personal.currentState}
                />
              ) : (
                <input
                  type="text"
                  className={`${base} pl-9 ${
                    showErrors && !personal.currentCity.trim() ? submissionTheme.editInputError : ""
                  }`}
                  value={personal.currentCity}
                  onChange={e =>
                    onChangePersonal({
                      ...personal,
                      currentCity: e.target.value,
                    })
                  }
                />
              )}
            </InputWrapper>
          </div>
          {showErrors && (!personal.currentState.trim() || !personal.currentCity.trim()) && (
            <p className={submissionTheme.errorText}>This field is required.</p>
          )}
          {selectedCountry?.isoCode && statesFailed && (
            <p className={submissionTheme.errorText}>Could not load states/regions. You can type manually.</p>
          )}
          {selectedCountry?.isoCode && currentCitiesFailed && (
            <p className={submissionTheme.errorText}>Could not load cities. You can type manually.</p>
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
            <div className={submissionTheme.shirtSizeRow}>
              <div className="flex-1">
                <StyledSelect
                  value={personal.tshirtSize}
                  onChange={value =>
                    onChangePersonal({
                      ...personal,
                      tshirtSize: value,
                    })
                  }
                  options={tshirtOptions}
                  placeholder="Select size"
                  className={`${base} pl-9 ${
                    showErrors && !personal.tshirtSize.trim() ? submissionTheme.editInputError : ""
                  }`}
                />
              </div>

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
                className={submissionTheme.modalImage}
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
