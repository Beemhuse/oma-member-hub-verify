
import React, { useState } from 'react';
import { useMemberContext } from '@/contexts/MemberContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Barcode, CheckCircle2, XCircle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils/member-utils';

const VerifyIdPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { getMemberByMembershipId } = useMemberContext();
  const navigate = useNavigate();
  const [membershipIdInput, setMembershipIdInput] = useState(id || '');
  const [verificationResult, setVerificationResult] = useState<{ verified: boolean; member?: ReturnType<typeof getMemberByMembershipId> } | null>(null);
  
  // If ID is provided in URL, verify immediately
  React.useEffect(() => {
    if (id) {
      handleVerify();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  
  const handleVerify = () => {
    const membershipIdToVerify = id || membershipIdInput;
    if (!membershipIdToVerify) return;
    
    const member = getMemberByMembershipId(membershipIdToVerify);
    setVerificationResult({
      verified: !!member,
      member
    });
  };
  
  const getBadgeColor = (status?: string) => {
    switch(status) {
      case 'active':
        return 'bg-oma-green text-white';
      case 'inactive':
        return 'bg-gray-400 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-400';
    }
  };
  
  return (
    <div className="container mx-auto max-w-2xl">
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
            <div className="flex space-x-2 mb-6">
              <Input 
                placeholder="Enter membership ID (e.g., OMA-123456)"
                value={membershipIdInput}
                onChange={(e) => setMembershipIdInput(e.target.value)}
              />
              <Button 
                onClick={handleVerify}
                disabled={!membershipIdInput}
                className="bg-oma-green hover:bg-oma-green/90 text-white whitespace-nowrap"
              >
                <Barcode className="h-4 w-4 mr-2" />
                Verify
              </Button>
            </div>
          )}
          
          {verificationResult && (
            <div className="mt-6 border-t pt-6">
              {verificationResult.verified ? (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-8 w-8 text-oma-green flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-oma-green">Verification Successful</h3>
                      <p className="text-sm text-gray-500">This membership ID is valid and registered in our system.</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-medium mb-3">Member Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                      <div>
                        <p className="text-gray-500">Name</p>
                        <p className="font-medium">
                          {verificationResult.member?.firstName} {verificationResult.member?.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Member ID</p>
                        <p className="font-medium">{verificationResult.member?.membershipId}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Join Date</p>
                        <p className="font-medium">
                          {verificationResult.member && formatDate(verificationResult.member.dateJoined)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Status</p>
                        <Badge className={getBadgeColor(verificationResult.member?.status)}>
                          {verificationResult.member?.status.charAt(0).toUpperCase()}{verificationResult.member?.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {!id && (
                    <div className="flex justify-end">
                      <Button
                        onClick={() => navigate(`/members/${verificationResult.member?.id}`)}
                        className="bg-oma-gold hover:bg-oma-gold/90 text-black"
                      >
                        View Full Profile
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <XCircle className="h-8 w-8 text-oma-red flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-oma-red">Verification Failed</h3>
                    <p className="text-sm text-gray-500">
                      The membership ID "{id || membershipIdInput}" is not valid or not registered in our system.
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
