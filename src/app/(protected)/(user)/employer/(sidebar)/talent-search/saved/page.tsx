"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Search, Filter, MapPin, Briefcase, Mail, Phone, Eye, Trash2, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function SavedProfilesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const savedProfiles = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Senior Frontend Developer",
      location: "San Francisco, CA",
      experience: "5+ years",
      skills: ["React", "TypeScript", "Node.js", "GraphQL"],
      avatar: "/avatars/sarah.jpg",
      savedDate: "2024-01-15",
      matchScore: 95,
      email: "sarah.j@email.com",
      phone: "+1 (555) 123-4567",
      summary: "Experienced frontend developer with expertise in React ecosystem and modern web technologies."
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Full Stack Developer",
      location: "Remote",
      experience: "7+ years",
      skills: ["Python", "Django", "React", "AWS"],
      avatar: "/avatars/michael.jpg",
      savedDate: "2024-01-12",
      matchScore: 88,
      email: "m.chen@email.com",
      phone: "+1 (555) 987-6543",
      summary: "Full-stack developer with strong backend expertise and cloud infrastructure knowledge."
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      title: "UX/UI Designer",
      location: "New York, NY",
      experience: "4+ years",
      skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
      avatar: "/avatars/emily.jpg",
      savedDate: "2024-01-10",
      matchScore: 92,
      email: "emily.r@email.com",
      phone: "+1 (555) 456-7890",
      summary: "Creative UX/UI designer with a passion for user-centered design and innovative solutions."
    },
    {
      id: 4,
      name: "David Kim",
      title: "DevOps Engineer",
      location: "Seattle, WA",
      experience: "6+ years",
      skills: ["Docker", "Kubernetes", "AWS", "Terraform"],
      avatar: "/avatars/david.jpg",
      savedDate: "2024-01-08",
      matchScore: 85,
      email: "d.kim@email.com",
      phone: "+1 (555) 321-0987",
      summary: "DevOps engineer specializing in cloud infrastructure and container orchestration."
    }
  ];

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50";
    if (score >= 80) return "text-blue-600 bg-blue-50";
    if (score >= 70) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Saved Profiles</h1>
          <p className="text-muted-foreground">Manage your saved candidate profiles</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Search className="w-4 h-4 mr-2" />
            Search More
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Saved</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contacted</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Match</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">90+</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">6</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">+6</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search saved profiles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {savedProfiles.map((profile) => (
          <Card key={profile.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{profile.name}</h3>
                    <p className="text-muted-foreground mb-2">{profile.title}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{profile.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        <span>{profile.experience}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(profile.matchScore)}`}>
                    {profile.matchScore}% match
                  </div>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {profile.summary}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {profile.skills.slice(0, 4).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {profile.skills.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{profile.skills.length - 4} more
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-xs text-muted-foreground">
                  Saved on {profile.savedDate}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                  <Button size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {savedProfiles.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Saved Profiles</h3>
            <p className="text-muted-foreground mb-4">
              Start saving candidate profiles to build your talent pipeline.
            </p>
            <Button>
              <Search className="w-4 h-4 mr-2" />
              Search Candidates
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}