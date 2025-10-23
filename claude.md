# Funeral ERP - Proyecto de Sistema de Gestión Funeraria

## Stack Tecnológico

### Backend
- **Framework:** Laravel 11.x
- **PHP Version:** 8.2+
- **Database:** MySQL 8.0+ 
- **Authentication:** Laravel Sanctum
- **Queue System:** Redis + Laravel Queue
- **Storage:** Laravel Storage (S3 compatible)
- **API:** RESTful via Laravel Controllers

### Frontend
- **Framework:** React 18.x
- **SSR/Routing:** Inertia.js 1.x
- **Styling:** TailwindCSS 3.x
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod validation
- **State Management:** Zustand (for client-side state)
- **Date Handling:** date-fns
- **HTTP Client:** Axios (via Inertia)

### Development Tools
- **Build Tool:** Vite
- **Package Manager:** npm
- **Code Quality:** ESLint + Prettier
- **Version Control:** Git

---

## Convenciones del Proyecto

### 1. Idioma y Localización

**CRÍTICO: Todo el texto visible para el usuario DEBE estar en español.**

```javascript
// ✅ CORRECTO
<Button>Guardar Contrato</Button>
<Label>Nombre del Difunto</Label>
const errorMessage = "El campo es requerido";

// ❌ INCORRECTO
<Button>Save Contract</Button>
<Label>Deceased Name</Label>
const errorMessage = "Field is required";
```

**Archivos de traducción:**
- Backend: `lang/es/*.php`
- Frontend: Texto directo en español (no usar i18n innecesariamente)
- Base de datos: Comentarios en español, nombres de tablas en inglés

### 2. Estructura del Proyecto

```
funeral-erp/
├── app/
│   ├── Http/
│   │   ├── Controllers/          # Controladores Inertia
│   │   ├── Middleware/
│   │   └── Requests/             # Form Requests con validación
│   ├── Models/                   # Eloquent Models
│   ├── Services/                 # Lógica de negocio
│   │   ├── ContractService.php
│   │   ├── PayrollService.php
│   │   ├── InventoryService.php
│   │   └── WhatsAppService.php
│   ├── Jobs/                     # Trabajos en cola
│   │   ├── SendWhatsAppMessage.php
│   │   └── UpdateInventoryJob.php
│   └── Enums/                    # Enumeraciones
│       ├── ContractType.php
│       ├── UserRole.php
│       └── PaymentStatus.php
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── factories/
├── resources/
│   ├── js/
│   │   ├── components/          # Componentes globales reutilizables
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   └── layouts/        # Layouts generales
│   │   ├── features/           # ARQUITECTURA FEATURE-BASED
│   │   │   ├── contratos/
│   │   │   │   ├── components/     # Componentes específicos de contratos
│   │   │   │   ├── sections/       # Secciones de página
│   │   │   │   ├── modals/         # Modales específicos
│   │   │   │   ├── types.ts        # Definiciones de tipos TypeScript
│   │   │   │   ├── schemas.ts      # Schemas Zod + tipos inferidos
│   │   │   │   ├── constants.ts    # Constantes del módulo
│   │   │   │   └── functions.ts    # Funciones de utilidad
│   │   │   ├── inventario/
│   │   │   │   ├── components/
│   │   │   │   ├── sections/
│   │   │   │   ├── modals/
│   │   │   │   ├── types.ts
│   │   │   │   ├── schemas.ts
│   │   │   │   ├── constants.ts
│   │   │   │   └── functions.ts
│   │   │   ├── pagos/
│   │   │   ├── personal/
│   │   │   ├── liquidaciones/
│   │   │   ├── reportes/
│   │   │   └── dashboard/
│   │   ├── pages/              # Páginas Inertia (orquestadoras)
│   │   │   ├── Contratos/
│   │   │   │   ├── Index.tsx
│   │   │   │   ├── Crear.tsx
│   │   │   │   ├── Editar.tsx
│   │   │   │   └── Ver.tsx
│   │   │   ├── Inventario/
│   │   │   ├── Pagos/
│   │   │   ├── Personal/
│   │   │   ├── Liquidaciones/
│   │   │   ├── Reportes/
│   │   │   └── Dashboard/
│   │   ├── hooks/              # Custom React hooks globales
│   │   ├── lib/                # Utilidades globales
│   │   │   ├── utils.ts
│   │   │   └── cn.ts
│   │   └── types/              # Tipos TypeScript globales
│   │       ├── inertia.d.ts
│   │       └── global.d.ts
│   └── css/
│       └── app.css             # Tailwind imports
├── routes/
│   ├── web.php                 # Rutas Inertia
│   └── api.php                 # API routes (si necesario)
├── tests/
│   ├── Feature/
│   └── Unit/
└── storage/
    └── app/
        ├── documents/          # PDFs, contratos
        ├── photos/             # Fotos de difuntos
        └── backups/            # Backups automáticos
```

### 3. Convenciones de Nomenclatura

#### Backend (Laravel)
```php
// Modelos: Singular, PascalCase
class Contract extends Model {}
class Employee extends Model {}

// Tablas: Plural, snake_case
Schema::create('contracts', function() {});
Schema::create('inventory_items', function() {});

// Controladores: Singular + Controller
class ContractController extends Controller {}

// Servicios: Singular + Service
class ContractService {}

// Jobs: Verbo + Sustantivo + Job
class SendWhatsAppMessageJob {}

// Métodos: camelCase, verbos descriptivos en español
public function crearContrato() {}
public function actualizarInventario() {}
public function calcularComisiones() {}
```

#### Frontend (React/TypeScript)
```typescript
// Componentes: PascalCase
const FormularioContrato = () => {}
const TablaInventario = () => {}

// Archivos de componentes: PascalCase.tsx
FormularioContrato.tsx
TablaInventario.tsx

// Páginas Inertia: PascalCase.tsx
pages/Contratos/Crear.tsx
pages/Contratos/Editar.tsx
pages/Contratos/Index.tsx

// Hooks personalizados: camelCase con prefijo 'use'
const useContrato = () => {}
const usePermisos = () => {}

// Utilidades: camelCase
const formatearMoneda = () => {}
const calcularDescuento = () => {}

// Constantes: SCREAMING_SNAKE_CASE
const PORCENTAJES_DESCUENTO = [3, 5, 8, 10, 15, 25, 30];

// Tipos TypeScript: PascalCase
type Contrato = { ... }
interface Cliente { ... }

// Archivos de tipos: lowercase con extensión .ts
types.ts
schemas.ts
constants.ts
functions.ts
```

### 3.1. Arquitectura Feature-Based (OBLIGATORIO)

**CRÍTICO: Todo el código frontend DEBE organizarse por funcionalidad dentro de `resources/js/features/[feature-name]`**

#### Estructura de un Feature

Cada feature DEBE contener exactamente esta estructura:

```
features/
└── [feature-name]/
    ├── components/          # Componentes React específicos del feature
    ├── sections/           # Secciones de página (bloques grandes)
    ├── modals/             # Modales específicos del feature
    ├── types.ts            # TODAS las definiciones de tipos TypeScript
    ├── schemas.ts          # TODOS los schemas Zod + tipos inferidos
    ├── constants.ts        # TODAS las constantes
    └── functions.ts        # TODAS las funciones utilitarias
```

#### Reglas de Organización de Archivos

##### **1. types.ts - Definiciones de Tipos**

**DEBE contener:**
- Todas las interfaces
- Todos los tipos TypeScript
- Todos los enums de TypeScript
- Tipos de props de componentes
- Tipos de estado
- Tipos de respuestas API

**Orden topológico:** De lo más básico a lo más complejo

```typescript
// ✅ CORRECTO: features/contratos/types.ts

// 1. Enums básicos (sin dependencias)
export enum TipoContrato {
  NECESIDAD_INMEDIATA = 'necesidad_inmediata',
  NECESIDAD_FUTURA = 'necesidad_futura',
}

export enum EstadoContrato {
  COTIZACION = 'cotizacion',
  CONTRATO = 'contrato',
  FINALIZADO = 'finalizado',
  CANCELADO = 'cancelado',
}

// 2. Tipos básicos (sin dependencias complejas)
export type Rut = string;
export type Telefono = string;

// 3. Interfaces básicas
export interface Cliente {
  id: number;
  nombre: string;
  rut: Rut;
  telefono: Telefono;
  email?: string;
}

export interface Difunto {
  id: number;
  nombre: string;
  fecha_fallecimiento: Date;
  lugar_fallecimiento?: string;
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
}

// 4. Interfaces que dependen de tipos básicos
export interface ContratoServicio {
  servicio: Servicio;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

// 5. Interfaces complejas (dependen de otras)
export interface Contrato {
  id: number;
  numero_contrato: string;
  tipo: TipoContrato;
  estado: EstadoContrato;
  cliente: Cliente;
  difunto?: Difunto;
  servicios: ContratoServicio[];
  subtotal: number;
  descuento_porcentaje: number;
  descuento_monto: number;
  total: number;
  es_festivo: boolean;
  es_nocturno: boolean;
  created_at: Date;
  updated_at: Date;
}

// 6. Tipos derivados usando utility types
export type ContratoFormData = Omit<Contrato, 'id' | 'numero_contrato' | 'created_at' | 'updated_at'>;
export type ContratoPartial = Partial<Contrato>;
export type ContratoPicker = Pick<Contrato, 'id' | 'numero_contrato' | 'cliente' | 'total'>;

// 7. Props de componentes
export interface FormularioContratoProps {
  contrato?: ContratoPartial;
  onSubmit: (data: ContratoFormData) => void;
  isLoading?: boolean;
}

export interface TablaContratosProps {
  contratos: Contrato[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}
```

##### **2. schemas.ts - Schemas Zod**

**DEBE contener:**
- Todos los schemas de validación Zod
- Tipos inferidos desde los schemas
- NUNCA duplicar tipos que están en types.ts

```typescript
// ✅ CORRECTO: features/contratos/schemas.ts
import { z } from 'zod';
import { TipoContrato } from './types';

// Schemas básicos
export const rutSchema = z
  .string()
  .regex(/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/, 'Formato de RUT inválido');

export const telefonoSchema = z
  .string()
  .min(8, 'Teléfono debe tener al menos 8 dígitos');

// Schema de cliente
export const clienteSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  rut: rutSchema,
  telefono: telefonoSchema,
  email: z.string().email('Email inválido').optional(),
});

// Schema de difunto
export const difuntoSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  fecha_fallecimiento: z.date(),
  lugar_fallecimiento: z.string().optional(),
});

// Schema de servicio en contrato
export const contratoServicioSchema = z.object({
  servicio_id: z.number(),
  cantidad: z.number().min(1, 'La cantidad debe ser al menos 1'),
  precio_unitario: z.number().positive('El precio debe ser positivo'),
});

// Schema principal de contrato
export const contratoFormSchema = z.object({
  tipo: z.nativeEnum(TipoContrato),
  cliente: clienteSchema,
  difunto: difuntoSchema.optional(),
  servicios: z.array(contratoServicioSchema).min(1, 'Debe seleccionar al menos un servicio'),
  descuento: z.enum(['0', '3', '5', '8', '10', '15', '25', '30']).default('0'),
  forma_pago: z.enum(['contado', 'credito']),
});

// Tipos inferidos desde schemas (SOLO cuando sea necesario)
export type ContratoFormInput = z.infer<typeof contratoFormSchema>;
export type ClienteInput = z.infer<typeof clienteSchema>;
export type DifuntoInput = z.infer<typeof difuntoSchema>;

// ❌ INCORRECTO: NO duplicar tipos que ya existen en types.ts
// export type Contrato = z.infer<typeof contratoSchema>; // ¡NO HACER ESTO!
```

##### **3. constants.ts - Constantes**

**DEBE contener:**
- Todas las constantes del módulo
- Arrays de opciones
- Valores por defecto
- Configuraciones estáticas

```typescript
// ✅ CORRECTO: features/contratos/constants.ts

export const PORCENTAJES_DESCUENTO = [0, 3, 5, 8, 10, 15, 25, 30] as const;

export const TIPOS_CONTRATO_OPTIONS = [
  { value: 'necesidad_inmediata', label: 'Necesidad Inmediata' },
  { value: 'necesidad_futura', label: 'Necesidad Futura' },
] as const;

export const ESTADOS_CONTRATO_OPTIONS = [
  { value: 'cotizacion', label: 'Cotización' },
  { value: 'contrato', label: 'Contrato' },
  { value: 'finalizado', label: 'Finalizado' },
  { value: 'cancelado', label: 'Cancelado' },
] as const;

export const FORMAS_PAGO_OPTIONS = [
  { value: 'contado', label: 'Contado' },
  { value: 'credito', label: 'Crédito' },
] as const;

export const DEFAULT_CONTRATO_VALUES = {
  tipo: 'necesidad_inmediata',
  descuento: '0',
  forma_pago: 'contado',
} as const;

export const COMISION_BASE_PORCENTAJE = 5;
export const COMISION_NOCTURNA_EXTRA = 2;
export const COMISION_FESTIVO_EXTRA = 3;
```

##### **4. functions.ts - Funciones Utilitarias**

**DEBE contener:**
- Todas las funciones de utilidad del módulo
- Funciones que usan types, schemas o constants
- Lógica de negocio del frontend
- Transformaciones de datos

**Orden topológico:** De funciones básicas a complejas

```typescript
// ✅ CORRECTO: features/contratos/functions.ts
import { Contrato, ContratoServicio } from './types';
import { PORCENTAJES_DESCUENTO, COMISION_BASE_PORCENTAJE } from './constants';

// 1. Funciones básicas (sin dependencias)
export function formatearRut(rut: string): string {
  const limpio = rut.replace(/[^0-9kK]/g, '');
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  return cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv;
}

export function validarRut(rut: string): boolean {
  const limpio = rut.replace(/[^0-9kK]/g, '');
  if (limpio.length < 2) return false;

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1).toUpperCase();

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += multiplo * parseInt(cuerpo[i]);
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const dvEsperado = 11 - (suma % 11);
  const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

  return dv === dvCalculado;
}

// 2. Funciones de cálculo (usan constantes)
export function calcularSubtotal(servicios: ContratoServicio[]): number {
  return servicios.reduce((acc, item) => acc + item.subtotal, 0);
}

export function calcularDescuento(subtotal: number, porcentaje: number): number {
  if (!PORCENTAJES_DESCUENTO.includes(porcentaje as any)) {
    throw new Error(`Porcentaje de descuento inválido: ${porcentaje}`);
  }
  return (subtotal * porcentaje) / 100;
}

export function calcularTotal(subtotal: number, descuentoMonto: number): number {
  return Math.max(0, subtotal - descuentoMonto);
}

// 3. Funciones complejas (usan tipos y otras funciones)
export function calcularTotalesContrato(
  servicios: ContratoServicio[],
  descuentoPorcentaje: number
): {
  subtotal: number;
  descuentoMonto: number;
  total: number;
} {
  const subtotal = calcularSubtotal(servicios);
  const descuentoMonto = calcularDescuento(subtotal, descuentoPorcentaje);
  const total = calcularTotal(subtotal, descuentoMonto);

  return { subtotal, descuentoMonto, total };
}

export function calcularComisionSecretaria(
  contrato: Contrato
): number {
  let porcentajeComision = COMISION_BASE_PORCENTAJE;

  if (contrato.es_nocturno) {
    porcentajeComision += 2;
  }

  if (contrato.es_festivo) {
    porcentajeComision += 3;
  }

  return (contrato.total * porcentajeComision) / 100;
}

// 4. Funciones de transformación
export function contratoToFormData(contrato: Contrato): Partial<Contrato> {
  return {
    tipo: contrato.tipo,
    cliente: contrato.cliente,
    difunto: contrato.difunto,
    servicios: contrato.servicios,
    descuento_porcentaje: contrato.descuento_porcentaje,
  };
}

export function formatearNumeroContrato(numero: number): string {
  return `CTR-${numero.toString().padStart(6, '0')}`;
}
```

#### Reglas Críticas de Separación

##### ❌ PROHIBIDO: Re-exportaciones

```typescript
// ❌ INCORRECTO: features/contratos/index.ts
export * from './types';
export * from './schemas';
export * from './constants';
export * from './functions';

// ❌ INCORRECTO: features/contratos/components/index.ts
export { FormularioContrato } from './FormularioContrato';
export { TablaContratos } from './TablaContratos';
```

##### ✅ CORRECTO: Importaciones Directas

```typescript
// ✅ CORRECTO: pages/Contratos/Crear.tsx
import { Contrato, ContratoFormData } from '@/features/contratos/types';
import { contratoFormSchema } from '@/features/contratos/schemas';
import { PORCENTAJES_DESCUENTO } from '@/features/contratos/constants';
import { calcularTotalesContrato } from '@/features/contratos/functions';
import { FormularioContrato } from '@/features/contratos/components/FormularioContrato';
```

#### Uso de Utility Types

**OBLIGATORIO:** Usar utility types de TypeScript para simplificar código

```typescript
// ✅ CORRECTO: Usar utility types
export type ContratoFormData = Omit<Contrato, 'id' | 'numero_contrato' | 'created_at' | 'updated_at'>;
export type ContratoPartial = Partial<Contrato>;
export type ContratoPicker = Pick<Contrato, 'id' | 'numero_contrato' | 'total'>;
export type ContratoReadonly = Readonly<Contrato>;

// Para hacer campos opcionales específicos
export type ContratoConDifuntoOpcional = Omit<Contrato, 'difunto'> & {
  difunto?: Difunto;
};

// ❌ INCORRECTO: Duplicar toda la interfaz
export interface ContratoFormData {
  tipo: TipoContrato;
  estado: EstadoContrato;
  cliente: Cliente;
  // ... duplicando todo manualmente
}
```

#### Ejemplo Completo de Feature

```
features/contratos/
├── components/
│   ├── FormularioContrato.tsx
│   ├── TablaContratos.tsx
│   ├── ContratoCard.tsx
│   └── SelectorServicios.tsx
├── sections/
│   ├── ContratoHeader.tsx
│   ├── DetalleCliente.tsx
│   └── ResumenFinanciero.tsx
├── modals/
│   ├── ConfirmarEliminacionModal.tsx
│   └── AplicarDescuentoModal.tsx
├── types.ts              # Todos los tipos
├── schemas.ts            # Todos los schemas Zod
├── constants.ts          # Todas las constantes
└── functions.ts          # Todas las funciones
```

#### Checklist de Validación

Antes de crear o modificar un feature, verificar:

- [ ] ¿Todos los tipos están en `types.ts`?
- [ ] ¿Todos los schemas Zod están en `schemas.ts`?
- [ ] ¿Todas las constantes están en `constants.ts`?
- [ ] ¿Todas las funciones están en `functions.ts`?
- [ ] ¿No hay re-exportaciones en ningún archivo?
- [ ] ¿Los archivos están organizados en orden topológico?
- [ ] ¿Se usan utility types (Omit, Pick, Partial) donde es posible?
- [ ] ¿No hay duplicación de tipos entre archivos?
- [ ] ¿Cada archivo tiene una responsabilidad clara?

### 4. Diseño de UI - Lineamientos Obligatorios

#### Paleta de Colores
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Fondo principal: blanco limpio
        background: '#FFFFFF',

        // Acentos primarios (funerario - sobrio y profesional)
        primary: {
          50: '#f5f7fa',
          100: '#eaeef4',
          200: '#d1dbe6',
          300: '#a8bcd1',
          400: '#7998b8',
          500: '#567a9e',  // Principal
          600: '#446184',
          700: '#38506c',
          800: '#31445b',
          900: '#2d3c4d',
        },

        // Secundario (dorado elegante - para detalles importantes)
        secondary: {
          50: '#faf9f5',
          100: '#f4f1e6',
          200: '#e6dfc7',
          300: '#d4c79f',
          400: '#c0aa75',
          500: '#b09355',  // Principal
          600: '#a37d49',
          700: '#88653e',
          800: '#6f5337',
          900: '#5c442f',
        },

        // Estados
        success: '#10b981',  // Verde
        warning: '#f59e0b',  // Ámbar
        error: '#ef4444',    // Rojo
        info: '#3b82f6',     // Azul

        // Grises (para textos y bordes)
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      }
    }
  }
}
```

#### Principios de Diseño

1. **Fondo Blanco Limpio**
   - Fondo principal: `bg-white`
   - Secciones alternadas: `bg-gray-50` (muy sutil)
   - Tarjetas: `bg-white` con `border` y sombra sutil

2. **Jerarquía Visual Clara**
   ```jsx
   // Títulos principales
   <h1 className="text-3xl font-bold text-gray-900">

   // Subtítulos
   <h2 className="text-xl font-semibold text-gray-800">

   // Texto normal
   <p className="text-base text-gray-700">

   // Texto secundario
   <span className="text-sm text-gray-500">
   ```

3. **Espaciado Consistente**
   - Padding de contenedores principales: `p-6` o `p-8`
   - Espaciado entre elementos: `space-y-4` o `gap-4`
   - Margen de secciones: `mb-6` o `mb-8`

4. **Bordes y Sombras Sutiles**
   ```jsx
   // Tarjetas
   className="bg-white border border-gray-200 rounded-lg shadow-sm"

   // Modales
   className="bg-white rounded-xl shadow-xl border border-gray-200"

   // Inputs
   className="border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
   ```

5. **Componentes shadcn/ui**
   - Usar siempre los componentes de shadcn/ui como base
   - Personalizar con clases de Tailwind según necesidad
   - Mantener consistencia visual en toda la aplicación

#### Ejemplo de Layout Principal
```jsx
import { Head } from '@inertiajs/react';
import { SidebarNav } from '@/Components/Layouts/SidebarNav';
import { TopBar } from '@/Components/Layouts/TopBar';

export default function MainLayout({ children, title }) {
  return (
    <div className="min-h-screen bg-white">
      <Head title={title} />

      {/* Barra superior */}
      <TopBar className="border-b border-gray-200 bg-white" />

      <div className="flex">
        {/* Sidebar */}
        <SidebarNav className="w-64 border-r border-gray-200 bg-gray-50" />

        {/* Contenido principal */}
        <main className="flex-1 p-8 bg-white">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
```

### 5. Arquitectura de Componentes

#### shadcn/ui Components Setup
```bash
# Instalar shadcn/ui CLI
npx shadcn-ui@latest init

# Componentes esenciales a instalar
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add form
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add select
npx shadcn-ui@latest add table
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add sheet
```

#### Estructura de Componentes Personalizados
```jsx
// Ejemplo: FormularioContrato.jsx
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';

export function FormularioContrato({ contrato, onSubmit }) {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Nuevo Contrato Funerario
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="difunto" className="text-gray-700">
              Nombre del Difunto
            </Label>
            <Input
              id="difunto"
              placeholder="Ingrese el nombre completo"
              className="border-gray-300"
            />
          </div>

          <Button type="submit" className="bg-primary-600 hover:bg-primary-700">
            Guardar Contrato
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

### 6. Patrones de Datos con Inertia.js

#### Pasar Datos desde Laravel
```php
// ContractController.php
use Inertia\Inertia;

public function index()
{
    return Inertia::render('Contratos/Index', [
        'contratos' => Contract::with(['cliente', 'difunto'])
            ->latest()
            ->paginate(20),
        'estadisticas' => [
            'total_mes' => Contract::whereMonth('created_at', now())->count(),
            'ingresos_mes' => Contract::whereMonth('created_at', now())->sum('total'),
        ],
        'filtros' => request()->only(['tipo', 'estado', 'fecha']),
    ]);
}

public function store(StoreContractRequest $request)
{
    $contrato = app(ContractService::class)->crearContrato($request->validated());

    return redirect()
        ->route('contratos.show', $contrato)
        ->with('success', 'Contrato creado exitosamente');
}
```

#### Recibir Datos en React
```jsx
// Pages/Contratos/Index.jsx
import { Head, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { TablaContratos } from '@/Components/Tables/TablaContratos';
import { EstadisticasCard } from '@/Components/Dashboard/EstadisticasCard';

export default function Index({ contratos, estadisticas, filtros }) {
  const handleCrearContrato = () => {
    router.visit(route('contratos.create'));
  };

  return (
    <>
      <Head title="Contratos Funerarios" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Contratos Funerarios
          </h1>
          <Button
            onClick={handleCrearContrato}
            className="bg-primary-600 hover:bg-primary-700"
          >
            Nuevo Contrato
          </Button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EstadisticasCard
            titulo="Contratos del Mes"
            valor={estadisticas.total_mes}
            icono="FileText"
          />
          <EstadisticasCard
            titulo="Ingresos del Mes"
            valor={`$${estadisticas.ingresos_mes.toLocaleString('es-CL')}`}
            icono="DollarSign"
          />
        </div>

        {/* Tabla */}
        <TablaContratos
          contratos={contratos}
          filtros={filtros}
        />
      </div>
    </>
  );
}
```

### 7. Manejo de Formularios

#### Validación Backend
```php
// app/Http/Requests/StoreContractRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContractRequest extends FormRequest
{
    public function rules()
    {
        return [
            'tipo_contrato' => 'required|in:necesidad_inmediata,necesidad_futura',
            'cliente.nombre' => 'required|string|max:255',
            'cliente.rut' => 'required|string|cl_rut',
            'cliente.telefono' => 'required|string',
            'difunto.nombre' => 'required_if:tipo_contrato,necesidad_inmediata',
            'difunto.fecha_fallecimiento' => 'required_if:tipo_contrato,necesidad_inmediata|date',
            'servicios' => 'required|array|min:1',
            'servicios.*.id' => 'required|exists:servicios,id',
            'servicios.*.cantidad' => 'required|integer|min:1',
            'descuento' => 'nullable|in:0,3,5,8,10,15,25,30',
            'forma_pago' => 'required|in:contado,credito',
        ];
    }

    public function messages()
    {
        return [
            'tipo_contrato.required' => 'Debe seleccionar el tipo de contrato',
            'cliente.nombre.required' => 'El nombre del cliente es obligatorio',
            'cliente.rut.cl_rut' => 'El RUT ingresado no es válido',
            'difunto.nombre.required_if' => 'El nombre del difunto es obligatorio para contratos de necesidad inmediata',
            'servicios.required' => 'Debe seleccionar al menos un servicio',
        ];
    }
}
```

#### Validación Frontend (React Hook Form + Zod)
```tsx
// pages/Contratos/Crear.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';

// Importaciones directas desde el feature (NO re-exports)
import { contratoFormSchema, ContratoFormInput } from '@/features/contratos/schemas';
import { DEFAULT_CONTRATO_VALUES } from '@/features/contratos/constants';
import { FormularioContrato } from '@/features/contratos/components/FormularioContrato';

export default function Crear() {
  const form = useForm<ContratoFormInput>({
    resolver: zodResolver(contratoFormSchema),
    defaultValues: {
      tipo: DEFAULT_CONTRATO_VALUES.tipo,
      cliente: { nombre: '', rut: '', telefono: '' },
      descuento: DEFAULT_CONTRATO_VALUES.descuento,
      forma_pago: DEFAULT_CONTRATO_VALUES.forma_pago,
    }
  });

  const onSubmit = (data: ContratoFormInput) => {
    router.post(route('contratos.store'), data, {
      onSuccess: () => {
        toast({
          title: 'Éxito',
          description: 'Contrato creado exitosamente',
        });
      },
      onError: (errors) => {
        Object.keys(errors).forEach((key) => {
          form.setError(key as any, { message: errors[key] });
        });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Crear Nuevo Contrato
      </h1>

      <FormularioContrato
        form={form}
        onSubmit={onSubmit}
        isLoading={form.formState.isSubmitting}
      />
    </div>
  );
}
```

```tsx
// features/contratos/components/FormularioContrato.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';

// Importaciones directas desde el feature
import { ContratoFormInput } from '../schemas';
import { TIPOS_CONTRATO_OPTIONS, PORCENTAJES_DESCUENTO } from '../constants';

interface FormularioContratoProps {
  form: UseFormReturn<ContratoFormInput>;
  onSubmit: (data: ContratoFormInput) => void;
  isLoading?: boolean;
}

export function FormularioContrato({ form, onSubmit, isLoading }: FormularioContratoProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Tipo de Contrato */}
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Tipo de Contrato</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Seleccione tipo de contrato" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TIPOS_CONTRATO_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nombre del Cliente */}
        <FormField
          control={form.control}
          name="cliente.nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Nombre del Cliente</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ingrese el nombre completo"
                  className="border-gray-300"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* RUT */}
        <FormField
          control={form.control}
          name="cliente.rut"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">RUT</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="12.345.678-9"
                  className="border-gray-300"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="bg-primary-600 hover:bg-primary-700"
        >
          {isLoading ? 'Guardando...' : 'Crear Contrato'}
        </Button>
      </form>
    </Form>
  );
}
```

### 8. Autenticación y Autorización

#### Roles y Permisos
```php
// app/Enums/UserRole.php
namespace App\Enums;

enum UserRole: string
{
    case PROPIETARIO = 'propietario';
    case ADMINISTRADOR = 'administrador';
    case SECRETARIA = 'secretaria';
    case CONDUCTOR = 'conductor';
    case AUXILIAR = 'auxiliar';

    public function label(): string
    {
        return match($this) {
            self::PROPIETARIO => 'Propietario',
            self::ADMINISTRADOR => 'Administrador',
            self::SECRETARIA => 'Secretaria',
            self::CONDUCTOR => 'Conductor',
            self::AUXILIAR => 'Auxiliar',
        };
    }

    public function permisos(): array
    {
        return match($this) {
            self::PROPIETARIO => ['*'],
            self::ADMINISTRADOR => [
                'contratos.*',
                'inventario.*',
                'personal.*',
                'reportes.*',
            ],
            self::SECRETARIA => [
                'contratos.create',
                'contratos.update',
                'contratos.view',
                'pagos.*',
            ],
            self::CONDUCTOR => [
                'servicios.view',
                'servicios.update_status',
            ],
            self::AUXILIAR => [
                'servicios.view',
            ],
        };
    }
}
```

#### Middleware de Permisos
```php
// app/Http/Middleware/CheckPermission.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission)
    {
        if (!$request->user()->tienePermiso($permission)) {
            abort(403, 'No tienes permiso para acceder a esta sección');
        }

        return $next($request);
    }
}
```

#### Compartir Usuario en Inertia
```php
// app/Http/Middleware/HandleInertiaRequests.php
public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'auth' => [
            'usuario' => $request->user() ? [
                'id' => $request->user()->id,
                'nombre' => $request->user()->nombre,
                'email' => $request->user()->email,
                'rol' => $request->user()->rol,
                'permisos' => $request->user()->rol->permisos(),
            ] : null,
        ],
        'flash' => [
            'success' => fn () => $request->session()->get('success'),
            'error' => fn () => $request->session()->get('error'),
        ],
    ]);
}
```

#### Hook de Permisos en React
```typescript
// hooks/usePermisos.ts
import { usePage } from '@inertiajs/react';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  permisos: string[];
}

interface PageProps {
  auth: {
    usuario: Usuario | null;
  };
}

export function usePermisos() {
  const { auth } = usePage<PageProps>().props;

  const tienePermiso = (permiso: string): boolean => {
    if (!auth.usuario) return false;
    if (auth.usuario.permisos.includes('*')) return true;

    return auth.usuario.permisos.some(p => {
      if (p === permiso) return true;
      if (p.endsWith('.*')) {
        const prefix = p.slice(0, -2);
        return permiso.startsWith(prefix);
      }
      return false;
    });
  };

  const esRol = (rol: string): boolean => {
    return auth.usuario?.rol === rol;
  };

  return { tienePermiso, esRol, usuario: auth.usuario };
}
```

```tsx
// features/contratos/components/ContratoActions.tsx
import { Button } from '@/components/ui/button';
import { usePermisos } from '@/hooks/usePermisos';
import { Contrato } from '../types';

interface ContratoActionsProps {
  contrato: Contrato;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function ContratoActions({ contrato, onEdit, onDelete }: ContratoActionsProps) {
  const { tienePermiso } = usePermisos();

  return (
    <div className="flex gap-2">
      {tienePermiso('contratos.update') && (
        <Button
          onClick={() => onEdit(contrato.id)}
          className="bg-primary-600 hover:bg-primary-700"
        >
          Editar
        </Button>
      )}
      {tienePermiso('contratos.delete') && (
        <Button
          variant="destructive"
          onClick={() => onDelete(contrato.id)}
        >
          Eliminar
        </Button>
      )}
    </div>
  );
}
```

### 9. Trabajo con Colas y Jobs

#### Configuración de WhatsApp Automatizado
```php
// app/Jobs/SendWhatsAppMessageJob.php
namespace App\Jobs;

use App\Services\WhatsAppService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendWhatsAppMessageJob implements ShouldQueue
{
    use InteractsWithQueue, Queueable;

    public function __construct(
        public string $telefono,
        public string $plantilla,
        public array $parametros,
    ) {}

    public function handle(WhatsAppService $whatsapp)
    {
        $whatsapp->enviarMensaje(
            $this->telefono,
            $this->plantilla,
            $this->parametros
        );
    }
}

// Programar mensajes automáticos
// app/Services/ContractService.php
public function programarMensajesAutomaticos(Contract $contrato)
{
    // Mensaje al conductor (inmediato)
    SendWhatsAppMessageJob::dispatch(
        $contrato->conductor->telefono,
        'instrucciones_servicio',
        ['nombre' => $contrato->difunto->nombre, 'direccion' => $contrato->direccion_velorio]
    );

    // Tips a la familia (4 horas después)
    SendWhatsAppMessageJob::dispatch(
        $contrato->cliente->telefono,
        'tips_familia',
        ['nombre_familia' => $contrato->cliente->nombre]
    )->delay(now()->addHours(4));

    // Tarjetas digitales (5 días)
    SendWhatsAppMessageJob::dispatch(
        $contrato->cliente->telefono,
        'tarjetas_digitales',
        ['url_tarjeta' => $contrato->url_tarjeta_digital]
    )->delay(now()->addDays(5));

    // Encuesta (8 días)
    SendWhatsAppMessageJob::dispatch(
        $contrato->cliente->telefono,
        'encuesta_servicio',
        ['url_encuesta' => route('encuestas.show', $contrato)]
    )->delay(now()->addDays(8));
}
```

### 10. Testing

#### Tests de Feature (Laravel)
```php
// tests/Feature/ContractTest.php
namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Contract;

class ContractTest extends TestCase
{
    public function test_secretaria_puede_crear_contrato()
    {
        $secretaria = User::factory()->secretaria()->create();

        $response = $this->actingAs($secretaria)
            ->post(route('contratos.store'), [
                'tipo_contrato' => 'necesidad_inmediata',
                'cliente' => [
                    'nombre' => 'Juan Pérez',
                    'rut' => '12.345.678-9',
                    'telefono' => '+56912345678',
                ],
                'difunto' => [
                    'nombre' => 'María Pérez',
                    'fecha_fallecimiento' => now(),
                ],
                'servicios' => [
                    ['id' => 1, 'cantidad' => 1],
                ],
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('contracts', [
            'tipo_contrato' => 'necesidad_inmediata',
        ]);
    }

    public function test_calculo_de_comisiones_es_correcto()
    {
        $contrato = Contract::factory()->create([
            'total' => 1000000,
            'created_at' => now()->setHour(22), // Horario nocturno
        ]);

        $comision = app(PayrollService::class)->calcularComision($contrato);

        // Comisión nocturna debe ser mayor
        $this->assertGreaterThan(50000, $comision);
    }
}
```

### 11. Utilidades Comunes

#### Formateo de Moneda (Chile)
```javascript
// resources/js/Lib/utils.js
export function formatearMoneda(valor) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(valor);
}

export function formatearRut(rut) {
  // 12345678-9 -> 12.345.678-9
  const limpio = rut.replace(/[^0-9kK]/g, '');
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);

  return cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv;
}

export function formatearFecha(fecha) {
  return format(new Date(fecha), "dd 'de' MMMM 'de' yyyy", { locale: es });
}

export function formatearFechaHora(fecha) {
  return format(new Date(fecha), "dd/MM/yyyy HH:mm", { locale: es });
}
```

#### Validador de RUT Chileno
```php
// app/Rules/ChileanRut.php
namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class ChileanRut implements Rule
{
    public function passes($attribute, $value)
    {
        $rut = preg_replace('/[^0-9kK]/', '', $value);
        $cuerpo = substr($rut, 0, -1);
        $dv = strtoupper(substr($rut, -1));

        $suma = 0;
        $multiplo = 2;

        for ($i = strlen($cuerpo) - 1; $i >= 0; $i--) {
            $suma += $multiplo * $cuerpo[$i];
            $multiplo = $multiplo < 7 ? $multiplo + 1 : 2;
        }

        $dvEsperado = 11 - ($suma % 11);
        $dvEsperado = $dvEsperado == 11 ? '0' : ($dvEsperado == 10 ? 'K' : (string)$dvEsperado);

        return $dv === $dvEsperado;
    }

    public function message()
    {
        return 'El RUT ingresado no es válido.';
    }
}
```

### 12. Base de Datos - Convenciones

#### Migraciones Importantes
```php
// Estructura de tabla contratos
Schema::create('contracts', function (Blueprint $table) {
    $table->id();
    $table->string('numero_contrato')->unique();
    $table->enum('tipo', ['necesidad_inmediata', 'necesidad_futura']);
    $table->foreignId('cliente_id')->constrained('clients');
    $table->foreignId('difunto_id')->nullable()->constrained('deceased');
    $table->foreignId('secretaria_id')->constrained('users');
    $table->decimal('subtotal', 12, 2);
    $table->decimal('descuento_porcentaje', 5, 2)->default(0);
    $table->decimal('descuento_monto', 12, 2)->default(0);
    $table->decimal('total', 12, 2);
    $table->enum('estado', ['cotizacion', 'contrato', 'finalizado', 'cancelado']);
    $table->boolean('es_festivo')->default(false);
    $table->boolean('es_nocturno')->default(false);
    $table->timestamps();
    $table->softDeletes();
});
```

#### Relaciones Eloquent
```php
// app/Models/Contract.php
class Contract extends Model
{
    protected $casts = [
        'tipo' => ContractType::class,
        'estado' => ContractStatus::class,
        'es_festivo' => 'boolean',
        'es_nocturno' => 'boolean',
        'created_at' => 'datetime',
    ];

    public function cliente()
    {
        return $this->belongsTo(Client::class);
    }

    public function difunto()
    {
        return $this->belongsTo(Deceased::class);
    }

    public function secretaria()
    {
        return $this->belongsTo(User::class, 'secretaria_id');
    }

    public function servicios()
    {
        return $this->belongsToMany(Service::class, 'contract_services')
            ->withPivot('cantidad', 'precio_unitario', 'subtotal');
    }

    public function productos()
    {
        return $this->belongsToMany(Product::class, 'contract_products')
            ->withPivot('cantidad', 'precio_unitario', 'subtotal');
    }

    // Scopes
    public function scopeNecesidadInmediata($query)
    {
        return $query->where('tipo', ContractType::NECESIDAD_INMEDIATA);
    }

    public function scopeDelMes($query)
    {
        return $query->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year);
    }
}
```

### 13. Seguridad

- **Sanitización de inputs:** Laravel hace sanitización automática
- **CSRF Protection:** Inertia maneja tokens automáticamente
- **SQL Injection:** Usar Eloquent ORM siempre
- **XSS Prevention:** React escapa automáticamente
- **Rate Limiting:** Aplicar en rutas sensibles
- **Validación en ambos lados:** Backend (obligatorio) + Frontend (UX)

```php
// routes/web.php
Route::middleware(['auth', 'throttle:60,1'])->group(function () {
    Route::resource('contratos', ContractController::class);
});
```

### 14. Performance

- **Eager Loading:** Usar `with()` para evitar N+1 queries
- **Paginación:** Siempre paginar listados grandes
- **Cache:** Redis para datos frecuentes
- **Lazy Loading:** React.lazy() para páginas grandes
- **Debounce:** En búsquedas y filtros

```jsx
// Ejemplo de búsqueda con debounce
import { useDebouncedCallback } from 'use-debounce';

const buscarContratos = useDebouncedCallback((termino) => {
  router.get(route('contratos.index'), { busqueda: termino }, {
    preserveState: true,
    preserveScroll: true,
  });
}, 500);
```

---

## Comandos Útiles

### Desarrollo
```bash
# Backend
php artisan serve
php artisan queue:work
php artisan migrate:fresh --seed

# Frontend
npm run dev
npm run build

# Testing
php artisan test
php artisan test --filter=ContractTest
```

### Producción
```bash
# Optimización
php artisan config:cache
php artisan route:cache
php artisan view:cache
npm run build

# Queue con Supervisor
php artisan queue:work --sleep=3 --tries=3 --daemon
```

---

## Estructura de Commits

```
feat: Agregar módulo de contratos funerarios
fix: Corregir cálculo de comisiones nocturnas
refactor: Mejorar estructura de formulario de contratos
docs: Actualizar documentación de API
test: Agregar tests para PayrollService
style: Ajustar espaciado en tabla de inventario
```

---

## Notas Finales

- **Todo en español:** Textos, comentarios en código de negocio, commits en español
- **Código en inglés:** Nombres de variables, funciones, clases (estándar de la industria)
- **UI limpia:** Fondo blanco, diseño minimalista, profesional
- **Mobile responsive:** Todas las vistas deben funcionar en móvil
- **Accesibilidad:** Usar etiquetas semánticas, aria-labels cuando sea necesario
- **Documentación inline:** Comentar lógica de negocio compleja

---

## Guía Rápida: Crear un Nuevo Feature

### Paso 1: Crear la Estructura de Carpetas

```bash
mkdir -p resources/js/features/[nombre-feature]/{components,sections,modals}
touch resources/js/features/[nombre-feature]/{types.ts,schemas.ts,constants.ts,functions.ts}
```

### Paso 2: Definir Tipos (types.ts)

```typescript
// En orden topológico: básico → complejo
export enum MiEnum { ... }
export type TipoBasico = string;
export interface InterfazBasica { ... }
export interface InterfazCompleja { ... }
export type TipoDerivado = Omit<InterfazCompleja, 'campo'>;
export interface PropsComponente { ... }
```

### Paso 3: Crear Schemas (schemas.ts)

```typescript
import { z } from 'zod';
import { MiEnum } from './types';

export const miSchema = z.object({ ... });
export type MiFormInput = z.infer<typeof miSchema>;
```

### Paso 4: Definir Constantes (constants.ts)

```typescript
export const MI_CONSTANTE = 'valor' as const;
export const OPCIONES = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
] as const;
```

### Paso 5: Crear Funciones (functions.ts)

```typescript
import { MiTipo } from './types';
import { MI_CONSTANTE } from './constants';

export function funcionBasica() { ... }
export function funcionCompleja(param: MiTipo) { ... }
```

### Paso 6: Crear Componentes

```tsx
// features/[nombre-feature]/components/MiComponente.tsx
import { MiTipo, MiProps } from '../types';
import { MI_CONSTANTE } from '../constants';
import { miFuncion } from '../functions';

export function MiComponente({ prop }: MiProps) {
  // Implementación
}
```

### Paso 7: Crear Página Inertia

```tsx
// pages/[NombreFeature]/Index.tsx
import { Head } from '@inertiajs/react';
import { MiTipo } from '@/features/[nombre-feature]/types';
import { MiComponente } from '@/features/[nombre-feature]/components/MiComponente';

export default function Index({ datos }: { datos: MiTipo[] }) {
  return (
    <>
      <Head title="Mi Feature" />
      <MiComponente datos={datos} />
    </>
  );
}
```

---

## Checklist Pre-Commit

Antes de hacer commit, verificar:

### Frontend
- [ ] ¿Todo el código TypeScript está en la carpeta `features/[nombre-feature]`?
- [ ] ¿Todos los tipos están en `types.ts`?
- [ ] ¿Todos los schemas están en `schemas.ts`?
- [ ] ¿Todas las constantes están en `constants.ts`?
- [ ] ¿Todas las funciones están en `functions.ts`?
- [ ] ¿No hay archivos `index.ts` con re-exportaciones?
- [ ] ¿Las importaciones son directas (no re-exports)?
- [ ] ¿Se usan utility types donde corresponde?
- [ ] ¿Todo el texto visible está en español?
- [ ] ¿Los componentes usan la paleta de colores correcta (bg-white)?
- [ ] ¿Los componentes son responsive?

### Backend
- [ ] ¿Los Form Requests tienen validación y mensajes en español?
- [ ] ¿Los servicios tienen la lógica de negocio separada de los controladores?
- [ ] ¿Se usa Eager Loading para evitar N+1 queries?
- [ ] ¿Los métodos tienen nombres descriptivos en español?

### General
- [ ] ¿El commit message está en español?
- [ ] ¿No hay console.log() olvidados?
- [ ] ¿No hay código comentado innecesario?

---

## Errores Comunes a Evitar

### ❌ ERROR 1: Re-exportaciones
```typescript
// ❌ NO HACER
// features/contratos/index.ts
export * from './types';
export * from './schemas';
```

**Solución:** Eliminar el archivo `index.ts` e importar directamente.

### ❌ ERROR 2: Tipos Duplicados
```typescript
// ❌ NO HACER
// En types.ts
export interface Contrato { ... }

// En schemas.ts
export type Contrato = z.infer<typeof contratoSchema>; // ¡Duplicado!
```

**Solución:** Solo definir tipos en `types.ts`. En `schemas.ts` solo inferir tipos específicos de formularios.

### ❌ ERROR 3: Constantes en Componentes
```tsx
// ❌ NO HACER
export function MiComponente() {
  const OPCIONES = ['a', 'b', 'c']; // ¡Debe estar en constants.ts!
}
```

**Solución:** Mover todas las constantes a `constants.ts`.

### ❌ ERROR 4: Funciones en Componentes
```tsx
// ❌ NO HACER
export function MiComponente() {
  const calcularTotal = (items) => { ... }; // ¡Debe estar en functions.ts!
}
```

**Solución:** Solo dejar funciones específicas del componente (handlers de eventos). Lógica reutilizable va en `functions.ts`.

### ❌ ERROR 5: Texto en Inglés
```tsx
// ❌ NO HACER
<Button>Save</Button>

// ✅ CORRECTO
<Button>Guardar</Button>
```

### ❌ ERROR 6: No Usar Utility Types
```typescript
// ❌ NO HACER
export interface ContratoFormData {
  tipo: TipoContrato;
  cliente: Cliente;
  // ... duplicando toda la interfaz manualmente
}

// ✅ CORRECTO
export type ContratoFormData = Omit<Contrato, 'id' | 'created_at' | 'updated_at'>;
```

---

## Recursos de Referencia

### Documentación Oficial
- [Laravel 11](https://laravel.com/docs/11.x)
- [Inertia.js](https://inertiajs.com/)
- [React 18](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

### TypeScript Utility Types
- `Partial<T>` - Hace todos los campos opcionales
- `Required<T>` - Hace todos los campos obligatorios
- `Readonly<T>` - Hace todos los campos de solo lectura
- `Pick<T, K>` - Selecciona solo ciertos campos
- `Omit<T, K>` - Excluye ciertos campos
- `Record<K, T>` - Objeto con claves K y valores T
- `Exclude<T, U>` - Excluye tipos de una unión
- `Extract<T, U>` - Extrae tipos de una unión
- `NonNullable<T>` - Excluye null y undefined
- `ReturnType<T>` - Obtiene el tipo de retorno de una función

---

## Estructura de Carpetas Completa de Referencia

```
funeral-erp/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── ContractController.php
│   │   │   ├── InventoryController.php
│   │   │   └── ...
│   │   ├── Middleware/
│   │   │   └── CheckPermission.php
│   │   └── Requests/
│   │       ├── StoreContractRequest.php
│   │       └── ...
│   ├── Models/
│   │   ├── User.php
│   │   ├── Contract.php
│   │   ├── Client.php
│   │   └── ...
│   ├── Services/
│   │   ├── ContractService.php
│   │   ├── PayrollService.php
│   │   └── ...
│   ├── Jobs/
│   │   └── SendWhatsAppMessageJob.php
│   └── Enums/
│       ├── UserRole.php
│       ├── ContractType.php
│       └── ...
├── resources/
│   ├── js/
│   │   ├── components/              # Componentes globales
│   │   │   ├── ui/                  # shadcn/ui
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── form.tsx
│   │   │   │   └── ...
│   │   │   └── layouts/
│   │   │       ├── MainLayout.tsx
│   │   │       ├── TopBar.tsx
│   │   │       └── SidebarNav.tsx
│   │   ├── features/                # FEATURES (feature-based)
│   │   │   ├── contratos/
│   │   │   │   ├── components/
│   │   │   │   │   ├── FormularioContrato.tsx
│   │   │   │   │   ├── TablaContratos.tsx
│   │   │   │   │   └── ContratoCard.tsx
│   │   │   │   ├── sections/
│   │   │   │   │   ├── ContratoHeader.tsx
│   │   │   │   │   └── ResumenFinanciero.tsx
│   │   │   │   ├── modals/
│   │   │   │   │   └── ConfirmarEliminacionModal.tsx
│   │   │   │   ├── types.ts
│   │   │   │   ├── schemas.ts
│   │   │   │   ├── constants.ts
│   │   │   │   └── functions.ts
│   │   │   ├── inventario/
│   │   │   │   ├── components/
│   │   │   │   ├── sections/
│   │   │   │   ├── modals/
│   │   │   │   ├── types.ts
│   │   │   │   ├── schemas.ts
│   │   │   │   ├── constants.ts
│   │   │   │   └── functions.ts
│   │   │   ├── pagos/
│   │   │   ├── personal/
│   │   │   ├── liquidaciones/
│   │   │   ├── reportes/
│   │   │   └── dashboard/
│   │   ├── pages/                   # Páginas Inertia
│   │   │   ├── Contratos/
│   │   │   │   ├── Index.tsx
│   │   │   │   ├── Crear.tsx
│   │   │   │   ├── Editar.tsx
│   │   │   │   └── Ver.tsx
│   │   │   ├── Inventario/
│   │   │   ├── Dashboard/
│   │   │   └── ...
│   │   ├── hooks/                   # Hooks globales
│   │   │   ├── usePermisos.ts
│   │   │   └── useAuth.ts
│   │   ├── lib/                     # Utilidades globales
│   │   │   ├── utils.ts
│   │   │   └── cn.ts
│   │   └── types/                   # Tipos globales
│   │       ├── inertia.d.ts
│   │       └── global.d.ts
│   └── css/
│       └── app.css
├── routes/
│   ├── web.php
│   └── api.php
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── factories/
└── tests/
    ├── Feature/
    └── Unit/
```

---

**Versión:** 2.0
**Última actualización:** Octubre 2025
**Proyecto:** Funeral ERP - Sistema de Gestión Funeraria
