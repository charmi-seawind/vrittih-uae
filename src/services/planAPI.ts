import { API_CONFIG } from '@/lib/config';

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
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }
  const data = await response.json();
  return data.success ? data : data;
};

export const planAPI = {
  // Get plans by user type
  getPlansByUserType: async (userType: 'employer' | 'job_seeker') => {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/plans/${userType}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleApiResponse(response);
  },

  // Get current user subscription
  getCurrentSubscription: async () => {
    try {
      const response = await fetch(`${API_CONFIG.API_URL}/job-seeker/subscription`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleApiResponse(response);
    } catch (error) {
      return { data: null };
    }
  },

  // Subscribe to a plan
  subscribeToPlan: async (planId: string, paymentId: string = 'mock_payment_' + Date.now()) => {
    const response = await fetch(`${API_CONFIG.API_URL}/subscriptions/subscribe`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ 
        plan_id: planId,
        payment_id: paymentId
      }),
    });
    return handleApiResponse(response);
  },
};