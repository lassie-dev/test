# Funeral ERP - Guía de Configuración Inicial

## Estado Actual del Proyecto

✅ **COMPLETADO:**
- Laravel 11 instalado
- Laravel Breeze con Inertia.js y React + TypeScript configurado
- TailwindCSS con paleta de colores personalizada para el proyecto funerario
- Estructura de carpetas feature-based creada
- Dependencias instaladas:
  - react-hook-form + @hookform/resolvers
  - zod (validación)
  - date-fns (manejo de fechas)
  - zustand (estado global)
  - lucide-react (iconos)
- Feature de ejemplo "contratos" creado con:
  - `types.ts` - Definiciones de tipos TypeScript
  - `schemas.ts` - Schemas de validación Zod
  - `constants.ts` - Constantes del módulo
  - `functions.ts` - Funciones utilitarias

## Próximos Pasos

### 1. Configurar Base de Datos

#### Opción A: MySQL (Recomendado para Producción)

1. Crear base de datos MySQL:
```bash
mysql -u root -p
CREATE DATABASE funeral_erp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'funeral_user'@'localhost' IDENTIFIED BY 'tu_password_seguro';
GRANT ALL PRIVILEGES ON funeral_erp.* TO 'funeral_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

2. Actualizar `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=funeral_erp
DB_USERNAME=funeral_user
DB_PASSWORD=tu_password_seguro
```

#### Opción B: SQLite (Para Desarrollo Rápido)

La base de datos SQLite ya está configurada por defecto. Solo ejecuta:
```bash
php artisan migrate
```

### 2. Instalar shadcn/ui Components

Instalar componentes básicos necesarios:

```bash
# Nota: shadcn/ui para React requiere instalación manual
# Los archivos se deben copiar a resources/js/components/ui/

# Componentes esenciales a crear:
# - Button
# - Input
# - Form
# - Select
# - Table
# - Card
# - Dialog/Modal
# - Badge
# - Alert
```

### 3. Crear Migraciones de Base de Datos

Crear las migraciones para las tablas principales:

```bash
# Clientes
php artisan make:migration create_clients_table

# Difuntos
php artisan make:migration create_deceased_table

# Servicios
php artisan make:migration create_services_table

# Productos
php artisan make:migration create_products_table

# Contratos
php artisan make:migration create_contracts_table

# Tablas pivote
php artisan make:migration create_contract_services_table
php artisan make:migration create_contract_products_table

# Personal
php artisan make:migration create_employees_table

# Inventario
php artisan make:migration create_inventory_table

# Pagos
php artisan make:migration create_payments_table
```

### 4. Crear Modelos Eloquent

```bash
php artisan make:model Client
php artisan make:model Deceased
php artisan make:model Service
php artisan make:model Product
php artisan make:model Contract
php artisan make:model Employee
php artisan make:model InventoryItem
php artisan make:model Payment
```

### 5. Crear Enums

```bash
php artisan make:enum UserRole
php artisan make:enum ContractType
php artisan make:enum ContractStatus
php artisan make:enum PaymentStatus
```

### 6. Crear Servicios

```bash
php artisan make:class Services/ContractService
php artisan make:class Services/PayrollService
php artisan make:class Services/InventoryService
php artisan make:class Services/WhatsAppService
```

### 7. Crear Controladores

```bash
php artisan make:controller ContractController --resource
php artisan make:controller InventoryController --resource
php artisan make:controller PaymentController --resource
php artisan make:controller EmployeeController --resource
php artisan make:controller ReportController
```

### 8. Configurar Redis (Para Colas)

1. Instalar Redis:
```bash
# Ubuntu/Debian
sudo apt-get install redis-server

# Iniciar Redis
sudo systemctl start redis
sudo systemctl enable redis
```

2. Actualizar `.env`:
```env
CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

3. Instalar paquete PHP Redis:
```bash
composer require predis/predis
```

### 9. Levantar Servidor de Desarrollo

En terminales separadas:

```bash
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Vite dev server (hot reload)
npm run dev

# Terminal 3: Queue worker (para trabajos en cola)
php artisan queue:work
```

El proyecto estará disponible en: http://localhost:8000

### 10. Instalar Dependencias Adicionales

```bash
# Para WhatsApp (si usas API oficial)
composer require twilio/sdk

# Para generar PDFs
composer require barryvdh/laravel-dompdf

# Para exportar Excel
composer require maatwebsite/excel
```

## Estructura del Proyecto

```
funeral-erp/
├── app/
│   ├── Http/
│   │   ├── Controllers/       # Controladores Inertia
│   │   ├── Middleware/
│   │   └── Requests/          # Form Requests
│   ├── Models/                # Eloquent Models
│   ├── Services/              # Lógica de negocio
│   ├── Jobs/                  # Trabajos en cola
│   └── Enums/                 # Enumeraciones
├── resources/
│   ├── js/
│   │   ├── components/
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   └── layouts/      # Layouts generales
│   │   ├── features/         # ✨ FEATURE-BASED
│   │   │   ├── contratos/
│   │   │   ├── inventario/
│   │   │   ├── pagos/
│   │   │   ├── personal/
│   │   │   └── ...
│   │   ├── pages/            # Páginas Inertia
│   │   ├── hooks/            # Custom hooks
│   │   └── lib/              # Utilidades
│   └── css/
└── routes/
    ├── web.php
    └── auth.php
```

## Convenciones Importantes

### Frontend (TypeScript/React)

1. **TODO en Español**: Textos visibles para el usuario
2. **Feature-based**: Organizar por funcionalidad
3. **4 Archivos Obligatorios por Feature**:
   - `types.ts` - Tipos TypeScript
   - `schemas.ts` - Validaciones Zod
   - `constants.ts` - Constantes
   - `functions.ts` - Funciones utilitarias
4. **NO usar re-exports**: Importar directamente desde cada archivo
5. **Utility types**: Usar `Omit`, `Pick`, `Partial`

### Backend (Laravel/PHP)

1. **Servicios para lógica de negocio**: No en controladores
2. **Form Requests**: Validación en clases separadas
3. **Eloquent ORM**: Nunca queries SQL directas
4. **Colas para tareas pesadas**: WhatsApp, emails, etc.

## Comandos Útiles

```bash
# Desarrollo
php artisan serve                    # Servidor Laravel
npm run dev                          # Vite dev server
php artisan queue:work               # Trabajador de colas

# Base de datos
php artisan migrate                  # Ejecutar migraciones
php artisan migrate:fresh --seed     # Reiniciar BD con seeders
php artisan db:seed                  # Ejecutar seeders

# Cache
php artisan config:cache             # Cachear configuración
php artisan route:cache              # Cachear rutas
php artisan view:cache               # Cachear vistas
php artisan cache:clear              # Limpiar cache

# Testing
php artisan test                     # Ejecutar tests
php artisan test --filter=NombreTest # Test específico

# Build para producción
npm run build                        # Compilar assets
php artisan optimize                 # Optimizar aplicación
```

## Recursos

- [Documentación Laravel](https://laravel.com/docs/11.x)
- [Documentación Inertia.js](https://inertiajs.com/)
- [Documentación React](https://react.dev/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)

## Solución de Problemas

### Error: "npm install failed"
```bash
npm install --legacy-peer-deps
```

### Error: "SQLSTATE[HY000] [2002] Connection refused"
- Verificar que MySQL/MariaDB esté corriendo
- Verificar credenciales en `.env`

### Error: Vite no se conecta
```bash
# Limpiar cache y reconstruir
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

### Error: "Class not found"
```bash
composer dump-autoload
php artisan optimize:clear
```

## Siguientes Desarrollos Sugeridos

1. **Sistema de Autenticación**:
   - Añadir roles y permisos
   - Middleware de autorización
   - Hook `usePermisos()`

2. **Módulo de Contratos**:
   - CRUD completo
   - Generación de PDF
   - Cálculo automático de totales

3. **Módulo de Inventario**:
   - Control de stock
   - Alertas de stock bajo
   - Historial de movimientos

4. **Módulo de Pagos**:
   - Registro de pagos
   - Cuotas y créditos
   - Reportes de cobranza

5. **WhatsApp Automatizado**:
   - Mensajes programados
   - Templates de mensajes
   - Job queue para envíos

---

**¡Tu proyecto Funeral ERP está listo para comenzar el desarrollo!** 🚀

Consulta `claude.md` para detalles completos de la arquitectura y convenciones.
