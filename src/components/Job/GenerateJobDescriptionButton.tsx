import { generateJobDescription } from "@/actions/generateJobDescription";
import { JobSchemaType } from "@/schema/CreateJobSchema";
import { useState } from "react";
import { toast } from "sonner";
import AIButton from "../Global/AIButton";

interface GenerateJobDescriptionButtonProps {
  jobData: JobSchemaType;
  onDescriptionGenerated: (description: string) => void;
}

const GenerateJobDescriptionButton = ({
  jobData,
  onDescriptionGenerated,
}: GenerateJobDescriptionButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const generateDescription = async () => {
    try {
      setIsLoading(true);
      const aiResponse = await generateJobDescription(jobData);
      if (!aiResponse) {
        toast.error("Failed To Generate Description");
        return;
      }
      onDescriptionGenerated(aiResponse);
    } catch (error) {
      toast.error("Something went wrong. Please Try Again", {
        id: "generate-description",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return <AIButton loading={isLoading} onClick={generateDescription} />;
};

export default GenerateJobDescriptionButton;
