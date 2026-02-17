import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ResumeEditorFormShell from "./ResumeEditorFormShell";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { projectsSchema, ProjectsValues } from "@/schema/ResumeEditorSchema";

const ProjectsForm = forwardRef(({
  resumeData,
  setResumeData,
}: any, ref) => {
  const [projects, setProjects] = useState(resumeData.projects || []);
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    startDate: "",
    endDate: "",
    url: "",
    achievements: "",
  });
  
  // Sync with parent resumeData when it changes
  useEffect(() => {
    setProjects(resumeData.projects || []);
  }, [resumeData.projects]);
  
  const form = useForm<ProjectsValues>({
    resolver: zodResolver(projectsSchema),
    defaultValues: formData,
    values: formData,
    mode: "onChange",
  });

  // Update form data whenever form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      setFormData(value as any);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = (data: ProjectsValues) => {
    // Check for duplicate project entry
    const isDuplicate = projects.some((project: any) => 
      project.title.toLowerCase() === data.title.toLowerCase()
    );

    if (isDuplicate) {
      form.setError("title", {
        type: "manual",
        message: "A project with this title already exists"
      });
      return;
    }

    const formattedData = {
      ...data,
      technologies: data.technologies
        ? data.technologies.split(",").map((tech: string) => tech.trim()).filter((tech: string) => tech.length > 0)
        : [],
      achievements: data.achievements
        ? data.achievements.split(",").map((item: string) => item.trim()).filter((item: string) => item.length > 0)
        : [], // ✅ Convert achievements to array
    };

    const newProjects = [...projects, formattedData];
    setProjects(newProjects);
    setResumeData({
      ...resumeData,
      projects: newProjects,
    });
    // Reset form and all local state variables
    const resetData = {
      title: "",
      description: "",
      technologies: "",
      startDate: "",
      endDate: "",
      url: "",
      achievements: "",
    };
    setFormData(resetData);
    form.reset(resetData);
    setStartYear("");
    setEndYear("");
  };

  const removeProject = (index: number) => {
    const updatedProjects = projects.filter((_: any, i: number) => i !== index);
    setProjects(updatedProjects);
    setResumeData({
      ...resumeData,
      projects: updatedProjects,
    });
  };

  useImperativeHandle(ref, () => ({
    getValues: () => form.getValues(),
  }));

  return (
    <ResumeEditorFormShell
    //  title="Projects" 
    //  description="Showcase your projects and achievements"
     >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base font-medium">Project Title <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Enter project title" 
                    className="h-10 sm:h-11 text-sm sm:text-sm"
                  />
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base font-medium">Description <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Describe your project" 
                    className="resize-none min-h-[80px] sm:min-h-[100px] text-sm sm:text-sm"
                  />
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="technologies"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base font-medium">Technologies <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Enter technologies separated by commas (e.g., React, Node.js, MongoDB)" 
                    className="h-10 sm:h-11 text-sm sm:text-sm"
                  />
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => {
                const updateDate = (y: string) => {
                  if (y) {
                    const date = `${y}-01-01`;
                    field.onChange(date);
                    setStartYear(y);
                  } else {
                    field.onChange('');
                    setStartYear('');
                  }
                };
                
                return (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium">Start Year</FormLabel>
                    <Select value={startYear} onValueChange={updateDate}>
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i).map(y => (
                          <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                );
              }}
            />
            
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => {
                const updateDate = (y: string) => {
                  if (y) {
                    const date = `${y}-01-01`;
                    field.onChange(date);
                    setEndYear(y);
                  } else {
                    field.onChange('');
                    setEndYear('');
                  }
                };
                
                return (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium">End Year</FormLabel>
                    <Select value={endYear} onValueChange={updateDate}>
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i).map(y => (
                          <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                );
              }}
            />
          </div>

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base font-medium">Project URL</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="https://github.com/user/project" 
                    className="h-10 sm:h-11 text-sm sm:text-sm"
                  />
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="achievements"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base font-medium">Achievements</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter achievements separated by commas (e.g., Achievement 1, Achievement 2)"
                    className="resize-none min-h-[60px] sm:min-h-[80px] text-sm sm:text-base"
                  />
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base font-medium">
            Add Project
          </Button>
        </form>
      </Form>
      
      {projects.length > 0 && (
        <div className="mt-6 sm:mt-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900">Added Projects</h3>
          <div className="space-y-3 sm:space-y-4">
            {projects.map((project: any, index: number) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow relative group"
              >
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto sm:mx-0">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm2 2a1 1 0 000 2h.01a1 1 0 100-2H5zm3 0a1 1 0 000 2h3a1 1 0 100-2H8z" clipRule="evenodd" />
                  </svg>
                </div>
                
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{project.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">{project.description}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">
                    {new Date(project.startDate).getFullYear()} - {new Date(project.endDate).getFullYear()}
                  </p>
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap justify-center sm:justify-start gap-1 sm:gap-2 mb-2">
                      {project.technologies.map((tech: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {project.achievements && project.achievements.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Achievements:</p>
                      <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600 space-y-1">
                        {project.achievements.map((ach: string, i: number) => (
                          <li key={i}>{ach}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {project.url && (
                    <a 
                      href={project.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block text-xs sm:text-sm text-blue-600 hover:text-blue-800 underline font-medium"
                    >
                      View Project →
                    </a>
                  )}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                  onClick={() => removeProject(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </ResumeEditorFormShell>
  );
});

// Validation function to check if projects section is complete
export const validateProjectsSection = (resumeData: any) => {
  // Check if at least one project is added
  if (!resumeData.projects || resumeData.projects.length === 0) {
    return {
      isValid: false,
      message: "Please add at least one project before proceeding to next step"
    };
  }
  
  return {
    isValid: true,
    message: ""
  };
};

export default ProjectsForm;
