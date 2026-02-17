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
import { Briefcase, Plus, Edit3, Trash2, Calendar, MapPin, Building, Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { candidateAPI } from "@/services/api";
import { experienceSchema, type ExperienceFormData } from "@/lib/validations/profile";
// Experience type is defined inline
type Experience = {
  id?: string;
  company: string;
  position: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  achievements?: string;
};

const ExperiencePage = () => {
  const { profile, loading, updateProfile } = useProfile();

  const [experiences, setExperiences] = useState<Experience[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [formData, setFormData] = useState<Partial<Experience>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile?.experience) {
      setExperiences(profile.experience);
    }
  }, [profile]);

  const handleAddNew = () => {
    setEditingExperience(null);
    setFormData({ is_current: false });
    setIsDialogOpen(true);
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setFormData(experience);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      setErrors({});
      const result = experienceSchema.safeParse(formData);
      
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

      let updatedExperiences;
      if (editingExperience) {
        updatedExperiences = experiences.map(exp => 
          exp.id === editingExperience.id ? { ...formData as Experience } : exp
        );
      } else {
        const newExperience: Experience = {
          ...formData as Experience,
          id: Date.now().toString()
        };
        updatedExperiences = [newExperience, ...experiences];
      }
      
      // Use same API pattern as education
      const response = await candidateAPI.updateProfile({ 
        resume: {
          experience: updatedExperiences
        }
      });
      
      setExperiences(updatedExperiences);
      setIsDialogOpen(false);
      setFormData({});
      setErrors({});
      toast.success(editingExperience ? "Experience updated successfully!" : "Experience added successfully!", { id: "experience-save" });
    } catch (error) {
      toast.error("Failed to save experience. Please try again.", { id: "experience-save" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    
    try {
      const updatedExperiences = experiences.filter(exp => exp.id !== id);
      await candidateAPI.updateProfile({ 
        resume: {
          experience: updatedExperiences
        }
      });
      setExperiences(updatedExperiences);
      toast.success("Experience deleted successfully!", { id: "experience-delete" });
    } catch (error) {
      toast.error("Failed to delete experience. Please try again.", { id: "experience-delete" });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const calculateDuration = (startDate: string, endDate: string, isCurrent: boolean) => {
    const start = new Date(startDate);
    const end = isCurrent ? new Date() : new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;
    
    if (years > 0 && months > 0) {
      return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`;
    } else if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else {
      return `${months} month${months > 1 ? 's' : ''}`;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Work Experience</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Showcase your professional journey and achievements</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingExperience ? "Edit Experience" : "Add New Experience"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Job Title</Label>
                  <Input
                    id="position"
                    value={formData.position || ""}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    placeholder="e.g., Senior Software Developer"
                    className={errors.position ? "border-red-500" : ""}
                  />
                  {errors.position && <p className="text-sm text-red-500">{errors.position}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company || ""}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder="e.g., Tech Solutions Pvt Ltd"
                    className={errors.company ? "border-red-500" : ""}
                  />
                  {errors.company && <p className="text-sm text-red-500">{errors.company}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location || ""}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g., Bangalore, Karnataka"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date || ""}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    className={errors.start_date ? "border-red-500" : ""}
                  />
                  {errors.start_date && <p className="text-sm text-red-500">{errors.start_date}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date || ""}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    disabled={formData.is_current}
                    className={errors.end_date ? "border-red-500" : ""}
                  />
                  {errors.end_date && <p className="text-sm text-red-500">{errors.end_date}</p>}
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id="is_current"
                    checked={formData.is_current || false}
                    onCheckedChange={(checked) => setFormData({...formData, is_current: checked as boolean})}
                  />
                  <Label htmlFor="is_current">I currently work here</Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your role, responsibilities, and key contributions..."
                  rows={4}
                />
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



              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {editingExperience ? "Update" : "Add"} Experience
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={loading}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {experiences.map((experience, index) => (
            <Card key={experience.id || index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <Briefcase className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-xl text-gray-900 dark:text-white">
                          {experience.position || experience.jobTitle || experience.title}
                        </CardTitle>
                        {(experience.is_current || experience.isCurrent) && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {experience.company || experience.companyName || experience.organization}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(experience.start_date || experience.startDate)} - {(experience.is_current || experience.isCurrent) ? "Present" : formatDate(experience.end_date || experience.endDate || "")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {calculateDuration(experience.start_date || experience.startDate, experience.end_date || experience.endDate || "", experience.is_current || experience.isCurrent)}
                        </div>
                        {(experience.location) && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {experience.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(experience)}
                      className="text-gray-600 hover:text-blue-600"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(experience.id)}
                      className="text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-4 py-1 pl-20">
                {experience.description && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h4>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {experience.description}
                    </p>
                  </div>
                )}
                
                {(experience.achievements) && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                      🏆 Achievements
                    </h4>
                    <div className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                      {experience.achievements}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default ExperiencePage;