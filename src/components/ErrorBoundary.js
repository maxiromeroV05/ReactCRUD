import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log para diagnóstico
    // eslint-disable-next-line no-console
    console.error('UI error caught by ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '16px',
          margin: '16px',
          border: '1px solid #ef4444',
          background: 'rgba(239,68,68,0.1)',
          borderRadius: '8px',
          color: '#fecaca'
        }}>
          <strong>Ocurrió un error al renderizar la interfaz.</strong>
          <div style={{ fontSize: '0.9rem', marginTop: '8px' }}>
            Revisa la consola del navegador para más detalles.
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
