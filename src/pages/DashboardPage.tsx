import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Users, UserPlus, UserCheck, UserX } from 'lucide-react';
import { useApiQuery } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';

interface MemberStats {
  total: string;
  active: number;
  pending: number;
  inactive: number;
}

interface MonthlyRegistration {
  month: string;
  count: number;
}

interface DashboardData {
  stats: MemberStats;
  monthlyRegistrations: MonthlyRegistration[];
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Fetch dashboard data from API
  const { data: dashboardData, isLoading, error } = useApiQuery<DashboardData>({
    url: '/dashboard',
  });
console.log(dashboardData)
  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (auth !== 'true') {
      navigate('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error.message}</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare chart data
  const statusChartData = [
    { name: 'Active', value: dashboardData?.stats?.active || 0, color: '#10B981' },
    { name: 'Pending', value: dashboardData?.stats?.pending || 0, color: '#F59E0B' },
    { name: 'Inactive', value: dashboardData?.stats?.inactive || 0, color: '#EF4444' },
  ];

  // Format monthly registration data
  const monthlyData = dashboardData?.monthlyRegistrations?.map(item => ({
    name: item.month,
    value: item.count
  })) || [];

  const chartConfig = {
    active: { color: '#10B981', label: 'Active' },
    pending: { color: '#F59E0B', label: 'Pending' },
    inactive: { color: '#EF4444', label: 'Inactive' },
    registrations: { color: '#6366F1', label: 'New Registrations' },
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Members</p>
              <p className="text-3xl font-bold">{dashboardData?.stats?.total ?? 0}</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Members</p>
              <p className="text-3xl font-bold">{dashboardData?.stats?.active || 0}</p>
            </div>
            <div className="p-2 bg-emerald-100 rounded-full">
              <UserCheck className="h-6 w-6 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Members</p>
              <p className="text-3xl font-bold">{dashboardData?.stats?.pending || 0}</p>
            </div>
            <div className="p-2 bg-amber-100 rounded-full">
              <UserPlus className="h-6 w-6 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Inactive Members</p>
              <p className="text-3xl font-bold">{dashboardData?.stats?.inactive || 0}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <UserX className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Member Status Distribution</CardTitle>
            <CardDescription>Breakdown of members by current status</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar 
                    dataKey="value" 
                    name="status"
                    fill="#10B981"
                    fillOpacity={0.8}
                  />
                  <Tooltip 
                    content={({ active, payload }) => (
                      <ChartTooltip active={active} payload={payload} />
                    )}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>New Registrations</CardTitle>
            <CardDescription>Monthly registration trend</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar 
                    dataKey="value" 
                    fill={chartConfig.registrations.color} 
                  />
                  <Tooltip 
                    content={({ active, payload }) => (
                      <ChartTooltip active={active} payload={payload} />
                    )}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;