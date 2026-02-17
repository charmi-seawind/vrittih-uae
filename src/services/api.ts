import { API_CONFIG } from '../lib/config';

const API_BASE_URL = API_CONFIG.BASE_URL;

interface ProfileData {
  id?: string;
  full_name?: string;
  email?: string;
  mobile?: string;
  date_of_birth?: string;
  location?: string;
  bio?: string;
  profile_image?: string;
  education?: Array<{
    id?: string;
    degree?: string;
    degreeTitle?: string;
    institution?: string;
    instituteName?: string;
    instituteLocation?: string;
    year_of_completion?: string;
    startDate?: string;
    endDate?: string;
    percentage?: string;
    grade?: string;
    location?: string;
    description?: string;
  }>;
  experience?: Array<{
    id?: string;
    company?: string;
    companyName?: string;
    position?: string;
    job_title?: string;
    location?: string;
    start_date?: string;
    startDate?: string;
    end_date?: string;
    endDate?: string;
    is_current?: boolean;
    currentlyWorking?: boolean;
    description?: string;
    achievements?: string;
  }>;
  skills?: Array<{
    id?: string;
    name: string;
    level: string;
  }>;
  projects?: Array<{
    id?: string;
    title: string;
    description: string;
    startDate?: string;
    endDate?: string;
    isOngoing?: boolean;
    technologies?: string[];
    projectUrl?: string;
    githubUrl?: string;
  }>;
  certifications?: Array<{
    id?: string;
    name: string;
    issuingOrganization: string;
    issueDate?: string;
    expiryDate?: string;
    isExpired?: boolean;
    description?: string;
    credentialId?: string;
    credentialUrl?: string;
  }>;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    
    // Only redirect to login for actual auth failures, not other 401s
    if (response.status === 401 && errorData.message?.includes('Authentication failed')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }
  const data = await response.json();
  return data.success ? data : data;
};

export const candidateAPI = {
  // Get candidate profile - uses logged-in user's ID from token
  getProfile: async (): Promise<ProfileData> => {
    const response = await fetch(`${API_BASE_URL}/api/candidates/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await handleApiResponse(response);
    return data;
  },

  // Update candidate profile - server identifies user from JWT token
  updateProfile: async (profileData: Partial<ProfileData>): Promise<ProfileData> => {
    const response = await fetch(`${API_BASE_URL}/api/candidates/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleApiResponse(response);
  },

  // Get education data
  getEducation: async () => {
    const response = await fetch(`${API_BASE_URL}/api/candidates/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await handleApiResponse(response);
    return data.data?.profile?.resume?.education || [];
  },

  // Update education data
  updateEducation: async (educationData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/candidates/education`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(educationData),
    });
    return handleApiResponse(response);
  },

  // Get experience data
  getExperience: async () => {
    const response = await fetch(`${API_BASE_URL}/api/candidates/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await handleApiResponse(response);
    return data.data?.profile?.resume?.experience || [];
  },

  // Update experience data
  updateExperience: async (experienceData: any) => {
    
    const formattedExperience = experienceData.map((exp: any) => ({
      id: exp.id,
      position: exp.position || exp.jobTitle || exp.job_title,
      company: exp.companyName || exp.company_name || exp.company,
      location: exp.location || '',
      start_date: exp.startDate || exp.start_date,
      end_date: exp.endDate || exp.end_date,
      is_current: exp.currentlyWorking || exp.is_current || false,
      description: exp.description || '',
      achievements: exp.achievements || exp.achievement || exp.accomplishments || ''
    }));
    
    
    const response = await fetch(`${API_BASE_URL}/api/candidates/experience`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ experience: formattedExperience }),
    });
    const result = await handleApiResponse(response);
    return result;
  },

  // Get skills data
  getSkills: async () => {
    const response = await fetch(`${API_BASE_URL}/api/candidates/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await handleApiResponse(response);
    return data.data?.profile?.resume?.skills || [];
  },

  // Update skills data
  updateSkills: async (skillsData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/candidates/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(skillsData),
    });
    return handleApiResponse(response);
  },

  // Update projects data
  updateProjects: async (projectsData: any) => {
    
    const formattedProjects = projectsData.map((proj: any) => ({
      id: proj.id,
      title: proj.title || proj.project_title || proj.name,
      description: proj.description || proj.project_description || '',
      startDate: proj.startDate || proj.start_date,
      endDate: proj.endDate || proj.end_date,
      isOngoing: proj.isOngoing || proj.is_ongoing || false,
      technologies: proj.technologies || proj.tech_stack || [],
      projectUrl: proj.projectUrl || proj.project_url || proj.demo_url || '',
      githubUrl: proj.githubUrl || proj.github_url || proj.repository_url || '',
      achievements: proj.achievements || proj.achievement || proj.accomplishments || ''
    }));
    
    
    const response = await fetch(`${API_BASE_URL}/api/candidates/projects`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ projects: formattedProjects }),
    });
    const result = await handleApiResponse(response);
    return result;
  },

  // Get resume data
  getResume: async () => {
    const response = await fetch(`${API_BASE_URL}/api/candidates/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await handleApiResponse(response);
    return data.data?.profile?.resume || null;
  },

  // Update resume data
  updateResume: async (resumeData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/candidates/resume`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(resumeData),
    });
    return handleApiResponse(response);
  },

  // Get uploaded resume
  getUploadedResume: async () => {
    const response = await fetch(`${API_BASE_URL}/api/candidates/uploaded-resume`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },
};



// Jobs API
export const jobsAPI = {
  // Browse jobs with pagination and filters
  browseJobs: async (params: {
    page?: number;
    limit?: number;
    workMode?: string;
    jobTypes?: string;
    experienceLevel?: string;
    globalSearch?: string;
    companySearch?: string;
    locationSearch?: string;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination params
      queryParams.append('page', (params.page || 0).toString());
      queryParams.append('limit', (params.limit || 10).toString());
      
      // Add filter params if they exist
      if (params.workMode) queryParams.append('workMode', params.workMode);
      if (params.jobTypes) queryParams.append('jobTypes', params.jobTypes);
      if (params.experienceLevel) queryParams.append('experienceLevel', params.experienceLevel);
      if (params.globalSearch) queryParams.append('globalSearch', params.globalSearch);
      if (params.companySearch) queryParams.append('companySearch', params.companySearch);
      if (params.locationSearch) queryParams.append('locationSearch', params.locationSearch);
      
      const url = `${API_CONFIG.API_URL}/jobs?${queryParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      
      const data = await handleApiResponse(response);
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get saved jobs
  getSavedJobs: async () => {
    const response = await fetch(`${API_CONFIG.API_URL}/candidates/saved-jobs`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },

  // Save/Unsave job
  saveJob: async (jobId: string) => {
    const url = `${API_CONFIG.API_URL}/candidates/jobs/${jobId}/save`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    return handleApiResponse(response);
  },

  // Unsave job
  unsaveJob: async (jobId: string) => {
    const url = `${API_CONFIG.API_URL}/candidates/jobs/${jobId}/save`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    return handleApiResponse(response);
  },

  // Apply for job
  applyForJob: async (jobId: string, coverLetter?: string, customFormResponses?: any) => {
    try {
      const url = `${API_CONFIG.API_URL}/applications/apply`;
      
      const requestBody: any = { 
        job_id: jobId,
        cover_letter: coverLetter || "I am very interested in this position and believe my skills make me a perfect fit for this role.",
        resume_url: ""
      };
      
      // Add resume_id if provided
      if (customFormResponses?.resume_id) {
        requestBody.resume_id = parseInt(customFormResponses.resume_id);
      }
      
      // Add custom form responses if provided
      if (customFormResponses) {
        const { resume_id, ...otherResponses } = customFormResponses;
        // Merge with global uploaded files
        const globalFiles = (window as any).uploadedFiles || {};
        requestBody.custom_form_responses = { ...otherResponses, ...globalFiles };
      }
      
      const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestBody),
      });
      
      const data = await handleApiResponse(response);
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get my applications
  getMyApplications: async (params: {
    page?: number;
    limit?: number;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', (params.page || 1).toString());
      queryParams.append('limit', (params.limit || 10).toString());
      
      const url = `${API_CONFIG.API_URL}/applications/my-applications?${queryParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      const data = await handleApiResponse(response);
      return data;
    } catch (error) {
      console.error('getMyApplications error:', error);
      throw error;
    }
  },

  // Withdraw application
  withdrawApplication: async (applicationId: string) => {
    const response = await fetch(`${API_CONFIG.API_URL}/applications/${applicationId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },

  // Upload video for job application
  uploadApplicationVideo: async (videoFile: File, jobId: string) => {
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('jobId', jobId);
    
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_CONFIG.API_URL}/applications/upload-video`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return handleApiResponse(response);
  },

  // Upload file for job application
  uploadApplicationFile: async (file: File, jobId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobId', jobId);
    
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_CONFIG.API_URL}/applications/upload-file`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return handleApiResponse(response);
  },

  // Get file for job application
  getApplicationFile: async (userId: string, jobId: string) => {
    const response = await fetch(`${API_CONFIG.API_URL}/applications/file/${userId}/${jobId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },

};

// Resume API
export const resumeAPI = {
  // Get uploaded resumes
  getResumes: async () => {
    const response = await fetch(`${API_CONFIG.API_URL}/candidates/resumes`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },

  // Upload new CV
  uploadCV: async (file: File, title?: string) => {
    const formData = new FormData();
    formData.append('cv', file);
    if (title) {
      formData.append('title', title);
    }
    
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_CONFIG.API_URL}/cv/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return handleApiResponse(response);
  },

  // Preview resume
  previewResume: async (userId: string) => {
    const response = await fetch(`${API_CONFIG.API_URL}/file/user-cv/${userId}?action=preview`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return response;
  },

  // Delete CV
  deleteCV: async (resumeId: string) => {
    const response = await fetch(`${API_CONFIG.API_URL}/candidates/resumes/${resumeId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },

};



// Employer API
export const employerAPI = {
  // Get employer profile
  getProfile: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    
    if (!userId) {
      throw new Error('User ID not found');
    }
    
    const response = await fetch(`${API_CONFIG.API_URL}/employer/${userId}/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },

  // Update employer profile
  updateProfile: async (profileData: any) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    
    if (!userId) {
      throw new Error('User ID not found');
    }
    
    const response = await fetch(`${API_CONFIG.API_URL}/employer/${userId}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleApiResponse(response);
  },

  // Get employer jobs
  getJobs: async () => {
    try {
      
      // Check localStorage data
      const userString = localStorage.getItem('user');
      const tokenString = localStorage.getItem('token');
      
      
      const user = JSON.parse(userString || '{}');
      const userId = user.id;
      
      
      if (!userId) {
        throw new Error('User ID not found');
      }
      
      if (!tokenString) {
        throw new Error('Authentication token not found');
      }
      
      const headers = getAuthHeaders();
      
      const url = `${API_CONFIG.API_URL}/employer/${userId}/jobs?t=${Date.now()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...headers,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
      });
      
      
      if (!response.ok) {
        const errorText = await response.text();
      }
      
      const data = await handleApiResponse(response);
      
      return data;
    } catch (error) {
      throw error;
    }
  },



  // Post new job
  postJob: async (jobData: any) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    
    if (!userId) {
      throw new Error('User ID not found');
    }
    
    const response = await fetch(`${API_CONFIG.API_URL}/employer/${userId}/jobs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(jobData),
    });
    return handleApiResponse(response);
  },

  // Update job
  updateJob: async (jobId: string, jobData: any) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    
    if (!userId) {
      throw new Error('User ID not found');
    }
    
    const response = await fetch(`${API_CONFIG.API_URL}/employer/${userId}/jobs/${jobId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(jobData),
    });
    return handleApiResponse(response);
  },

  // Update employer profile using the specific endpoint
  updateEmployerProfile: async (profileData: any) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    
    if (!userId) {
      throw new Error('User ID not found');
    }
    
    const response = await fetch(`${API_CONFIG.API_URL}/employer/${userId}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleApiResponse(response);
  },

  // Get featured jobs
  getFeaturedJobs: async () => {
    const response = await fetch(`${API_CONFIG.API_URL}/employer/jobs/featured`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },

  // Get employer's featured jobs
  getEmployerFeaturedJobs: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    
    if (!userId) {
      throw new Error('User ID not found');
    }
    
    const response = await fetch(`${API_CONFIG.API_URL}/employer/${userId}/jobs/featured?t=${Date.now()}`, {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
    return handleApiResponse(response);
  },

  // Get all applications for employer
  getAllApplications: async (page: number = 1, limit: number = 10) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (user.role !== 'employer') {
        throw new Error('Only employers can view applications');
      }
      
      const url = `${API_CONFIG.API_URL}/applications/employer/all?page=${page}&limit=${limit}`;
      
      const headers = getAuthHeaders();
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });
      
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get applications for a specific job
  getJobApplications: async (jobId: string, page: number = 1, limit: number = 10) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (user.role !== 'employer') {
        throw new Error('Only employers can view job applications');
      }
      
      const url = `${API_CONFIG.API_URL}/applications/job/${jobId}?page=${page}&limit=${limit}`;
      
      const headers = getAuthHeaders();
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });
      
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Update application status
  updateApplicationStatus: async (applicationId: string, status: string) => {
    const response = await fetch(
      `${API_CONFIG.API_URL}/applications/${applicationId}/status`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      }
    );
    return handleApiResponse(response);
  },

  // Analyze applications with AI
  analyzeApplications: async (jobId: string) => {
    const response = await fetch(
      `${API_CONFIG.API_URL}/applications/analyze/${jobId}`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
      }
    );
    return handleApiResponse(response);
  },
};

// Auth API
export const authAPI = {
  // Resend OTP for job seeker
  resendOtp: async (email: string) => {
    const response = await fetch(`${API_CONFIG.API_URL}/job-seeker/resend-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    return handleApiResponse(response);
  },
  
  // Resend OTP for employer
  resendEmployerOtp: async (email: string, type: string = 'login') => {
    const headers = type === 'email_update' ? getAuthHeaders() : {
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${API_CONFIG.API_URL}/employer/resend-otp`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, type }),
    });
    return handleApiResponse(response);
  },

  // Verify email OTP for profile update
  verifyEmailOtp: async (email: string, otp: string) => {
    const response = await fetch(`${API_CONFIG.API_URL}/employer/verify-email-otp`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, otp }),
    });
    return handleApiResponse(response);
  },
};

// Admin API
export const adminAPI = {
  // Admin login
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    return handleApiResponse(response);
  },

  // Get admin dashboard stats
  getDashboardStats: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard-stats`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },

  // Get all users
  getAllUsers: async (page: number = 1, limit: number = 10, role?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(role && { role })
    });
    const response = await fetch(`${API_BASE_URL}/api/admin/users?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },

  // Get job seekers only (optimized)
  getJobSeekers: async (page: number = 1, limit: number = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    const response = await fetch(`${API_BASE_URL}/api/admin/users/job-seekers?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },

  // Get employers only (optimized)
  getEmployers: async (page: number = 1, limit: number = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    const response = await fetch(`${API_BASE_URL}/api/admin/users/employers?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },

  // Get pending job seekers only (optimized)
  getPendingJobSeekers: async (page: number = 1, limit: number = 1000) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    const response = await fetch(`${API_BASE_URL}/api/admin/pending-users/job-seekers?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },

  // Create user (admin only)
  createUser: async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleApiResponse(response);
  },

  // Convert pending user to actual user
  convertPendingUser: async (id: string, planId?: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/pending-users/${id}/convert`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ plan_id: planId }),
    });
    return handleApiResponse(response);
  },

  // Get job seeker complete profile (single API call)
  getJobSeekerProfile: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/job-seekers/${id}/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },

  // Get user applications by user ID
  getUserApplications: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/applications/my-applications?userId=${userId}&limit=50`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },

  // Get all jobs
  getAllJobs: async (page: number = 1, limit: number = 10, status?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status })
    });
    const response = await fetch(`${API_BASE_URL}/api/admin/jobs?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },

  // Get all applications
  getAllApplications: async (page: number = 1, limit: number = 10, status?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status })
    });
    const response = await fetch(`${API_BASE_URL}/api/admin/applications?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },

  // Get user by ID
  getUserById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },

  // Plans management
  createPlan: async (planData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/plans`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(planData),
    });
    return handleApiResponse(response);
  },

  getAllPlans: async (page: number = 1, limit: number = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    const response = await fetch(`${API_BASE_URL}/api/admin/plans?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },

  updatePlan: async (id: string, planData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/plans/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(planData),
    });
    return handleApiResponse(response);
  },

  deletePlan: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/plans/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },

  // Get plans by user type
  getPlansByUserType: async (userType: 'employer' | 'job_seeker') => {
    const response = await fetch(`${API_BASE_URL}/api/admin/plans/user-type/${userType}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },

  // Get application trends
  getApplicationTrends: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/application-trends`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },

  // Get application status distribution
  getApplicationStatusDistribution: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/application-status-distribution`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },

  // Delete user
  deleteUser: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },

  // Admin login as user
  adminLoginAsUser: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}/login-as`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },
};

// Subscription API
export const subscriptionAPI = {
  // Check subscription status
  checkStatus: async () => {
    const response = await fetch(`${API_BASE_URL}/api/subscriptions/status`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },

  // Renew subscription
  renew: async (planId: string, paymentId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/subscriptions/renew`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ plan_id: planId, payment_id: paymentId }),
    });
    return handleApiResponse(response);
  },
};

export type { ProfileData };

// Job posting interface
export interface JobPostData {
  company_name: string;
  job_title: string;
  job_category: string;
  job_type: string;
  work_location_type: string;
  office_address?: string;
  pay_type: string;
  pay_amount: string;
  additional_perks?: string;
  joining_fee_required: boolean;
  minimum_education: string;
  language_required: string;
  experience_required: string;
  additional_requirements?: string;
  job_description: string;
  is_walk_in: boolean;
  walk_in_address?: string;
  walk_in_start_date?: string;
  walk_in_end_date?: string;
  walk_in_timing?: string;
  walk_in_instructions?: string;
  application_email: string;
  is_featured: boolean;
  custom_form_fields?: any;
}