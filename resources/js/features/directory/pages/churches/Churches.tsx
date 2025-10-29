import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface Church {
  id: number;
  name: string;
  religion: string;
  address: string;
  city: string;
  region: string;
  phone: string;
  email?: string;
  capacity?: number;
}

interface PaginatedData {
  data: Church[];
  links: Array<{ url: string | null; label: string; active: boolean }>;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface Props {
  churches: PaginatedData;
  filters: {
    search?: string;
    city?: string;
    region?: string;
    religion?: string;
  };
  cities: string[];
  regions: string[];
}

export default function Churches({ churches, filters = {}, cities = [], regions = [] }: Props) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [cityFilter, setCityFilter] = useState(filters.city || 'all');
  const [regionFilter, setRegionFilter] = useState(filters.region || 'all');
  const [religionFilter, setReligionFilter] = useState(filters.religion || 'all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [churchToDelete, setChurchToDelete] = useState<Church | null>(null);

  const handleSearch = () => {
    const params: Record<string, string> = {};
    if (searchTerm) params.search = searchTerm;
    if (cityFilter !== 'all') params.city = cityFilter;
    if (regionFilter !== 'all') params.region = regionFilter;
    if (religionFilter !== 'all') params.religion = religionFilter;

    router.get('/directory/churches', params, { preserveState: true });
  };

  const handleDelete = (church: Church) => {
    setChurchToDelete(church);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (churchToDelete) {
      router.delete(`/directory/churches/${churchToDelete.id}`, {
        onSuccess: () => {
          toast.success(t('directory.successDeleted'));
          setDeleteDialogOpen(false);
          setChurchToDelete(null);
        },
        onError: () => {
          toast.error(t('common.error'));
        },
      });
    }
  };

  const religions = ['catholic', 'evangelical', 'baptist', 'jewish', 'other'];

  return (
    <MainLayout>
      <Head title={t('directory.churches')} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('directory.churches')}</h1>
            <p className="mt-2 text-sm text-gray-600">{t('directory.churchesDescription')}</p>
          </div>
          <Link href="/directory/churches/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t('directory.createChurch')}
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>{t('common.filters')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <Label htmlFor="search">{t('common.search')}</Label>
                <div className="flex gap-2">
                  <Input
                    id="search"
                    type="text"
                    placeholder={t('directory.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button onClick={handleSearch} variant="secondary">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="city">{t('directory.filterByCity')}</Label>
                <Select value={cityFilter} onValueChange={setCityFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('directory.allCities')}</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="region">{t('directory.filterByRegion')}</Label>
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('directory.allRegions')}</SelectItem>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="religion">{t('directory.filterByReligion')}</Label>
                <Select value={religionFilter} onValueChange={setReligionFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('directory.allReligions')}</SelectItem>
                    {religions.map((religion) => (
                      <SelectItem key={religion} value={religion}>
                        {t(`directory.${religion}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('directory.name')}</TableHead>
                  <TableHead>{t('directory.religion')}</TableHead>
                  <TableHead>{t('directory.city')}</TableHead>
                  <TableHead>{t('directory.region')}</TableHead>
                  <TableHead>{t('directory.phone')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {churches.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      {t('directory.noResults')}
                    </TableCell>
                  </TableRow>
                ) : (
                  churches.data.map((church) => (
                    <TableRow key={church.id}>
                      <TableCell className="font-medium">{church.name}</TableCell>
                      <TableCell>{t(`directory.${church.religion}`)}</TableCell>
                      <TableCell>{church.city}</TableCell>
                      <TableCell>{church.region}</TableCell>
                      <TableCell>{church.phone}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/directory/churches/${church.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(church)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        {churches.meta.last_page > 1 && (
          <div className="flex justify-center gap-2">
            {churches.links.map((link, index) => (
              <Button
                key={index}
                variant={link.active ? 'default' : 'outline'}
                size="sm"
                disabled={!link.url}
                onClick={() => link.url && router.visit(link.url)}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('directory.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('directory.deleteConfirmMessage')}
              {churchToDelete && (
                <span className="font-semibold block mt-2">{churchToDelete.name}</span>
              )}
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
