import React, { useState } from 'react';

function Register({ onClose, onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    username: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
    mayor: false,
    terminos: false
  });
  const [mensaje, setMensaje] = useState('');
  const [mensajeTipo, setMensajeTipo] = useState(''); // 'success' o 'error'
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmarContrasena, setMostrarConfirmarContrasena] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.mayor) {
      setMensaje('Debes ser mayor de edad para registrarte');
      setMensajeTipo('error');
      return;
    }

    if (!formData.terminos) {
      setMensaje('Debes aceptar los términos y condiciones');
      setMensajeTipo('error');
      return;
    }

    if (formData.contrasena.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres');
      setMensajeTipo('error');
      return;
    }

    if (formData.contrasena !== formData.confirmarContrasena) {
      setMensaje('Las contraseñas no coinciden');
      setMensajeTipo('error');
      return;
    }

    // Guardar en localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    
    // Verificar si el correo ya existe
    const correoExiste = usuarios.find(u => u.correo === formData.correo);
    if (correoExiste) {
      setMensaje('Este correo ya está registrado');
      setMensajeTipo('error');
      return;
    }

    // Verificar si el nombre de usuario ya existe
    const usernameExiste = usuarios.find(u => u.username === formData.username);
    if (usernameExiste) {
      setMensaje('Este nombre de usuario ya está en uso');
      setMensajeTipo('error');
      return;
    }

    // Agregar nuevo usuario
    usuarios.push({
      nombre: formData.nombre,
      apellido: formData.apellido,
      username: formData.username,
      correo: formData.correo,
      contrasena: formData.contrasena,
      saldo: 1000 // Saldo inicial
    });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    // Mensaje de éxito
    setMensaje(`¡Registro exitoso! Bienvenido/a ${formData.nombre} ${formData.apellido}`);
    setMensajeTipo('success');

    // Limpiar formulario
    setFormData({
      nombre: '',
      apellido: '',
      username: '',
      correo: '',
      contrasena: '',
      confirmarContrasena: '',
      mayor: false,
      terminos: false
    });

    // Redirigir al login después de 2 segundos
    setTimeout(() => {
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
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
            <h1>Registrarse</h1>
            
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

            <div className="fila">
              <label htmlFor="contrasena">Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="contrasena"
                  name="contrasena"
                  type={mostrarContrasena ? 'text' : 'password'}
                  value={formData.contrasena}
                  onChange={handleChange}
                  minLength="6"
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

            <div className="fila">
              <label htmlFor="confirmarContrasena">Confirmar Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirmarContrasena"
                  name="confirmarContrasena"
                  type={mostrarConfirmarContrasena ? 'text' : 'password'}
                  value={formData.confirmarContrasena}
                  onChange={handleChange}
                  minLength="6"
                  required
                  style={{ paddingRight: '45px' }}
                />
                <button
                  type="button"
                  onClick={() => setMostrarConfirmarContrasena(!mostrarConfirmarContrasena)}
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
                  {mostrarConfirmarContrasena ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="fila checks">
              <input
                type="checkbox"
                id="mayor"
                name="mayor"
                checked={formData.mayor}
                onChange={handleChange}
              />
              <label htmlFor="mayor">Declaro ser mayor de edad</label>
            </div>

            <div className="fila checks">
              <input
                type="checkbox"
                id="terminos"
                name="terminos"
                checked={formData.terminos}
                onChange={handleChange}
              />
              <label htmlFor="terminos">Acepto términos y condiciones</label>
            </div>

            <div className="fila fila-botones">
              <button type="submit" className="btn btn-primary">Registrarse</button>
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

export default Register;
