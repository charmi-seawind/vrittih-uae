"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useEffect, useState } from "react";
import { adminAPI } from "@/services/api";

const COLORS = {
  pending: '#fbbf24',
  accepted: '#10b981',
  rejected: '#ef4444',
  shortlisted: '#3b82f6'
};

const AdminApplicationStatusDistributionPie = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDistribution = async () => {
      try {
        const response = await adminAPI.getApplicationStatusDistribution();
        if (response.success) {
          const formattedData = response.data.distribution.map(item => ({
            name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
            value: parseInt(item.count),
            status: item.status
          }));
          setData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching distribution:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistribution();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.status] || '#8884d8'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-muted-foreground">No data available</div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminApplicationStatusDistributionPie;