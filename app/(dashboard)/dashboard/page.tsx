import GuideCard from '@/components/dashboard/cards/GuideCard';
import RegistrationCategoryCard from '@/components/dashboard/cards/RegistrationCategoryCard';
import NotificationsCard from '@/components/dashboard/cards/NotificationsCard';
import { mockApplication } from '@/lib/dashboard/mock';

export default function DashboardOverviewPage() {
  const app = mockApplication;
  return (
    <div>
      {/* section: guideline + kategori registrasi (side-by-side biar hemat space) */}
      <div className="grid gap-4 lg:grid-cols-2">
        <GuideCard />
        <RegistrationCategoryCard funding={app.funding} />
      </div>

      {/* Notifications & Alerts */}
      <div className="mt-4">
        <NotificationsCard />
      </div>
    </div>
  );
}
