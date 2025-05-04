import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { Transaction } from "@/types/member";
import { useApiQuery } from "@/hooks/useApi";

const TransactionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  // const
  const { data: transactions, isLoading } = useApiQuery<Transaction[]>({
    url: "/api/transactions",
  });
  console.log(transactions);
  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (auth !== "true") {
      navigate("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return null;
  }

  // Filter transactions based on search term, status and type
  const filteredTransactions = transactions?.filter((transaction) => {
    // Search filter
    const matchesSearch =
      transaction?.currency
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase()) ||
      transaction?.id?.toLowerCase()?.includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus =
      currentFilter === "all" || transaction?.status === currentFilter;

    // Type filter
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const totalAmount = filteredTransactions.reduce((sum, transaction) => {
    return transaction.status === "completed" ? sum + transaction.amount : sum;
  }, 0);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Transaction Management</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Transaction Overview</CardTitle>
          <CardDescription>
            Manage and view all financial transactions
          </CardDescription>
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
              <Select value={typeFilter} onValueChange={setTypeFilter}>
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
              <TabsTrigger value="success">Success</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <div className="mt-4 bg-muted/40 p-2 rounded-md">
              <span className="font-medium">Total (Completed): </span>
              <span className="text-green-600">${totalAmount.toFixed(2)}</span>
            </div>

            <TabsContent value="all" className="mt-2">
              <TransactionTable transactions={filteredTransactions} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="success" className="mt-2">
              <TransactionTable transactions={filteredTransactions} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="pending" className="mt-2">
              <TransactionTable transactions={filteredTransactions} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="cancelled" className="mt-2">
              <TransactionTable transactions={filteredTransactions} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  isLoading
}) => {
  return (
    <div className="rounded-md border">
      {
        isLoading ? 
        <div className="container mx-auto py-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" />
      </div>
      :

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction Ref</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Purpose</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>View</TableHead>
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
                <TableCell className="font-medium">
                  {transaction?.transactionRef}
                </TableCell>
                <TableCell>{transaction?.name}</TableCell>
                <TableCell>{transaction?.donationPurpose}</TableCell>
                <TableCell>
                  <span className="capitalize">
                    {transaction.type.replace("_", " ")}
                  </span>
                </TableCell>
                <TableCell>${transaction?.amount.toFixed(2)}</TableCell>
                <TableCell>
                  {format(new Date(transaction.transactionDate), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="capitalize">
                  {transaction?.method?.replace("_", " ")}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                      transaction?.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : transaction?.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {transaction?.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Link
                    to={`/transactions/${transaction.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Details
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      }
    </div>
  );
};

export default TransactionsPage;
