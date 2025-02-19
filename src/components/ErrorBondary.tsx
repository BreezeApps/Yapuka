import React from "react";

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Erreur interceptée :", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Une erreur est survenue dans cette section.</h2>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
