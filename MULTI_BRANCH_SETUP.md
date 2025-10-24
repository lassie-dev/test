# Multi-Branch System Setup Guide

## Overview
This guide explains how to set up and use the multi-branch functionality for the Funeral ERP system, allowing the application to operate across multiple physical locations simultaneously.

## What Has Been Implemented

### 1. Database Schema
- **`branches` table**: Stores branch information (name, code, address, city, region, contact info)
- **`branch_id` foreign keys**: Added to `users` and `contracts` tables
- **Migrations created**:
  - `2025_10_24_211114_create_branches_table.php`
  - `2025_10_24_211222_add_branch_id_to_users_table.php`
  - `2025_10_24_211222_add_branch_id_to_contracts_table.php`

### 2. Models & Relationships
- **Branch Model** (`app/Models/Branch.php`):
  - Relationships: `users()`, `contracts()`
  - Scopes: `active()`, `headquarters()`

- **User Model** (updated):
  - `branch()` relationship
  - `isAdmin()` method
  - `canViewBranch()` method

- **Contract Model** (updated):
  - `branch()` relationship
  - `forBranch()` scope for filtering

### 3. Dashboard Controller
- **Branch-aware filtering**: All stats and data filtered by selected branch
- **Admin privileges**: Admins can view all branches or switch between them
- **Branch selector**: Regular users see only their assigned branch

### 4. Dashboard UI
- **Branch selector dropdown**: For admins to switch between branches
- **Branch display badge**: Shows current branch for non-admin users
- **Responsive design**: Works on desktop and mobile

### 5. Sample Data
- **BranchSeeder**: Creates 4 sample Chilean branches:
  - Casa Matriz (Santiago) - Headquarters
  - Sucursal Viña del Mar
  - Sucursal Concepción
  - Sucursal La Serena

## Installation Steps

### 1. Install MySQL (if not already installed)

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure MySQL installation
sudo mysql_secure_installation
```

### 2. Create Database

```bash
# Login to MySQL as root
sudo mysql -u root

# Create database
CREATE DATABASE funeral_erp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create user (optional, recommended for production)
CREATE USER 'funeral_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON funeral_erp.* TO 'funeral_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Update .env File

The `.env` file has already been updated with:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=funeral_erp
DB_USERNAME=root
DB_PASSWORD=
```

**Important**: Update `DB_PASSWORD` with your MySQL password if required.

### 4. Run Migrations

```bash
# Run all migrations
php artisan migrate

# If you need to refresh (WARNING: This drops all tables)
php artisan migrate:fresh
```

### 5. Seed Sample Data

```bash
# Seed branches
php artisan db:seed --class=BranchSeeder

# Or seed everything
php artisan db:seed
```

## How It Works

### For Admin Users

1. **Login** as admin (email: `admin@funeraria.cl`)
2. **View Dashboard** - See branch selector in top-right corner
3. **Select Branch** - Choose a specific branch or "Todas las sucursales" to view all
4. **All stats** are filtered by the selected branch

### For Regular Users

1. **Login** as regular user assigned to a branch
2. **View Dashboard** - See only data from their assigned branch
3. **Branch badge** displays current branch (cannot switch)

### Branch Assignment

**To assign a user to a branch:**

```php
$user = User::find(1);
$user->branch_id = 1; // Assign to branch ID 1
$user->save();
```

**Or via migration/seeder:**

```php
User::factory()->create([
    'name' => 'Branch Manager',
    'email' => 'manager@vina.cl',
    'branch_id' => 2, // Viña del Mar branch
]);
```

## Database Structure

### branches table
```
id, name, code, address, city, region, phone, email,
is_active, is_headquarters, notes, created_at, updated_at
```

### users table (new column)
```
branch_id (nullable, foreign key to branches.id)
```

### contracts table (new column)
```
branch_id (nullable, foreign key to branches.id)
```

## Multi-Computer Access

With MySQL, multiple computers can access the same database simultaneously:

### Same Network (LAN)
1. Update `.env` on each computer:
   ```env
   DB_HOST=192.168.1.100  # IP of MySQL server
   ```

2. Grant remote access in MySQL:
   ```sql
   GRANT ALL PRIVILEGES ON funeral_erp.* TO 'funeral_user'@'%' IDENTIFIED BY 'password';
   FLUSH PRIVILEGES;
   ```

3. Update MySQL bind address in `/etc/mysql/mysql.conf.d/mysqld.cnf`:
   ```ini
   bind-address = 0.0.0.0
   ```

### Different Networks (Internet)
- Use secure VPN or SSH tunnel
- Or use cloud database (AWS RDS, DigitalOcean, etc.)

## Admin Role Setup

Currently, admin detection is temporary (checks for `admin@funeraria.cl` email).

**To implement proper roles**, you should:
1. Create a `roles` table
2. Add `role_id` to users
3. Update `User::isAdmin()` method

**Temporary workaround:**
```php
// In User model
public function isAdmin(): bool
{
    return $this->email === 'admin@funeraria.cl';
}
```

## Future Enhancements

### Recommended additions:
1. **Branch-specific inventory**: Add `branch_id` to inventory items
2. **Branch-specific staff**: Add `branch_id` to staff table
3. **Branch-specific payments**: Add `branch_id` to payments table
4. **Inter-branch transfers**: Track inventory/resource transfers
5. **Branch reports**: Generate per-branch financial reports
6. **Branch settings**: Custom configurations per branch

## Troubleshooting

### Issue: "SQLSTATE[HY000] [2002] Connection refused"
**Solution**: MySQL service is not running
```bash
sudo systemctl start mysql
```

### Issue: "Access denied for user 'root'@'localhost'"
**Solution**: Update password in `.env` or reset MySQL root password

### Issue: Branch selector not showing
**Solution**: Ensure user is marked as admin in database

### Issue: No branches appearing
**Solution**: Run the seeder
```bash
php artisan db:seed --class=BranchSeeder
```

## Testing Multi-Branch

1. **Create multiple branches** (via seeder or manually)
2. **Create users assigned to different branches**
3. **Create contracts assigned to branches**
4. **Login as admin** - verify you can see branch selector
5. **Switch branches** - verify stats change accordingly
6. **Login as regular user** - verify they only see their branch

## Security Considerations

1. ✅ Users can only view branches they have access to
2. ✅ Regular users cannot switch branches
3. ✅ Admin privileges are checked server-side
4. ⚠️ Implement proper role-based access control (RBAC)
5. ⚠️ Add audit logging for branch data access

## Support

For issues or questions about the multi-branch system, refer to:
- Laravel documentation: https://laravel.com/docs
- This project's issue tracker
- Contact the development team

---

**Last Updated**: October 24, 2025
**Version**: 1.0
