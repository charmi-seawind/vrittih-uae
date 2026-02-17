'use client';

import { useState } from 'react';
import { candidateAPI } from '@/services/api';

import { API_CONFIG } from '@/lib/config';
export default function ProfileUpdateExample() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    mobile: '',
    location: '',
    bio: ''
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // This will call PUT ${API_CONFIG.API_URL}/candidates/:user_id/profile
      const result = await candidateAPI.updateProfile(formData);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Profile update failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md mx-auto p-4">
      <input
        type="text"
        placeholder="Full Name"
        value={formData.full_name}
        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        className="w-full p-2 border rounded"
      />
      <input
        type="tel"
        placeholder="Mobile"
        value={formData.mobile}
        onChange={(e) => setFormData({...formData, mobile: e.target.value})}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Location"
        value={formData.location}
        onChange={(e) => setFormData({...formData, location: e.target.value})}
        className="w-full p-2 border rounded"
      />
      <textarea
        placeholder="Bio"
        value={formData.bio}
        onChange={(e) => setFormData({...formData, bio: e.target.value})}
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
      >
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
}