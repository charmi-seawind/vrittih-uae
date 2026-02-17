"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Share2, Linkedin, MessageCircle, Instagram, Twitter, Facebook, Link2, Smartphone } from "lucide-react";
import { toast } from "sonner";
import {
  shareOnLinkedIn,
  shareOnWhatsApp,
  shareOnTwitter,
  shareOnFacebook,
  shareOnInstagram,
  copyJobLink,
  shareViaWebAPI,
  isMobileDevice,
} from "@/utils/socialShare";

interface JobShareButtonProps {
  job: {
    id: string;
    job_title: string;
    company_name: string;
    job_location?: string;
    job_type: string;
    pay_amount: string;
    job_category?: string;
  };
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

const JobShareButton = ({ job, variant = "outline", size = "sm" }: JobShareButtonProps) => {
  const handleShare = async (platform: string) => {
    try {
      switch (platform) {
        case "linkedin":
          shareOnLinkedIn(job);
          toast.success("Opening LinkedIn...");
          break;
        case "whatsapp":
          shareOnWhatsApp(job, isMobileDevice());
          toast.success("Opening WhatsApp...");
          break;
        case "twitter":
          shareOnTwitter(job);
          toast.success("Opening Twitter...");
          break;
        case "facebook":
          shareOnFacebook(job);
          toast.success("Opening Facebook...");
          break;
        case "instagram":
          const result = shareOnInstagram(job);
          if (result.success) {
            toast.success(result.message);
          } else {
            toast.info("Link copied! Open Instagram to share.");
          }
          break;
        case "copy":
          const copied = await copyJobLink(job);
          if (copied) {
            toast.success("Link copied to clipboard!");
          } else {
            toast.error("Failed to copy link");
          }
          break;
        case "native":
          const shared = await shareViaWebAPI(job);
          if (!shared) {
            toast.info("Share menu not available");
          }
          break;
        default:
          break;
      }
    } catch (error) {
      toast.error("Failed to share");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Share Job</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleShare("linkedin")} className="cursor-pointer">
          <Linkedin className="h-4 w-4 mr-2 text-blue-600" />
          LinkedIn
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleShare("whatsapp")} className="cursor-pointer">
          <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
          WhatsApp
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleShare("twitter")} className="cursor-pointer">
          <Twitter className="h-4 w-4 mr-2 text-sky-500" />
          Twitter / X
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleShare("facebook")} className="cursor-pointer">
          <Facebook className="h-4 w-4 mr-2 text-blue-700" />
          Facebook
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleShare("instagram")} className="cursor-pointer">
          <Instagram className="h-4 w-4 mr-2 text-pink-600" />
          Instagram (Copy Link)
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {isMobileDevice() && (
          <DropdownMenuItem onClick={() => handleShare("native")} className="cursor-pointer">
            <Smartphone className="h-4 w-4 mr-2 text-gray-600" />
            More Options
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={() => handleShare("copy")} className="cursor-pointer">
          <Link2 className="h-4 w-4 mr-2 text-gray-600" />
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default JobShareButton;
