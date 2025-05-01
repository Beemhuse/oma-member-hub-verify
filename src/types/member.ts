
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
  role?: 'member' | 'admin' | 'staff' | 'executive';
}

export interface Transaction {
  id: string;
  memberId: string;
  amount: number;
  description: string;
  date: string;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'other';
  status: 'completed' | 'pending' | 'cancelled';
  type: 'membership_fee' | 'id_card' | 'donation' | 'event_fee' | 'other';
}
