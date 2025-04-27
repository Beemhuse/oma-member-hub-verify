
import React from 'react';
import { formatDate } from '@/lib/utils/member-utils';

interface MemberInfoProps {
  firstName: string;
  lastName: string;
  membershipId: string;
  dateJoined: string;
}

export const MemberInfo: React.FC<MemberInfoProps> = ({
  firstName,
  lastName,
  membershipId,
  dateJoined,
}) => {
  return (
    <div>
      <h3 className="font-bold text-lg">{firstName} {lastName}</h3>
      <p className="text-gray-600 text-sm">ID: {membershipId}</p>
      <p className="text-gray-500 text-xs mt-1">Member since: {formatDate(dateJoined)}</p>
    </div>
  );
};
