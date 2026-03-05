export const applyTheme = {
  applyImportant: {
    card: 'overflow-hidden rounded-2xl bg-primary/10 p-6 shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-primary/30 sm:p-8',
    chip: 'rounded-full border border-primary/40 bg-white/70 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary',
    bulletDot: 'mt-1 h-1.5 w-1.5 rounded-full bg-primary/100',
    legalLink:
      'font-semibold underline decoration-primary/40 underline-offset-2 hover:text-primary',
  },
  applyRegistrationTypes: {
    card: 'group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_60px_rgba(2,6,23,0.12)] hover:ring-primary/30',
    iconCircle:
      'grid h-10 w-10 aspect-square place-items-center rounded-full bg-primary text-white',
    priceText: 'text-2xl font-extrabold text-primary',
    calendarIcon: 'h-4 w-4 text-primary',
    bulletCircle: 'grid h-7 w-7 place-items-center rounded-full bg-primary text-white',
    ctaButton:
      'inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary',
    headerWrapper: 'border-b border-slate-200 bg-gradient-to-b from-blue-50/70 to-transparent p-5',
    headerRow: 'flex items-center justify-between',
    headerRowTopAligned: 'flex items-start justify-between',
    headerTitleRow: 'flex items-center gap-3',
    headerTitle: 'text-xl font-extrabold text-slate-900',
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
    listItemText: 'font-medium text-slate-900',
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
    leftCol: 'h-full text-slate-900',
    leftCard:
      'flex h-full flex-col rounded-3xl bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/80',
    tabsHeader:
      'mb-4 flex items-center justify-between border-b border-slate-200 text-sm font-semibold text-slate-500',
    tabButtonBase: 'relative flex-1 px-3 pb-2 pt-1 text-center transition',
    tabButtonActive: 'text-slate-900',
    tabButtonInactive: 'text-slate-500 hover:text-slate-700',
    tabActiveUnderline:
      'absolute inset-x-0 bottom-0 mx-auto block h-0.5 max-w-[70%] rounded-full bg-primary/100',
    detailsContentWrapper: 'mt-5 space-y-6 text-[15px] leading-7 text-slate-700 sm:text-base',
    descriptionBlock: 'space-y-3',
    sectionHeading: 'text-sm font-semibold uppercase tracking-wide text-primary',
    requirementsList: 'grid gap-2 text-[15px] text-slate-700 sm:grid-cols-2',
    requirementItem:
      'flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-2 ring-1 ring-slate-200',
    requirementIcon: 'h-4 w-4 flex-shrink-0 text-primary',
    benefitsList: 'grid gap-2 text-[15px] text-slate-700 sm:grid-cols-2',
    benefitsItem: 'flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-2 ring-1 ring-slate-200',
    benefitsIcon: 'h-4 w-4 flex-shrink-0 text-primary',
    benefitsTabContent: 'mt-5 space-y-4 text-[15px] leading-7 text-slate-700 sm:text-base',
    rightColWrapper: 'mx-auto h-full w-fit',
    rightCard:
      'flex h-full flex-col rounded-3xl bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/80 sm:p-5',
    coverWrapper: 'relative overflow-hidden rounded-2xl bg-slate-100',
    coverImage: 'h-auto w-auto object-contain',
    infoList: 'mt-4 space-y-3 text-sm text-slate-700',
    infoRow: 'flex items-start gap-2',
    infoIcon: 'mt-0.5 h-4 w-4 text-primary',
    infoLabel: 'text-xs font-semibold uppercase tracking-wide text-slate-500',
    infoValue: 'text-sm font-semibold text-slate-900',
    infoGrid: 'grid gap-3 sm:grid-cols-2',
  },
  applyPayment: {
    sectionWrapper: 'bg-slate-50/60 py-14 sm:py-16 md:py-20',
    container: 'mx-auto max-w-6xl px-6 lg:px-8',
    headerWrapper: 'mx-auto max-w-2xl text-center',
    headerSubtitle: 'mx-auto -mt-4 text-sm leading-relaxed text-slate-700 sm:text-base',
    cardsGrid: 'mt-8 grid gap-6 md:grid-cols-2',
    card: 'flex h-full flex-col rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.14)] ring-1 ring-slate-200/80',
    cardTitle: 'text-lg font-semibold text-slate-900 sm:text-xl',
    cardPrice: 'mt-1 text-sm font-semibold text-primary sm:text-base',
    cardSubtitle: 'mt-1 text-xs text-slate-600 sm:text-sm',
    stagesList: 'mt-5 space-y-3 text-sm text-slate-800 sm:text-base',
    stageItem:
      'flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200',
    stageLabel: 'text-xs font-semibold uppercase tracking-[0.16em] text-primary',
    stageLabelMuted: 'text-xs font-semibold uppercase tracking-[0.16em] text-slate-700',
    stagePrice: 'text-sm font-semibold text-slate-900 sm:text-base',
    stagePriceSub: 'text-xs text-slate-600',
    footerWrapper:
      'mt-6 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center',
    footerNote: 'text-xs text-slate-600 sm:text-sm',
    footerNoteEmphasis: 'font-semibold',
    footerCta:
      'inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/100 focus:ring-offset-2',
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
    bankIconCircle: 'flex h-9 w-9 items-center justify-center rounded-full bg-primary/10',
    bankIcon: 'h-4 w-4 text-primary',
    cardTitle: 'text-base font-semibold text-slate-900 sm:text-lg',
    cardSubtitle: 'text-xs text-slate-600 sm:text-sm',
    banksGrid: 'mt-5 grid grid-cols-2 gap-4',
    bankLogoCard:
      'flex h-16 items-center justify-center rounded-2xl bg-white ring-1 ring-slate-200',
    bankLogoImage: 'h-10 w-auto object-contain',
    intlCard:
      'flex h-full flex-col rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.14)] ring-1 ring-slate-200/80',
    intlHeaderRow: 'flex items-center gap-3',
    intlIconCircle: 'flex h-9 w-9 items-center justify-center rounded-full bg-primary/5',
    intlIcon: 'h-4 w-4 text-primary',
    paypalBox: 'mt-5 space-y-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200',
    paypalHeaderRow: 'flex items-center justify-between gap-4',
    paypalLogoCircle: 'flex items-center justify-center rounded-full bg-white h-12 w-12',
    paypalLogoImage: 'h-8 w-auto object-contain',
    paypalTitle: 'text-sm font-semibold text-slate-900 sm:text-base',
    paypalMeta: 'space-y-2 text-xs text-slate-700 sm:text-sm',
    paypalMetaRow: 'flex items-center justify-between gap-4',
    paypalMetaLabel: 'font-medium',
    paypalMetaValue: 'font-semibold text-slate-900',
    notesGrid: 'mt-4 grid gap-6 text-xs leading-relaxed text-slate-600 sm:grid-cols-2 sm:text-sm',
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
    subtitle: 'mt-4 max-w-xl text-slate-900-200',
    statsRow: 'mt-7 flex items-center gap-8 text-slate-900-200',
    statGroup: 'flex items-center gap-3',
    statIconCircle: 'flex h-11 w-11 items-center justify-center rounded-full bg-white',
    statIcon: 'h-5 w-5 text-slate-900',
    statValue: 'text-3xl font-extrabold leading-tight text-slate-900',
    statLabel: 'text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-900',
    statsDivider: 'h-11 w-px bg-white/60',

    // kanan
    rightCol: 'relative z-10 flex flex-col',
    countdownCard:
      'rounded-2xl bg-white/95 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.45)] ring-1 ring-slate-200/70',
    countdownEyebrow: 'text-xs font-semibold uppercase tracking-[0.18em] text-primary',
    countdownGrid: 'mt-5 grid grid-cols-4 gap-2 sm:gap-3',
    countdownItem:
      'flex flex-col items-center justify-center rounded-2xl bg-slate-50 px-2 py-3 ring-1 ring-slate-200',
    countdownValue: 'text-lg font-extrabold tracking-tight text-slate-900 sm:text-2xl',
    countdownLabel:
      'mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-[11px]',
    note: 'mt-4 text-center text-[11px] text-slate-500 sm:text-xs',
  },
};
