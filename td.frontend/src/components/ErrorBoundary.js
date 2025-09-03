import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center text-center">
          {/* Error Icon */}
          <div className='m-2'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#c91d1dea" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
        </svg>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Something went wrong
          </h1>

          {/* Subtext */}
          <p className="text-gray-500 mb-4">
            There was a problem processing the request. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      )
    }

    return this.props.children;
  }
}