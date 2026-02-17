"use client";

import { useEffect, useState } from 'react';

const QuickFix = () => {
  const [workExp, setWorkExp] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    // Check localStorage for all data
    const expData = localStorage.getItem('workExperience') || localStorage.getItem('experience');
    const projData = localStorage.getItem('projects');
    
    if (expData) {
      try {
        const parsed = JSON.parse(expData);
        setWorkExp(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
      }
    }
    
    if (projData) {
      try {
        const parsed = JSON.parse(projData);
        setProjects(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
      }
    }
  }, []);

  if (workExp.length === 0 && projects.length === 0) return null;

  return (
    <div className="mt-4 space-y-4">
      {workExp.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Work Experience (Local)</h4>
          <div className="space-y-2">
            {workExp.map((exp: any, index: number) => (
              <div key={index} className="text-xs bg-blue-50 p-2 rounded">
                <div className="font-medium">{exp.position || exp.jobTitle}</div>
                <div className="text-gray-600">{exp.companyName || exp.company}</div>
                {exp.location && <div className="text-gray-500">📍 {exp.location}</div>}
                {exp.startDate && (
                  <div className="text-gray-500">
                    📅 {new Date(exp.startDate).toLocaleDateString()} - 
                    {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                  </div>
                )}
                {exp.achievements && (
                  <div className="text-gray-500 mt-1">
                    <span className="font-medium">🏆 Achievements:</span> {exp.achievements}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {projects.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Projects (Local)</h4>
          <div className="space-y-2">
            {projects.map((proj: any, index: number) => (
              <div key={index} className="text-xs bg-green-50 p-2 rounded">
                <div className="font-medium">{proj.title}</div>
                <div className="text-gray-600">{proj.description?.substring(0, 60)}...</div>
                {proj.startDate && (
                  <div className="text-gray-500">
                    📅 {new Date(proj.startDate).toLocaleDateString()} - 
                    {proj.endDate ? new Date(proj.endDate).toLocaleDateString() : (proj.isOngoing ? 'Present' : 'Completed')}
                  </div>
                )}
                {proj.projectUrl && (
                  <div className="text-blue-500">
                    🔗 <a href={proj.projectUrl} target="_blank" rel="noopener noreferrer">View Project</a>
                  </div>
                )}
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="text-gray-500 mt-1">
                    <span className="font-medium">💻 Tech:</span> {proj.technologies.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickFix;