"use client";

import { Button } from "../ui/button";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  className?: string;
  href?: string;
  text?: string;
}
const BackButton = ({ className, href, text = "Home" }: BackButtonProps) => {
  const router = useRouter();
  
  const handleClick = () => {
    window.location.href = "https://vrrittih.com";
  };
  
  return (
    <Button
      size={"sm"}
      variant={"secondary"}
      className={cn("group cursor-pointer  ", className)}
      onClick={handleClick}
    >
      <Home className="group-hover:-translate-x-1 transition-transform duration-200 ease-in-out mr-1" />
      {text}
    </Button>
  );
};
export default BackButton;
