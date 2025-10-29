import { Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Plus, Users, MoreVertical, Pencil, Trash2, Eye } from 'lucide-react';
import type { StaffMember } from '../types';

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface StaffTableProps {
  staffData: StaffMember[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: PaginationLink[];
  onDelete: (member: StaffMember) => void;
}

export default function StaffTable({ staffData, meta, links, onDelete }: StaffTableProps) {
  const { t } = useTranslation();

  if (staffData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('staff.list')}</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('staff.list')}</CardTitle>
      </CardHeader>
      <CardContent>
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
                        onClick={() => onDelete(member)}
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
        {meta.last_page > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-600">
              {t('staff.showingResults', {
                count: staffData.length,
                total: meta.total,
              })}
            </p>
            <div className="flex gap-2">
              {links.map((link, index) => (
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
      </CardContent>
    </Card>
  );
}
