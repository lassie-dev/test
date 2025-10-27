import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Search, Filter, Users, MoreVertical, Pencil, Trash2, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { StaffMember, StaffFilters, Branch } from '../types';

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

  const roleOptions = [
    { value: 'secretaria', labelKey: 'staff.roles.secretary' },
    { value: 'conductor', labelKey: 'staff.roles.driver' },
    { value: 'auxiliar', labelKey: 'staff.roles.assistant' },
    { value: 'administrador', labelKey: 'staff.roles.administrator' },
    { value: 'propietario', labelKey: 'staff.roles.owner' },
  ];

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
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('staff.totalEmployees')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staffMeta.total}</div>
              <p className="text-xs text-muted-foreground">{t('staff.registeredEmployees')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('staff.active')}</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeStaff}</div>
              <p className="text-xs text-muted-foreground">{t('staff.activeEmployees')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('staff.inactive')}</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inactiveStaff}</div>
              <p className="text-xs text-muted-foreground">{t('staff.inactiveEmployees')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Filters */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  {t('common.filters')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <Label htmlFor="search">{t('common.search')}</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="search"
                      placeholder={t('staff.searchPlaceholder')}
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>

                {/* Role Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('staff.role')}</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                      <input
                        type="radio"
                        name="role"
                        value="all"
                        checked={roleFilter === 'all'}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm">{t('staff.allRoles')}</span>
                    </label>
                    {roleOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                      >
                        <input
                          type="radio"
                          name="role"
                          value={option.value}
                          checked={roleFilter === option.value}
                          onChange={(e) => setRoleFilter(e.target.value)}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="text-sm">{t(option.labelKey)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('common.status')}</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                      <input
                        type="radio"
                        name="status"
                        value="all"
                        checked={statusFilter === 'all'}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm">{t('staff.allStatuses')}</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                      <input
                        type="radio"
                        name="status"
                        value="active"
                        checked={statusFilter === 'active'}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm">{t('staff.active')}</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                      <input
                        type="radio"
                        name="status"
                        value="inactive"
                        checked={statusFilter === 'inactive'}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm">{t('staff.inactive')}</span>
                    </label>
                  </div>
                </div>

                {/* Branch Filter */}
                {branches.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('common.branch')}</label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                        <input
                          type="radio"
                          name="branch"
                          value="all"
                          checked={branchFilter === 'all'}
                          onChange={(e) => setBranchFilter(e.target.value)}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="text-sm">{t('staff.allBranches')}</span>
                      </label>
                      {branches.map((branch) => (
                        <label
                          key={branch.id}
                          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                        >
                          <input
                            type="radio"
                            name="branch"
                            value={String(branch.id)}
                            checked={branchFilter === String(branch.id)}
                            onChange={(e) => setBranchFilter(e.target.value)}
                            className="w-4 h-4 text-primary focus:ring-primary"
                          />
                          <span className="text-sm">{branch.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <Button onClick={handleSearch} className="w-full gap-2">
                  <Filter className="h-4 w-4" />
                  {t('common.filter')}
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Right Content - Staff Table */}
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('staff.list')}</CardTitle>
              </CardHeader>
              <CardContent>
                {staffData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-gray-100 p-3 mb-4">
                      <Users className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{t('staff.noEmployees')}</h3>
                    <p className="mt-2 text-sm text-gray-600">{t('staff.noEmployeesDescription')}</p>
                    <Link href="/staff/create">
                      <Button className="mt-4 gap-2">
                        <Plus className="h-4 w-4" />
                        {t('staff.createFirstEmployee')}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('staff.name')}</TableHead>
                          <TableHead>{t('staff.rut')}</TableHead>
                          <TableHead>{t('staff.role')}</TableHead>
                          <TableHead>{t('staff.phone')}</TableHead>
                          <TableHead>{t('common.branch')}</TableHead>
                          <TableHead>{t('common.status')}</TableHead>
                          <TableHead className="text-right">{t('common.actions')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {staffData.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell className="font-medium">{member.name}</TableCell>
                            <TableCell>{member.rut}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{member.role_name}</Badge>
                            </TableCell>
                            <TableCell>{member.phone}</TableCell>
                            <TableCell>{member.branch?.name || '-'}</TableCell>
                            <TableCell>
                              {member.is_active ? (
                                <Badge variant="default" className="bg-green-600">
                                  {t('staff.active')}
                                </Badge>
                              ) : (
                                <Badge variant="secondary">{t('staff.inactive')}</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>{t('common.actions')}</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem asChild>
                                    <Link href={`/staff/${member.id}`}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      {t('common.view')}
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/staff/${member.id}/edit`}>
                                      <Pencil className="h-4 w-4 mr-2" />
                                      {t('common.edit')}
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(member)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {t('common.delete')}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Pagination */}
                    {staffMeta.last_page > 1 && (
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-gray-600">
                          {t('staff.showingResults', {
                            count: staffData.length,
                            total: staffMeta.total,
                          })}
                        </p>
                        <div className="flex gap-2">
                          {staffLinks.map((link, index) => (
                            <Button
                              key={index}
                              variant={link.active ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => link.url && router.get(link.url)}
                              disabled={!link.url}
                              dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('staff.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('staff.deleteConfirmDescription', { name: staffToDelete?.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
