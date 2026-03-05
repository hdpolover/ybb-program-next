export const homeTheme = {
  momentsShorts: {
    sectionWrapper: 'relative w-full bg-[#ffffff72] py-20 sm:py-24',
    card: 'mx-auto max-w-7xl overflow-hidden rounded-3xl px-6 py-12 text-accent-foreground shadow-[0_18px_60px_rgba(15,23,42,0.35)] sm:px-10 lg:px-16',
    cardBackground: '/img/bgshorts60.jpg',
    title: 'text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl lg:text-4xl',
    description: 'mt-3 max-w-md text-sm leading-relaxed text-slate-900/90 sm:text-base lg:text-lg',
    shortsRow:
      'flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:pb-0',
    shortWrapper:
      'relative h-80 w-56 flex-shrink-0 snap-start overflow-hidden rounded-xl bg-black/15 sm:w-full',
    shortIframe: 'absolute inset-0 h-full w-full border-0',
  },
  furtherInfo: {
    sectionWrapper: 'relative w-full py-20 sm:py-28',
    card: 'mx-auto flex max-w-7xl items-start px-6 pt-6 sm:items-center sm:px-10 sm:pt-0 lg:px-16',
    innerGrid:
      'grid w-full items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)] lg:gap-12',
    leftCol:
      'order-2 flex w-full max-w-xl flex-col items-center justify-center space-y-4 text-center text-slate-900 sm:items-start sm:text-left lg:order-1 lg:pr-6',
    description: 'mt-3 max-w-md text-sm leading-relaxed text-slate-900/90 sm:text-base lg:text-lg',
    buttonsCol: 'mt-4 flex flex-col items-center gap-3 sm:items-start',
    guideButtonBase:
      'inline-flex items-center justify-center gap-2 rounded-full border-2 px-4 py-2.5 text-sm font-semibold shadow-sm transition',
    guideButtonPrimary: 'border-primary/100/80 bg-white/95 text-primary hover:bg-white',
    guideButtonSecondary: 'border-blue-500/70 bg-primary/5/90 text-blue-800 hover:bg-primary/10',
    flagCircle: 'inline-flex h-5 w-5 items-center justify-center overflow-hidden rounded-full',
    rightCol: 'hidden order-1 w-full justify-center lg:relative lg:flex lg:order-2',
    mockupWrapper:
      'relative h-80 w-full max-w-xs -mt-6 sm:h-96 sm:max-w-sm lg:h-[420px] lg:max-w-md lg:-mt-10 drop-shadow-[0_26px_70px_rgba(15,23,42,0.65)]',
  },
  homeWhatMakesSpecial: {
    sectionWrapper: 'w-full py-16 sm:py-20',
    container: 'mx-auto max-w-7xl px-6 lg:px-8',
    grid: 'mt-10 grid gap-6 justify-items-center sm:grid-cols-2 lg:grid-cols-3 lg:gap-8',
    card: 'flex h-full w-full max-w-md flex-col rounded-2xl bg-white/90 p-6 text-sm text-slate-800 shadow-[0_10px_35px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70 backdrop-blur-sm',
    iconCircle:
      'mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm',
    icon: 'h-5 w-5',
    cardTitle: 'text-base font-semibold text-slate-900',
    cardDescription: 'mt-2 text-sm leading-relaxed text-slate-600',
  },
  homeProgramBenefits: {
    sectionWrapper: 'w-full bg-[#ffffff72] py-16 sm:py-20',
    container: 'mx-auto max-w-6xl px-6 lg:px-8',
    backgroundImage: '/img/bgshorts60.jpg',
    grid: 'mt-10 grid gap-6 md:grid-cols-2 md:gap-1',
    card: 'flex h-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white/95 text-sm text-slate-800 shadow-[0_10px_35px_rgba(15,23,42,0.10)] ring-1 ring-slate-200/80 mx-auto',
    imageWrapper: 'relative -mx-0 -mt-0 mb-0 h-44 w-full overflow-hidden',
    image: 'h-full w-full object-cover',
    cardTitle: 'px-6 pt-5 text-base font-semibold text-slate-900 text-center',
    list: 'mt-3 space-y-1.5 px-6 pb-2 text-sm leading-relaxed text-slate-700',
    listItem: 'flex items-start gap-2 text-sm leading-relaxed text-slate-700',
    listCheckIcon: 'mt-[3px] h-4 w-4 flex-shrink-0 text-primary',
    listText: 'text-sm leading-relaxed text-slate-700',
    actionsRow: 'mt-auto flex justify-center pb-6',
    readMoreButton:
      'inline-flex min-w-[180px] items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-sm transition hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
  },
  testimonialsHome: {
    sectionWrapper: 'relative w-full overflow-x-hidden bg-primary/10 py-16 sm:py-20',
    container: 'mx-auto max-w-7xl px-6 lg:px-8',
    subtitle: '-mt-6 mb-10 text-center text-sm text-primary',
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
    nameRow: 'flex items-center gap-2 text-sm font-semibold text-slate-900',
    nameFlag: 'text-base',
    roleText: 'text-xs text-slate-500',
    badge:
      'inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary ring-1 ring-primary/30',
    modalOverlay: 'fixed inset-0 z-50 grid place-items-center bg-black/50 p-4',
    modalCard:
      'w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10',
    modalHeader: 'flex items-center justify-between border-b border-slate-200 p-4',
    modalTitle: 'text-lg font-extrabold text-slate-900',
    modalCloseButton:
      'rounded-md bg-slate-100 px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-200',
    modalBodyGrid: 'grid gap-5 p-5 sm:grid-cols-[96px,1fr]',
    modalAvatarWrapper:
      'aspect-square w-24 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200',
    modalAvatarInner: 'relative h-full w-full',
    modalAvatarImg: 'object-cover',
    modalMetaNameRow: 'flex items-center gap-2 text-sm font-semibold text-slate-900',
    modalMetaSub: 'mt-1 text-xs text-slate-600',
    modalQuote: 'text-sm leading-7 text-slate-700',
  },
  alumniStories: {
    sectionWrapper: 'relative w-full bg-[#ffffff72] py-16 sm:py-20',
    card: 'mx-auto max-w-7xl px-6 py-10 text-slate-900 sm:px-10',
    layoutGrid: 'grid gap-10 items-start',
    mainVideoWrapper:
      'relative aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-slate-900/5 ring-1 ring-slate-200 mx-auto',
    mainIframe: 'absolute inset-0 h-full w-full border-0 rounded-2xl',
    reelsTitle: 'text-sm font-semibold uppercase tracking-wide text-[var(--brand-accent)]',
    reelsGrid:
      'mt-4 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:pb-0 md:grid-cols-4',
    reelItem:
      'relative aspect-[9/16] w-56 flex-shrink-0 snap-start overflow-hidden rounded-xl sm:w-full sm:max-w-[270px] sm:mx-auto',
    reelVideo: 'h-full w-full object-cover',
    reelSkeleton: 'absolute inset-0 animate-pulse bg-slate-200',
  },
  globalImpact: {
    sectionWrapper: 'relative w-full bg-[#ffffff72] py-16 sm:py-20',
    statsGrid: 'mx-auto mt-2 grid max-w-4xl grid-cols-1 gap-3 text-center sm:grid-cols-3',
    card: 'flex flex-col items-center gap-1 bg-transparent px-2 py-1 shadow-none ring-0 sm:rounded-2xl sm:bg-white sm:px-4 sm:py-4 sm:shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:ring-1 sm:ring-slate-200',
    iconCircle:
      'grid h-10 w-10 place-items-center rounded-full bg-[var(--brand-accent-soft)] text-[var(--brand-accent)] ring-1 ring-[var(--brand-border)]',
    value: 'text-3xl font-extrabold tracking-tight text-[var(--brand-accent)] sm:text-4xl',
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
    // Warna buat map fill
    mapColors: {
      high: '#ef4444', // merah (high participation)
      medium: '#facc15', // kuning (medium participation)
      low: '#22c55e', // hijau (low participation)
      none: '#e5e7eb', // abu-abu kalau belum ada peserta
    },
    mapStroke: '#ffffff',
  },
  topParticipantCountries: {
    card: 'mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(15,23,42,0.12)] ring-1 ring-slate-200',
    table: 'min-w-full divide-y divide-slate-200 text-sm',
    headRow: 'bg-slate-50',
    headCell: 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500',
    headCellRight:
      'px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500',
    bodyRow: 'divide-y divide-slate-100 bg-white',
    indexCell: 'px-4 py-3 text-xs font-semibold text-slate-500',
    countryCell: 'px-4 py-3 text-sm font-semibold text-slate-900',
    countCell: 'px-4 py-3 text-right text-sm font-medium text-slate-900',
    percentageCell: 'px-4 py-3',
    percentageMeta: 'w-14 text-right text-xs font-medium text-slate-700',
    progressTrack: 'relative h-2 flex-1 overflow-hidden rounded-full bg-slate-100',
    progressBar: 'h-full rounded-full bg-[var(--brand-accent)]',
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
    proofTitle: 'text-[14px] font-extrabold text-slate-900',
    proofSubtitle: 'mt-0.5 text-[11px] leading-5 text-slate-700',
    bulletChip:
      'rounded-full bg-[var(--brand-accent-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--brand-accent)] ring-1 ring-[var(--brand-border)]',
    hakiIconCircle:
      'inline-grid h-10 w-10 place-items-center rounded-full bg-[var(--brand-accent)] text-[var(--brand-accent-foreground)]',
    hakiCol: 'col-span-12 flex items-center justify-center lg:col-span-5',
    hakiCard:
      'w-full max-w-md rounded-2xl bg-white p-5 shadow-[0_12px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-200',
    hakiTitle: 'text-lg font-extrabold text-slate-900',
    hakiSubtitle: 'text-xs font-medium text-slate-600',
    hakiBrand: 'text-sm font-semibold text-slate-900',
    hakiClassText: 'text-xs text-slate-600',
    hakiMeta: 'rounded-lg bg-slate-50 p-2 ring-1 ring-slate-200',
    hakiMetaLabel: 'text-slate-500',
    hakiMetaValue: 'font-semibold text-slate-900',
    hakiButton:
      'inline-flex items-center gap-2 rounded-md bg-[var(--brand-accent)] px-4 py-2 text-xs font-semibold text-[var(--brand-accent-foreground)] shadow-sm transition hover:opacity-90',
    hakiChip:
      'rounded-full bg-[var(--brand-accent-soft)] px-2 py-1 text-[10px] font-semibold text-[var(--brand-accent)] ring-1 ring-[var(--brand-border)]',
  },
  aboutProgram: {
    checklistIcon:
      'grid h-7 w-7 place-items-center rounded-full bg-[var(--brand-accent)] text-[var(--brand-accent-foreground)]',
    ctaButton:
      'inline-flex items-center justify-center rounded-md bg-[var(--brand-accent)] px-5 py-3 text-sm font-semibold text-[var(--brand-accent-foreground)] shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)] focus:ring-offset-2',
    sectionWrapper:
      "relative min-h-[520px] w-full bg-[url('/img/bgourprogram.png')] bg-cover bg-center bg-no-repeat py-20 sm:py-20",
    blurTop:
      'pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[var(--brand-accent-soft)]/60 blur-2xl',
    blurBottom:
      'pointer-events-none absolute -bottom-12 right-6 h-48 w-48 rounded-full bg-white/40 blur-2xl',
    container: 'mx-auto max-w-7xl px-6 lg:px-8',
    layoutGrid:
      'grid items-center gap-10 sm:grid-cols-2 sm:gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)]',
    leftCol: 'sm:pr-4',
    tabContainer:
      'mt-4 inline-flex rounded-full bg-white/70 p-1 text-xs shadow-sm ring-1 ring-slate-200',
    tabButtonBase: 'rounded-full px-4 py-2 text-xs font-semibold transition',
    tabButtonActive: 'bg-[var(--brand-accent)] text-[var(--brand-accent-foreground)] shadow-sm',
    tabButtonInactive: 'text-slate-600 hover:text-slate-900',
    contentWrapper:
      'mt-5 min-h-[220px] space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base',
    richText:
      '[&_p]:text-slate-600 [&_p]:leading-relaxed [&_p:not(:first-child)]:mt-4 [&_strong]:font-semibold [&_.ql-align-justify]:text-justify [&_a]:text-[var(--brand-accent)] [&_a]:underline [&_a]:underline-offset-4',
    visionLabel: 'font-semibold text-slate-900',
    ctaWrapper: 'mt-6',
    rightCol: 'flex items-center justify-center',
    collageWrapper: 'relative h-full w-full',
    collageGrid: 'grid h-full grid-cols-2 gap-4',
    collageLargeCard:
      'relative col-span-1 row-span-2 overflow-hidden rounded-2xl bg-blue-900/5 shadow-[0_8px_30px_rgba(31,41,55,0.12)] ring-1 ring-blue-900/10',
    collageSmallCard:
      'relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/40 shadow-[0_8px_30px_rgba(31,41,55,0.12)] ring-1 ring-slate-200/80',
    collageImage: 'object-cover',
  },
  programHighlights: {
    card: 'hover:ring-accent/30 group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_60px_rgba(2,6,23,0.12)]',
    imageWrapper: 'h-40 w-full overflow-hidden bg-blue-100/60',
    title: 'text-xl font-extrabold text-slate-900',
    intro: 'mt-2 text-sm leading-6 text-slate-600',
    listItem:
      'flex items-center gap-3 py-3 transition-colors duration-200 hover:bg-slate-50 border-slate-200',
    checkIcon:
      'bg-accent text-accent-foreground grid h-7 w-7 aspect-square flex-shrink-0 place-items-center rounded-full',
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
    objectivePointText: 'text-sm font-medium text-slate-900 sm:text-base',
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
    title: 'text-lg font-extrabold text-slate-900',
    desc: 'text-sm leading-6 text-slate-700',
    highlightsList: 'flex flex-1 flex-col p-5 pt-0',
    highlightItemBase: 'flex items-center justify-between gap-3 py-3 text-sm transition-colors',
    highlightDivider: 'border-b border-slate-200',
    highlightLabel: 'font-medium text-slate-900',
    highlightBadge:
      'rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-700 ring-1 ring-slate-200',
    singleHighlightBox:
      'flex flex-1 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4',
    singleHighlightValue: 'text-3xl font-extrabold text-slate-900',
    singleHighlightUnit: 'text-xs font-semibold uppercase tracking-wide text-slate-600',
    chip: 'rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-700 ring-1 ring-slate-200',
  },
  photoGallery: {
    sectionWrapper: 'relative w-full py-12 sm:py-16 lg:py-20',
    container: 'mx-auto max-w-7xl px-6 lg:px-8',
    subtitle: '-mt-6 mb-8 text-center text-sm text-[var(--brand-accent)]',
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
      'inline-flex items-center justify-center rounded-md bg-[var(--brand-accent)] px-5 py-3 text-sm font-semibold text-[var(--brand-accent-foreground)] shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)] focus:ring-offset-2',
    loadMoreButton:
      'inline-flex items-center justify-center rounded-md bg-[var(--brand-accent)] px-5 py-3 text-sm font-semibold text-[var(--brand-accent-foreground)] shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)] focus:ring-offset-2',
  },
  promoCta: {
    sectionWrapper:
      "relative w-full overflow-hidden bg-[url('/img/ctabekground.png')] bg-cover bg-center bg-no-repeat py-12 text-[#172554] sm:py-16 lg:py-20",
    glowLeft:
      'pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl',
    glowRight:
      'pointer-events-none absolute -right-24 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-white/10 blur-3xl',
    glowBottom:
      'bg-accent/20 pointer-events-none absolute bottom-0 left-1/4 h-32 w-32 rounded-full blur-2xl',
    container:
      'relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-6 lg:grid-cols-2 lg:gap-10 lg:px-8',
    leftCol: 'relative z-10',
    eyebrow: 'text-sm font-semibold uppercase tracking-[0.18em] text-white-200',
    title: 'text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl',
    subtitle: 'text-white-200 mt-4 max-w-xl',
    primaryButton:
      'hover:bg-accent/90 inline-flex items-center justify-center rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
    actionsRow: 'mt-6 flex flex-wrap gap-3',
    rightCol: 'relative z-10 flex flex-col',
    videoCard:
      'rounded-2xl bg-white/95 p-3 shadow-[0_18px_50px_rgba(15,23,42,0.45)] ring-1 ring-slate-200/70',
    videoFrameWrapper: 'relative aspect-video w-full overflow-hidden rounded-xl bg-black/5',
    videoTitle: 'text-base font-semibold text-slate-900',
    videoDescription: 'mt-1 text-xs text-slate-600 sm:text-sm',
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
      'inline-flex items-center justify-center rounded-full border border-primary/30 bg-white px-5 py-3 text-sm font-semibold text-primary shadow-sm transition hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2',
  },
  homeImportantPayment: {
    sectionWrapper: 'relative w-full bg-white py-14 sm:py-16',
    introText: 'mx-auto -mt-6 mb-10 max-w-3xl text-center text-sm text-slate-600 sm:text-base',
    card: 'flex h-full flex-col rounded-2xl bg-white p-5 shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-200',
    iconCircle:
      'mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary',
    cardTitle: 'text-base font-semibold text-slate-900',
    cardBody: 'mt-2 text-sm leading-relaxed text-slate-600',
    noteBar:
      'mt-8 flex items-center gap-3 rounded-xl bg-primary/10 px-4 py-3 text-xs text-slate-900 border-l-4 border-primary/60/80 shadow-[0_8px_30px_rgba(2,6,23,0.06)]',
    noteIcon: 'h-4 w-4 text-primary/100',
    noteEmphasis: 'font-semibold text-primary',
    infoSideWrapper: 'flex h-full items-stretch',
    infoSideCard:
      'flex w-full flex-col justify-between rounded-3xl bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.15)] ring-1 ring-slate-200/80 sm:p-7',
    infoTitle: 'text-lg font-extrabold text-slate-900',
    infoIntro: 'mt-2 text-sm text-slate-700',
    infoPointsWrapper: 'mt-5 space-y-4 text-sm text-slate-800',
    infoPointRow: 'flex gap-3',
    infoPointIcon: 'mt-1 text-primary',
    infoPointTitle: 'text-sm font-semibold text-slate-900',
    infoPointBody: 'text-xs text-slate-600',
    infoFooter: 'mt-6 border-t border-slate-200 pt-4 text-xs text-slate-500',
  },
};
