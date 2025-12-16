import React from 'react';

function ConfirmModal({ mensaje, message, onConfirm, onCancel, confirmText = 'Sí, cerrar sesión', cancelText = 'Cancelar' }) {
  // Soportar tanto 'mensaje' como 'message' para compatibilidad
  const displayMessage = mensaje || message;
  
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
          {displayMessage}
        </h2>
        
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          marginTop: '24px',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={onConfirm}
            style={{
              minWidth: '140px',
              background: 'var(--casino-red)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '1rem',
              fontFamily: "'Marcellus SC', serif"
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = '0 0 15px rgba(220, 38, 38, 0.6)';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = 'none';
              e.target.style.transform = 'scale(1)';
            }}
          >
            {confirmText}
          </button>
          <button 
            onClick={onCancel}
            style={{
              minWidth: '120px',
              background: 'transparent',
              color: 'var(--gold)',
              border: '1px solid var(--gold)',
              padding: '12px 24px',
              borderRadius: '10px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '1rem',
              fontFamily: "'Marcellus SC', serif"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--gold)';
              e.target.style.color = '#000';
              e.target.style.boxShadow = '0 0 15px var(--gold-glow)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'var(--gold)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
