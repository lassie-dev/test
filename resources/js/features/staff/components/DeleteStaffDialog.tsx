import { useTranslation } from 'react-i18next';
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
import type { StaffMember } from '../types';

interface DeleteStaffDialogProps {
  open: boolean;
  staffMember: StaffMember | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function DeleteStaffDialog({
  open,
  staffMember,
  onOpenChange,
  onConfirm,
}: DeleteStaffDialogProps) {
  const { t } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('staff.deleteConfirmTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('staff.deleteConfirmDescription', { name: staffMember?.name })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            {t('common.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
