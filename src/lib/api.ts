import { API_CONFIG } from './config';

const API_BASE_URL = API_CONFIG.API_URL;


export const api = {
  // Auth endpoints
  auth: {
    register: `${API_BASE_URL}/auth/register`,
    registerEmployer: `${API_BASE_URL}/auth/register-employer`,
    login: `${API_BASE_URL}/auth/login`,
    verify: `${API_BASE_URL}/auth/verify`,
    sendOtp: `${API_BASE_URL}/auth/send-otp`,
    verifyOtp: `${API_BASE_URL}/auth/verify-otp`,
    resendOtp: `${API_BASE_URL}/auth/resend-otp`,
  },
  // User profile endpoints
  user: {
    profile: `${API_BASE_URL}/user/profile`,
    updateProfile: `${API_BASE_URL}/user/profile`,
  },
  // Job seeker endpoints
  jobSeeker: {
    saveBasicInfo: `${API_BASE_URL}/job-seeker/save-basic-info`,
    sendOtp: `${API_BASE_URL}/job-seeker/send-otp-step`,
    verifyOtp: `${API_BASE_URL}/job-seeker/verify-otp-step`,
    resendOtp: `${API_BASE_URL}/job-seeker/resend-otp`,
    saveEducationExperience: `${API_BASE_URL}/job-seeker/save-education-experience`,
    uploadCv: `${API_BASE_URL}/job-seeker/upload-cv`,
    completePayment: `${API_BASE_URL}/job-seeker/complete-payment`,
    sendLoginOtp: `${API_BASE_URL}/job-seeker/login/send-otp`,
    verifyLoginOtp: `${API_BASE_URL}/job-seeker/verify-otp-step`,
  },
  // Employer endpoints
  employer: {
    register: `${API_BASE_URL}/employer/register`,
    verifyOtp: `${API_BASE_URL}/employer/verify-otp`,
    jobDetails: (pendingUserId: string) => `${API_BASE_URL}/employer/${pendingUserId}/job-details`,
    profile: (pendingUserId: string) => `${API_BASE_URL}/employer/${pendingUserId}/profile`,
    updateProfile: (pendingUserId: string) => `${API_BASE_URL}/employer/${pendingUserId}/profile`,
  },
  // Resume endpoints
  resume: {
    create: `${API_BASE_URL}/resume/create`,
    upload: `${API_BASE_URL}/resume/upload`,
  }
};

// API call helper
export const apiCall = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API call failed');
  }
  
  return data;
};