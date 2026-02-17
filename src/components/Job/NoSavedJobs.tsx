import { Bookmark, Search } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const EmptySavedJobsState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-6">
        <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Saved Jobs Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          Start saving jobs you're interested in to keep track of opportunities you want to apply for later.
        </p>
      </div>
      
      <Button asChild>
        <Link href="/job-seeker/jobs/browse" className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          Browse Jobs
        </Link>
      </Button>
    </div>
  );
};

export default EmptySavedJobsState;