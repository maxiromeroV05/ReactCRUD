import React, { useState } from 'react';

function Login({ onClose, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });
  const [mensaje, setMensaje] = useState('');
  const [mensajeTipo, setMensajeTipo] = useState(''); // 'success' o 'error'
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Obtener usuarios del localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    
    // Buscar usuario por correo o nombre de usuario
    const usuario = usuarios.find(
      u => (u.correo === formData.emailOrUsername || u.username === formData.emailOrUsername) 
           && u.contrasena === formData.password
    );

    if (usuario) {
      // Login exitoso
      setMensaje(`¡Bienvenido/a ${usuario.nombre} ${usuario.apellido}!`);
      setMensajeTipo('success');
      
      // Guardar sesión actual
      localStorage.setItem('usuarioActual', JSON.stringify(usuario));
      
      // Cerrar modal y actualizar estado después de 1.5 segundos
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(usuario);
        }
        onClose();
      }, 1500);
    } else {
      // Login fallido
      setMensaje('Usuario/Correo o contraseña incorrectos');
      setMensajeTipo('error');
    }
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
      padding: '20px'
    }}>
      <div style={{ maxWidth: '500px', width: '100%', position: 'relative' }}>
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
            width: '40px',
            height: '40px',
            fontSize: '24px',
            cursor: 'pointer',
            zIndex: 10,
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}
        >
          ×
        </button>
        
        <main className="container estrecho">
          <form onSubmit={handleSubmit} className="form">
            <h1>Iniciar Sesión</h1>
            
            <div className="fila">
              <label htmlFor="emailOrUsername">Usuario o Correo electrónico</label>
              <input
                id="emailOrUsername"
                name="emailOrUsername"
                type="text"
                value={formData.emailOrUsername}
                onChange={handleChange}
                placeholder="usuario o tu@correo.com"
                required
              />
            </div>

            <div className="fila">
              <label htmlFor="password">Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  name="password"
                  type={mostrarContrasena ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: '45px' }}
                />
                <button
                  type="button"
                  onClick={() => setMostrarContrasena(!mostrarContrasena)}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--gold)',
                    cursor: 'pointer',
                    fontSize: '18px',
                    padding: '4px 8px'
                  }}
                >
                  {mostrarContrasena ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="fila fila-botones">
              <button type="submit" className="btn btn-primary">Iniciar sesión</button>
            </div>

            {mensaje && (
              <p className={`mensaje ${mensajeTipo}`}>
                {mensaje}
              </p>
            )}
          </form>
        </main>
      </div>
    </div>
  );
}

export default Login;
