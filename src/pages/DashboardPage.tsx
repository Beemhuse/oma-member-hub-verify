import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { 
  ChartContainer, 
  ChartTooltip, 
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts';
import { Users, UserPlus, UserCheck, UserX, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useApiQuery } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface MemberStats {
  total: string;
  active: number;
  pending: number;
  inactive: number;
}
interface Member{
  members: MemberStats;
  transactions: ITransactions
}
interface ITransactions{
  totalRevenue: string;
  totalTransactions: string;
  averageTransaction: string;
  success: string;
  pending: string;
  failed: string
}
interface MonthlyRegistration {
  month: string;
  count: number;
}

interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: 'credit' | 'debit';
  date: string;
  status: 'success' | 'pending' | 'failed';
}

interface MonthlyTransactions {
  month: string;
  total: number;
}

interface DashboardData {
  stats: Member;
  monthlyRegistrations: MonthlyRegistration[];
  recentTransactions: Transaction[];
  monthlyTransactions: MonthlyTransactions[];
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Fetch dashboard data from API
  const { data: dashboardData, isLoading, error } = useApiQuery<DashboardData>({
    url: '/dashboard',
  });

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
    { name: 'Active', value: dashboardData?.stats?.members.active || 0, color: '#10B981' },
    { name: 'Pending', value: dashboardData?.stats?.members?.pending || 0, color: '#F59E0B' },
    { name: 'Inactive', value: dashboardData?.stats?.members?.inactive || 0, color: '#EF4444' },
  ];

  // Format monthly registration data
  const monthlyData = dashboardData?.monthlyRegistrations?.map(item => ({
    name: item.month,
    value: item.count
  })) || [];
console.log(monthlyData)
  // Format transaction data
  const transactionData = dashboardData?.monthlyTransactions?.map(item => ({
    name: item.month,
    value: item.total
  })) || [];

  const totalRevenue = dashboardData?.monthlyTransactions?.reduce((sum, item) => sum + item.total, 0) || 0;
  const totalTransactions = dashboardData?.recentTransactions?.length || 0;

  const chartConfig = {
    active: { color: '#10B981', label: 'Active' },
    pending: { color: '#F59E0B', label: 'Pending' },
    inactive: { color: '#EF4444', label: 'Inactive' },
    registrations: { color: '#6366F1', label: 'New Registrations' },
    transactions: { color: '#8B5CF6', label: 'Transactions' },
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Members</p>
              <p className="text-3xl font-bold">{dashboardData?.stats?.members?.total ?? 0}</p>
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
              <p className="text-3xl font-bold">{dashboardData?.stats?.members?.active || 0}</p>
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
              <p className="text-3xl font-bold">{dashboardData?.stats?.members?.pending || 0}</p>
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
              <p className="text-3xl font-bold">{dashboardData?.stats?.members?.inactive || 0}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <UserX className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Member Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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

      {/* Transaction Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Transaction Summary Cards */}
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="text-3xl font-bold">${dashboardData?.stats?.transactions?.totalRevenue}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
              <p className="text-3xl font-bold">{dashboardData?.stats?.transactions?.totalTransactions}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <ArrowUpRight className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Transaction</p>
              <p className="text-3xl font-bold">
                ${dashboardData?.stats?.transactions?.averageTransaction ?? 0}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <ArrowDownRight className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Trend</CardTitle>
            <CardDescription>Monthly transaction volume</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={transactionData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={chartConfig.transactions.color}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Tooltip 
                    content={({ active, payload }) => (
                      <ChartTooltip active={active} payload={payload} />
                    )}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>The latest 5 transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData?.recentTransactions?.slice(0, 5).map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.name}</TableCell>
                    <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.type === 'credit' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.status === 'success' 
                          ? 'bg-green-100 text-green-800' 
                          : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => navigate('/transactions')}
            >
              View All Transactions
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;