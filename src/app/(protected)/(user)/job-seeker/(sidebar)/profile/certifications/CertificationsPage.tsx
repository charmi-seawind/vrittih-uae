"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Award, Plus, Edit3, Trash2, ExternalLink, Calendar, Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { candidateAPI } from "@/services/api";
import { certificationSchema, type CertificationFormData } from "@/lib/validations/profile";

type Certification = {
  id?: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  isExpired?: boolean;
};

const CertificationsPage = () => {
  const { profile, loading } = useProfile();

  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const [formData, setFormData] = useState<Partial<Certification>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile?.certifications) {
      setCertifications(profile.certifications);
    }
  }, [profile]);

  const handleAddNew = () => {
    setEditingCertification(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleEdit = (certification: Certification) => {
    setEditingCertification(certification);
    setFormData(certification);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      setErrors({});
      const result = certificationSchema.safeParse(formData);
      
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

      let updatedCertifications;
      if (editingCertification) {
        updatedCertifications = certifications.map(cert => 
          cert.id === editingCertification.id ? { ...formData as Certification } : cert
        );
      } else {
        const newCertification: Certification = {
          ...formData as Certification,
          id: Date.now().toString()
        };
        updatedCertifications = [newCertification, ...certifications];
      }
      
      await candidateAPI.updateProfile({ 
        resume: {
          certifications: updatedCertifications
        }
      });
      setCertifications(updatedCertifications);
      setIsDialogOpen(false);
      setFormData({});
      setErrors({});
      toast.success(editingCertification ? "Certification updated successfully!" : "Certification added successfully!", { id: "certification-save" });
    } catch (error) {
      toast.error("Failed to save certification. Please try again.", { id: "certification-save" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;
    
    try {
      const updatedCertifications = certifications.filter(cert => cert.id !== id);
      await candidateAPI.updateProfile({ 
        resume: {
          certifications: updatedCertifications
        }
      });
      setCertifications(updatedCertifications);
      toast.success("Certification deleted successfully!", { id: "certification-delete" });
    } catch (error) {
      toast.error("Failed to delete certification. Please try again.", { id: "certification-delete" });
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Certifications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Showcase your professional certifications</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Certification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCertification ? "Edit Certification" : "Add New Certification"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Certification Name</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., AWS Certified Solutions Architect"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issuingOrganization">Issuing Organization</Label>
                  <Input
                    id="issuingOrganization"
                    value={formData.issuingOrganization || ""}
                    onChange={(e) => setFormData({...formData, issuingOrganization: e.target.value})}
                    placeholder="e.g., Amazon Web Services"
                    className={errors.issuingOrganization ? "border-red-500" : ""}
                  />
                  {errors.issuingOrganization && <p className="text-sm text-red-500">{errors.issuingOrganization}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={formData.issueDate || ""}
                    onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                    className={errors.issueDate ? "border-red-500" : ""}
                  />
                  {errors.issueDate && <p className="text-sm text-red-500">{errors.issueDate}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate || ""}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="credentialId">Credential ID (Optional)</Label>
                  <Input
                    id="credentialId"
                    value={formData.credentialId || ""}
                    onChange={(e) => setFormData({...formData, credentialId: e.target.value})}
                    placeholder="e.g., ABC123XYZ"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credentialUrl">Credential URL (Optional)</Label>
                  <Input
                    id="credentialUrl"
                    value={formData.credentialUrl || ""}
                    onChange={(e) => setFormData({...formData, credentialUrl: e.target.value})}
                    placeholder="https://credential-verification-url.com"
                    className={errors.credentialUrl ? "border-red-500" : ""}
                  />
                  {errors.credentialUrl && <p className="text-sm text-red-500">{errors.credentialUrl}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe what this certification covers..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {editingCertification ? "Update" : "Add"} Certification
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={loading}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {certifications.length > 0 && (
        <div className="grid gap-6">
          {certifications.map((cert, index) => (
            <Card key={cert.id || index} className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-gray-900 dark:text-white">
                      {cert.name}
                    </CardTitle>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                      {cert.issuingOrganization}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Issued: {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'Not specified'}
                        </span>
                      </div>
                      {cert.expiryDate && (
                        <span>
                          Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                        </span>
                      )}
                      {cert.isExpired && (
                        <Badge variant="destructive">
                          Expired
                        </Badge>
                      )}
                      {!cert.isExpired && cert.expiryDate && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Valid
                        </Badge>
                      )}
                      {!cert.expiryDate && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          No Expiry
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(cert)}
                      className="text-gray-600 hover:text-blue-600"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(cert.id)}
                      className="text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {cert.description && (
                  <p className="text-gray-700 dark:text-gray-300">
                    {cert.description}
                  </p>
                )}
                
                {cert.credentialId && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Credential ID:</h4>
                    <p className="text-gray-600 dark:text-gray-400 font-mono text-sm">
                      {cert.credentialId}
                    </p>
                  </div>
                )}

                {cert.credentialUrl && (
                  <div className="pt-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Credential
                      </a>
                    </Button>
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

export default CertificationsPage;