"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { API_CONFIG } from '@/lib/config';
const DebugProfile = () => {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      };
      
      
      const response = await fetch(`${API_CONFIG.API_URL}/candidates/profile`, {
        method: 'GET',
        headers,
      });
      
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${data.message || response.statusText}`);
      }
      
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Profile API Debug Tool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testAPI} disabled={loading}>
          {loading ? 'Testing...' : 'Test Profile API'}
        </Button>
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-800">Error:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {response && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">API Response:</h3>
            <pre className="text-sm text-green-700 overflow-auto max-h-96">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DebugProfile;