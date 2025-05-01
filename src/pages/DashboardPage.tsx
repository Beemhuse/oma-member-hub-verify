
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useMemberContext } from '@/contexts/MemberContext';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Users, UserPlus, UserCheck, UserX } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { members } = useMemberContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (auth !== 'true') {
      navigate('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return null; // Don't render until authentication check completes
  }

  // Calculate statistics
  const totalMembers = members.length;
  const activeMembers = members.filter(member => member.status === 'active').length;
  const pendingMembers = members.filter(member => member.status === 'pending').length;
  const inactiveMembers = members.filter(member => member.status === 'inactive').length;

  // Data for status chart
  const statusChartData = [
    { name: 'Active', value: activeMembers, color: '#10B981' },
    { name: 'Pending', value: pendingMembers, color: '#F59E0B' },
    { name: 'Inactive', value: inactiveMembers, color: '#EF4444' },
  ];

  // Mock data for monthly registrations
  const mockMonthlyData = [
    { name: 'Jan', value: 4 },
    { name: 'Feb', value: 6 },
    { name: 'Mar', value: 8 },
    { name: 'Apr', value: 12 },
    { name: 'May', value: 10 },
    { name: 'Jun', value: 14 },
  ];

  // Chart configuration
  const chartConfig = {
    active: { 
      color: '#10B981', // Green
      label: 'Active' 
    },
    pending: { 
      color: '#F59E0B', // Yellow
      label: 'Pending' 
    },
    inactive: { 
      color: '#EF4444', // Red
      label: 'Inactive' 
    },
    registrations: { 
      color: '#6366F1', // Purple
      label: 'New Registrations' 
    },
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Members</p>
              <p className="text-3xl font-bold">{totalMembers}</p>
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
              <p className="text-3xl font-bold">{activeMembers}</p>
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
              <p className="text-3xl font-bold">{pendingMembers}</p>
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
              <p className="text-3xl font-bold">{inactiveMembers}</p>
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
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-2 bg-white border shadow rounded">
                            <p className="font-medium">{data.name}</p>
                            <p>Count: {data.value}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
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
                <BarChart data={mockMonthlyData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar 
                    dataKey="value" 
                    fill={chartConfig.registrations.color} 
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-2 bg-white border shadow rounded">
                            <p className="font-medium">{data.name}</p>
                            <p>Registrations: {data.value}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
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
