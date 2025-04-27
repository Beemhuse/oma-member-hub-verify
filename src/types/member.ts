
export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  membershipId: string;
  dateJoined: string;
  status: 'active' | 'inactive' | 'pending';
  photo?: string;
  dob?: string;
  occupation?: string;
  emergencyContact?: string;
}
