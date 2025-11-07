import React, { useState } from 'react';

function TuOpinion({ onClose, isLoggedIn, currentUser, onLoginRequest, onRegisterRequest }) {
  const [comentario, setComentario] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mensajeTipo, setMensajeTipo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!comentario.trim()) {
      setMensaje('Por favor escribe tu opinión.');
      setMensajeTipo('error');
      return;
    }

    // Guardar opinión en localStorage
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    
    const nuevaOpinion = {
      id: Date.now(),
      nombre: `${currentUser.nombre} ${currentUser.apellido}`,
      correo: currentUser.correo,
      comentario: comentario,
      fecha: Date.now()
    };

    feedbacks.push(nuevaOpinion);
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));

    // Mensaje de éxito
    setMensaje('¡Gracias por compartir tu opinión! La hemos recibido exitosamente.');
    setMensajeTipo('success');

    // Limpiar formulario
    setComentario('');

    // Cerrar después de 2 segundos
    setTimeout(() => {
      onClose();
    }, 2000);
  };

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
      zIndex: 2000,
      overflowY: 'auto',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '600px', width: '100%', position: 'relative' }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            background: 'var(--casino-red)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '35px',
            height: '35px',
            fontSize: '20px',
            cursor: 'pointer',
            zIndex: 10,
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 6px 12px rgba(220, 38, 38, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
          }}
        >
          ×
        </button>

        <section className="feedback-section" style={{ margin: 0 }}>
          <div className="feedback-card">
            <h2>💬 Tu Opinión</h2>
            
            {!isLoggedIn ? (
              <div className="login-required">
                <p className="descripcion">⚠️ Debes iniciar sesión para compartir tu opinión.</p>
                <div className="auth-buttons">
                  <button 
                    type="button" 
                    className="btn-primary btn-enviar"
                    onClick={onLoginRequest}
                  >
                    Iniciar Sesión
                  </button>
                  <p style={{ margin: '10px 0', color: 'var(--muted)' }}>o</p>
                  <button 
                    type="button" 
                    className="btn-ghost btn-enviar"
                    onClick={onRegisterRequest}
                  >
                    Registrarse
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="user-info-display">
                  <p className="descripcion">
                    Comentando como: <strong>{currentUser.nombre} {currentUser.apellido}</strong>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="feedback-form">
                  <div className="input-group textarea">
                    <i className="fa fa-comment" style={{ color: '#FFD700', marginRight: '10px', fontSize: '16px' }}>💬</i>
                    <textarea
                      id="fb-comentario"
                      name="comentario"
                      placeholder="Escribe tu opinión, sugerencia o comentario..."
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      required
                      rows="6"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-enviar">
                    ✈️ Enviar Opinión
                  </button>

                  {mensaje && (
                    <p className={`mensaje ${mensajeTipo}`}>
                      {mensaje}
                    </p>
                  )}
                </form>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default TuOpinion;
