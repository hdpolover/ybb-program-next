import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { componentsTheme } from '@/lib/theme/components';

const theme = componentsTheme.programsBenefitsDetail;

export default function BenefitsHighSchoolDetail() {
  return (
    <section className={theme.sectionWrapper}>
      <div className={theme.container}>
        <div className={theme.grid}>
          {/* Left column: detailed benefits list */}
          <div className={theme.leftColumn}>
            {/* 1 */}
            <article className={theme.itemRow}>
              <div className={theme.numberCircle}>1</div>
              <div>
                <h2 className={theme.itemTitle}>
                  Relevant to Indonesian National Curriculum
                  <span className={theme.itemSubtitle}>(Deep Learning Approach)</span>
                </h2>
                <p className={theme.paragraphStrong}>
                  Supports meaningful and deep learning that emphasizes:
                </p>
                <ul className={theme.bulletList}>
                  <li>Critical and analytical thinking on real-world global issues</li>
                  <li>Problem-Based Learning (PBL) and Project-Based Learning (PjBL)</li>
                  <li>Reflection, knowledge integration, and contextual application</li>
                </ul>
                <p className={theme.paragraphStrong}>Strengthens Higher-Order Thinking Skills (HOTS) through:</p>
                <ul className={theme.bulletList}>
                  <li>Analysis of global challenges related to SDGs, sustainability, and leadership</li>
                  <li>Design of research-based social and impact-driven projects</li>
                  <li>
                    Development of 21st-century competencies: critical thinking, creativity, collaboration,
                    communication, and global literacy
                  </li>
                </ul>
              </div>
            </article>

            {/* 2 */}
            <article className={theme.itemRow}>
              <div className={theme.numberCircle}>2</div>
              <div>
                <h2 className={theme.itemTitle}>Relevance to the IB Curriculum</h2>
                <p className={theme.paragraphStrong}>
                  Supports CAS (Creativity, Activity, Service) requirements through:
                </p>
                <ul className={theme.bulletList}>
                  <li>Impact-oriented social projects</li>
                  <li>Structured reflection and international collaboration</li>
                </ul>
                <p className={theme.paragraphNormal}>
                  Aligns with inquiry-based, conceptual, and interdisciplinary learning frameworks of IB and fosters
                  global citizenship, ethical leadership, and intercultural understanding.
                </p>
              </div>
            </article>

            {/* 3 */}
            <article className={theme.itemRow}>
              <div className={theme.numberCircle}>3</div>
              <div>
                <h2 className={theme.itemTitle}>Support for the Cambridge Curriculum</h2>
                <p className={theme.paragraphStrong}>Develops Cambridge Learner Attributes:</p>
                <p className={theme.paragraphNormal}>
                  Confident, Responsible, Reflective, Innovative, and Engaged.
                </p>
                <p className={theme.paragraphStrong}>
                  Enhances research skills, global problem-solving, and academic communication.
                </p>
                <p className={theme.paragraphNormal}>
                  Strengthens international student portfolios for university preparation.
                </p>
              </div>
            </article>

            {/* 4 */}
            <article className={theme.itemRow}>
              <div className={theme.numberCircle}>4</div>
              <div>
                <h2 className={theme.itemTitle}>Curated Certificate by PUSPRENAS (Indonesia)</h2>
                <p className={theme.paragraphNormal}>
                  Participants receive a certificate curated by the Center for National Achievement (PUSPRENAS).
                </p>
                <p className={theme.paragraphStrong}>
                  This certification provides significant added value for Indonesian students in:
                </p>
                <ul className={theme.bulletList}>
                  <li>University admissions through achievement-based pathways (SNBP/SNBT)</li>
                  <li>Applications to top national and international schools and universities</li>
                  <li>National and international scholarship opportunities</li>
                  <li>
                    Official documentation of project-based learning, leadership development, and global engagement
                  </li>
                </ul>
              </div>
            </article>
          </div>

          {/* Right column: university & professional card */}
          <aside className={theme.asideCard}>
            <div className={theme.asideImageWrapper}>
              <Image
                src="/img/benefits.png"
                alt="Global-scale benefits for university students and professionals"
                fill
                className={theme.asideImage}
                sizes="(min-width: 1024px) 280px, 100vw"
              />
            </div>
            <div className={theme.asideInner}>
              <h3 className={theme.asideEyebrow}>Global-Scale Benefits</h3>
              <p className={theme.asideTitle}>For University Students &amp; Professionals</p>
              <ul className={theme.asideList}>
                <li className={theme.asideListItem}>
                  <CheckCircle2 className={theme.asideCheckIcon} />
                  <span>Global Exposure &amp; International Networking</span>
                </li>
                <li className={theme.asideListItem}>
                  <CheckCircle2 className={theme.asideCheckIcon} />
                  <span>Academic &amp; Career Development</span>
                </li>
                <li className={theme.asideListItem}>
                  <CheckCircle2 className={theme.asideCheckIcon} />
                  <span>Recognized Credential</span>
                </li>
                <li className={theme.asideListItem}>
                  <CheckCircle2 className={theme.asideCheckIcon} />
                  <span>Global Mindset &amp; Impact Leadership</span>
                </li>
              </ul>

              <div className={theme.asideButtonWrapper}>
                <Link href="/programs/benefits-university-professional" className={theme.asideButton}>
                  Read More
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
