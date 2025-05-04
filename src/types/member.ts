
export interface Member {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  membershipId: string;
  _createdAt: string;
  membershipStatus: 'active' | 'inactive' | 'pending';
  photo?: string;
  dateOfBirth?: string;
  occupation?: string;
  emergencyContact?: string;
  role?: 'member' | 'admin' | 'staff' | 'executive';
  qrCode: string;
}
export interface ICard {
  _id: string,
  cardId: string,
  fullName: string,
  email: string,
  membershipStatus: boolean;
  qrCodeUrl: string
}
export interface MemberDetails {
  member: Member,
  card: ICard,
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
