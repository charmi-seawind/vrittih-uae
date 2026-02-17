import { ResumeEditorFormProps } from "@/lib/types";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { skillsSchema, SkillsValues } from "@/schema/ResumeEditorSchema";
import ResumeEditorFormShell from "./ResumeEditorFormShell";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

const commonSkills = [
  "JavaScript", "Python", "Java", "React", "Node.js", "HTML", "CSS", "TypeScript", "Angular", "Vue.js",
  "PHP", "C++", "C#", "Ruby", "Go", "Swift", "Kotlin", "Flutter", "React Native", "MongoDB",
  "MySQL", "PostgreSQL", "Redis", "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Git",
  "Jenkins", "Terraform", "Ansible", "Linux", "Windows", "MacOS", "Figma", "Adobe Photoshop",
  "Adobe Illustrator", "Sketch", "InVision", "Zeplin", "Canva", "AutoCAD", "SolidWorks", "MATLAB",
  "R", "Tableau", "Power BI", "Excel", "Word", "PowerPoint", "Salesforce", "HubSpot", "Mailchimp",
  "Google Analytics", "SEO", "SEM", "Social Media Marketing", "Content Writing", "Copywriting",
  "Project Management", "Agile", "Scrum", "Kanban", "JIRA", "Trello", "Asana", "Slack", "Teams",
  "Communication", "Leadership", "Problem Solving", "Critical Thinking", "Time Management",
  "Team Work", "Adaptability", "Creativity", "Attention to Detail", "Customer Service",
  "Data Analysis", "Machine Learning", "Artificial Intelligence", "Deep Learning", "TensorFlow",
  "PyTorch", "Pandas", "NumPy", "Scikit-learn", "Jupyter", "Apache Spark", "Hadoop", "Kafka",
  "Elasticsearch", "Grafana", "Prometheus", "Nginx", "Apache", "REST API", "GraphQL", "Microservices",
  "DevOps", "CI/CD", "Testing", "Unit Testing", "Integration Testing", "Selenium", "Jest", "Cypress",
  "Other"
];

const SkillsForm = forwardRef(({ resumeData, setResumeData }: ResumeEditorFormProps, ref) => {
  const [inputValue, setInputValue] = useState("");
  const [skills, setSkills] = useState<string[]>(resumeData.skills || []);
  const [filteredSkills, setFilteredSkills] = useState(commonSkills);
  const [formData, setFormData] = useState({ skill: "" });
  
  // Sync with parent resumeData when it changes
  useEffect(() => {
    setSkills(resumeData.skills || []);
  }, [resumeData.skills]);

  const form = useForm<SkillsValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: formData,
    values: formData,
    mode: "onChange",
  });

  // Update form data whenever form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      setFormData(value as any);
      if (value.skill !== undefined) {
        setInputValue(value.skill || "");
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const addSkill = () => {
    const trimmedSkill = inputValue.trim();
    if (trimmedSkill && !skills.some(skill => skill.trim().toLowerCase() === trimmedSkill.toLowerCase())) {
      // Validate the skill before adding
      const validation = skillsSchema.safeParse({ skill: trimmedSkill });
      if (!validation.success) {
        form.setError("skill", { message: validation.error.errors[0].message });
        return;
      }
      
      const newSkills = [...skills, trimmedSkill];
      setSkills(newSkills);
      setResumeData({ ...resumeData, skills: newSkills });
      // Reset form and persistent form data
      const resetData = { skill: "" };
      setFormData(resetData);
      setInputValue("");
      form.reset(resetData);
      form.clearErrors("skill");
    } else if (skills.some(skill => skill.trim().toLowerCase() === trimmedSkill.toLowerCase())) {
      form.setError("skill", { message: "This skill already exists" });
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const newSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(newSkills);
    setResumeData({ ...resumeData, skills: newSkills });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  useImperativeHandle(ref, () => ({
    getValues: () => form.getValues(),
  }));
  return (
    <ResumeEditorFormShell
    //  title="Skills" 
    //  description="Add your technical and professional skills"
     >
      <Form {...form}>
        <form className="space-y-4 sm:space-y-6">
          <FormField
            control={form.control}
            name="skill"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base font-medium">Add Skills <span className="text-red-500">*</span></FormLabel>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <div className="relative flex-1">
                    <FormControl>
                      <Input
                        {...field}
                        value={inputValue}
                        onChange={(e) => {
                          const value = e.target.value;
                          setInputValue(value);
                          field.onChange(value);
                          const filtered = commonSkills.filter(skill => 
                            skill.toLowerCase().includes(value.toLowerCase())
                          );
                          setFilteredSkills(filtered);
                        }}
                        onKeyPress={handleKeyPress}
                        placeholder="Search or type a skill"
                        className="h-10 sm:h-11 text-sm sm:text-base"
                        list="skills-list"
                      />
                    </FormControl>
                    {inputValue && filteredSkills.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredSkills.slice(0, 10).map((skill) => (
                          <div
                            key={skill}
                            onClick={() => {
                              const trimmedSkill = skill.trim();
                              setInputValue(trimmedSkill);
                              field.onChange(trimmedSkill);
                              setFilteredSkills([]);
                            }}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          >
                            {skill}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    onClick={addSkill}
                    disabled={!inputValue.trim()}
                    className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base font-medium"
                  >
                    Add Skill
                  </Button>
                </div>
                <FormDescription className="text-xs sm:text-sm text-muted-foreground">
                  Search from suggestions or type a custom skill.
                </FormDescription>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />
          
          {skills.length > 0 && (
            <div className="space-y-3 sm:space-y-4">
              <h4 className="text-sm sm:text-base font-medium text-gray-900">Your Skills ({skills.length})</h4>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm border border-blue-200 hover:bg-blue-200 transition-colors group"
                  >
                    <span className="font-medium">{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:bg-blue-300 rounded-full p-0.5 sm:p-1 transition-colors group-hover:bg-blue-300"
                      aria-label={`Remove ${skill}`}
                    >
                      <X size={10} className="sm:w-3 sm:h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </Form>
    </ResumeEditorFormShell>
  );
});

// Validation function to check if skills section is complete
export const validateSkillsSection = (resumeData: any) => {
  // Check if at least one skill is added
  if (!resumeData.skills || resumeData.skills.length === 0) {
    return {
      isValid: false,
      message: "Please add at least one skill before proceeding to next step"
    };
  }
  
  return {
    isValid: true,
    message: ""
  };
};

export default SkillsForm;
