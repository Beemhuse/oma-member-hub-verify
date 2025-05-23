import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/member-utils";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  AlertCircle,
  Pencil,
} from "lucide-react";
import MembershipCard from "@/components/members/MembershipCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiMutation, useApiQuery } from "@/hooks/useApi";
import { MemberDetails } from "@/types/member";
import { toast } from "@/hooks/use-toast";
import LoadingPage from "@/components/Loading";
interface SignatureUploadResponse {
  signatureId: string;
  signatureUrl: string;
}
const getBadgeStatusColor = (isActive: boolean | undefined) => {
  if (isActive === undefined) return ""; // handle undefined case

  return isActive
    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
};
const getBadgeColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-oma-green text-white";
    case "Inactive":
      return "bg-gray-400 text-white";
    case "Pending":
      return "bg-yellow-500 text-white";
    default:
      return "bg-gray-400";
  }
};
const MemberDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // const { getMember, deleteMember } = useMemberContext();
  const navigate = useNavigate();
  const { data, isLoading, mutate } = useApiQuery<MemberDetails>({
    url: `/api/members/${id}`,
    shouldFetch: !!id,
  });
  const { data: signature } = useApiQuery<SignatureUploadResponse>({
    url: `/signature`,
  });

  const { mutate: generateId, isMutating } = useApiMutation({
    method: "POST",
    url: `/api/members/${id}/generate-card`,
    onSuccess: (data) => {
      toast({
        title: "Successful",
        description: "Id generated!",
      });
      mutate();
      navigate(".", { replace: true, state: { key: Date.now() } });
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
      toast({
        title: "Successful",
        description: "User Deleted!",
      });
      mutate();
      navigate("/members");
    },
    onError: (error) => {
      toast({
        title: "Failed",
        description: "Retry",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {data?.member?.firstName} {data?.member?.lastName}
          </h1>
          <p className="text-gray-500">
            Member ID: {data?.card?.cardId ?? "Not Available"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/members")}>
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
              <Button className="bg-oma-red hover:bg-oma-red/90 text-white">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  member
                  <strong>
                    {" "}
                    {data?.member.firstName} {data?.member.lastName}
                  </strong>{" "}
                  and remove their data from the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  // onClick={handleDelete}
                  onClick={() => {
                    deleteMember();
                  }}
                  className="bg-oma-red hover:bg-oma-red/90 text-white"
                >
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
                  <Badge
                    className={getBadgeColor(data?.member.membershipStatus)}
                  >
                    {data?.member.membershipStatus?.charAt(0)?.toUpperCase() +
                      data?.member?.membershipStatus?.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                  <div className="flex items-start gap-2">
                    <User className="mt-1 h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">
                        {data?.member?.firstName} {data?.member?.lastName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Mail className="mt-1 h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{data?.member?.email}</p>
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
                        <p className="font-medium">
                          {formatDate(data?.member.dateOfBirth)}
                        </p>
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
                        <p className="text-sm text-gray-500">
                          Emergency Contact
                        </p>
                        <p className="font-medium">
                          {data?.member.emergencyContact}
                        </p>
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
              <CardContent className="flex justify-between">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-500">Membership ID</p>
                    <p className="font-medium">
                      {data?.card?.cardId ?? "Not Available"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Date Joined</p>
                    <p className="font-medium">
                      {formatDate(data?.member._createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge
                      className={getBadgeColor(data?.member.membershipStatus)}
                    >
                      {data?.member.membershipStatus}
                      {/* {data?.member.status.charAt(0).toUpperCase() + data?.member.status.slice(1)} */}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-500">Membership Role</p>
                  
                    <span className="capitalize">{data?.member?.role}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Id Status</p>
                    <Badge
                      className={getBadgeStatusColor(data?.card?.isActive)}
                    >
                      {data?.card?.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="idcard">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
            {data?.card ? (
              <>
                <MembershipCard
                  member={data?.member}
                  mutate={mutate}
                  card={data?.card}
                  signature={signature?.signatureUrl}
                />
              </>
            ) : (
              <div className="text-center">
                <p className="text-lg font-semibold">No ID Card Generated</p>
                <p className="text-gray-500">
                  Click the button below to generate an ID card.
                </p>
                <div className="w-full mt-4 flex justify-center ">
                  <Button
                    loading={isMutating}
                    className="bg-oma-gold hover:bg-oma-blue/90 text-black"
                    onClick={() => {
                      generateId();
                    }}
                  >
                    Generate ID Card
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MemberDetailPage;
