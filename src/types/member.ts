
export interface Member {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  membershipId: string;
  _createdAt: string;
  membershipStatus: 'Active' | 'Inactive' | 'Pending';
  dateOfBirth?: string;
  dateJoined?: string;
  occupation?: string;
  emergencyContact?: string;
  image: null;
  role?: 'member' | 'admin' | 'staff' | 'executive';
}
export interface IMember {
  _id: string;
  firstName: string;
  card: ICard;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  membershipId: string;
  _createdAt: string;
  membershipStatus: 'Active' | 'Inactive' | 'Pending';
  image?: string;
  dateOfBirth?: string;
  dateJoined?: string;
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
  qrCodeUrl: string;
  isActive: boolean
}
export interface MemberDetails {
  member: Member,
  card: ICard,
}
export interface MemberCard {
  _id: string;
  cardId: string;
  qrCodeUrl: string;
  issueDate: string;
  expiryDate: string;
  isActive: boolean;
}

export interface Members {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  image: string;
  country: string;
  occupation: string;
  emergencyContact: string;
  dateOfBirth: string;
  dateJoined: string;
  membershipStatus: 'Active' | 'Inactive' | 'Suspended' | string; // You can tighten this enum if needed
  card: MemberCard;
  role: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  _type: 'member';
}
export interface IMembers {
  members: Members
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
  status: "pending" | "success" | "failed" | "refunded"; // Common status values
  transactionDate: string; // ISO date string
  type: "donation" | string; // Primary type but extensible
  _createdAt: string;
  _updatedAt: string;
}
