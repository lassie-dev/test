import { router } from '@inertiajs/react';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Eye, Edit, Trash2, Plus } from 'lucide-react';
import type { Contrato } from '../types';
import {
  formatearMoneda,
  formatearFecha,
  obtenerVarianteBadgeEstado,
  obtenerEtiquetaEstado,
  obtenerEtiquetaTipo,
} from '../functions';

interface ContractsTableProps {
  contracts: Contrato[];
  onCreateClick?: () => void;
}

export function ContractsTable({ contracts, onCreateClick }: ContractsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<Contrato | null>(null);

  const handleView = (id: number) => {
    router.visit(`/contracts/${id}`);
  };

  const handleEdit = (id: number) => {
    router.visit(`/contracts/${id}/edit`);
  };

  const handleDeleteClick = (contrato: Contrato) => {
    setContractToDelete(contrato);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (contractToDelete) {
      router.delete(`/contracts/${contractToDelete.id}`, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setContractToDelete(null);
        },
      });
    }
  };

  if (!contracts || contracts.length === 0) {
    return (
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
        {onCreateClick && (
          <Button onClick={onCreateClick} className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Crear Primer Contrato
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
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
                {obtenerEtiquetaTipo(contrato.tipo)}
              </TableCell>
              <TableCell>
                <Badge variant={obtenerVarianteBadgeEstado(contrato.estado) as any}>
                  {obtenerEtiquetaEstado(contrato.estado)}
                </Badge>
              </TableCell>
              <TableCell className="font-semibold">
                {formatearMoneda(contrato.total)}
              </TableCell>
              <TableCell className="text-gray-600">
                {formatearFecha(contrato.created_at)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleView(contrato.id)}
                    title="Ver detalles"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(contrato.id)}
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteClick(contrato)}
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar contrato?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar el contrato{' '}
              <span className="font-semibold">{contractToDelete?.numero_contrato}</span>
              {' '}del cliente{' '}
              <span className="font-semibold">{contractToDelete?.cliente.nombre}</span>?
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
