import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Filter, Search } from 'lucide-react';
import type { Branch } from '../types';

interface StaffFiltersPanelProps {
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
  branchFilter: string;
  branches: Branch[];
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onBranchChange: (value: string) => void;
  onSearch: () => void;
}

export default function StaffFiltersPanel({
  searchTerm,
  roleFilter,
  statusFilter,
  branchFilter,
  branches,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onBranchChange,
  onSearch,
}: StaffFiltersPanelProps) {
  const { t } = useTranslation();

  const roleOptions = [
    { value: 'secretaria', labelKey: 'staff.roles.secretary' },
    { value: 'conductor', labelKey: 'staff.roles.driver' },
    { value: 'auxiliar', labelKey: 'staff.roles.assistant' },
    { value: 'administrador', labelKey: 'staff.roles.administrator' },
    { value: 'propietario', labelKey: 'staff.roles.owner' },
  ];

  return (
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
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
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
                onChange={(e) => onRoleChange(e.target.value)}
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
                  onChange={(e) => onRoleChange(e.target.value)}
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
                onChange={(e) => onStatusChange(e.target.value)}
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
                onChange={(e) => onStatusChange(e.target.value)}
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
                onChange={(e) => onStatusChange(e.target.value)}
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
                  onChange={(e) => onBranchChange(e.target.value)}
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
                    onChange={(e) => onBranchChange(e.target.value)}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{branch.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <Button onClick={onSearch} className="w-full gap-2">
          <Filter className="h-4 w-4" />
          {t('common.filter')}
        </Button>
      </CardContent>
    </Card>
  );
}
