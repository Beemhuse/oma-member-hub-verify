
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Member } from '@/types/member';
import { MembershipCardHeader } from './membership-card/MembershipCardHeader';
import { MemberPhoto } from './membership-card/MemberPhoto';
import { MemberInfo } from './membership-card/MemberInfo';
import { MembershipQRCode } from './membership-card/MembershipQRCode';
import { PrintButton } from './membership-card/PrintButton';

interface MembershipCardProps {
  member: Member;
}

const MembershipCard: React.FC<MembershipCardProps> = ({ member }) => {
  return (
    <Card className="shadow-md" id="membership-card">
      <CardContent className="p-6">
        <MembershipCardHeader />
        
        <div className="flex gap-4">
          <MemberPhoto 
            photo={member.photo}
            firstName={member.firstName}
            lastName={member.lastName}
          />
          <MemberInfo 
            firstName={member.firstName}
            lastName={member.lastName}
            membershipId={member.membershipId}
            dateJoined={member.dateJoined}
          />
        </div>
        
        <MembershipQRCode membershipId={member.membershipId} />
        <PrintButton member={member} qrCodeUrl="" />
      </CardContent>
    </Card>
  );
};

export default MembershipCard;
