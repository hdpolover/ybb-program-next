export type ProgramsSchedulesCopy = {
  headerEyebrow: string;
  headerTitle: string;
  headerSubtitleFallback: string;
  columnDateRange: string;
  columnStatus: string;
  columnName: string;
  columnDescription: string;
  dataNotAdded: string;
  notePrefix: string;
  noteBody: string;
};

export const PROGRAMS_SCHEDULES_COPY: ProgramsSchedulesCopy = {
  headerEyebrow: 'Program Schedules',
  headerTitle: 'Key dates and important deadlines',
  headerSubtitleFallback: 'Data not added',
  columnDateRange: 'Date Range',
  columnStatus: 'Status',
  columnName: 'Schedule Name',
  columnDescription: 'Description',
  dataNotAdded: 'Data not added',
  notePrefix: 'Important:',
  noteBody:
    'All dates and deadlines are subject to change. Please check this page regularly for the most up-to-date information.',
};
