import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import { Contrato, EstadoContrato } from '@/features/contracts/types';
import { Input } from '@/components/ui/input';

interface ContractsIndexProps {
  contracts: Contrato[];
}

const estadoBadgeVariant = (estado: EstadoContrato) => {
  switch (estado) {
    case 'cotizacion':
      return 'secondary';
    case 'contrato':
      return 'default';
    case 'finalizado':
      return 'outline';
    case 'cancelado':
      return 'destructive';
    default:
      return 'default';
  }
};

const estadoLabel = (estado: EstadoContrato) => {
  switch (estado) {
    case 'cotizacion':
      return 'Cotización';
    case 'contrato':
      return 'Contrato';
    case 'finalizado':
      return 'Finalizado';
    case 'cancelado':
      return 'Cancelado';
    default:
      return estado;
  }
};

export default function Index({ contracts }: ContractsIndexProps) {
  const handleCreate = () => {
    router.visit('/contracts/create');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <MainLayout>
      <Head title="Contratos" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contratos</h1>
            <p className="mt-2 text-sm text-gray-600">
              Gestiona los contratos funerarios y cotizaciones
            </p>
          </div>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Contrato
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar por número, cliente o difunto..."
                  className="pl-9"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Lista de Contratos</CardTitle>
          </CardHeader>
          <CardContent>
            {contracts && contracts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Difunto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts.map((contrato) => (
                    <TableRow key={contrato.id}>
                      <TableCell className="font-medium">
                        {contrato.numero_contrato}
                      </TableCell>
                      <TableCell>{contrato.cliente.nombre}</TableCell>
                      <TableCell>
                        {contrato.difunto?.nombre || '-'}
                      </TableCell>
                      <TableCell>
                        {contrato.tipo === 'necesidad_inmediata'
                          ? 'Inmediata'
                          : 'Futura'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={estadoBadgeVariant(contrato.estado)}>
                          {estadoLabel(contrato.estado)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(contrato.total)}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {formatDate(contrato.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-error">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-gray-100 p-3 mb-4">
                  <Plus className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  No hay contratos registrados
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Comienza creando tu primer contrato funerario.
                </p>
                <Button onClick={handleCreate} className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Crear Primer Contrato
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
