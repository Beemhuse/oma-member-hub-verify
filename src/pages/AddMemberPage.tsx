
import React from 'react';
import MemberForm from '@/components/members/MemberForm';

const AddMemberPage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Add New Member</h1>
      <MemberForm />
    </div>
  );
};

export default AddMemberPage;
