export const dashboardTheme = {
  dashboardLayout: {
    sidebarWrapper:
      'sticky top-0 flex h-screen w-[260px] shrink-0 flex-col border-r border-slate-200 bg-primary px-3 py-6',
    sidebarLogoRow: 'mb-5 flex justify-start',
    sidebarLogoImageWrapper: 'relative h-14 w-32',
    sidebarMainColumn: 'flex flex-1 flex-col justify-between gap-4',
    sidebarNavWrapper: 'w-full space-y-1',
    navGroupWrapper: 'space-y-1',
    navParentButtonBase:
      'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition',
    navParentButtonActive: 'bg-white text-primary ring-1 ring-primary/30',
    navParentButtonInactive: 'text-white/85 hover:bg-white/10',
    navParentLabelRow: 'flex items-center gap-2',
    navParentChevron: 'h-4 w-4 transition-transform',
    navLinkBase:
      'flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition',
    navLinkActive: 'bg-white text-primary ring-1 ring-primary/30',
    navLinkInactive: 'text-white/85 hover:bg-white/10',
    navActiveDot: 'inline-block h-2 w-2 rounded-full bg-primary',
    navSubmenuGrid: 'grid transition-all ml-3 pl-3',
    navSubmenuInner: 'min-h-0 border-l border-slate-200 pl-2',
    navSubLinkBase: 'block rounded-lg px-2 py-1.5 text-[13px] font-medium transition',
    navSubLinkActive: 'bg-white text-primary ring-1 ring-primary/30',
    navSubLinkInactive: 'text-white/80 hover:bg-white/10 hover:text-white',
    profileSectionWrapper: 'mt-4 space-y-3 border-t border-white/30 pt-4 text-sm text-white/90',
    profileRow: 'flex items-center gap-3',
    profileAvatarWrapper:
      'relative h-9 w-9 overflow-hidden rounded-full bg-white/90 ring-2 ring-white/60',
    profileAvatarImage: 'object-cover',
    profileName: 'text-sm font-semibold leading-tight',
    profileBadge:
      'mt-0.5 inline-flex items-center rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
    profileActionButton:
      'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium text-white/90 transition hover:bg-white/10',
    profileActionLabelRow: 'flex items-center gap-2',
  },
  dashboardSearch: {
    resultsWrapper: 'mt-5 space-y-3',
    summaryText: 'text-xs text-slate-500 sm:text-sm',
    summaryKeyword: 'font-semibold text-primary',
    list: 'space-y-3',
    itemCard:
      'rounded-2xl bg-white p-4 text-sm text-slate-800 shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200',
    itemInnerRow: 'flex items-start gap-3',
    itemIconCircle:
      'mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary',
    itemIcon: 'h-4 w-4',
    itemTitle: 'text-sm leading-relaxed text-slate-800',
    itemHighlight: 'font-semibold text-primary',
    itemBreadcrumb: 'mt-2 text-[11px] text-slate-500',
    itemBreadcrumbActive: 'font-semibold text-primary',
    emptyWrapper: 'flex min-h-[220px] flex-col items-center justify-center space-y-3 text-center',
    emptyIconCircle:
      'inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-rose-300 bg-rose-50 text-rose-500',
    emptyIcon: 'h-7 w-7',
    emptyKeyword: 'font-semibold text-primary',
    emptyTextMain: 'text-sm text-slate-700',
    emptyTextSub: 'text-xs text-slate-500',
  },
  dashboardDocuments: {
    sectionWrapper: 'space-y-6',
    tabsWrapper:
      'inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 text-sm font-medium text-slate-600',
    tabButton:
      'rounded-full px-4 py-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/100 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50',
    tabButtonActive: 'bg-white text-primary shadow-sm',
    tabButtonInactive: 'text-slate-600 hover:text-slate-900 hover:bg-white/60',
    tableCard:
      'overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200',
    tableHeader:
      'items-center gap-4 bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white',
    tableHeaderSortButton: 'flex items-center gap-1 text-left',
    tableHeaderSortButtonRight: 'ml-auto flex items-center gap-1 text-right',
    tableHeaderSortIcon: 'text-[10px] leading-none',
    tableBody: 'divide-y divide-slate-100 bg-white',
    tableRow: 'items-center gap-4 px-6 py-3 text-sm text-slate-700 hover:bg-slate-50/80',
    docNameCell: 'truncate font-semibold text-slate-900',
    docDescriptionCell: 'truncate text-slate-600',
    docTypeCell: 'text-slate-700',
    actionCell: 'flex justify-end',
    downloadButton:
      'inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-primary',
    emptyStateWrapper:
      'flex min-h-[260px] flex-col items-center justify-center bg-slate-50 px-6 py-10 text-center',
    emptyStateImageWrapper: 'mb-4 flex items-center justify-center',
    emptyStateTitle: 'text-base font-extrabold text-slate-900',
    emptyStateText: 'mt-1 max-w-md text-sm text-slate-600',
    certificatesSectionWrapper: 'space-y-4 pt-4',
    certificatesTitle: 'text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl',
    certificatesSubtitle: 'mt-1 max-w-2xl text-xs text-slate-500 sm:text-sm',
    statusBadgeBase: 'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1',
    statusApproved: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    statusOngoing: 'bg-primary/5 text-primary ring-primary/20',
    statusDefault: 'bg-slate-50 text-slate-700 ring-slate-200',
  },
  dashboardPayments: {
    sectionWrapper: 'space-y-6',
    breadcrumbNav: 'text-xs font-semibold uppercase tracking-wide text-slate-500',
    breadcrumbLink: 'text-slate-700 hover:text-slate-900',
    breadcrumbSeparator: 'mx-1.5 text-slate-400',
    breadcrumbCurrent: 'text-primary',
    headingRow: 'mt-2 flex items-center justify-between gap-3',
    headingTitle: 'text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl',
    backButton:
      'inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm hover:bg-slate-50',
    layoutGrid: 'mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)]',
    detailLayoutGrid: 'grid gap-6 lg:grid-cols-[1fr,360px]',
    currencyInfoCard:
      'flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 shadow-sm',
    currencyInfoIcon: 'mt-0.5 h-4 w-4 text-amber-500',
    currencyInfoTitle: 'text-[11px] font-semibold uppercase tracking-wide text-amber-700',
    currencyInfoBody: 'space-y-1 text-xs',
    sectionBodyText: 'text-sm text-slate-700',
    fieldLabelSmall: 'text-[11px] font-semibold uppercase tracking-wide text-slate-500',
    pillSelectWrapper: 'space-y-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500',
    pillSelect:
      'h-8 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium tracking-normal text-slate-800 shadow-sm sm:min-w-[320px]',
    selectionSummaryRow: 'mt-1 flex items-center gap-2 text-xs font-medium text-slate-700',
    bankMethodGrid:
      'mt-1 grid grid-cols-2 gap-2 text-[11px] font-normal text-slate-600 sm:grid-cols-3',
    bankMethodCard:
      'flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 shadow-sm transition hover:border-primary/40 hover:shadow-md focus:outline-none',
    bankMethodCardSelected: 'border-primary/100 ring-2 ring-primary/30',
    bankMethodLogoWrapper: 'flex h-10 w-full items-center justify-center',
    bankMethodLogoImage: 'max-h-8 w-auto',
    stepWrapper: 'space-y-3 text-sm text-slate-700',
    stepRow: 'flex gap-3',
    stepNumberCircle:
      'mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white shadow-sm',
    stepTextTitle: 'font-semibold text-slate-900',
    stepTextBody: 'mt-1 text-sm text-slate-700',
    manualPaymentWrapper: 'space-y-5 text-sm text-slate-700',
    manualNote: 'rounded-md bg-amber-50 p-3 text-xs text-amber-900 ring-1 ring-amber-200',
    bankDetailsGrid: 'grid gap-3 text-xs text-slate-700 sm:grid-cols-2',
    bankDetailsTerm: 'font-semibold text-slate-500',
    bankDetailsValue: 'mt-1 font-medium text-slate-900',
    agreementCard:
      'space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 shadow-sm',
    agreementTitle: 'mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500',
    agreementRowBrand:
      'flex items-center gap-3 rounded-md bg-primary/10 px-3 py-2 text-xs text-slate-700 ring-1 ring-primary/20',
    agreementRowIndigo:
      'flex items-center gap-3 rounded-md bg-primary/5 px-3 py-2 text-xs text-slate-700 ring-1 ring-primary/20',
    agreementCheckboxBrand: 'h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/100',
    agreementCheckboxIndigo:
      'h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary',
    agreementRowInner: 'flex items-center gap-2',
    completeButtonWrapper: 'pt-2 flex justify-center',
    completeButtonBase:
      'inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-wide shadow-sm transition',
    completeButtonEnabled: 'bg-primary text-white hover:bg-primary',
    completeButtonDisabled: 'bg-slate-200 text-slate-500 cursor-not-allowed',
    detailPrimaryCard:
      'rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200',
    detailEmptyStateCard:
      'rounded-2xl bg-white p-6 text-center shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200',
    detailEmptyStateIconWrapper: 'mx-auto mb-3 text-primary',
    detailEmptyStateTitle: 'text-sm font-extrabold text-slate-900',
    detailEmptyStateBody: 'mt-1 text-sm text-slate-600',
    detailEmptyStateButton:
      'mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-primary',
    detailSideCardOuter:
      'overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200',
    detailSideCardHeader: 'px-5 py-3',
    detailSideCardTitle: 'text-sm font-extrabold text-slate-900',
    detailSideCardBody: 'space-y-4 px-5 pb-5',
    detailIllustrationWrapper: 'flex flex-col items-center text-center',
    detailIllustrationImageWrapper: 'mb-4 flex h-44 w-full items-center justify-center',
    detailIllustrationImage: 'h-auto w-auto max-h-44',
    detailIllustrationTitle: 'mt-3 text-sm font-extrabold text-slate-900',
    detailIllustrationBody: 'mt-1 text-sm text-slate-600',
    detailMakePaymentButton:
      'inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary',
    detailMakePaymentInner: 'inline-flex w-full items-center justify-center gap-2',
    detailQuickActionsBody: 'space-y-2 px-5 pb-5',
    detailQuickPrimaryButton:
      'inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800',
    detailQuickSecondaryLink:
      'inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-semibold text-primary ring-1 ring-primary/20 transition hover:bg-primary/20',
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
    categoryBulletIconPrimary: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    categoryBulletIconSecondary: 'bg-primary/10 text-primary ring-primary/20',
    categoryBulletIconTertiary: 'bg-violet-50 text-violet-600 ring-violet-100',
    categoryBulletIconInner: 'h-3 w-3',
    categoryPrimaryCta:
      'inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
    tableCard:
      'rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]',
    tableHeaderRow: 'mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
    tableTitle: 'text-sm font-extrabold uppercase tracking-wide text-slate-700',
    tableSubtitle: 'mt-1 text-xs text-slate-500',
    tableControlsWrapper: 'flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4',
    tableShowWrapper: 'flex items-center gap-2 text-xs text-slate-600',
    tableShowSelect:
      'h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary/100',
    tableSearchWrapper:
      'flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600',
    tableSearchInput:
      'w-40 border-none bg-transparent text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0 sm:w-52',
    tableOuter: 'overflow-x-auto',
    table: 'min-w-full text-left text-sm',
    tableHeadRow: 'bg-primary text-xs font-semibold uppercase tracking-wide text-white',
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
      'inline-flex h-7 w-7 items-center justify-center rounded-md border border-primary bg-primary text-slate-50 shadow-sm transition hover:bg-primary',
    secondaryIconButton:
      'inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-700 shadow-sm transition hover:bg-slate-100',
    tertiaryIconButton:
      'inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50',
    tableFooterText: 'mt-3 text-xs text-slate-500',
    historyListWrapper: 'p-0',
    historyList: 'divide-y divide-slate-100',
    historyListItem: 'p-4',
    historyListItemHeader: 'flex items-start gap-3',
    historyStatusIconCircle: 'grid h-7 w-7 place-items-center rounded-full ring-1',
    historyTitle: 'text-sm font-semibold text-slate-900',
    historyMetaRow: 'mt-1 flex flex-wrap items-center gap-2',
    historyNote: 'mt-2 text-sm text-slate-700',
    historyViewDetailsButton:
      'rounded-md border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10',
    historyPaginationRow: 'flex items-center justify-between border-t border-slate-100 px-4 py-2',
    historyPaginationText: 'text-xs text-slate-600',
    historyPaginationButton:
      'rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50',
    historyPaginationPageLabel: 'text-xs text-slate-600',
    historyModalOverlay: 'fixed inset-0 z-[100]',
    historyModalBackdrop: 'absolute inset-0 bg-black/30 transition-opacity duration-200',
    historyModalCard:
      'absolute inset-x-0 top-10 mx-auto w-[min(680px,92vw)] rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-slate-200 transition-all duration-200',
    historyModalHeaderRow: 'mb-3 flex items-center justify-between',
    historyModalHeaderTitle: 'text-sm font-semibold text-slate-600',
    historyModalHeaderCloseButton:
      'rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50',
    historyModalSectionBody: 'mt-2 space-y-2 text-sm text-slate-700',
    historyProofImageWrapper: 'mt-2 space-y-2',
    historyProofImageInner:
      'relative max-h-72 w-full overflow-hidden rounded-md ring-1 ring-slate-200',
    historyProofImage: 'h-auto w-full object-contain',
    historyProofActionsRow: 'flex gap-2',
    historyProofLinkButton:
      'rounded-md border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10',
    historyProofDownloadButton:
      'rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary',
    historyEmptyProofText: 'mt-2 text-sm text-slate-600',
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
      'flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/30',
    registrationBodyWrapper: 'flex-1 space-y-3',
    registrationHeaderRow: 'flex flex-wrap items-baseline justify-between gap-3',
    registrationTitle: 'text-sm font-extrabold uppercase tracking-wide text-slate-700',
    registrationSubtitle: 'mt-1 text-xs font-semibold uppercase tracking-wide text-primary',
    registrationDescription: 'text-sm leading-relaxed text-slate-700',
    registrationFooterRow:
      'mt-3 flex flex-col items-start gap-3 border-t border-slate-100 pt-3 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between',
    registrationSwitchIconCircle:
      'mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500',
    registrationSwitchText: 'max-w-xl text-xs leading-relaxed text-slate-700 sm:text-sm',
    registrationSwitchButton:
      'inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',

    // program details + progress overview
    programCard:
      'rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]',
    programHeaderRow: 'mb-4 flex items-center justify-between gap-3',
    programTitle: 'text-sm font-extrabold uppercase tracking-wide text-slate-700',
    programSubtitle: 'mt-1 text-xs text-slate-500',
    programGrid: 'grid gap-4 md:grid-cols-2',

    progressSeeDetailsButton:
      'inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',

    // compact overview summary (Your Progress card)
    progressSummaryWrapper: 'mt-4',
    progressSummaryMainCol: 'space-y-3',
    progressBarWrapper: 'space-y-2',
    progressBarTrackOuter: 'relative h-6 w-full',
    progressBarTrack:
      'absolute bottom-0 left-0 right-0 h-2 w-full overflow-hidden rounded-full bg-slate-100',
    progressBarFill:
      'h-full rounded-full bg-gradient-to-r from-primary to-primary/60 shadow-[0_0_0_1px_rgba(248,250,252,0.8)]',
    progressStepLabelRow: 'flex items-center justify-between text-xs',
    progressStepChipFloating: 'absolute -top-5 translate-x-[-50%]',
    progressStepChip:
      'inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary ring-1 ring-primary/30',

    progressCurrentDetailWrapper: 'space-y-1 text-sm',
    progressStatusPill:
      'inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-700 ring-1 ring-amber-200',
    progressCurrentTitle: 'text-sm font-semibold text-slate-900',
    progressCurrentBody: 'text-xs leading-relaxed text-slate-600',
    progressMetaList: 'mt-2 space-y-1 text-xs',
    progressMetaItem: 'flex items-start gap-2',
    progressMetaIcon: 'mt-[2px] h-3.5 w-3.5 text-slate-400',
    progressMetaLabel: 'font-semibold text-slate-700',

    // detailed progress page
    progressDetailHeaderRow: 'mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
    progressDetailTitle:
      'text-base font-extrabold uppercase tracking-wide text-slate-800 sm:text-lg',
    progressDetailSubtitle: 'mt-1 max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-sm',
    progressDetailCurrentChip:
      'inline-flex max-w-md flex-col rounded-2xl bg-primary/10 px-4 py-3 text-xs text-primary ring-1 ring-primary/30 sm:text-sm',
    progressDetailCurrentLabel: 'text-[11px] font-semibold uppercase tracking-wide text-primary',
    progressDetailCurrentValue: 'mt-0.5 text-xs font-semibold text-primary sm:text-sm',

    // detailed progress page timeline (vertical)
    progressDetailListWrapper: 'mt-6',
    progressTimeline: 'grid grid-cols-[auto,1fr] gap-x-4 sm:gap-x-5',
    progressLineCol: 'relative col-span-1 row-span-full',
    progressLine:
      'mx-auto h-full w-px bg-gradient-to-b from-emerald-400 via-primary/60 to-slate-300',
    progressStepsCol: 'space-y-4',
    progressStepRow: 'grid grid-cols-[auto,1fr] gap-x-3 gap-y-1',
    progressStepIconCol: 'relative col-span-1 flex flex-col items-center',
    progressStepIndexCircleBase:
      'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white shadow-sm',
    progressStepIndexDone: 'bg-emerald-600',
    progressStepIndexCurrent: 'bg-primary',
    progressStepIndexUpcoming: 'bg-slate-300',
    progressStepConnector: 'mt-1 h-full w-px flex-1 bg-slate-200',
    progressStepContent: 'col-span-1 space-y-1 text-sm',
    progressStepTitle: 'text-sm font-semibold text-slate-900',
    progressStepBody: 'text-xs leading-relaxed text-slate-600',
    progressStatusChipBase:
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1',
    progressStatusChipDone: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    progressStatusChipWaiting: 'bg-primary/10 text-primary ring-primary/30',
    progressStatusChipUpcoming: 'bg-slate-50 text-slate-700 ring-slate-200',

    programSelfCard:
      'flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm',
    programSelfInner: 'space-y-3',
    programSelfHeaderRow: 'flex items-start gap-3',
    programSelfIconCircle:
      'mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100',
    programSelfTitle: 'text-base font-semibold text-slate-900',
    programSelfSubtitle: 'text-xs font-medium text-slate-500',
    programSelfSectionLabel: 'text-xs font-semibold uppercase tracking-wide text-slate-600',
    programSelfBenefitList: 'space-y-1 text-sm text-slate-700',
    programSelfBenefitItem: 'flex items-start gap-2',
    programSelfBenefitIcon: 'mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500',
    programSelfPaymentText: 'mt-1 text-sm text-slate-700',

    programFullyCard:
      'flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-violet-50/80 p-4 text-sm',
    programFullyInner: 'space-y-3',
    programFullyHeaderRow: 'flex items-start gap-3',
    programFullyIconCircle:
      'mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-700 ring-1 ring-violet-200',
    programFullyTitle: 'text-base font-semibold text-slate-900',
    programFullySubtitle: 'text-xs font-medium text-slate-500',
    programFullySectionLabel: 'text-xs font-semibold uppercase tracking-wide text-slate-600',
    programFullyBenefitList: 'space-y-1 text-sm text-slate-700',
    programFullyBenefitItem: 'flex items-start gap-2',
    programFullyBenefitIcon: 'mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500',
    programFullyPaymentText: 'mt-1 text-sm text-slate-700',

    // guidebook aside
    guideAside:
      'relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900/5 p-5 shadow-[0_10px_35px_rgba(15,23,42,0.12)]',
    guideInner: 'relative flex flex-col gap-3',
    guideHeaderWrapper: 'space-y-2',
    guideEyebrow: 'text-xs font-semibold uppercase tracking-wide text-primary',
    guideTitle: 'text-base font-extrabold text-slate-900',
    guideBodyText: 'text-xs leading-relaxed text-slate-700',
    guideLinksWrapper: 'space-y-2',
    guideLink:
      'flex items-center justify-between gap-2 rounded-full border border-primary/80 bg-transparent px-3 py-2 text-xs font-semibold text-primary shadow-sm transition hover:border-primary hover:text-primary',
    guideLeftLinkInner: 'inline-flex items-center gap-2',
    guideBadgeCircle:
      'flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white shadow-sm',
    guideBadgeText: 'leading-none',
    guideFileType: 'text-[10px] font-semibold uppercase tracking-wide text-primary',

    // notification alert
    notificationCard:
      'rounded-2xl border border-amber-200 bg-amber-50/80 p-4 shadow-[0_8px_26px_rgba(251,191,36,0.3)]',
    notificationRow: 'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
    notificationLeftRow: 'flex items-start gap-3',
    notificationIconCircle:
      'mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-amber-600 shadow-sm ring-2 ring-amber-200',
    notificationTextWrapper: 'space-y-1',
    notificationTitleRow: 'flex flex-wrap items-baseline gap-2',
    notificationEyebrow: 'text-xs font-semibold uppercase tracking-wide text-amber-700',
    notificationStatusPill:
      'inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-800',
    notificationBodyText: 'max-w-2xl text-xs leading-relaxed text-amber-900 sm:text-sm',
    notificationButton:
      'inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
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
      'absolute inset-0 overflow-hidden rounded-full bg-primary shadow-lg ring-4 ring-primary/20',
    profileAvatarImage: 'object-cover',
    profileAvatarButton:
      'absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-primary shadow-md ring-1 ring-primary/20',
    profileName: 'text-lg font-extrabold text-slate-900',
    profileRole: 'text-[11px] font-semibold uppercase tracking-wide text-primary',
    profileMeta: 'text-xs text-slate-600',
    profileMetaLabel: 'font-semibold text-slate-700',
    profileRightWrapper: 'max-w-md text-xs text-slate-600 md:text-right',
    profileRightLabel: 'text-[11px] font-semibold uppercase tracking-wide text-slate-500',
    profileRightText: 'mt-1 leading-relaxed text-slate-700',

    // read-only tabs
    tabsWrapper: 'flex flex-wrap items-center gap-2',
    tabButtonBase: 'rounded-full px-4 py-1.5 text-xs font-semibold transition ring-1',
    tabButtonActive: 'bg-primary text-white shadow-sm ring-primary/100',
    tabButtonInactive: 'bg-white/70 text-slate-700 ring-slate-200 hover:bg-white',

    // read-only sections
    readSectionWrapper: 'space-y-4',
    readSectionHeader:
      'flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-slate-700',
    readSectionIconCircle:
      'inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary',
    readSectionTitle: '',
    readSectionSubtitle: 'mt-1 text-xs text-slate-500',
    readGrid: 'grid gap-4 md:grid-cols-2',
    readFieldLabelWrapper: 'space-y-1 text-xs font-medium text-slate-700',
    readFieldLabelText: 'block text-[11px] font-semibold uppercase tracking-wide text-slate-500',
    readInputBase:
      'w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-primary/100 focus:outline-none focus:ring-2 focus:ring-primary/30 read-only:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-800 disabled:opacity-100',
    readInputWrapper: 'relative',
    readInputIcon:
      'pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center text-slate-400',

    // edit: stepper
    editSectionWrapper: 'space-y-6 text-sm',
    stepperCard:
      'rounded-2xl border border-slate-200 bg-white px-8 py-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)]',
    stepperRow: 'flex flex-col gap-6 md:flex-row md:items-center md:justify-between',
    stepperButtonBase: 'flex flex-1 flex-col items-center gap-2 text-xs focus:outline-none',
    stepperButtonLocked: 'cursor-not-allowed opacity-60',
    stepperPillRow: 'flex items-center gap-3',
    stepperCircle:
      'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition',
    stepperCircleActive: 'bg-primary text-white shadow-md',
    stepperCircleDone: 'bg-emerald-600 text-white',
    stepperCircleIdle: 'bg-slate-300 text-white',
    stepperConnectorWrapper:
      'hidden h-[2px] w-16 overflow-hidden rounded-full bg-slate-200 md:block',
    stepperConnectorBar: 'h-full rounded-full transition-all',
    stepperConnectorDone: 'w-full bg-primary/100',
    stepperConnectorActive: 'w-1/2 bg-primary/60',
    stepperConnectorIdle: 'w-0',
    stepperTextWrapper: 'space-y-1 text-center',
    stepperStepTitle: 'text-[11px] font-semibold uppercase tracking-wide text-slate-800',
    stepperStatusPill:
      'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
    stepperStatusActive: 'bg-primary/10 text-primary',
    stepperStatusDone: 'bg-emerald-50 text-emerald-600',
    stepperStatusIdle: 'bg-slate-100 text-slate-500',

    // edit: form card
    formCard:
      'rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_10px_40px_rgba(15,23,42,0.06)]',
    formSectionWrapper: 'space-y-4',
    formSectionTitle: 'text-sm font-extrabold uppercase tracking-wide text-slate-700',
    formSectionSubtitle: 'mt-1 text-xs text-slate-500',
    formGrid: 'grid gap-4 md:grid-cols-2',
    editFieldLabelWrapper: 'space-y-1 text-xs font-medium text-slate-700',
    editFieldLabelText: 'block text-[11px] font-semibold uppercase tracking-wide text-slate-500',
    editInputWrapper: 'relative',
    editInputIcon:
      'pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center text-slate-400',
    editInputBase:
      'w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-primary/100 focus:outline-none focus:ring-2 focus:ring-primary/30',
    editInputError: 'border-red-500 focus:border-red-500 focus:ring-red-200',
    errorText: 'mt-1 text-[11px] text-red-600',

    // edit: helper panels
    helperPanelWrapper:
      'grid gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-5 text-xs text-slate-700 md:grid-cols-2',
    helperTitle: 'text-xs font-semibold uppercase tracking-wide text-slate-800',
    helperBodyText: 'mt-1 text-[12px]',
    helperList: 'mt-2 space-y-1.5',
    helperListItem: 'flex items-start gap-1.5',
    helperListIcon: 'mt-[2px] h-3 w-3 text-primary/100',

    // edit: essay guidelines panel (image helper, currently unused but kept)
    essayPanelWrapper:
      'mt-5 grid gap-5 rounded-2xl border border-primary/20 bg-primary/10/40 p-5 text-xs text-slate-700 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]',
    essayPanelTitle: 'text-xs font-semibold uppercase tracking-wide text-primary',
    essayPanelBody: 'mt-1 text-[12px] text-slate-700',
    essayPanelList: 'mt-2 space-y-1.5',
    essayPanelListItem: 'flex items-start gap-1.5',
    essayPanelListIcon: 'mt-[2px] h-3 w-3 text-primary/100',
    essayImageWrapper:
      'relative h-32 w-full overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-primary/20 sm:h-40',
    essayImage: 'h-full w-full object-cover',

    // edit: essay fields
    essayFormGrid: 'mt-5 grid gap-4 md:grid-cols-2',
    essayTextarea:
      'w-full min-h-[120px] resize-vertical rounded-lg border border-slate-400 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-primary/100 focus:outline-none focus:ring-2 focus:ring-primary/30',

    // edit: essay guidelines summary & note & guidebook CTA
    essaySummaryWrapper: 'mt-10 space-y-4 text-sm text-slate-700',
    essaySummaryTitle: 'text-base font-semibold text-slate-900',
    essaySummaryBody: 'mt-1 text-[13px] text-slate-700',
    essaySummaryBodySmall: 'mt-1 text-[12px] text-slate-700',
    essayNoteBanner:
      'mt-2 flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-[12px] text-amber-800',
    essayNoteIconCircle:
      'inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-amber-500 ring-1 ring-amber-200',
    essayGuidebookCard:
      'mt-3 relative flex items-center overflow-hidden rounded-2xl border border-primary/20 min-h-[250px]',
    essayGuidebookInner: 'relative z-10 w-full px-6 py-5',
    essayGuidebookBackgroundImage: 'absolute inset-0 h-full w-full object-cover',
    essayGuidebookOverlay: 'absolute inset-0 bg-transparent',
    essayGuidebookGrid:
      'grid items-center gap-5 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)_minmax(0,1fr)]',
    essayGuidebookTitle: 'text-left text-sm font-bold uppercase tracking-wide text-slate-800',
    essayGuidebookSubtitle: 'text-[13px] text-slate-700',
    essayGuidebookButtonRow:
      'mt-3 mx-auto flex w-full max-w-[220px] flex-col items-stretch gap-2 md:max-w-[260px]',
    twibbonListText: 'text-[12px] font-normal text-slate-700',

    // edit: twibbon action steps list (misc section)
    twibbonStepsList: 'mt-3 space-y-2 text-[12px] text-slate-700',
    twibbonStepItem: 'flex items-start gap-2',
    twibbonStepBadge:
      'mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-white',
    twibbonStepText: 'flex-1',

    // edit: main essay question section
    mainEssaySectionWrapper: 'mt-8 space-y-4 text-sm text-slate-700',
    mainEssayCounterText: 'mt-1 text-[11px] text-slate-500',

    // edit: keyword multi-select field
    keywordFieldWrapper: 'rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm',
    keywordTriggerButton: 'flex w-full items-center gap-2 text-left',
    keywordIconCircle:
      'mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-500',
    keywordChipsRow: 'flex flex-wrap items-center gap-1',
    keywordChip:
      'inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary ring-1 ring-primary/30',
    keywordChipRemove: 'cursor-pointer text-[10px]',
    keywordChevron: 'ml-2 text-slate-400',
    keywordDropdownWrapper: 'mt-2 space-y-2',
    keywordSearchInput:
      'w-full rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary/40',
    keywordOptionsList:
      'max-h-40 overflow-y-auto rounded-lg border border-slate-200 bg-white text-xs shadow-lg',
    keywordOptionItem:
      'flex w-full items-center justify-between px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50',
    keywordCounterText: 'mt-1 text-[11px] text-slate-500',

    // read-only: entry essay section
    readEssaySectionWrapper: 'mt-6 space-y-4 text-xs text-slate-700',
    readEssaySectionTitle: 'text-[11px] font-semibold uppercase tracking-wide text-slate-500',
    readEssayFieldWrapper: 'mt-1.5',
    readEssayTextarea: 'w-full text-xs',
    readEssayKeywordRow: 'flex flex-wrap gap-1',
    readEssayKeywordChip:
      'rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary ring-1 ring-primary/30',

    // edit: buttons
    buttonRow: 'flex justify-end gap-3',
    secondaryButton:
      'rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50',
    primaryButton:
      'rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
    twibbonValidateButton:
      'inline-flex h-11 min-w-[150px] items-center justify-center gap-1 rounded-md bg-primary px-5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
    shirtSizeButton:
      'inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary ring-1 ring-primary/30 shadow-sm hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2',
    shirtSizeRow: 'flex items-center gap-3',

    // edit: resume upload
    uploadOuter: 'space-y-2',
    uploadLabelSrOnly: 'sr-only',
    uploadDropzone:
      'relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-8 text-center text-xs text-slate-600 transition hover:border-primary/60 hover:bg-primary/10/40',
    uploadIcon: 'mb-3 h-8 w-8 text-primary',
    uploadTitle: 'text-[11px] font-semibold uppercase tracking-wide text-slate-800',
    uploadSubtitle: 'mt-1 text-[11px] text-slate-500',
    uploadInput: 'absolute inset-0 h-full w-full cursor-pointer opacity-0',
    uploadHintText: 'mt-1 text-[11px] text-slate-500',
    uploadHintFileName: 'font-semibold',
    modalImage: 'h-auto w-full rounded-lg object-contain',

    // edit: preview cards
    previewWrapper: 'space-y-4 text-xs text-slate-700',
    previewCard: 'rounded-xl border border-slate-200 bg-slate-50 p-4',
    previewCardHeader: 'mb-2 flex items-center justify-between gap-2',
    previewCardTitle: 'text-[11px] font-semibold uppercase tracking-wide text-slate-500',
    previewEditButton:
      'inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary',
    previewEditIcon: 'h-3.5 w-3.5',
    previewDefinitionList: 'mt-2 grid gap-2 md:grid-cols-2',
    previewDt: 'text-[11px] text-slate-500',
    previewDd: 'font-medium',
    previewDdMultiline: 'font-medium whitespace-pre-line',

    // edit: modal
    modalOverlay: 'fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 px-4',
    modalCard: 'w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl',
    modalTitle: 'text-sm font-extrabold uppercase tracking-wide text-slate-800',
    modalBody: 'mt-3 space-y-3 text-xs leading-relaxed text-slate-700',
    modalBodyHighlight: 'font-semibold text-slate-900',
    modalButtonRow: 'mt-5 flex justify-end gap-3',
    modalSecondaryButton:
      'rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50',
    modalPrimaryLink:
      'inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
  },
};
