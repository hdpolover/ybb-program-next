import { MapPin, Phone, Mail } from 'lucide-react';
import { componentsTheme } from '@/lib/theme/components';

export default function InfoStrip() {
  const items = [
    {
      subtitle: 'Location',
      title: 'Programs Held in',
      description: 'Osaka, Japan',
      icon: <MapPin className={componentsTheme.infoStrip.icon} />,
    },
    {
      subtitle: 'Contact',
      title: 'Customer Service',
      description: '+6285173386622',
      icon: <Phone className={componentsTheme.infoStrip.icon} />,
    },
    {
      subtitle: 'Email',
      title: 'Official Email',
      description: 'japanyouthsummit@gmail.com',
      icon: <Mail className={componentsTheme.infoStrip.icon} />,
    },
  ];

  return (
    <section className={`${componentsTheme.infoStrip.background} relative w-full overflow-hidden`}>
      <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-1/3 h-48 w-48 rotate-12 rounded-xl bg-white/10 blur-2xl" />
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <ul className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <li
              key={item.subtitle}
              className={`flex items-start gap-6 lg:px-10 ${index !== items.length - 1 ? `lg:border-r ${componentsTheme.infoStrip.divider}` : ''}`}
            >
              <div className={componentsTheme.infoStrip.iconCircle}>{item.icon}</div>
              <div>
                <p className={componentsTheme.infoStrip.subtitle}>{item.subtitle}</p>
                <h3 className="mt-1 text-2xl font-extrabold leading-tight">{item.title}</h3>
                <p className="mt-3 max-w-md text-blue-100/90">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
