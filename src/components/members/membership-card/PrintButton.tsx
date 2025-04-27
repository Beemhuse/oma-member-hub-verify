import React from 'react';
import { Button } from '@/components/ui/button';
import { Member } from '@/types/member';
import { formatDate } from '@/lib/utils/member-utils';

interface PrintButtonProps {
  member: Member;
  qrCodeUrl: string;
}

export const PrintButton: React.FC<PrintButtonProps> = ({ member, qrCodeUrl }) => {
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
      
      // Print card content
      printWindow.document.write('<div class="card">');
      printWindow.document.write(`
        <div class="card-header">
          <div class="org-name">OMA</div>
          <div class="card-title">MEMBERSHIP CARD</div>
        </div>
        <div class="card-body">
          <div class="member-photo">
            ${member.photo 
              ? `<img src="${member.photo}" alt="Member" width="75" height="75" style="border-radius: 5px; object-fit: cover;" />`
              : 'No Photo'
            }
          </div>
          <div class="member-details">
            <div class="member-name">${member.firstName} ${member.lastName}</div>
            <div class="member-id">ID: ${member.membershipId}</div>
            <div class="member-validity">Member since: ${formatDate(member.dateJoined)}</div>
          </div>
        </div>
        <div class="qr-container">
          ${qrCodeUrl ? `<img src="${qrCodeUrl}" alt="QR Code" />` : ''}
        </div>
        <div class="verify-text">
          Scan QR code to verify or visit: ${window.location.origin}/verify/${member.membershipId}
        </div>
      `);
      printWindow.document.write('</div></body></html>');
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  return (
    <div className="mt-6 flex justify-end">
      <Button 
        onClick={printCard}
        className="bg-oma-red hover:bg-oma-red/90 text-white"
      >
        Print ID Card
      </Button>
    </div>
  );
};
