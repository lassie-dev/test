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

interface WakeRoom {
  id: number;
  name: string;
  funeral_home_name?: string;
  address: string;
  city: string;
  region: string;
  phone: string;
  capacity?: number;
}

interface PaginatedData {
  data: WakeRoom[];
  links: Array<{ url: string | null; label: string; active: boolean }>;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface Props {
  wakeRooms: PaginatedData;
  filters: {
    search?: string;
    city?: string;
  };
  cities: string[];
}

export default function WakeRooms({ wakeRooms, filters = {}, cities = [] }: Props) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [cityFilter, setCityFilter] = useState(filters.city || 'all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [wakeRoomToDelete, setWakeRoomToDelete] = useState<WakeRoom | null>(null);

  const handleSearch = () => {
    const params: Record<string, string> = {};
    if (searchTerm) params.search = searchTerm;
    if (cityFilter !== 'all') params.city = cityFilter;

    router.get('/directory/wake-rooms', params, { preserveState: true });
  };

  const handleDelete = (wakeRoom: WakeRoom) => {
    setWakeRoomToDelete(wakeRoom);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (wakeRoomToDelete) {
      router.delete(`/directory/wake-rooms/${wakeRoomToDelete.id}`, {
        onSuccess: () => {
          toast.success(t('directory.successDeleted'));
          setDeleteDialogOpen(false);
          setWakeRoomToDelete(null);
        },
        onError: () => {
          toast.error(t('common.error'));
        },
      });
    }
  };

  return (
    <MainLayout>
      <Head title={t('directory.wakeRooms')} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('directory.wakeRooms')}</h1>
            <p className="mt-2 text-sm text-gray-600">{t('directory.wakeRoomsDescription')}</p>
          </div>
          <Link href="/directory/wake-rooms/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t('directory.createWakeRoom')}
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>{t('common.filters')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <TableHead>{t('directory.funeralHomeName')}</TableHead>
                  <TableHead>{t('directory.city')}</TableHead>
                  <TableHead>{t('directory.capacity')}</TableHead>
                  <TableHead>{t('directory.phone')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wakeRooms.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      {t('directory.noResults')}
                    </TableCell>
                  </TableRow>
                ) : (
                  wakeRooms.data.map((wakeRoom) => (
                    <TableRow key={wakeRoom.id}>
                      <TableCell className="font-medium">{wakeRoom.name}</TableCell>
                      <TableCell>{wakeRoom.funeral_home_name || '-'}</TableCell>
                      <TableCell>{wakeRoom.city}</TableCell>
                      <TableCell>{wakeRoom.capacity || '-'}</TableCell>
                      <TableCell>{wakeRoom.phone}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/directory/wake-rooms/${wakeRoom.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(wakeRoom)}
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
        {wakeRooms.meta.last_page > 1 && (
          <div className="flex justify-center gap-2">
            {wakeRooms.links.map((link, index) => (
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
              {wakeRoomToDelete && (
                <span className="font-semibold block mt-2">{wakeRoomToDelete.name}</span>
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
