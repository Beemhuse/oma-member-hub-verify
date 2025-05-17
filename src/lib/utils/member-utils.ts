
import { IMember, IMembers, Member, Members } from '@/types/member';

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
export const filterMembers = (members: Members[] | undefined, searchTerm: string): Members[] => {
  if (!members) return [];
  if (!searchTerm) return members;
  
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  
  return members.filter(member => 
    member.firstName?.toLowerCase()?.includes(lowerCaseSearchTerm) ||
    member.lastName?.toLowerCase()?.includes(lowerCaseSearchTerm) ||
    member.email?.toLowerCase()?.includes(lowerCaseSearchTerm) ||
    member._id?.toLowerCase()?.includes(lowerCaseSearchTerm)
  );
};

// Create a new member
export const createMember = (memberData: Omit<Member, 'id' | 'membershipId' | 'dateJoined'>): Member => {
  return {
    membershipId: generateMembershipId(),
    _createdAt: new Date().toISOString(),
    ...memberData
  };
};

type SortOption = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc' | 'role-asc' | 'role-desc';

export const sortMembers = (members: Members[], sortBy: SortOption): Members[] => {
  return [...members].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.firstName.localeCompare(b.firstName);
      case 'name-desc':
        return b.firstName.localeCompare(a.firstName);
      case 'date-asc':
        return new Date(a._createdAt).getTime() - new Date(b._createdAt).getTime();
      case 'date-desc':
        return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime();
      case 'role-asc':
        return (a.role || '').localeCompare(b.role || '');
      case 'role-desc':
        return (b.role || '').localeCompare(a.role || '');
      default:
        return 0;
    }
  });
};