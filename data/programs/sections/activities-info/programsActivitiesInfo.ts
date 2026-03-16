export type ProgramsActivitiesCopy = {
  // judul & subtitle default buat section activities
  headerEyebrow: string;
  headerTitle: string;
  headerSubtitleFallback: string;
  // teks fallback umum
  dataNotAdded: string;
  // catatan di bawah kartu
  notePrefix: string;
  noteBody: string;
};

export const PROGRAMS_ACTIVITIES_COPY: ProgramsActivitiesCopy = {
  headerEyebrow: 'Program Rundown',
  headerTitle: 'Program Activities',
  headerSubtitleFallback: 'Data not added',
  dataNotAdded: 'Data not added',
  notePrefix: 'Note:',
  noteBody:
    'This rundown is an estimation only. The final schedule will be updated closer to the program date. Please check back regularly for the most accurate information.',
};
