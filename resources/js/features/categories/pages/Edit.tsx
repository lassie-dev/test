import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  type: 'service' | 'product';
  icon: string | null;
  parent_id: number | null;
}

interface Props {
  category: Category;
  parentCategories: Category[];
}

export default function Edit({ category, parentCategories }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    name: category.name || '',
    description: category.description || '',
    type: category.type || '',
    icon: category.icon || '',
    parent_id: category.parent_id ? category.parent_id.toString() : '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(`/categories/${category.id}`);
  };

  return (
    <MainLayout>
      <Head title="Editar Categoría" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Categoría</h1>
            <p className="mt-2 text-sm text-gray-600">
              Actualiza la información de la categoría
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.visit('/categories')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Información de la Categoría</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nombre <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="Ej: Ataúdes, Servicios de Velorio"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Type - Display only, not editable */}
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Input
                  id="type"
                  type="text"
                  value={data.type === 'product' ? 'Producto' : 'Servicio'}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500">
                  El tipo de categoría no puede ser modificado después de creada
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Descripción detallada de la categoría..."
                  rows={4}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              {/* Icon */}
              <div className="space-y-2">
                <Label htmlFor="icon">
                  Icono (Emoji)
                </Label>
                <Input
                  id="icon"
                  type="text"
                  value={data.icon}
                  onChange={(e) => setData('icon', e.target.value)}
                  placeholder="Ej: ⚰️ 🌹 🕯️"
                  maxLength={10}
                  className={errors.icon ? 'border-red-500' : ''}
                />
                {errors.icon && (
                  <p className="text-sm text-red-500">{errors.icon}</p>
                )}
                <p className="text-xs text-gray-500">
                  Puedes usar cualquier emoji para representar la categoría
                </p>
              </div>

              {/* Parent Category */}
              {parentCategories.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="parent_id">Categoría Padre (opcional)</Label>
                  <Select
                    value={data.parent_id || undefined}
                    onValueChange={(value) => setData('parent_id', value === 'none' ? '' : value)}
                  >
                    <SelectTrigger className={errors.parent_id ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Sin categoría padre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin categoría padre</SelectItem>
                      {parentCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.parent_id && (
                    <p className="text-sm text-red-500">{errors.parent_id}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Selecciona una categoría padre para crear una subcategoría
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.visit('/categories')}
                  disabled={processing}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={processing} className="gap-2">
                  <Save className="h-4 w-4" />
                  {processing ? 'Guardando...' : 'Actualizar Categoría'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </MainLayout>
  );
}
