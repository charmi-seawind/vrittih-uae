"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Plus, Edit3, Trash2, Mail, Smartphone, Search, MapPin, DollarSign } from "lucide-react";

interface JobAlert {
  id: string;
  title: string;
  keywords: string;
  location: string;
  jobType: string;
  salaryRange: string;
  frequency: string;
  isActive: boolean;
  emailNotification: boolean;
  smsNotification: boolean;
  createdDate: string;
  lastTriggered: string;
  matchCount: number;
}

const JobAlertsPage = () => {
  const [alerts, setAlerts] = useState<JobAlert[]>([
    {
      id: "1",
      title: "React Developer Jobs",
      keywords: "React, JavaScript, Frontend",
      location: "Bangalore",
      jobType: "Full-time",
      salaryRange: "₹10-20 LPA",
      frequency: "Daily",
      isActive: true,
      emailNotification: true,
      smsNotification: false,
      createdDate: "2024-01-15",
      lastTriggered: "2024-01-20",
      matchCount: 12
    },
    {
      id: "2",
      title: "Full Stack Developer",
      keywords: "MERN, Node.js, MongoDB",
      location: "Mumbai",
      jobType: "Full-time",
      salaryRange: "₹15-25 LPA",
      frequency: "Weekly",
      isActive: true,
      emailNotification: true,
      smsNotification: true,
      createdDate: "2024-01-10",
      lastTriggered: "2024-01-18",
      matchCount: 8
    },
    {
      id: "3",
      title: "Remote DevOps Jobs",
      keywords: "DevOps, AWS, Docker, Kubernetes",
      location: "Remote",
      jobType: "Full-time",
      salaryRange: "₹20-30 LPA",
      frequency: "Daily",
      isActive: false,
      emailNotification: true,
      smsNotification: false,
      createdDate: "2024-01-05",
      lastTriggered: "2024-01-12",
      matchCount: 5
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<JobAlert | null>(null);
  const [formData, setFormData] = useState<Partial<JobAlert>>({});

  const handleAddNew = () => {
    setEditingAlert(null);
    setFormData({
      frequency: "Daily",
      isActive: true,
      emailNotification: true,
      smsNotification: false
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (alert: JobAlert) => {
    setEditingAlert(alert);
    setFormData(alert);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingAlert) {
      setAlerts(alerts.map(alert => 
        alert.id === editingAlert.id ? { ...formData as JobAlert } : alert
      ));
    } else {
      const newAlert: JobAlert = {
        ...formData as JobAlert,
        id: Date.now().toString(),
        createdDate: new Date().toISOString().split('T')[0],
        lastTriggered: "",
        matchCount: 0
      };
      setAlerts([newAlert, ...alerts]);
    }
    setIsDialogOpen(false);
    setFormData({});
  };

  const handleDelete = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Job Alerts</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Get notified when new jobs match your criteria</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingAlert ? "Edit Job Alert" : "Create New Job Alert"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Alert Title</Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., React Developer Jobs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input
                    id="keywords"
                    value={formData.keywords || ""}
                    onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                    placeholder="e.g., React, JavaScript, Frontend"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location || ""}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g., Bangalore, Remote"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobType">Job Type</Label>
                  <Select value={formData.jobType || ""} onValueChange={(value) => setFormData({...formData, jobType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryRange">Salary Range</Label>
                  <Select value={formData.salaryRange || ""} onValueChange={(value) => setFormData({...formData, salaryRange: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select salary range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="₹0-5 LPA">₹0-5 LPA</SelectItem>
                      <SelectItem value="₹5-10 LPA">₹5-10 LPA</SelectItem>
                      <SelectItem value="₹10-20 LPA">₹10-20 LPA</SelectItem>
                      <SelectItem value="₹20-30 LPA">₹20-30 LPA</SelectItem>
                      <SelectItem value="₹30+ LPA">₹30+ LPA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Notification Frequency</Label>
                <Select value={formData.frequency || ""} onValueChange={(value) => setFormData({...formData, frequency: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instant">Instant</SelectItem>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Notification Preferences</Label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <span>Email Notifications</span>
                  </div>
                  <Switch
                    checked={formData.emailNotification || false}
                    onCheckedChange={(checked) => setFormData({...formData, emailNotification: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-gray-600" />
                    <span>SMS Notifications</span>
                  </div>
                  <Switch
                    checked={formData.smsNotification || false}
                    onCheckedChange={(checked) => setFormData({...formData, smsNotification: checked})}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave}>
                  {editingAlert ? "Update" : "Create"} Alert
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{alerts.length}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">Total Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {alerts.filter(a => a.isActive).length}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">Active Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {alerts.reduce((sum, alert) => sum + alert.matchCount, 0)}
                </p>
                <p className="text-sm text-purple-600 dark:text-purple-400">Total Matches</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No Job Alerts Created
              </h3>
              <p className="text-gray-500 dark:text-gray-500 text-center mb-4">
                Create your first job alert to get notified about relevant opportunities
              </p>
              <Button onClick={handleAddNew} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Your First Alert
              </Button>
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl text-gray-900 dark:text-white">
                        {alert.title}
                      </CardTitle>
                      <Badge variant={alert.isActive ? "default" : "secondary"}>
                        {alert.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {alert.frequency}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Search className="w-4 h-4" />
                        <span>{alert.keywords}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{alert.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{alert.salaryRange}</span>
                      </div>
                      <div>
                        <span className="font-medium">{alert.matchCount}</span> matches found
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                      <span>Created: {formatDate(alert.createdDate)}</span>
                      <span>Last triggered: {formatDate(alert.lastTriggered)}</span>
                      <div className="flex items-center gap-2">
                        {alert.emailNotification && <Mail className="w-3 h-3" />}
                        {alert.smsNotification && <Smartphone className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Switch
                      checked={alert.isActive}
                      onCheckedChange={() => toggleAlert(alert.id)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(alert)}
                      className="text-gray-600 hover:text-blue-600"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(alert.id)}
                      className="text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default JobAlertsPage;