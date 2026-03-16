export type RecognitionProofItem = {
  iconKey:
    | 'ministry'
    | 'university'
    | 'official_partners'
    | 'legal_recognition'
    | 'registered_entity'
    | 'ip_protection'
    | 'media_coverage'
    | 'award_winning'
    | 'global_alumni';
  title: string;
  subtitle: string;
  bullets?: string[];
};

export type RecognitionHakiInfo = {
  href: string;
  brand: string;
  regNo: string;
  status: string;
  classText: string;
  owner: string;
  logoUrl?: string;
};

export type RecognitionContent = {
  title: string;
  subtitle: string;
  proofs: RecognitionProofItem[];
  haki: RecognitionHakiInfo;
};

export const recognitionContent: RecognitionContent = {
  title: 'Recognition',
  subtitle:
    'Proof that our program and organization are legitimate and credible.',
  proofs: [
    {
      iconKey: 'ministry',
      title: 'Recognized by Ministry',
      subtitle: 'Endorsements or acknowledgements from relevant government bodies',
      bullets: ['Compliance-ready', 'Letters/acknowledgements'],
    },
    {
      iconKey: 'university',
      title: 'Supported by Universities',
      subtitle: 'Backed by reputable higher education institutions',
      bullets: ['Academic support', 'Guest lecturers'],
    },
    {
      iconKey: 'official_partners',
      title: 'Official Partners',
      subtitle: 'Formal collaborations with trusted organizations',
      bullets: ['MoU/LoI', 'Program collaboration'],
    },
    {
      iconKey: 'legal_recognition',
      title: 'Legal Recognition',
      subtitle: 'Meets formal compliance and regulatory standards',
      bullets: ['Policies & SOP', 'Auditable process'],
    },
    {
      iconKey: 'registered_entity',
      title: 'Registered Entity',
      subtitle: 'Tax ID, foundation or other legal registration',
      bullets: ['NPWP / Yayasan', 'Valid documents'],
    },
    {
      iconKey: 'ip_protection',
      title: 'IP & Legal Protection',
      subtitle: 'Trademark registered at DJKI (Indonesia)',
    },
    {
      iconKey: 'media_coverage',
      title: 'Media Coverage',
      subtitle: 'Featured by national and international outlets',
      bullets: ['Online features', 'TV/Press'],
    },
    {
      iconKey: 'award_winning',
      title: 'Award-Winning',
      subtitle: 'Winners of international recognitions & awards',
      bullets: ['International awards', 'Jury selection'],
    },
    {
      iconKey: 'global_alumni',
      title: 'Global Alumni Network',
      subtitle: 'Active community of alumni collaborating across countries',
      bullets: ['Ongoing initiatives', 'Cross-border projects'],
    },
  ],
  haki: {
    href: 'https://pdki-indonesia.dgip.go.id/detail/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    brand: 'JAPAN YOUTH SUMMIT',
    regNo: 'IDM001273026',
    status: '(TM) Registered',
    classText: '41 -A look back at past Japan Youth Summit editions Education, seminars, conferences, cultural events, etc.',
    owner: 'MUHAMMAD ALDI SUBAKTI (ID)',
    logoUrl: '/img/jysfix.png',
  },
};

export const getRecognitionIconByKey = (key: RecognitionProofItem['iconKey']) => {
  switch (key) {
    case 'ministry':
      return 'Building2';
    case 'university':
      return 'University';
    case 'official_partners':
      return 'BadgeCheck';
    case 'legal_recognition':
      return 'ShieldCheck';
    case 'registered_entity':
      return 'FileText';
    case 'ip_protection':
      return 'Scale';
    case 'media_coverage':
      return 'Newspaper';
    case 'award_winning':
      return 'Trophy';
    case 'global_alumni':
      return 'Users';
    default:
      return 'BadgeCheck';
  }
};
