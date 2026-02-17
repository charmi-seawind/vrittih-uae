"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
  Trash2,
  Briefcase,
  UserCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { API_CONFIG } from "@/lib/config";
import { adminAPI } from "@/services/api";
import { toast } from "sonner";

const PendingEmployerDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [pendingUser, setPendingUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  const fetchPlans = async () => {
    try {
      const response = await adminAPI.getPlansByUserType("employer");
      setPlans(response.data.plans || []);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    }
  };

  const handleConvert = async () => {
    if (!pendingUser?.id) return;
    setShowPlanDialog(true);
  };

  const handleConfirmConvert = async () => {
    if (!pendingUser?.id) return;

    setConverting(true);
    try {
      const planId = selectedPlan === "none" ? undefined : selectedPlan;
      await adminAPI.convertPendingUser(pendingUser.id, planId);
      toast.success("Pending employer converted to active user successfully!");
      router.push("/admin/pending-users/employers");
    } catch (error: any) {
      toast.error(error.message || "Failed to convert user");
    } finally {
      setConverting(false);
      setShowPlanDialog(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchPendingUserDetails();
      fetchPlans();
    }
  }, [params.id]);

  const handleDelete = async () => {
    if (!pendingUser?.id) return;

    if (
      !confirm(
        `Are you sure you want to delete ${pendingUser.full_name}? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setDeleting(pendingUser.id);
    try {
      const response = await fetch(
        `${API_CONFIG.API_URL}/admin/pending-users/${pendingUser.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        router.push("/admin/pending-users/employers");
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeleting(null);
    }
  };

  const fetchPendingUserDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_CONFIG.API_URL}/admin/pending-users/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setPendingUser(data.data.user);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!pendingUser) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">Pending employer not found</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{pendingUser.full_name}</h1>
            <p className="text-gray-600">Pending Employer Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleConvert}
            disabled={converting}
            className="bg-green-600 hover:bg-green-700"
          >
            {converting ? (
              "Converting..."
            ) : (
              <>
                <UserCheck className="h-4 w-4 mr-2" />
                Create User
              </>
            )}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting === pendingUser.id}
          >
            {deleting === pendingUser.id ? (
              "Deleting..."
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete User
              </>
            )}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Email:</span>
              <span>{pendingUser.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Mobile:</span>
              <span>{pendingUser.mobile || "Not provided"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              <Badge className="bg-yellow-100 text-yellow-800">PENDING</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Created:</span>
              <span>
                {new Date(pendingUser.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Company Name:</span>
              <span>{pendingUser.company_name || "Not provided"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Company Size:</span>
              <span>{pendingUser.company_size || "Not provided"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Industry:</span>
              <span>{pendingUser.industry || "Not provided"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Founded Year:</span>
              <span>{pendingUser.founded_year || "Not provided"}</span>
            </div>
            {pendingUser.website_url && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Website:</span>
                <a
                  href={pendingUser.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {pendingUser.website_url}
                </a>
              </div>
            )}
          </div>

          {pendingUser.basic_info &&
            Object.keys(pendingUser.basic_info).length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="font-medium">Additional Info:</h4>
                {pendingUser.basic_info.is_consultancy && (
                  <div>
                    <span className="font-medium">Type:</span> Consultancy
                  </div>
                )}
              </div>
            )}
        </CardContent>
      </Card>

      {pendingUser.education_experience && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Company Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingUser.education_experience.address && (
                <div>
                  <span className="font-medium">Address:</span>
                  <p className="text-gray-600">
                    {pendingUser.education_experience.address}
                  </p>
                </div>
              )}
              {pendingUser.education_experience.city && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="font-medium">City:</span>
                    <p className="text-gray-600">
                      {pendingUser.education_experience.city}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">State:</span>
                    <p className="text-gray-600">
                      {pendingUser.education_experience.state || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Zip Code:</span>
                    <p className="text-gray-600">
                      {pendingUser.education_experience.zip_code ||
                        "Not provided"}
                    </p>
                  </div>
                </div>
              )}
              {pendingUser.education_experience.about_company && (
                <div>
                  <span className="font-medium">About Company:</span>
                  <p className="text-gray-600 mt-1">
                    {pendingUser.education_experience.about_company}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {pendingUser.basic_info && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Job Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingUser.basic_info.job_title && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Job Title:</span>
                    <p className="text-gray-600">
                      {pendingUser.basic_info.job_title}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Job Category:</span>
                    <p className="text-gray-600">
                      {pendingUser.basic_info.job_category || "Not provided"}
                    </p>
                  </div>
                </div>
              )}
              {pendingUser.basic_info.job_type && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Job Type:</span>
                    <p className="text-gray-600">
                      {pendingUser.basic_info.job_type}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Work Location:</span>
                    <p className="text-gray-600">
                      {pendingUser.basic_info.work_location_type ||
                        "Not provided"}
                    </p>
                  </div>
                </div>
              )}
              {pendingUser.basic_info.pay_amount && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Pay Type:</span>
                    <p className="text-gray-600">
                      {pendingUser.basic_info.pay_type || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Pay Amount:</span>
                    <p className="text-gray-600">
                      {pendingUser.basic_info.pay_amount}
                    </p>
                  </div>
                </div>
              )}
              {pendingUser.basic_info.job_description && (
                <div>
                  <span className="font-medium">Job Description:</span>
                  <p className="text-gray-600 mt-1">
                    {pendingUser.basic_info.job_description}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Selection Dialog */}
      <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Plan for {pendingUser?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Choose a plan (optional):
              </label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger>
                  <SelectValue placeholder="No plan (user can select later)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    No plan (user can select later)
                  </SelectItem>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id.toString()}>
                      {plan.name} - ${plan.price} ({plan.duration} days)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowPlanDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmConvert}
                disabled={converting}
                className="bg-green-600 hover:bg-green-700"
              >
                {converting ? "Converting..." : "Convert User"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingEmployerDetailPage;
