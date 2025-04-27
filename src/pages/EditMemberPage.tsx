
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import MemberForm from '@/components/members/MemberForm';
import { useMemberContext } from '@/contexts/MemberContext';

const EditMemberPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getMember } = useMemberContext();
  
  const member = id ? getMember(id) : undefined;
  
  if (!member) {
    return <Navigate to="/not-found" />;
  }
  
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Edit Member</h1>
      <MemberForm 
        defaultValues={member} 
        isEditing={true} 
        memberId={id} 
      />
    </div>
  );
};

export default EditMemberPage;
