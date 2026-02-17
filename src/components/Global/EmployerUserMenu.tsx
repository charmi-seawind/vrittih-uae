import { BadgeCheck, CreditCard, Mail, Sparkles } from "lucide-react";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
// 🟠 Type and store imports commented out
// import { ExtendedUser } from "@/next-auth";
// import { useInvitationModal } from "@/store/useInvitaionModal";
// import { usePendingInvitationsCount } from "@/store/usePendingInvitationsCount";
import Link from "next/link";
// import useCompanyPremiumModal from "@/store/useCompanyPremiumModal";

interface EmployerUserMenuProps {
  user: any; // Changed from ExtendedUser
}

const EmployerUserMenu = ({ user }: EmployerUserMenuProps) => {
  // 🟠 Store hooks commented out
  // const { setOpenInvitationModal } = useInvitationModal();
  // const { pendingInvitationsCount } = usePendingInvitationsCount();
  // const { setOpenCompanyPremiumModal } = useCompanyPremiumModal();
  
  // 🔹 Dummy functions
  const setOpenInvitationModal = () => {};
  const pendingInvitationsCount = 2;
  const setOpenCompanyPremiumModal = () => {};
  return (
    <>
      <DropdownMenuGroup>
      
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <BadgeCheck />
          Account (Employer)
        </DropdownMenuItem>
     
     
      </DropdownMenuGroup>
    </>
  );
};
export default EmployerUserMenu;
