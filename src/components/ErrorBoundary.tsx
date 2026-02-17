"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
                <h3 className="text-lg font-semibold text-red-600">Something went wrong</h3>
                <p className="text-muted-foreground">
                  We encountered an unexpected error. Please try refreshing the page.
                </p>
                <div className="space-x-2">
                  <Button onClick={this.resetError} variant="outline">
                    Try Again
                  </Button>
                  <Button onClick={() => window.location.reload()}>
                    Refresh Page
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;