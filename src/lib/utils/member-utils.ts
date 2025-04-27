
import { Member } from '@/types/member';
import { v4 as uuidv4 } from 'uuid';

// Generate a unique membership ID with format OMA-XXXXXX
export const generateMembershipId = (): string => {
  const randomDigits = Math.floor(100000 + Math.random() * 900000).toString();
  return `OMA-${randomDigits}`;
};

// Format date to DD/MM/YYYY
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

// Filter members based on search term
export const filterMembers = (members: Member[], searchTerm: string): Member[] => {
  if (!searchTerm) return members;
  
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  
  return members.filter(member => 
    member.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
    member.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
    member.email.toLowerCase().includes(lowerCaseSearchTerm) ||
    member.membershipId.toLowerCase().includes(lowerCaseSearchTerm)
  );
};

// Create a new member
export const createMember = (memberData: Omit<Member, 'id' | 'membershipId' | 'dateJoined'>): Member => {
  return {
    id: uuidv4(),
    membershipId: generateMembershipId(),
    dateJoined: new Date().toISOString(),
    ...memberData
  };
};
