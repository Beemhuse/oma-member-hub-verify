import React, { createContext, useContext, useState, useEffect } from 'react';
import { Member } from '@/types/member';
import { createMember } from '@/lib/utils/member-utils';
import { useToast } from '@/components/ui/use-toast';

// Sample initial data for development
const initialMembers: Member[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    address: '123 Main St, City, Country',
    membershipId: 'OMA-123456',
    dateJoined: '2023-01-15T00:00:00.000Z',
    status: 'active',
    occupation: 'Software Engineer',
    dob: '1985-06-12T00:00:00.000Z'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1987654321',
    address: '456 Oak Ave, Town, Country',
    membershipId: 'OMA-789012',
    dateJoined: '2023-02-20T00:00:00.000Z',
    status: 'active',
    occupation: 'Doctor',
    dob: '1990-03-25T00:00:00.000Z'
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.j@example.com',
    phone: '+1567890123',
    address: '789 Pine Rd, Village, Country',
    membershipId: 'OMA-345678',
    dateJoined: '2023-03-10T00:00:00.000Z',
    status: 'inactive',
    occupation: 'Teacher',
    dob: '1978-11-08T00:00:00.000Z'
  }
];

interface MemberContextType {
  members: Member[];
  addMember: (member: Omit<Member, 'id' | 'membershipId' | 'dateJoined'>) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  getMember: (id: string) => Member | undefined;
  getMemberByMembershipId: (membershipId: string) => Member | undefined;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const { toast } = useToast();
  
  // Initialize with sample data
  useEffect(() => {
    const storedMembers = localStorage.getItem('omaMembers');
    if (storedMembers) {
      setMembers(JSON.parse(storedMembers));
    } else {
      setMembers(initialMembers);
    }
  }, []);
  
  // Save to localStorage whenever members change
  useEffect(() => {
    if (members.length > 0) {
      localStorage.setItem('omaMembers', JSON.stringify(members));
    }
  }, [members]);
  
  const addMember = (memberData: Omit<Member, 'id' | 'membershipId' | 'dateJoined'>) => {
    const newMember = createMember(memberData);
    setMembers(prev => [...prev, newMember]);
    toast({
      title: "Member Added",
      description: `${newMember.firstName} ${newMember.lastName} has been successfully added.`,
    });
    return newMember;
  };
  
  const updateMember = (id: string, updatedData: Partial<Member>) => {
    setMembers(prev => 
      prev.map(member => 
        member.id === id ? { ...member, ...updatedData } : member
      )
    );
    toast({
      title: "Member Updated",
      description: "Member information has been successfully updated.",
    });
  };
  
  const deleteMember = (id: string) => {
    const memberToDelete = members.find(m => m.id === id);
    setMembers(prev => prev.filter(member => member.id !== id));
    if (memberToDelete) {
      toast({
        title: "Member Deleted",
        description: `${memberToDelete.firstName} ${memberToDelete.lastName} has been removed.`,
        variant: "destructive",
      });
    }
  };
  
  const getMember = (id: string) => {
    return members.find(member => member.id === id);
  };
  
  const getMemberByMembershipId = (membershipId: string) => {
    return members.find(member => member.membershipId === membershipId);
  };

  return (
    <MemberContext.Provider value={{ 
      members, 
      addMember, 
      updateMember, 
      deleteMember,
      getMember,
      getMemberByMembershipId
    }}>
      {children}
    </MemberContext.Provider>
  );
};

export const useMemberContext = () => {
  const context = useContext(MemberContext);
  if (context === undefined) {
    throw new Error('useMemberContext must be used within a MemberProvider');
  }
  return context;
};
