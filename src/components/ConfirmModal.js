import React from 'react';

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 3000,
      padding: '20px'
    }}>
      <div className="form" style={{
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        padding: '30px'
      }}>
        <h2 style={{
          color: 'var(--gold)',
          marginBottom: '20px',
          fontSize: '22px',
          textShadow: '0 0 12px var(--gold-glow)'
        }}>
          {message}
        </h2>
        
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          marginTop: '24px'
        }}>
          <button 
            onClick={onConfirm}
            className="btn btn-primary"
            style={{ minWidth: '120px' }}
          >
            Sí, cerrar sesión
          </button>
          <button 
            onClick={onCancel}
            className="btn btn-cancel"
            style={{ minWidth: '100px' }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
