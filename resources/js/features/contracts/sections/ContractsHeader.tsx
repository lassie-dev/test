import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ContractsHeaderProps {
  onCreateClick: () => void;
}

export function ContractsHeader({ onCreateClick }: ContractsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contratos</h1>
        <p className="mt-2 text-sm text-gray-600">
          Gestiona los contratos funerarios y cotizaciones
        </p>
      </div>
      <Button onClick={onCreateClick} className="gap-2">
        <Plus className="h-4 w-4" />
        Nuevo Contrato
      </Button>
    </div>
  );
}
