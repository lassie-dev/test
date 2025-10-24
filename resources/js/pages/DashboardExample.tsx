import { Head } from '@inertiajs/react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AreaChart } from '@/components/charts/area-chart';
import { Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Sample data for the chart
const chartData = [
  { date: 'Apr 3', desktop: 420, mobile: 180, tablet: 120 },
  { date: 'Apr 10', desktop: 480, mobile: 220, tablet: 140 },
  { date: 'Apr 17', desktop: 520, mobile: 260, tablet: 160 },
  { date: 'Apr 24', desktop: 390, mobile: 190, tablet: 130 },
  { date: 'May 1', desktop: 580, mobile: 280, tablet: 180 },
  { date: 'May 8', desktop: 720, mobile: 340, tablet: 210 },
  { date: 'May 15', desktop: 640, mobile: 300, tablet: 190 },
  { date: 'May 23', desktop: 580, mobile: 270, tablet: 170 },
  { date: 'May 31', desktop: 690, mobile: 320, tablet: 200 },
  { date: 'Jun 7', desktop: 880, mobile: 410, tablet: 260 },
  { date: 'Jun 14', desktop: 940, mobile: 450, tablet: 280 },
  { date: 'Jun 21', desktop: 1020, mobile: 490, tablet: 310 },
  { date: 'Jun 30', desktop: 1180, mobile: 560, tablet: 350 },
];

// Sample table data
const tableData = [
  {
    id: 1,
    name: 'Project Alpha',
    status: 'Active',
    priority: 'High',
    date: '2024-01-15',
    progress: 75,
  },
  {
    id: 2,
    name: 'Website Redesign',
    status: 'In Progress',
    priority: 'Medium',
    date: '2024-01-20',
    progress: 45,
  },
  {
    id: 3,
    name: 'Mobile App',
    status: 'Active',
    priority: 'High',
    date: '2024-01-25',
    progress: 60,
  },
  {
    id: 4,
    name: 'Backend Migration',
    status: 'Pending',
    priority: 'Low',
    date: '2024-02-01',
    progress: 20,
  },
  {
    id: 5,
    name: 'Security Audit',
    status: 'Completed',
    priority: 'High',
    date: '2024-01-10',
    progress: 100,
  },
];

export default function DashboardExample() {
  return (
    <DashboardLayout>
      <Head title="Dashboard Example" />

      <div className="flex flex-col gap-4">
        {/* Chart Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Total Visitors</CardTitle>
              <CardDescription>Total for the last 3 months</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Last 7 days
              </Button>
              <Button variant="outline" size="sm">
                Last 30 days
              </Button>
              <Button variant="outline" size="sm" className="bg-muted">
                Last 3 months
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <AreaChart data={chartData} />
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="outline" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="outline">Outline</TabsTrigger>
              <TabsTrigger value="past">
                Past Performance
                <Badge variant="secondary" className="ml-2">
                  3
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="personnel">
                Key Personnel
                <Badge variant="secondary" className="ml-2">
                  2
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="documents">Focus Documents</TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Customize Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Name</DropdownMenuItem>
                  <DropdownMenuItem>Status</DropdownMenuItem>
                  <DropdownMenuItem>Priority</DropdownMenuItem>
                  <DropdownMenuItem>Date</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </div>
          </div>

          <TabsContent value="outline" className="mt-0">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === 'Active'
                              ? 'default'
                              : item.status === 'Completed'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.priority === 'High'
                              ? 'destructive'
                              : item.priority === 'Medium'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {item.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell className="text-right">{item.progress}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="past">
            <Card className="p-6">
              <p className="text-muted-foreground">Past performance data will appear here.</p>
            </Card>
          </TabsContent>

          <TabsContent value="personnel">
            <Card className="p-6">
              <p className="text-muted-foreground">Key personnel information will appear here.</p>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card className="p-6">
              <p className="text-muted-foreground">Focus documents will appear here.</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
