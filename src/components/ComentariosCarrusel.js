import React, { useState, useEffect } from 'react';

function ComentariosCarrusel() {
  const [comentarios, setComentarios] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Cargar comentarios desde localStorage
    const feedbacksGuardados = localStorage.getItem('feedbacks');
    if (feedbacksGuardados) {
      const feedbacks = JSON.parse(feedbacksGuardados);
      // Ordenar por fecha más reciente
      const ordenados = feedbacks.sort((a, b) => b.fecha - a.fecha);
      setComentarios(ordenados);
    }
  }, []);

  useEffect(() => {
    if (comentarios.length === 0) return;

    // Cambiar de comentario cada 5 segundos
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % comentarios.length);
        setIsAnimating(false);
      }, 300); // Duración de la animación de salida
    }, 5000);

    return () => clearInterval(interval);
  }, [comentarios.length]);

  const obtenerIniciales = (nombre) => {
    const palabras = nombre.trim().split(' ');
    if (palabras.length >= 2) {
      return (palabras[0][0] + palabras[1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  };

  const obtenerColorAvatar = (nombre) => {
    const colores = [
      '#ef4444', '#f59e0b', '#10b981', '#3b82f6', 
      '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'
    ];
    const index = nombre.length % colores.length;
    return colores[index];
  };

  const formatearFecha = (timestamp) => {
    const fecha = new Date(timestamp);
    const ahora = new Date();
    const diferencia = ahora - fecha;
    const minutos = Math.floor(diferencia / 60000);
    const horas = Math.floor(diferencia / 3600000);
    const dias = Math.floor(diferencia / 86400000);

    if (minutos < 1) return 'Hace un momento';
    if (minutos < 60) return `Hace ${minutos} min`;
    if (horas < 24) return `Hace ${horas}h`;
    if (dias < 7) return `Hace ${dias}d`;
    
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (comentarios.length === 0) {
    return (
      <div className="carrusel-comentarios">
        <div className="carrusel-header">
          <h3>💭 Lo que dicen nuestros usuarios</h3>
        </div>
        <div className="carrusel-empty">
          <p>Aún no hay comentarios. ¡Sé el primero en compartir tu opinión!</p>
        </div>
      </div>
    );
  }

  const comentarioActual = comentarios[currentIndex];

  return (
    <div className="carrusel-comentarios">
      <div className="carrusel-header">
        <h3>💭 Lo que dicen nuestros usuarios</h3>
        <div className="carrusel-indicators">
          {comentarios.map((_, index) => (
            <span
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>

      <div className={`carrusel-content ${isAnimating ? 'fade-out' : 'fade-in'}`}>
        <div className="comentario-destacado">
          <div className="quote-icon">"</div>
          <div className="comentario-body">
            <p className="comentario-text">{comentarioActual.comentario}</p>
            <div className="comentario-author">
              <div 
                className="avatar-small" 
                style={{ backgroundColor: obtenerColorAvatar(comentarioActual.nombre) }}
              >
                {obtenerIniciales(comentarioActual.nombre)}
              </div>
              <div className="author-info">
                <span className="author-name">{comentarioActual.nombre}</span>
                <span className="author-date">{formatearFecha(comentarioActual.fecha)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="carrusel-counter">
        {currentIndex + 1} / {comentarios.length}
      </div>
    </div>
  );
}

export default ComentariosCarrusel;
