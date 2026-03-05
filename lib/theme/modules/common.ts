export const commonTheme = {
  infoStrip: {
    background: 'bg-primary text-primary-foreground',
    divider: 'lg:border-blue-800/60',
    iconCircle:
      'flex aspect-square h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-primary/100/80 bg-primary/100/30',
    icon: 'h-5 w-5 text-white',
    subtitle: 'text-sm font-semibold uppercase tracking-wider text-primary/60',
  },
  chatWidget: {
    wrapper: 'fixed bottom-4 right-3 z-50 sm:bottom-6 sm:right-6',
    panel:
      'absolute bottom-[4.25rem] right-0 w-[min(360px,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.25)] sm:bottom-[4.25rem]',
    panelHeader:
      'flex items-start justify-between gap-3 border-b border-slate-100 bg-white px-4 py-3',
    panelTitle: 'text-sm font-extrabold uppercase tracking-wide text-slate-900',
    panelSubtitle: 'mt-0.5 text-[11px] text-slate-500',
    closeButton:
      'inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/60',

    messages: 'max-h-[340px] overflow-y-auto px-4 py-3',
    messageRow: 'flex py-1',
    messageBubbleBase: 'max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed',
    messageBubbleAssistant: 'bg-slate-100 text-slate-800',
    messageBubbleUser: 'bg-primary text-white',

    inputRow: 'flex items-center gap-2 border-t border-slate-100 bg-white px-3 py-3',
    input:
      'h-10 flex-1 rounded-full border border-slate-200 bg-white px-4 text-xs text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-primary/100 focus:outline-none focus:ring-2 focus:ring-primary/30',
    sendButton:
      'inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-sm ring-1 ring-primary/40 transition hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/60',

    fab: 'relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg ring-1 ring-primary/40 transition hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/60',
    fabIcon: 'h-5 w-5',
    fabBadge: 'absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-white ring-2 ring-primary',
  },
  heroSection: {
    breadcrumbWrapper:
      'pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2 sm:bottom-4 md:bottom-5',
    breadcrumbMobileOuter: 'pointer-events-auto sm:hidden',
    breadcrumbMobilePill:
      'max-w-[calc(100vw-3rem)] rounded-full border border-white/20 bg-black/20 px-3 py-1.5 shadow-sm shadow-black/10 backdrop-blur',
    breadcrumbMobileRow: 'flex items-center justify-center gap-1.5',
    breadcrumbMobileLink:
      'max-w-[12rem] truncate rounded-full px-2 py-0.5 text-[11px] font-semibold text-white/95 hover:bg-white/10',
    breadcrumbMobileSep: 'text-[11px] font-semibold text-white/60',
    breadcrumbDesktopOuter:
      'pointer-events-auto hidden items-stretch overflow-hidden rounded-md border border-white/30 bg-white/15 shadow-sm shadow-black/10 sm:inline-flex',
    breadcrumbDesktopLink: 'px-5 py-2 text-xs font-semibold text-white hover:bg-white/10',
    breadcrumbDesktopSep: 'w-px bg-white/30',
  },
  videoSection: {
    badge:
      'inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow whitespace-nowrap',
    sectionWrapper: 'relative w-full bg-[#ffffff72] py-16 sm:py-20',
    card: 'mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8',
    subtitle: 'mx-auto -mt-6 mb-8 max-w-2xl text-center text-sm text-slate-600 sm:text-base',
    // Disederhanakan: hilangkan card pembungkus luar, biarkan konten grid biasa
    inner: 'grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-8',
    mainVideoWrapper: 'relative overflow-hidden rounded-xl bg-slate-900/5',
    mainIframe: 'absolute inset-0 h-full w-full rounded-xl border-0',
    listWrapper: 'flex flex-col gap-3',
    yearTabsWrapper:
      'mb-3 inline-flex max-w-full overflow-x-auto rounded-full bg-slate-100 p-1 text-xs',
    yearTab:
      'inline-flex min-w-[64px] items-center justify-center rounded-full px-3 py-1 text-[11px] font-semibold text-slate-600 transition hover:text-slate-900',
    yearTabActive: 'bg-primary text-white shadow-sm',
    listCard:
      'flex cursor-pointer items-center gap-3 rounded-xl bg-slate-50/90 p-3 text-left transition hover:bg-slate-100 border border-transparent',
    listCardActive: 'border-primary/40 bg-primary/10 shadow-[0_12px_30px_rgba(15,23,42,0.12)]',
    thumbnailWrapper: 'relative h-16 w-28 overflow-hidden rounded-lg bg-slate-200 flex-shrink-0',
    thumbnailImg: 'object-cover',
    listTitle: 'text-sm font-semibold text-slate-900',
    listMeta: 'mt-0.5 text-xs text-slate-500',
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
    item: 'flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.18)]',
    itemIconCircle:
      'grid aspect-square h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-[var(--brand-accent)] text-[var(--brand-accent-foreground)] shadow-[0_6px_20px_rgba(236,72,153,0.55)]',
    itemTitle: 'text-sm font-semibold',
    itemSubtitle: 'text-xs text-slate-600 break-words',
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
      'ml-3 w-full border-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0',
    layoutGrid: 'grid items-start gap-8 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)]',
    tabsCard:
      'w-full overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)] ring-1 ring-primary/20',
    tabsNav: 'flex flex-col divide-y divide-slate-100',
    tabButtonBase:
      'relative flex items-center gap-3 px-5 py-4 text-left text-sm font-semibold transition-colors sm:px-6 sm:text-base',
    tabButtonActive: 'bg-white text-slate-900',
    tabButtonInactive: 'bg-white text-slate-500 hover:bg-primary/10 hover:text-slate-900',
    tabIndicatorActive: 'h-9 w-0.5 rounded-full bg-primary',
    tabIndicatorIdle: 'h-9 w-0.5',
    faqListWrapper: 'space-y-3',
    emptyCard:
      'rounded-2xl bg-white px-5 py-6 text-sm text-slate-600 shadow-[0_10px_35px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 sm:px-6',
    faqItemCard:
      'overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(15,23,42,0.1)] ring-1 ring-slate-200',
    faqItemHeader: 'flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6',
    faqQuestion: 'text-base font-extrabold text-slate-900 sm:text-lg',
    faqAnswer: 'px-5 pb-5 text-sm leading-6 text-slate-700 sm:px-6',
    toggleIcon:
      'shrink-0 rounded-full bg-primary/10 p-2 text-primary ring-1 ring-primary/30 transition group-open:rotate-180',
  },
  ctaCard: {
    card: "relative flex w-full max-w-md flex-col items-center justify-center overflow-hidden rounded-2xl bg-[url('/img/bgourprogram.png')] bg-cover bg-center p-10 shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-primary/20 transition hover:-translate-y-0.5 hover:shadow-[0_16px_60px_rgba(2,6,23,0.12)] hover:ring-primary/30",
    iconCircle: 'mb-3 grid h-16 w-16 place-items-center rounded-full bg-primary text-white shadow',
  },
  footer: {
    sectionWrapper: 'relative w-full bg-[var(--brand-accent)] py-12 text-white sm:py-16',
    navLink: 'transition hover:opacity-80',
    contactLink: 'transition hover:opacity-80',
    socialLink: 'transition hover:opacity-80',
    newsletterButton:
      'bg-[var(--brand-accent)] px-4 text-sm font-semibold text-white transition hover:opacity-90',
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
};
