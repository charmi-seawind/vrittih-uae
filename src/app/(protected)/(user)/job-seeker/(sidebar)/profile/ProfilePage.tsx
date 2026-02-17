"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Calendar, GraduationCap, Briefcase, Award, Loader2, FolderOpen, FileText } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useState, useEffect } from "react";

const ProfilePage = () => {
  const { profile, loading, error } = useProfile();
  const [uploadedResume, setUploadedResume] = useState(null);

  useEffect(() => {
    const resume = localStorage.getItem('uploadedResume');
    if (resume) {
      setUploadedResume(resume);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading profile: {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-4">
        No profile data found
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Overview</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Complete view of your profile information</p>
      </div>

      {/* Profile Summary Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage src={profile.profile_image || "/avatar-placeholder.png"} alt="Profile" />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                {profile.full_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile.full_name || "No name provided"}
              </h2>
              <div className="flex items-center gap-4 mt-2 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{profile.email || "No email"}</span>
                </div>
                {profile.mobile && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{profile.mobile}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{profile.location}</span>
                  </div>
                )}
              </div>
              {profile.date_of_birth && (
                <div className="flex items-center gap-1 mt-1 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Born: {new Date(profile.date_of_birth).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
          {profile.bio && (
            <div className="mt-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">{profile.bio}</p>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Education Section */}
      {profile.education && profile.education.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.education.map((edu, index) => (
              <div key={edu.id || index} className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">{edu.degree}</h3>
                <p className="text-gray-600 dark:text-gray-400">{edu.institution}</p>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span>Year: {edu.year_of_completion}</span>
                  {edu.percentage && <span>Score: {edu.percentage}%</span>}
                  {edu.location && <span>Location: {edu.location}</span>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Experience Section */}
      {profile.experience && profile.experience.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-green-600" />
              Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.experience.map((exp, index) => (
              <div key={exp.id || index} className="border-l-4 border-green-500 pl-4 py-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{exp.position}</h3>
                  {exp.is_current && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Current
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400">{exp.company}</p>
                <div className="text-sm text-gray-500 mt-1">
                  {new Date(exp.start_date).toLocaleDateString()} - {
                    exp.is_current ? "Present" : 
                    exp.end_date ? new Date(exp.end_date).toLocaleDateString() : "Not specified"
                  }
                </div>
                {exp.description && (
                  <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm">{exp.description}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Skills Section */}
      {profile.skills && profile.skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <Badge 
                  key={skill.id || index} 
                  variant="outline" 
                  className="px-3 py-1"
                >
                  {skill.name} 
                  {skill.level && (
                    <span className="ml-1 text-xs text-gray-500">({skill.level})</span>
                  )}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects Section */}
      {profile.projects && profile.projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-orange-600" />
              Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.projects.map((project, index) => (
              <div key={project.id || index} className="border-l-4 border-orange-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.technologies.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Certifications Section */}
      {profile.certifications && profile.certifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.certifications.map((cert, index) => (
              <div key={cert.id || index} className="border-l-4 border-indigo-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">{cert.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{cert.issuingOrganization}</p>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                  {cert.expiryDate && (
                    <span>Expires: {new Date(cert.expiryDate).toLocaleDateString()}</span>
                  )}
                  {!cert.isExpired && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                      Valid
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Resume Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-600" />
            Resume
          </CardTitle>
        </CardHeader>
        <CardContent>
          {uploadedResume ? (
            <div className="border rounded-lg p-4">
              <embed src={uploadedResume} type="application/pdf" width="100%" height="600px" />
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Resume Uploaded
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Upload your resume during registration to view it here
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Empty State */}
      {(!profile.education || profile.education.length === 0) && 
       (!profile.experience || profile.experience.length === 0) && 
       (!profile.skills || profile.skills.length === 0) &&
       (!profile.projects || profile.projects.length === 0) &&
       (!profile.certifications || profile.certifications.length === 0) && (
        <Card>
          <CardContent className="text-center py-8">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Complete Your Profile
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Add your education, experience, skills, projects, and certifications to make your profile stand out.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;