# Funeral ERP - Funeral Management System Project

## 📋 Business Description (For Claude - Easy to Understand)

### What is this system?
This is an **ERP (Enterprise Resource Planning System) for a Chilean funeral home**. A funeral home is a business that handles all services related to a person's passing: from body transportation, preparation, wake, to cremation or burial.

### How does the funeral business work?

#### 1. **Types of Clients and Contracts**

There are **2 types of contracts**:

**A) Immediate Need (Active Service)**
- Client calls because a family member has just passed away
- They need the service NOW (urgent)
- The contract includes:
  - **Deceased** data (person who passed away): name, date of death, place
  - **Client** data (family member who contracts): name, RUT, phone, email
  - Immediate funeral services (transportation, wake, cremation/burial)
  - Necessary products (casket, urn, flowers, etc.)

**B) Future Need (Pre-need/Plan)**
- Client contracts funeral services in advance for themselves or a family member
- No death has occurred yet
- It's like "funeral insurance"
- Only has **client** data
- NO deceased data (because no one has passed away yet)
- When the time comes, the contract is updated to "Immediate Need"

#### 2. **Typical Workflow**

**STEP 1: Initial Call**
- A family calls because a loved one has passed away
- The **secretary** answers the call (available 24/7)
- Registers basic data: deceased's name, address, family member's phone

**STEP 2: Contract Creation**
- The secretary creates a contract in the system
- Selects services according to the family's needs:
  - **Basic services**: Body transportation, preparation, wake, cremation/burial
  - **Additional services**: Music, religious ceremony, online streaming
- Selects products:
  - Casket (different qualities: basic, medium, premium)
  - Urn (if cremation)
  - Flowers, wreaths
  - Thank you cards

**STEP 3: Quotation and Discounts**
- The system calculates the **subtotal** (sum of all services and products)
- The secretary can apply **discounts** according to company policies:
  - Allowed discounts: 3%, 5%, 8%, 10%, 15%, 25%, 30%
  - Reasons: returning client, company agreement, financial hardship, etc.
- The **final total** is calculated = subtotal - discount

**STEP 4: Payment Method**
- **Cash**: Immediate payment (cash, card, transfer)
- **Credit**: Payment in installments (the funeral home provides payment facilities)
  - Installments are registered in the Payments module
  - Pending payments are tracked

**STEP 5: Staff Assignment**
- The system automatically assigns the necessary staff:
  - **Driver**: Transports the body from the place of death
  - **Assistants**: Help in transportation and body preparation
  - **Wake staff**: Attends during the ceremony

**STEP 6: Automatic Communication (WhatsApp)**
The system sends automatic messages:
- **Immediate**: To the driver with instructions (address, time, details)
- **4 hours later**: Tips to the family (what to do during grief)
- **5 days later**: Personalized digital condolence cards
- **8 days later**: Service satisfaction survey

**STEP 7: Service Execution**
- The driver goes to pick up the body
- The body is prepared at the funeral home
- The wake (ceremony) is held
- Cremation or burial is done
- Staff marks each stage as completed in the system

**STEP 8: Closure and Liquidation**
- The contract is marked as "Finished"
- Staff **commissions** are automatically calculated
- The secretary earns commission per contract (% of total)

#### 3. **Commission System (Very Important)**

**Secretaries** earn commissions for each contract they create. The percentage varies according to:

**Base Commission: 5%**
- For each contract, the secretary earns 5% of the total

**Night Commission: +2% additional**
- If the service is between 8:00 PM and 8:00 AM
- Total: 7% commission

**Holiday Commission: +3% additional**
- If the service is on a holiday (Christmas, New Year, etc.)
- Total: 8% commission

**Night + Holiday Commission: +5% additional**
- If it's at night AND on a holiday
- Total: 10% commission

**Example:**
- Contract of $1,000,000 CLP
- Service at 10:00 PM (night) on a regular day
- Commission: $1,000,000 × 7% = $70,000 CLP for the secretary

#### 4. **System Modules**

**A) Contracts (Main Module)**
- Create, edit, view contracts
- Manage services and products
- Apply discounts
- Change states: Quotation → Contract → Finished / Canceled

**B) Inventory**
- Product stock control:
  - Caskets (different models)
  - Urns
  - Flowers
  - Cards
- Low stock alerts
- Entry and exit records

**C) Payments**
- Register client payments
- Accounts receivable control
- Installment payments (credit)
- Payment history
- Pending installment reminders

**D) Staff (Personnel)**
- Employee records:
  - Secretaries
  - Drivers
  - Assistants
  - Administrative staff
- Shifts and availability
- Contact information

**E) Payroll (Liquidations)**
- Automatic salary calculation
- Secretary commissions
- Driver and assistant payments
- Payroll generation
- Payment history

**F) Reports**
- Sales by period
- Contracts by type
- Commissions paid
- Best-selling products
- Applied discounts analysis
- Profitability

**G) Dashboard**
- Daily/monthly summary
- Active contracts
- Pending payments
- Critical stock
- Important alerts

#### 5. **User Roles**

**Owner**
- Full system access
- Views all financial reports
- Manages users and permissions

**Administrator**
- Manages contracts, inventory, personnel
- Views reports
- Cannot delete critical data

**Secretary**
- Creates and edits contracts
- Registers payments
- Views their own commissions
- Does NOT view general financial reports

**Driver**
- Views assigned services
- Updates service status
- Does NOT view prices or commissions

**Assistant**
- Only views services they participate in
- Cannot modify data

#### 6. **Special Characteristics of Chilean Business**

**RUT Validation**
- RUT is the unique identifier for people in Chile (like DNI or SSN)
- Format: 12.345.678-9
- The system validates that it's mathematically correct

**Currency: Chilean Pesos (CLP)**
- Format: $1.000.000 (with dots as thousand separators)
- No decimals (cents not used)

**24/7 Schedule**
- Funeral homes work 24 hours, 7 days a week
- Deaths can occur at any time
- That's why there are special night commissions

**Cultural Sensitivity**
- It's a delicate business (dealing with grieving families)
- Interface should be sober, professional
- Colors: dark blue, gray, white tones (nothing flashy)
- Respectful and empathetic texts

#### 7. **Typical Data Flow**

```
1. Client calls → 2. Secretary creates contract → 3. Selects services/products
→ 4. Applies discount (if applicable) → 5. Defines payment method
→ 6. System assigns staff → 7. Sends automatic WhatsApp to driver
→ 8. Service is executed → 9. Contract is marked as finished
→ 10. System calculates commissions → 11. Generates payroll
→ 12. Sends satisfaction survey to family
```

#### 8. **Key Concepts for Development**

**Contract Status:**
- **Quotation**: Just a budget, not yet confirmed
- **Contract**: Already confirmed, active service
- **Finished**: Service completed successfully
- **Canceled**: Canceled before execution

**Deceased vs Client:**
- **Deceased**: The person who passed away (only in Immediate Need)
- **Client**: The person who contracts and pays (always exists)

**Services vs Products:**
- **Services**: Actions performed (transportation, wake, cremation) - NOT deducted from inventory
- **Products**: Physical items (casket, urn, flowers) - YES deducted from inventory

**Subtotal, Discount, Total:**
- **Subtotal**: Sum of all services and products
- **Discount**: Percentage applied to subtotal
- **Total**: Subtotal - Discount = What the client pays

#### 9. **Important Business Rules**

1. **A Future Need contract CANNOT have deceased** (no one has passed away yet)
2. **An Immediate Need contract MUST have deceased** (someone has already passed away)
3. **Discounts can only be**: 0%, 3%, 5%, 8%, 10%, 15%, 25%, 30% (fixed values)
4. **Commissions are calculated on the FINAL total** (after discount)
5. **Products are deducted from inventory when creating the contract**
6. **Services DO NOT affect inventory** (they are actions, not products)
7. **A finished contract cannot be deleted**, only canceled
8. **The secretary who created the contract receives the commission**

#### 10. **Practical Examples**

**Example 1: Immediate Need Contract**
```
Client: María González (RUT 15.234.567-8, Tel: +56987654321)
Deceased: Pedro González (passed away on 10/20/2025)
Type: Immediate Need
Services:
  - Transportation: $50,000
  - 24hr Wake: $200,000
  - Cremation: $300,000
Products:
  - Basic casket: $150,000
  - Urn: $80,000
Subtotal: $780,000
Discount: 10% (-$78,000)
Total: $702,000
Payment Method: Credit (6 installments of $117,000)
Time: 3:00 PM (regular day)
Secretary commission: 5% of $702,000 = $35,100
```

**Example 2: Night + Holiday Contract**
```
Client: Juan Pérez
Deceased: Rosa Pérez
Total: $1,500,000
Time: 11:00 PM on December 25 (Christmas)
Commission: 5% base + 2% night + 3% holiday = 10%
Total commission: $150,000
```

---

## Technology Stack

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

## Project Conventions

### 1. Language and Localization (i18n)

**CRITICAL: The application supports Spanish (default) and English through react-i18next.**

#### i18n System Overview

The application uses **react-i18next** for internationalization:
- **Default language:** Spanish (es)
- **Available languages:** Spanish (es), English (en)
- **User preference:** Saved in localStorage
- **Language switcher:** Available in the top navigation bar

#### Translation Files

All translations are stored in JSON files:
- **Spanish:** `/resources/js/locales/es.json` (default, always complete)
- **English:** `/resources/js/locales/en.json` (must match Spanish keys)

#### How to Use Translations in Components

**MANDATORY: ALL user-facing text MUST use the translation system.**

```tsx
// ✅ CORRECT: Using i18n
import { useTranslation } from 'react-i18next';

export default function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <Button>{t('common.save')}</Button>
      <Label>{t('contracts.clientName')}</Label>
      <p>{t('validation.required')}</p>
    </div>
  );
}

// ❌ INCORRECT: Hardcoded text (DO NOT DO THIS)
export default function MyComponent() {
  return (
    <div>
      <Button>Guardar</Button>
      <Label>Nombre del Cliente</Label>
      <p>El campo es requerido</p>
    </div>
  );
}
```

#### Translation Key Naming Convention

Translation keys follow a **namespace.key** pattern:

```typescript
// Structure: namespace.descriptiveKey

// ✅ CORRECT Examples:
t('common.save')                    // "Guardar" / "Save"
t('contracts.create')               // "Crear Contrato" / "Create Contract"
t('contracts.clientName')           // "Nombre del Cliente" / "Client Name"
t('validation.required')            // "El campo es requerido" / "Field is required"
t('validation.minLength', { min: 3 }) // "Debe tener al menos 3 caracteres" / "Must be at least 3 characters"

// ❌ INCORRECT Examples:
t('save')                           // Too generic, no namespace
t('contracts.nombre_cliente')       // Use camelCase, not snake_case
t('CONTRACTS.CREATE')               // Use camelCase, not SCREAMING_CASE
```

#### Available Namespaces

- **common:** General-purpose translations (save, cancel, delete, edit, loading, etc.)
- **nav:** Navigation menu items
- **contracts:** Contract-related translations
- **inventory:** Inventory-related translations
- **payments:** Payment-related translations
- **staff:** Staff-related translations
- **validation:** Form validation messages

#### Adding New Translations

**IMPORTANT: Always add to BOTH language files simultaneously.**

1. **Add to es.json:**
```json
{
  "myFeature": {
    "title": "Mi Función",
    "description": "Descripción de mi función",
    "saveButton": "Guardar Cambios"
  }
}
```

2. **Add to en.json (same structure):**
```json
{
  "myFeature": {
    "title": "My Feature",
    "description": "Description of my feature",
    "saveButton": "Save Changes"
  }
}
```

3. **Use in component:**
```tsx
const { t } = useTranslation();

<h1>{t('myFeature.title')}</h1>
<p>{t('myFeature.description')}</p>
<Button>{t('myFeature.saveButton')}</Button>
```

#### Dynamic Select Options

For dropdown options, use `labelKey` instead of hardcoded labels:

```typescript
// ✅ CORRECT: constants.ts
export const MY_OPTIONS = [
  { value: 'option1', labelKey: 'myFeature.option1' },
  { value: 'option2', labelKey: 'myFeature.option2' },
] as const;

// Component usage:
{MY_OPTIONS.map((option) => (
  <SelectItem key={option.value} value={option.value}>
    {t(option.labelKey)}
  </SelectItem>
))}

// ❌ INCORRECT: Hardcoded labels
export const MY_OPTIONS = [
  { value: 'option1', label: 'Opción 1' },  // Won't translate
  { value: 'option2', label: 'Opción 2' },  // Won't translate
] as const;
```

#### Translation Variables (Interpolation)

Use `{{variable}}` syntax for dynamic values:

```json
{
  "validation": {
    "minLength": "Debe tener al menos {{min}} caracteres",
    "maxLength": "No puede exceder {{max}} caracteres",
    "between": "Debe estar entre {{min}} y {{max}}"
  }
}
```

```tsx
// Usage:
t('validation.minLength', { min: 3 })
t('validation.between', { min: 1, max: 100 })
```

#### Backend Translations

- Backend: `lang/es/*.php` (Laravel translation files)
- Database: Comments in Spanish, table names in English

#### Important Rules

1. **NEVER hardcode user-facing text** - Always use `t('namespace.key')`
2. **ALWAYS add to both es.json and en.json** - Keep files in sync
3. **Use camelCase for keys** - e.g., `clientName`, not `client_name`
4. **Use namespaces** - Group related translations logically
5. **Default language is Spanish** - Spanish must always be complete
6. **Test both languages** - Use the language switcher to verify translations

### 2. Project Structure

```
funeral-erp/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   ├── Middleware/
│   │   └── Requests/
│   ├── Models/
│   ├── Services/
│   │   ├── ContractService.php
│   │   ├── PayrollService.php
│   │   ├── InventoryService.php
│   │   └── WhatsAppService.php
│   ├── Jobs/
│   │   ├── SendWhatsAppMessage.php
│   │   └── UpdateInventoryJob.php
│   └── Enums/
│       ├── ContractType.php
│       ├── UserRole.php
│       └── PaymentStatus.php
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── factories/
├── resources/
│   ├── js/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   └── layouts/
│   │   ├── features/
│   │   │   ├── contracts/
│   │   │   │   ├── components/
│   │   │   │   ├── sections/
│   │   │   │   ├── modals/
│   │   │   │   ├── types.ts
│   │   │   │   ├── schemas.ts
│   │   │   │   ├── constants.ts
│   │   │   │   └── functions.ts
│   │   │   ├── inventory/
│   │   │   ├── payments/
│   │   │   ├── staff/
│   │   │   ├── payroll/
│   │   │   ├── reports/
│   │   │   └── dashboard/
│   │   ├── pages/
│   │   │   ├── Contracts/
│   │   │   ├── Inventory/
│   │   │   ├── Payments/
│   │   │   ├── Staff/
│   │   │   ├── Payroll/
│   │   │   ├── Reports/
│   │   │   └── Dashboard/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── types/
│   └── css/
│       └── app.css
├── routes/
│   ├── web.php
│   └── api.php
├── tests/
│   ├── Feature/
│   └── Unit/
└── storage/
    └── app/
        ├── documents/
        ├── photos/
        └── backups/
```

### 3. Naming Conventions

**IMPORTANT: Folder and File Names**

- **Git commits:** MUST be in English (e.g., "feat: Add contract management module")
- **Folder names (features, pages):** MUST be in English (e.g., `contracts`, `inventory`, not `contratos`, `inventario`)
- **File names:** MUST be in English when referring to technical concepts (e.g., `ContractController.php`, not `ContratoController.php`)
- **User-facing text:** MUST be in Spanish (labels, buttons, messages, etc.)
- **Code comments for business logic:** Can be in Spanish for clarity
- **Technical variable/function names:** English (following industry standards)

**Folder Naming Examples:**
```
✅ CORRECT:
features/contracts/
features/inventory/
features/payments/
pages/Contracts/
pages/Inventory/

❌ INCORRECT:
features/contratos/
features/inventario/
features/pagos/
pages/Contratos/
pages/Inventario/
```

#### Backend (Laravel)
```php
// Models: Singular, PascalCase
class Contract extends Model {}
class Employee extends Model {}

// Tables: Plural, snake_case
Schema::create('contracts', function() {});
Schema::create('inventory_items', function() {});

// Controllers: Singular + Controller
class ContractController extends Controller {}

// Services: Singular + Service
class ContractService {}

// Jobs: Verb + Noun + Job
class SendWhatsAppMessageJob {}

// Methods: camelCase, descriptive verbs in Spanish
public function crearContrato() {}
public function actualizarInventario() {}
public function calcularComisiones() {}
```

#### Frontend (React/TypeScript)
```typescript
// Components: PascalCase
const FormularioContrato = () => {}
const TablaInventario = () => {}

// Component files: PascalCase.tsx
FormularioContrato.tsx
TablaInventario.tsx

// Inertia Pages: PascalCase.tsx
pages/Contratos/Crear.tsx
pages/Contratos/Editar.tsx
pages/Contratos/Index.tsx

// Custom hooks: camelCase with 'use' prefix
const useContrato = () => {}
const usePermisos = () => {}

// Utilities: camelCase
const formatearMoneda = () => {}
const calcularDescuento = () => {}

// Constants: SCREAMING_SNAKE_CASE
const PORCENTAJES_DESCUENTO = [3, 5, 8, 10, 15, 25, 30];

// TypeScript types: PascalCase
type Contrato = { ... }
interface Cliente { ... }

// Type files: lowercase with .ts extension
types.ts
schemas.ts
constants.ts
functions.ts
```

### 3.1. Feature-Based Architecture (MANDATORY)

**CRITICAL: All frontend code MUST be organized by functionality within `resources/js/features/[feature-name]`**

#### Feature Structure

Each feature MUST contain exactly this structure:

```
features/
└── [feature-name]/
    ├── components/
    ├── sections/
    ├── modals/
    ├── types.ts
    ├── schemas.ts
    ├── constants.ts
    └── functions.ts
```

#### File Organization Rules

##### **1. types.ts - Type Definitions**

**MUST contain:**
- All interfaces
- All TypeScript types
- All TypeScript enums
- Component prop types
- State types
- API response types

**Topological order:** From most basic to most complex

```typescript
// ✅ CORRECT: features/contracts/types.ts

// 1. Basic enums (no dependencies)
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

// 2. Basic types (no complex dependencies)
export type Rut = string;
export type Telefono = string;

// 3. Basic interfaces
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

// 4. Interfaces that depend on basic types
export interface ContratoServicio {
  servicio: Servicio;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

// 5. Complex interfaces (depend on others)
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

// 6. Derived types using utility types
export type ContratoFormData = Omit<Contrato, 'id' | 'numero_contrato' | 'created_at' | 'updated_at'>;
export type ContratoPartial = Partial<Contrato>;
export type ContratoPicker = Pick<Contrato, 'id' | 'numero_contrato' | 'cliente' | 'total'>;

// 7. Component props
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

##### **2. schemas.ts - Zod Schemas**

**MUST contain:**
- All Zod validation schemas
- Types inferred from schemas
- NEVER duplicate types that are in types.ts

```typescript
// ✅ CORRECT: features/contracts/schemas.ts
import { z } from 'zod';
import { TipoContrato } from './types';

// Basic schemas
export const rutSchema = z
  .string()
  .regex(/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/, 'Formato de RUT inválido');

export const telefonoSchema = z
  .string()
  .min(8, 'Teléfono debe tener al menos 8 dígitos');

// Client schema
export const clienteSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  rut: rutSchema,
  telefono: telefonoSchema,
  email: z.string().email('Email inválido').optional(),
});

// Deceased schema
export const difuntoSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  fecha_fallecimiento: z.date(),
  lugar_fallecimiento: z.string().optional(),
});

// Service in contract schema
export const contratoServicioSchema = z.object({
  servicio_id: z.number(),
  cantidad: z.number().min(1, 'La cantidad debe ser al menos 1'),
  precio_unitario: z.number().positive('El precio debe ser positivo'),
});

// Main contract schema
export const contratoFormSchema = z.object({
  tipo: z.nativeEnum(TipoContrato),
  cliente: clienteSchema,
  difunto: difuntoSchema.optional(),
  servicios: z.array(contratoServicioSchema).min(1, 'Debe seleccionar al menos un servicio'),
  descuento: z.enum(['0', '3', '5', '8', '10', '15', '25', '30']).default('0'),
  forma_pago: z.enum(['contado', 'credito']),
});

// Types inferred from schemas (ONLY when necessary)
export type ContratoFormInput = z.infer<typeof contratoFormSchema>;
export type ClienteInput = z.infer<typeof clienteSchema>;
export type DifuntoInput = z.infer<typeof difuntoSchema>;
```

##### **3. constants.ts - Constants**

**MUST contain:**
- All module constants
- Option arrays
- Default values
- Static configurations

```typescript
// ✅ CORRECT: features/contracts/constants.ts

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

##### **4. functions.ts - Utility Functions**

**MUST contain:**
- All module utility functions
- Functions that use types, schemas or constants
- Frontend business logic
- Data transformations

**Topological order:** From basic to complex functions

```typescript
// ✅ CORRECT: features/contracts/functions.ts
import { Contrato, ContratoServicio } from './types';
import { PORCENTAJES_DESCUENTO, COMISION_BASE_PORCENTAJE } from './constants';

// 1. Basic functions (no dependencies)
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

// 2. Calculation functions (use constants)
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

// 3. Complex functions (use types and other functions)
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

// 4. Transformation functions
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

export function formatearMoneda(valor: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(valor);
}
```

#### Critical Separation Rules

##### ❌ FORBIDDEN: Re-exports

```typescript
// ❌ INCORRECT: features/contracts/index.ts
export * from './types';
export * from './schemas';
export * from './constants';
export * from './functions';

// ❌ INCORRECT: features/contracts/components/index.ts
export { FormularioContrato } from './FormularioContrato';
export { TablaContratos } from './TablaContratos';
```

##### ✅ CORRECT: Direct Imports

```typescript
// ✅ CORRECT: pages/Contracts/Crear.tsx
import { Contrato, ContratoFormData } from '@/features/contracts/types';
import { contratoFormSchema } from '@/features/contracts/schemas';
import { PORCENTAJES_DESCUENTO } from '@/features/contracts/constants';
import { calcularTotalesContrato } from '@/features/contracts/functions';
import { FormularioContrato } from '@/features/contracts/components/FormularioContrato';
```

#### Using Utility Types

**MANDATORY:** Use TypeScript utility types to simplify code

```typescript
// ✅ CORRECT: Use utility types
export type ContratoFormData = Omit<Contrato, 'id' | 'numero_contrato' | 'created_at' | 'updated_at'>;
export type ContratoPartial = Partial<Contrato>;
export type ContratoPicker = Pick<Contrato, 'id' | 'numero_contrato' | 'total'>;
export type ContratoReadonly = Readonly<Contrato>;

// To make specific fields optional
export type ContratoConDifuntoOpcional = Omit<Contrato, 'difunto'> & {
  difunto?: Difunto;
};

// ❌ INCORRECT: Duplicate entire interface
export interface ContratoFormData {
  tipo: TipoContrato;
  estado: EstadoContrato;
  cliente: Cliente;
  // ... duplicating everything manually
}
```

#### Complete Feature Example

```
features/contracts/
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
├── types.ts
├── schemas.ts
├── constants.ts
└── functions.ts
```

#### Validation Checklist

Before creating or modifying a feature, verify:

- [ ] Are all types in `types.ts`?
- [ ] Are all Zod schemas in `schemas.ts`?
- [ ] Are all constants in `constants.ts`?
- [ ] Are all functions in `functions.ts`?
- [ ] Are there no re-exports in any file?
- [ ] Are files organized in topological order?
- [ ] Are utility types (Omit, Pick, Partial) used where possible?
- [ ] Is there no type duplication between files?
- [ ] Does each file have a clear responsibility?

---

## Useful Commands

### Development
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

### Production
```bash
# Optimization
php artisan config:cache
php artisan route:cache
php artisan view:cache
npm run build

# Queue with Supervisor
php artisan queue:work --sleep=3 --tries=3 --daemon
```

---

## Commit Structure

**IMPORTANT: All commit messages MUST be in English**

```
feat: Add funeral contract management module
fix: Correct nocturnal commission calculation
refactor: Improve contract form structure
docs: Update API documentation
test: Add tests for PayrollService
style: Adjust spacing in inventory table
```

---

## Final Notes

- **i18n System (MANDATORY):** ALL user-facing text must use `t('namespace.key')` - never hardcode text
- **Bilingual Support:** Application supports Spanish (default) and English via language switcher
- **Translation Files:** Always add to both `es.json` and `en.json` simultaneously
- **Default Language:** Spanish - must always be complete and accurate
- **Code in English:** Variable names, function names, class names, folder names (industry standard)
- **Git commits in English:** All commit messages must be in English
- **Folder structure in English:** features/, pages/ subdirectories must use English names
- **Translation Keys:** Use camelCase with namespace prefix (e.g., `contracts.clientName`)
- **Select Options:** Use `labelKey` instead of `label` for dropdown options
- **Clean UI:** White background, minimalist design, professional
- **Mobile responsive:** All views must work on mobile
- **Accessibility:** Use semantic tags, aria-labels when necessary
- **Inline documentation:** Comment complex business logic

---

**Version:** 2.1
**Last updated:** October 2025
**Project:** Funeral ERP - Funeral Management System
