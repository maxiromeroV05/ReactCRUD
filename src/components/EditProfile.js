import React, { useState } from 'react';
import { actualizarApostador } from '../services/apostadorService';

function EditProfile({ usuario, onClose, onUpdateSuccess }) {
  const [formData, setFormData] = useState({
    nombre: usuario.nombre || '',
    apellido: usuario.apellido || '',
    username: usuario.username || '',
    correo: usuario.correo || ''
  });
  const [mensaje, setMensaje] = useState('');
  const [mensajeTipo, setMensajeTipo] = useState('');
  const [cargando, setCargando] = useState(false);

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

    // Validaciones
    if (!formData.nombre || !formData.apellido || !formData.username || !formData.correo) {
      setMensaje('Todos los campos son obligatorios');
      setMensajeTipo('error');
      setCargando(false);
      return;
    }

    if (formData.username.length < 3) {
      setMensaje('El nombre de usuario debe tener al menos 3 caracteres');
      setMensajeTipo('error');
      setCargando(false);
      return;
    }

    try {
      console.log('=== Actualizando perfil en Xano ===');
      console.log('ID del usuario:', usuario.id);
      console.log('Datos a actualizar:', formData);

      // Actualizar en Xano
      const usuarioActualizado = await actualizarApostador(usuario.id, formData);
      
      console.log('Usuario actualizado en Xano:', usuarioActualizado);

      // Actualizar en localStorage
      const usuariosLocal = JSON.parse(localStorage.getItem('usuarios_local') || '[]');
      const index = usuariosLocal.findIndex(u => u.id === usuario.id);
      
      if (index !== -1) {
        // Mantener la contraseña local
        usuariosLocal[index] = {
          ...usuarioActualizado,
          contrasena: usuario.contrasena
        };
        localStorage.setItem('usuarios_local', JSON.stringify(usuariosLocal));
      }

      // Actualizar sesión actual
      const usuarioConPassword = {
        ...usuarioActualizado,
        contrasena: usuario.contrasena
      };
      localStorage.setItem('usuarioActual', JSON.stringify(usuarioConPassword));

      setMensaje('¡Perfil actualizado exitosamente!');
      setMensajeTipo('success');

      setTimeout(() => {
        if (onUpdateSuccess) {
          onUpdateSuccess(usuarioConPassword);
        }
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setMensaje(error.message || 'Error al actualizar el perfil');
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
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            fontWeight: 'bold',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1) rotate(90deg)';
            e.target.style.boxShadow = '0 6px 12px rgba(220, 38, 38, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1) rotate(0deg)';
            e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
          }}
        >
          ×
        </button>
        
        <main className="container estrecho">
          <form onSubmit={handleSubmit} className="form">
            <h1>✏️ Editar Perfil</h1>
            
            <div className="grid-2">
              <div className="fila">
                <label htmlFor="nombre">Nombre</label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="fila">
                <label htmlFor="apellido">Apellido</label>
                <input
                  id="apellido"
                  name="apellido"
                  type="text"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="fila">
              <label htmlFor="username">Nombre de usuario</label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="usuario123"
                minLength="3"
                required
              />
            </div>

            <div className="fila">
              <label htmlFor="correo">Correo electrónico</label>
              <input
                id="correo"
                name="correo"
                type="email"
                value={formData.correo}
                onChange={handleChange}
                placeholder="tu@correo.com"
                required
              />
            </div>

            <div className="fila fila-botones">
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={cargando}
                style={{
                  background: 'var(--gold)',
                  color: '#000',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  cursor: cargando ? 'not-allowed' : 'pointer',
                  opacity: cargando ? 0.6 : 1,
                  transition: 'all 0.2s ease',
                  fontSize: '1rem',
                  fontFamily: "'Marcellus SC', serif"
                }}
                onMouseEnter={(e) => {
                  if (!cargando) {
                    e.target.style.boxShadow = '0 0 15px var(--gold-glow)';
                    e.target.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                {cargando ? '⏳ Actualizando...' : '💾 Guardar Cambios'}
              </button>
              <button 
                type="button"
                onClick={onClose}
                className="btn btn-ghost"
                disabled={cargando}
                style={{
                  background: 'transparent',
                  color: 'var(--gold)',
                  border: '1px solid var(--gold)',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  cursor: cargando ? 'not-allowed' : 'pointer',
                  opacity: cargando ? 0.6 : 1,
                  transition: 'all 0.2s ease',
                  fontSize: '1rem',
                  fontFamily: "'Marcellus SC', serif"
                }}
                onMouseEnter={(e) => {
                  if (!cargando) {
                    e.target.style.background = 'var(--gold)';
                    e.target.style.color = '#000';
                    e.target.style.boxShadow = '0 0 15px var(--gold-glow)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'var(--gold)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Cancelar
              </button>
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

export default EditProfile;
