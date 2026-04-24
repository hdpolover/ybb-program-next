export const programsTheme = {
  programsCurrent: {
    sectionWrapper: 'sm:py-18 py-14 md:py-20',
    container: 'mx-auto max-w-7xl px-6 lg:px-8',
    layoutGrid: 'grid items-start gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]',
    leftCol: 'space-y-5 text-slate-900',
    bodyParagraph: 'text-sm leading-7 text-slate-700 sm:text-base',
    richText:
      '[&_p]:text-slate-700 [&_p]:leading-7 [&_p:not(:first-child)]:mt-4 [&_strong]:font-semibold [&_.ql-align-justify]:text-justify [&_a]:text-[var(--brand-accent)] [&_a]:underline [&_a]:underline-offset-4',
    themeBlock: 'mt-4 space-y-3',
    themeHeading: 'text-sm font-semibold uppercase tracking-wide text-primary',
    themeTitle: 'mt-1 text-sm font-semibold text-slate-900 sm:text-base',
    subthemesGrid: 'mt-2 grid gap-3 sm:grid-cols-2',
    subthemeCard:
      'rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80',
    rightCol: 'mx-auto w-fit',
    rightCard:
      'w-[340px] sm:w-[380px] rounded-3xl bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/80 sm:p-5',
    coverWrapper: 'relative w-full rounded-2xl bg-slate-100',
    coverImage: 'object-contain',
    infoList: 'mt-4 space-y-3 text-sm text-slate-700',
    infoRow: 'flex items-start gap-2',
    infoIcon: 'mt-0.5 h-4 w-4 text-primary',
    infoLabel: 'text-xs font-semibold uppercase tracking-wide text-slate-500',
    infoValue: 'text-sm font-semibold text-slate-900',
    infoGrid: 'grid gap-3 sm:grid-cols-2',
    guideButtonsWrapper: 'mt-5 flex flex-col gap-3',
    subtitle: 'mt-1 text-sm font-medium text-primary',
    statusBadge:
      'inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary',
    primaryCta:
      'inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary',
    secondaryCta:
      'inline-flex items-center justify-center rounded-lg border border-primary/30 bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:bg-primary/10',
    tertiaryCta:
      'inline-flex items-center justify-center rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:bg-primary/10',
    infoItemCard: 'rounded-xl border border-gray-200 bg-white p-4',
    infoItemHeader: 'flex items-center gap-2 text-gray-600',
    infoItemIcon: 'h-5 w-5 text-primary',
    infoItemLabel: 'text-xs',
    infoItemValue: 'mt-1 text-base font-semibold text-gray-900',
  },
  programsPrevious: {
    sectionWrapper: 'sm:py-18 relative w-full overflow-hidden px-6 py-16 md:py-20',
    container: 'mx-auto max-w-7xl',
    yearBadge:
      'absolute left-3 top-3 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary',
    subtitle: '-mt-6 mb-8 text-center text-sm text-primary sm:text-base',
    stageWrapper: 'relative mt-10 flex h-[480px] items-center justify-center',
    chevronIcon: 'h-5 w-5',
    carouselInner: 'relative mx-auto flex h-full w-full max-w-5xl items-center justify-center',
    slideBase: 'absolute transition-all duration-500 ease-in-out',
    card: 'w-[340px] overflow-hidden rounded-3xl bg-white shadow-[0_18px_60px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/80 sm:w-[360px]',
    cardImageWrapper: 'relative h-[220px] w-full',
    cardImage: 'object-cover',
    cardBody: 'p-6',
    cardTitle: 'text-base font-semibold text-slate-900 sm:text-lg',
    cardDate: 'mt-1 text-sm text-slate-600',
    arrowButton:
      'flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900',
    dotActive: 'h-2.5 w-8 rounded-full bg-primary/100',
    dotInactive: 'h-2.5 w-2.5 rounded-full bg-gray-300 hover:bg-gray-400',
  },
  programsAdditional: {
    sectionWrapper: 'px-6 py-12 sm:py-14 md:py-16 lg:px-8',
    container: 'mx-auto max-w-7xl',
    subtitle: '-mt-6 mb-8 text-center text-sm text-primary sm:text-base',
    cardsWrapper: 'flex flex-wrap justify-center gap-6',
    card: 'group w-[320px] overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200 transition hover:shadow-md sm:w-[360px]',
    coverWrapper: 'relative aspect-[16/9] overflow-hidden',
    coverImage: 'object-cover transition group-hover:scale-105',
    logoBadgesWrapper: 'absolute left-3 top-3 flex items-center gap-2',
    logoCircle: 'relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-white/60',
    logoImage: 'bg-white object-contain',
    cardMetaRow: 'flex items-start justify-between gap-3 p-5',
    datesText: 'mt-1 text-sm text-gray-600',
    cardTitle: 'text-base font-extrabold text-gray-900 group-hover:text-primary sm:text-lg',
    arrowCircle:
      'mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white',
    arrowIcon: 'h-4 w-4',
  },
  programsMissionVision: {
    missionIconMain: 'grid h-9 w-9 place-items-center rounded-full bg-primary text-white',
    missionBulletIcon:
      'mt-1 grid h-6 w-6 place-items-center rounded-full bg-primary/20 text-primary ring-1 ring-primary/30',
  },
  programsObjectives: {
    numberCircle:
      'grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-primary text-white',
  },
  programsBenefits: {
    iconCircle: 'grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-primary text-white',
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
    metaIcon: 'h-4 w-4 text-primary',
    titleWrapper: 'mt-3 flex-1',
    title: 'text-base font-extrabold text-slate-900 sm:text-lg',
    dayLabel: 'text-primary',
    bulletsGrid: 'mt-3 grid gap-x-6 gap-y-1 text-sm text-slate-800 sm:grid-cols-2',
    bulletRow: 'flex items-start gap-2',
    bulletIconWrapper: 'mt-0.5 text-emerald-500',
    bulletIcon: 'h-4 w-4',
    description: 'mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm',
    note: 'mx-auto mt-6 max-w-3xl text-center text-xs text-slate-600 sm:text-sm',
    noteEmphasis: 'font-semibold text-primary',
  },
  programsSteps: {
    sectionWrapper:
      'relative w-full bg-gradient-to-b from-white to-primary/10/50 py-10 sm:py-14 lg:py-16',
    container: 'relative mx-auto max-w-5xl px-6 lg:px-8',
    timelineGrid: 'mt-8 grid grid-cols-[auto,1fr] gap-x-5 sm:gap-x-7',
    lineCol: 'relative col-span-1 row-span-full',
    line: 'mx-auto h-full w-px bg-gradient-to-b from-primary/60 via-primary/40 to-transparent',
    stepsCol: 'space-y-6',
    stepRow: 'grid grid-cols-[auto,1fr] gap-x-4 gap-y-1',
    stepIconCol: 'relative col-span-1 flex flex-col items-center',
    stepIconCircle:
      'grid h-9 w-9 place-items-center rounded-full bg-primary text-white shadow-[0_10px_25px_rgba(219,39,119,0.6)]',
    stepIcon: 'h-5 w-5',
    stepLabel: 'mt-1 text-[11px] font-semibold uppercase tracking-wide text-primary',
    stepCard:
      'col-span-1 rounded-2xl bg-white/95 px-4 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70 sm:px-5 sm:py-5',
    stepTitle: 'text-sm font-extrabold text-slate-900 sm:text-base',
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
    thead: 'bg-primary/10',
    headerRow: 'text-left text-xs font-semibold uppercase tracking-wide text-slate-500',
    headerCell: 'px-5 py-3 sm:px-6',
    body: 'divide-y divide-slate-100 bg-white',
    row: 'align-top text-[13px] text-slate-800',
    cellDate: 'whitespace-nowrap px-5 py-4 text-slate-700 sm:px-6',
    cellStatus: 'px-5 py-4 sm:px-6',
    cellName: 'px-5 py-4 font-semibold text-slate-900 sm:px-6',
    cellDesc: 'px-5 py-4 text-slate-600 sm:px-6',
    note: 'mx-auto mt-4 max-w-3xl text-center text-xs text-slate-600 sm:mt-5 sm:text-sm',
    noteEmphasis: 'font-semibold text-primary',
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
    iconCircle: 'grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-primary text-white',
    label: 'text-xs font-semibold uppercase tracking-wide text-primary',
    value: 'mt-1 text-2xl font-extrabold text-slate-900',
  },
  insightsTheme: {
    card: 'relative overflow-hidden rounded-xl border border-primary/30/60 bg-gradient-to-br from-primary/10 to-white p-5 shadow-[0_8px_30px_rgba(2,6,23,0.06)]',
    leftAccent: 'absolute left-0 top-0 h-full w-1 bg-primary/100/60',
    tagChip:
      'inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary ring-1 ring-primary/30',
    iconCircle:
      'grid h-8 w-8 place-items-center rounded-full bg-white text-primary ring-1 ring-primary/30',
    sdgCircle:
      'inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white',
  },
  insightsParticipants: {
    rankCircle:
      'inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white',
    flagCircle:
      'grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/30',
    barTrack: 'mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100',
    barFill: 'h-full bg-primary/100',
  },
  announcementsGrid: {
    subtitle: '-mt-6 mb-8 text-center text-sm text-primary',
    card: 'group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_60px_rgba(2,6,23,0.12)] hover:ring-primary/30',
    loadMoreButton:
      'inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
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
      'inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary',
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
      'flex aspect-square h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-primary/100/80 bg-white/5',
    infoStripSubtitle: 'text-sm font-semibold uppercase tracking-wider text-primary/60',
    infoStripValue: 'mt-1 text-2xl font-extrabold leading-tight',
    infoStripIcon: 'h-5 w-5 text-primary/60',
    // Guidelines section
    guidelinesSection: 'relative bg-white',
    guidelinesContainer: 'mx-auto max-w-7xl px-6 py-16 lg:px-8',
    guidelinesCard:
      "mx-auto max-w-3xl overflow-hidden rounded-2xl bg-[url('/img/bgourprogram.png')] bg-cover bg-center bg-blend-multiply ring-1 ring-gray-200",
    guidelinesBody: 'p-6 text-center sm:p-8',
    guidelinesIconCircle:
      'mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary/100/80 bg-primary/10',
    guidelinesIcon: 'h-5 w-5 text-primary',
    guidelinesButton:
      'inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary',
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
      'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-primary/100/80 bg-primary/10',
    overviewIcon: 'h-5 w-5 text-primary',
    overviewContent: 'text-gray-700',
    overviewText: 'leading-7',
    overviewList: 'mt-4 space-y-3',
    overviewListItem: 'flex items-start gap-3',
    overviewBulletIcon:
      'inline-flex aspect-square h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white',
    overviewBulletIconAlt:
      'inline-flex aspect-square h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white',
    overviewHighlightText: 'font-semibold',
    overviewCheckIcon: 'h-4 w-4',
    applicationPrimaryCta:
      'inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary',
    applicationSecondaryCta:
      'inline-flex items-center justify-center rounded-lg border border-gray-300 bg-gray-50 px-5 py-2.5 text-sm font-semibold text-gray-500',
    applicationCard: 'overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200',
    applicationImageWrapper: 'relative aspect-[16/9]',
    applicationImage: 'object-cover',
    applicationBody: 'p-6 text-center sm:p-8',
    applicationTitle: 'text-xl font-extrabold text-slate-900 sm:text-2xl',
    applicationSubtitle: 'mt-2 text-sm text-gray-600',
    applicationCtaWrapper: 'mt-6',
    // Requirements section
    requirementsSection: 'relative bg-white',
    requirementsContainer: 'mx-auto max-w-7xl px-6 py-16 lg:px-8',
    requirementsCard: 'mx-auto max-w-3xl overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200',
    // Terms & Conditions section
    termsSection: 'relative bg-[#eef5ff]',
    termsContainer: 'mx-auto max-w-3xl px-6 py-16 lg:px-8',
    termsDetails: 'group overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200',
    termsSummary:
      'flex cursor-pointer list-none items-center gap-3 p-6 text-base font-semibold text-slate-900 sm:p-8 [&::-webkit-details-marker]:hidden',
    termsIcon: 'h-5 w-5 text-primary',
    termsChevron: 'ml-auto h-5 w-5 text-gray-400 transition-transform group-open:rotate-180',
    termsBody: 'border-t border-gray-200 px-6 pb-6 pt-4 sm:px-8 sm:pb-8',
    termsText: 'whitespace-pre-line text-sm leading-7 text-gray-600',
  },
  galleryOtherPrograms: {
    subtitle: '-mt-6 mb-8 text-center text-sm text-primary sm:text-base',
    cardTitle: 'text-base font-extrabold text-slate-900 group-hover:text-primary sm:text-lg',
    visitChip:
      'inline-flex items-center gap-1 rounded-md border border-primary/30 px-3 py-2 text-xs font-semibold text-primary transition group-hover:border-primary/40',
  },
  programRundowns: {
    tabButton:
      'relative px-4 py-5 text-center text-base font-extrabold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 sm:px-6 sm:text-lg',
    tabLabelIcon: 'h-4 w-4 text-primary',
    tabActiveUnderline: 'absolute inset-x-0 bottom-0 block h-0.5 bg-primary',
    noteIcon: 'mt-0.5 h-5 w-5 flex-shrink-0 text-primary',
  },
  programFAQ: {
    sectionWrapper: 'bg-[#eef5ff] px-6 py-12 sm:py-14 md:py-16 lg:px-8',
    container: 'mx-auto max-w-7xl',
    tabsCard: 'mx-auto mt-2 w-full overflow-hidden rounded-2xl border border-blue-100 bg-white',
    tabsGrid: 'grid grid-cols-3',
    tabButton:
      'relative px-4 py-5 text-center text-base font-extrabold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 sm:px-6 sm:text-lg',
    tabInactive:
      'text-slate-900/70 hover:bg-primary/10 hover:text-slate-900 hover:shadow-sm hover:ring-1 hover:ring-primary/30',
    tabActiveUnderline: 'absolute inset-y-3 left-0 block w-0.5 rounded-full bg-primary',
    tabLabelInner: 'inline-flex items-center justify-center gap-2',
    tabLabelIcon: 'h-4 w-4 text-primary',
    tabDivider: 'absolute inset-y-3 right-0 hidden w-px bg-blue-100 last:hidden sm:block',
    faqListWrapper: 'mt-6 space-y-3',
    faqCard: 'overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200',
    faqHeaderButton: 'flex w-full items-center justify-between gap-3 px-5 py-4 text-left',
    faqQuestion: 'text-base font-extrabold text-slate-900',
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
      'order-2 flex w-full max-w-xl flex-col justify-center space-y-4 text-slate-900 lg:order-1 lg:pr-6',
    description: 'mt-3 max-w-md text-sm leading-relaxed text-slate-900/90 sm:text-base lg:text-lg',
    buttonsCol: 'mt-4 flex flex-col items-start gap-3',
    guideButtonBase:
      'inline-flex items-center justify-center gap-2 rounded-full border-2 px-4 py-2.5 text-sm font-semibold shadow-sm transition',
    guideButtonPrimary: 'border-primary/100/80 bg-white/95 text-primary hover:bg-white',
    guideButtonSecondary: 'border-blue-500/70 bg-primary/5/90 text-blue-800 hover:bg-primary/10',
    flagCircle: 'inline-flex h-5 w-5 items-center justify-center overflow-hidden rounded-full',
    rightCol: 'order-1 relative flex w-full justify-center lg:order-2',
    mockupWrapper:
      'relative h-80 w-full max-w-xs -mt-6 sm:h-96 sm:max-w-sm lg:h-[420px] lg:max-w-md lg:-mt-10 drop-shadow-[0_26px_70px_rgba(15,23,42,0.65)]',
  },
  programsBenefitsDetail: {
    sectionWrapper: 'bg-slate-50 py-12 sm:py-16',
    container: 'mx-auto max-w-6xl px-6 lg:px-8',
    grid: 'grid gap-10 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)]',
    leftColumn: 'space-y-8 text-sm leading-7 text-slate-800',
    itemRow: 'flex gap-4',
    numberCircle:
      'mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white',
    itemTitle: 'text-base font-extrabold text-slate-900',
    itemSubtitle: 'block text-[0.8rem] font-semibold text-primary',
    paragraphStrong: 'mt-2 font-semibold',
    paragraphNormal: 'mt-2',
    bulletList: 'mt-1 list-disc space-y-1 pl-5',
    asideCard:
      'self-start overflow-hidden rounded-2xl bg-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/80',
    asideImageWrapper: 'relative h-40 w-full',
    asideImage: 'object-cover',
    asideInner: 'p-6',
    asideEyebrow: 'text-xs font-extrabold uppercase tracking-[0.16em] text-primary',
    asideTitle: 'mt-2 text-base font-bold text-slate-900',
    asideList: 'mt-4 space-y-2 text-sm text-slate-700',
    asideListItem: 'flex items-start gap-2',
    asideCheckIcon: 'mt-[2px] h-4 w-4 flex-shrink-0 text-primary',
    asideButtonWrapper: 'mt-6',
    asideButton:
      'inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-primary/20',
  },
  programsTestimonialsGrid: {
    sectionWrapper: 'px-6 py-12 sm:py-14 md:py-16 lg:px-8',
    container: 'mx-auto max-w-7xl',
    grid: 'grid gap-6 md:grid-cols-2 lg:grid-cols-3',
    card: 'rounded-2xl bg-white p-5 shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-200 transition will-change-transform hover:-translate-y-0.5 hover:shadow-[0_16px_60px_rgba(2,6,23,0.12)] hover:ring-primary/30',
    cardInnerRow: 'flex items-start gap-4',
    avatarImg: 'h-12 w-12 rounded-full object-cover ring-2 ring-white',
    contentCol: 'flex-1',
    headerRow: 'flex flex-wrap items-center gap-2',
    name: 'text-lg font-extrabold text-slate-900',
    countryChip:
      'inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary ring-1 ring-primary/30',
    yearPill:
      'inline-flex items-center rounded-full bg-primary px-2 py-1 text-[11px] font-semibold text-white',
    flagEmoji: 'text-base leading-none',
    quote: 'mt-3 text-sm leading-6 text-slate-700',
    readMoreButton:
      'mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-blue-800',
    readMoreIcon: 'h-4 w-4 transition-transform',
    divider: 'my-4 h-px w-full bg-slate-200',
    metaRow: 'flex items-center justify-between',
    roleText: 'text-sm text-slate-600',
    starsWrapper: 'flex items-center gap-0.5 text-primary/100',
    starFilled: 'h-4 w-4 fill-primary/100 stroke-primary',
    starEmpty: 'h-4 w-4 stroke-primary/40',
  },
  programsTestimonialsImpact: {
    sectionWrapper: 'px-6 pb-12 sm:pb-14 md:pb-16 lg:px-8',
    container: 'mx-auto max-w-7xl',
    grid: 'grid gap-5 sm:grid-cols-2 lg:grid-cols-4',
    card: 'group rounded-2xl bg-white p-5 text-center shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-[0_16px_60px_rgba(2,6,23,0.12)] hover:ring-primary/30',
    iconCircle:
      'mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full bg-primary text-white transition group-hover:bg-primary',
    icon: 'h-5 w-5',
    value: 'text-2xl font-extrabold text-slate-900',
    label: 'text-xs font-semibold uppercase tracking-wide text-primary',
  },
};
