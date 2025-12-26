'use client';

import Image from 'next/image';
import { Mail as MailIcon } from 'lucide-react';

export default function Footer() {
  // navigasi footer disamakan dengan navbar biar konsisten
  const nav = [
    { label: 'Home', href: '/' },
    { label: 'Programs', href: '/programs' },
    { label: 'Partners & Sponsors', href: '/partners' },
    { label: 'Announcements', href: '/announcements' },
  ];
  // sublink programs sama seperti di navbar
  const pages = [
    { label: 'Program Overview', href: '/programs' },
    { label: 'Insight & Analytics', href: '/programs/insights' },
    { label: 'Photo Gallery', href: '/programs/gallery' },
    { label: 'Testimonials', href: '/programs/testimonials' },
  ];
  const speakers = [
    { name: 'Mas Aldi', role: 'COO YBB', avatar: '/img/jys.png' },
    { name: 'Mas Hendra', role: 'Lead Programmer', avatar: '/img/jys.png' },
    { name: 'Hilmi Farrel Firjatullah', role: 'Web Dev Intern', avatar: '/img/jys.png' },
  ];

  return (
    <>
      <footer className="relative w-full bg-[#DD4E6F] py-12 text-white sm:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-4 lg:gap-12 lg:px-8">
          {/* Kalimat Khusus program ( deskripsi program ) */}
          <div>
            <div className="flex items-center">
              <Image
                src="/img/jysfooters.png"
                alt="Japan Youth Summit"
                width={700}
                height={700}
                className="h-12 w-auto sm:h-16 md:h-20"
              />
            </div>
            <p className="mt-2 max-w-sm text-sm text-white/80">
              Japan Youth Summit brings together young leaders from around the world to co-create
              sustainable solutions, build meaningful connections, and celebrate cultural diversity
              in Japan.
            </p>
          </div>

          {/* Navigasi / Menu utama */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">Menu</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              {nav.map(n => (
                <li key={n.label}>
                  <a className="transition hover:text-pink-100" href={n.href}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Socials with labels */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Contact Us
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-white/85">
              <li className="flex items-center gap-3">
                <MailIcon className="h-4 w-4" />
                <a href="mailto:info@jys.org" className="transition hover:text-pink-100">
                  info@jys.org
                </a>
              </li>
              <li className="flex items-center gap-3">
                {/* Instagram */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm5 5a5 5 0 110 10 5 5 0 010-10zm0 2.2a2.8 2.8 0 100 5.6 2.8 2.8 0 000-5.6zM18 6.5a1 1 0 110 2 1 1 0 010-2z" />
                </svg>
                <span>@japanyouthsummit</span>
              </li>
              <li className="flex items-center gap-3">
                {/* TikTok */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M14.25 3a.75.75 0 01.75-.75h1.5a4.5 4.5 0 004.5 4.5v1.5a6 6 0 01-4.5-1.95v7.95a5.25 5.25 0 11-5.25-5.25c.26 0 .51.02.75.06V10.5a3.75 3.75 0 103.5 3.727V3z" />
                </svg>
                <span>@japanyouthsummit</span>
              </li>
              <li className="flex items-center gap-3">
                {/* YouTube */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M21.8 8.001a3.002 3.002 0 00-2.115-2.122C18.2 5.5 12 5.5 12 5.5s-6.2 0-7.685.379A3.002 3.002 0 002.2 8.001C1.875 9.5 1.875 12 1.875 12s0 2.5.325 3.999a3.002 3.002 0 002.115 2.122C5.8 18.5 12 18.5 12 18.5s6.2 0 7.685-.379A3.002 3.002 0 0021.8 16c.325-1.499.325-3.999.325-3.999s0-2.5-.325-4zM10.5 9.75l4.5 2.25-4.5 2.25v-4.5z" />
                </svg>
                <span>japanyouthsummit</span>
              </li>
              <li className="flex items-center gap-3">
                {/* Telegram */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M21.944 4.667a1.125 1.125 0 00-1.558-.992L3.4 11.007a.937.937 0 00.072 1.743l4.847 1.802 1.861 4.717a.938.938 0 001.7.127l2.756-4.513 4.853-9.807a1.125 1.125 0 00.455-.409zM9.42 12.93l7.359-4.53-5.69 5.7a.937.937 0 00-.238.385l-.68 2.214-.751-1.904a.937.937 0 00-.442-.49l-1.558-.775z" />
                </svg>
                <span>t.me/japanyouthsummit</span>
              </li>
              <li className="flex items-start gap-3">
                {/* Location */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mt-0.5 h-4 w-4"
                >
                  <path d="M12 2.25A7.25 7.25 0 004.75 9.5c0 4.768 6.086 11.01 7.067 11.97a1 1 0 001.366 0C13.764 20.51 19.25 14.268 19.25 9.5A7.25 7.25 0 0012 2.25zm0 9.25a2.75 2.75 0 110-5.5 2.75 2.75 0 010 5.5z" />
                </svg>
                <span>Ngaglik, Sleman, Yogyakarta, Indonesia</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Subscribe */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Subscribe to Our Newsletter
            </h4>
            <p className="mt-4 text-sm text-white/80">
              Get updates about important dates, program announcements, and opportunities directly
              in your inbox.
            </p>
            <form className="mt-4">
              <div className="flex overflow-hidden rounded-xl ring-1 ring-white/30">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white/95 px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  className="bg-pink-600 px-4 text-sm font-semibold text-white transition hover:bg-pink-700"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bar / Garis yang di bawah */}
        <div className="mx-auto mt-10 max-w-7xl px-6 lg:px-8">
          <div className="h-px w-full bg-white/20" />
          <div className="mt-5 flex items-center justify-center">
            <p className="text-center text-xs text-white/80">
              © Hilmi Farrel Firjatullah x YBB. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
