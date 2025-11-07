import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Footer from './components/Footer';
import Register from './components/Register';
import Login from './components/Login';
import ConfirmModal from './components/ConfirmModal';
import TuOpinion from './components/TuOpinion';
import Comentarios from './components/Comentarios';
import ComentariosCarrusel from './components/ComentariosCarrusel';
import Blackjack from './components/Blackjack';

// Importar imágenes
import blackjackImage from './assets/images/blackjack.jpg';
import comentarioImage from './assets/images/comentario.jpg';
import feedbackImage from './assets/images/feedback.jpg';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showTuOpinion, setShowTuOpinion] = useState(false);
  // Eliminado: Perfil
  const [currentView, setCurrentView] = useState('home'); // 'home' o 'comentarios'
  const [currentUser, setCurrentUser] = useState(null);

  // Verificar si hay una sesión activa al cargar la app
  useEffect(() => {
    const usuarioActual = localStorage.getItem('usuarioActual');
    if (usuarioActual) {
      const user = JSON.parse(usuarioActual);
      setCurrentUser(user);
      setIsLoggedIn(true);
      console.log('Usuario cargado:', user);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogin = () => {
    setShowLogin(true);
  };

  const handleLoginSuccess = (usuario) => {
    setCurrentUser(usuario);
    setIsLoggedIn(true);
  };

  const handleRegister = () => {
    setShowRegister(true);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('usuarioActual');
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
    // Abrir automáticamente el login después de registrarse
    setTimeout(() => {
      setShowLogin(true);
    }, 500);
  };

  return (
    <div className="App">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={toggleSidebar}
          onGoHome={() => { setCurrentView('home'); setSidebarOpen(false); }}
          onGoBlackjack={() => { setCurrentView('blackjack'); setSidebarOpen(false); }}
          onGoComentarios={() => { setCurrentView('comentarios'); setSidebarOpen(false); }}
          onOpenTuOpinion={() => { setShowTuOpinion(true); setSidebarOpen(false); }}
        />
        <Topbar 
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
        currentUser={currentUser}
        currentView={currentView}
        />

      {currentView === 'home' ? (
        <main className="contenedor-principal">
          {/* Card principal - Blackjack */}
          <section className="hero-card">
            <div className="hero-card-content">
              <div className="hero-text">
                <h2>🎰 BLACKJACK</h2>
                <p className="hero-subtitle">El juego clásico del casino</p>
                <p className="hero-description">
                  Desafía a la casa, alcanza 21 y gana. ¿Tienes lo que se necesita para vencer al crupier?
                </p>
                <button className="btn-play" onClick={() => setCurrentView('blackjack')}>
                  ▶ Jugar Ahora
                </button>
              </div>
              <div className="hero-image-container">
                <img src={blackjackImage} alt="Blackjack" className="hero-image" />
              </div>
            </div>
          </section>

          {/* Cards secundarias */}
          <section className="featured-cards">
            <div onClick={() => setCurrentView('comentarios')} className="featured-card">
              <div className="featured-card-content">
                <img src={comentarioImage} alt="Comentarios" className="featured-image" />
                <div className="featured-info">
                  <h3>💬 Comentarios</h3>
                  <p>Lee lo que otros usuarios están diciendo</p>
                  <span className="featured-arrow">→</span>
                </div>
              </div>
            </div>

            <div onClick={() => setShowTuOpinion(true)} className="featured-card">
              <div className="featured-card-content">
                <img src={feedbackImage} alt="Tu Opinión" className="featured-image" />
                <div className="featured-info">
                  <h3>⭐ Tu Opinión</h3>
                  <p>Comparte tu experiencia con nosotros</p>
                  <span className="featured-arrow">→</span>
                </div>
              </div>
            </div>
          </section>

          {/* Carrusel de comentarios */}
          <ComentariosCarrusel />
        </main>
      ) : currentView === 'blackjack' ? (
        <main className="blackjack-page">
          <div className="page-header">
            <button className="btn-back" onClick={() => setCurrentView('home')}>
              ← Volver al Inicio
            </button>
          </div>
          <Blackjack currentUser={currentUser} />
        </main>
      ) : (
        <main className="comentarios-page">
          <div className="page-header">
            <button className="btn-back" onClick={() => setCurrentView('home')}>
              ← Volver al Inicio
            </button>
            <h1 className="page-title">💬 FORO DE COMENTARIOS</h1>
          </div>
          <Comentarios isFullPage={true} />
        </main>
      )}

        <Footer />

      {showRegister && (
        <Register 
          onClose={() => setShowRegister(false)}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}

      {showLogin && (
        <Login 
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {showLogoutConfirm && (
        <ConfirmModal
          message="¿Estás seguro de que deseas cerrar sesión?"
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
        />
      )}

      {showTuOpinion && (
        <TuOpinion 
          onClose={() => setShowTuOpinion(false)}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onLoginRequest={() => {
            setShowTuOpinion(false);
            setShowLogin(true);
          }}
          onRegisterRequest={() => {
            setShowTuOpinion(false);
            setShowRegister(true);
          }}
        />
      )}

      {/* Perfil eliminado */}
    </div>
  );
}

export default App;
