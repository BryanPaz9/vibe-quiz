import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorMessage } from './Feedback';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo): void {
    // A production observability adapter can be connected here later.
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main className="page-container">
          <ErrorMessage title="La interfaz encontró un error inesperado">
            Actualiza la página para volver a intentarlo.
          </ErrorMessage>
        </main>
      );
    }
    return this.props.children;
  }
}
