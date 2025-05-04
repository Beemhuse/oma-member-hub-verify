import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApiQuery, useApiMutation } from '@/hooks/useApi';
import { toast } from '@/hooks/use-toast';
import MemberForm from '@/components/members/MemberForm';
import { Member, MemberDetails } from '@/types/member';

const EditMemberPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Fetch member data
  const { data, isLoading, error } = useApiQuery<MemberDetails>({
    url: `/api/members/${id}`,
  });
  // console.log(member)
const member = data?.member
  // Update member mutation
  const { mutate: updateMember, isMutating } = useApiMutation<Member, Partial<Member>>({
    method: "PATCH",
    url: `/api/members/${id}`,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Member updated successfully",
      });
      navigate(`/members/${id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update member",
        variant: "destructive",
      });
    },
  });

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error.message || 'Failed to load member data'}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3" 
            onClick={() => window.location.reload()}
          >
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Warning!</strong>
          <span className="block sm:inline"> Member not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <MemberForm 
        defaultValues={{
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
          phone: member.phone,
          address: member.address,
          membershipStatus: member.membershipStatus,
          dateOfBirth: member.dateOfBirth,
          occupation: member.occupation,
          emergencyContact: member.emergencyContact,
          role: member.role,
        }}
        isEditing={true}
        memberId={id}
      />
    </div>
  );
};

export default EditMemberPage;