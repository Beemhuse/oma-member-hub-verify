import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ICard, Member } from "@/types/member";
import { Button } from "@/components/ui/button";
import { Ban, Undo } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";
import { useApiMutation } from "@/hooks/useApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import IDCard from "./membership-card/IdCard";
import { AxiosError } from "axios";

const REVOCATION_REASONS = [
  "Lost",
  "Stolen",
  "Damaged",
  "Membership Terminated",
  "Other",
] as const;
const REACTIVATION_REASONS = [
  "Membership Restored",
  "Card Found",
  "Other",
] as const;

type RevocationReason = (typeof REVOCATION_REASONS)[number];
type ReactivationReason = (typeof REACTIVATION_REASONS)[number];

interface MembershipCardProps {
  member: Member;
  card: ICard;
  signature: string;
  mutate?: () => void; // Callback when card is revoked
  onCardRevoked?: () => void; // Callback when card is revoked
}

const MembershipCard: React.FC<MembershipCardProps> = ({
  member,
  card,
  signature,
  mutate,
  onCardRevoked,
}) => {
  const { toast } = useToast();
  const [revocationReason, setRevocationReason] = useState<
    RevocationReason | ""
  >("");
  const [reactivationReason, setReactivationReason] = useState<
    ReactivationReason | ""
  >("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenReactivate, setIsOpenReactivate] = useState(false);
  const [otherReason, setOtherReason] = useState("");
  const [otherReasonReactivate, setOtherReasonReactivate] = useState("");

  const { mutate: revokeCard, isMutating } = useApiMutation({
    method: "PATCH",
    url: `/api/members/${card?._id}/revoke-card`,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Card revoked successfully",
      });
      mutate();
      setIsOpen(false);
      onCardRevoked?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to revoke card",
        variant: "destructive",
      });
    },
  });
  const { mutate: reActivateCard, isMutating: reActivating } = useApiMutation({
    method: "PATCH",
    url: `/api/members/${card?._id}/reactivate-card`,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Card reactivated successfully",
      });
      mutate();
      setIsOpen(false);
    },
    onError: (error: AxiosError) => {
      console.log(error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to revoke card",
        variant: "destructive",
      });
    },
  });

  const handleRevoke = () => {
    if (!revocationReason.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for revocation",
        variant: "destructive",
      });
      return;
    }
    revokeCard({ reason: revocationReason });
  };
  const handleReactivate = () => {
    if (!reactivationReason.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for reactivation",
        variant: "destructive",
      });
      return;
    }
    reActivateCard({ reason: reactivationReason });
  };

  return (
    <>
      <IDCard member={member} signature={signature} card={card} />
      <Card className="shadow-md" id="membership-card">
        <CardContent className="">
          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            {/* Revoke Card Dialog */}
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Ban className="h-4 w-4" />
                  Revoke Card
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Revoke Membership Card?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Please select a reason for
                    revocation.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4">
                  <Select
                    value={revocationReason}
                    onValueChange={(value) =>
                      setRevocationReason(value as RevocationReason)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason..." />
                    </SelectTrigger>
                    <SelectContent>
                      {REVOCATION_REASONS.map((reason) => (
                        <SelectItem key={reason} value={reason}>
                          {reason}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {revocationReason === "Other" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Please specify
                      </label>
                      <input
                        type="text"
                        placeholder="Enter reason..."
                        value={otherReason}
                        onChange={(e) => setOtherReason(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  )}
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRevoke}
                    disabled={
                      isMutating ||
                      !revocationReason ||
                      (revocationReason === "Other" && !otherReason.trim())
                    }
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {isMutating ? "Revoking..." : "Confirm Revocation"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog
              open={isOpenReactivate}
              onOpenChange={setIsOpenReactivate}
            >
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Undo className="h-4 w-4" />
                  Reactivate Card
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Reactivate Membership Card?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Please select a reason for reactivation.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4">
                  <Select
                    value={reactivationReason}
                    onValueChange={(value) =>
                      setReactivationReason(value as ReactivationReason)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason..." />
                    </SelectTrigger>
                    <SelectContent>
                      {REACTIVATION_REASONS.map((reason) => (
                        <SelectItem key={reason} value={reason}>
                          {reason}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {reactivationReason === "Other" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Please specify
                      </label>
                      <input
                        type="text"
                        placeholder="Enter reason..."
                        value={otherReasonReactivate}
                        onChange={(e) =>
                          setOtherReasonReactivate(e.target.value)
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  )}
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleReactivate}
                    disabled={
                      reActivating ||
                      !reactivationReason ||
                      (reactivationReason === "Other" &&
                        !otherReasonReactivate.trim())
                    }
                    className="bg-green-800 hover:bg-secondary/90"
                  >
                    {reActivating ? "Reactivating..." : "Confirm Reactivation"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default MembershipCard;
