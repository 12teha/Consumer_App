import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Clear any problematic localStorage that might be causing issues
    try {
      localStorage.removeItem('adVideoShownCount');
      localStorage.removeItem('wishlistOffers');
    } catch (e) {
      console.warn('Could not clear localStorage:', e);
    }
  }

  private handleReload = () => {
    // Clear state and reload
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    window.location.reload();
  };

  private handleReset = () => {
    // Just reset the error state without reloading
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-6">We're sorry, but something unexpected happened. Please try again.</p>
            
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="w-full px-4 py-2 border border-gray-300 text-foreground rounded-lg hover:bg-muted transition-colors"
              >
                Reload App
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground">Error Details</summary>
                <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;