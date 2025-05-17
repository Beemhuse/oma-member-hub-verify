import React from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";

interface MemberBasicInfoProps {
  control: any;
  isEditing: boolean;
}

const MemberBasicInfo: React.FC<MemberBasicInfoProps> = ({
  control,
  isEditing,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Basic Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="firstName"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <Input placeholder="John" {...field} />
              {fieldState.error && (
                <p className="text-sm text-red-500 mt-1">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          name="lastName"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <Input placeholder="Doe" {...field} />
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

export default MemberBasicInfo;