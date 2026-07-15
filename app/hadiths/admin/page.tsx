import { AdminGuard } from '@/components/shared/widgets/admin-guard';
import { HadithsAdmin } from '@/components/shared/hadiths/hadiths-admin';

export default function page() {
  return (
    <AdminGuard>
      <HadithsAdmin />
    </AdminGuard>
  );
}
