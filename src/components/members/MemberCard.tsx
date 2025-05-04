
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Member } from '@/types/member';
import { formatDate } from '@/lib/utils/member-utils';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

interface MemberCardProps {
  member: Member;
}

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  const navigate = useNavigate();
  const getBadgeColor = (status: Member['membershipStatus']) => {
    switch(status) {
      case 'Active':
        return 'bg-oma-green text-white hover:bg-oma-green/90';
      case 'Inactive':
        return 'bg-gray-400 text-white hover:bg-gray-500';
      case 'Pending':
        return 'bg-yellow-500 text-white hover:bg-yellow-600';
      default:
        return 'bg-gray-400';
    }
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md animate-fade-in">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-oma-gold/20 flex items-center justify-center">
                {member.photo ? (
                  <img 
                    src={member.photo} 
                    alt={`${member.firstName} ${member.lastName}`} 
                    className="h-10 w-10 rounded-full object-cover" 
                  />
                ) : (
                  <User className="h-5 w-5 text-oma-gold" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {member.firstName} {member.lastName}
                </h3>
                <p className="text-sm text-gray-500">{member.email}</p>
              </div>
            </div>
            <Badge className={getBadgeColor(member.membershipStatus)}>
              {member.membershipStatus?.charAt(0).toUpperCase() + member?.membershipStatus?.slice(1)}
            </Badge>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Membership ID:</span>
              <span className="text-gray-700 font-medium">{member.membershipId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Joined:</span>
              <span className="text-gray-700">{formatDate(member._createdAt)}</span>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button 
              variant="ghost" 
              className="text-oma-gold hover:text-oma-gold hover:bg-oma-gold/10"
              onClick={() => navigate(`/members/${member._id}`)}
            >
              View Detail
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberCard;
