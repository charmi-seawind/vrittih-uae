"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminAPI } from "@/services/api";
import { toast } from "sonner";
import { ArrowLeft, User, Building } from "lucide-react";

const CreateUserPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string>("");
  const [plans, setPlans] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    mobile: "",
    password: "",
    company_name: "",
    plan_id: ""
  });

  const fetchPlans = async (userType: string) => {
    if (!userType) return;
    try {
      setLoadingPlans(true);
      const response = await adminAPI.getPlansByUserType(userType === 'candidate' ? 'job_seeker' : 'employer');
      setPlans(response.data.plans || []);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      setPlans([]);
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    setFormData(prev => ({ ...prev, plan_id: "" }));
    fetchPlans(newRole);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!role) {
      toast.error("Please select a user role");
      return;
    }

    if (!formData.full_name || !formData.email) {
      toast.error("Full name and email are required");
      return;
    }

    if (role === "employer" && !formData.company_name) {
      toast.error("Company name is required for employers");
      return;
    }

    setLoading(true);
    try {
      const userData = {
        ...formData,
        role,
        company_name: role === "employer" ? formData.company_name : undefined
      };

      const response = await adminAPI.createUser(userData);
      
      if (response.data.temporaryPassword) {
        toast.success(`User created! Temp password: ${response.data.temporaryPassword}`);
      } else {
        toast.success("User created successfully!");
      }
      
      // Reset form
      setFormData({
        full_name: "",
        email: "",
        mobile: "",
        password: "",
        company_name: "",
        plan_id: ""
      });
      setRole("");
      
    } catch (error: any) {
      toast.error(error.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create User</h1>
          <p className="text-gray-600 mt-1">Create new job seeker or employer</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>User Role *</Label>
              <Select value={role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="candidate">Job Seeker</SelectItem>
                  <SelectItem value="employer">Employer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => handleInputChange("full_name", e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mobile</Label>
                <Input
                  value={formData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  placeholder="Enter mobile"
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Auto-generated if blank"
                />
              </div>
            </div>

            {role === "employer" && (
              <div className="space-y-2">
                <Label>Company Name *</Label>
                <Input
                  value={formData.company_name}
                  onChange={(e) => handleInputChange("company_name", e.target.value)}
                  placeholder="Enter company name"
                  required
                />
              </div>
            )}

            {role && plans.length > 0 && (
              <div className="space-y-2">
                <Label>Plan (Optional)</Label>
                <Select value={formData.plan_id} onValueChange={(value) => handleInputChange("plan_id", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="No plan (user can select later)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No plan (user can select later)</SelectItem>
                    {plans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id.toString()}>
                        {plan.name} - ${plan.price} ({plan.duration} days)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create User"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setFormData({
                    full_name: "",
                    email: "",
                    mobile: "",
                    password: "",
                    company_name: "",
                    plan_id: ""
                  });
                  setRole("");
                }}
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateUserPage;