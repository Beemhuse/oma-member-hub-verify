
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Member } from '@/types/member';
import { formatDate } from '@/lib/utils/member-utils';
import { User, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

interface MembershipCardProps {
  member: Member;
}

const MembershipCard: React.FC<MembershipCardProps> = ({ member }) => {
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>('');
  
  React.useEffect(() => {
    const generateQR = async () => {
      try {
        const verifyUrl = `${window.location.origin}/verify/${member.membershipId}`;
        const qrDataUrl = await QRCode.toDataURL(verifyUrl);
        setQrCodeUrl(qrDataUrl);
      } catch (err) {
        console.error("Error generating QR code:", err);
      }
    };
    generateQR();
  }, [member.membershipId]);
  
  const printCard = () => {
    const printContent = document.getElementById('membership-card');
    const windowUrl = 'about:blank';
    const uniqueName = new Date().getTime();
    const windowName = 'Print' + uniqueName;
    const printWindow = window.open(windowUrl, windowName, 'left=200,top=200,width=500,height=350');
    
    if (printWindow) {
      printWindow.document.write('<html><head><title>Print Membership Card</title>');
      printWindow.document.write('<style>');
      printWindow.document.write(`
        @media print {
          body { margin: 0; padding: 0; }
          .card {
            width: 3.375in;
            height: 2.125in;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 15px;
            font-family: Arial, sans-serif;
            position: relative;
            background: white;
          }
          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #D4AF37;
            padding-bottom: 8px;
            margin-bottom: 10px;
          }
          .org-name {
            font-size: 18px;
            font-weight: bold;
            color: #000;
          }
          .card-title {
            font-size: 12px;
            color: #666;
          }
          .card-body {
            display: flex;
            gap: 15px;
          }
          .member-photo {
            width: 75px;
            height: 75px;
            border-radius: 5px;
            background-color: #eee;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .member-details {
            flex: 1;
          }
          .member-name {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 5px;
          }
          .member-id {
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
          }
          .member-validity {
            font-size: 11px;
            color: #666;
          }
          .qr-container {
            margin-top: 10px;
            text-align: center;
          }
          .qr-container img {
            width: 80px;
            height: 80px;
          }
          .verify-text {
            font-size: 9px;
            text-align: center;
            margin-top: 5px;
            color: #666;
          }
        }
      `);
      printWindow.document.write('</style></head><body>');
      
      if (printContent) {
        printWindow.document.write('<div class="card">');
        printWindow.document.write('<div class="card-header">');
        printWindow.document.write('<div class="org-name">OMA</div>');
        printWindow.document.write('<div class="card-title">MEMBERSHIP CARD</div>');
        printWindow.document.write('</div>');
        
        printWindow.document.write('<div class="card-body">');
        printWindow.document.write('<div class="member-photo">');
        if (member.photo) {
          printWindow.document.write(`<img src="${member.photo}" alt="Member" width="75" height="75" style="border-radius: 5px; object-fit: cover;" />`);
        } else {
          printWindow.document.write('No Photo');
        }
        printWindow.document.write('</div>');
        
        printWindow.document.write('<div class="member-details">');
        printWindow.document.write(`<div class="member-name">${member.firstName} ${member.lastName}</div>`);
        printWindow.document.write(`<div class="member-id">ID: ${member.membershipId}</div>`);
        printWindow.document.write(`<div class="member-validity">Member since: ${formatDate(member.dateJoined)}</div>`);
        printWindow.document.write('</div>');
        printWindow.document.write('</div>');
        
        printWindow.document.write('<div class="qr-container">');
        if (qrCodeUrl) {
          printWindow.document.write(`<img src="${qrCodeUrl}" alt="QR Code" />`);
        }
        printWindow.document.write('</div>');
        
        const verifyUrl = `${window.location.origin}/verify/${member.membershipId}`;
        printWindow.document.write(`<div class="verify-text">Scan QR code to verify or visit: ${verifyUrl}</div>`);
        
        printWindow.document.write('</div>');
      }
      
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };
  
  return (
    <Card className="shadow-md" id="membership-card">
      <CardContent className="p-6">
        <div className="mb-4 flex justify-between items-center border-b-2 border-oma-gold pb-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">OMA</h2>
            <p className="text-sm text-gray-600">MEMBERSHIP CARD</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="w-24 h-24 rounded-md bg-gray-100 flex items-center justify-center">
            {member.photo ? (
              <img 
                src={member.photo} 
                alt={`${member.firstName} ${member.lastName}`}
                className="w-full h-full object-cover rounded-md" 
              />
            ) : (
              <User size={32} className="text-gray-400" />
            )}
          </div>
          
          <div>
            <h3 className="font-bold text-lg">{member.firstName} {member.lastName}</h3>
            <p className="text-gray-600 text-sm">ID: {member.membershipId}</p>
            <p className="text-gray-500 text-xs mt-1">Member since: {formatDate(member.dateJoined)}</p>
          </div>
        </div>
        
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
              Scan to verify or visit: {window.location.origin}/verify/{member.membershipId}
            </p>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={printCard} 
            className="bg-oma-red hover:bg-oma-red/90 text-white"
          >
            Print ID Card
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipCard;
