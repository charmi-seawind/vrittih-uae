"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { adminAPI } from "@/services/api";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";

const PlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    features: {
      cv_uploads: 1,
      job_applications: 3,
      job_withdrawals: 0,
      featured_jobs_access: false,
      job_posts: 5,
      featured_jobs: 0,
      featured_company: false
    },
    user_type: "employer",
    is_active: true
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllPlans();
      setPlans(response.data.plans);
    } catch (error) {
      toast.error("Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const planData = {
        ...formData,
        features: formData.features
      };
      await adminAPI.createPlan(planData);
      toast.success("Plan created successfully");
      setIsCreateOpen(false);
      resetForm();
      fetchPlans();
    } catch (error) {
      toast.error("Failed to create plan");
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    try {
      const planData = {
        ...formData,
        features: formData.features
      };
      await adminAPI.updatePlan(editingPlan.id, planData);
      toast.success("Plan updated successfully");
      setIsEditOpen(false);
      resetForm();
      fetchPlans();
    } catch (error) {
      toast.error("Failed to update plan");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      try {
        await adminAPI.deletePlan(id);
        toast.success("Plan deleted successfully");
        fetchPlans();
      } catch (error) {
        toast.error("Failed to delete plan");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "",
      features: {
        cv_uploads: 1,
        job_applications: 3,
        job_withdrawals: 0,
        featured_jobs_access: false,
        job_posts: 5,
        featured_jobs: 0,
        featured_company: false
      },
      user_type: "employer",
      is_active: true
    });
    setEditingPlan(null);
  };

  const openEditDialog = (plan: any) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description || "",
      price: plan.price.toString(),
      duration: plan.duration.toString(),
      features: plan.features || {
        cv_uploads: 1,
        job_applications: 3,
        job_withdrawals: 0,
        featured_jobs_access: false,
        job_posts: 5,
        featured_jobs: 0,
        featured_company: false
      },
      user_type: plan.user_type || "employer",
      is_active: plan.is_active
    });
    setIsEditOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading plans...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Plans Management</h1>
          <p className="text-gray-600 mt-1">Create and manage subscription plans</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Plan</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="name">Plan Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Plan description for users"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  required
                />
              </div>
              {formData.user_type === 'job_seeker' && (
                <div className="space-y-4">
                  <Label>Job Seeker Features</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cv_uploads">CV Uploads</Label>
                      <Input
                        id="cv_uploads"
                        type="number"
                        min="0"
                        value={formData.features.cv_uploads}
                        onChange={(e) => setFormData({...formData, features: {...formData.features, cv_uploads: parseInt(e.target.value)}})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="job_applications">Job Applications</Label>
                      <Input
                        id="job_applications"
                        type="number"
                        min="0"
                        value={formData.features.job_applications}
                        onChange={(e) => setFormData({...formData, features: {...formData.features, job_applications: parseInt(e.target.value)}})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="job_withdrawals">Job Withdrawals</Label>
                      <Input
                        id="job_withdrawals"
                        type="number"
                        min="0"
                        value={formData.features.job_withdrawals}
                        onChange={(e) => setFormData({...formData, features: {...formData.features, job_withdrawals: parseInt(e.target.value)}})}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured_jobs_access"
                        checked={formData.features.featured_jobs_access}
                        onCheckedChange={(checked) => setFormData({...formData, features: {...formData.features, featured_jobs_access: checked}})}
                      />
                      <Label htmlFor="featured_jobs_access">Featured Jobs Access</Label>
                    </div>
                  </div>
                </div>
              )}
              {formData.user_type === 'employer' && (
                <div className="space-y-4">
                  <Label>Employer Features</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="job_posts">Job Posts (-1 for unlimited)</Label>
                      <Input
                        id="job_posts"
                        type="number"
                        min="-1"
                        value={formData.features.job_posts}
                        onChange={(e) => setFormData({...formData, features: {...formData.features, job_posts: parseInt(e.target.value)}})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="featured_jobs">Featured Jobs (-1 for unlimited)</Label>
                      <Input
                        id="featured_jobs"
                        type="number"
                        min="-1"
                        value={formData.features.featured_jobs}
                        onChange={(e) => setFormData({...formData, features: {...formData.features, featured_jobs: parseInt(e.target.value)}})}
                      />
                    </div>
                    <div className="flex items-center space-x-2 col-span-2">
                      <Switch
                        id="featured_company"
                        checked={formData.features.featured_company}
                        onCheckedChange={(checked) => setFormData({...formData, features: {...formData.features, featured_company: checked}})}
                      />
                      <Label htmlFor="featured_company">Featured Company (Priority in browse jobs)</Label>
                    </div>
                  </div>
                </div>
              )}
              <div>
                <Label>Plan Type</Label>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="create-employer"
                      checked={formData.user_type === "employer"}
                      onChange={() => {
                        setFormData(prev => ({...prev, user_type: "employer"}));
                      }}
                    />
                    <Label htmlFor="create-employer">Employer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="create-job_seeker"
                      checked={formData.user_type === "job_seeker"}
                      onChange={() => {
                        setFormData(prev => ({...prev, user_type: "job_seeker"}));
                      }}
                    />
                    <Label htmlFor="create-job_seeker">Job Seeker</Label>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">Current: {formData.user_type}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <Button type="submit" className="w-full">Create Plan</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Plans ({plans.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan: any) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{plan.description || 'No description'}</TableCell>
                  <TableCell>₹{plan.price}</TableCell>
                  <TableCell>{plan.duration} days</TableCell>
                  <TableCell>
                    <Badge className={plan.user_type === "employer" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}>
                      {plan.user_type === "employer" ? "Employer" : "Job Seeker"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {plan.user_type === 'job_seeker' && plan.features ? (
                      <div className="text-xs space-y-1">
                        <div>CV: {plan.features.cv_uploads || 1}</div>
                        <div>Apps: {plan.features.job_applications || 3}</div>
                        <div>Withdrawals: {plan.features.job_withdrawals || 0}</div>
                        <div>Featured: {plan.features.featured_jobs_access ? 'Yes' : 'No'}</div>
                      </div>
                    ) : plan.user_type === 'employer' && plan.features ? (
                      <div className="text-xs space-y-1">
                        <div>Posts: {plan.features.job_posts === -1 ? 'Unlimited' : plan.features.job_posts || 5}</div>
                        <div>Featured: {plan.features.featured_jobs === -1 ? 'Unlimited' : plan.features.featured_jobs || 0}</div>
                        <div>Company: {plan.features.featured_company ? 'Yes' : 'No'}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Standard</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={plan.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {plan.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(plan)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(plan.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Plan Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                placeholder="Plan description for users"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-price">Price</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-duration">Duration (days)</Label>
              <Input
                id="edit-duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                required
              />
            </div>
            {formData.user_type === 'job_seeker' && (
              <div className="space-y-4">
                <Label>Job Seeker Features</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_cv_uploads">CV Uploads</Label>
                    <Input
                      id="edit_cv_uploads"
                      type="number"
                      min="0"
                      value={formData.features.cv_uploads}
                      onChange={(e) => setFormData({...formData, features: {...formData.features, cv_uploads: parseInt(e.target.value)}})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_job_applications">Job Applications</Label>
                    <Input
                      id="edit_job_applications"
                      type="number"
                      min="0"
                      value={formData.features.job_applications}
                      onChange={(e) => setFormData({...formData, features: {...formData.features, job_applications: parseInt(e.target.value)}})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_job_withdrawals">Job Withdrawals</Label>
                    <Input
                      id="edit_job_withdrawals"
                      type="number"
                      min="0"
                      value={formData.features.job_withdrawals}
                      onChange={(e) => setFormData({...formData, features: {...formData.features, job_withdrawals: parseInt(e.target.value)}})}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit_featured_jobs_access"
                      checked={formData.features.featured_jobs_access}
                      onCheckedChange={(checked) => setFormData({...formData, features: {...formData.features, featured_jobs_access: checked}})}
                    />
                    <Label htmlFor="edit_featured_jobs_access">Featured Jobs Access</Label>
                  </div>
                </div>
              </div>
            )}
            {formData.user_type === 'employer' && (
              <div className="space-y-4">
                <Label>Employer Features</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_job_posts">Job Posts (-1 for unlimited)</Label>
                    <Input
                      id="edit_job_posts"
                      type="number"
                      min="-1"
                      value={formData.features.job_posts}
                      onChange={(e) => setFormData({...formData, features: {...formData.features, job_posts: parseInt(e.target.value)}})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_featured_jobs">Featured Jobs (-1 for unlimited)</Label>
                    <Input
                      id="edit_featured_jobs"
                      type="number"
                      min="-1"
                      value={formData.features.featured_jobs}
                      onChange={(e) => setFormData({...formData, features: {...formData.features, featured_jobs: parseInt(e.target.value)}})}
                    />
                  </div>
                  <div className="flex items-center space-x-2 col-span-2">
                    <Switch
                      id="edit_featured_company"
                      checked={formData.features.featured_company}
                      onCheckedChange={(checked) => setFormData({...formData, features: {...formData.features, featured_company: checked}})}
                    />
                    <Label htmlFor="edit_featured_company">Featured Company (Priority in browse jobs)</Label>
                  </div>
                </div>
              </div>
            )}
            <div>
              <Label>Plan Type</Label>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="edit-employer"
                    checked={formData.user_type === "employer"}
                    onChange={() => {
                      setFormData(prev => ({...prev, user_type: "employer"}));
                    }}
                  />
                  <Label htmlFor="edit-employer">Employer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="edit-job_seeker"
                    checked={formData.user_type === "job_seeker"}
                    onChange={() => {
                      setFormData(prev => ({...prev, user_type: "job_seeker"}));
                    }}
                  />
                  <Label htmlFor="edit-job_seeker">Job Seeker</Label>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">Current: {formData.user_type}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
              />
              <Label htmlFor="edit-is_active">Active</Label>
            </div>
            <Button type="submit" className="w-full">Update Plan</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlansPage;