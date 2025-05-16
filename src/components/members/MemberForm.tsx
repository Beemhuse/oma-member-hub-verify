import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useDropzone } from "react-dropzone";
import { ImagePlus, UploadCloud, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Member } from "@/types/member";
import { useApiMutation } from "@/hooks/useApi";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(6, { message: "Please enter a valid phone number" }),
  country: z.string().min(6, { message: "Please enter a country" }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),
  membershipStatus: z.enum(["Active", "Inactive", "Pending"]),
  dateOfBirth: z.string().optional(),
  role: z.string().optional(),
  occupation: z.string().optional(),
  emergencyContact: z.string().optional(),
  image: z.any().optional(), // For file upload
});
interface Country {
  name: string;
  Iso2: string;
  Iso3: string;
}
type FormValues = z.infer<typeof formSchema>;
interface MemberRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  membershipStatus: "Active" | "Inactive" | "Pending";
  dateOfBirth: string; // Optional field
  occupation: string; // Optional field
  emergencyContact: string; // Optional field
  image: string; // Optional field
}
interface MemberResponse {
  _id: string; // Assuming the API returns the member ID
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  membershipStatus: "Active" | "Inactive" | "Pending";
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

const MemberForm: React.FC<MemberFormProps> = ({
  defaultValues,
  isEditing = false,
  memberId,
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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
        title: isEditing
          ? "Member updated successfully"
          : "Member created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error.message ||
          (isEditing ? "Failed to update member" : "Failed to create member"),
        variant: "destructive",
      });
    },
  });
  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoadingCountries(true);
      try {
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/iso"
        );
        const data = await response.json();
        if (data.data && Array.isArray(data.data)) {
          setCountries(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch countries:", error);
        toast({
          title: "Error",
          description: "Failed to load countries list",
          variant: "destructive",
        });
      } finally {
        setIsLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);
  const onSubmit = (data: FormValues) => {
    // Transform data to match API expectations
    const apiData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      country: data.country,
      address: data.address,
      role: data.role,
      membershipStatus: data.membershipStatus,
      dateOfBirth: data.dateOfBirth || undefined,
      occupation: data.occupation || undefined,
      emergencyContact: data.emergencyContact || undefined,
      image: imageUrl,
    };
    if (isUploadingImage) {
      toast({
        title: "Image is still uploading",
      });
    } else {
      createOrUpdateMember(apiData);
    }
    navigate("/members")
    // console.log(apiData);
  };
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "",
      address: "",
      role: "",
      membershipStatus: "Active",
      dateOfBirth: "",
      occupation: "",
      emergencyContact: "",
    },
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);
        form.setValue("image", file);

        // Upload the image immediately
        setIsUploadingImage(true);
        try {
          const formData = new FormData();
          formData.append("image", file);

          const response = await fetch(
            "https://oma-backend-1.onrender.com/upload-image",
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error("Failed to upload image");
          }

          const data = await response.json();
          setImageUrl(data.asset._id);
          toast({
            title: "Success",
            description: "Image uploaded successfully",
          });
        } catch (error) {
          console.error("Error uploading image:", error);
          toast({
            title: "Error",
            description: "Failed to upload image",
            variant: "destructive",
          });
          setPreviewImage(null);
          form.setValue("image", undefined);
        } finally {
          setIsUploadingImage(false);
        }
      }
    },
    [form]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });
  const removeImage = () => {
    setPreviewImage(null);
    form.setValue("image", undefined);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Member" : "Add New Member"}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Update the member information in the form below."
            : "Enter the new member details in the form below."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image</FormLabel>
                    <div className="flex items-center gap-4">
                      {previewImage || defaultValues?.image ? (
                        <div className="relative">
                          <img
                            src={previewImage || defaultValues?.image}
                            alt="Profile preview"
                            className="h-24 w-24 rounded-full object-cover border"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div
                          {...getRootProps()}
                          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${
                            isDragActive
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-300"
                          }`}
                        >
                          <input {...getInputProps()} />
                          <div className="flex flex-col items-center justify-center gap-2">
                            <UploadCloud className="h-8 w-8 text-gray-500" />
                            <p className="text-sm text-gray-600">
                              {isDragActive
                                ? "Drop the image here"
                                : "Drag & drop an image here, or click to select"}
                            </p>
                            <p className="text-xs text-gray-500">
                              JPEG, PNG, WEBP (max 5MB)
                            </p>
                          </div>
                        </div>
                      )}
                      {isUploadingImage && "Uploading image"}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingCountries || isEditing}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoadingCountries
                                ? "Loading countries..."
                                : "Select country"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.Iso2} value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Main St, City, Country"
                        {...field}
                      />
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
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        {...field}
                        disabled={isEditing}
                      />
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="board_member">Board Member</SelectItem>
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
              <Button
                loading={isMutating}
                type="submit"
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
