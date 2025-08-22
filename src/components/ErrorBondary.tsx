import React from "react";

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

/* The above class is an ErrorBoundary component in that catches errors in its child
components and displays an error message with an option to reload the application. */
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Erreur interceptée :", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-red-50">
          <div className="text-center p-6 rounded-xl shadow-md bg-white">
            <h1 className="text-2xl font-bold text-red-600">
              Oups, une erreur est survenue !
            </h1>
            <p className="mt-2 text-gray-600">
              {this.state.error?.message ?? "Erreur inconnue."}
            </p>
            <button
              className="mt-4 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              onClick={() => window.location.reload()}
            >
              Recharger l’application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
