"use client";

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { GraduationCap, Briefcase, Award, FolderKanban, FileCheck } from "lucide-react";
import EducationForm from "./ResumeEditorForms/EducationForm";
import WorkExperienceForm from "./ResumeEditorForms/WorkExperienceForm";
import SkillsForm from "./ResumeEditorForms/SkillsForm";
import ProjectsForm from "./ResumeEditorForms/ProjectsForm";
import CertificationForm from "./ResumeEditorForms/CertificationsForm";
import { ResumeValues } from "@/schema/ResumeEditorSchema";
import { toast } from "sonner";

interface OptionalDetailsFormProps {
  resumeData: ResumeValues;
  setResumeData: (data: ResumeValues) => void;
  pendingUserId: string | null;
  onSave?: () => Promise<boolean>;
}

const OptionalDetailsForm = ({ resumeData, setResumeData, pendingUserId, onSave }: OptionalDetailsFormProps) => {

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground">
          Add your details below or skip to continue
        </p>
      </div>

      <Accordion type="multiple" className="w-full space-y-4">
        <AccordionItem value="education" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <p className="font-semibold">Education</p>
                <p className="text-xs text-muted-foreground">
                  {resumeData.education?.length || 0} education
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <EducationForm resumeData={resumeData} setResumeData={setResumeData} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="experience" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-green-600" />
              <div className="text-left">
                <p className="font-semibold">Work Experience</p>
                <p className="text-xs text-muted-foreground">
                  {resumeData.experience?.length || 0} work experience
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <WorkExperienceForm resumeData={resumeData} setResumeData={setResumeData} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="skills" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-purple-600" />
              <div className="text-left">
                <p className="font-semibold">Skills</p>
                <p className="text-xs text-muted-foreground">
                  {resumeData.skills?.length || 0} skills
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <SkillsForm resumeData={resumeData} setResumeData={setResumeData} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="projects" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <FolderKanban className="h-5 w-5 text-orange-600" />
              <div className="text-left">
                <p className="font-semibold">Projects</p>
                <p className="text-xs text-muted-foreground">
                  {resumeData.projects?.length || 0} projects
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <ProjectsForm resumeData={resumeData} setResumeData={setResumeData} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="certifications" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <FileCheck className="h-5 w-5 text-red-600" />
              <div className="text-left">
                <p className="font-semibold">Certifications</p>
                <p className="text-xs text-muted-foreground">
                  {resumeData.certifications?.length || 0} certifications
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <CertificationForm resumeData={resumeData} setResumeData={setResumeData} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default OptionalDetailsForm;
