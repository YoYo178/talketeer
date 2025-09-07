import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './ui/button';
import { MessagesSquare } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-6">

            <div className='flex gap-2 items-center'>
              <MessagesSquare className='size-12' />
              <h1 className='text-4xl font-bold'>Talketeer</h1>
            </div>

            <div className='text-center'>
              <h1 className="text-2xl font-bold text-primary mb-4">
                Something went wrong
              </h1>
              <p className="text-muted-foreground mb-4">
                We're sorry, but something unexpected happened.
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="px-4 py-2"
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
