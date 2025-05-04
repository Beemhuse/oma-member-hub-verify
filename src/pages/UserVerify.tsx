import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, CheckCircle2, XCircle, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApiQuery } from '@/hooks/useApi';
// import { formatDate } from '@/lib/utils';

const UserVerifyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cardId, setCardId] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('pending');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    setCardId(id);
  }, [location]);

  const { data: cardData, isLoading, error } = useApiQuery({
    url: `/api/cards/${cardId}/verify`,
  });

  const getStatusBadge = (status) => {
    const isActive = cardData?.isActive && new Date(cardData?.expiryDate) > new Date();
    return isActive ? (
      <Badge className="bg-green-500 text-white">
        <CheckCircle2 className="mr-1 h-3 w-3" />
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-500 text-white">
        <XCircle className="mr-1 h-3 w-3" />
        {new Date(cardData?.expiryDate) < new Date() ? 'Expired' : 'Inactive'}
      </Badge>
    );
  };

  if (!cardId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Verification Failed</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
            <p>No card ID provided in the QR code.</p>
            <Button onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Verification Failed</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
            <p>{error?.message || 'Card verification failed.'}</p>
            <Button onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <CardTitle>OMA Card Verification</CardTitle>
          {getStatusBadge()}
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center">
            {cardData?.qrCodeUrl && (
              <img 
                src={cardData.qrCodeUrl} 
                alt="Card QR Code"
                className="w-32 h-32 mb-4 border rounded-lg"
              />
            )}
            <div className="text-center">
              <p className="text-sm text-gray-500">Card Number</p>
              <p className="text-xl font-mono font-bold">{cardData?.cardId}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CreditCard className="mt-1 h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Card Type</p>
                <p className="font-medium">OMA Membership Card</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="mt-1 h-4 w-4 text-gray-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Validity</p>
                <div className="flex justify-between">
                  <p className="font-medium">
                    {formatDate(cardData?.issueDate)}
                  </p>
                  <span className="mx-2">to</span>
                  <p className="font-medium">
                    {formatDate(cardData?.expiryDate)}
                  </p>
                </div>
              </div>
            </div>

            {cardData?.member && (
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 mb-2">Card Holder</p>
                <div className="flex items-center gap-3">
                  {cardData.member.image && (
                    <img 
                      src={cardData.member.image} 
                      alt={cardData.member.name}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium">
                      {cardData.member.firstName} {cardData.member.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {cardData.member.membershipId}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {verificationStatus === 'success' && (
            <div className="flex flex-col items-center pt-4">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
              <p className="text-green-600 font-medium">
                Card Verified Successfully
              </p>
            </div>
          )}

          <Button 
            className="w-full mt-6"
            onClick={() => navigate('/')}
          >
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserVerifyPage;