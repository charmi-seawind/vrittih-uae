"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'candidate' | 'employer';
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading) {
      if (!isAuthenticated || !user) {
        router.push('https://vrrittih.com');
        return;
      }

      if (requiredRole && user.role?.toLowerCase() !== requiredRole) {
        router.push('https://vrrittih.com');
        return;
      }
    }
  }, [mounted, isAuthenticated, user, loading, requiredRole, router]);

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" suppressHydrationWarning>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" suppressHydrationWarning></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (requiredRole && user.role?.toLowerCase() !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}