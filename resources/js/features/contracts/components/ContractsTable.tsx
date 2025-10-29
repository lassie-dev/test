import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { Eye, Edit, Trash2, Plus, FileText, Printer } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  const { t } = useTranslation();
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

  const handlePrintQuotation = (id: number) => {
    window.open(`/contracts/${id}/print-quotation`, '_blank');
  };

  const handlePrintContract = (id: number) => {
    window.open(`/contracts/${id}/print-contract`, '_blank');
  };

  const handlePrintSocialMediaAuth = (id: number) => {
    window.open(`/contracts/${id}/print-social-media-auth`, '_blank');
  };

  const handlePrintReceipt = (id: number) => {
    window.open(`/contracts/${id}/print-receipt`, '_blank');
  };

  if (!contracts || contracts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-gray-100 p-3 mb-4">
          <Plus className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          {t('contracts.noContracts')}
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          {t('contracts.noContractsDescription')}
        </p>
        {onCreateClick && (
          <Button onClick={onCreateClick} className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            {t('contracts.createFirstContract')}
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
            <TableHead>{t('contracts.number')}</TableHead>
            <TableHead>{t('contracts.client')}</TableHead>
            <TableHead>{t('contracts.deceased')}</TableHead>
            <TableHead>{t('contracts.type')}</TableHead>
            <TableHead>{t('contracts.status')}</TableHead>
            <TableHead>{t('contracts.total')}</TableHead>
            <TableHead>{t('contracts.date')}</TableHead>
            <TableHead className="text-right">{t('common.actions')}</TableHead>
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
                {t(obtenerEtiquetaTipo(contrato.tipo))}
              </TableCell>
              <TableCell>
                <Badge variant={obtenerVarianteBadgeEstado(contrato.estado) as any}>
                  {t(obtenerEtiquetaEstado(contrato.estado))}
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
                    title={t('contracts.viewDetails')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(contrato.id)}
                    title={t('common.edit')}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  {/* Print Documents Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        title={t('contracts.documents')}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t('contracts.documents')}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handlePrintQuotation(contrato.id)}>
                        <FileText className="mr-2 h-4 w-4" />
                        {t('contracts.printQuotation')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePrintContract(contrato.id)}>
                        <FileText className="mr-2 h-4 w-4" />
                        {t('contracts.printContract')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePrintSocialMediaAuth(contrato.id)}>
                        <FileText className="mr-2 h-4 w-4" />
                        {t('contracts.printSocialMediaAuth')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePrintReceipt(contrato.id)}>
                        <FileText className="mr-2 h-4 w-4" />
                        {t('contracts.printReceipt')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteClick(contrato)}
                    title={t('common.delete')}
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
            <AlertDialogTitle>{t('contracts.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('contracts.deleteConfirm')}{' '}
              <span className="font-semibold">{contractToDelete?.numero_contrato}</span>
              {' '}{t('contracts.ofClient')}{' '}
              <span className="font-semibold">{contractToDelete?.cliente.nombre}</span>?
              {' '}{t('contracts.deleteWarning')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
