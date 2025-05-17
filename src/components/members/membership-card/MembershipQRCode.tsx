
import React, { useEffect, useState } from 'react';
import { QrCode } from 'lucide-react';
import QRCode from 'qrcode';

interface MembershipQRCodeProps {
  membershipId: string;
  qrCodeUrl: string;
}

export const MembershipQRCode: React.FC<MembershipQRCodeProps> = ({ membershipId, qrCodeUrl }) => {

  return (
    <div className="mt-6 border-t border-gray-200 pt-4">
      <div className="mx-auto w-full flex flex-col items-center">
        {qrCodeUrl ? (
          <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32" />
        ) : (
          <div className="w-32 h-32 bg-gray-100 flex items-center justify-center">
            <QrCode className="text-gray-400" size={48} />
          </div>
        )}
        <p className="text-xs text-gray-500 text-center mt-2">
          Scan to verify or visit: {window.location.origin}/verify/{membershipId}
        </p>
      </div>
    </div>
  );
};
