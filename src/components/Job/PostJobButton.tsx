"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface PostJobButtonProps {
  canCreate: boolean;
}

const PostJobButton = ({ canCreate }: PostJobButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/employer/job/create");
  };

  if (!canCreate) {
    return null;
  }

  return (
    <Button onClick={handleClick} className="flex items-center gap-2">
      <Plus className="h-4 w-4" />
      Post New Job
    </Button>
  );
};

export default PostJobButton;