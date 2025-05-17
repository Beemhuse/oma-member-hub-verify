import React from "react";
import { Controller } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MemberStatusFieldsProps {
  control: any;
}

const MemberStatusFields: React.FC<MemberStatusFieldsProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Status & Role</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="membershipStatus"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1">
                Membership Status
              </label>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="board_member">Board Member</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default MemberStatusFields;