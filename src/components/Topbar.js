import React from 'react';

function Topbar({ isLoggedIn, onLogin, onRegister, onLogout, onOpenProfile, onDeleteAccount, currentUser, currentView }) {
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
              onClick={onOpenProfile}
              title="Click para editar perfil"
            >
              {getIniciales()}
            </div>
            <button 
              onClick={onOpenProfile} 
              className="btn" 
              style={{ 
                marginLeft: '10px',
                background: 'var(--gold)',
                color: '#000',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '0.9rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 0 12px var(--gold-glow)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = 'none';
                e.target.style.transform = 'scale(1)';
              }}
              title="Editar perfil"
            >
              ✏️ Editar
            </button>
            <button 
              onClick={onDeleteAccount} 
              className="btn" 
              style={{ 
                marginLeft: '5px',
                background: 'var(--casino-red)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '0.9rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 0 12px rgba(220, 38, 38, 0.6)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = 'none';
                e.target.style.transform = 'scale(1)';
              }}
              title="Eliminar cuenta"
            >
              🗑️ Eliminar
            </button>
            <button 
              onClick={onLogout} 
              className="btn-ghost" 
              style={{ 
                marginLeft: '5px',
                background: 'transparent',
                color: 'var(--gold)',
                border: '1px solid var(--gold)',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '0.9rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--gold)';
                e.target.style.color = '#000';
                e.target.style.boxShadow = '0 0 12px var(--gold-glow)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = 'var(--gold)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Topbar;
