import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { StaffMember, StaffFilters, Branch } from '../types';

// Import new components
import StaffStatsCards from '../components/StaffStatsCards';
import StaffFiltersPanel from '../components/StaffFiltersPanel';
import StaffTable from '../components/StaffTable';
import DeleteStaffDialog from '../components/DeleteStaffDialog';

interface PaginatedData {
  data: StaffMember[];
  links: Array<{ url: string | null; label: string; active: boolean }>;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface Props {
  staff?: PaginatedData;
  branches?: Branch[];
  filters?: StaffFilters;
}

export default function Index({ staff, branches = [], filters = {} }: Props) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [roleFilter, setRoleFilter] = useState(filters.role || 'all');
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
  const [branchFilter, setBranchFilter] = useState(filters.branch || 'all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);

  // Handle undefined staff data
  const staffData = staff?.data || [];
  const staffMeta = staff?.meta || { current_page: 1, last_page: 1, per_page: 15, total: 0 };
  const staffLinks = staff?.links || [];

  const handleSearch = () => {
    const params: Record<string, string> = {};
    if (searchTerm) params.search = searchTerm;
    if (roleFilter !== 'all') params.role = roleFilter;
    if (statusFilter !== 'all') params.status = statusFilter;
    if (branchFilter !== 'all') params.branch = branchFilter;

    router.get('/staff', params, { preserveState: true });
  };

  const handleDelete = (member: StaffMember) => {
    setStaffToDelete(member);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (staffToDelete) {
      router.delete(`/staff/${staffToDelete.id}`, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setStaffToDelete(null);
        },
      });
    }
  };

  const activeStaff = staffData.filter((s) => s.is_active).length;
  const inactiveStaff = staffData.filter((s) => !s.is_active).length;

  return (
    <MainLayout>
      <Head title={t('staff.title')} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('staff.title')}</h1>
            <p className="mt-2 text-sm text-gray-600">{t('staff.subtitle')}</p>
          </div>
          <Link href="/staff/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t('staff.addEmployee')}
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <StaffStatsCards total={staffMeta.total} active={activeStaff} inactive={inactiveStaff} />

        {/* Filters and Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Filters */}
          <aside className="lg:col-span-1">
            <StaffFiltersPanel
              searchTerm={searchTerm}
              roleFilter={roleFilter}
              statusFilter={statusFilter}
              branchFilter={branchFilter}
              branches={branches}
              onSearchChange={setSearchTerm}
              onRoleChange={setRoleFilter}
              onStatusChange={setStatusFilter}
              onBranchChange={setBranchFilter}
              onSearch={handleSearch}
            />
          </aside>

          {/* Right Content - Staff Table */}
          <div className="lg:col-span-3 space-y-6">
            <StaffTable
              staffData={staffData}
              meta={staffMeta}
              links={staffLinks}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteStaffDialog
        open={deleteDialogOpen}
        staffMember={staffToDelete}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </MainLayout>
  );
}
