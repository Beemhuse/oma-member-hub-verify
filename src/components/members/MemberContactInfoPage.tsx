import React from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MemberContactInfoProps {
  control: any;
  isEditing: boolean;
}

const MemberContactInfo: React.FC<MemberContactInfoProps> = ({
  control,
  isEditing,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Contact Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                placeholder="john.doe@example.com"
                {...field}
                disabled={isEditing}
              />
              {fieldState.error && (
                <p className="text-sm text-red-500 mt-1">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input placeholder="+1234567890" {...field} />
              {fieldState.error && (
                <p className="text-sm text-red-500 mt-1">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          name="country"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              {isEditing ? (
                <Input {...field} disabled />
              ) : (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {fieldState.error && (
                <p className="text-sm text-red-500 mt-1">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          name="address"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <Input placeholder="123 Main St" {...field} />
              {fieldState.error && (
                <p className="text-sm text-red-500 mt-1">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default MemberContactInfo;