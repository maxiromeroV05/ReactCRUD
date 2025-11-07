import React from 'react';

function Sidebar({ isOpen, onClose, onGoHome, onGoBlackjack, onGoComentarios, onOpenTuOpinion }) {
  const handle = (fn) => () => {
    try { fn && fn(); } finally { onClose && onClose(); }
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={onClose}>
        ☰
      </button>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`} id="sidebar">
        <div className="sidebar-header"></div>
        <nav className="sidebar-menu">
          <button onClick={handle(onGoHome)}>🏠 Inicio</button>
          <button onClick={handle(onGoBlackjack)}>🎮 BlackJack</button>
          <button onClick={handle(onGoComentarios)}>💬 Comentarios</button>
          <button onClick={handle(onOpenTuOpinion)}>📝 Tu Opinión</button>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
