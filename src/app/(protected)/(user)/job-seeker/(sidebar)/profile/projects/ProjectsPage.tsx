"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { FolderOpen, Plus, Edit3, Trash2, ExternalLink, Calendar, Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { candidateAPI } from "@/services/api";
import { projectSchema, type ProjectFormData } from "@/lib/validations/profile";

type Project = {
  id?: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  isOngoing: boolean;
  technologies?: string[];
  projectUrl?: string;
  githubUrl?: string;
  achievements?: string;
};

const ProjectsPage = () => {
  const { profile, loading } = useProfile();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [techInput, setTechInput] = useState("");

  useEffect(() => {
    if (profile?.projects) {
      setProjects(profile.projects);
    }
  }, [profile]);

  const handleAddNew = () => {
    setEditingProject(null);
    setFormData({ isOngoing: false, technologies: [] });
    setTechInput("");
    setIsDialogOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData(project);
    setTechInput("");
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      setErrors({});
      const result = projectSchema.safeParse(formData);
      
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }

      let updatedProjects;
      if (editingProject) {
        updatedProjects = projects.map(proj => 
          proj.id === editingProject.id ? { ...formData as Project } : proj
        );
      } else {
        const newProject: Project = {
          ...formData as Project,
          id: Date.now().toString()
        };
        updatedProjects = [newProject, ...projects];
      }
      
      // Use same API pattern as education
      const response = await candidateAPI.updateProfile({ 
        resume: {
          projects: updatedProjects
        }
      });
      setProjects(updatedProjects);
      setIsDialogOpen(false);
      setFormData({});
      setErrors({});
      toast.success(editingProject ? "Project updated successfully!" : "Project added successfully!", { id: "project-save" });
    } catch (error) {
      toast.error("Failed to save project. Please try again.", { id: "project-save" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const updatedProjects = projects.filter(proj => proj.id !== id);
      await candidateAPI.updateProfile({ 
        resume: {
          projects: updatedProjects
        }
      });
      setProjects(updatedProjects);
      toast.success("Project deleted successfully!", { id: "project-delete" });
    } catch (error) {
      toast.error("Failed to delete project. Please try again.", { id: "project-delete" });
    }
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies?.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...(formData.technologies || []), techInput.trim()]
      });
      setTechInput("");
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies?.filter(t => t !== tech) || []
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Showcase your projects and work</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Edit Project" : "Add New Project"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., E-commerce Website"
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your project, its features, and your role..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate || ""}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className={errors.startDate ? "border-red-500" : ""}
                  />
                  {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate || ""}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    disabled={formData.isOngoing}
                    className={errors.endDate ? "border-red-500" : ""}
                  />
                  {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isOngoing"
                  checked={formData.isOngoing || false}
                  onCheckedChange={(checked) => setFormData({...formData, isOngoing: checked as boolean})}
                />
                <Label htmlFor="isOngoing">This is an ongoing project</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectUrl">Project URL</Label>
                  <Input
                    id="projectUrl"
                    value={formData.projectUrl || ""}
                    onChange={(e) => setFormData({...formData, projectUrl: e.target.value})}
                    placeholder="https://project-demo.com"
                    className={errors.projectUrl ? "border-red-500" : ""}
                  />
                  {errors.projectUrl && <p className="text-sm text-red-500">{errors.projectUrl}</p>}
                </div>
                
              </div>

              <div className="space-y-2">
                <Label htmlFor="achievements">Achievements (Optional)</Label>
                <Textarea
                  id="achievements"
                  value={formData.achievements || ""}
                  onChange={(e) => setFormData({...formData, achievements: e.target.value})}
                  placeholder="• Achievement 1&#10;• Achievement 2&#10;• Achievement 3"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Technologies Used</Label>
                <div className="flex gap-2">
                  <Input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="Add technology (e.g., React, Node.js)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                  />
                  <Button type="button" onClick={addTechnology} variant="outline">
                    Add
                  </Button>
                </div>
                {formData.technologies && formData.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.technologies.map((tech, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1">
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(tech)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {editingProject ? "Update" : "Add"} Project
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={loading}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length > 0 && (
        <div className="grid gap-6">
          {projects.map((project, index) => (
            <Card key={project.id || index} className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-gray-900 dark:text-white">
                      {project.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not specified'} - {
                            project.isOngoing ? "Present" : 
                            project.endDate ? new Date(project.endDate).toLocaleDateString() : "Not specified"
                          }
                        </span>
                      </div>
                      {project.isOngoing && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Ongoing
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(project)}
                      className="text-gray-600 hover:text-blue-600"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                      className="text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  {project.description}
                </p>
                
                {project.technologies && project.technologies.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Technologies Used:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="outline" className="px-3 py-1">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {project.achievements && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      🏆 Achievements:
                    </h4>
                    <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      {project.achievements}
                    </div>
                  </div>
                )}

                {(project.projectUrl || project.githubUrl) && (
                  <div className="flex gap-3 pt-2">
                    {project.projectUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          GitHub
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;