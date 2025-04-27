
import React from 'react';
import { User } from 'lucide-react';

interface MemberPhotoProps {
  photo?: string;
  firstName: string;
  lastName: string;
}

export const MemberPhoto: React.FC<MemberPhotoProps> = ({ photo, firstName, lastName }) => {
  return (
    <div className="w-24 h-24 rounded-md bg-gray-100 flex items-center justify-center">
      {photo ? (
        <img 
          src={photo} 
          alt={`${firstName} ${lastName}`}
          className="w-full h-full object-cover rounded-md" 
        />
      ) : (
        <User size={32} className="text-gray-400" />
      )}
    </div>
  );
};
