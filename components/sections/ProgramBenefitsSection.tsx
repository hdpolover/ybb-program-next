"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { componentsTheme } from "@/lib/theme/components";
import SectionHeader from "@/components/ui/SectionHeader";

const theme = componentsTheme.homeProgramBenefits;

export default function ProgramBenefitsSection() {
  return (
    <section
      className={theme.sectionWrapper}
      style={{
        backgroundImage: `url('${theme.backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className={theme.container}>
        <SectionHeader
          eyebrow="Program Benefits"
          title="for Students, University Students, and Professional"
          align="center"
        />

        <div className={theme.grid}>
          {/* High School Students */}
          <article className={theme.card}>
            <div className={theme.imageWrapper}>
              <Image
                src="/img/programoverview.png"
                alt="Benefits for high school students"
                fill={false}
                width={640}
                height={360}
                className={theme.image}
              />
            </div>

            <h3 className={theme.cardTitle}>Benefits for High School Students</h3>
            <ul className={theme.list}>
              <li className={theme.listItem}>
                <CheckCircle2 className={theme.listCheckIcon} />
                <span className={theme.listText}>Relevant to Indonesian National Curriculum</span>
              </li>
              <li className={theme.listItem}>
                <CheckCircle2 className={theme.listCheckIcon} />
                <span className={theme.listText}>Relevance to the IB Curriculum</span>
              </li>
              <li className={theme.listItem}>
                <CheckCircle2 className={theme.listCheckIcon} />
                <span className={theme.listText}>Support for the Cambridge Curriculum</span>
              </li>
              <li className={theme.listItem}>
                <CheckCircle2 className={theme.listCheckIcon} />
                <span className={theme.listText}>Curated Certification by PUSPRENAS (Indonesia)</span>
              </li>
            </ul>
            <div className={theme.actionsRow}>
              <Link href="/programs/benefits-highschool" className={theme.readMoreButton}>
                Read More
              </Link>
            </div>
          </article>

          {/* University Students & Professionals */}
          <article className={theme.card}>
            <div className={theme.imageWrapper}>
              <Image
                src="/img/benefits.png"
                alt="Benefits for university students and professionals"
                fill={false}
                width={640}
                height={360}
                className={theme.image}
              />
            </div>
            <h3 className={theme.cardTitle}>Global-Scale Benefits for University Students &amp; Professionals</h3>
            <ul className={theme.list}>
              <li className={theme.listItem}>
                <CheckCircle2 className={theme.listCheckIcon} />
                <span className={theme.listText}>Global Exposure &amp; International Networking</span>
              </li>
              <li className={theme.listItem}>
                <CheckCircle2 className={theme.listCheckIcon} />
                <span className={theme.listText}>Academic &amp; Career Development</span>
              </li>
              <li className={theme.listItem}>
                <CheckCircle2 className={theme.listCheckIcon} />
                <span className={theme.listText}>Recognized Credential</span>
              </li>
              <li className={theme.listItem}>
                <CheckCircle2 className={theme.listCheckIcon} />
                <span className={theme.listText}>Global Mindset &amp; Impact Leadership</span>
              </li>
            </ul>
            <div className={theme.actionsRow}>
              <Link
                href="/programs/benefits-university-professional"
                className={theme.readMoreButton}
              >
                Read More
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
