"use client";

import { useEffect, useState } from 'react';
import { candidateAPI } from '@/services/api';

const DebugExperience = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await candidateAPI.getProfile();
        setData(response);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading debug data...</div>;

  return (
    <div className="p-4 border rounded bg-gray-50">
      <h3 className="font-bold mb-2">Debug: Raw API Response</h3>
      <pre className="text-xs overflow-auto max-h-96">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default DebugExperience;