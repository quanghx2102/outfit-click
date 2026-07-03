import Link from 'next/link';
import { requireAuth } from '@/lib/require-auth';
import { getUserPermissions } from '@/lib/permissions';
import { getDistinctStyles, getDistinctOutfitTypes } from '@/server/outfits/outfit.service';
import { PERMISSIONS } from '@/constants/permissions';
import { MANAGER_ROUTES } from '@/constants/routes';
import PageHeader from '@/components/manager/PageHeader';
import OutfitForm from '@/components/manager/OutfitForm';

export default async function ManagerOutfitNewPage() {
  const user = await requireAuth();
  const [permissions, styleOptions, outfitTypeOptions] = await Promise.all([
    getUserPermissions(user.id),
    getDistinctStyles(),
    getDistinctOutfitTypes(),
  ]);

  if (!permissions.includes(PERMISSIONS.OUTFITS_CREATE)) {
    return (
      <div className="p-6 lg:p-8">
        <p className="text-sm text-slate-500">You do not have permission to create outfits.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <div>
        <Link
          href={MANAGER_ROUTES.OUTFITS}
          className="mb-3 inline-flex text-sm text-slate-500 transition-colors hover:text-slate-900"
        >
          ← Back to Outfits
        </Link>
        <PageHeader
          title="Create New Outfit"
          description="Outfit will be saved as draft. Publish separately after adding products."
        />
      </div>

      <div className="max-w-2xl">
        <OutfitForm
          mode="create"
          styleOptions={styleOptions}
          outfitTypeOptions={outfitTypeOptions}
        />
      </div>
    </div>
  );
}
