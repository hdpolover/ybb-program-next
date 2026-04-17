'use client';

import { OnboardingForm, StepKey, steps, LOGIN_IMAGES, PROGRAM_SOURCES } from "./types";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { componentsTheme } from '@/lib/theme/components';
import type { CountryMetadata } from '@/types/metadata';
import type { CityMetadata, StateMetadata } from '@/types/metadata';
import { getCities, getCountries, getGenders, getKnowledgeSources, getStates } from '@/lib/api/metadata';
import { useSettings } from '@/components/providers/SettingsProvider';
import StyledSelect from '@/components/ui/StyledSelect';
import { FormField } from '@/components/ui/FormField';
import { User, Users, MapPin, Globe, Building, Gift, Map as MapIcon } from 'lucide-react';


export default function OnboardingPage() {
  const router = useRouter();
  const { settings } = useSettings();

  const submissionTheme = componentsTheme.dashboardSubmission;
  const onboardingTheme = componentsTheme.onboarding;

  const [imageIndex, setImageIndex] = useState(0);

  const [countries, setCountries] = useState<CountryMetadata[]>([]);
  const [genders, setGenders] = useState<string[]>([]);
  const [states, setStates] = useState<StateMetadata[]>([]);
  const [originCities, setOriginCities] = useState<CityMetadata[]>([]);
  const [statesFailed, setStatesFailed] = useState(false);
  const [citiesFailed, setCitiesFailed] = useState(false);
  const [statesLoading, setStatesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [knowledgeSources, setKnowledgeSources] = useState<string[]>([]);
  const brandLogo = settings?.brand?.logo_url?.trim() || '/img/ybb-logo.png';
  // if user is authenticated and has programs, we could override this, but let's just use settings first
  const [brandName, setBrandName] = useState(settings?.active_program?.name?.trim() || settings?.brand?.name?.trim() || 'Youth Break the Boundaries');

  const statesCacheRef = useRef<Map<string, StateMetadata[]>>(new Map());
  const citiesCacheRef = useRef<Map<string, CityMetadata[]>>(new Map());

  const [activeStep, setActiveStep] = useState<StepKey>('Basic Info');
  const [bioShowErrors, setBioShowErrors] = useState(false);
  const [domShowErrors, setDomShowErrors] = useState(false);
  const [ageShowErrors, setAgeShowErrors] = useState(false);
  const [infoShowErrors, setInfoShowErrors] = useState(false);
  const [programSourceModalOpen, setProgramSourceModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [form, setForm] = useState<OnboardingForm>({
    fullName: '',
    country: '',
    state: '',
    city: '',
    birthDate: '',
    programSource: '',
    gender: '',
    referralCode: '',
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [countriesRes, gendersRes] = await Promise.all([
          getCountries(),
          getGenders(),
        ]);

        if (!cancelled) {
          setCountries(Array.isArray(countriesRes) ? countriesRes : []);
          setGenders(Array.isArray(gendersRes) ? gendersRes : []);
        }
      } catch {
        // kalau metadata API error, dropdown akan fallback ke opsi minimal
      }
    })();

    (async () => {
      try {
        const res = await getKnowledgeSources();
        if (!cancelled) setKnowledgeSources(Array.isArray(res) ? res : []);
      } catch {
        // fallback to hardcoded list
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        let nextName = settings?.active_program?.name?.trim() || settings?.brand?.name?.trim();
        try {
          const homeRes = await fetch('/api/auth/me');
          if (homeRes.ok) {
            const homeJson = await homeRes.json();
            if (homeJson?.data?.registeredPrograms?.length > 0) {
              nextName = homeJson.data.registeredPrograms[0].programName.trim();
            }
          }
        } catch (err) {
          console.error(err);
        }

        if (!cancelled) {
          if (nextName) setBrandName(nextName);
        }
      } catch {
        // ignore
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (LOGIN_IMAGES.length <= 1) return;
    const id = setInterval(() => {
      setImageIndex(prev => (prev + 1) % LOGIN_IMAGES.length);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  const loginImageSrc = LOGIN_IMAGES[imageIndex] ?? LOGIN_IMAGES[0];

  const countryOptions = useMemo(() => {
    if (countries.length === 0) return [];
    return [...countries].sort((a, b) => a.name.localeCompare(b.name));
  }, [countries]);

  const genderOptions = useMemo(() => {
    if (genders.length > 0) return genders;
    return ['Male', 'Female'];
  }, [genders]);

  const programSourceOptions = useMemo(() => {
    const list = knowledgeSources.length > 0 ? knowledgeSources : PROGRAM_SOURCES;
    return list.map(source => ({
      value: source,
      label: source,
    }));
  }, [knowledgeSources]);

  const displayedProgramSourceOptions = useMemo(() => {
    return programSourceOptions.slice(0, 6);
  }, [programSourceOptions]);

  const selectedCountry = useMemo(() => {
    if (!form.country) return null;
    return (
      countries.find(country => country.name === form.country) ??
      countries.find(country => country.isoCode === form.country) ??
      null
    );
  }, [countries, form.country]);

  const countrySelectOptions = useMemo(() => {
    return countryOptions.map(country => ({
      value: country.isoCode,
      label: `${country.flag ? `${country.flag} ` : ''}${country.name}`,
    }));
  }, [countryOptions]);



  const yearSelectOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const options = [];
    for (let i = currentYear; i >= 1950; i--) {
      options.push({ value: i.toString(), label: i.toString() });
    }
    return options;
  }, []);

  const genderSelectOptions = useMemo(() => {
    return genderOptions.map(g => ({
      value: g,
      label: g.charAt(0).toUpperCase() + g.slice(1).toLowerCase(),
    }));
  }, [genderOptions]);

  const stateSelectOptions = useMemo(() => {
    return (states ?? []).map(s => ({
      value: s.isoCode,
      label: s.name,
    }));
  }, [states]);

  const citySelectOptions = useMemo(() => {
    return (originCities ?? []).map(c => ({
      value: c.name,
      label: c.name,
    }));
  }, [originCities]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (!selectedCountry?.isoCode) {
          setStates([]);
          setStatesFailed(false);
          setStatesLoading(false);
          return;
        }

        const cached = statesCacheRef.current.get(selectedCountry.isoCode);
        if (cached) {
          setStates(cached);
          setStatesFailed(false);
          setStatesLoading(false);
          return;
        }

        setStatesFailed(false);
        setStatesLoading(true);
        const res = await getStates(selectedCountry.isoCode);
        if (cancelled) return;
        const list = Array.isArray(res) ? res : [];
        statesCacheRef.current.set(selectedCountry.isoCode, list);
        setStates(list);
        setStatesLoading(false);

        const allowed = new Set((res ?? []).map(s => s.isoCode));
        if (form.state && !allowed.has(form.state)) {
          setForm(prev => ({ ...prev, state: '', city: '' }));
        }
      } catch {
        if (!cancelled) {
          setStates([]);
          setStatesFailed(true);
          setStatesLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry?.isoCode]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (!selectedCountry?.isoCode || !form.state) {
          setOriginCities([]);
          setCitiesFailed(false);
          setCitiesLoading(false);
          return;
        }

        const cacheKey = `${selectedCountry.isoCode}::${form.state}`;
        const cached = citiesCacheRef.current.get(cacheKey);
        if (cached) {
          setOriginCities(cached);
          setCitiesFailed(false);
          setCitiesLoading(false);
          return;
        }

        setCitiesFailed(false);
        setCitiesLoading(true);
        const res = await getCities(selectedCountry.isoCode, form.state);
        if (cancelled) return;
        const list = Array.isArray(res) ? res : [];
        citiesCacheRef.current.set(cacheKey, list);
        setOriginCities(list);
        setCitiesLoading(false);

        const allowed = new Set((res ?? []).map(c => c.name));
        if (form.city && !allowed.has(form.city)) {
          setForm(prev => ({ ...prev, city: '' }));
        }
      } catch {
        if (!cancelled) {
          setOriginCities([]);
          setCitiesFailed(true);
          setCitiesLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry?.isoCode, form.state]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const onContinue = async () => {
    if (!isInfoValid) {
      setInfoShowErrors(true);
      return;
    }

    if (submitLoading) return;
    setSubmitLoading(true);
    setSubmitError('');

    try {
      const payload = {
        fullName: form.fullName,
        gender: form.gender,
        referralCode: form.referralCode || undefined,
        knowledgeSource: form.programSource,
        originCountry: selectedCountry?.isoCode || form.country,
        originCity: form.city,
        birthDate: form.birthDate,
      };

      const res = await fetch('/api/participants/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = (await res.json().catch(() => ({}))) as {
        statusCode?: number;
        message?: string;
      };

      if (!res.ok) {
        throw new Error(json?.message || `Onboarding failed: ${res.status} ${res.statusText}`);
      }

      router.push('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Onboarding failed';
      setSubmitError(message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const isBioValid = useMemo(() => {
    return form.fullName.trim().length > 0 && form.gender.trim().length > 0;
  }, [form.fullName, form.gender]);

  const isLocationValid = useMemo(() => {
    return (
      form.country.trim().length > 0 &&
      form.state.trim().length > 0 &&
      form.city.trim().length > 0
    );
  }, [form.country, form.state, form.city]);

  const isAgeValid = useMemo(() => {
    return form.birthDate.trim().length > 0;
  }, [form.birthDate]);

  const isInfoValid = useMemo(() => {
    return form.programSource.trim().length > 0;
  }, [form.programSource]);

  const currentIndex = steps.indexOf(activeStep);

  const maxReachableIndex = useMemo(() => {
    if (!isBioValid) return 0;
    if (!isLocationValid) return 1;
    if (!isAgeValid) return 2;
    return 3;
  }, [isBioValid, isLocationValid, isAgeValid]);

  const goToStep = (target: StepKey) => {
    const targetIndex = steps.indexOf(target);
    if (targetIndex <= maxReachableIndex) {
      setActiveStep(target);
    }
  };

  const goNext = () => {
    if (activeStep === 'Basic Info' && !isBioValid) {
      setBioShowErrors(true);
      return;
    }
    if (activeStep === 'Location' && !isLocationValid) {
      setDomShowErrors(true);
      return;
    }
    if (activeStep === 'Age' && !isAgeValid) {
      setAgeShowErrors(true);
      return;
    }
    if (activeStep === 'Program Info' && !isInfoValid) {
      setInfoShowErrors(true);
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

  const stepMeta = useMemo(() => {
    if (activeStep === 'Basic Info') {
      return {
        line: "Let's get to know you. This will only take a minute.",
        title: 'What should we call you?',
        description: 'Enter your full name and select your gender.',
      };
    }
    if (activeStep === 'Location') {
      return {
        line: 'Let us know your current location.',
        title: 'Where are you currently located?',
        description: 'Select your country, state/region, and city.',
      };
    }
    if (activeStep === 'Age') {
      return {
        line: 'Just a quick validation.',
        title: 'What year were you born?',
        description: 'Select your birth year from the dropdown.',
      };
    }
    return {
      line: 'One last thing.',
      title: 'How did you hear about this program?',
      description: 'Choose an option below.',
    };
  }, [activeStep]);


  return (
    <section className={`min-h-screen w-full ${componentsTheme.login.pageBackground}`}>
      <div className={onboardingTheme.layoutGrid}>
        <div className={onboardingTheme.leftCol}>
          <div className={onboardingTheme.leftCenter}>
            <div className="w-full max-w-lg flex flex-col">
              <div className={`${onboardingTheme.logoWrapper} flex items-center gap-3`}>
                <Image
                  src={brandLogo}
                  alt={brandName}
                  width={250}
                  height={250}
                  className={onboardingTheme.logoImage}
                  priority
                />
                <span className="font-bold text-lg text-[var(--brand-primary)] tracking-tight">
                  {brandName}
                </span>
              </div>

              <div className={onboardingTheme.progressGrid}>
                {steps.map((step, index) => {
                  const isActive = index === currentIndex;
                  const isDone = index < currentIndex && index <= maxReachableIndex;
                  const isLocked = index > maxReachableIndex;

                  return (
                    <button
                      key={step}
                      type="button"
                      onClick={() => goToStep(step)}
                      className={`${onboardingTheme.progressButtonBase} ${
                        isLocked ? onboardingTheme.progressButtonLocked : ''
                      }`}
                      aria-disabled={isLocked}
                      disabled={isLocked}
                    >
                      <span className="sr-only">{step}</span>
                      <div
                        className={`${onboardingTheme.progressBarBase} ${
                          isDone || isActive
                            ? onboardingTheme.progressBarActive
                            : onboardingTheme.progressBarInactive
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <p className={onboardingTheme.stepLine}>
                <span className={onboardingTheme.stepLineEmphasis}>{`Step ${currentIndex + 1} of ${steps.length}`}</span>
                {' — '}
                {stepMeta.line}
              </p>

              <h2 className={onboardingTheme.questionTitle}>{stepMeta.title}</h2>
              <p className={onboardingTheme.questionDescription}>{stepMeta.description}</p>

              <form onSubmit={onSubmit} className={onboardingTheme.form}>
                {activeStep === 'Basic Info' ? (
                  <>
                    <FormField
                      label="Full name"
                      icon={User}
                      required
                      error={bioShowErrors && form.fullName.trim().length === 0}
                    >
                      {(errClass) => (
                        <input
                          name="fullName"
                          value={form.fullName}
                          onChange={onChange}
                          type="text"
                          required
                          className={`${componentsTheme.login.input} ${errClass}`}
                          placeholder="Your full name"
                        />
                      )}
                    </FormField>

                    <FormField
                      label="Gender"
                      icon={Users}
                      required
                      error={bioShowErrors && form.gender.trim().length === 0}
                    >
                      {(errClass) => (
                        <StyledSelect
                          value={form.gender}
                          onChange={value => setForm(prev => ({ ...prev, gender: value }))}
                          options={genderSelectOptions}
                          placeholder="Select gender"
                          className={`${componentsTheme.login.input} ${errClass}`}
                          searchable
                        />
                      )}
                    </FormField>
                  </>
                ) : null}

                {activeStep === 'Location' ? (
                  <>
                    <FormField
                      label="Country"
                      icon={Globe}
                      required={true}
                      error={domShowErrors && form.country.trim().length === 0 ? "Required" : ""}
                    >
                      {(errorClass) => (
                        <StyledSelect
                          value={form.country}
                          onChange={value =>
                            setForm(prev => ({
                              ...prev,
                              country: value,
                              state: '',
                              city: '',
                            }))
                          }
                          options={countrySelectOptions}
                          placeholder="Select country"
                          className={`${componentsTheme.login.input} ${errorClass}`}
                          searchable
                        />
                      )}
                    </FormField>

                    <div className={onboardingTheme.locationGrid}>
                      <FormField
                        label="State/Region"
                        icon={MapIcon}
                        required={true}
                        error={domShowErrors && form.state.trim().length === 0 ? "Required" : (selectedCountry?.isoCode && statesFailed ? "Could not load states. You can type manually." : "")}
                      >
                       {(errorClass) => (
                          <>
                            {selectedCountry?.isoCode && !statesFailed ? (
                              <StyledSelect
                                value={form.state}
                                onChange={value =>
                                  setForm(prev => ({ ...prev, state: value, city: '' }))
                                }
                                options={stateSelectOptions}
                                placeholder={statesLoading ? 'Loading state/region...' : 'Select state/region'}
                                className={`${componentsTheme.login.input} ${errorClass}`}
                                searchable
                                disabled={!selectedCountry?.isoCode || statesLoading}
                              />
                            ) : (
                              <input
                                name="state"
                                value={form.state}
                                onChange={onChange}
                                type="text"
                                required
                                className={`${componentsTheme.login.input} ${errorClass}`}
                                placeholder="State/Region"
                              />
                            )}
                          </>
                       )}
                      </FormField>

                        <FormField
                        label="City"
                        icon={Building}
                        required={true}
                        error={domShowErrors && form.city.trim().length === 0 ? "Required" : (selectedCountry?.isoCode && citiesFailed ? "Could not load cities. You can type manually." : "")}
                      >
                       {(errorClass) => (
                          <>
                            {selectedCountry?.isoCode && form.state && !citiesFailed ? (
                              <StyledSelect
                                value={form.city}
                                onChange={value => setForm(prev => ({ ...prev, city: value }))}
                                options={citySelectOptions}
                                placeholder={citiesLoading ? 'Loading city...' : 'Select city'}
                                className={`${componentsTheme.login.input} ${errorClass}`}
                                searchable
                                disabled={!form.state || citiesLoading}
                              />
                            ) : (
                              <input
                                name="city"
                                value={form.city}
                                onChange={onChange}
                                type="text"
                                required
                                className={`${componentsTheme.login.input} ${errorClass}`}
                                placeholder="City"
                              />
                            )}
                          </>
                       )}
                      </FormField>
                    </div>
                  </>
                ) : null}

                {activeStep === "Age" ? (
                  <>
                    <FormField
                        label="Year of birth"
                        icon={Gift}
                        required={true}
                        error={ageShowErrors && form.birthDate.trim().length === 0 ? "Required" : ""}
                      >
                       {(errorClass) => (
                         <StyledSelect
                           value={form.birthDate}
                           onChange={value => setForm(prev => ({ ...prev, birthDate: value }))}
                           options={yearSelectOptions}
                           placeholder="Select year"
                           className={`${componentsTheme.login.input} ${errorClass}`}
                           searchable
                         />
                       )}
                    </FormField>
                  </>
                ) : null}

                {activeStep === "Program Info" ? (
                  <>
                    <div className="flex flex-col gap-2">
                      <p className={componentsTheme.login.fieldLabel}>
                        PROGRAM SOURCE <span style={{ color: "#ef4444", marginLeft: "4px" }}>*</span>
                      </p>
                      
                      <div className={onboardingTheme.programSourceGrid}>
                        {displayedProgramSourceOptions.map(opt => {
                          const selected = form.programSource === opt.value;
                          const errClass = infoShowErrors && form.programSource.trim().length === 0 ? "!border-red-500 focus:!ring-red-500/20" : "";
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setForm(prev => ({ ...prev, programSource: opt.value }))}
                              className={`${onboardingTheme.optionButtonBase} ${errClass} ${
                                selected
                                  ? onboardingTheme.optionButtonSelected
                                  : onboardingTheme.optionButtonUnselected
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>

                      {programSourceOptions.length > 6 ? (
                        <div className="flex justify-start">
                          <button
                            type="button"
                            className={onboardingTheme.seeAllButton}
                            onClick={() => setProgramSourceModalOpen(true)}
                          >
                            See all
                          </button>
                        </div>
                      ) : null}

                      {infoShowErrors && form.programSource.trim().length === 0 && (
                        <p style={{ marginTop: "6px", fontSize: "12px", color: "#ef4444", display: "flex", alignItems: "center", fontWeight: 500 }}>
                          Required
                        </p>
                      )}
                    </div>

                    <FormField
                      label="Referral Code"
                      icon={User}
                      required={false}
                    >
                      {(errorClass) => (
                      <input
                        name="referralCode"
                        value={form.referralCode}
                        onChange={onChange}
                        type="text"
                        className={`${componentsTheme.login.input} ${errorClass}`}
                        placeholder="ABC-123"
                      />
                      )}
                    </FormField>
                  </>
                ) : null}

                <div className={onboardingTheme.buttonGroup}>
                  {activeStep !== 'Basic Info' ? (
                    <button type="button" className={componentsTheme.login.secondaryButton} onClick={goBack}>
                      Back
                    </button>
                  ) : null}

                  {activeStep === 'Program Info' ? (
                    <button
                      type="button"
                      className={componentsTheme.login.primaryButton}
                      onClick={onContinue}
                      disabled={submitLoading}
                    >
                      {submitLoading ? 'Saving...' : 'Continue'}
                    </button>
                  ) : (
                    <button type="button" className={componentsTheme.login.primaryButton} onClick={goNext}>
                      Next
                    </button>
                  )}
                </div>

                {submitError ? (
                  <p className={onboardingTheme.fieldError}>{submitError}</p>
                ) : null}
              </form>

              <div className="mt-6 rounded-xl bg-blue-50/60 border border-blue-100/60 p-3.5">
                <div className="flex items-start gap-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400 shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  <p className="text-xs leading-relaxed text-slate-500">
                    You can always update these details later from your profile settings.
                  </p>
                </div>
              </div>

              <p className="mt-4 text-center text-xs text-slate-400">
                Copyright &copy; {new Date().getFullYear()} {brandName}
              </p>
            </div>
          </div>
        </div>

        {programSourceModalOpen ? (
          <div
            className={onboardingTheme.modalOverlay}
            role="dialog"
            aria-modal="true"
            onClick={() => setProgramSourceModalOpen(false)}
          >
            <div
              className={onboardingTheme.modalCard}
              onClick={e => e.stopPropagation()}
            >
              <div className={onboardingTheme.modalHeader}>
                <h3 className={onboardingTheme.modalTitle}>Choose an option</h3>
                <button
                  type="button"
                  className={onboardingTheme.modalCloseButton}
                  onClick={() => setProgramSourceModalOpen(false)}
                >
                  Close
                </button>
              </div>
              <div className={onboardingTheme.modalBody}>
                <div className={onboardingTheme.optionGrid}>
                  {programSourceOptions.map(opt => {
                    const selected = form.programSource === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setForm(prev => ({ ...prev, programSource: opt.value }));
                          setProgramSourceModalOpen(false);
                        }}
                        className={`${onboardingTheme.optionButtonBase} ${
                          selected
                            ? onboardingTheme.optionButtonSelected
                            : onboardingTheme.optionButtonUnselected
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className={`${onboardingTheme.imagePanel} ${componentsTheme.login.imagePanelBackground}`}>
          <Image
            src={loginImageSrc}
            alt={brandName}
            fill
            priority
            sizes="45vw"
            className="object-cover"
          />
          <div className={componentsTheme.login.heroOverlay} />
        </div>
      </div>
    </section>
  );
}
