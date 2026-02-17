"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Plus, Edit3, Trash2, Calendar, MapPin, Award, Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { candidateAPI } from "@/services/api";
import { educationSchema, type EducationFormData } from "@/lib/validations/profile";
// Education type is defined inline
type Education = {
  id?: string;
  degree: string;
  institution: string;
  year_of_completion: string;
  percentage?: string;
  grade?: string;
  location?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
};

const EducationPage = () => {
  const { profile, loading, updateProfile } = useProfile();

  const [educations, setEducations] = useState<Education[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [formData, setFormData] = useState<Partial<Education>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile?.education) {
      setEducations(profile.education);
    }
  }, [profile]);

  const handleAddNew = () => {
    setEditingEducation(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleEdit = (education: Education) => {
    setEditingEducation(education);
    setFormData(education);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      setErrors({});
      const result = educationSchema.safeParse(formData);
      
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

      let updatedEducations;
      if (editingEducation) {
        updatedEducations = educations.map(edu => 
          edu.id === editingEducation.id ? { ...formData as Education } : edu
        );
      } else {
        const newEducation: Education = {
          ...formData as Education,
          id: Date.now().toString()
        };
        updatedEducations = [newEducation, ...educations];
      }
      
      const response = await candidateAPI.updateProfile({ 
        resume: {
          education: updatedEducations
        }
      });
      
      setEducations(updatedEducations);
      setIsDialogOpen(false);
      setFormData({});
      setErrors({});
      toast.success(editingEducation ? "Education updated successfully!" : "Education added successfully!", { id: "education-save" });
    } catch (error) {
      toast.error("Failed to save education. Please try again.", { id: "education-save" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education?")) return;
    
    try {
      const updatedEducations = educations.filter(edu => edu.id !== id);
      await candidateAPI.updateProfile({ 
        resume: {
          education: updatedEducations
        }
      });
      setEducations(updatedEducations);
      toast.success("Education deleted successfully!", { id: "education-delete" });
    } catch (error) {
      toast.error("Failed to delete education. Please try again.", { id: "education-delete" });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Education</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your educational qualifications and achievements</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Education
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEducation ? "Edit Education" : "Add New Education"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="degree">Degree/Qualification</Label>
                  <Input
                    id="degree"
                    value={formData.degree || ""}
                    onChange={(e) => setFormData({...formData, degree: e.target.value})}
                    placeholder="e.g., Bachelor of Technology in Computer Science"
                    className={errors.degree ? "border-red-500" : ""}
                  />
                  {errors.degree && <p className="text-sm text-red-500">{errors.degree}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input
                    id="institution"
                    value={formData.institution || ""}
                    onChange={(e) => setFormData({...formData, institution: e.target.value})}
                    placeholder="e.g., Indian Institute of Technology"
                    className={errors.institution ? "border-red-500" : ""}
                  />
                  {errors.institution && <p className="text-sm text-red-500">{errors.institution}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location || ""}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g., Mumbai, Maharashtra"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year_of_completion">Year of Completion</Label>
                  <Input
                    id="year_of_completion"
                    type="number"
                    value={formData.year_of_completion || ""}
                    onChange={(e) => setFormData({...formData, year_of_completion: e.target.value})}
                    placeholder="e.g., 2022"
                    className={errors.year_of_completion ? "border-red-500" : ""}
                  />
                  {errors.year_of_completion && <p className="text-sm text-red-500">{errors.year_of_completion}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="percentage">Percentage/CGPA</Label>
                  <Input
                    id="percentage"
                    value={formData.percentage || formData.grade || ""}
                    onChange={(e) => setFormData({...formData, percentage: e.target.value, grade: e.target.value})}
                    placeholder="e.g., 8.5 CGPA or 85%"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate || ""}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate || ""}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Relevant coursework, achievements, projects, etc."
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {editingEducation ? "Update" : "Add"} Education
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={loading}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Education List */}
      <div className="space-y-4">
        {educations.map((education, index) => (
          <Card key={education.id || `education-${index}`} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl text-gray-900 dark:text-white mb-1">
                      {education.degree}
                    </CardTitle>
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                      {education.institution}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {education.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {education.startDate && education.endDate ? 
                          `${formatDate(education.startDate)} - ${formatDate(education.endDate)}` :
                          education.startDate ? 
                          `${formatDate(education.startDate)} - Present` :
                          education.year_of_completion
                        }
                      </div>
                      {(education.percentage || education.grade) && (
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          {education.percentage || education.grade}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(education)}
                    className="text-gray-600 hover:text-blue-600"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(education.id)}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {education.description && (
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {education.description}
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EducationPage;