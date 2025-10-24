# Dashboard Layout Guide

This guide explains how to use the new shadcn/ui dashboard layout that has been implemented in your application.

## Overview

The new dashboard layout features:
- **Collapsible sidebar** with navigation menu
- **Modern design** using shadcn/ui components
- **Charts** using Recharts library
- **Data tables** with tabs and filters
- **Responsive design** with mobile support

## Files Created

### 1. **App Sidebar Component**
**Location:** `resources/js/components/app-sidebar.tsx`

This is the main sidebar navigation component that includes:
- Company/Organization selector with dropdown
- Quick Create button
- Main navigation items
- Documents section
- Footer with help link

### 2. **Dashboard Layout**
**Location:** `resources/js/components/layouts/DashboardLayout.tsx`

This layout wrapper provides:
- Sidebar integration with SidebarProvider
- Top header with sidebar toggle
- User menu dropdown
- Notifications button
- Main content area

### 3. **Area Chart Component**
**Location:** `resources/js/components/charts/area-chart.tsx`

A reusable chart component that displays area charts with multiple series.

### 4. **Example Dashboard Page**
**Location:** `resources/js/pages/DashboardExample.tsx`

A complete example showing:
- Chart with time period filters
- Tabs with badges
- Data table with status badges
- Dropdown menus for customization

## How to Use

### Option 1: View the Example

Visit `/dashboard-example` in your browser (requires authentication) to see the new layout in action.

### Option 2: Update Your Existing Dashboard

Replace your existing dashboard to use the new layout:

```tsx
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Dashboard({ stats }: DashboardProps) {
  return (
    <DashboardLayout>
      <Head title="Dashboard" />
      {/* Your dashboard content */}
    </DashboardLayout>
  );
}
```

### Option 3: Use for New Pages

Create new pages with the dashboard layout:

```tsx
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function MyPage() {
  return (
    <DashboardLayout>
      {/* Your page content */}
    </DashboardLayout>
  );
}
```

## Customizing the Sidebar

Edit `resources/js/components/app-sidebar.tsx` to:

### Add Navigation Items

```tsx
const mainNavigation = [
  {
    name: 'Your Page',
    href: '/your-page',
    icon: YourIcon,
  },
  // ... more items
];
```

### Add Sections

```tsx
<SidebarGroup>
  <SidebarGroupLabel>Your Section</SidebarGroupLabel>
  <SidebarGroupContent>
    <SidebarMenu>
      {/* Your menu items */}
    </SidebarMenu>
  </SidebarGroupContent>
</SidebarGroup>
```

### Customize the Company Selector

Edit the dropdown menu content in the `SidebarHeader` section to add your organizations.

## Using Charts

Import and use the AreaChart component:

```tsx
import { AreaChart } from '@/components/charts/area-chart';

const data = [
  { date: 'Jan 1', desktop: 100, mobile: 50, tablet: 30 },
  // ... more data
];

<AreaChart data={data} />
```

## Components Installed

The following shadcn/ui components have been installed:
- sidebar
- chart
- avatar
- separator
- sheet
- tooltip
- skeleton
- collapsible

## Dependencies

- **recharts**: Chart library (already installed)
- **@radix-ui components**: UI primitives (already installed)
- **lucide-react**: Icons (already installed)

## Key Features

### 1. Collapsible Sidebar
The sidebar can be collapsed/expanded using the toggle button in the header.

### 2. Active Link Highlighting
Navigation items automatically highlight based on the current route.

### 3. Responsive Design
The layout adapts to different screen sizes with mobile-friendly navigation.

### 4. Customizable Theme
All components use CSS variables for theming, configurable in `resources/css/app.css`.

## Comparison with Old Layout

### Old Layout (MainLayout.tsx)
- Fixed sidebar
- Manual responsive handling
- Basic navigation

### New Layout (DashboardLayout.tsx)
- Collapsible sidebar with animations
- Built-in responsive design
- Modern shadcn/ui components
- Better mobile experience
- Integrated tooltip support

## Next Steps

1. **Test the example**: Visit `/dashboard-example` to see the layout
2. **Customize navigation**: Update `app-sidebar.tsx` with your menu items
3. **Migrate pages**: Gradually move pages to use DashboardLayout
4. **Add charts**: Use the AreaChart component for data visualization
5. **Style customization**: Adjust theme colors in your CSS variables

## Troubleshooting

### Sidebar not showing
Make sure you're wrapping your content with `DashboardLayout` component.

### Charts not rendering
Verify that recharts is installed: `npm install recharts`

### Styles missing
Ensure you've run `npm run dev` to compile the assets.

## Support

For more information about shadcn/ui components, visit:
- https://ui.shadcn.com/docs/components/sidebar
- https://ui.shadcn.com/docs/components/chart
