"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, Plus, X, Star, Code, Palette, Users, TrendingUp, Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { candidateAPI } from "@/services/api";
import { skillSchema, type SkillFormData } from "@/lib/validations/profile";
// Skill type is defined inline
type Skill = {
  id?: string;
  name: string;
  level: string;
};

const SkillsPage = () => {
  const { profile, loading, updateProfile } = useProfile();
  const { toast } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Skill>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile?.skills) {
      // Handle both string array and object array formats
      const formattedSkills = profile.skills.map((skill: any, index: number) => {
        if (typeof skill === 'string') {
          return {
            id: `skill-${index}`,
            name: skill,
            level: 'Intermediate' // Default level for string skills
          };
        }
        return skill;
      });
      setSkills(formattedSkills);
    } else {
      setSkills([]);
    }
  }, [profile]);

  const levels = ["Beginner", "Intermediate", "Advanced", "Expert"];

  const handleAddSkill = async () => {
    try {
      setErrors({});
      const result = skillSchema.safeParse(formData);
      
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

      const newSkill: Skill = {
        ...formData as Skill,
        id: Date.now().toString()
      };
      const updatedSkills = [...skills, newSkill];
      await candidateAPI.updateProfile({ 
        resume: {
          skills: updatedSkills
        }
      });
      setSkills(updatedSkills);
      setFormData({});
      setErrors({});
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Skill added successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add skill. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveSkill = async (id: string) => {
    try {
      const updatedSkills = skills.filter(skill => skill.id !== id);
      await candidateAPI.updateProfile({ 
        resume: {
          skills: updatedSkills
        }
      });
      setSkills(updatedSkills);
      toast({
        title: "Success",
        description: "Skill removed successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove skill. Please try again.",
        variant: "destructive",
      });
    }
  };



  const getLevelColor = (level: string) => {
    switch (level) {
      case "Expert": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "Advanced": return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };



  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Skills</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Showcase your technical and professional expertise</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Skill</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="skillName">Skill Name</Label>
                <Input
                  id="skillName"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., JavaScript, Project Management"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
              


              <div className="space-y-2">
                <Label htmlFor="level">Proficiency Level</Label>
                <Select value={formData.level || ""} onValueChange={(value) => setFormData({...formData, level: value})}>
                  <SelectTrigger className={errors.level ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.level && <p className="text-sm text-red-500">{errors.level}</p>}
              </div>



              <div className="flex gap-3 pt-4">
                <Button onClick={handleAddSkill} disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Add Skill
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={loading}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Skills Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{skills.length}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">Total Skills</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {skills.filter(s => s.level === "Expert").length}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">Expert Level</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {skills.filter(s => s.level === "Advanced" || s.level === "Expert").length}
                </p>
                <p className="text-sm text-purple-600 dark:text-purple-400">Advanced+</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills List */}
      <div className="space-y-6">
        {skills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                All Skills
                <Badge variant="secondary" className="ml-2">
                  {skills.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <div
                    key={skill.id || `skill-${index}`}
                    className="group relative flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {skill.name}
                        </span>
                        <Badge className={getLevelColor(skill.level)} variant="secondary">
                          {skill.level}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSkill(skill.id!)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SkillsPage;