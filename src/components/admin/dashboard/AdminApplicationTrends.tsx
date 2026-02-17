"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { adminAPI } from "@/services/api";

const AdminApplicationTrends = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await adminAPI.getApplicationTrends();
        if (response.success) {
          const formattedData = response.data.trends.map(item => ({
            date: new Date(item.date).toLocaleDateString(),
            applications: parseInt(item.count)
          }));
          setData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching trends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Trends</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="applications" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-muted-foreground">No data available</div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminApplicationTrends;