import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useApiMutation } from "@/hooks/useApi";
import { Member } from "@/types/member";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import MemberImageUpload from "./MemberImageUpload";
import MemberBasicInfo from "./MemberBasicInfo";
import MemberContactInfo from "./MemberContactInfoPage";
import MemberAdditionalInfo from "./MemberAdditionalInfo";
import MemberStatusFields from "./MemberStatusFields";

// More relaxed schema for editing
const createSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(6, "Please enter a valid phone number"),
  country: z.string().min(1, "Please select a country"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  membershipStatus: z.enum(["Active", "Inactive", "Pending"]),
  dateOfBirth: z.string().optional(),
  dateJoined: z.string().optional(),
  role: z.string().optional(),
  occupation: z.string().optional(),
  emergencyContact: z.string().optional(),
  image: z.any().optional(),
});

const editSchema = createSchema.partial().extend({
  email: z.string().email("Please enter a valid email address").optional(),
  phone: z.string().min(6, "Please enter a valid phone number").optional(),
});

interface MemberFormProps {
  defaultValues?: Partial<Member>;
  isEditing?: boolean;
  memberId?: string;
}

const MemberForm: React.FC<MemberFormProps> = ({
  defaultValues,
  isEditing = false,
  memberId,
}) => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const form = useForm({
    resolver: zodResolver(isEditing ? editSchema : createSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "",
      address: "",
      membershipStatus: "Active",
      ...defaultValues,
    },
  });

  const { mutate: createOrUpdateMember, isMutating } = useApiMutation({
    method: isEditing ? "PATCH" : "POST",
    url: isEditing ? `/api/members/${memberId}` : "/api/members",
    onSuccess: () => {
      toast({
        title: isEditing ? "Member updated" : "Member created",
      });
      navigate("/members");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    if (isUploadingImage) {
      toast({
        title: "Please wait for image to finish uploading",
      });
      return;
    }

    const payload = {
      ...data,
      image: imageUrl || defaultValues?.image,
    };
    createOrUpdateMember(payload);
  };
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-xl font-semibold">
          {isEditing ? "Edit Member" : "Add New Member"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isEditing ? "Update member details" : "Enter new member information"}
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <MemberImageUpload
              control={form.control}
              defaultImage={defaultValues?.image}
              onImageUploaded={setImageUrl}
              onUploadStatusChange={setIsUploadingImage}
              isEditing={isEditing}
            />

            <MemberBasicInfo control={form.control} isEditing={isEditing} />

            <MemberContactInfo control={form.control} isEditing={isEditing} />

            <MemberAdditionalInfo control={form.control} />

            <MemberStatusFields control={form.control} />

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isMutating}
                disabled={isUploadingImage}
                className="bg-oma-green hover:bg-oma-green/90"
              >
                {isEditing ? "Update Member" : "Add Member"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MemberForm;
