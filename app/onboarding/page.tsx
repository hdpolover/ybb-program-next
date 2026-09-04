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
import { friendlyOnboardingError } from '@/lib/onboarding/friendlyOnboardingError';
import { extractBirthDate } from '@/lib/onboarding/extractBirthDate';
import {
  EMPTY_FORM,
  clearOnboardingDraft,
  readOnboardingDraft,
  writeOnboardingDraft,
} from '@/lib/onboarding/draft';
import { isRecord } from '@/lib/api/response';
import { nameRuleError, textRuleError } from '@/lib/onboarding/fieldRules';
import { asciiFold, hasDisallowed, toSubmittableAscii } from '@/lib/text/restricted-input';
import { BirthDatePicker, isValidBirthDate } from './components/BirthDatePicker';


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
  // Server-confirmed ambassador attribution from a session cookie (set via an
  // invite link). When active, the free-text referral input is replaced with
  // a locked "Referred by" chip so the credited ambassador can't be silently
  // overwritten by a typo or a different code.
  const [referralAttribution, setReferralAttribution] = useState<{ active: boolean; referredByName: string | null }>({
    active: false,
    referredByName: null,
  });
  const [clearingReferral, setClearingReferral] = useState(false);

  const statesCacheRef = useRef<Map<string, StateMetadata[]>>(new Map());
  const citiesCacheRef = useRef<Map<string, CityMetadata[]>>(new Map());

  const [activeStep, setActiveStep] = useState<StepKey>('Basic Info');

  // Gates the persist effect. Effects run in declaration order after the same
  // commit, so without this the persist effect would fire on mount with the
  // still-empty initial form and overwrite the very draft the restore effect
  // is about to read.
  const draftRestored = useRef(false);
  const [bioShowErrors, setBioShowErrors] = useState(false);
  const [domShowErrors, setDomShowErrors] = useState(false);
  const [ageShowErrors, setAgeShowErrors] = useState(false);
  const [infoShowErrors, setInfoShowErrors] = useState(false);
  const [programSourceModalOpen, setProgramSourceModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [referralStatus, setReferralStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid' | 'unknown'>('idle');

  // NOT restored in the initialiser. This component renders on the server,
  // where sessionStorage does not exist, so a useState initialiser reading it
  // returns nothing — and React hydrates the client with that server value
  // rather than re-running the initialiser. The restore has to happen in a
  // mount effect; see below.
  const [form, setForm] = useState<OnboardingForm>(EMPTY_FORM);

  // Prefill from an existing participant profile, if the user already has
  // one (e.g. a prior incomplete onboarding, or resuming on a new device).
  // Runs once in the background so it never blocks the initial render.
  // Guarded against clobbering fields the user already started editing by
  // only applying the prefill while the form still matches its untouched
  // defaults at the moment the fetch resolves.
  //
  // Hits /api/participants/me (the participant-profile BFF), not
  // /api/participants/onboarding — that route only supports POST on the
  // backend; a GET there 404s. This BFF passes a real 404 straight through
  // (no participant row yet), which the statusCode !== 200 check below
  // already treats as "nothing to prefill".
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch('/api/participants/me', { cache: 'no-store' });
        const json = await res.json().catch(() => null);
        if (cancelled) return;

        const statusCode = isRecord(json) ? json.statusCode : undefined;
        const prefillData = isRecord(json) ? json.data : null;
        if (statusCode !== 200 || !isRecord(prefillData)) return;

        const str = (value: unknown): string | undefined =>
          typeof value === 'string' && value.length > 0 ? value : undefined;

        // Registration seeds full_name with the email local part ("owais56"),
        // so the prefill can hand us a value the onboarding API always rejects
        // (@IsEnglishName forbids digits). EnglishTextInput only sanitizes on
        // change, so a prefilled value is never cleaned and the participant is
        // stuck in a submit loop with no field-level hint.
        //
        // Folding first keeps a legacy accented name usable ("José" -> "Jose").
        // A value still dirty after folding can only be the registration
        // default — anything the API ever accepted is already clean — so drop
        // it and let the participant type their real name.
        const nameStr = (value: unknown): string | undefined => {
          const raw = str(value);
          if (raw === undefined) return undefined;
          if (!hasDisallowed(raw, 'name')) return raw;
          const folded = asciiFold(raw);
          return hasDisallowed(folded, 'name') ? undefined : folded;
        };

        // Legacy/imported rows predate the ASCII validators, so fold rather
        // than blank: "Bogotá" still identifies the city once folded.
        const textStr = (value: unknown): string | undefined => {
          const raw = str(value);
          return raw === undefined ? undefined : toSubmittableAscii(raw);
        };

        setForm(prev => {
          // Fill PER FIELD, and only where the field is still empty.
          //
          // This used to be all-or-nothing: if any field was non-empty the
          // whole prefill was skipped, which was the right instinct (never
          // clobber something the user is typing) but the wrong granularity
          // now that a restored draft can populate some fields. Per-field
          // keeps the same guarantee — anything the user or their draft has
          // already put there wins — while still filling the rest from the
          // profile instead of abandoning the prefill entirely.
          const fill = (current: string, incoming: string | undefined) =>
            current.trim().length > 0 ? current : incoming ?? current;

          return {
            fullName: fill(prev.fullName, nameStr(prefillData.fullName)),
            gender: fill(prev.gender, str(prefillData.gender)),
            programSource: fill(prev.programSource, str(prefillData.knowledgeSource)),
            country: fill(prev.country, str(prefillData.originCountry)),
            city: fill(prev.city, textStr(prefillData.originCity)),
            // No state/region column exists on the Participant model — leave
            // it untouched rather than inventing a source for it.
            state: prev.state,
            birthDate: fill(prev.birthDate, extractBirthDate(prefillData.birthdate)),
            referralCode: fill(prev.referralCode, str(prefillData.referralCode)),
          };
        });
      } catch {
        // Prefill is a nice-to-have — leave the form blank on any failure.
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
        let nextReferralAttribution: { active: boolean; referredByName: string | null } | null = null;
        try {
          // includeReferral=1 opts into the ambassador-attribution lookup; only
          // this page renders the "Referred by" chip, so no other /me caller
          // should pay for that extra backend round-trip.
          const homeRes = await fetch('/api/auth/me?includeReferral=1');
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

            const referral = homeJson?.data?.referral;
            if (referral && typeof referral === 'object') {
              nextReferralAttribution = {
                active: referral.active === true,
                referredByName: typeof referral.referredByName === 'string' ? referral.referredByName : null,
              };
            }
          }
        } catch (err) {
          console.error(err);
        }

        if (!cancelled) {
          if (nextName) setBrandName(nextName);
          if (nextProgramId) setReferralProgramId(nextProgramId);
          if (nextReferralAttribution) setReferralAttribution(nextReferralAttribution);
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



  // Same eligibility window the old year-only dropdown enforced (1950..min(currentYear, 2020)),
  // expressed as full-date bounds for the calendar picker. maxDateCandidate is additionally
  // clamped to today so the bound can never land in the future even if the 2020 cap is
  // ever raised or removed.
  const birthDateBounds = useMemo(() => {
    const maxBirthYear = Math.min(new Date().getFullYear(), 2020);
    const todayIso = new Date().toISOString().slice(0, 10);
    const maxDateCandidate = `${maxBirthYear}-12-31`;
    return {
      minDate: '1950-01-01',
      maxDate: maxDateCandidate > todayIso ? todayIso : maxDateCandidate,
    };
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
    // originCity is validated ASCII-only server-side, but the metadata dataset
    // ships accented names (757 for TR, 444 for VN, 90 for EG). Submitting the
    // raw option is an unwinnable 400 — the dropdown offers no spelling the API
    // accepts. Submit the folded form, show the real one.
    return (originCities ?? []).map(c => ({
      value: toSubmittableAscii(c.name),
      label: c.name,
    }));
  }, [originCities]);

  // Restore a draft from this tab, client-side only, once.
  useEffect(() => {
    const draft = readOnboardingDraft();
    if (draft.form) {
      setForm(prev => {
        const merged = { ...prev };
        for (const key of Object.keys(EMPTY_FORM) as Array<keyof OnboardingForm>) {
          const saved = draft.form?.[key];
          // Only non-empty saved values win. An empty string in the draft is
          // "the user had not filled this in", not an instruction to blank a
          // field the profile prefill may be about to populate.
          if (typeof saved === 'string' && saved.trim().length > 0) merged[key] = saved;
        }
        return merged;
      });
    }
    if (draft.step) setActiveStep(draft.step);
    draftRestored.current = true;
  }, []);

  // Persist the in-progress form so a reload, a back-navigation or an
  // accidental tab refresh does not send the user back to an empty Step 1.
  // Cleared once the server accepts the submission; see onContinue.
  useEffect(() => {
    if (!draftRestored.current) return;
    writeOnboardingDraft({ form, step: activeStep });
  }, [form, activeStep]);

  // Which control each location field is showing. Hoisted because the same
  // predicate decides both the control inside FormField and the secondary
  // "type it manually" / "choose from the list" action rendered under it.
  const showStateSelect =
    Boolean(selectedCountry?.isoCode) &&
    !statesFailed &&
    !stateManual &&
    (statesLoading || stateSelectOptions.length > 0);

  const showCitySelect =
    Boolean(selectedCountry?.isoCode) &&
    Boolean(form.state) &&
    !citiesFailed &&
    !cityManual &&
    (citiesLoading || citySelectOptions.length > 0);

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

        // Match citySelectOptions, which submits the ASCII-folded name — comparing
        // against the raw dataset names would wipe every accented selection.
        const allowed = new Set((res ?? []).map(c => toSubmittableAscii(c.name)));
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

  // Lets the participant disown an ambassador attribution they didn't ask
  // for. Clears the server-side httpOnly cookie so the BFF stops injecting
  // it on submit, then reopens the free-text input (starting blank).
  const handleClearReferral = async () => {
    if (clearingReferral) return;
    setClearingReferral(true);
    try {
      const res = await fetch('/api/participants/referral/clear', { method: 'POST' });
      if (!res.ok) {
        toast.error('Could not clear the referral code. Please try again.');
        return;
      }
      setReferralAttribution({ active: false, referredByName: null });
      setForm(prev => ({ ...prev, referralCode: '' }));
    } catch {
      toast.error('Could not clear the referral code. Please try again.');
    } finally {
      setClearingReferral(false);
    }
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

    // 0 = no real HTTP response reached us (network/unknown failure);
    // friendlyOnboardingError treats that the same as a 5xx.
    let lastStatus = 0;

    try {
      const basePayload = {
        fullName: form.fullName,
        gender: form.gender,
        knowledgeSource: form.programSource,
        originCountry: selectedCountry?.isoCode || form.country,
        originCity: form.city,
        birthDate: form.birthDate,
      };

      // Never submit a typed/prefilled referral code while a locked ambassador
      // attribution is showing — the BFF injects the cookie's code instead.
      // Skip referral on submit if it's already confirmed invalid.
      const referralToSend = referralAttribution.active
        ? undefined
        : referralStatus === 'invalid' ? undefined : (form.referralCode || undefined);

      const doSubmit = (referralCode: string | undefined) =>
        fetch('/api/participants/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...basePayload, referralCode }),
        });

      let res = await doSubmit(referralToSend);
      lastStatus = res.status;

      if (res.status === 401) {
        toast.error('Your session has expired. Please sign in again.');
        router.push('/login');
        return;
      }

      // Auto-retry without referral if it failed and a referral code was sent
      if (!res.ok && referralToSend) {
        const retryRes = await doSubmit(undefined);
        lastStatus = retryRes.status;
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

      // Only here, once the server has actually accepted it. Clearing on
      // submit-attempt would lose the user's work on the 4xx path, which is
      // exactly when they most need it still typed in.
      clearOnboardingDraft();
      router.push('/dashboard');
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : 'Onboarding failed';
      setSubmitError(friendlyOnboardingError(lastStatus, rawMessage));
    } finally {
      setSubmitLoading(false);
    }
  };

  // Mirrors the API validators so a rejected value is flagged on the field
  // instead of costing a round-trip and a form-level error.
  const fullNameRuleError = useMemo(() => nameRuleError(form.fullName), [form.fullName]);
  const cityRuleError = useMemo(() => textRuleError(form.city), [form.city]);

  const isBioValid = useMemo(() => {
    return (
      form.fullName.trim().length > 0 &&
      fullNameRuleError === null &&
      form.gender.trim().length > 0
    );
  }, [form.fullName, fullNameRuleError, form.gender]);

  const isLocationValid = useMemo(() => {
    return (
      form.country.trim().length > 0 &&
      form.state.trim().length > 0 &&
      form.city.trim().length > 0 &&
      cityRuleError === null
    );
  }, [form.country, form.state, form.city, cityRuleError]);

  const isAgeValid = useMemo(() => {
    return isValidBirthDate(form.birthDate, birthDateBounds.minDate, birthDateBounds.maxDate);
  }, [form.birthDate, birthDateBounds]);

  const birthDateError = useMemo(() => {
    if (!ageShowErrors) return '';
    if (form.birthDate.trim().length === 0) return 'Required';
    if (!isAgeValid) return 'Please select a valid date of birth';
    return '';
  }, [ageShowErrors, form.birthDate, isAgeValid]);

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
        title: 'When were you born?',
        description: 'Select your full date of birth.',
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
            {/*
              flex-1 makes this column fill the scrollable area rather than
              only as tall as its content, so the copyright's mt-auto below has
              free space to push against. Without it the footer just trailed
              whatever the tallest step happened to be and floated mid-page on
              the short ones.
            */}
            <div className="w-full max-w-lg flex flex-1 flex-col">
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
                      error={
                        form.fullName.trim().length === 0
                          ? bioShowErrors
                          : fullNameRuleError
                      }
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
                        footer={
                          stateSelectOptions.length > 0 && !statesLoading ? (
                            showStateSelect ? (
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
                            ) : stateManual ? (
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
                            ) : null
                          ) : null
                        }
                      >
                       {(errorClass) => (
                          <>
                            {showStateSelect ? (
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
                              </>
                            )}
                          </>
                       )}
                      </FormField>

                        <FormField
                        label="City"
                        icon={Building}
                        required={true}
                        error={
                          domShowErrors && form.city.trim().length === 0
                            ? "Required"
                            : cityRuleError
                              ? cityRuleError
                              : (selectedCountry?.isoCode && citiesFailed ? "Could not load cities. You can type manually." : "")
                        }
                        hint={selectedCountry?.isoCode && form.state && !citiesLoading && !citiesFailed && citySelectOptions.length === 0 ? "No cities listed for this state/region. Please type your city." : null}
                        footer={
                          citySelectOptions.length > 0 && !citiesLoading ? (
                            showCitySelect ? (
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
                            ) : cityManual ? (
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
                            ) : null
                          ) : null
                        }
                      >
                       {(errorClass) => (
                          <>
                            {showCitySelect ? (
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
                        label="Date of birth"
                        icon={Gift}
                        required={true}
                        error={birthDateError}
                      >
                       {(errorClass) => (
                         <BirthDatePicker
                           value={form.birthDate}
                           onChange={value => setForm(prev => ({ ...prev, birthDate: value }))}
                           errorClassName={errorClass}
                           minDate={birthDateBounds.minDate}
                           maxDate={birthDateBounds.maxDate}
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
                      {referralAttribution.active && referralAttribution.referredByName ? (
                        <div className="flex flex-col gap-2">
                          <p className={componentsTheme.login.fieldLabel}>
                            Referral Code
                            <span className="ml-1 font-normal normal-case tracking-normal text-slate-400">
                              (Optional)
                            </span>
                          </p>
                          <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3.5 py-2.5 sm:px-4">
                            <span className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                              <CheckCircle2 className="h-4 w-4 shrink-0" />
                              Referred by {referralAttribution.referredByName}
                            </span>
                            <button
                              type="button"
                              onClick={handleClearReferral}
                              disabled={clearingReferral}
                              aria-label="Not you? Clear the referral attribution"
                              className="shrink-0 text-xs font-semibold text-slate-500 underline underline-offset-4 transition-colors hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {clearingReferral ? 'Clearing…' : 'Not you? Clear'}
                            </button>
                          </div>
                          <p className="text-xs text-slate-400">
                            This code was applied automatically from your invite link.
                          </p>
                        </div>
                      ) : (
                        <>
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
                        </>
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

              {/* mt-auto pins this to the bottom of the column; pt-8 keeps a
                  floor of space when the step IS tall enough to fill it. */}
              <p className="mt-auto pt-8 text-center text-xs text-slate-400">
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
