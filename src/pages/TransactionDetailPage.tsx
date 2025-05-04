import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useApiQuery } from '@/hooks/useApi';
import { Transaction } from '@/types/member';
import { toast } from '@/hooks/use-toast';

const TransactionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: transaction, isLoading, error } = useApiQuery<Transaction>({
    url: `/api/transactions/${id}`,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    toast({
      title: "Error",
      description: error.message || "Failed to load transaction details",
      variant: "destructive",
    });
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error.message || 'Failed to load transaction'}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3" 
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Warning!</strong>
          <span className="block sm:inline"> Transaction not found</span>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': 
      case 'cancelled': 
      case 'refunded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodBadge = (method: string) => {
    switch(method.toLowerCase()) {
      case 'paystack': return 'bg-purple-100 text-purple-800';
      case 'card': return 'bg-blue-100 text-blue-800';
      case 'bank_transfer': return 'bg-indigo-100 text-indigo-800';
      case 'mobile_money': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Transactions
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Print Receipt
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>
            Reference: {transaction.transactionRef}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Transaction Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Transaction Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction ID:</span>
                  <span className="font-medium">{transaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reference:</span>
                  <span className="font-medium">{transaction.transactionRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span className="font-medium">
                    {format(new Date(transaction.transactionDate), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type:</span>
                  <span className="font-medium capitalize">
                    {transaction.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <Badge className={getStatusBadge(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Payment Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-medium">
                    {transaction.currency} {transaction.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Method:</span>
                  <Badge className={getMethodBadge(transaction.method)}>
                    {transaction.method.replace('_', ' ')}
                  </Badge>
                </div>
                {transaction.donationPurpose && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Purpose:</span>
                    <span className="font-medium">{transaction.donationPurpose}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payer Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Payer Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name:</span>
                  <span className="font-medium">{transaction.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium">{transaction.email}</span>
                </div>
              </div>
            </div>

            {/* System Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">System Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Created:</span>
                  <span className="font-medium">
                    {/* {format(new Date(transaction._createdAt), 'MMM d, yyyy h:mm a')} */}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Updated:</span>
                  <span className="font-medium">
                    {/* {format(new Date(transaction._updatedAt), 'MMM d, yyyy h:mm a')} */}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Notes (if any) */}
        

        
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionDetailPage;