'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { jysSectionTheme } from '@/lib/theme/jys-components';
import type { CountryMetadata } from '@/types/metadata';
import type { CityMetadata, StateMetadata } from '@/types/metadata';
import { getCities, getCountries, getGenders, getKnowledgeSources, getStates } from '@/lib/api/metadata';
import { getSettings } from '@/lib/api/settings';
import StyledSelect from '@/components/ui/StyledSelect';

type OnboardingForm = {
  fullName: string;
  country: string;
  state: string;
  city: string;
  birthDate: string;
  programSource: string;
  gender: string;
  referralCode: string;
};

const LOGIN_IMAGES = ['/img/OnboardingJYS.png'];

const steps = ['Basic Info', 'Location', 'Age', 'Program Info'] as const;

type StepKey = (typeof steps)[number];

const PROGRAM_SOURCES = [
  'Program Source not Added',
];

export default function OnboardingPage() {
  const router = useRouter();

  const submissionTheme = jysSectionTheme.dashboardSubmission;
  const onboardingTheme = jysSectionTheme.onboarding;

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
  const [brandName, setBrandName] = useState('Japan Youth Summit');

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

  const [birthPickerOpen, setBirthPickerOpen] = useState(false);
  const [birthPickerMonth, setBirthPickerMonth] = useState(() => new Date().getMonth());
  const [birthPickerYear, setBirthPickerYear] = useState(() => new Date().getFullYear() - 18);
  const [birthPickerMode, setBirthPickerMode] = useState<'day' | 'month' | 'year'>('day');
  const [birthPickerYearPageStart, setBirthPickerYearPageStart] = useState(() => (new Date().getFullYear() - 18) - 12);

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
        const data = await getSettings();
        const nextName = data?.brand?.name?.trim();
        if (!cancelled && nextName) setBrandName(nextName);
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
        line: "Let’s get to know you. This will only take a minute.",
        title: 'What should we call you?',
        description: 'Enter your full name and select your gender.',
      };
    }
    if (activeStep === 'Location') {
      return {
        line: 'Tell us where you live.',
        title: 'Where are you from?',
        description: 'Select your country, state/region, and city.',
      };
    }
    if (activeStep === 'Age') {
      return {
        line: 'Just a quick one.',
        title: 'How old are you?',
        description: 'Select your age range.',
      };
    }
    return {
      line: 'One last thing.',
      title: 'How did you hear about this program?',
      description: 'Choose one option below.',
    };
  }, [activeStep]);

  const birthPickerMeta = useMemo(() => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const firstDayOfMonth = new Date(birthPickerYear, birthPickerMonth, 1);
    const startWeekday = firstDayOfMonth.getDay();
    const daysInMonth = new Date(birthPickerYear, birthPickerMonth + 1, 0).getDate();

    const monthLabel = `${monthNames[birthPickerMonth]} ${birthPickerYear}`;
    const monthName = monthNames[birthPickerMonth];
    const yearLabel = String(birthPickerYear);

    const cells: Array<{ day: number | null; iso: string | null }> = [];
    for (let i = 0; i < startWeekday; i += 1) {
      cells.push({ day: null, iso: null });
    }
    for (let d = 1; d <= daysInMonth; d += 1) {
      const iso = `${birthPickerYear}-${String(birthPickerMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, iso });
    }
    while (cells.length % 7 !== 0) {
      cells.push({ day: null, iso: null });
    }

    return { monthLabel, monthName, yearLabel, cells, monthNames };
  }, [birthPickerMonth, birthPickerYear]);

  const birthDateDisplay = useMemo(() => {
    if (!form.birthDate) return '';
    const [y, m, d] = form.birthDate.split('-');
    if (!y || !m || !d) return form.birthDate;
    return `${d}/${m}/${y}`;
  }, [form.birthDate]);

  const goBirthPickerPrev = () => {
    setBirthPickerMonth(prev => {
      if (prev === 0) {
        setBirthPickerYear(y => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const goBirthPickerNext = () => {
    setBirthPickerMonth(prev => {
      if (prev === 11) {
        setBirthPickerYear(y => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const birthPickerYearOptions = useMemo(() => {
    const start = birthPickerYearPageStart;
    return Array.from({ length: 24 }, (_, i) => start + i);
  }, [birthPickerYearPageStart]);

  const goBirthPickerYearPrevPage = () => {
    setBirthPickerYearPageStart(y => y - 24);
  };

  const goBirthPickerYearNextPage = () => {
    setBirthPickerYearPageStart(y => y + 24);
  };

  return (
    <section className={`min-h-screen w-full ${jysSectionTheme.login.pageBackground}`}>
      <div className={onboardingTheme.layoutGrid}>
        <div className={onboardingTheme.leftCol}>
          <p className={onboardingTheme.copyrightText}>
            Copyright © {new Date().getFullYear()} {brandName}
          </p>
          <div className={onboardingTheme.leftCenter}>
            <div className={jysSectionTheme.login.formPanelInner}>
              <div className={onboardingTheme.logoWrapper}>
                <Image
                  src="/img/jysfix.png"
                  alt="Japan Youth Summit"
                  width={250}
                  height={250}
                  className={onboardingTheme.logoImage}
                  priority
                />
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
                    <div>
                      <label className={jysSectionTheme.login.fieldLabel}>Full name</label>
                      <input
                        name="fullName"
                        value={form.fullName}
                        onChange={onChange}
                        type="text"
                        required
                        className={jysSectionTheme.login.input}
                        placeholder="Your full name"
                      />
                      {bioShowErrors && form.fullName.trim().length === 0 ? (
                        <p className={onboardingTheme.fieldError}>Required</p>
                      ) : null}
                    </div>

                    <div>
                      <label className={jysSectionTheme.login.fieldLabel}>Gender</label>
                      <StyledSelect
                        value={form.gender}
                        onChange={value => setForm(prev => ({ ...prev, gender: value }))}
                        options={genderSelectOptions}
                        placeholder="Select gender"
                        className={jysSectionTheme.login.input}
                        searchable
                      />
                      {bioShowErrors && form.gender.trim().length === 0 ? (
                        <p className={onboardingTheme.fieldError}>Required</p>
                      ) : null}
                    </div>
                  </>
                ) : null}

                {activeStep === 'Location' ? (
                  <>
                    <div>
                      <label className={jysSectionTheme.login.fieldLabel}>Country of origin</label>
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
                        className={jysSectionTheme.login.input}
                        searchable
                      />
                      {domShowErrors && form.country.trim().length === 0 ? (
                        <p className={onboardingTheme.fieldError}>Required</p>
                      ) : null}
                    </div>

                    <div className={onboardingTheme.locationGrid}>
                      <div>
                        <label className={jysSectionTheme.login.fieldLabel}>State/Region</label>
                        {selectedCountry?.isoCode && !statesFailed ? (
                          <StyledSelect
                            value={form.state}
                            onChange={value =>
                              setForm(prev => ({ ...prev, state: value, city: '' }))
                            }
                            options={stateSelectOptions}
                            placeholder={statesLoading ? 'Loading state/region...' : 'Select state/region'}
                            className={jysSectionTheme.login.input}
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
                            className={jysSectionTheme.login.input}
                            placeholder="State/Region"
                          />
                        )}
                        {domShowErrors && form.state.trim().length === 0 ? (
                          <p className={onboardingTheme.fieldError}>Required</p>
                        ) : null}
                        {selectedCountry?.isoCode && statesFailed ? (
                          <p className={onboardingTheme.fieldError}>
                            Could not load states. You can type manually.
                          </p>
                        ) : null}
                      </div>

                      <div>
                        <label className={jysSectionTheme.login.fieldLabel}>City</label>
                        {selectedCountry?.isoCode && form.state && !citiesFailed ? (
                          <StyledSelect
                            value={form.city}
                            onChange={value => setForm(prev => ({ ...prev, city: value }))}
                            options={citySelectOptions}
                            placeholder={citiesLoading ? 'Loading city...' : 'Select city'}
                            className={jysSectionTheme.login.input}
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
                            className={jysSectionTheme.login.input}
                            placeholder="City"
                          />
                        )}
                        {domShowErrors && form.city.trim().length === 0 ? (
                          <p className={onboardingTheme.fieldError}>Required</p>
                        ) : null}
                        {selectedCountry?.isoCode && citiesFailed ? (
                          <p className={onboardingTheme.fieldError}>
                            Could not load cities. You can type manually.
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </>
                ) : null}

                {activeStep === 'Age' ? (
                  <>
                    <div>
                      <label className={jysSectionTheme.login.fieldLabel}>Birth date</label>

                      <div className="relative">
                        <button
                          type="button"
                          className={`${jysSectionTheme.login.input} flex items-center justify-between`}
                          onClick={() => setBirthPickerOpen(v => !v)}
                        >
                          <span className={birthDateDisplay ? 'text-slate-900' : 'text-slate-400'}>
                            {birthDateDisplay || 'Select date'}
                          </span>
                          <span className="text-slate-400">▾</span>
                        </button>

                        {birthPickerOpen ? (
                          <div className="absolute bottom-full left-0 z-20 mb-2 w-full rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
                            <div className="flex items-center justify-between">
                              <button
                                type="button"
                                className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                onClick={birthPickerMode === 'day' ? goBirthPickerPrev : birthPickerMode === 'year' ? goBirthPickerYearPrevPage : () => setBirthPickerYear(y => y - 1)}
                              >
                                Prev
                              </button>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                                  onClick={() => setBirthPickerMode(m => (m === 'month' ? 'day' : 'month'))}
                                >
                                  {birthPickerMeta.monthName}
                                </button>
                                <button
                                  type="button"
                                  className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                                  onClick={() => {
                                    setBirthPickerMode(m => (m === 'year' ? 'day' : 'year'));
                                    setBirthPickerYearPageStart(birthPickerYear - 12);
                                  }}
                                >
                                  {birthPickerMeta.yearLabel}
                                </button>
                              </div>

                              <button
                                type="button"
                                className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                onClick={birthPickerMode === 'day' ? goBirthPickerNext : birthPickerMode === 'year' ? goBirthPickerYearNextPage : () => setBirthPickerYear(y => y + 1)}
                              >
                                Next
                              </button>
                            </div>

                            {birthPickerMode === 'day' ? (
                              <>
                                <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-500">
                                  <div>Su</div>
                                  <div>Mo</div>
                                  <div>Tu</div>
                                  <div>We</div>
                                  <div>Th</div>
                                  <div>Fr</div>
                                  <div>Sa</div>
                                </div>

                                <div className="mt-2 grid grid-cols-7 gap-1">
                                  {birthPickerMeta.cells.map((cell, idx) => {
                                    const selected = cell.iso && cell.iso === form.birthDate;
                                    const isEmpty = !cell.day || !cell.iso;
                                    return (
                                      <button
                                        key={idx}
                                        type="button"
                                        disabled={isEmpty}
                                        onClick={() => {
                                          const iso = cell.iso;
                                          if (!iso) return;
                                          setForm(prev => ({ ...prev, birthDate: iso }));
                                          setBirthPickerOpen(false);
                                        }}
                                        className={
                                          isEmpty
                                            ? 'h-9 rounded-lg'
                                            : `h-9 rounded-lg text-sm font-semibold ${
                                                selected
                                                  ? 'bg-slate-900 text-white'
                                                  : 'text-slate-700 hover:bg-slate-50'
                                              }`
                                        }
                                      >
                                        {cell.day ?? ''}
                                      </button>
                                    );
                                  })}
                                </div>
                              </>
                            ) : birthPickerMode === 'month' ? (
                              <div className="mt-3 grid grid-cols-3 gap-2">
                                {birthPickerMeta.monthNames.map((name, idx) => {
                                  const selected = idx === birthPickerMonth;
                                  return (
                                    <button
                                      key={name}
                                      type="button"
                                      onClick={() => {
                                        setBirthPickerMonth(idx);
                                        setBirthPickerMode('day');
                                      }}
                                      className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                                        selected ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'
                                      }`}
                                    >
                                      {name}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="mt-3">
                                <div className="grid grid-cols-4 gap-2">
                                  {birthPickerYearOptions.map(y => {
                                    const selected = y === birthPickerYear;
                                    return (
                                      <button
                                        key={y}
                                        type="button"
                                        onClick={() => {
                                          setBirthPickerYear(y);
                                          setBirthPickerMode('day');
                                        }}
                                        className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                                          selected ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'
                                        }`}
                                      >
                                        {y}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            <div className="mt-3 flex justify-end">
                              <button
                                type="button"
                                className="rounded-lg px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                onClick={() => {
                                  setBirthPickerOpen(false);
                                  setBirthPickerMode('day');
                                }}
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </div>

                      {ageShowErrors && form.birthDate.trim().length === 0 ? (
                        <p className={onboardingTheme.fieldError}>Required</p>
                      ) : null}
                    </div>
                  </>
                ) : null}

                {activeStep === 'Program Info' ? (
                  <>
                    <div>
                      <label className={jysSectionTheme.login.fieldLabel}>How did you hear about this program?</label>
                      <div className={onboardingTheme.programSourceGrid}>
                        {displayedProgramSourceOptions.map(opt => {
                          const selected = form.programSource === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setForm(prev => ({ ...prev, programSource: opt.value }))}
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

                      {programSourceOptions.length > 6 ? (
                        <button
                          type="button"
                          className={onboardingTheme.seeAllButton}
                          onClick={() => setProgramSourceModalOpen(true)}
                        >
                          See all
                        </button>
                      ) : null}

                      {infoShowErrors && form.programSource.trim().length === 0 ? (
                        <p className={onboardingTheme.fieldError}>Required</p>
                      ) : null}
                    </div>

                    <div>
                      <label className={jysSectionTheme.login.fieldLabel}>Referral Code (optional)</label>
                      <input
                        name="referralCode"
                        value={form.referralCode}
                        onChange={onChange}
                        type="text"
                        className={jysSectionTheme.login.input}
                        placeholder="ABC-123"
                      />
                    </div>
                  </>
                ) : null}

                <div className={onboardingTheme.buttonGroup}>
                  {activeStep === 'Program Info' ? (
                    <button
                      type="button"
                      className={jysSectionTheme.login.primaryButton}
                      onClick={onContinue}
                      disabled={submitLoading}
                    >
                      {submitLoading ? 'Saving...' : 'Continue'}
                    </button>
                  ) : (
                    <button type="button" className={jysSectionTheme.login.primaryButton} onClick={goNext}>
                      Next
                    </button>
                  )}

                  {activeStep !== 'Basic Info' ? (
                    <button type="button" className={jysSectionTheme.login.secondaryButton} onClick={goBack}>
                      Back
                    </button>
                  ) : null}
                </div>

                {submitError ? (
                  <p className={onboardingTheme.fieldError}>{submitError}</p>
                ) : null}
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-sm text-slate-500 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  Don&apos;t worry, you can always update these details later from your profile settings.
                </p>
              </div>
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

        <div className={`${onboardingTheme.imagePanel} ${jysSectionTheme.login.imagePanelBackground}`}>
          <div className="relative h-full">
            <Image
              src={loginImageSrc}
              alt="Japan Youth Summit"
              width={3024}
              height={1828}
              priority
              className="h-full w-auto object-contain"
            />
            <div className={jysSectionTheme.login.heroOverlay} />
          </div>
        </div>
      </div>
    </section>
  );
}
