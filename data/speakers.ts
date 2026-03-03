// data hardcode dulu ya biar rapi, nanti gampang diubah kalau udah ada CMS
export type SpeakerMeta = {
  name: string;
  role: string;
  org: string;
  bio?: string;
  expertise?: string[];
  contact?: {
    email?: string;
    website?: string;
    socials?: { label: string; href: string }[];
  };
};

export const SPEAKERS: Record<string, SpeakerMeta> = {
  'kyoka-sugahara': {
    name: 'Kyoka Sugahara',
    role: 'CEO of BuzzSell',
    org: 'BuzzSell',
    bio:
      'Kyoka Sugahara was born in Kyoto and grew up in the Kansai region, moving between Kyoto, Hyogo, and Osaka. In April 2019, she entered Keio University, initially in the Faculty of Pharmacy, before transferring to the Faculty of Science and Technology in April 2020, from which she graduated in March 2023. In April 2023, Kyoka joined Unilever Japan in a marketing role, working across both premium and mass-market haircare brands. After resigning in January 2024, she founded her own company in June 2024, specializing in marketing support for companies seeking to engage Gen Z. She currently collaborates primarily with Japan-based teams of global companies, providing services in influencer marketing, event planning and management, sponsorship facilitation, and live commerce.',
    expertise: ['Marketing', 'Youth', 'Leadership', 'Digital Creative'],
  },
  'fawad-afridi': {
    name: 'Fawad Afridi',
    role: 'CEO of Scholarships Corner',
    org: 'Scholarships Corner',
    bio:
      "Muhammad Fawad Afridi is a globally recognized youth leader, education advocate, and the visionary founder of Scholarships Corner—a platform that has empowered thousands of students and professionals around the world by providing free access to scholarships, internships, conferences, and international opportunities. Born out of personal struggle and rejection, Fawad turned adversity into a global movement, building one of the most influential opportunity-sharing platforms worldwide. He has represented Pakistan as an international speaker and delegate at high-level youth and policy events across the United States, France, Spain, Hungary, Turkey, Thailand, and Morocco. A recipient of the U.S. Embassy’s Distinguished Alumni Award and a proud Global UGRAD exchange program alumnus, Fawad is a passionate advocate for youth empowerment, inclusive education, and equitable access to opportunity. His work has inspired the creation of similar platforms far beyond Pakistan—demonstrating that a mission fueled by purpose can transform lives globally. In recognition of his impact, he has also been honored by the Pakistan-U.S. Alumni Network (PUAN) and the U.S. Embassy for his achievements with Scholarships Corner.",
    expertise: ['Education', 'Leadership'],
  },
  'ayik-abdillah': {
    name: 'Ayik Abdillah',
    role: 'PhD Student at Kyoto University',
    org: 'Kyoto University',
    bio:
      'Abdillah is a PhD candidate at the Department of Environmental Engineering, Graduate School of Engineering, Kyoto University. His research focuses on advancing anaerobic digestion technology using palm oil mill effluent (POME) as a substrate, with particular emphasis on Direct Interspecies Electron Transfer (DIET) and the role of conductive materials in enhancing methane production. Beyond academia, he has served as a lecturer at Universitas Indonesia and actively contributes to international collaborations under programs such as JICA SATREPS. In addition, he is the Chairman of PPI Kyoto 2025, where he leads initiatives to strengthen cultural diplomacy and academic exchange between Indonesia and Japan, including flagship international events such as Malam Indonesia 2025 and the 9th Sustain Conference. Abdillah is also actively engaged in collaborative research between Kyoto University and Universitas Indonesia, focusing on the development of anaerobic digesters and the utilization of by-products as renewable fuels through microalgae cultivation. His academic journey has been enriched by publications in international journals and presentations at global conferences, where he seeks to bridge scientific innovation with practical applications in renewable energy and sustainable waste management. Through these combined roles, he strives to contribute not only to advancing environmental engineering research but also to fostering stronger academic and cultural ties between Indonesia, Japan, and the global community.',
    expertise: ['Engineering', 'Environment', 'Education', 'Leadership'],
  },
};
