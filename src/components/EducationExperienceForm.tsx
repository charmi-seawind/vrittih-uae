import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Education {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  grade: string;
  description: string;
}

interface Experience {
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
  achievements: string[];
}

interface Project {
  title: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate: string;
  url: string;
}

interface Certification {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
}

interface FormData {
  education: Education[];
  experience: Experience[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
}

const EducationExperienceForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useLocalStorage('educationForm_currentStep', 1);
  const [formData, setFormData] = useLocalStorage<FormData>('educationForm_data', {
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: []
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: '',
        institution: '',
        location: '',
        startDate: '',
        endDate: '',
        grade: '',
        description: ''
      }]
    }));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        currentlyWorking: false,
        description: '',
        achievements: []
      }]
    }));
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        title: '',
        description: '',
        technologies: [],
        startDate: '',
        endDate: '',
        url: ''
      }]
    }));
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) => 
        i === index ? { ...proj, [field]: value } : proj
      )
    }));
  };

  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, {
        name: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        credentialId: ''
      }]
    }));
  };

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => 
        i === index ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const handleSkillsChange = (skills: string) => {
    setFormData(prev => ({
      ...prev,
      skills: skills.split(',').map(s => s.trim()).filter(s => s)
    }));
  };

  const submitForm = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const pendingUserId = localStorage.getItem('pendingUserId');
      
      
      if (!pendingUserId) {
        setMessage('Error: No pending user ID found. Please start registration again.');
        setLoading(false);
        return;
      }
      
      const response = await fetch('/api/job-seeker/save-education-experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pendingUserId,
          ...formData
        })
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('Data saved successfully!');
        
        // Clear all localStorage data after successful submission
        localStorage.removeItem('educationForm_data');
        localStorage.removeItem('educationForm_currentStep');
        localStorage.removeItem('pendingUserId');
        
        
        // Redirect to next step or dashboard after successful submission
        setTimeout(() => {
          window.location.href = '/job-seeker/dashboard';
        }, 2000);
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message || 'Failed to save data'}`);
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Network error'}`);
    } finally {
      setLoading(false);
    }
  };

  const renderEducationStep = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Education</h2>
      {formData.education.map((edu, index) => (
        <div key={index} className="border p-4 rounded">
          <input
            type="text"
            placeholder="Degree"
            value={edu.degree}
            onChange={(e) => updateEducation(index, 'degree', e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Institution"
            value={edu.institution}
            onChange={(e) => updateEducation(index, 'institution', e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Location"
            value={edu.location}
            onChange={(e) => updateEducation(index, 'location', e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input
              type="date"
              value={edu.startDate}
              onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="date"
              value={edu.endDate}
              onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
              className="p-2 border rounded"
            />
          </div>
          <input
            type="text"
            placeholder="Grade/CGPA"
            value={edu.grade}
            onChange={(e) => updateEducation(index, 'grade', e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            placeholder="Description"
            value={edu.description}
            onChange={(e) => updateEducation(index, 'description', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      ))}
      <button onClick={addEducation} className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Education
      </button>
    </div>
  );

  const renderExperienceStep = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Experience</h2>
      {formData.experience.map((exp, index) => (
        <div key={index} className="border p-4 rounded">
          <input
            type="text"
            placeholder="Job Title"
            value={exp.jobTitle}
            onChange={(e) => updateExperience(index, 'jobTitle', e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Company"
            value={exp.company}
            onChange={(e) => updateExperience(index, 'company', e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Location"
            value={exp.location}
            onChange={(e) => updateExperience(index, 'location', e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input
              type="date"
              value={exp.startDate}
              onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="date"
              value={exp.endDate}
              onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
              className="p-2 border rounded"
              disabled={exp.currentlyWorking}
            />
          </div>
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={exp.currentlyWorking}
              onChange={(e) => updateExperience(index, 'currentlyWorking', e.target.checked)}
              className="mr-2"
            />
            Currently Working
          </label>
          <textarea
            placeholder="Description"
            value={exp.description}
            onChange={(e) => updateExperience(index, 'description', e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            placeholder="Achievements (comma separated)"
            value={exp.achievements.join(', ')}
            onChange={(e) => updateExperience(index, 'achievements', e.target.value.split(',').map(s => s.trim()))}
            className="w-full p-2 border rounded"
          />
        </div>
      ))}
      <button onClick={addExperience} className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Experience
      </button>
    </div>
  );

  const renderSkillsStep = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Skills</h2>
      <textarea
        placeholder="Enter skills separated by commas"
        value={formData.skills.join(', ')}
        onChange={(e) => handleSkillsChange(e.target.value)}
        className="w-full p-2 border rounded"
        rows={3}
      />
    </div>
  );

  const renderProjectsStep = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Projects</h2>
      {formData.projects.map((proj, index) => (
        <div key={index} className="border p-4 rounded">
          <input
            type="text"
            placeholder="Project Title"
            value={proj.title}
            onChange={(e) => updateProject(index, 'title', e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            placeholder="Description"
            value={proj.description}
            onChange={(e) => updateProject(index, 'description', e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Technologies (comma separated)"
            value={proj.technologies.join(', ')}
            onChange={(e) => updateProject(index, 'technologies', e.target.value.split(',').map(s => s.trim()))}
            className="w-full p-2 border rounded mb-2"
          />
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input
              type="date"
              value={proj.startDate}
              onChange={(e) => updateProject(index, 'startDate', e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="date"
              value={proj.endDate}
              onChange={(e) => updateProject(index, 'endDate', e.target.value)}
              className="p-2 border rounded"
            />
          </div>
          <input
            type="url"
            placeholder="Project URL"
            value={proj.url}
            onChange={(e) => updateProject(index, 'url', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      ))}
      <button onClick={addProject} className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Project
      </button>
    </div>
  );

  const renderCertificationStep = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Certifications</h2>
      {formData.certifications.map((cert, index) => (
        <div key={index} className="border p-4 rounded">
          <input
            type="text"
            placeholder="Certification Name"
            value={cert.name}
            onChange={(e) => updateCertification(index, 'name', e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Issuer"
            value={cert.issuer}
            onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input
              type="date"
              placeholder="Issue Date"
              value={cert.issueDate}
              onChange={(e) => updateCertification(index, 'issueDate', e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="date"
              placeholder="Expiry Date"
              value={cert.expiryDate}
              onChange={(e) => updateCertification(index, 'expiryDate', e.target.value)}
              className="p-2 border rounded"
            />
          </div>
          <input
            type="text"
            placeholder="Credential ID"
            value={cert.credentialId}
            onChange={(e) => updateCertification(index, 'credentialId', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      ))}
      <button onClick={addCertification} className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Certification
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= step ? 'bg-blue-500 text-white' : 'bg-gray-300'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="text-sm text-gray-600">
          Step {currentStep} of 5: {
            currentStep === 1 ? 'Education' :
            currentStep === 2 ? 'Experience' :
            currentStep === 3 ? 'Skills' :
            currentStep === 4 ? 'Projects' : 'Certifications'
          }
        </div>
      </div>

      {currentStep === 1 && renderEducationStep()}
      {currentStep === 2 && renderExperienceStep()}
      {currentStep === 3 && renderSkillsStep()}
      {currentStep === 4 && renderProjectsStep()}
      {currentStep === 5 && renderCertificationStep()}

      {message && (
        <div className={`mt-4 p-3 rounded ${
          message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        
        {currentStep < 5 ? (
          <button
            onClick={() => setCurrentStep(prev => prev + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Next
          </button>
        ) : (
          <button
            onClick={submitForm}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Submit'}
          </button>
        )}
      </div>
    </div>
  );
};

export default EducationExperienceForm;