'use client';

import { OnboardingForm, StepKey, steps, LOGIN_IMAGES } from "./types";
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { componentsTheme } from '@/lib/theme/components';
import type { CountryMetadata } from '@/types/metadata';
import type { CityMetadata, StateMetadata } from '@/types/metadata';
import { getCities, getCountries, getGenders, getKnowledgeSources, getStates } from '@/lib/api/metadata';
import { useSettings } from '@/components/providers/SettingsProvider';
import StyledSelect from '@/components/ui/StyledSelect';
import { FormField } from '@/components/ui/FormField';
import { User, Users, Globe, Building, Gift, Map as MapIcon, CheckCircle2, AlertCircle, AlertTriangle, Loader2 } from 'lucide-react';
import EnglishTextInput from '@/components/ui/EnglishTextInput';
import { toast } from 'sonner';
import { Alert } from '@/components/ui';
import { friendlyAuthError } from '@/lib/auth/friendlyAuthError';


export default function OnboardingPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { settings } = useSettings();

  const onboardingTheme = componentsTheme.onboarding;

  const [imageIndex, setImageIndex] = useState(0);
  const [heroImages, setHeroImages] = useState<string[]>(LOGIN_IMAGES);

  const [countries, setCountries] = useState<CountryMetadata[]>([]);
  const [genders, setGenders] = useState<string[]>([]);
  const [states, setStates] = useState<StateMetadata[]>([]);
  const [originCities, setOriginCities] = useState<CityMetadata[]>([]);
  const [statesFailed, setStatesFailed] = useState(false);
  const [citiesFailed, setCitiesFailed] = useState(false);
  const [statesLoading, setStatesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [knowledgeSources, setKnowledgeSources] = useState<string[]>([]);
  const [knowledgeSourcesError, setKnowledgeSourcesError] = useState(false);
  const [cityManual, setCityManual] = useState(false);
  const [stateManual, setStateManual] = useState(false);
  const brandLogo = settings?.brand?.logo_url?.trim() || settings?.active_program?.logo_url?.trim() || '/img/ybb-logo.png';
  // if user is authenticated and has programs, we could override this, but let's just use settings first
  const [brandName, setBrandName] = useState(settings?.active_program?.name?.trim() || settings?.brand?.name?.trim() || 'Youth Break the Boundaries');
  // The program this participant registered for, used to scope referral-code
  // validation. Null while unknown or ambiguous, in which case the check runs
  // unscoped rather than rejecting a code that may well be valid.
  const [referralProgramId, setReferralProgramId] = useState<string | null>(null);

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
  const [referralStatus, setReferralStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid' | 'unknown'>('idle');

  const [form, setForm] = useState<OnboardingForm>({
    fullName: '',
    country: '',
    state: '',
    city: '',
    birthDate: '2000',
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
        if (!cancelled) {
          const options = Array.isArray(res) ? res.filter(Boolean) : [];
          setKnowledgeSources(options);
          setKnowledgeSourcesError(options.length === 0);
        }
      } catch {
        if (!cancelled) {
          setKnowledgeSources([]);
          setKnowledgeSourcesError(true);
        }
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
        let nextProgramId: string | null = null;
        try {
          const homeRes = await fetch('/api/auth/me');
          if (homeRes.ok) {
            const homeJson = await homeRes.json();
            const registered = homeJson?.data?.registeredPrograms;
            if (registered?.length > 0) {
              nextName = registered[0].programName.trim();
            }
            // Scope referral validation to the program this participant actually
            // registered for — not settings.active_program, which is the brand's
            // headline program and can differ. Only when it is unambiguous: with
            // several programs we cannot tell which one the code is meant for, so
            // we leave it unscoped rather than reject a legitimate code.
            if (registered?.length === 1) {
              nextProgramId = registered[0].programId ?? null;
            }
          }
        } catch (err) {
          console.error(err);
        }

        if (!cancelled) {
          if (nextName) setBrandName(nextName);
          if (nextProgramId) setReferralProgramId(nextProgramId);
        }
      } catch {
        // ignore
      }
    })();

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally runs once at mount; settings values at mount time are the seed values
  }, []);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const id = setInterval(() => {
      setImageIndex(prev => (prev + 1) % heroImages.length);
    }, 7000);
    return () => clearInterval(id);
  }, [heroImages]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch('/api/home');
        if (!res.ok) return;

        const json = (await res.json()) as {
          data?: {
            sections?: Array<{
              type: string;
              content?: { gallery?: Array<{ url: string }>; images?: Array<{ url: string }> };
            }>;
          };
        };

        const gallerySection = json?.data?.sections?.find(
          section => section.type === 'program_gallery',
        );
        const images = (gallerySection?.content?.gallery ?? gallerySection?.content?.images)?.map(img => img.url).filter(Boolean) ?? [];

        if (!cancelled && images.length > 0) {
          setHeroImages(images);
          setImageIndex(0);
        }
      } catch {
        // Keep fallback images when home API is unavailable.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const code = form.referralCode.trim();
    if (!code) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReferralStatus('idle');
      return;
    }
    setReferralStatus('checking');
    const timer = setTimeout(async () => {
      try {
        const query = new URLSearchParams({ code });
        if (referralProgramId) query.set('programId', referralProgramId);
        const res = await fetch(`/api/referral/validate?${query.toString()}`);
        const json = await res.json().catch(() => ({})) as { valid: boolean | null };
        if (json.valid === true) setReferralStatus('valid');
        else if (json.valid === false) setReferralStatus('invalid');
        else setReferralStatus('unknown');
      } catch {
        setReferralStatus('unknown');
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [form.referralCode, referralProgramId]);

  const loginImageSrc = heroImages[imageIndex] ?? heroImages[0] ?? LOGIN_IMAGES[0];

  const countryOptions = useMemo(() => {
    if (countries.length === 0) return [];
    return [...countries].sort((a, b) => a.name.localeCompare(b.name));
  }, [countries]);

  const genderOptions = useMemo(() => {
    if (genders.length > 0) return genders;
    return ['Male', 'Female'];
  }, [genders]);

  const programSourceOptions = useMemo(() => {
    return knowledgeSources.map(source => ({
      value: source,
      label: source,
    }));
  }, [knowledgeSources]);

  const hasKnowledgeSources = knowledgeSources.length > 0;

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
    const maxBirthYear = Math.min(new Date().getFullYear(), 2020);
    const options = [];
    for (let i = maxBirthYear; i >= 1950; i--) {
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
    if (!hasKnowledgeSources) {
      setSubmitError('Program source options are temporarily unavailable. Please refresh and try again.');
      toast.error('Please complete the highlighted fields to continue.');
      return;
    }

    if (!isInfoValid) {
      setInfoShowErrors(true);
      toast.error('Please complete the highlighted fields to continue.');
      return;
    }

    if (submitLoading) return;
    setSubmitLoading(true);
    setSubmitError('');

    try {
      const basePayload = {
        fullName: form.fullName,
        gender: form.gender,
        knowledgeSource: form.programSource,
        originCountry: selectedCountry?.isoCode || form.country,
        originCity: form.city,
        birthDate: form.birthDate,
      };

      // Skip referral on submit if it's already confirmed invalid
      const referralToSend = referralStatus === 'invalid' ? undefined : (form.referralCode || undefined);

      const doSubmit = (referralCode: string | undefined) =>
        fetch('/api/participants/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...basePayload, referralCode }),
        });

      let res = await doSubmit(referralToSend);

      if (res.status === 401) {
        toast.error('Your session has expired. Please sign in again.');
        router.push('/login');
        return;
      }

      // Auto-retry without referral if it failed and a referral code was sent
      if (!res.ok && referralToSend) {
        const retryRes = await doSubmit(undefined);
        if (retryRes.status === 401) {
          toast.error('Your session has expired. Please sign in again.');
          router.push('/login');
          return;
        }
        res = retryRes;
      }

      const json = (await res.json().catch(() => ({}))) as {
        statusCode?: number;
        message?: string;
      };

      if (!res.ok) {
        throw new Error(json?.message || `Onboarding failed: ${res.status} ${res.statusText}`);
      }

      router.push('/dashboard');
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : 'Onboarding failed';
      setSubmitError(friendlyAuthError(rawMessage).message);
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

  const isInfoValid =
    form.programSource.trim().length > 0 && knowledgeSources.includes(form.programSource);

  const currentIndex = steps.indexOf(activeStep);

  const maxReachableIndex = useMemo(() => {
    if (!isBioValid) return 0;
    if (!isLocationValid) return 1;
    if (!isAgeValid) return 2;
    return 3;
  }, [isBioValid, isLocationValid, isAgeValid]);

  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (!stepParam) return;

    const parsed = Number.parseInt(stepParam, 10);
    if (Number.isNaN(parsed)) return;

    const targetIndex = Math.min(Math.max(parsed, 1), steps.length) - 1;
    const targetStep = steps[targetIndex];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveStep(prev => (prev === targetStep ? prev : targetStep));
  }, [searchParams]);

  useEffect(() => {
    const stepParam = (currentIndex + 1).toString();
    if (searchParams.get('step') === stepParam) return;

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set('step', stepParam);
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  }, [currentIndex, pathname, router, searchParams]);

  const goToStep = (target: StepKey) => {
    const targetIndex = steps.indexOf(target);
    if (targetIndex <= maxReachableIndex) {
      setActiveStep(target);
    }
  };

  const goNext = () => {
    if (activeStep === 'Basic Info' && !isBioValid) {
      setBioShowErrors(true);
      toast.error('Please complete the highlighted fields to continue.');
      return;
    }
    if (activeStep === 'Location' && !isLocationValid) {
      setDomShowErrors(true);
      toast.error('Please complete the highlighted fields to continue.');
      return;
    }
    if (activeStep === 'Age' && !isAgeValid) {
      setAgeShowErrors(true);
      toast.error('Please complete the highlighted fields to continue.');
      return;
    }
    if (activeStep === 'Program Info' && !isInfoValid) {
      setInfoShowErrors(true);
      toast.error('Please complete the highlighted fields to continue.');
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
            <div className="w-full max-w-lg lg:my-auto flex flex-col">
              <div className={onboardingTheme.mobileImagePanel}>
                <Image
                  src={loginImageSrc}
                  alt={brandName}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
                <div className={onboardingTheme.mobileImageOverlay} />
              </div>

              <div className={`${onboardingTheme.logoWrapper} flex items-center gap-3`}>
                <Image
                  src={brandLogo}
                  alt={brandName}
                  width={250}
                  height={250}
                  className={onboardingTheme.logoImage}
                  priority
                />
                <span className="font-bold text-base leading-tight text-[var(--brand-primary)] tracking-tight sm:text-lg">
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
                        <EnglishTextInput
                          name="fullName"
                          value={form.fullName}
                          onChange={onChange}
                          type="text"
                          required
                          restrictMode="name"
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
                          onChange={value => {
                            setCityManual(false);
                            setStateManual(false);
                            setForm(prev => ({
                              ...prev,
                              country: value,
                              state: '',
                              city: '',
                            }));
                          }}
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
                        hint={selectedCountry?.isoCode && !statesLoading && !statesFailed && stateSelectOptions.length === 0 ? "No states/regions listed for this country. Please type yours." : null}
                      >
                       {(errorClass) => (
                          <>
                            {selectedCountry?.isoCode && !statesFailed && !stateManual && (statesLoading || stateSelectOptions.length > 0) ? (
                              <>
                                <StyledSelect
                                  value={form.state}
                                  onChange={value => {
                                    setCityManual(false);
                                    setForm(prev => ({ ...prev, state: value, city: '' }));
                                  }}
                                  options={stateSelectOptions}
                                  placeholder={statesLoading ? 'Loading state/region...' : 'Select state/region'}
                                  className={`${componentsTheme.login.input} ${errorClass}`}
                                  searchable
                                  disabled={!selectedCountry?.isoCode || statesLoading}
                                />
                                {!statesLoading && stateSelectOptions.length > 0 && (
                                  <button
                                    type="button"
                                    className={onboardingTheme.seeAllButton}
                                    onClick={() => {
                                      setStateManual(true);
                                      setCityManual(false);
                                      setForm(prev => ({ ...prev, state: '', city: '' }));
                                    }}
                                  >
                                    Can&apos;t find your state/region? Type it manually
                                  </button>
                                )}
                              </>
                            ) : (
                              <>
                                <EnglishTextInput
                                  name="state"
                                  value={form.state}
                                  onChange={onChange}
                                  type="text"
                                  required
                                  autoFocus={stateManual}
                                  className={`${componentsTheme.login.input} ${errorClass}`}
                                  placeholder="Type your state/region"
                                />
                                {stateManual && stateSelectOptions.length > 0 && (
                                  <button
                                    type="button"
                                    className={onboardingTheme.seeAllButton}
                                    onClick={() => {
                                      setStateManual(false);
                                      setCityManual(false);
                                      setForm(prev => ({ ...prev, state: '', city: '' }));
                                    }}
                                  >
                                    Choose from the list instead
                                  </button>
                                )}
                              </>
                            )}
                          </>
                       )}
                      </FormField>

                        <FormField
                        label="City"
                        icon={Building}
                        required={true}
                        error={domShowErrors && form.city.trim().length === 0 ? "Required" : (selectedCountry?.isoCode && citiesFailed ? "Could not load cities. You can type manually." : "")}
                        hint={selectedCountry?.isoCode && form.state && !citiesLoading && !citiesFailed && citySelectOptions.length === 0 ? "No cities listed for this state/region. Please type your city." : null}
                      >
                       {(errorClass) => (
                          <>
                            {selectedCountry?.isoCode && form.state && !citiesFailed && !cityManual && (citiesLoading || citySelectOptions.length > 0) ? (
                              <>
                                <StyledSelect
                                  value={form.city}
                                  onChange={value => setForm(prev => ({ ...prev, city: value }))}
                                  options={citySelectOptions}
                                  placeholder={citiesLoading ? 'Loading city...' : 'Select city'}
                                  className={`${componentsTheme.login.input} ${errorClass}`}
                                  searchable
                                  disabled={!form.state || citiesLoading}
                                />
                                {!citiesLoading && citySelectOptions.length > 0 && (
                                  <button
                                    type="button"
                                    className={onboardingTheme.seeAllButton}
                                    onClick={() => {
                                      setCityManual(true);
                                      setForm(prev => ({ ...prev, city: '' }));
                                    }}
                                  >
                                    Can&apos;t find your city? Type it manually
                                  </button>
                                )}
                              </>
                            ) : (
                              <>
                                <EnglishTextInput
                                  name="city"
                                  value={form.city}
                                  onChange={onChange}
                                  type="text"
                                  required
                                  autoFocus={cityManual}
                                  className={`${componentsTheme.login.input} ${errorClass}`}
                                  placeholder="Type your city"
                                />
                                {cityManual && citySelectOptions.length > 0 && (
                                  <button
                                    type="button"
                                    className={onboardingTheme.seeAllButton}
                                    onClick={() => {
                                      setCityManual(false);
                                      setForm(prev => ({ ...prev, city: '' }));
                                    }}
                                  >
                                    Choose from the list instead
                                  </button>
                                )}
                              </>
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

                      {hasKnowledgeSources ? (
                        <>
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
                            <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-destructive">
                              <AlertCircle className="h-3.5 w-3.5" />
                              Required
                            </p>
                          )}
                        </>
                      ) : (
                        <Alert variant="warning">
                          {knowledgeSourcesError
                            ? 'Program source options are unavailable right now. Please refresh and try again.'
                            : 'Program source options are loading.'}
                        </Alert>
                      )}
                    </div>

                    <div>
                      <FormField
                        label="Referral Code"
                        icon={User}
                        required={false}
                      >
                        {(errorClass) => (
                          <EnglishTextInput
                            name="referralCode"
                            value={form.referralCode}
                            onChange={onChange}
                            type="text"
                            className={`${componentsTheme.login.input} ${errorClass} ${
                              referralStatus === 'valid'
                                ? '!border-emerald-400 focus:!border-emerald-500 focus:!ring-emerald-500/20'
                                : referralStatus === 'invalid'
                                  ? '!border-amber-400 focus:!border-amber-500 focus:!ring-amber-500/20'
                                  : ''
                            }`}
                            placeholder="ABC-123"
                          />
                        )}
                      </FormField>
                      {referralStatus === 'idle' && (
                        <p className="mt-1.5 text-xs text-slate-400">
                          Optional. You can continue with or without a code.
                        </p>
                      )}
                      {form.referralCode.trim() && referralStatus === 'checking' && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Checking code…
                        </p>
                      )}
                      {referralStatus === 'valid' && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Valid referral code. It’ll be applied.
                        </p>
                      )}
                      {referralStatus === 'invalid' && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-amber-500">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          We don’t recognize this code, but that’s no problem. You can still continue without it.
                        </p>
                      )}
                    </div>
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
                      disabled={submitLoading || !hasKnowledgeSources}
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
                  <div className="mt-1">
                    <Alert variant="error">{submitError}</Alert>
                  </div>
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

              <p className="mt-8 text-center text-xs text-slate-400">
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
