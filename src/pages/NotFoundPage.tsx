import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileQuestion } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-7xl font-extrabold text-primary tracking-tight">404</h1>
        <p className="text-2xl font-bold text-foreground">Page Not Found</p>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          The SaaS module or route you are attempting to access does not exist or has been moved.
        </p>
      </div>

      <EmptyState
        title="Route Not Found"
        description="Verify your portal URL or return to the dashboard overview."
        icon={FileQuestion}
        actionLabel="Return to Dashboard"
        onAction={() => window.location.href = '/dashboard'}
      />

      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Go back to home
      </Link>
    </div>
  );
};
