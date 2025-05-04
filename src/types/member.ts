
export interface Member {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  membershipId: string;
  _createdAt: string;
  membershipStatus: 'Active' | 'Inactive' | 'Pending';
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
  id: string; // Additional ID field
  transactionRef: string;
  name: string;
  email: string;
  amount: number;
  currency: "GHS" | string; // Assuming GHS is primary but could accept others
  method: "paystack" | string; // Primary payment method but extensible
  donationPurpose: string;
  status: "pending" | "completed" | "failed" | "refunded"; // Common status values
  transactionDate: string; // ISO date string
  type: "donation" | string; // Primary type but extensible
}
