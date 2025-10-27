import { Link, usePage } from '@inertiajs/react';
import { ReactNode, useState, useEffect } from 'react';
import {
  FileText,
  Package,
  CreditCard,
  Users,
  DollarSign,
  BarChart3,
  LayoutDashboard,
  Menu,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  X,
  Search,
  PanelLeftClose,
  PanelLeft,
  Home,
  Circle,
  LucideIcon,
  // New elegant icons
  LayoutGrid,
  FileSignature,
  Archive,
  Wallet,
  UsersRound,
  Receipt,
  TrendingUp,
  Briefcase,
  FolderTree,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';
import { Input } from '@/components/ui/input';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

interface MainLayoutProps {
  children: ReactNode;
}

// Helper to get icon component from string name or return the component directly
const getIconComponent = (icon: any): LucideIcon => {
  if (typeof icon === 'string') {
    // @ts-ignore - Dynamic icon lookup
    return LucideIcons[icon] || Circle;
  }
  return icon;
};

interface NavigationSection {
  title: string | null;
  titleKey?: string;
  items: MenuItem[];
  permissions?: string[];
}

interface MenuItem {
  name: string;
  nameKey?: string;
  href: string;
  icon: any;
  badge?: number;
  permissions?: string[];
  children?: MenuItem[];
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { t } = useTranslation();
  const page = usePage<any>();
  const { auth, navigation: dbNavigation } = page.props;
  const currentUrl = page.url;

  const navigationSections: NavigationSection[] = [
    {
      title: null,
      items: [
        { name: t('nav.dashboard'), nameKey: 'nav.dashboard', href: '/dashboard', icon: LayoutGrid },
      ],
    },
    {
      title: t('nav.operations'),
      titleKey: 'nav.operations',
      permissions: ['view_operations'],
      items: [
        {
          name: t('nav.contracts'),
          nameKey: 'nav.contracts',
          href: '/contracts',
          icon: FileSignature,
          permissions: ['view_contracts'],
          children: [
            { name: t('nav.newContract'), nameKey: 'nav.newContract', href: '/contracts/create', icon: FileSignature },
            { name: t('nav.contractList'), nameKey: 'nav.contractList', href: '/contracts', icon: FileText },
            { name: t('nav.archivedContracts'), nameKey: 'nav.archivedContracts', href: '/contracts/archived', icon: Archive },
          ]
        },
        {
          name: t('nav.services'),
          nameKey: 'nav.services',
          href: '/services',
          icon: Briefcase,
          permissions: ['view_services'],
        },
        {
          name: t('nav.categories'),
          nameKey: 'nav.categories',
          href: '/categories',
          icon: FolderTree,
          permissions: ['view_categories'],
          children: [
            { name: t('nav.productCategories'), nameKey: 'nav.productCategories', href: '/categories/products', icon: Package },
            { name: t('nav.serviceCategories'), nameKey: 'nav.serviceCategories', href: '/categories/services', icon: Briefcase },
          ]
        },
        {
          name: t('nav.products'),
          nameKey: 'nav.products',
          href: '/inventory',
          icon: Archive,
          permissions: ['view_inventory'],
          badge: 5,
        },
        {
          name: t('nav.payments'),
          nameKey: 'nav.payments',
          href: '/payments',
          icon: Wallet,
          permissions: ['view_payments'],
          badge: 12,
        },
        {
          name: t('nav.staff'),
          nameKey: 'nav.staff',
          href: '/staff',
          icon: UsersRound,
          permissions: ['view_staff'],
        },
        {
          name: t('nav.payroll'),
          nameKey: 'nav.payroll',
          href: '/payroll',
          icon: Receipt,
          permissions: ['view_payroll'],
        },
      ],
    },
    {
      title: t('nav.analysis'),
      titleKey: 'nav.analysis',
      permissions: ['view_reports'],
      items: [
        { name: t('nav.reports'), nameKey: 'nav.reports', href: '/reports', icon: TrendingUp },
      ],
    },
  ];

  // Use database navigation if available, otherwise fallback to hardcoded
  const navigationData = dbNavigation && dbNavigation.length > 0 ? dbNavigation : navigationSections;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize expanded items based on current URL and localStorage
  const getInitialExpandedState = () => {
    // Try to load from localStorage first
    const stored = localStorage.getItem('sidebar-expanded-items');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        // If parsing fails, fall through to default behavior
      }
    }

    // Default: expand items that match current URL
    const expanded: Record<string, boolean> = {};
    for (const section of navigationData) {
      for (const item of section.items) {
        if (item.children && currentUrl?.startsWith(item.href)) {
          expanded[item.name] = true;
        }
      }
    }
    return expanded;
  };

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(getInitialExpandedState);

  // Save expanded items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sidebar-expanded-items', JSON.stringify(expandedItems));
  }, [expandedItems]);

  // Update expanded items when URL changes to ensure active parent is expanded
  useEffect(() => {
    const newExpanded = { ...expandedItems };
    let hasChanges = false;

    for (const section of navigationData) {
      for (const item of section.items) {
        if (item.children && currentUrl?.startsWith(item.href)) {
          if (!newExpanded[item.name]) {
            newExpanded[item.name] = true;
            hasChanges = true;
          }
        }
      }
    }

    if (hasChanges) {
      setExpandedItems(newExpanded);
    }
  }, [currentUrl, navigationData]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentUrl]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Check if user has permission
  const hasPermission = (permissions?: string[]) => {
    if (!permissions || permissions.length === 0) return true;
    // For now, return true. In production, check against auth.user.permissions
    return true;
    // return permissions.some(p => auth?.user?.permissions?.includes(p));
  };

  // Filter sections and items by permissions
  const filteredSections = navigationData
    .filter((section: any) => hasPermission(section.permissions))
    .map((section: any) => ({
      ...section,
      items: section.items.filter((item: any) => hasPermission(item.permissions))
    }))
    .filter((section: any) => section.items.length > 0);

  // Filter items by search query
  const searchFilteredSections = searchQuery
    ? filteredSections.map((section: NavigationSection) => ({
        ...section,
        items: section.items.filter((item: MenuItem) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.children?.some((child: MenuItem) =>
            child.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
      })).filter((section: NavigationSection) => section.items.length > 0)
    : filteredSections;

  // Toggle item expansion
  const toggleItem = (itemName: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  // Generate breadcrumbs
  const generateBreadcrumbs = () => {
    const crumbs = [{ name: t('common.home'), href: '/dashboard', icon: Home }];

    for (const section of filteredSections) {
      for (const item of section.items) {
        if (currentUrl?.startsWith(item.href) && item.href !== '/dashboard') {
          crumbs.push({ name: item.name, href: item.href, icon: item.icon });

          // Check for active child
          if (item.children) {
            const activeChild = item.children.find((child: MenuItem) =>
              currentUrl === child.href || currentUrl?.startsWith(child.href + '/')
            );
            if (activeChild && activeChild.href !== item.href) {
              crumbs.push({ name: activeChild.name, href: activeChild.href, icon: activeChild.icon });
            }
          }
          break;
        }
      }
    }

    return crumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Header with Logo and Controls */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 flex-shrink-0">
          {!isCollapsed && <Logo size="md" />}
          {isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(false)}
              className="mx-auto"
            >
              <PanelLeft className="h-5 w-5" />
            </Button>
          )}
          {!isCollapsed && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(true)}
                className="hidden lg:flex"
              >
                <PanelLeftClose className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="p-3 border-b border-gray-200 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={t('common.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {searchFilteredSections.map((section: NavigationSection, sectionIdx: number) => (
            <div key={sectionIdx}>
              {section.title && !isCollapsed && (
                <h3 className="mb-2 px-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item: MenuItem) => {
                  const Icon = getIconComponent(item.icon);
                  const hasChildren = item.children && item.children.length > 0;

                  // Check if any child is active
                  const activeChild = hasChildren
                    ? item.children?.find((child: MenuItem) =>
                        currentUrl === child.href || currentUrl?.startsWith(child.href + '/')
                      )
                    : null;

                  // Parent is only active if on exact parent page and no child is active
                  const isActive = !activeChild && (currentUrl === item.href || (currentUrl?.startsWith(item.href + '/') && !hasChildren));
                  const isExpanded = expandedItems[item.name];

                  return (
                    <div key={item.name}>
                      <div className="flex items-center gap-1">
                        <Link
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors flex-1',
                            isActive
                              ? 'bg-primary-50 text-text-accent'
                              : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
                          )}
                          title={isCollapsed ? item.name : undefined}
                        >
                          <Icon className="h-5 w-5 flex-shrink-0" />
                          {!isCollapsed && (
                            <>
                              <span className="flex-1">{item.name}</span>
                              {item.badge && item.badge > 0 && (
                                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-error rounded-full">
                                  {item.badge > 99 ? '99+' : item.badge}
                                </span>
                              )}
                            </>
                          )}
                        </Link>
                        {hasChildren && !isCollapsed && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleItem(item.name);
                            }}
                            className="h-8 w-8 flex-shrink-0"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>

                      {/* Sub-menu */}
                      {hasChildren && isExpanded && !isCollapsed && (
                        <div className="ml-8 mt-1 space-y-1 border-l-2 border-gray-200 pl-3">
                          {item.children?.map((child: MenuItem) => {
                            const ChildIcon = getIconComponent(child.icon);
                            const isChildActive = currentUrl === child.href || currentUrl?.startsWith(child.href + '/');

                            return (
                              <Link
                                key={child.name}
                                href={child.href}
                                className={cn(
                                  'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors',
                                  isChildActive
                                    ? 'bg-primary-50 text-text-accent font-medium'
                                    : 'text-text-muted hover:bg-gray-100 hover:text-text-secondary'
                                )}
                              >
                                <ChildIcon className="h-4 w-4 flex-shrink-0" />
                                <span>{child.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile Footer */}
        <div className="border-t border-gray-200 p-3 flex-shrink-0">
          {!isCollapsed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-gray-100 transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold flex-shrink-0">
                    {auth?.user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 text-left overflow-hidden">
                    <div className="font-medium text-text-primary truncate">
                      {auth?.user?.name || t('nav.user')}
                    </div>
                    <div className="text-xs text-text-subtle truncate">
                      {auth?.user?.email || t('nav.defaultEmail')}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{t('nav.myAccount')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    {t('nav.settings')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="flex w-full items-center gap-2 text-error"
                  >
                    <LogOut className="h-4 w-4" />
                    {t('nav.logout')}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center justify-center rounded-lg p-2 hover:bg-gray-100 transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold">
                    {auth?.user?.name?.charAt(0) || 'U'}
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-text-primary">{auth?.user?.name || t('nav.user')}</p>
                    <p className="text-xs text-text-subtle">{auth?.user?.email || t('nav.defaultEmail')}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    {t('nav.settings')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="flex w-full items-center gap-2 text-error"
                  >
                    <LogOut className="h-4 w-4" />
                    {t('nav.logout')}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        isCollapsed ? "lg:pl-16" : "lg:pl-64"
      )}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1" />

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error"></span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                  {auth?.user?.name?.charAt(0) || 'U'}
                </div>
                <span className="hidden text-sm font-medium lg:inline-block">
                  {auth?.user?.name || t('nav.user')}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{t('nav.myAccount')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  {t('nav.settings')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/logout"
                  method="post"
                  as="button"
                  className="flex w-full items-center gap-2 text-error"
                >
                  <LogOut className="h-4 w-4" />
                  {t('nav.logout')}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Breadcrumbs */}
        {breadcrumbs.length > 1 && (
          <div className="bg-white border-b border-gray-200 px-6 py-3">
            <nav className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => {
                const CrumbIcon = getIconComponent(crumb.icon);
                const isLast = index === breadcrumbs.length - 1;

                return (
                  <div key={crumb.href} className="flex items-center">
                    {index > 0 && (
                      <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
                    )}
                    {isLast ? (
                      <span className="flex items-center gap-2 text-text-primary font-medium">
                        <CrumbIcon className="h-4 w-4" />
                        {crumb.name}
                      </span>
                    ) : (
                      <Link
                        href={crumb.href}
                        className="flex items-center gap-2 text-text-muted hover:text-text-secondary transition-colors"
                      >
                        <CrumbIcon className="h-4 w-4" />
                        {crumb.name}
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        )}

        {/* Page Content */}
        <main className="p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
