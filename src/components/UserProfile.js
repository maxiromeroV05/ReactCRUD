import React, { useState } from 'react';
import { actualizarContrasenaLocal, eliminarApostador } from '../services/apostadorService';
import ConfirmModal from './ConfirmModal';

function UserProfile({ usuario, onClose, onLogout, onUpdateSuccess }) {
  const [editandoPassword, setEditandoPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    passwordActual: '',
    passwordNueva: '',
    confirmarPasswordNueva: ''
  });
  const [mensaje, setMensaje] = useState('');
  const [mensajeTipo, setMensajeTipo] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mostrarPasswordActual, setMostrarPasswordActual] = useState(false);
  const [mostrarPasswordNueva, setMostrarPasswordNueva] = useState(false);
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false);
  const [mostrarConfirmDelete, setMostrarConfirmDelete] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje('');

    // Validaciones
    if (passwordData.passwordActual !== usuario.contrasena) {
      setMensaje('La contraseña actual es incorrecta');
      setMensajeTipo('error');
      setCargando(false);
      return;
    }

    if (passwordData.passwordNueva.length < 6) {
      setMensaje('La nueva contraseña debe tener al menos 6 caracteres');
      setMensajeTipo('error');
      setCargando(false);
      return;
    }

    if (passwordData.passwordNueva !== passwordData.confirmarPasswordNueva) {
      setMensaje('Las contraseñas nuevas no coinciden');
      setMensajeTipo('error');
      setCargando(false);
      return;
    }

    try {
      // Actualizar contraseña localmente (Xano no tiene campo de contraseña)
      const usuarioActualizado = await actualizarContrasenaLocal(usuario.id, passwordData.passwordNueva);

      // Actualizar localStorage de sesión actual
      localStorage.setItem('usuarioActual', JSON.stringify(usuarioActualizado));

      setMensaje('¡Contraseña actualizada exitosamente!');
      setMensajeTipo('success');

      // Limpiar formulario
      setPasswordData({
        passwordActual: '',
        passwordNueva: '',
        confirmarPasswordNueva: ''
      });

      setTimeout(() => {
        setEditandoPassword(false);
        if (onUpdateSuccess) {
          onUpdateSuccess(usuarioActualizado);
        }
      }, 2000);

    } catch (error) {
      setMensaje(error.message || 'Error al actualizar la contraseña');
      setMensajeTipo('error');
    } finally {
      setCargando(false);
    }
  };

  const handleDeleteAccount = async () => {
    setCargando(true);
    setMensaje('');

    try {
      // Eliminar cuenta en la API de Xano
      await eliminarApostador(usuario.id);

      // Eliminar de localStorage local
      const usuariosLocal = JSON.parse(localStorage.getItem('usuarios_local') || '[]');
      const usuariosActualizados = usuariosLocal.filter(u => u.id !== usuario.id);
      localStorage.setItem('usuarios_local', JSON.stringify(usuariosActualizados));

      // Limpiar sesión actual
      localStorage.removeItem('usuarioActual');

      setMensaje('Cuenta eliminada exitosamente');
      setMensajeTipo('success');

      setTimeout(() => {
        setMostrarConfirmDelete(false);
        if (onLogout) {
          onLogout();
        }
        onClose();
      }, 1500);

    } catch (error) {
      setMensaje(error.message || 'Error al eliminar la cuenta');
      setMensajeTipo('error');
      setMostrarConfirmDelete(false);
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
      padding: '20px',
      overflowY: 'auto'
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
          <div className="form">
            <h1>Mi Perfil</h1>
            
            {/* Información del usuario */}
            <div style={{ 
              background: 'rgba(255,255,255,0.05)', 
              padding: '20px', 
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h2 style={{ marginTop: 0 }}>Información Personal</h2>
              <p><strong>Nombre:</strong> {usuario.nombre} {usuario.apellido}</p>
              <p><strong>Usuario:</strong> {usuario.username}</p>
              <p><strong>Correo:</strong> {usuario.correo}</p>
              <p><strong>Saldo:</strong> ${usuario.saldo}</p>
            </div>

            {/* Sección de cambio de contraseña */}
            {!editandoPassword ? (
              <div className="fila fila-botones">
                <button 
                  onClick={() => setEditandoPassword(true)}
                  className="btn btn-primary"
                >
                  Cambiar Contraseña
                </button>
                <button 
                  onClick={() => setMostrarConfirmDelete(true)}
                  className="btn btn-primary"
                  style={{ background: 'var(--casino-red)' }}
                >
                  Eliminar Cuenta
                </button>
              </div>
            ) : (
              <form onSubmit={handleUpdatePassword}>
                <h2>Cambiar Contraseña</h2>
                
                <div className="fila">
                  <label htmlFor="passwordActual">Contraseña Actual</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="passwordActual"
                      name="passwordActual"
                      type={mostrarPasswordActual ? 'text' : 'password'}
                      value={passwordData.passwordActual}
                      onChange={handlePasswordChange}
                      required
                      style={{ paddingRight: '45px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarPasswordActual(!mostrarPasswordActual)}
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
                      {mostrarPasswordActual ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="fila">
                  <label htmlFor="passwordNueva">Nueva Contraseña</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="passwordNueva"
                      name="passwordNueva"
                      type={mostrarPasswordNueva ? 'text' : 'password'}
                      value={passwordData.passwordNueva}
                      onChange={handlePasswordChange}
                      minLength="6"
                      required
                      style={{ paddingRight: '45px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarPasswordNueva(!mostrarPasswordNueva)}
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
                      {mostrarPasswordNueva ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="fila">
                  <label htmlFor="confirmarPasswordNueva">Confirmar Nueva Contraseña</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="confirmarPasswordNueva"
                      name="confirmarPasswordNueva"
                      type={mostrarConfirmarPassword ? 'text' : 'password'}
                      value={passwordData.confirmarPasswordNueva}
                      onChange={handlePasswordChange}
                      minLength="6"
                      required
                      style={{ paddingRight: '45px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)}
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
                      {mostrarConfirmarPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="fila fila-botones">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={cargando}
                  >
                    {cargando ? 'Actualizando...' : 'Actualizar Contraseña'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setEditandoPassword(false);
                      setPasswordData({
                        passwordActual: '',
                        passwordNueva: '',
                        confirmarPasswordNueva: ''
                      });
                      setMensaje('');
                    }}
                    className="btn btn-primary"
                    style={{ background: '#666' }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {mensaje && (
              <p className={`mensaje ${mensajeTipo}`}>
                {mensaje}
              </p>
            )}
          </div>
        </main>
      </div>

      {/* Modal de confirmación para eliminar cuenta */}
      {mostrarConfirmDelete && (
        <ConfirmModal
          mensaje="¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer."
          onConfirm={handleDeleteAccount}
          onCancel={() => setMostrarConfirmDelete(false)}
          confirmText="Eliminar"
          cancelText="Cancelar"
        />
      )}
    </div>
  );
}

export default UserProfile;
