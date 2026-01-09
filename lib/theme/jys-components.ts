// Per-component JYS theme config: kumpulin semua class warna di sini

export const jysSectionTheme = {
  infoStrip: {
    background: 'bg-primary text-primary-foreground',
    divider: 'lg:border-blue-800/60',
    iconCircle:
      'flex aspect-square h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-pink-500/80 bg-pink-500/30',
    icon: 'h-5 w-5 text-white',
    subtitle: 'text-sm font-semibold uppercase tracking-wider text-pink-400',
  },
  heroHome: {
    sectionWrapper: 'relative w-full',
    mobileWrapper: 'block sm:hidden',
    mobileImage: 'h-auto w-full',
    desktopWrapper:
      'relative hidden w-full bg-cover bg-no-repeat sm:block sm:min-h-[60vh] md:min-h-[70vh] sm:bg-center',
    desktopOverlay: 'absolute inset-0 bg-black/0',
    desktopInner: 'relative mx-auto flex h-full max-w-7xl items-center px-6 py-24 lg:px-8',
  },
  videoSection: {
    badge:
      'inline-flex items-center rounded-full bg-pink-600 px-3 py-1 text-xs font-semibold text-white shadow whitespace-nowrap',
    sectionWrapper: 'relative w-full bg-[#ffffff72] py-16 sm:py-20',
    card: 'mx-auto max-w-7xl px-0 py-12 sm:px-6 lg:px-8',
    subtitle: 'mx-auto -mt-6 mb-8 max-w-2xl text-center text-sm text-slate-600 sm:text-base',
    // Disederhanakan: hilangkan card pembungkus luar, biarkan konten grid biasa
    inner: 'grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-8',
    mainVideoWrapper: 'relative overflow-hidden rounded-xl bg-slate-900/5',
    mainIframe: 'absolute inset-0 h-full w-full rounded-xl border-0',
    listWrapper: 'flex flex-col gap-3',
    yearTabsWrapper: 'mb-3 inline-flex rounded-full bg-slate-100 p-1 text-xs',
    yearTab:
      'inline-flex min-w-[64px] items-center justify-center rounded-full px-3 py-1 text-[11px] font-semibold text-slate-600 transition hover:text-slate-900',
    yearTabActive: 'bg-pink-600 text-white shadow-sm',
    listCard:
      'flex cursor-pointer items-center gap-3 rounded-xl bg-slate-50/90 p-3 text-left transition hover:bg-slate-100 border border-transparent',
    listCardActive: 'border-pink-300 bg-pink-50 shadow-[0_12px_30px_rgba(15,23,42,0.12)]',
    thumbnailWrapper: 'relative h-16 w-28 overflow-hidden rounded-lg bg-slate-200 flex-shrink-0',
    thumbnailImg: 'object-cover',
    listTitle: 'text-sm font-semibold text-slate-900',
    listMeta: 'mt-0.5 text-xs text-slate-500',
  },
  momentsShorts: {
    sectionWrapper: 'relative w-full bg-[#ffffff72] py-20 sm:py-24',
    card: 'mx-auto max-w-7xl overflow-hidden rounded-3xl px-6 py-12 text-accent-foreground shadow-[0_18px_60px_rgba(15,23,42,0.35)] sm:px-10 lg:px-16',
    cardBackground: '/img/bgshorts60.jpg',
    title: 'text-2xl font-extrabold leading-tight text-blue-950 sm:text-3xl lg:text-4xl',
    description: 'mt-3 max-w-md text-sm leading-relaxed text-blue-950/90 sm:text-base lg:text-lg',
    shortsRow: 'grid grid-cols-3 gap-5',
    shortWrapper: 'relative h-80 w-full overflow-hidden bg-black/15',
    shortIframe: 'absolute inset-0 h-full w-full border-0',
  },
  furtherInfo: {
    sectionWrapper: 'relative w-full py-20 sm:py-28',
    card: 'mx-auto flex max-w-7xl items-center px-6 sm:px-10 lg:px-16',
    innerGrid:
      'grid w-full items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)] lg:gap-12',
    leftCol:
      'order-2 flex w-full max-w-xl flex-col justify-center space-y-4 text-blue-950 lg:order-1 lg:pr-6',
    description: 'mt-3 max-w-md text-sm leading-relaxed text-blue-950/90 sm:text-base lg:text-lg',
    buttonsCol: 'mt-4 flex flex-col items-start gap-3',
    guideButtonBase:
      'inline-flex items-center justify-center gap-2 rounded-full border-2 px-4 py-2.5 text-sm font-semibold shadow-sm transition',
    guideButtonPrimary: 'border-pink-500/80 bg-white/95 text-pink-700 hover:bg-white',
    guideButtonSecondary: 'border-blue-500/70 bg-blue-50/90 text-blue-800 hover:bg-blue-100',
    flagCircle: 'inline-flex h-5 w-5 items-center justify-center overflow-hidden rounded-full',
    rightCol: 'order-1 relative flex w-full justify-center lg:order-2',
    mockupWrapper:
      'relative h-80 w-full max-w-xs -mt-6 sm:h-96 sm:max-w-sm lg:h-[420px] lg:max-w-md lg:-mt-10 drop-shadow-[0_26px_70px_rgba(15,23,42,0.65)]',
  },
  homeWhatMakesSpecial: {
    sectionWrapper: 'w-full bg-slate-50 py-16 sm:py-20',
    container: 'mx-auto max-w-7xl px-6 lg:px-8',
    grid:
      'mt-10 grid gap-6 justify-items-center sm:grid-cols-2 lg:grid-cols-3 lg:gap-8',
    card:
      'flex h-full w-full max-w-md flex-col rounded-2xl bg-white/90 p-6 text-sm text-slate-800 shadow-[0_10px_35px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70 backdrop-blur-sm',
    iconCircle:
      'mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-pink-50 text-pink-600 shadow-sm',
    icon: 'h-5 w-5',
    cardTitle: 'text-base font-semibold text-slate-900',
    cardDescription: 'mt-2 text-sm leading-relaxed text-slate-600',
  },
  homeProgramBenefits: {
    sectionWrapper: 'w-full bg-[#ffffff72] py-16 sm:py-20',
    container: 'mx-auto max-w-6xl px-6 lg:px-8',
    backgroundImage: "/img/bgshorts60.jpg",
    grid: 'mt-10 grid gap-1 md:grid-cols-2',
    card:
      'flex h-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white/95 text-sm text-slate-800 shadow-[0_10px_35px_rgba(15,23,42,0.10)] ring-1 ring-slate-200/80 mx-auto',
    imageWrapper:
      'relative -mx-0 -mt-0 mb-0 h-44 w-full overflow-hidden',
    image: 'h-full w-full object-cover',
    cardTitle: 'px-6 pt-5 text-base font-semibold text-slate-900 text-center',
    list: 'mt-3 space-y-1.5 px-6 pb-2 text-sm leading-relaxed text-slate-700',
    listItem: 'flex items-start gap-2 text-sm leading-relaxed text-slate-700',
    listCheckIcon: 'mt-[3px] h-4 w-4 flex-shrink-0 text-pink-600',
    listText: 'text-sm leading-relaxed text-slate-700',
    actionsRow: 'mt-auto flex justify-center pb-6',
    readMoreButton:
      'inline-flex min-w-[180px] items-center justify-center rounded-md bg-pink-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-sm transition hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2',
  },
  testimonialsHome: {
    sectionWrapper: 'relative w-full overflow-x-hidden bg-pink-50 py-16 sm:py-20',
    container: 'mx-auto max-w-7xl px-6 lg:px-8',
    subtitle: '-mt-6 mb-10 text-center text-sm text-pink-600',
    rowsWrapper: 'space-y-8',
    rowOuter: 'relative overflow-hidden py-3',
    fadeLeft:
      'pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent',
    fadeRight:
      'pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent',
    marqueeRowBase: 'flex gap-5 whitespace-nowrap sm:gap-6',
    card: 'my-2 inline-flex w-[260px] shrink-0 cursor-pointer flex-col justify-between overflow-hidden rounded-2xl bg-white p-5 text-left shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(2,6,23,0.08)] sm:w-[300px] md:w-[340px] lg:w-[360px]',
    quote: 'whitespace-normal break-words text-sm italic leading-6 text-slate-700',
    metaRow: 'mt-5 flex items-center justify-between',
    nameRow: 'flex items-center gap-2 text-sm font-semibold text-blue-950',
    nameFlag: 'text-base',
    roleText: 'text-xs text-slate-500',
    badge:
      'inline-flex items-center rounded-full bg-pink-600/10 px-2 py-1 text-[10px] font-semibold text-pink-700 ring-1 ring-pink-200',
    modalOverlay: 'fixed inset-0 z-50 grid place-items-center bg-black/50 p-4',
    modalCard:
      'w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10',
    modalHeader: 'flex items-center justify-between border-b border-slate-200 p-4',
    modalTitle: 'text-lg font-extrabold text-blue-950',
    modalCloseButton:
      'rounded-md bg-slate-100 px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-200',
    modalBodyGrid: 'grid gap-5 p-5 sm:grid-cols-[96px,1fr]',
    modalAvatarWrapper:
      'aspect-square w-24 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200',
    modalAvatarInner: 'relative h-full w-full',
    modalAvatarImg: 'object-cover',
    modalMetaNameRow: 'flex items-center gap-2 text-sm font-semibold text-blue-950',
    modalMetaSub: 'mt-1 text-xs text-slate-600',
    modalQuote: 'text-sm leading-7 text-slate-700',
  },
  partnersWhy: {
    sectionWrapper: 'px-6 py-14 sm:py-16 md:py-20 lg:px-8',
    container: 'mx-auto max-w-7xl',
    grid: 'mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4',
    featureCard:
      'flex h-full flex-col gap-2 rounded-2xl bg-white p-5 text-left shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-200',
    featureIconCircle:
      'inline-flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-pink-600 ring-1 ring-pink-200',
    featureIcon: 'h-5 w-5',
    featureTitle: 'text-base font-extrabold text-blue-900',
    featureDescription: 'text-sm leading-relaxed text-slate-700',
    ctaWrapper: 'mt-10 flex justify-center',
    ctaButton:
      'inline-flex items-center justify-center rounded-full bg-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2',
  },
  partnersJourney: {
    sectionWrapper: 'px-6 py-14 sm:py-16 md:py-20 lg:px-8',
    container: 'mx-auto max-w-7xl',
    grid: 'mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-4',
    card: 'flex flex-col gap-2',
    number: 'text-4xl font-extrabold tracking-tight text-pink-600 sm:text-5xl',
    title: 'text-base font-extrabold text-blue-900 sm:text-lg',
    description: 'text-sm leading-relaxed text-slate-700 sm:text-base',
  },
  partnersSponsorTiers: {
    sectionWrapper: 'px-6 py-12 sm:py-14 md:py-16 lg:px-8',
    container: 'mx-auto max-w-7xl',
    tiersGrid: 'grid gap-6 lg:grid-cols-3',
    diamondCard:
      'rounded-2xl bg-white p-6 shadow-[0_10px_40px_rgba(2,6,23,0.08)] ring-2 ring-pink-200 transition hover:-translate-y-0.5 hover:shadow-[0_16px_60px_rgba(2,6,23,0.12)] focus:outline-none focus:ring-2 focus:ring-pink-300',
    diamondIconCircle: 'inline-grid h-9 w-9 place-items-center rounded-full bg-pink-600 text-white',
    diamondLabel: 'text-xs font-semibold uppercase tracking-wide text-pink-600',
    diamondLogoImg: 'h-9 w-9 rounded bg-white object-contain p-1 ring-1 ring-slate-200',
    diamondTitle: 'text-lg font-extrabold text-blue-900',
    mutedMeta: 'mt-1 text-xs text-slate-600',
    bodyText: 'mt-2 text-sm text-slate-700',
    goldCard:
      'rounded-2xl bg-white p-6 shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-amber-200/60',
    goldIconCircle:
      'inline-grid h-9 w-9 place-items-center rounded-full bg-amber-500/20 text-amber-600 ring-1 ring-amber-200',
    goldLabel: 'text-xs font-semibold uppercase tracking-wide text-amber-700',
    goldOrgWrapper: 'space-y-4',
    goldOrgCard:
      'block rounded-xl border border-amber-200 bg-amber-50/30 p-4 transition hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300',
    goldLogoImg: 'h-8 w-8 rounded bg-white object-contain p-1 ring-1 ring-amber-200',
    goldOrgTitle: 'text-base font-extrabold text-blue-900',
    goldOrgMeta: 'text-xs text-slate-600',
    goldOrgBody: 'mt-1 text-sm text-slate-700',
    silverCard:
      'rounded-2xl bg-white p-6 shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-200',
    silverIconCircle:
      'inline-grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600 ring-1 ring-slate-200',
    silverLabel: 'text-xs font-semibold uppercase tracking-wide text-slate-700',
    silverGrid: 'grid gap-3 sm:grid-cols-2',
    silverOrgCard:
      'rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300',
    silverLogoImg: 'h-7 w-7 rounded bg-white object-contain p-1 ring-1 ring-slate-200',
    silverOrgName: 'font-semibold text-blue-900',
    silverOrgDesc: 'text-sm text-slate-700',
    silverOrgCardWide:
      'rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 sm:col-span-2',
  },
  partnersProven: {
    sectionWrapper: 'px-6 py-14 sm:py-16 md:py-20 lg:px-8 bg-slate-50/60',
    container: 'mx-auto max-w-7xl',
    subtitle: 'mx-auto -mt-6 mb-2 max-w-2xl text-center text-sm text-slate-600 sm:mb-0 sm:text-base',
    layout:
      'mt-10 grid items-center gap-10 md:grid-cols-[minmax(0,0.35fr)_minmax(0,1fr)]',
    impactCol: 'space-y-3 text-blue-950',
    impactValue: 'text-3xl md:text-4xl font-extrabold tracking-tight text-blue-950',
    impactLabel: 'text-sm md:text-base text-slate-700 max-w-xs',
    card:
      'rounded-2xl bg-white/90 p-6 shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-200',
    cardHeader: 'mb-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between',
    cardTitle: 'text-lg font-extrabold text-blue-900',
    cardSubtitle: 'text-sm text-slate-600',
    logosGrid: 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
    logoCard:
      'flex items-center justify-center rounded-xl bg-white p-4 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(15,23,42,0.18)] focus:outline-none focus:ring-2 focus:ring-pink-300',
    logoImg: 'h-12 w-auto object-contain',
  },
  partnersImpact: {
    sectionWrapper: 'px-6 py-12 sm:py-14 md:py-16 lg:px-8',
    container: 'mx-auto max-w-7xl',
    grid: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-4',
  },
  partnersRequire: {
    sectionWrapper: 'px-6 py-16 sm:py-20 lg:py-24 lg:px-8 bg-white',
    container: 'mx-auto max-w-4xl',
    subtitle:
      'mx-auto -mt-6 mb-6 max-w-2xl text-center text-sm text-slate-600 sm:mb-8 sm:text-base',
    formGrid: 'grid gap-6 sm:grid-cols-2',
    fieldGroup: 'flex flex-col gap-2',
    fieldGroupFull: 'flex flex-col gap-2 sm:col-span-2',
    // Slightly larger, more prominent field labels
    label: 'text-xs font-semibold uppercase tracking-wide text-slate-700 sm:text-[13px]',
    iconFieldWrapper:
      'mt-1 relative flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ring-0 focus-within:border-pink-400 focus-within:ring-2 focus-within:ring-pink-200',
    iconFieldWrapperTextarea:
      'mt-1 relative flex items-start overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ring-0 focus-within:border-pink-400 focus-within:ring-2 focus-within:ring-pink-200',
    // Plain icon without background bubble
    icon: 'pointer-events-none ml-3 flex h-9 w-9 items-center justify-center text-pink-600',
    inputWithIcon:
      'h-11 w-full border-0 bg-transparent px-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-0',
    textareaWithIcon:
      'w-full min-h-[132px] border-0 bg-transparent px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-0 resize-none',
    input:
      'mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200',
    textarea:
      'mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200 resize-none',
    actionsRow: 'sm:col-span-2 mt-4 flex justify-end',
    submitButton:
      'inline-flex items-center justify-center rounded-full bg-pink-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2',
  },
  alumniStories: {
    sectionWrapper: 'relative w-full bg-[#ffffff72] py-16 sm:py-20',
    card: 'mx-auto max-w-7xl px-6 py-10 text-slate-900 sm:px-10',
    layoutGrid: 'grid gap-10 items-start',
    mainVideoWrapper:
      'relative aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-slate-900/5 ring-1 ring-slate-200 mx-auto',
    mainIframe: 'absolute inset-0 h-full w-full border-0 rounded-2xl',
    reelsTitle: 'text-sm font-semibold uppercase tracking-wide text-pink-600',
    reelsGrid: 'mt-4 grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
    reelItem:
      'relative aspect-[9/16] w-full max-w-[250px] sm:max-w-[270px] mx-auto overflow-hidden rounded-xl',
    reelVideo: 'h-full w-full object-cover',
    reelSkeleton: 'absolute inset-0 animate-pulse bg-slate-200',
  },
  globalImpact: {
    sectionWrapper: 'relative w-full bg-[#ffffff72] py-16 sm:py-20',
    statsGrid: 'mx-auto mt-2 grid max-w-4xl grid-cols-1 gap-3 text-center sm:grid-cols-3',
    card: 'flex flex-col items-center gap-1 px-2 py-1',
    iconCircle:
      'grid h-10 w-10 place-items-center rounded-full bg-pink-50 text-pink-600 ring-1 ring-pink-200',
    value: 'text-3xl font-extrabold tracking-tight text-pink-600 sm:text-4xl',
    label: 'text-xs font-medium uppercase tracking-wide text-slate-500',
  },
  participantDistribution: {
    sectionWrapper: 'relative w-full bg-[#ffffff72] py-16 sm:py-20',
    mapCard:
      'mx-auto max-w-7xl rounded-3xl bg-white px-6 py-8 text-slate-900 shadow-[0_14px_45px_rgba(15,23,42,0.12)] ring-1 ring-slate-200 sm:px-10',
    mapWrapper: 'relative w-full overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-200',
    mapInner: 'relative z-10 h-80 sm:h-96 lg:h-[420px]',
    legendRow: 'mt-6 flex flex-wrap items-center justify-center gap-8 text-xs sm:text-sm',
    legendTitle: 'sr-only',
    legendItem: 'flex items-center gap-2.5 text-slate-700',
    legendDotBase: 'inline-block h-3.5 w-3.5 rounded-sm ring-2 ring-white shadow-sm',
    legendDotHigh: 'bg-red-500',
    legendDotMedium: 'bg-yellow-400',
    legendDotLow: 'bg-emerald-400',
    legendDotNone: 'bg-slate-300',
    mapBackdrop: '',
  },
  recognition: {
    sectionWrapper: 'relative w-full bg-slate-50 py-16 sm:py-20',
    container: 'mx-auto max-w-7xl px-6 lg:px-8',
    subtitle: '-mt-6 mb-8 text-center text-sm text-accent',
    grid: 'grid gap-6 lg:grid-cols-12',
    proofsCol: 'col-span-12 lg:col-span-7',
    proofsGrid: 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3',
    proofCard:
      'overflow-hidden rounded-2xl bg-white px-4 py-4 shadow-[0_12px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-200',
    proofIconCircle:
      'bg-accent text-accent-foreground inline-grid h-7 w-7 place-items-center rounded-full',
    proofTitle: 'text-[14px] font-extrabold text-blue-900',
    proofSubtitle: 'mt-0.5 text-[11px] leading-5 text-slate-700',
    bulletChip:
      'rounded-full bg-pink-600/10 px-2 py-0.5 text-[10px] font-semibold text-pink-700 ring-1 ring-pink-200',
    hakiIconCircle: 'inline-grid h-10 w-10 place-items-center rounded-full bg-pink-600 text-white',
    hakiCol: 'col-span-12 flex items-center justify-center lg:col-span-5',
    hakiCard:
      'w-full max-w-md rounded-2xl bg-white p-5 shadow-[0_12px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-200',
    hakiTitle: 'text-lg font-extrabold text-blue-900',
    hakiSubtitle: 'text-xs font-medium text-slate-600',
    hakiBrand: 'text-sm font-semibold text-blue-900',
    hakiClassText: 'text-xs text-slate-600',
    hakiMeta: 'rounded-lg bg-slate-50 p-2 ring-1 ring-slate-200',
    hakiMetaLabel: 'text-slate-500',
    hakiMetaValue: 'font-semibold text-blue-950',
    hakiButton:
      'inline-flex items-center gap-2 rounded-md bg-pink-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-pink-700',
    hakiChip:
      'rounded-full bg-pink-600/10 px-2 py-1 text-[10px] font-semibold text-pink-700 ring-1 ring-pink-200',
  },
  aboutProgram: {
    checklistIcon: 'grid h-7 w-7 place-items-center rounded-full bg-pink-600 text-white',
    ctaButton:
      'inline-flex items-center justify-center rounded-md bg-pink-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2',
    sectionWrapper:
      "relative min-h-[520px] w-full bg-[url('/img/bgourprogram.png')] bg-cover bg-center bg-no-repeat py-20 sm:py-20",
    blurTop:
      'pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-pink-400/20 blur-2xl',
    blurBottom:
      'pointer-events-none absolute -bottom-12 right-6 h-48 w-48 rounded-full bg-white/40 blur-2xl',
    container: 'mx-auto max-w-7xl px-6 lg:px-8',
    layoutGrid: 'grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)] lg:gap-14',
    leftCol: 'order-2 lg:order-1 lg:pr-4',
    tabContainer:
      'mt-4 inline-flex rounded-full bg-white/70 p-1 text-xs shadow-sm ring-1 ring-slate-200',
    tabButtonBase: 'rounded-full px-4 py-2 text-xs font-semibold transition',
    tabButtonActive: 'bg-pink-600 text-white shadow-sm',
    tabButtonInactive: 'text-slate-600 hover:text-slate-900',
    contentWrapper:
      'mt-5 min-h-[220px] space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base',
    visionLabel: 'font-semibold text-blue-950',
    ctaWrapper: 'mt-6',
    rightCol: 'order-1 lg:order-2',
    collageWrapper: 'relative h-full w-full',
    collageGrid: 'grid h-full gap-4 sm:grid-cols-2',
    collageLargeCard:
      'relative col-span-1 row-span-2 overflow-hidden rounded-2xl bg-blue-900/5 shadow-[0_8px_30px_rgba(31,41,55,0.12)] ring-1 ring-blue-900/10',
    collageSmallCard:
      'relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/40 shadow-[0_8px_30px_rgba(31,41,55,0.12)] ring-1 ring-slate-200/80',
    collageImage: 'object-cover',
  },
  programHighlights: {
    card: 'hover:ring-accent/30 group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_60px_rgba(2,6,23,0.12)]',
    imageWrapper: 'h-40 w-full overflow-hidden bg-blue-100/60',
    title: 'text-xl font-extrabold text-blue-900',
    intro: 'mt-2 text-sm leading-6 text-slate-600',
    listItem:
      'flex items-center gap-3 py-3 transition-colors duration-200 hover:bg-slate-50 border-slate-200',
    checkIcon: 'bg-accent text-accent-foreground grid h-7 w-7 place-items-center rounded-full',
    crossIcon: 'grid h-7 w-7 place-items-center rounded-full bg-slate-200 text-slate-600',
    ctaButton:
      'bg-accent text-accent-foreground hover:bg-accent/90 focus:ring-accent inline-flex items-center justify-center rounded-md px-4 py-2 text-xs font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2',
    sectionWrapper: 'relative w-full bg-[#ffffff72] py-16 sm:py-20',
    collageLargeCard:
      'relative col-span-1 row-span-2 overflow-hidden rounded-2xl bg-blue-900/5 shadow-[0_8px_30px_rgba(31,41,55,0.12)] ring-1 ring-blue-900/10',
    collageSmallCard:
      'relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/40 shadow-[0_8px_30px_rgba(31,41,55,0.12)] ring-1 ring-slate-200/80',
    rightWrapper: 'order-2 lg:order-2 lg:pl-4',
    objectiveIntro: 'text-sm leading-relaxed text-slate-600 sm:text-base',
    objectivePointText: 'text-sm font-medium text-blue-950 sm:text-base',
  },
  awards: {
    sectionWrapper: 'relative w-full bg-background py-16 sm:py-20',
    container: 'mx-auto max-w-7xl px-6 lg:px-8',
    subtitle: '-mt-6 mb-8 text-center text-sm text-accent',
    grid: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3',
    card: 'group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-900/10 transition hover:shadow-[0_16px_60px_rgba(2,6,23,0.12)]',
    cardInner: 'p-5',
    cardHeader: 'mb-2 flex items-center gap-2',
    iconCircleBase: 'inline-grid h-9 w-9 place-items-center rounded-full',
    title: 'text-lg font-extrabold text-blue-900',
    desc: 'text-sm leading-6 text-slate-700',
    highlightsList: 'flex flex-1 flex-col p-5 pt-0',
    highlightItemBase: 'flex items-center justify-between gap-3 py-3 text-sm transition-colors',
    highlightDivider: 'border-b border-slate-200',
    highlightLabel: 'font-medium text-blue-950',
    highlightBadge:
      'rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-700 ring-1 ring-slate-200',
    singleHighlightBox:
      'flex flex-1 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4',
    singleHighlightValue: 'text-3xl font-extrabold text-blue-900',
    singleHighlightUnit: 'text-xs font-semibold uppercase tracking-wide text-slate-600',
    chip: 'rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-700 ring-1 ring-slate-200',
  },
  photoGallery: {
    sectionWrapper: 'relative w-full py-12 sm:py-16 lg:py-20',
    container: 'mx-auto max-w-7xl px-6 lg:px-8',
    subtitle: '-mt-6 mb-8 text-center text-sm text-pink-600',
    grid: 'grid grid-cols-2 gap-3 sm:gap-5 md:gap-6 lg:grid-cols-4',
    itemWrapper: 'group overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200',
    itemButton: 'block aspect-[16/10] w-full cursor-zoom-in overflow-hidden',
    itemImageWrapper: 'relative block h-full w-full',
    itemImage:
      'origin-center scale-100 transform object-cover transition-transform duration-500 group-hover:scale-[1.05]',
    modalOverlay: 'fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4',
    modalCard: 'relative max-h-[90vh] w-full max-w-5xl',
    modalCloseButton:
      'absolute -right-3 -top-3 z-[61] inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow ring-1 ring-slate-200 hover:bg-white',
    modalImageWrapper: 'relative w-full',
    modalImage: 'max-h-[80vh] w-full rounded-xl object-contain',
    modalCaption: 'mt-3 text-center text-sm font-medium text-white/90',
    homeCtaButton:
      'inline-flex items-center justify-center rounded-md bg-pink-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2',
    loadMoreButton:
      'inline-flex items-center justify-center rounded-md bg-pink-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2',
  },
  getInTouch: {
    cardBackground: '/img/getintuch.png',
    sectionWrapper: 'relative w-full overflow-visible bg-transparent py-16 sm:py-20',
    card: 'mx-auto max-w-7xl bg-transparent px-6 py-10 text-white sm:px-10 lg:px-16',
    layoutGrid: 'grid items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)]',
    imageWrapper: 'relative mx-auto h-64 w-full max-w-sm sm:h-72 overflow-visible',
    image: 'object-contain',
    title: 'text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl',
    list: 'mt-6 space-y-3',
    item: 'flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-blue-950 shadow-[0_10px_30px_rgba(15,23,42,0.18)]',
    itemIconCircle:
      'grid h-9 w-9 place-items-center rounded-full bg-pink-600 text-white shadow-[0_6px_20px_rgba(236,72,153,0.55)]',
    itemTitle: 'text-sm font-semibold',
    itemSubtitle: 'text-xs text-slate-600',
  },
  supportedBy: {
    sectionWrapper: 'relative w-full bg-white py-12 sm:py-16',
    subtitle: 'mx-auto -mt-6 mb-8 max-w-2xl text-center text-sm text-slate-600 sm:text-base',
    card: 'flex flex-col items-center gap-2 rounded-2xl bg-white/80 p-4 shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200',
    logoWrapper: 'relative h-14 w-32 sm:h-16 sm:w-40 flex-shrink-0',
    logoImg: 'object-contain',
    name: 'text-sm font-semibold text-slate-900 text-center',
    role: 'text-xs text-slate-500 text-center',
  },
  faq: {
    sectionWrapper: 'relative w-full py-16 sm:py-20',
    container: 'mx-auto max-w-7xl px-6 lg:px-8',
    subtitle: 'mx-auto -mt-6 mb-8 max-w-2xl text-center text-sm text-slate-600',
    searchWrapper: 'mx-auto mb-8 max-w-3xl',
    searchInner:
      'relative flex items-center overflow-hidden rounded-full bg-white px-4 py-2 shadow-[0_10px_35px_rgba(15,23,42,0.12)] ring-1 ring-slate-200',
    searchIcon: 'h-4 w-4 text-slate-400',
    searchInput:
      'ml-3 w-full border-none bg-transparent text-sm text-blue-950 placeholder:text-slate-400 focus:outline-none focus:ring-0',
    layoutGrid: 'grid items-start gap-8 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)]',
    tabsCard:
      'w-full overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)] ring-1 ring-blue-100',
    tabsNav: 'flex flex-col divide-y divide-slate-100',
    tabButtonBase:
      'relative flex items-center gap-3 px-5 py-4 text-left text-sm font-semibold transition-colors sm:px-6 sm:text-base',
    tabButtonActive: 'bg-white text-blue-950',
    tabButtonInactive: 'bg-white text-slate-500 hover:bg-pink-50 hover:text-blue-950',
    tabIndicatorActive: 'h-9 w-0.5 rounded-full bg-pink-600',
    tabIndicatorIdle: 'h-9 w-0.5',
    faqListWrapper: 'space-y-3',
    emptyCard:
      'rounded-2xl bg-white px-5 py-6 text-sm text-slate-600 shadow-[0_10px_35px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 sm:px-6',
    faqItemCard:
      'overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(15,23,42,0.1)] ring-1 ring-slate-200',
    faqItemHeader: 'flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6',
    faqQuestion: 'text-base font-extrabold text-blue-950 sm:text-lg',
    faqAnswer: 'px-5 pb-5 text-sm leading-6 text-slate-700 sm:px-6',
    toggleIcon:
      'shrink-0 rounded-full bg-pink-50 p-2 text-pink-600 ring-1 ring-pink-200 transition group-open:rotate-180',
  },
  programsCurrent: {
    sectionWrapper: 'sm:py-18 py-14 md:py-20',
    container: 'mx-auto max-w-7xl px-6 lg:px-8',
    layoutGrid: 'grid items-start gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]',
    leftCol: 'space-y-5 text-blue-950',
    bodyParagraph: 'text-sm leading-7 text-slate-700 sm:text-base',
    themeBlock: 'mt-4 space-y-3',
    themeHeading: 'text-sm font-semibold uppercase tracking-wide text-pink-600',
    themeTitle: 'mt-1 text-sm font-semibold text-blue-950 sm:text-base',
    subthemesGrid: 'mt-2 grid gap-3 sm:grid-cols-2',
    subthemeCard:
      'rounded-2xl bg-white px-4 py-3 text-sm font-medium text-blue-950 shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80',
    rightCol: 'mx-auto w-fit',
    rightCard:
      'rounded-3xl bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/80 sm:p-5',
    coverWrapper: 'relative overflow-hidden rounded-2xl bg-slate-100',
    coverImage: 'h-auto w-auto object-contain',
    infoList: 'mt-4 space-y-3 text-sm text-slate-700',
    infoRow: 'flex items-start gap-2',
    infoIcon: 'mt-0.5 h-4 w-4 text-pink-600',
    infoLabel: 'text-xs font-semibold uppercase tracking-wide text-slate-500',
    infoValue: 'text-sm font-semibold text-blue-950',
    infoGrid: 'grid gap-3 sm:grid-cols-2',
    guideButtonsWrapper: 'mt-5 flex flex-col gap-3',
    subtitle: 'mt-1 text-sm font-medium text-pink-700',
    statusBadge:
      'inline-flex items-center rounded-full border border-pink-200 bg-pink-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-pink-700',
    primaryCta:
      'inline-flex items-center justify-center rounded-lg bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700',
    secondaryCta:
      'inline-flex items-center justify-center rounded-lg border border-pink-200 bg-white px-4 py-2 text-sm font-semibold text-pink-700 shadow-sm transition hover:bg-pink-50',
    tertiaryCta:
      'inline-flex items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-100',
    infoItemCard: 'rounded-xl border border-gray-200 bg-white p-4',
    infoItemHeader: 'flex items-center gap-2 text-gray-600',
    infoItemIcon: 'h-5 w-5 text-pink-600',
    infoItemLabel: 'text-xs',
    infoItemValue: 'mt-1 text-base font-semibold text-gray-900',
  },
  programsPrevious: {
    sectionWrapper: 'sm:py-18 relative w-full overflow-hidden px-6 py-16 md:py-20',
    container: 'mx-auto max-w-7xl',
    yearBadge:
      'absolute left-3 top-3 inline-flex items-center rounded-full border border-pink-200 bg-pink-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-pink-700',
    subtitle: '-mt-6 mb-8 text-center text-sm text-pink-600 sm:text-base',
    stageWrapper: 'relative mt-10 flex h-[480px] items-center justify-center',
    chevronIcon: 'h-5 w-5',
    carouselInner: 'relative mx-auto flex h-full w-full max-w-5xl items-center justify-center',
    slideBase: 'absolute transition-all duration-500 ease-in-out',
    card: 'w-[340px] overflow-hidden rounded-3xl bg-white shadow-[0_18px_60px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/80 sm:w-[360px]',
    cardImageWrapper: 'relative h-[220px] w-full',
    cardImage: 'object-cover',
    cardBody: 'p-6',
    cardTitle: 'text-base font-semibold text-blue-950 sm:text-lg',
    cardDate: 'mt-1 text-sm text-slate-600',
    arrowButton:
      'flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900',
    dotActive: 'h-2.5 w-8 rounded-full bg-pink-500',
    dotInactive: 'h-2.5 w-2.5 rounded-full bg-gray-300 hover:bg-gray-400',
  },
  programsAdditional: {
    sectionWrapper: 'px-6 py-12 sm:py-14 md:py-16 lg:px-8',
    container: 'mx-auto max-w-7xl',
    subtitle: '-mt-6 mb-8 text-center text-sm text-pink-600 sm:text-base',
    cardsWrapper: 'flex flex-wrap justify-center gap-6',
    card: 'group w-[320px] overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200 transition hover:shadow-md sm:w-[360px]',
    coverWrapper: 'relative aspect-[16/9] overflow-hidden',
    coverImage: 'object-cover transition group-hover:scale-105',
    logoBadgesWrapper: 'absolute left-3 top-3 flex items-center gap-2',
    logoCircle: 'relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-white/60',
    logoImage: 'bg-white object-contain',
    cardMetaRow: 'flex items-start justify-between gap-3 p-5',
    datesText: 'mt-1 text-sm text-gray-600',
    cardTitle: 'text-base font-extrabold text-gray-900 group-hover:text-pink-700 sm:text-lg',
    arrowCircle:
      'mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-pink-200 bg-pink-50 text-pink-600 transition group-hover:bg-pink-600 group-hover:text-white',
    arrowIcon: 'h-4 w-4',
  },
  programsMissionVision: {
    missionIconMain: 'grid h-9 w-9 place-items-center rounded-full bg-pink-600 text-white',
    missionBulletIcon:
      'mt-1 grid h-6 w-6 place-items-center rounded-full bg-pink-100 text-pink-700 ring-1 ring-pink-200',
  },
  programsObjectives: {
    numberCircle:
      'grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-pink-600 text-white',
  },
  programsBenefits: {
    iconCircle: 'grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-pink-600 text-white',
  },
  programsActivities: {
    sectionWrapper:
      "relative w-full bg-[url('/img/bgshorts60.jpg')] bg-cover bg-center bg-no-repeat py-10 sm:py-14 lg:py-16",
    overlay: 'absolute inset-0 bg-white/80',
    container: 'relative mx-auto max-w-7xl px-6 lg:px-8',
    cardsGrid: 'mt-8 grid gap-6 md:grid-cols-2',
    card: 'flex h-full flex-col rounded-3xl bg-white px-5 py-5 shadow-[0_18px_50px_rgba(15,23,42,0.24)] ring-1 ring-slate-200/80 sm:px-6 sm:py-6',
    metaRow: 'flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600 sm:text-[13px]',
    metaItem: 'flex items-center gap-1.5',
    metaIcon: 'h-4 w-4 text-pink-600',
    titleWrapper: 'mt-3 flex-1',
    title: 'text-base font-extrabold text-blue-950 sm:text-lg',
    dayLabel: 'text-pink-600',
    bulletsGrid: 'mt-3 grid gap-x-6 gap-y-1 text-sm text-slate-800 sm:grid-cols-2',
    bulletRow: 'flex items-start gap-2',
    bulletIconWrapper: 'mt-0.5 text-emerald-500',
    bulletIcon: 'h-4 w-4',
    description: 'mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm',
    note: 'mx-auto mt-6 max-w-3xl text-center text-xs text-slate-600 sm:text-sm',
    noteEmphasis: 'font-semibold text-pink-700',
  },
  programsSteps: {
    sectionWrapper:
      'relative w-full bg-gradient-to-b from-white to-pink-50/50 py-10 sm:py-14 lg:py-16',
    container: 'relative mx-auto max-w-5xl px-6 lg:px-8',
    timelineGrid: 'mt-8 grid grid-cols-[auto,1fr] gap-x-5 sm:gap-x-7',
    lineCol: 'relative col-span-1 row-span-full',
    line: 'mx-auto h-full w-px bg-gradient-to-b from-pink-400 via-pink-300 to-transparent',
    stepsCol: 'space-y-6',
    stepRow: 'grid grid-cols-[auto,1fr] gap-x-4 gap-y-1',
    stepIconCol: 'relative col-span-1 flex flex-col items-center',
    stepIconCircle:
      'grid h-9 w-9 place-items-center rounded-full bg-pink-600 text-white shadow-[0_10px_25px_rgba(219,39,119,0.6)]',
    stepIcon: 'h-5 w-5',
    stepLabel: 'mt-1 text-[11px] font-semibold uppercase tracking-wide text-pink-600',
    stepCard:
      'col-span-1 rounded-2xl bg-white/95 px-4 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70 sm:px-5 sm:py-5',
    stepTitle: 'text-sm font-extrabold text-blue-950 sm:text-base',
    stepList: 'mt-2 space-y-1.5 text-xs text-slate-700 sm:text-sm',
    stepListItem: 'flex gap-2',
    stepListBulletIcon: 'mt-1 hidden text-emerald-500 sm:inline',
    stepListBulletIconInner: 'h-3.5 w-3.5',
  },
  programsSchedules: {
    sectionWrapper: 'relative w-full bg-white py-10 sm:py-14 lg:py-16',
    container: 'relative mx-auto max-w-6xl px-6 lg:px-8',
    tableWrapper:
      'mt-8 overflow-hidden rounded-3xl bg-white shadow-[0_18px_50px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/80',
    tableInner: 'overflow-x-auto',
    table: 'min-w-full divide-y divide-slate-200 text-sm',
    thead: 'bg-pink-50',
    headerRow: 'text-left text-xs font-semibold uppercase tracking-wide text-slate-500',
    headerCell: 'px-5 py-3 sm:px-6',
    body: 'divide-y divide-slate-100 bg-white',
    row: 'align-top text-[13px] text-slate-800',
    cellDate: 'whitespace-nowrap px-5 py-4 text-slate-700 sm:px-6',
    cellStatus: 'px-5 py-4 sm:px-6',
    cellName: 'px-5 py-4 font-semibold text-blue-950 sm:px-6',
    cellDesc: 'px-5 py-4 text-slate-600 sm:px-6',
    note: 'mx-auto mt-4 max-w-3xl text-center text-xs text-slate-600 sm:mt-5 sm:text-sm',
    noteEmphasis: 'font-semibold text-pink-700',
    statusActive:
      'inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100',
    statusActiveDot: 'h-1.5 w-1.5 rounded-full bg-emerald-500',
    statusUpcoming:
      'inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-100',
    statusUpcomingDot: 'h-1.5 w-1.5 rounded-full bg-amber-500',
    statusClosed:
      'inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200',
    statusClosedDot: 'h-1.5 w-1.5 rounded-full bg-slate-400',
  },
  insightsStats: {
    iconCircle: 'grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-pink-600 text-white',
    label: 'text-xs font-semibold uppercase tracking-wide text-pink-600',
    value: 'mt-1 text-2xl font-extrabold text-blue-900',
  },
  insightsTheme: {
    card: 'relative overflow-hidden rounded-xl border border-pink-200/60 bg-gradient-to-br from-pink-50 to-white p-5 shadow-[0_8px_30px_rgba(2,6,23,0.06)]',
    leftAccent: 'absolute left-0 top-0 h-full w-1 bg-pink-500/60',
    tagChip:
      'inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-pink-600 ring-1 ring-pink-200',
    iconCircle:
      'grid h-8 w-8 place-items-center rounded-full bg-white text-pink-600 ring-1 ring-pink-200',
    sdgCircle:
      'inline-flex h-7 w-7 items-center justify-center rounded-full bg-pink-600 text-xs font-bold text-white',
  },
  insightsParticipants: {
    rankCircle:
      'inline-flex h-7 w-7 items-center justify-center rounded-full bg-pink-600 text-xs font-bold text-white',
    flagCircle:
      'grid h-7 w-7 place-items-center rounded-full bg-pink-50 text-pink-600 ring-1 ring-pink-200',
    barTrack: 'mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100',
    barFill: 'h-full bg-pink-500',
  },
  announcementsGrid: {
    subtitle: '-mt-6 mb-8 text-center text-sm text-pink-600',
    card: 'group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_60px_rgba(2,6,23,0.12)] hover:ring-pink-200',
    loadMoreButton:
      'inline-flex items-center justify-center rounded-md bg-pink-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2',
  },
  login: {
    input:
      'mt-2 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-200',
    checkbox: 'h-4 w-4 rounded border-white/30 bg-white/20 text-pink-600 focus:ring-pink-300',
    primaryButton:
      'inline-flex w-full items-center justify-center rounded-md bg-pink-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2',
    forgotPasswordLink: 'font-semibold text-pink-700 hover:text-pink-800',
    switchModeLink: 'font-semibold text-pink-700 underline hover:text-pink-800',
    slideIndicatorWrapper:
      'inline-flex gap-2 rounded-full border border-white/40 bg-white/15 px-3 py-1 shadow-sm shadow-black/20 backdrop-blur',
    slideDotActive: 'h-2 w-2 rounded-full bg-pink-500 shadow-sm shadow-pink-500/40',
    slideDotInactive: 'h-2 w-2 rounded-full bg-white/70',
    heroEyebrow: 'text-xs font-semibold uppercase tracking-[0.24em] text-pink-100',
    heroTitle: 'text-3xl font-extrabold leading-tight',
    heroDescription: 'text-sm text-pink-50',
    pageBackground: 'bg-slate-50',
    imagePanelBackground: 'bg-slate-50',
    heroOverlay:
      'absolute inset-0 bg-gradient-to-t from-pink-700/85 via-pink-700/40 to-transparent',
    heroTextContainer: 'absolute inset-x-0 bottom-0 px-8 pb-12 pt-6 text-white',
    heroLogo: 'h-10 w-auto',
    heroLogoWrapper: 'space-y-4',
    formPanelOuter: 'flex items-center justify-start px-6 py-10 lg:px-20 lg:py-0',
    formPanelInner: 'w-full max-w-xl',
    formHeading: 'text-2xl font-extrabold tracking-tight text-pink-600 sm:text-3xl',
    formSubheading: 'mt-2 text-sm text-slate-600',
    card:
      'space-y-4 rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-sm',
    fieldLabel: 'block text-xs font-semibold uppercase tracking-wide text-slate-700',
    helperText: 'text-xs text-slate-600',
    checkboxRow: 'flex items-center justify-between text-xs text-slate-600',
    dividerRow:
      'flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400',
    dividerLine: 'h-px w-8 bg-slate-200',
    secondaryButton:
      'inline-flex w-full items-center justify-center rounded-xl border border-pink-500/70 bg-white px-5 py-3 text-sm font-semibold text-pink-600 shadow-sm transition hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2',
    termsLabel: 'mt-1 inline-flex items-center gap-2 text-xs text-slate-600',
    termsLink: 'underline',
  },
  applyImportant: {
    card: 'overflow-hidden rounded-2xl bg-pink-50 p-6 shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-pink-200 sm:p-8',
    chip: 'rounded-full border border-pink-300 bg-white/70 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-pink-700',
    bulletDot: 'mt-1 h-1.5 w-1.5 rounded-full bg-pink-500',
    legalLink: 'font-semibold underline decoration-pink-300 underline-offset-2 hover:text-pink-700',
  },
  applyRegistrationTypes: {
    card: 'group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_60px_rgba(2,6,23,0.12)] hover:ring-pink-200',
    iconCircle: 'grid h-10 w-10 place-items-center rounded-full bg-pink-600 text-white',
    priceText: 'text-2xl font-extrabold text-pink-600',
    calendarIcon: 'h-4 w-4 text-pink-600',
    bulletCircle: 'grid h-7 w-7 place-items-center rounded-full bg-pink-600 text-white',
    ctaButton:
      'inline-flex items-center justify-center rounded-md bg-pink-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-pink-700',
    headerWrapper: 'border-b border-slate-200 bg-gradient-to-b from-blue-50/70 to-transparent p-5',
    headerRow: 'flex items-center justify-between',
    headerRowTopAligned: 'flex items-start justify-between',
    headerTitleRow: 'flex items-center gap-3',
    headerTitle: 'text-xl font-extrabold text-blue-900',
    headerSubtitle: 'text-xs font-medium text-slate-600',
    statusBadgeOpen:
      'whitespace-nowrap rounded-full bg-green-100 px-3 py-1 text-[11px] font-semibold text-green-700',
    statusBadgeClosed:
      'rounded-full bg-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700',
    feeRow: 'mt-3 flex items-baseline gap-2',
    feeLabel: 'text-xs font-medium text-slate-500',
    periodRow: 'mt-2 flex items-center gap-2 text-xs text-slate-600',
    periodLabel: 'font-semibold text-slate-700',
    bodyWrapper: 'flex-1 p-5',
    sectionLabel: 'text-xs font-semibold uppercase tracking-wide text-slate-500',
    list: 'mt-2 space-y-2 text-sm text-slate-700',
    listItemRow: 'flex items-center gap-3',
    listItemText: 'font-medium text-blue-950',
    bodySectionSpacer: 'mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500',
    cardFooter: 'p-5 pt-0',
    ctaWrapper: 'flex justify-center',
    ctaButtonWide: 'w-full max-w-xs justify-center py-3 text-sm',
    ctaButtonDisabled:
      'inline-flex w-full max-w-xs cursor-not-allowed items-center justify-center rounded-md bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-500',
  },
  applyOverview: {
    sectionWrapper: 'sm:py-18 py-16 md:py-20',
    container: 'mx-auto max-w-6xl px-6 lg:px-8',
    layoutGrid: 'grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)] lg:gap-1',
    leftCol: 'h-full text-blue-950',
    leftCard:
      'flex h-full flex-col rounded-3xl bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/80',
    tabsHeader:
      'mb-4 flex items-center justify-between border-b border-slate-200 text-sm font-semibold text-slate-500',
    tabButtonBase: 'relative flex-1 px-3 pb-2 pt-1 text-center transition',
    tabButtonActive: 'text-blue-950',
    tabButtonInactive: 'text-slate-500 hover:text-slate-700',
    tabActiveUnderline:
      'absolute inset-x-0 bottom-0 mx-auto block h-0.5 max-w-[70%] rounded-full bg-pink-500',
    detailsContentWrapper: 'mt-5 space-y-6 text-[15px] leading-7 text-slate-700 sm:text-base',
    descriptionBlock: 'space-y-3',
    sectionHeading: 'text-sm font-semibold uppercase tracking-wide text-pink-600',
    requirementsList: 'grid gap-2 text-[15px] text-slate-700 sm:grid-cols-2',
    requirementItem:
      'flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-2 ring-1 ring-slate-200',
    requirementIcon: 'h-4 w-4 flex-shrink-0 text-pink-600',
    benefitsList: 'grid gap-2 text-[15px] text-slate-700 sm:grid-cols-2',
    benefitsItem: 'flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-2 ring-1 ring-slate-200',
    benefitsIcon: 'h-4 w-4 flex-shrink-0 text-pink-600',
    benefitsTabContent: 'mt-5 space-y-4 text-[15px] leading-7 text-slate-700 sm:text-base',
    rightColWrapper: 'mx-auto h-full w-fit',
    rightCard:
      'flex h-full flex-col rounded-3xl bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/80 sm:p-5',
    coverWrapper: 'relative overflow-hidden rounded-2xl bg-slate-100',
    coverImage: 'h-auto w-auto object-contain',
    infoList: 'mt-4 space-y-3 text-sm text-slate-700',
    infoRow: 'flex items-start gap-2',
    infoIcon: 'mt-0.5 h-4 w-4 text-pink-600',
    infoLabel: 'text-xs font-semibold uppercase tracking-wide text-slate-500',
    infoValue: 'text-sm font-semibold text-blue-950',
    infoGrid: 'grid gap-3 sm:grid-cols-2',
  },
  applyPayment: {
    sectionWrapper: 'bg-slate-50/60 py-14 sm:py-16 md:py-20',
    container: 'mx-auto max-w-6xl px-6 lg:px-8',
    headerWrapper: 'mx-auto max-w-2xl text-center',
    headerSubtitle: 'mx-auto -mt-4 text-sm leading-relaxed text-slate-700 sm:text-base',
    cardsGrid: 'mt-8 grid gap-6 md:grid-cols-2',
    card: 'flex h-full flex-col rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.14)] ring-1 ring-slate-200/80',
    cardTitle: 'text-lg font-semibold text-blue-950 sm:text-xl',
    cardPrice: 'mt-1 text-sm font-semibold text-pink-600 sm:text-base',
    cardSubtitle: 'mt-1 text-xs text-slate-600 sm:text-sm',
    stagesList: 'mt-5 space-y-3 text-sm text-slate-800 sm:text-base',
    stageItem:
      'flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200',
    stageLabel: 'text-xs font-semibold uppercase tracking-[0.16em] text-pink-600',
    stageLabelMuted: 'text-xs font-semibold uppercase tracking-[0.16em] text-slate-700',
    stagePrice: 'text-sm font-semibold text-blue-950 sm:text-base',
    stagePriceSub: 'text-xs text-slate-600',
    footerWrapper:
      'mt-6 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center',
    footerNote: 'text-xs text-slate-600 sm:text-sm',
    footerNoteEmphasis: 'font-semibold',
    footerCta:
      'inline-flex items-center justify-center rounded-full bg-pink-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2',
  },
  applyPaymentMethods: {
    sectionWrapper: 'py-14 sm:py-16 md:py-20',
    container: 'mx-auto max-w-6xl px-6 lg:px-8',
    headerWrapper: 'mx-auto max-w-2xl text-center',
    headerSubtitle: 'mx-auto -mt-4 text-sm leading-relaxed text-slate-700 sm:text-base',
    cardsGrid: 'mt-8 grid gap-8 md:grid-cols-2',
    bankCard:
      'flex h-full flex-col rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.14)] ring-1 ring-slate-200/80',
    bankHeaderRow: 'flex items-center gap-3',
    bankIconCircle: 'flex h-9 w-9 items-center justify-center rounded-full bg-pink-50',
    bankIcon: 'h-4 w-4 text-pink-600',
    cardTitle: 'text-base font-semibold text-blue-950 sm:text-lg',
    cardSubtitle: 'text-xs text-slate-600 sm:text-sm',
    banksGrid: 'mt-5 grid grid-cols-2 gap-4',
    bankLogoCard:
      'flex h-16 items-center justify-center rounded-2xl bg-white ring-1 ring-slate-200',
    bankLogoImage: 'h-10 w-auto object-contain',
    intlCard:
      'flex h-full flex-col rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.14)] ring-1 ring-slate-200/80',
    intlHeaderRow: 'flex items-center gap-3',
    intlIconCircle: 'flex h-9 w-9 items-center justify-center rounded-full bg-blue-50',
    intlIcon: 'h-4 w-4 text-blue-700',
    paypalBox: 'mt-5 space-y-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200',
    paypalHeaderRow: 'flex items-center justify-between gap-4',
    paypalLogoCircle: 'flex items-center justify-center rounded-full bg-white h-12 w-12',
    paypalLogoImage: 'h-8 w-auto object-contain',
    paypalTitle: 'text-sm font-semibold text-blue-950 sm:text-base',
    paypalMeta: 'space-y-2 text-xs text-slate-700 sm:text-sm',
    paypalMetaRow: 'flex items-center justify-between gap-4',
    paypalMetaLabel: 'font-medium',
    paypalMetaValue: 'font-semibold text-blue-950',
    notesGrid: 'mt-4 grid gap-6 text-xs leading-relaxed text-slate-600 sm:grid-cols-2 sm:text-sm',
  },
  homeRegistration: {
    sectionWrapper: 'relative w-full bg-[#ffffff72] py-14 sm:py-16',
    introText: 'mx-auto -mt-6 mb-8 max-w-3xl text-center text-sm text-slate-600 sm:text-base',
    container: 'mx-auto max-w-7xl px-6 lg:px-8',
    mainGrid: 'mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1.1fr)]',
    cardsGrid: 'grid gap-6 lg:grid-cols-2',
    instagramCard:
      'overflow-hidden rounded-2xl bg-white shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-200',
    instagramHeader:
      'border-b border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500',
    instagramFooter: 'flex items-center justify-between px-4 py-3 text-xs text-slate-600',
    instagramLink: 'font-semibold text-accent hover:underline',
    guidePrimary:
      'inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
    guideSecondary:
      'inline-flex items-center justify-center rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-semibold text-pink-700 shadow-sm transition hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:ring-offset-2',
  },
  homeImportantPayment: {
    sectionWrapper: 'relative w-full bg-white py-14 sm:py-16',
    introText: 'mx-auto -mt-6 mb-10 max-w-3xl text-center text-sm text-slate-600 sm:text-base',
    card: 'flex h-full flex-col rounded-2xl bg-white p-5 shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-200',
    iconCircle:
      'mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-pink-600',
    cardTitle: 'text-base font-semibold text-slate-900',
    cardBody: 'mt-2 text-sm leading-relaxed text-slate-600',
    noteBar:
      'mt-8 flex items-center gap-3 rounded-xl bg-pink-50 px-4 py-3 text-xs text-slate-900 border-l-4 border-pink-400/80 shadow-[0_8px_30px_rgba(2,6,23,0.06)]',
    noteIcon: 'h-4 w-4 text-pink-500',
    noteEmphasis: 'font-semibold text-pink-700',
    infoSideWrapper: 'flex h-full items-stretch',
    infoSideCard:
      'flex w-full flex-col justify-between rounded-3xl bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.15)] ring-1 ring-slate-200/80 sm:p-7',
    infoTitle: 'text-lg font-extrabold text-blue-950',
    infoIntro: 'mt-2 text-sm text-slate-700',
    infoPointsWrapper: 'mt-5 space-y-4 text-sm text-slate-800',
    infoPointRow: 'flex gap-3',
    infoPointIcon: 'mt-1 text-pink-600',
    infoPointTitle: 'text-sm font-semibold text-blue-950',
    infoPointBody: 'text-xs text-slate-600',
    infoFooter: 'mt-6 border-t border-slate-200 pt-4 text-xs text-slate-500',
  },
  programsTestimonialsGrid: {
    sectionWrapper: 'px-6 py-12 sm:py-14 md:py-16 lg:px-8',
    container: 'mx-auto max-w-7xl',
    grid: 'grid gap-6 md:grid-cols-2 lg:grid-cols-3',
    card: 'rounded-2xl bg-white p-5 shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-200 transition will-change-transform hover:-translate-y-0.5 hover:shadow-[0_16px_60px_rgba(2,6,23,0.12)] hover:ring-pink-200',
    cardInnerRow: 'flex items-start gap-4',
    avatarImg: 'h-12 w-12 rounded-full object-cover ring-2 ring-white',
    contentCol: 'flex-1',
    headerRow: 'flex flex-wrap items-center gap-2',
    name: 'text-lg font-extrabold text-blue-900',
    countryChip:
      'inline-flex items-center gap-1 rounded-full bg-pink-50 px-2 py-1 text-[11px] font-semibold text-pink-700 ring-1 ring-pink-200',
    yearPill:
      'inline-flex items-center rounded-full bg-pink-600 px-2 py-1 text-[11px] font-semibold text-white',
    flagEmoji: 'text-base leading-none',
    quote: 'mt-3 text-sm leading-6 text-slate-700',
    readMoreButton:
      'mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800',
    readMoreIcon: 'h-4 w-4 transition-transform',
    divider: 'my-4 h-px w-full bg-slate-200',
    metaRow: 'flex items-center justify-between',
    roleText: 'text-sm text-slate-600',
    starsWrapper: 'flex items-center gap-0.5 text-pink-500',
    starFilled: 'h-4 w-4 fill-pink-500 stroke-pink-600',
    starEmpty: 'h-4 w-4 stroke-pink-300',
  },
  programsTestimonialsImpact: {
    sectionWrapper: 'px-6 pb-12 sm:pb-14 md:pb-16 lg:px-8',
    container: 'mx-auto max-w-7xl',
    grid: 'grid gap-5 sm:grid-cols-2 lg:grid-cols-4',
    card: 'group rounded-2xl bg-white p-5 text-center shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-[0_16px_60px_rgba(2,6,23,0.12)] hover:ring-pink-200',
    iconCircle:
      'mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full bg-pink-600 text-white transition group-hover:bg-pink-700',
    icon: 'h-5 w-5',
    value: 'text-2xl font-extrabold text-blue-900',
    label: 'text-xs font-semibold uppercase tracking-wide text-pink-600',
  },
  ctaCard: {
    card: "relative flex w-full max-w-md flex-col items-center justify-center overflow-hidden rounded-2xl bg-[url('/img/bgourprogram.png')] bg-cover bg-center p-10 shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-pink-100 transition hover:-translate-y-0.5 hover:shadow-[0_16px_60px_rgba(2,6,23,0.12)] hover:ring-pink-200",
    iconCircle: 'mb-3 grid h-16 w-16 place-items-center rounded-full bg-pink-600 text-white shadow',
  },
  partnersOpportunities: {
    sectionWrapper: 'relative w-full py-16 sm:py-20',
    container: 'mx-auto max-w-7xl px-6 lg:px-8',
    subtitle: 'mx-auto -mt-6 mb-8 max-w-2xl text-center text-sm text-slate-600 sm:mb-10',
    grid: 'mx-auto grid max-w-5xl gap-6 md:grid-cols-3',
    communityCard:
      'group flex h-full flex-col overflow-hidden rounded-2xl bg-gradient-to-t from-blue-50 to-white shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-2 ring-blue-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_60px_rgba(2,6,23,0.12)]',
    silverCard:
      'group flex h-full flex-col overflow-hidden rounded-2xl bg-gradient-to-t from-slate-50 to-white shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-2 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_60px_rgba(2,6,23,0.12)]',
    goldCard:
      'group flex h-full flex-col overflow-hidden rounded-2xl bg-gradient-to-t from-amber-50 to-white shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-2 ring-amber-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_60px_rgba(2,6,23,0.12)]',
    diamondCard:
      'group flex h-full flex-col overflow-hidden rounded-2xl bg-gradient-to-t from-pink-50 to-white shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-2 ring-pink-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_60px_rgba(2,6,23,0.12)]',
    cardBody: 'p-5',
    title: 'text-xl font-extrabold text-blue-900',
    description: 'mt-1 text-sm leading-6 text-slate-700',
    priceLabel: 'mt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500',
    priceValue: 'text-sm font-semibold text-slate-700',
    benefitsList: 'flex flex-1 flex-col p-5 pt-0',
    benefitItemBase:
      'flex items-center gap-3 py-3 transition-colors duration-200 hover:bg-slate-50',
    benefitItemBordered: 'border-b border-slate-200',
    checkCircle:
      'grid h-7 w-7 shrink-0 place-items-center rounded-full bg-pink-600 text-white',
    checkIcon: 'h-4 w-4',
    benefitLabel: 'text-sm font-medium text-blue-950',
    affiliateSubheading: 'pb-1 text-sm font-extrabold text-blue-950',
    affiliateSubheadingSpaced: 'pt-4 pb-1 text-sm font-extrabold text-blue-950',
    popularChip:
      'rounded-full bg-pink-50 px-2 py-0.5 text-xs font-semibold text-pink-700 ring-1 ring-pink-200',
    cardFooter: 'p-5 pt-0',
    communityCta:
      'inline-flex w-full items-center justify-center rounded-md bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2',
    silverCta:
      'inline-flex w-full items-center justify-center rounded-md bg-slate-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2',
    goldCta:
      'inline-flex w-full items-center justify-center rounded-md bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2',
    diamondCta:
      'inline-flex w-full items-center justify-center rounded-md bg-pink-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2',
  },
  partnersCommunity: {
    sectionWrapper:
      "relative w-full bg-[url('/img/sebelumfooter.png')] bg-cover bg-center px-6 py-12 sm:py-14 md:py-16 lg:px-8",
    container: 'mx-auto max-w-7xl',
    listWrapper: 'flex flex-wrap justify-center gap-6',
    card: 'group w-[340px] sm:w-[360px] flex items-start gap-4 rounded-2xl bg-white p-5 shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-[0_16px_60px_rgba(2,6,23,0.12)] focus:outline-none focus:ring-2 focus:ring-pink-300',
    logoImg: 'h-12 w-12 rounded bg-white object-contain p-1.5 ring-1 ring-slate-200',
    orgName: 'font-extrabold text-blue-900',
    pinkChip:
      'mt-1 inline-block rounded-full bg-pink-50 px-2.5 py-0.5 text-xs font-semibold text-pink-700 ring-1 ring-pink-200',
    academicChip:
      'mt-1 inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-200',
    innovationChip:
      'mt-1 inline-block rounded-full bg-fuchsia-50 px-2.5 py-0.5 text-xs font-semibold text-fuchsia-700 ring-1 ring-fuchsia-200',
    mediaChip:
      'mt-1 inline-block rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200',
    businessChip:
      'mt-1 inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200',
    culturalChip:
      'mt-1 inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200',
  },
  partnersDetail: {
    sectionWrapper: 'px-6 py-12 sm:py-14 md:py-16 lg:px-8 bg-white',
    container: 'mx-auto max-w-5xl',
    card:
      'relative overflow-hidden rounded-3xl bg-white p-6 shadow-[0_14px_45px_rgba(15,23,42,0.12)] ring-1 ring-slate-200 sm:p-8',
    headerRow: 'relative z-10 mb-4 flex items-baseline justify-between gap-4',
    title: 'text-lg font-extrabold text-blue-900 sm:text-xl',
    bestForLabel: 'mt-1 text-sm text-slate-600',
    priceText: 'relative z-10 text-xl font-extrabold text-[#5C3BFF] whitespace-nowrap sm:text-2xl',
    bodyGrid: 'relative z-10 mt-3 grid gap-2 text-sm text-slate-700',
    bulletRow: 'flex items-start gap-2',
    bulletIcon: 'mt-0.5 h-4 w-4 text-emerald-500',
    bulletText: 'text-sm text-slate-700',
    // Right-side gradient overlay behind price & bullets
    // Slightly wider so color is more visible
    gradientRightBase:
      'pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l to-transparent z-0',
    // Match hues with partnersOpportunities card backgrounds but a bit stronger
    // communityCard: bg-gradient-to-t from-blue-50 to-white
    gradientRightCommunity: 'from-blue-100 via-blue-50',
    // silverCard: bg-gradient-to-t from-slate-50 to-white
    gradientRightSilver: 'from-slate-100 via-slate-50',
    // goldCard: bg-gradient-to-t from-amber-50 to-white
    gradientRightGold: 'from-amber-100 via-amber-50',
    // diamondCard: bg-gradient-to-t from-pink-50 to-white
    gradientRightDiamond: 'from-pink-100 via-pink-50',
  },
  programDetail: {
    // Hero section
    mainWrapper: 'relative',
    heroSection: 'relative overflow-hidden bg-cover bg-center',
    heroInner:
      'mx-auto flex min-h-[360px] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center text-white sm:min-h-[420px] sm:py-28 md:py-32 lg:px-8',
    heroYearText: 'text-base font-semibold uppercase tracking-wide text-white/90',
    heroTitle: 'mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl',
    heroTagline: 'mt-3 text-lg font-semibold text-white/90 sm:text-xl',
    heroCtaWrapper: 'mt-6',
    heroBlurPrimary:
      'pointer-events-none absolute -right-24 -top-24 h-[24rem] w-[24rem] rounded-full bg-white/10 blur-3xl md:h-[28rem] md:w-[28rem]',
    heroBlurSecondary:
      'pointer-events-none absolute -right-40 top-24 h-[16rem] w-[16rem] rounded-full bg-white/5 blur-2xl md:h-[18rem] md:w-[18rem]',
    heroCta:
      'inline-flex items-center justify-center rounded-lg bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700',
    heroCtaClosed:
      'inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white/80',
    // Info strip section
    infoStripSection: 'relative w-full overflow-hidden bg-[#1c57b3] text-white',
    infoStripBlurPrimary:
      'pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/15 blur-3xl',
    infoStripBlurSecondary:
      'pointer-events-none absolute -right-24 top-1/3 h-80 w-80 -translate-y-1/2 rounded-full bg-white/10 blur-3xl',
    infoStripBlurTertiary:
      'pointer-events-none absolute -bottom-28 left-1/3 h-48 w-48 rotate-12 rounded-xl bg-white/10 blur-2xl',
    infoStripContainer: 'mx-auto max-w-7xl px-6 py-14 lg:px-8',
    infoStripGrid: 'grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4',
    infoStripItem: 'flex items-start gap-6 lg:border-r lg:border-blue-800/60 lg:px-6',
    infoStripIconCircle:
      'flex aspect-square h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-pink-500/80 bg-white/5',
    infoStripSubtitle: 'text-sm font-semibold uppercase tracking-wider text-pink-400',
    infoStripValue: 'mt-1 text-2xl font-extrabold leading-tight',
    infoStripIcon: 'h-5 w-5 text-pink-400',
    // Guidelines section
    guidelinesSection: 'relative bg-white',
    guidelinesContainer: 'mx-auto max-w-7xl px-6 py-16 lg:px-8',
    guidelinesCard:
      "mx-auto max-w-3xl overflow-hidden rounded-2xl bg-[url('/img/bgourprogram.png')] bg-cover bg-center bg-blend-multiply ring-1 ring-gray-200",
    guidelinesBody: 'p-6 text-center sm:p-8',
    guidelinesIconCircle:
      'mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-pink-500/80 bg-pink-50',
    guidelinesIcon: 'h-5 w-5 text-pink-600',
    guidelinesButton:
      'inline-flex items-center justify-center gap-2 rounded-lg bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700',
    guidelinesText: 'text-base leading-7 text-gray-600',
    guidelinesCtaWrapper: 'mt-6 flex justify-center',
    guidelinesDownloadIcon: 'h-4 w-4',
    // Overview + Application section
    overviewSection: 'relative bg-[#eef5ff]',
    overviewContainer: 'mx-auto max-w-7xl px-6 py-16 lg:px-8',
    overviewGrid: 'grid gap-6 lg:grid-cols-2',
    overviewCard: 'overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200',
    overviewInner: 'flex items-start gap-4 p-6 sm:p-8',
    overviewIconCircle:
      'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-pink-500/80 bg-pink-50',
    overviewIcon: 'h-5 w-5 text-pink-600',
    overviewContent: 'text-gray-700',
    overviewText: 'leading-7',
    overviewList: 'mt-4 space-y-3',
    overviewListItem: 'flex items-start gap-3',
    overviewBulletIcon:
      'inline-flex aspect-square h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pink-600 text-white',
    overviewBulletIconAlt:
      'inline-flex aspect-square h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pink-600 text-white',
    overviewHighlightText: 'font-semibold',
    overviewCheckIcon: 'h-4 w-4',
    applicationPrimaryCta:
      'inline-flex items-center justify-center rounded-lg bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700',
    applicationSecondaryCta:
      'inline-flex items-center justify-center rounded-lg border border-gray-300 bg-gray-50 px-5 py-2.5 text-sm font-semibold text-gray-500',
    applicationCard: 'overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200',
    applicationImageWrapper: 'relative aspect-[16/9]',
    applicationImage: 'object-cover',
    applicationBody: 'p-6 text-center sm:p-8',
    applicationTitle: 'text-xl font-extrabold text-blue-950 sm:text-2xl',
    applicationSubtitle: 'mt-2 text-sm text-gray-600',
    applicationCtaWrapper: 'mt-6',
  },
  galleryOtherPrograms: {
    subtitle: '-mt-6 mb-8 text-center text-sm text-pink-600 sm:text-base',
    cardTitle: 'text-base font-extrabold text-blue-950 group-hover:text-pink-700 sm:text-lg',
    visitChip:
      'inline-flex items-center gap-1 rounded-md border border-pink-200 px-3 py-2 text-xs font-semibold text-pink-700 transition group-hover:border-pink-300',
  },
  programRundowns: {
    tabButton:
      'relative px-4 py-5 text-center text-base font-extrabold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 sm:px-6 sm:text-lg',
    tabLabelIcon: 'h-4 w-4 text-pink-600',
    tabActiveUnderline: 'absolute inset-x-0 bottom-0 block h-0.5 bg-pink-600',
    noteIcon: 'mt-0.5 h-5 w-5 flex-shrink-0 text-pink-600',
  },
  programFAQ: {
    sectionWrapper: 'bg-[#eef5ff] px-6 py-12 sm:py-14 md:py-16 lg:px-8',
    container: 'mx-auto max-w-7xl',
    tabsCard: 'mx-auto mt-2 w-full overflow-hidden rounded-2xl border border-blue-100 bg-white',
    tabsGrid: 'grid grid-cols-3',
    tabButton:
      'relative px-4 py-5 text-center text-base font-extrabold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 sm:px-6 sm:text-lg',
    tabInactive:
      'text-blue-900/70 hover:bg-pink-50 hover:text-blue-950 hover:shadow-sm hover:ring-1 hover:ring-pink-200',
    tabActiveUnderline: 'absolute inset-y-3 left-0 block w-0.5 rounded-full bg-pink-600',
    tabLabelInner: 'inline-flex items-center justify-center gap-2',
    tabLabelIcon: 'h-4 w-4 text-pink-600',
    tabDivider: 'absolute inset-y-3 right-0 hidden w-px bg-blue-100 last:hidden sm:block',
    faqListWrapper: 'mt-6 space-y-3',
    faqCard: 'overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200',
    faqHeaderButton: 'flex w-full items-center justify-between gap-3 px-5 py-4 text-left',
    faqQuestion: 'text-base font-extrabold text-blue-950',
    faqChevron: 'h-5 w-5 text-slate-500 transition-transform',
    faqBody: 'px-5 pb-5 pt-0',
    faqAnswer: 'text-sm leading-6 text-slate-700',
  },
  furtherInfoPrograms: {
    sectionWrapper: 'relative w-full py-20 sm:py-28',
    card: 'mx-auto flex max-w-7xl items-center px-6 sm:px-10 lg:px-16',
    innerGrid:
      'grid w-full items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)] lg:gap-12',
    leftCol:
      'order-2 flex w-full max-w-xl flex-col justify-center space-y-4 text-blue-950 lg:order-1 lg:pr-6',
    description: 'mt-3 max-w-md text-sm leading-relaxed text-blue-950/90 sm:text-base lg:text-lg',
    buttonsCol: 'mt-4 flex flex-col items-start gap-3',
    guideButtonBase:
      'inline-flex items-center justify-center gap-2 rounded-full border-2 px-4 py-2.5 text-sm font-semibold shadow-sm transition',
    guideButtonPrimary: 'border-pink-500/80 bg-white/95 text-pink-700 hover:bg-white',
    guideButtonSecondary: 'border-blue-500/70 bg-blue-50/90 text-blue-800 hover:bg-blue-100',
    flagCircle: 'inline-flex h-5 w-5 items-center justify-center overflow-hidden rounded-full',
    rightCol: 'order-1 relative flex w-full justify-center lg:order-2',
    mockupWrapper:
      'relative h-80 w-full max-w-xs -mt-6 sm:h-96 sm:max-w-sm lg:h-[420px] lg:max-w-md lg:-mt-10 drop-shadow-[0_26px_70px_rgba(15,23,42,0.65)]',
  },
  applyEarlyBidCta: {
    sectionWrapper:
      "relative w-full overflow-hidden bg-[url('/img/ctabekground.png')] bg-cover bg-center bg-no-repeat py-12 text-[#172554] sm:py-16 lg:py-20",
    blurTop:
      'pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl',
    blurMiddle:
      'pointer-events-none absolute -right-24 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-white/10 blur-3xl',
    blurBottom:
      'bg-accent/20 pointer-events-none absolute bottom-0 left-1/4 h-32 w-32 rounded-full blur-2xl',
    container:
      'relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-6 lg:grid-cols-2 lg:gap-10 lg:px-8',

    // kiri
    leftCol: 'relative z-10',
    title: 'text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl',
    subtitle: 'mt-4 max-w-xl text-blue-950-200',
    statsRow: 'mt-7 flex items-center gap-8 text-blue-950-200',
    statGroup: 'flex items-center gap-3',
    statIconCircle: 'flex h-11 w-11 items-center justify-center rounded-full bg-white',
    statIcon: 'h-5 w-5 text-blue-950',
    statValue: 'text-3xl font-extrabold leading-tight text-blue-950',
    statLabel: 'text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-950',
    statsDivider: 'h-11 w-px bg-white/60',

    // kanan
    rightCol: 'relative z-10 flex flex-col',
    countdownCard:
      'rounded-2xl bg-white/95 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.45)] ring-1 ring-slate-200/70',
    countdownEyebrow: 'text-xs font-semibold uppercase tracking-[0.18em] text-pink-600',
    countdownGrid: 'mt-5 grid grid-cols-4 gap-2 sm:gap-3',
    countdownItem:
      'flex flex-col items-center justify-center rounded-2xl bg-slate-50 px-2 py-3 ring-1 ring-slate-200',
    countdownValue: 'text-lg font-extrabold tracking-tight text-blue-950 sm:text-2xl',
    countdownLabel:
      'mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-[11px]',
    note: 'mt-4 text-center text-[11px] text-slate-500 sm:text-xs',
  },
  dashboardDocuments: {
    sectionWrapper: 'space-y-6',
    tabsWrapper:
      'inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 text-sm font-medium text-slate-600',
    tabButton:
      'rounded-full px-4 py-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50',
    tabButtonActive: 'bg-white text-pink-700 shadow-sm',
    tabButtonInactive: 'text-slate-600 hover:text-slate-900 hover:bg-white/60',
    tableCard:
      'overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200',
    tableHeader:
      'items-center gap-4 bg-pink-600 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white',
    tableHeaderSortButton: 'flex items-center gap-1 text-left',
    tableHeaderSortButtonRight: 'ml-auto flex items-center gap-1 text-right',
    tableHeaderSortIcon: 'text-[10px] leading-none',
    tableBody: 'divide-y divide-slate-100 bg-white',
    tableRow:
      'items-center gap-4 px-6 py-3 text-sm text-slate-700 hover:bg-slate-50/80',
    docNameCell: 'truncate font-semibold text-slate-900',
    docDescriptionCell: 'truncate text-slate-600',
    docTypeCell: 'text-slate-700',
    actionCell: 'flex justify-end',
    downloadButton:
      'inline-flex items-center gap-1 rounded-full bg-pink-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-pink-700',
    emptyStateWrapper:
      'flex min-h-[260px] flex-col items-center justify-center bg-slate-50 px-6 py-10 text-center',
    emptyStateImageWrapper: 'mb-4 flex items-center justify-center',
    emptyStateTitle: 'text-base font-extrabold text-slate-900',
    emptyStateText: 'mt-1 max-w-md text-sm text-slate-600',
    certificatesSectionWrapper: 'space-y-4 pt-4',
    certificatesTitle:
      'text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl',
    certificatesSubtitle:
      'mt-1 max-w-2xl text-xs text-slate-500 sm:text-sm',
    statusBadgeBase:
      'inline-flex rounded-full px-3 py-0.5 text-xs font-semibold ring-1',
    statusApproved: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    statusOngoing: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
    statusDefault: 'bg-slate-50 text-slate-700 ring-slate-200',
  },
  dashboardPayments: {
    sectionWrapper: 'space-y-6',
    summaryGrid: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4',
    summaryCardBase: 'flex flex-col justify-between rounded-2xl p-4 text-sm shadow-sm',
    summaryCompleteCard: 'border border-emerald-100 bg-emerald-50/60',
    summaryPendingCard: 'border border-amber-100 bg-amber-50/70',
    summaryOverdueCard: 'border border-rose-100 bg-rose-50/70',
    summaryTotalCard: 'border border-slate-200 bg-slate-50',
    summaryCardInner: 'flex items-center justify-between gap-3',
    summaryEyebrow: 'text-xs font-semibold uppercase tracking-wide',
    summaryCompleteEyebrow: 'text-emerald-700',
    summaryPendingEyebrow: 'text-amber-700',
    summaryOverdueEyebrow: 'text-rose-700',
    summaryTotalEyebrow: 'text-slate-600',
    summaryValue: 'mt-1 text-2xl font-extrabold',
    summaryCompleteValue: 'text-emerald-900',
    summaryPendingValue: 'text-amber-900',
    summaryOverdueValue: 'text-rose-900',
    summaryTotalValue: 'text-slate-900',
    summaryIconCircle: 'flex h-9 w-9 items-center justify-center rounded-full text-white shadow-sm',
    summaryCompleteIconCircle: 'bg-emerald-600',
    summaryPendingIconCircle: 'bg-amber-500',
    summaryOverdueIconCircle: 'bg-rose-500',
    summaryTotalIconCircle: 'bg-slate-800',

    categoryCard:
      'rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]',
    categoryHeader: 'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
    categoryTitle: 'text-sm font-extrabold uppercase tracking-wide text-slate-700',
    categoryBodyText: 'space-y-1 text-sm text-slate-700',
    categoryLabel: 'font-semibold text-slate-800',
    categoryPill:
      'inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100',
    categoryPillIcon: 'h-4 w-4',
    categoryStatusText: 'text-base font-extrabold text-emerald-700',
    categoryDescription: 'text-xs leading-relaxed text-slate-600',
    categoryBulletList: 'mt-1 space-y-1 text-sm text-slate-700',
    categoryBulletItem: 'flex items-start gap-2',
    categoryBulletIconBase:
      'mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ring-1',
    categoryBulletIconPrimary:
      'bg-emerald-50 text-emerald-600 ring-emerald-100',
    categoryBulletIconSecondary:
      'bg-pink-50 text-pink-600 ring-pink-100',
    categoryBulletIconTertiary:
      'bg-violet-50 text-violet-600 ring-violet-100',
    categoryBulletIconInner: 'h-3 w-3',
    categoryPrimaryCta:
      'inline-flex items-center gap-2 rounded-full bg-pink-600 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2',

    tableCard:
      'rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]',
    tableHeaderRow:
      'mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
    tableTitle: 'text-sm font-extrabold uppercase tracking-wide text-slate-700',
    tableSubtitle: 'mt-1 text-xs text-slate-500',
    tableControlsWrapper: 'flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4',
    tableShowWrapper: 'flex items-center gap-2 text-xs text-slate-600',
    tableShowSelect:
      'h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-pink-500',
    tableSearchWrapper:
      'flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600',
    tableSearchInput:
      'w-40 border-none bg-transparent text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0 sm:w-52',

    tableOuter: 'overflow-x-auto',
    table: 'min-w-full text-left text-sm',
    tableHeadRow: 'bg-pink-600 text-xs font-semibold uppercase tracking-wide text-white',
    tableHeadCell: 'px-4 py-3',
    tableHeadCellRight: 'px-4 py-3 text-right',
    tableBody: 'divide-y divide-slate-100 bg-white text-slate-800',
    tableRow: '',
    paymentInfoCell: 'px-4 py-3 text-sm font-medium text-slate-900',
    statusCell: 'px-4 py-3',
    periodCell: 'px-4 py-3 text-sm text-slate-700',
    amountCell: 'px-4 py-3 text-sm font-semibold text-slate-900',
    syncDateCell: 'px-4 py-3 text-sm text-slate-700',
    actionsCell: 'px-4 py-3 text-right',
    statusBadgeBase:
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1',
    statusBadgePaid: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    statusBadgeUnpaid: 'bg-rose-50 text-rose-700 ring-rose-200',
    actionsWrapper: 'inline-flex items-center gap-2',
    primaryIconButton:
      'inline-flex h-7 w-7 items-center justify-center rounded-md border border-pink-600 bg-pink-600 text-slate-50 shadow-sm transition hover:bg-pink-700',
    secondaryIconButton:
      'inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-700 shadow-sm transition hover:bg-slate-100',
    tertiaryIconButton:
      'inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50',
    tableFooterText: 'mt-3 text-xs text-slate-500',
  },
  dashboardOverview: {
    sectionWrapper: 'space-y-6',

    // top summary
    summaryGrid: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4',
    summaryCardBase: 'flex flex-col justify-between rounded-2xl p-4 text-sm shadow-sm',
    summaryCompleteCard: 'border border-emerald-100 bg-emerald-50/60',
    summaryPendingCard: 'border border-amber-100 bg-amber-50/70',
    summaryOverdueCard: 'border border-rose-100 bg-rose-50/70',
    summaryTotalCard: 'border border-slate-200 bg-slate-50',
    summaryInnerRow: 'flex items-center justify-between gap-3',
    summaryEyebrowBase: 'text-xs font-semibold uppercase tracking-wide',
    summaryEyebrowComplete: 'text-emerald-700',
    summaryEyebrowPending: 'text-amber-700',
    summaryEyebrowOverdue: 'text-rose-700',
    summaryEyebrowTotal: 'text-slate-600',
    summaryValueBase: 'mt-1 text-2xl font-extrabold',
    summaryValueComplete: 'text-emerald-900',
    summaryValuePending: 'text-amber-900',
    summaryValueOverdue: 'text-rose-900',
    summaryValueTotal: 'text-slate-900',
    summaryIconCircleBase:
      'flex h-9 w-9 items-center justify-center rounded-full text-white shadow-sm',
    summaryIconCircleComplete: 'bg-emerald-600',
    summaryIconCirclePending: 'bg-amber-500',
    summaryIconCircleOverdue: 'bg-rose-500',
    summaryIconCircleTotal: 'bg-slate-800',

    // main grid
    mainGrid:
      'grid gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]',
    leftColumnWrapper: 'space-y-6',

    // registration card
    registrationCard:
      'rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]',
    registrationIconCircle:
      'flex h-11 w-11 items-center justify-center rounded-full bg-pink-50 text-pink-600 ring-1 ring-pink-200',
    registrationBodyWrapper: 'flex-1 space-y-3',
    registrationHeaderRow:
      'flex flex-wrap items-baseline justify-between gap-3',
    registrationTitle:
      'text-sm font-extrabold uppercase tracking-wide text-slate-700',
    registrationSubtitle:
      'mt-1 text-xs font-semibold uppercase tracking-wide text-pink-600',
    registrationDescription:
      'text-sm leading-relaxed text-slate-700',
    registrationFooterRow:
      'mt-3 flex flex-col items-start gap-3 border-t border-slate-100 pt-3 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between',
    registrationSwitchIconCircle:
      'mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500',
    registrationSwitchText:
      'max-w-xl text-xs leading-relaxed text-slate-700 sm:text-sm',
    registrationSwitchButton:
      'inline-flex items-center gap-2 rounded-full bg-pink-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2',

    // program details
    programCard:
      'rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]',
    programHeaderRow: 'mb-4 flex items-center justify-between gap-3',
    programTitle:
      'text-sm font-extrabold uppercase tracking-wide text-slate-700',
    programSubtitle: 'mt-1 text-xs text-slate-500',
    programGrid: 'grid gap-4 md:grid-cols-2',

    // progress timeline (Your Progress)
    progressTimeline:
      'mt-4 grid grid-cols-[auto,1fr] gap-x-4 sm:gap-x-5',
    progressLineCol: 'relative col-span-1 row-span-full',
    progressLine:
      'mx-auto h-full w-px bg-gradient-to-b from-pink-400 via-pink-200 to-transparent',
    progressStepsCol:
      'space-y-4 max-h-64 overflow-y-auto pr-1',
    progressStepRow: 'grid grid-cols-[auto,1fr] gap-x-3 gap-y-1',
    progressStepIconCol: 'relative col-span-1 flex flex-col items-center',
    progressStepIndexCircleBase:
      'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white shadow-sm',
    progressStepIndexDone: 'bg-pink-600',
    progressStepIndexCurrent: 'bg-blue-700',
    progressStepIndexUpcoming: 'bg-slate-300',
    progressStepConnector:
      'mt-1 h-full w-px flex-1 bg-slate-200',
    progressStepContent: 'col-span-1 space-y-1 text-sm',
    progressStepTitle: 'text-sm font-semibold text-slate-900',
    progressStepBody: 'text-xs leading-relaxed text-slate-600',
    progressStatusChipBase:
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1',
    progressStatusChipDone:
      'bg-pink-50 text-pink-700 ring-pink-200',
    progressStatusChipWaiting:
      'bg-amber-50 text-amber-700 ring-amber-200',
    progressStatusChipUpcoming:
      'bg-slate-50 text-slate-700 ring-slate-200',

    programSelfCard:
      'flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm',
    programSelfInner: 'space-y-3',
    programSelfHeaderRow: 'flex items-start gap-3',
    programSelfIconCircle:
      'mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100',
    programSelfTitle: 'text-base font-semibold text-slate-900',
    programSelfSubtitle: 'text-xs font-medium text-slate-500',
    programSelfSectionLabel:
      'text-xs font-semibold uppercase tracking-wide text-slate-600',
    programSelfBenefitList: 'space-y-1 text-sm text-slate-700',
    programSelfBenefitItem: 'flex items-start gap-2',
    programSelfBenefitIcon:
      'mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500',
    programSelfPaymentText: 'mt-1 text-sm text-slate-700',

    programFullyCard:
      'flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-violet-50/80 p-4 text-sm',
    programFullyInner: 'space-y-3',
    programFullyHeaderRow: 'flex items-start gap-3',
    programFullyIconCircle:
      'mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-700 ring-1 ring-violet-200',
    programFullyTitle: 'text-base font-semibold text-slate-900',
    programFullySubtitle: 'text-xs font-medium text-slate-500',
    programFullySectionLabel:
      'text-xs font-semibold uppercase tracking-wide text-slate-600',
    programFullyBenefitList: 'space-y-1 text-sm text-slate-700',
    programFullyBenefitItem: 'flex items-start gap-2',
    programFullyBenefitIcon:
      'mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500',
    programFullyPaymentText: 'mt-1 text-sm text-slate-700',

    // guidebook aside
    guideAside:
      'relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900/5 p-5 shadow-[0_10px_35px_rgba(15,23,42,0.12)]',
    guideInner: 'relative flex flex-col gap-3',
    guideHeaderWrapper: 'space-y-2',
    guideEyebrow:
      'text-xs font-semibold uppercase tracking-wide text-pink-600',
    guideTitle: 'text-base font-extrabold text-slate-900',
    guideBodyText: 'text-xs leading-relaxed text-slate-700',
    guideLinksWrapper: 'space-y-2',
    guideLink:
      'flex items-center justify-between gap-2 rounded-full border border-pink-600/80 bg-transparent px-3 py-2 text-xs font-semibold text-pink-700 shadow-sm transition hover:border-pink-700 hover:text-pink-800',
    guideLeftLinkInner: 'inline-flex items-center gap-2',
    guideBadgeCircle:
      'flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white shadow-sm',
    guideBadgeText: 'leading-none',
    guideFileType:
      'text-[10px] font-semibold uppercase tracking-wide text-pink-600',

    // notification alert
    notificationCard:
      'rounded-2xl border border-amber-200 bg-amber-50/80 p-4 shadow-[0_8px_26px_rgba(251,191,36,0.3)]',
    notificationRow:
      'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
    notificationLeftRow: 'flex items-start gap-3',
    notificationIconCircle:
      'mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-amber-600 shadow-sm ring-2 ring-amber-200',
    notificationTextWrapper: 'space-y-1',
    notificationTitleRow:
      'flex flex-wrap items-baseline gap-2',
    notificationEyebrow:
      'text-xs font-semibold uppercase tracking-wide text-amber-700',
    notificationStatusPill:
      'inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-800',
    notificationBodyText:
      'max-w-2xl text-xs leading-relaxed text-amber-900 sm:text-sm',
    notificationButton:
      'inline-flex items-center justify-center gap-2 rounded-full bg-pink-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2',
  },
  dashboardSubmission: {
    sectionWrapper: 'space-y-6 text-sm',

    // read-only profile header
    profileCard:
      'rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
    profileRow: 'flex flex-col gap-6 md:flex-row md:items-center md:justify-between',
    profileLeft: 'flex items-start gap-5',
    profileAvatarWrapper: 'relative h-20 w-20',
    profileAvatarInner:
      'absolute inset-0 overflow-hidden rounded-full bg-pink-600 shadow-lg ring-4 ring-pink-100',
    profileAvatarImage: 'object-cover',
    profileAvatarButton:
      'absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-pink-600 shadow-md ring-1 ring-pink-100',
    profileName: 'text-lg font-extrabold text-slate-900',
    profileRole: 'text-[11px] font-semibold uppercase tracking-wide text-pink-600',
    profileMeta: 'text-xs text-slate-600',
    profileMetaLabel: 'font-semibold text-slate-700',
    profileRightWrapper: 'max-w-md text-xs text-slate-600 md:text-right',
    profileRightLabel:
      'text-[11px] font-semibold uppercase tracking-wide text-slate-500',
    profileRightText: 'mt-1 leading-relaxed text-slate-700',

    // read-only tabs
    tabsWrapper: 'flex flex-wrap items-center gap-2',
    tabButtonBase:
      'rounded-full px-4 py-1.5 text-xs font-semibold transition ring-1',
    tabButtonActive: 'bg-pink-600 text-white shadow-sm ring-pink-500',
    tabButtonInactive:
      'bg-white/70 text-slate-700 ring-slate-200 hover:bg-white',

    // read-only sections
    readSectionWrapper: 'space-y-4',
    readSectionHeader:
      'flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-slate-700',
    readSectionIconCircle:
      'inline-flex h-6 w-6 items-center justify-center rounded-full bg-pink-50 text-pink-600',
    readSectionTitle: '',
    readSectionSubtitle: 'mt-1 text-xs text-slate-500',
    readGrid: 'grid gap-4 md:grid-cols-2',
    readFieldLabelWrapper: 'space-y-1 text-xs font-medium text-slate-700',
    readFieldLabelText:
      'block text-[11px] font-semibold uppercase tracking-wide text-slate-500',
    readInputBase:
      'w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 read-only:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-800 disabled:opacity-100',
    readInputWrapper:
      'relative',
    readInputIcon:
      'pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400',

    // edit: stepper
    editSectionWrapper: 'space-y-6 text-sm',
    stepperCard:
      'rounded-2xl border border-slate-200 bg-white px-8 py-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)]',
    stepperRow:
      'flex flex-col gap-6 md:flex-row md:items-center md:justify-between',
    stepperButtonBase:
      'flex flex-1 flex-col items-center gap-2 text-xs focus:outline-none',
    stepperButtonLocked: 'cursor-not-allowed opacity-60',
    stepperPillRow: 'flex items-center gap-3',
    stepperCircle:
      'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition',
    stepperCircleActive: 'bg-pink-600 text-white shadow-md',
    stepperCircleDone: 'bg-emerald-600 text-white',
    stepperCircleIdle: 'bg-slate-300 text-white',
    stepperConnectorWrapper:
      'hidden h-[2px] w-16 overflow-hidden rounded-full bg-slate-200 md:block',
    stepperConnectorBar: 'h-full rounded-full transition-all',
    stepperConnectorDone: 'w-full bg-pink-500',
    stepperConnectorActive: 'w-1/2 bg-pink-400',
    stepperConnectorIdle: 'w-0',
    stepperTextWrapper: 'space-y-1 text-center',
    stepperStepTitle:
      'text-[11px] font-semibold uppercase tracking-wide text-slate-800',
    stepperStatusPill:
      'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
    stepperStatusActive: 'bg-pink-50 text-pink-600',
    stepperStatusDone: 'bg-emerald-50 text-emerald-600',
    stepperStatusIdle: 'bg-slate-100 text-slate-500',

    // edit: form card
    formCard:
      'rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_10px_40px_rgba(15,23,42,0.06)]',
    formSectionWrapper: 'space-y-4',
    formSectionTitle:
      'text-sm font-extrabold uppercase tracking-wide text-slate-700',
    formSectionSubtitle: 'mt-1 text-xs text-slate-500',
    formGrid: 'grid gap-4 md:grid-cols-2',
    editFieldLabelWrapper: 'space-y-1 text-xs font-medium text-slate-700',
    editFieldLabelText:
      'block text-[11px] font-semibold uppercase tracking-wide text-slate-500',
    editInputWrapper: 'relative',
    editInputIcon:
      'pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400',
    editInputBase:
      'w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200',
    editInputError:
      'border-red-500 focus:border-red-500 focus:ring-red-200',
    errorText: 'mt-1 text-[11px] text-red-600',

    // edit: helper panels
    helperPanelWrapper:
      'grid gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-5 text-xs text-slate-700 md:grid-cols-2',
    helperTitle:
      'text-xs font-semibold uppercase tracking-wide text-slate-800',
    helperBodyText: 'mt-1 text-[12px]',
    helperList: 'mt-2 space-y-1.5',
    helperListItem: 'flex items-start gap-1.5',
    helperListIcon: 'mt-[2px] h-3 w-3 text-pink-500',

    // edit: buttons
    buttonRow: 'flex justify-end gap-3',
    secondaryButton:
      'rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50',
    primaryButton:
      'rounded-full bg-pink-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2',
    shirtSizeButton:
      'inline-flex items-center justify-center rounded-full bg-pink-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-pink-700 ring-1 ring-pink-200 shadow-sm hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2',

    // edit: resume upload
    uploadOuter: 'space-y-2',
    uploadLabelSrOnly: 'sr-only',
    uploadDropzone:
      'relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-8 text-center text-xs text-slate-600 transition hover:border-pink-400 hover:bg-pink-50/40',
    uploadIcon: 'mb-3 h-8 w-8 text-pink-600',
    uploadTitle:
      'text-[11px] font-semibold uppercase tracking-wide text-slate-800',
    uploadSubtitle: 'mt-1 text-[11px] text-slate-500',
    uploadInput:
      'absolute inset-0 h-full w-full cursor-pointer opacity-0',
    uploadHintText: 'mt-1 text-[11px] text-slate-500',
    uploadHintFileName: 'font-semibold',

    // edit: preview cards
    previewWrapper: 'space-y-4 text-xs text-slate-700',
    previewCard:
      'rounded-xl border border-slate-200 bg-slate-50 p-4',
    previewCardHeader:
      'mb-2 flex items-center justify-between gap-2',
    previewCardTitle:
      'text-[11px] font-semibold uppercase tracking-wide text-slate-500',
    previewEditButton:
      'inline-flex items-center gap-1 text-[11px] font-semibold text-pink-600 hover:text-pink-700',
    previewEditIcon: 'h-3.5 w-3.5',
    previewDefinitionList: 'mt-2 grid gap-2 md:grid-cols-2',
    previewDt: 'text-[11px] text-slate-500',
    previewDd: 'font-medium',
    previewDdMultiline: 'font-medium whitespace-pre-line',

    // edit: modal
    modalOverlay:
      'fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4',
    modalCard: 'w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl',
    modalTitle:
      'text-sm font-extrabold uppercase tracking-wide text-slate-800',
    modalBody:
      'mt-3 space-y-3 text-xs leading-relaxed text-slate-700',
    modalBodyHighlight: 'font-semibold text-slate-900',
    modalButtonRow: 'mt-5 flex justify-end gap-3',
    modalSecondaryButton:
      'rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50',
    modalPrimaryLink:
      'inline-flex items-center justify-center rounded-full bg-pink-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2',
  },
} as const;

export type JysSectionTheme = typeof jysSectionTheme;
