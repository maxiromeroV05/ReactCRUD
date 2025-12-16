import React, { useState } from 'react';
import { validarLogin } from '../services/apostadorService';

function Login({ onClose, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });
  const [mensaje, setMensaje] = useState('');
  const [mensajeTipo, setMensajeTipo] = useState(''); // 'success' o 'error'
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mostrarAyuda, setMostrarAyuda] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje('');

    try {
      console.log('=== Iniciando validación de login ===');
      console.log('Email/Username:', formData.emailOrUsername);
      console.log('Password (longitud):', formData.password.length);
      
      // Validar login con la API
      const usuario = await validarLogin(formData.emailOrUsername, formData.password);
      
      console.log('Resultado de validación:', usuario ? 'Usuario encontrado' : 'Usuario no encontrado');
      if (usuario) {
        console.log('Datos del usuario:', { 
          id: usuario.id, 
          nombre: usuario.nombre, 
          username: usuario.username 
        });
      }

      if (usuario) {
        // Login exitoso
        setMensaje(`¡Bienvenido/a ${usuario.nombre} ${usuario.apellido}!`);
        setMensajeTipo('success');
        
        // Guardar sesión actual (incluyendo el ID para futuras operaciones)
        localStorage.setItem('usuarioActual', JSON.stringify(usuario));
        
        // Cerrar modal y actualizar estado después de 1.5 segundos
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(usuario);
          }
          onClose();
        }, 1500);
      } else {
        // Login fallido - Verificar el motivo
        const usuariosLocal = JSON.parse(localStorage.getItem('usuarios_local') || '[]');
        const usuarioExisteLocal = usuariosLocal.find(
          u => u.correo === formData.emailOrUsername || u.username === formData.emailOrUsername
        );
        
        if (usuarioExisteLocal) {
          setMensaje('Contraseña incorrecta. Por favor, verifica tu contraseña.');
        } else {
          setMensaje('Usuario no encontrado. Si ya tienes cuenta en Xano, regístrate nuevamente desde este navegador.');
          setMostrarAyuda(true);
        }
        setMensajeTipo('error');
      }
    } catch (error) {
      // Manejar errores de la API
      console.error('Error en login:', error);
      setMensaje('Error al iniciar sesión. Por favor, intenta nuevamente.');
      setMensajeTipo('error');
    } finally {
      setCargando(false);
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
              <button type="submit" className="btn btn-primary" disabled={cargando}>
                {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </div>

            {mensaje && (
              <p className={`mensaje ${mensajeTipo}`}>
                {mensaje}
              </p>
            )}

            {mostrarAyuda && (
              <div style={{
                background: 'rgba(255, 215, 0, 0.1)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '8px',
                padding: '15px',
                marginTop: '15px',
                textAlign: 'left'
              }}>
                <h4 style={{ color: 'var(--gold)', marginTop: 0 }}>💡 ¿No puedes acceder?</h4>
                <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                  Si ya tenías una cuenta en Xano, necesitas importar tus datos:
                </p>
                <ol style={{ fontSize: '14px', paddingLeft: '20px', margin: '10px 0' }}>
                  <li>Abre en otra pestaña: <code style={{ background: '#1a1a1a', padding: '2px 6px', borderRadius: '3px' }}>http://localhost:3000/utils.html</code></li>
                  <li>Click en "📥 Importar Usuarios de Xano"</li>
                  <li>Usa la contraseña temporal para hacer login</li>
                  <li>Luego cambia tu contraseña en tu perfil</li>
                </ol>
                <p style={{ fontSize: '13px', color: '#999', marginBottom: 0 }}>
                  O simplemente regístrate de nuevo con los mismos datos.
                </p>
              </div>
            )}
          </form>
        </main>
      </div>
    </div>
  );
}

export default Login;
