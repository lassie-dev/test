# Navigation Menu System Guide

This guide explains the enhanced navigation menu system with all its features.

## Features Implemented

### 1. Mobile Functionality ✓
- Fully functional hamburger menu on mobile devices
- Overlay backdrop when menu is open
- Auto-close on route change
- Close with ESC key or X button

### 2. Collapsible Sections ✓
- Click section titles to expand/collapse menu groups
- Chevron icons indicate expansion state
- Smooth transitions

### 3. Nested Navigation ✓
- Support for unlimited sub-menu levels
- Example: Contratos → Nuevo Contrato, Lista, Archivados
- Visual hierarchy with indentation and border

### 4. Role-Based Permissions ✓
- Menu items can be restricted by permissions
- Sections can also have permissions
- Automatic filtering based on user permissions
- Fallback to show all items if no permission system is active

### 5. Badge/Count Support ✓
- Display notification counts on menu items
- Example: "Pagos (12)" shows 12 pending payments
- Red badge styling
- Supports 99+ display for large numbers

### 6. Search Functionality ✓
- Real-time search through all menu items
- Searches both parent and child items
- Auto-filters sections based on search results
- Hidden when sidebar is collapsed

### 7. Breadcrumb Navigation ✓
- Automatic breadcrumb generation based on current route
- Shows full navigation path
- Clickable breadcrumbs for easy navigation
- Icons for visual context

### 8. Collapsible Sidebar ✓
- Toggle between full (256px) and icon-only (64px) modes
- Smooth animations
- Tooltips on icons when collapsed
- Main content area adjusts automatically

### 9. Keyboard Navigation ✓
- ESC key closes mobile menu
- Keyboard shortcuts hint at bottom of sidebar

### 10. Database-Driven Menu ✓
- Completely database-driven with fallback to hardcoded
- Cached for performance (1 hour cache)
- Easy to manage through admin interface
- Supports dynamic badge counts

## Database Schema

### Tables

#### `menu_sections`
- `id`: Primary key
- `title`: Section title (nullable for untitled sections)
- `order`: Display order
- `permissions`: JSON array of required permissions
- `is_active`: Enable/disable sections

#### `menu_items`
- `id`: Primary key
- `menu_section_id`: Foreign key to menu_sections
- `parent_id`: Foreign key to self (for nested items)
- `name`: Display name
- `href`: Route path
- `icon`: Lucide icon name (e.g., 'FileText', 'Package')
- `badge`: Optional notification count
- `order`: Display order within section
- `permissions`: JSON array of required permissions
- `is_active`: Enable/disable items

## Setup Instructions

### 1. Run Migrations

```bash
php artisan migrate
```

### 2. Seed Initial Menu Data

```bash
php artisan db:seed --class=NavigationMenuSeeder
```

### 3. Clear Navigation Cache (when making changes)

```php
app(NavigationService::class)->clearCache();
```

Or use Artisan:
```bash
php artisan cache:forget navigation_menu
```

## Usage Examples

### Adding a New Menu Item (via Database)

```php
use App\Models\MenuItem;
use App\Models\MenuSection;

// Find or create a section
$section = MenuSection::where('title', 'Operaciones')->first();

// Create a new menu item
MenuItem::create([
    'menu_section_id' => $section->id,
    'name' => 'Servicios',
    'href' => '/services',
    'icon' => 'Briefcase',
    'order' => 6,
    'permissions' => ['view_services'],
    'is_active' => true,
]);

// Clear cache
app(NavigationService::class)->clearCache();
```

### Adding a Sub-Menu Item

```php
// Find parent item
$parentItem = MenuItem::where('name', 'Contratos')->first();

// Create child item
MenuItem::create([
    'parent_id' => $parentItem->id,
    'name' => 'Estadísticas',
    'href' => '/contracts/stats',
    'icon' => 'BarChart',
    'order' => 4,
    'is_active' => true,
]);
```

### Updating Badge Counts Dynamically

```php
// In your controller or job
use App\Models\MenuItem;

$paymentsItem = MenuItem::where('href', '/payments')->first();
$pendingCount = Payment::where('status', 'pending')->count();
$paymentsItem->update(['badge' => $pendingCount]);

// Clear cache to see changes
app(NavigationService::class)->clearCache();
```

## Icon Reference

All icons use Lucide React. Common icons:

- `LayoutDashboard` - Dashboard
- `FileText` - Documents/Contracts
- `Package` - Inventory
- `CreditCard` - Payments
- `Users` - Staff/People
- `DollarSign` - Money/Payroll
- `BarChart3` - Reports/Analytics
- `Settings` - Configuration
- `Bell` - Notifications
- `Home` - Home
- `Briefcase` - Business/Services

Full icon list: https://lucide.dev/icons/

## Permissions System

The permission system is ready to integrate with your auth system. To activate:

1. Update `MainLayout.tsx` line 144-148:

```typescript
const hasPermission = (permissions?: string[]) => {
  if (!permissions || permissions.length === 0) return true;
  return permissions.some(p => auth?.user?.permissions?.includes(p));
};
```

2. Ensure your User model includes a `permissions` array in Inertia props.

## Performance Considerations

- Navigation menu is cached for 1 hour
- Cache is automatically shared across all users
- Clear cache after making menu changes
- Consider using Redis for better cache performance in production

## Customization

### Change Cache Duration

Edit `app/Services/NavigationService.php`:

```php
return Cache::remember('navigation_menu', 7200, function () { // 2 hours
```

### Add Custom Validation

Edit `app/Models/MenuItem.php` or `MenuSection.php` to add validation rules.

### Styling

All styles are in [resources/js/components/layouts/MainLayout.tsx](resources/js/components/layouts/MainLayout.tsx) using Tailwind CSS.

## Troubleshooting

### Menu not showing up
- Check if migration ran: `php artisan migrate:status`
- Check if seeder ran: Query `menu_sections` table
- Clear cache: `php artisan cache:clear`

### Changes not appearing
- Clear navigation cache: `php artisan cache:forget navigation_menu`
- Clear all caches: `php artisan optimize:clear`

### Icons not displaying
- Ensure icon name matches Lucide React exactly (case-sensitive)
- Import icon in MainLayout.tsx if using new icon

### Permissions not working
- Update `hasPermission` function in MainLayout.tsx
- Ensure User model passes permissions to Inertia
- Check permission strings match exactly

## Future Enhancements

Potential additions for future versions:

1. **Admin UI** - Visual menu builder interface
2. **Drag & Drop Reordering** - Change menu order via UI
3. **Multi-language Support** - Translations for menu items
4. **Icon Picker** - Visual icon selection in admin
5. **Menu Templates** - Predefined menu structures for different roles
6. **Analytics** - Track which menu items are most used
7. **Favorites** - Let users pin favorite menu items
8. **Recent Items** - Show recently visited pages
