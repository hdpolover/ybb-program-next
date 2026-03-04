"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Mail as MailIcon } from "lucide-react";
import { FOOTER_COPY } from "@/data/footerCopy";
import { jysSectionTheme } from "@/lib/theme/jys-components";
import { getSettings } from "@/lib/api/settings";
import type { SettingsData, SettingsFooterNavSection } from "@/types/settings";

export default function Footer() {
  const [settings, setSettings] = useState<SettingsData | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await getSettings();
        if (!cancelled) {
          setSettings(data);
        }
      } catch {
        // kalau API-nya error, diam-diam balik pake data FOOTER_COPY aja
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const footerNav: SettingsFooterNavSection[] | null = settings?.footer_navigation ?? null;
  const brand = settings?.brand ?? null;

  const programsSection = (footerNav ?? []).find(section => section.title.toLowerCase() === 'programs');
  const legalSection = (footerNav ?? []).find(section => section.title.toLowerCase() === 'legal');

  const brandName = brand?.name?.trim() ? brand.name.trim() : 'Japan Youth Summit';
  const copyrightText = `Copyright © ${new Date().getFullYear()} ${brandName}`;

  const brandLogo = brand?.logo_url?.trim() ? brand.logo_url.trim() : '/img/jysfooters.png';

  // Menu is partially dynamic: show only Programs links from API.
  // If API missing or empty, fallback to FOOTER_COPY.nav.
  const apiMenuLinks: { label: string; href: string }[] = (programsSection?.links ?? []).map(link => ({
    label: link.label,
    href: link.url,
  }));

  const menuLinks: { label: string; href: string }[] = apiMenuLinks.length > 0 ? apiMenuLinks : FOOTER_COPY.nav;

  const legalLinks: { label: string; href: string }[] = (legalSection?.links ?? []).map(link => ({
    label: link.label,
    href: link.url,
  }));

  // Social links (Connect) normalized from brand.social_media with fallback to FOOTER_COPY.socials
  const apiSocials: { id: string; label: string; href: string }[] = [];

  if (brand?.social_media?.instagram) {
    apiSocials.push({ id: "instagram", label: "Instagram", href: brand.social_media.instagram });
  }
  if (brand?.social_media?.tiktok) {
    apiSocials.push({ id: "tiktok", label: "TikTok", href: brand.social_media.tiktok });
  }
  if (brand?.social_media?.youtube) {
    apiSocials.push({ id: "youtube", label: "YouTube", href: brand.social_media.youtube });
  }
  if (brand?.social_media?.telegram) {
    apiSocials.push({ id: "telegram", label: "Telegram", href: brand.social_media.telegram });
  }

  const fallbackSocials = FOOTER_COPY.socials.filter(s =>
    ["instagram", "tiktok", "youtube", "telegram"].includes(s.id),
  );

  const socialLinks = (apiSocials.length > 0 ? apiSocials : fallbackSocials).map(s => ({
    id: s.id,
    label: s.label,
    href: s.href ?? "",
  }));

  return (
    <>
      <footer className={jysSectionTheme.footer.sectionWrapper}>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-4 lg:gap-12 lg:px-8">
          {/* Kalimat Khusus program ( deskripsi program ) */}
          <div>
            <div className="flex items-center">
              <Image
                src={brandLogo}
                alt={brandName}
                width={700}
                height={700}
                className="h-12 w-auto sm:h-16 md:h-20"
              />
            </div>
            <p className="mt-2 max-w-sm text-sm text-white/80">{FOOTER_COPY.description}</p>
          </div>

          {/* Navigasi / Menu utama (Quick Links) */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">
              {FOOTER_COPY.menuTitle}
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              {menuLinks.map(item => (
                <li key={item.label}>
                  <a className={jysSectionTheme.footer.navLink} href={item.href}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Socials with labels */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">
              {FOOTER_COPY.contactTitle}
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-white/85">
              {/* Email */}
              {(() => {
                const emailHref = brand?.support_email
                  ? `mailto:${brand.support_email}`
                  : FOOTER_COPY.socials.find(s => s.id === "email")?.href;
                const emailLabel = brand?.support_email
                  ? brand.support_email
                  : FOOTER_COPY.socials.find(s => s.id === "email")?.label;

                return (
                  <li key="email" className="flex items-center gap-3">
                    <MailIcon className="h-4 w-4" />
                    {emailHref && emailLabel && (
                      <a
                        href={emailHref}
                        className={jysSectionTheme.footer.contactLink}
                        target={emailHref.startsWith("http") ? "_blank" : undefined}
                        rel={emailHref.startsWith("http") ? "noreferrer" : undefined}
                      >
                        {emailLabel}
                      </a>
                    )}
                  </li>
                );
              })()}

              {/* Location / address */}
              {(() => {
                const address = brand?.address ?? FOOTER_COPY.socials.find(s => s.id === "location")?.label;
                if (!address) return null;
                return (
                  <li key="location" className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="mt-0.5 h-4 w-4"
                    >
                      <path d="M12 2.25A7.25 7.25 0 004.75 9.5c0 4.768 6.086 11.01 7.067 11.97a1 1 0 001.366 0C13.764 20.51 19.25 14.268 19.25 9.5A7.25 7.25 0 0012 2.25zm0 9.25a2.75 2.75 0 110-5.5 2.75 2.75 0 010 5.5z" />
                    </svg>
                    <span>{address}</span>
                  </li>
                );
              })()}

              {/* Social media links (Connect) */}
              {socialLinks.map(social => {
                if (social.id === 'email') {
                  return (
                    <li key={social.id} className="flex items-center gap-3">
                      <MailIcon className="h-4 w-4" />
                      <a
                        href={social.href}
                        className={jysSectionTheme.footer.contactLink}
                        target={social.href?.startsWith('http') ? '_blank' : undefined}
                        rel={social.href?.startsWith('http') ? 'noreferrer' : undefined}
                     >
                        {social.label}
                      </a>
                    </li>
                  );
                }
                const iconPathById: Record<string, string> = {
                  instagram:
                    'M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm5 5a5 5 0 110 10 5 5 0 010-10zm0 2.2a2.8 2.8 0 100 5.6 2.8 2.8 0 000-5.6zM18 6.5a1 1 0 110 2 1 1 0 010-2z',
                  tiktok:
                    'M14.25 3a.75.75 0 01.75-.75h1.5a4.5 4.5 0 004.5 4.5v1.5a6 6 0 01-4.5-1.95v7.95a5.25 5.25 0 11-5.25-5.25c.26 0 .51.02.75.06V10.5a3.75 3.75 0 103.5 3.727V3z',
                  youtube:
                    'M21.8 8.001a3.002 3.002 0 00-2.115-2.122C18.2 5.5 12 5.5 12 5.5s-6.2 0-7.685.379A3.002 3.002 0 002.2 8.001C1.875 9.5 1.875 12 1.875 12s0 2.5.325 3.999a3.002 3.002 0 002.115 2.122C5.8 18.5 12 18.5 12 18.5s6.2 0 7.685-.379A3.002 3.002 0 0021.8 16c.325-1.499.325-3.999.325-3.999s0-2.5-.325-4zM10.5 9.75l4.5 2.25-4.5 2.25v-4.5z',
                  telegram:
                    'M21.944 4.667a1.125 1.125 0 00-1.558-.992L3.4 11.007a.937.937 0 00.072 1.743l4.847 1.802 1.861 4.717a.938.938 0 001.7.127l2.756-4.513 4.853-9.807a1.125 1.125 0 00.455-.409zM9.42 12.93l7.359-4.53-5.69 5.7a.937.937 0 00-.238.385l-.68 2.214-.751-1.904a.937.937 0 00-.442-.49l-1.558-.775z',
                };

                const path = iconPathById[social.id];

                return (
                  <li key={social.id} className="flex items-center gap-3">
                    {path ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4"
                      >
                        <path d={path} />
                      </svg>
                    ) : null}
                    <a
                      href={social.href}
                      className="transition hover:text-primary/20"
                      target={social.href?.startsWith('http') ? '_blank' : undefined}
                      rel={social.href?.startsWith('http') ? 'noreferrer' : undefined}
                    >
                      {social.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Newsletter / Subscribe */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">
              {FOOTER_COPY.newsletterTitle}
            </h4>
            <p className="mt-4 text-sm text-white/80">
              {FOOTER_COPY.newsletterBody}
            </p>
            <form className="mt-4">
              <div className="flex overflow-hidden rounded-xl ring-1 ring-white/30">
                <input
                  type="email"
                  placeholder={FOOTER_COPY.newsletterInputPlaceholder}
                  className="w-full bg-white/95 px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  className={jysSectionTheme.footer.newsletterButton}
                >
                  {FOOTER_COPY.newsletterCtaLabel}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bar / Garis yang di bawah */}
        <div className="mx-auto mt-10 max-w-7xl px-6 lg:px-8">
          <div className="h-px w-full bg-white/20" />
          <div className="mt-5 flex flex-col items-center justify-between gap-2 sm:flex-row">
            <p className="text-center text-xs text-white/80 sm:text-left">{copyrightText}</p>
            {legalLinks.length > 0 ? (
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-white/80 sm:justify-end">
                {legalLinks.map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="transition hover:text-primary/20"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </footer>
    </>
  );
}
