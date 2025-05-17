import React from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";

interface MemberAdditionalInfoProps {
  control: any;
}

const MemberAdditionalInfo: React.FC<MemberAdditionalInfoProps> = ({
  control,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Additional Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="dateOfBirth"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1">
                Date of Birth
              </label>
              <Input type="date" {...field} />
            </div>
          )}
        />

        <Controller
          name="dateJoined"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1">
                Date Joined
              </label>
              <Input type="date" {...field} />
            </div>
          )}
        />

        <Controller
          name="occupation"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1">Occupation</label>
              <Input placeholder="Software Engineer" {...field} />
            </div>
          )}
        />

        <Controller
          name="emergencyContact"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1">
                Emergency Contact
              </label>
              <Input placeholder="Name: +1234567890" {...field} />
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default MemberAdditionalInfo;