"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Mail, MessageSquare, Smartphone, Calendar, Users, Briefcase, Save } from "lucide-react";
import { useState } from "react";

export default function NotificationSettingsPage() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);

  const notificationCategories = [
    {
      category: "Applications",
      icon: Users,
      description: "Notifications about job applications",
      settings: [
        { name: "New Applications", email: true, sms: false, push: true, description: "When someone applies to your jobs" },
        { name: "Application Updates", email: true, sms: false, push: false, description: "When applicants update their status" },
        { name: "Bulk Applications", email: false, sms: false, push: true, description: "Daily summary of applications" }
      ]
    },
    {
      category: "Interviews",
      icon: Calendar,
      description: "Interview scheduling and reminders",
      settings: [
        { name: "Interview Scheduled", email: true, sms: true, push: true, description: "When interviews are scheduled" },
        { name: "Interview Reminders", email: true, sms: true, push: true, description: "Reminders before interviews" },
        { name: "Interview Feedback", email: true, sms: false, push: true, description: "When feedback is submitted" }
      ]
    },
    {
      category: "Jobs",
      icon: Briefcase,
      description: "Job posting and management updates",
      settings: [
        { name: "Job Published", email: true, sms: false, push: true, description: "When your jobs go live" },
        { name: "Job Expiring", email: true, sms: false, push: false, description: "When jobs are about to expire" },
        { name: "Job Performance", email: false, sms: false, push: false, description: "Weekly job performance reports" }
      ]
    },
    {
      category: "Team",
      icon: Users,
      description: "Team and collaboration updates",
      settings: [
        { name: "Team Invitations", email: true, sms: false, push: true, description: "When team members are invited" },
        { name: "Role Changes", email: true, sms: false, push: false, description: "When team roles are updated" },
        { name: "Team Activity", email: false, sms: false, push: false, description: "Daily team activity summary" }
      ]
    }
  ];

  const recentNotifications = [
    {
      id: 1,
      title: "New Application Received",
      message: "Sarah Johnson applied for Senior Frontend Developer",
      time: "2 minutes ago",
      type: "application",
      read: false
    },
    {
      id: 2,
      title: "Interview Reminder",
      message: "Interview with Michael Chen in 30 minutes",
      time: "28 minutes ago",
      type: "interview",
      read: false
    },
    {
      id: 3,
      title: "Job Performance Update",
      message: "Your Product Manager job has 15 new views",
      time: "2 hours ago",
      type: "job",
      read: true
    },
    {
      id: 4,
      title: "Team Member Added",
      message: "Emily Rodriguez joined your team as Hiring Manager",
      time: "1 day ago",
      type: "team",
      read: true
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "application":
        return <Users className="w-4 h-4 text-blue-500" />;
      case "interview":
        return <Calendar className="w-4 h-4 text-green-500" />;
      case "job":
        return <Briefcase className="w-4 h-4 text-purple-500" />;
      case "team":
        return <Users className="w-4 h-4 text-orange-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notification Settings</h1>
          <p className="text-muted-foreground">Manage how and when you receive notifications</p>
        </div>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>

      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-sm text-muted-foreground">john.doe@company.com</p>
                </div>
              </div>
              <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="w-8 h-8 text-green-500" />
                <div>
                  <h3 className="font-semibold">SMS</h3>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              <Switch checked={smsEnabled} onCheckedChange={setSmsEnabled} />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="w-8 h-8 text-purple-500" />
                <div>
                  <h3 className="font-semibold">Push</h3>
                  <p className="text-sm text-muted-foreground">Browser & Mobile</p>
                </div>
              </div>
              <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="preferences" className="space-y-6">
        <TabsList>
          <TabsTrigger value="preferences">Notification Preferences</TabsTrigger>
          <TabsTrigger value="recent">Recent Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="preferences" className="space-y-6">
          {notificationCategories.map((category) => (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="w-5 h-5" />
                  {category.category}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.settings.map((setting) => (
                    <div key={setting.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{setting.name}</h4>
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <Switch 
                            checked={setting.email && emailEnabled} 
                            disabled={!emailEnabled}
                            size="sm"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-muted-foreground" />
                          <Switch 
                            checked={setting.sms && smsEnabled} 
                            disabled={!smsEnabled}
                            size="sm"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-muted-foreground" />
                          <Switch 
                            checked={setting.push && pushEnabled} 
                            disabled={!pushEnabled}
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`flex items-start gap-4 p-4 border rounded-lg ${!notification.read ? 'bg-blue-50 border-blue-200' : ''}`}
                  >
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{notification.title}</h4>
                        {!notification.read && (
                          <Badge variant="default" className="text-xs">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Mark as Read
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline">
              <Bell className="w-4 h-4 mr-2" />
              Test Notifications
            </Button>
            <Button variant="outline">
              Mark All as Read
            </Button>
            <Button variant="outline">
              Clear All Notifications
            </Button>
            <Button variant="outline">
              Export Notification History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}