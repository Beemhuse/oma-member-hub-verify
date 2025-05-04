
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMemberContext } from '@/contexts/MemberContext';
import { useNavigate } from 'react-router-dom';
import { Member } from '@/types/member';
import { useApiMutation } from '@/hooks/useApi';
import { toast } from '@/hooks/use-toast';

// Schema for form validation
const formSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(6, { message: 'Please enter a valid phone number' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters' }),
  membershipStatus: z.enum(['Active', 'Inactive', 'Pending']),
  dateOfBirth: z.string().optional(),
  role: z.string().optional(),
  occupation: z.string().optional(),
  emergencyContact: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
interface MemberRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  membershipStatus: 'Active' | 'Inactive' | 'Pending';
  dateOfBirth: string; // Optional field
  occupation: string; // Optional field
  emergencyContact: string; // Optional field
}
interface MemberResponse {
  _id: string; // Assuming the API returns the member ID
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  membershipStatus: 'Active' | 'Inactive' | 'Pending';
  dateOfBirth?: string;
  occupation?: string;
  emergencyContact?: string;
  token: string; // As shown in your onSuccess handler
  // Any other fields the API might return
  _createdAt?: string;
  _updatedAt?: string;
}
interface MemberFormProps {
  defaultValues?: Partial<Member>;
  isEditing?: boolean;
  memberId?: string;
}

const MemberForm: React.FC<MemberFormProps> = ({ defaultValues, isEditing = false, memberId }) => {
  // const { addMember, updateMember } = useMemberContext();
  const navigate = useNavigate();
 // Create or update mutation
 const { mutate: createOrUpdateMember, isMutating } = useApiMutation<
 MemberResponse,
 MemberRequest
>({
 method: isEditing ? "PATCH" : "POST",
 url: isEditing ? `/api/members/${memberId}` : "/api/members",
 onSuccess: (data) => {
   toast({
     title: isEditing ? "Member updated successfully" : "Member created successfully",
   });
 },
 onError: (error) => {
   toast({
     title: "Error",
     description: error.message || (isEditing ? "Failed to update member" : "Failed to create member"),
     variant: "destructive",
   });
 },
});

const onSubmit = (data: FormValues) => {
  // Transform data to match API expectations
  const apiData = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    address: data.address,
    role: data.role,
    membershipStatus: data.membershipStatus,
    dateOfBirth: data.dateOfBirth || undefined,
    occupation: data.occupation || undefined,
    emergencyContact: data.emergencyContact || undefined,
  };
  createOrUpdateMember(apiData);
};
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      role: '',
      membershipStatus: 'Active',
      dateOfBirth: '',
      occupation: '',
      emergencyContact: '',
    },
  });
  
 
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Member' : 'Add New Member'}</CardTitle>
        <CardDescription>
          {isEditing 
            ? 'Update the member information in the form below.'
            : 'Enter the new member details in the form below.'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St, City, Country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <Input placeholder="Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="emergencyContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="Name: +1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="membershipStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Membership Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The current status of this member's account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Membership Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The current role of this member's account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button  type="submit" className="bg-oma-green hover:bg-oma-green/90">
                {isEditing ? 'Update Member' : 'Add Member'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MemberForm;
