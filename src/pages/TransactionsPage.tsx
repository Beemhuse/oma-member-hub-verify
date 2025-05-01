
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { Transaction } from '@/types/member';

// Mock transactions data - replace with actual API call later
const mockTransactions: Transaction[] = [
  {
    id: '1',
    memberId: 'MEM001',
    amount: 50,
    description: 'Membership Fee - 2025',
    date: '2025-01-10T12:00:00Z',
    paymentMethod: 'card',
    status: 'completed',
    type: 'membership_fee'
  },
  {
    id: '2',
    memberId: 'MEM002',
    amount: 15,
    description: 'ID Card Replacement',
    date: '2025-01-15T14:30:00Z',
    paymentMethod: 'cash',
    status: 'completed',
    type: 'id_card'
  },
  {
    id: '3',
    memberId: 'MEM003',
    amount: 100,
    description: 'General Donation',
    date: '2025-01-20T09:15:00Z',
    paymentMethod: 'bank_transfer',
    status: 'pending',
    type: 'donation'
  },
  {
    id: '4',
    memberId: 'MEM001',
    amount: 25,
    description: 'Event Fee - Summer Gathering',
    date: '2025-02-05T16:45:00Z',
    paymentMethod: 'card',
    status: 'completed',
    type: 'event_fee'
  },
  {
    id: '5',
    memberId: 'MEM004',
    amount: 50,
    description: 'Membership Fee - 2025',
    date: '2025-02-10T11:30:00Z',
    paymentMethod: 'cash',
    status: 'cancelled',
    type: 'membership_fee'
  },
];

const TransactionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

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

  // Filter transactions based on search term, status and type
  const filteredTransactions = transactions.filter(transaction => {
    // Search filter
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = 
      currentFilter === 'all' || 
      transaction.status === currentFilter;
    
    // Type filter
    const matchesType = 
      typeFilter === 'all' || 
      transaction.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalAmount = filteredTransactions.reduce((sum, transaction) => {
    return transaction.status === 'completed' ? sum + transaction.amount : sum;
  }, 0);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Transaction Management</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Transaction Overview</CardTitle>
          <CardDescription>Manage and view all financial transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search transactions..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4">
              <Select 
                value={typeFilter} 
                onValueChange={setTypeFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="membership_fee">Membership Fee</SelectItem>
                  <SelectItem value="id_card">ID Card</SelectItem>
                  <SelectItem value="donation">Donation</SelectItem>
                  <SelectItem value="event_fee">Event Fee</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline">Export</Button>
            </div>
          </div>
          
          <Tabs defaultValue="all" onValueChange={setCurrentFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
            
            <div className="mt-4 bg-muted/40 p-2 rounded-md">
              <span className="font-medium">Total (Completed): </span>
              <span className="text-green-600">${totalAmount.toFixed(2)}</span>
            </div>
            
            <TabsContent value="all" className="mt-2">
              <TransactionTable transactions={filteredTransactions} />
            </TabsContent>
            
            <TabsContent value="completed" className="mt-2">
              <TransactionTable transactions={filteredTransactions} />
            </TabsContent>
            
            <TabsContent value="pending" className="mt-2">
              <TransactionTable transactions={filteredTransactions} />
            </TabsContent>
            
            <TabsContent value="cancelled" className="mt-2">
              <TransactionTable transactions={filteredTransactions} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Member ID</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center h-24">
                No transactions found.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell>{transaction.memberId}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <span className="capitalize">
                    {transaction.type.replace('_', ' ')}
                  </span>
                </TableCell>
                <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                <TableCell>
                  {format(new Date(transaction.date), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="capitalize">
                  {transaction.paymentMethod.replace('_', ' ')}
                </TableCell>
                <TableCell>
                  <span 
                    className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : transaction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {transaction.status}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsPage;
