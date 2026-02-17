"use client";

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

import { API_CONFIG } from '@/lib/config';
export const useEmployerData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployerData = async (force = false) => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      if (force) setLoading(true);
      const token = localStorage.getItem('token');
      
      
      // Always add cache busting timestamp for fresh data
      const apiUrl = `${API_CONFIG.API_URL}/employer/${user.id}/profile?t=${Date.now()}&_=${Math.random()}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
      });

      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Force state update by creating new object reference
        setData({ ...result.data });
        setError(null);
      } else {
        throw new Error(result.message || 'API call failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployerData(true);
  }, [user?.id]);

  return { data, loading, error, refetch: () => fetchEmployerData(true) };
};