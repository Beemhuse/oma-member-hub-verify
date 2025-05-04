
import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils/member-utils';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, AlertCircle, Pencil } from 'lucide-react';
import MembershipCard from '@/components/members/MembershipCard';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApiMutation, useApiQuery } from '@/hooks/useApi';
import { ICard, Member, MemberDetails } from '@/types/member';
import { toast } from '@/hooks/use-toast';

const getBadgeColor = (status: string) => {
  switch(status) {
    case 'active':
      return 'bg-oma-green text-white';
    case 'inactive':
      return 'bg-gray-400 text-white';
    case 'pending':
      return 'bg-yellow-500 text-white';
    default:
      return 'bg-gray-400';
  }
};
const MemberDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // const { getMember, deleteMember } = useMemberContext();
  const navigate = useNavigate();
  const { data, isLoading } = useApiQuery<MemberDetails>({
    url: `/api/members/${id}`,
  });
console.log(data)

  const { mutate: generateId, isMutating } = useApiMutation({
  method: "POST",
  url: `/api/members/${id}/generate-card`,
  onSuccess: (data) => {
    console.log(data)
    toast({
      title: "Successful",
      description: "Id generated!",
    });
    // navigate("/dashboard");
  },
  onError: (error) => {
    toast({
      title: "Failed",
      description: "Retry",
      variant: "destructive",
    });
  },
});
  const { mutate: deleteMember, isMutating: isDeleting } = useApiMutation({
  method: "DELETE",
  url: `/api/members/${id}/`,
  onSuccess: (data) => {
    console.log(data)
    toast({
      title: "Successful",
      description: "User Deleted!",
    });
    // navigate("/dashboard");
  },
  onError: (error) => {
    toast({
      title: "Failed",
      description: "Retry",
      variant: "destructive",
    });
  },
});
  // const member = data.member
  console.log(data?.member)
  // if (!member) {
  //   return <Navigate to="/not-found" />;
  // }
  // if (isLoading) {
  //   return  null
  // }
 
  
  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {data?.member.firstName} {data?.member.lastName}
          </h1>
          <p className="text-gray-500">Member ID: {data?.member.membershipId}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={() => navigate('/')}
          >
            Back to List
          </Button>
          <Button 
            className="bg-oma-gold hover:bg-oma-gold/90 text-black"
            onClick={() => navigate(`/members/${id}/edit`)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
               className="bg-oma-red hover:bg-oma-red/90 text-white">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the member 
                  <strong> {data?.member.firstName} {data?.member.lastName}</strong> and remove their data from the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                // onClick={handleDelete}
                onClick={() => {
                  deleteMember()
                }}
                 className="bg-oma-red hover:bg-oma-red/90 text-white">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <Tabs defaultValue="details">
        <TabsList className="mb-6">
          <TabsTrigger value="details">Member Details</TabsTrigger>
          <TabsTrigger value="idcard">ID Card</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  <Badge className={getBadgeColor(data?.member.membershipStatus)}>
                    {/* {data?.member.status?.charAt(0)?.toUpperCase() + data?.member?.status?.slice(1)} */}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                  <div className="flex items-start gap-2">
                    <User className="mt-1 h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{data?.member.firstName} {data?.member.lastName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Mail className="mt-1 h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{data?.member.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Phone className="mt-1 h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{data?.member.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-1 h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{data?.member.address}</p>
                    </div>
                  </div>
                  
                  {data?.member.dateOfBirth && (
                    <div className="flex items-start gap-2">
                      <Calendar className="mt-1 h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Date of Birth</p>
                        <p className="font-medium">{formatDate(data?.member.dateOfBirth)}</p>
                      </div>
                    </div>
                  )}
                  
                  {data?.member.occupation && (
                    <div className="flex items-start gap-2">
                      <Briefcase className="mt-1 h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Occupation</p>
                        <p className="font-medium">{data?.member.occupation}</p>
                      </div>
                    </div>
                  )}
                  
                  {data?.member.emergencyContact && (
                    <div className="flex items-start gap-2">
                      <AlertCircle className="mt-1 h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Emergency Contact</p>
                        <p className="font-medium">{data?.member.emergencyContact}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Membership Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-500">Membership ID</p>
                    <p className="font-medium">{data?.member.membershipId}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Date Joined</p>
                    <p className="font-medium">{formatDate(data?.member._createdAt)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge className={getBadgeColor(data?.member.membershipStatus)}>
                      {data?.member.membershipStatus}
                      {/* {data?.member.status.charAt(0).toUpperCase() + data?.member.status.slice(1)} */}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="idcard">
        <div className="max-w-lg mx-auto flex flex-col items-center gap-6">
    <div className="w-full flex justify-center">
      <Button 
        className="bg-oma-blue hover:bg-oma-blue/90 text-black"
        onClick={() => {
          generateId()
        }}
      >
        Generate ID Card
      </Button>
    </div>
    <MembershipCard member={data?.member} card={data?.card} />
  </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MemberDetailPage;
