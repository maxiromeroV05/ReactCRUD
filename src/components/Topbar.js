import React from 'react';

function Topbar({ isLoggedIn, onLogin, onRegister, onLogout, currentUser, currentView }) {
  const getIniciales = () => {
    if (currentUser && currentUser.nombre && currentUser.apellido) {
      return (currentUser.nombre[0] + currentUser.apellido[0]).toUpperCase();
    }
    if (currentUser && currentUser.username) {
      return currentUser.username.substring(0, 2).toUpperCase();
    }
    return '??';
  };

  const getColorAvatar = () => {
    if (!currentUser || !currentUser.username) return '#3b82f6';
    const colores = [
      '#ef4444', '#f59e0b', '#10b981', '#3b82f6', 
      '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'
    ];
    const index = currentUser.username.length % colores.length;
    return colores[index];
  };

  const getTitulo = () => {
    switch(currentView) {
      case 'blackjack':
        return 'Blackjack';
      case 'comentarios':
        return 'Comentarios';
      default:
        return 'Casino 21';
    }
  };

  return (
    <header className="topbar">
      <h1>{getTitulo()}</h1>
      <nav className="acciones">
        {!isLoggedIn ? (
          <>
            <button onClick={onLogin} className="btn">Iniciar sesión</button>
            <button onClick={onRegister} className="btn btn-ghost">Registrarse</button>
          </>
        ) : (
          <div className="user-info-container">
            <span className="username-display">
              {currentUser && currentUser.username ? `@${currentUser.username}` : 'Usuario'}
            </span>
            <div 
              className="user-avatar"
              style={{ backgroundColor: getColorAvatar() }}
              onClick={onLogout}
              title="Click para cerrar sesión"
            >
              {getIniciales()}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Topbar;
