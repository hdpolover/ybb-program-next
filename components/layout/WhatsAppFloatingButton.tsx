'use client';

import { MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSettings } from '@/components/providers/SettingsProvider';

function normalizeWhatsappNumber(value: string | null | undefined): string | null {
  const digits = value?.replace(/\D/g, '') ?? '';
  return digits ? digits : null;
}

export default function WhatsAppFloatingButton() {
  const pathname = usePathname();
  const { settings } = useSettings();

  // Hapus icon wa dari pages / routes ini
  const excludedRoutes = ['/dashboard', '/onboarding', '/login', '/register'];
  const shouldHide = excludedRoutes.some(route => pathname?.startsWith(route));
  const whatsappNumber = normalizeWhatsappNumber(settings?.brand?.contact_whatsapp);

  if (shouldHide || !whatsappNumber) return null;

  // Ambil nama program dari beberapa source
  let programName = 'this program';

  // Coba ambil dari setting dulu
  if (settings?.active_program?.name) {
    programName = settings.active_program.name;
  }
  // Fallback nya ke body data attribut
  else if (typeof document !== 'undefined') {
    const bodyProgram = document.body.getAttribute('data-program');
    if (bodyProgram) {
      // Map common slugs to names
      const slugToName: Record<string, string> = {
        jys: 'Japan Youth Summit',
        cys: 'China Youth Summit',
        iys: 'Indonesia Youth Summit',
        ybb: 'Youth Break the Boundaries',
      };

      if (slugToName[bodyProgram]) {
        programName = slugToName[bodyProgram];
      } else {
        // Convert teks strip jadi teks normal ( "china-youth-summit-2026" -> "China Youth Summit 2026")
        programName = bodyProgram
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      }
    }
    // Fallback ke judul dokumen ( document title )
    else {
      const titleParts = document.title.split('|');
      if (titleParts.length > 0) {
        programName = titleParts[0].trim();
      }
    }
  }

  const message = encodeURIComponent(
    `Hello Admin of ${programName}, I am interested in joining this program. Here are my personal details : Name: [Your Name], University/Institution: [Your Campus Name], City of Origin: [Your City]. 

Please let me know the next steps for registration. Thank you!`
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 md:bottom-8 md:right-8"
      aria-label="Contact via WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
