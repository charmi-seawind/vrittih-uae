"use client";
import { BadgeCheck, Bell, CreditCard, Sparkles } from "lucide-react";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
// 🟠 Store import commented out
// import usePremiumModal from "@/store/usePremiumModal";
import Link from "next/link";
const JobSeekerUserMenu = () => {
  // 🟠 Store hook commented out
  // const { setOpenPremiumModal } = usePremiumModal();
  
  // 🔹 Dummy function
  const setOpenPremiumModal = () => {};
  return (
    <>
      <DropdownMenuGroup>
        {/* <DropdownMenuItem onClick={() => setOpenPremiumModal(true)}>
          <Sparkles />
          Upgrade to Pro
        </DropdownMenuItem> */}
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
      </DropdownMenuGroup>
    </>
  );
};
export default JobSeekerUserMenu;
