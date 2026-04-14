import { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error('Unhandled UI error:', error, errorInfo);
  }

  handleRefresh = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center bg-[#fdfbf7] px-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">कुछ गड़बड़ हो गई।</h1>
            <p className="text-gray-700 mb-6">App को refresh करें।</p>
            <button
              onClick={this.handleRefresh}
              className="px-5 py-3 bg-primary text-white rounded-2xl font-semibold hover:bg-primary/90"
            >
              Refresh करें
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
