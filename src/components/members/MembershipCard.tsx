import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ICard, Member } from "@/types/member";
import { MembershipCardHeader } from "./membership-card/MembershipCardHeader";
import { MemberPhoto } from "./membership-card/MemberPhoto";
import { MemberInfo } from "./membership-card/MemberInfo";
import { MembershipQRCode } from "./membership-card/MembershipQRCode";
import { PrintButton } from "./membership-card/PrintButton";
import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useApiMutation } from "@/hooks/useApi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const REVOCATION_REASONS = [
  "Lost",
  "Stolen",
  "Damaged",
  "Membership Terminated",
  "Other"
] as const;


type RevocationReason = typeof REVOCATION_REASONS[number];

interface MembershipCardProps {
  member: Member;
  card: ICard;
  onCardRevoked?: () => void; // Callback when card is revoked
}

const MembershipCard: React.FC<MembershipCardProps> = ({
  member,
  card,
  onCardRevoked,
}) => {
  const { toast } = useToast();
  const [revocationReason, setRevocationReason] = useState<RevocationReason | "">("");
  const [isOpen, setIsOpen] = useState(false);
  const [otherReason, setOtherReason] = useState("");

  const { mutate: revokeCard, isMutating } = useApiMutation({
    method: "PATCH",
    url: `/api/members/${card?._id}/revoke-card`,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Card revoked successfully",
      });
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

  return (
    <Card className="shadow-md" id="membership-card">
      <CardContent className="p-6">
        <MembershipCardHeader />

        <div className="flex gap-4">
          <MemberPhoto
            photo={member?.photo}
            firstName={member?.firstName}
            lastName={member?.lastName}
          />
          <MemberInfo
            firstName={member?.firstName}
            lastName={member?.lastName}
            membershipId={card?.cardId}
            dateJoined={member?._createdAt}
          />
        </div>

        <MembershipQRCode
          membershipId={member?.membershipId}
          qrCodeUrl={card?.qrCodeUrl}
        />

<div className="flex gap-2 mt-4">
          <PrintButton member={member} qrCodeUrl={card?.qrCodeUrl} />

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
                  This action cannot be undone. Please select a reason for revocation.
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="space-y-4">
                <Select
                  value={revocationReason}
                  onValueChange={(value) => setRevocationReason(value as RevocationReason)}
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
                  disabled={isMutating || !revocationReason || (revocationReason === "Other" && !otherReason.trim())}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {isMutating ? "Revoking..." : "Confirm Revocation"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipCard;
