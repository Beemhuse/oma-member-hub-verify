import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Barcode, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils/member-utils';
import { toast } from '@/hooks/use-toast';
import { useApiMutation } from '@/hooks/useApi';

interface Member {
  _id: string;
  firstName: string;
  lastName: string;
  membershipId: string;
  membershipStatus: 'active' | 'inactive' | 'pending' | 'suspended';
  _createdAt: string;
  // Add other member fields as needed
}

interface CardData {
  _id: string;
  cardId: string;
  member: Member;
  isValid: boolean;
  expiryDate: string;
  issueDate: string;
  // Add other card fields as needed
}

interface VerificationResponse {
  isValid: boolean;
  card?: CardData;
  error?: string;
}

const VerifyIdPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [membershipIdInput, setMembershipIdInput] = useState(id || '');
  const [verificationResult, setVerificationResult] = useState<VerificationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: verifyUser } = useApiMutation<VerificationResponse, void>({
    method: "GET",
    url: `/api/verify-card/${id ?? membershipIdInput}`,
    onSuccess: (data) => {
      setVerificationResult(data);
      if (data.isValid) {
        toast({
          title: "Verified successfully",
          description: `Member ${data.card?.member.firstName} ${data.card?.member.lastName} is verified`,
        });
      } else {
        toast({
          title: "Verification failed",
          description: data.error || "Invalid membership ID",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setVerificationResult({
        isValid: false,
        error: error.message
      });
      setIsLoading(false);
    },
  });
  const handleVerify = useCallback(()=>{
    if (!membershipIdInput && !id) return;
    
    setIsLoading(true);
    verifyUser();
   
 }, [id, membershipIdInput, verifyUser])


  // If ID is provided in URL, verify immediately
  useEffect(() => {
    if (id) {
      handleVerify();
    }
  }, [handleVerify, id]);


  const getBadgeColor = (status?: string) => {
    switch(status?.toLowerCase()) {
      case 'active':
        return 'bg-green-500 text-white';
      case 'inactive':
        return 'bg-gray-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'suspended':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-6">
      <h1 className="text-2xl font-semibold mb-6">Verify Membership ID</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Verification Tool</CardTitle>
          <CardDescription>
            Enter a membership ID or scan a barcode to verify its authenticity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!id && (
            <div className="flex flex-col sm:flex-row gap-2 mb-6">
              <Input 
                placeholder="Enter membership ID (e.g., OMA-123456)"
                value={membershipIdInput}
                onChange={(e) => setMembershipIdInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              />
              <Button 
                onClick={handleVerify}
                disabled={!membershipIdInput || isLoading}
                className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">↻</span>
                    Verifying...
                  </span>
                ) : (
                  <>
                    <Barcode className="h-4 w-4 mr-2" />
                    Verify
                  </>
                )}
              </Button>
            </div>
          )}
          
          {verificationResult && (
            <div className="mt-6 border-t pt-6">
              {verificationResult.isValid && verificationResult.card ? (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-8 w-8 text-green-500 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-600">Verification Successful</h3>
                      <p className="text-sm text-gray-500">This membership ID is valid and registered in our system.</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-medium mb-3">Member Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                      <div>
                        <p className="text-gray-500">Name</p>
                        <p className="font-medium">
                          {verificationResult.card.member.firstName} {verificationResult.card.member.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Member ID</p>
                        <p className="font-medium">{verificationResult.card.cardId}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Join Date</p>
                        <p className="font-medium">
                          {formatDate(verificationResult.card.member._createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Status</p>
                        <Badge className={getBadgeColor(verificationResult.card.member.membershipStatus)}>
                          {verificationResult.card.member.membershipStatus.charAt(0).toUpperCase()}
                          {verificationResult.card.member.membershipStatus.slice(1)}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-gray-500">Issued Date</p>
                        <p className="font-medium">
                          {formatDate(verificationResult.card?.issueDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Expiry Date</p>
                        <p className="font-medium text-red-400">
                          {formatDate(verificationResult.card?.expiryDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={() => navigate(`/members/${verificationResult.card.member._id}`)}
                      className="bg-oma-green  text-white"
                    >
                      View Full Profile
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <XCircle className="h-8 w-8 text-red-500 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-600">Verification Failed</h3>
                    <p className="text-sm text-gray-500">
                      {verificationResult.error || `The membership ID "${id || membershipIdInput}" is not valid or not registered in our system.`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyIdPage;