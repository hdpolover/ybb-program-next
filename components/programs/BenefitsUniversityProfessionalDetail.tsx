import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { componentsTheme } from '@/lib/theme/components';

const theme = componentsTheme.programsBenefitsDetail;

export default function BenefitsUniversityProfessionalDetail() {
  return (
    <section className={theme.sectionWrapper}>
      <div className={theme.container}>
        <div className={theme.grid}>
          {/* Left column: detailed global-scale benefits list */}
          <div className={theme.leftColumn}>
            {/* 1 */}
            <article className={theme.itemRow}>
              <div className={theme.numberCircle}>1</div>
              <div>
                <h2 className={theme.itemTitle}>Global Exposure &amp; International Networking</h2>
                <p className={theme.paragraphNormal}>
                  Access to a diverse network of youth leaders, academics, professionals, and global mentors.
                </p>
                <p className={theme.paragraphNormal}>
                  Engagement in high-level discussions on SDGs, sustainability, leadership, digital futures, and global
                  competitiveness.
                </p>
                <p className={theme.paragraphNormal}>
                  Early-stage cross-country collaboration on social and impact-driven initiatives.
                </p>
              </div>
            </article>

            {/* 2 */}
            <article className={theme.itemRow}>
              <div className={theme.numberCircle}>2</div>
              <div>
                <h2 className={theme.itemTitle}>Academic &amp; Career Development</h2>
                <p className={theme.paragraphNormal}>
                  Strengthening of leadership, project management, and cross-cultural collaboration skills.
                </p>
                <p className={theme.paragraphNormal}>
                  Hands-on experience in developing Social Project Proposals and Impact Plans aligned with global
                  challenges.
                </p>
                <p className={theme.paragraphNormal}>
                  Strong value addition for CVs, LinkedIn profiles, graduate school, and fellowship applications.
                </p>
              </div>
            </article>

            {/* 3 */}
            <article className={theme.itemRow}>
              <div className={theme.numberCircle}>3</div>
              <div>
                <h2 className={theme.itemTitle}>Recognized Credential</h2>
                <p className={theme.paragraphNormal}>
                  PUSPRENAS-curated certificate that supports Indonesian university students in MBKM programs,
                  scholarships, and international exchanges.
                </p>
                <p className={theme.paragraphNormal}>
                  Enhances professional credibility in NGOs, CSR initiatives, education, sustainability, and global
                  development sectors.
                </p>
                <p className={theme.paragraphNormal}>
                  Demonstrates active participation in a globally oriented youth leadership program.
                </p>
              </div>
            </article>

            {/* 4 */}
            <article className={theme.itemRow}>
              <div className={theme.numberCircle}>4</div>
              <div>
                <h2 className={theme.itemTitle}>Global Mindset &amp; Impact Leadership</h2>
                <p className={theme.paragraphNormal}>
                  Cultivates systems thinking and cross-cultural competence in addressing complex global issues.
                </p>
                <p className={theme.paragraphNormal}>
                  Positions participants as solution-oriented global changemakers through collaborative projects and
                  dialogue.
                </p>
                <p className={theme.paragraphNormal}>
                  Provides opportunities to elevate ideas and projects to international forums and platforms.
                </p>
              </div>
            </article>
          </div>

          {/* Right column: high school benefits card */}
          <aside className={theme.asideCard}>
            <div className={theme.asideImageWrapper}>
              <Image
                src="/img/programoverview.png"
                alt="Benefits for high school students"
                fill
                className={theme.asideImage}
                sizes="(min-width: 1024px) 280px, 100vw"
              />
            </div>
            <div className={theme.asideInner}>
              <h3 className={theme.asideEyebrow}>Benefits Overview</h3>
              <p className={theme.asideTitle}>Benefits for High School Students</p>
              <ul className={theme.asideList}>
                <li className={theme.asideListItem}>
                  <CheckCircle2 className={theme.asideCheckIcon} />
                  <span>Relevant to Indonesian National Curriculum</span>
                </li>
                <li className={theme.asideListItem}>
                  <CheckCircle2 className={theme.asideCheckIcon} />
                  <span>Relevance to the IB Curriculum</span>
                </li>
                <li className={theme.asideListItem}>
                  <CheckCircle2 className={theme.asideCheckIcon} />
                  <span>Support for the Cambridge Curriculum</span>
                </li>
                <li className={theme.asideListItem}>
                  <CheckCircle2 className={theme.asideCheckIcon} />
                  <span>Curated Certificate by PUSPRENAS (Indonesia)</span>
                </li>
              </ul>

              <div className={theme.asideButtonWrapper}>
                <Link href="/programs/benefits-highschool" className={theme.asideButton}>
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
