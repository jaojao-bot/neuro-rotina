import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Manage PWA Service Worker: register in production, unregister in dev to avoid stale cache
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.log('SW registration error:', err);
      });
    });
  } else {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
  }
}

// Resilient Error Boundary to prevent any blank white screen
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('NeuroRotina ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
      window.location.reload();
    } catch (e) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: '#F0F9FF',
          color: '#1E293B'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '440px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid #BAE6FD'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🦁</div>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#0F172A', marginBottom: '8px' }}>
              NeuroRotina Kids
            </h2>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px', lineHeight: '1.5' }}>
              Detectamos uma divergência no cache local do navegador. Clique no botão abaixo para restaurar e recarregar:
            </p>
            {this.state.error?.message && (
              <pre style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#DC2626',
                padding: '10px',
                borderRadius: '12px',
                fontSize: '11px',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: '20px',
                whiteSpace: 'pre-wrap'
              }}>
                {String(this.state.error.message)}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: '16px',
                background: '#0284C7',
                color: 'white',
                fontWeight: '800',
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(2, 132, 199, 0.3)'
              }}
            >
              🔄 Restaurar Dados e Recarregar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
