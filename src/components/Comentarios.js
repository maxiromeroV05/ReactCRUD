import React, { useState, useEffect } from 'react';

function Comentarios({ isFullPage = false }) {
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    // Cargar feedbacks desde localStorage
    const feedbacksGuardados = localStorage.getItem('feedbacks');
    if (feedbacksGuardados) {
      const feedbacks = JSON.parse(feedbacksGuardados);
      // Ordenar por fecha más reciente primero
      const ordenados = feedbacks.sort((a, b) => b.fecha - a.fecha);
      setComentarios(ordenados);
    }
  }, []);

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

  return (
    <div className={isFullPage ? "comentarios-fullpage" : "comentarios-container"}>
      <div className="foro-header-content">
        <p className="foro-subtitulo">
          {comentarios.length} {comentarios.length === 1 ? 'comentario' : 'comentarios'}
        </p>
      </div>

      {comentarios.length === 0 ? (
        <div className="no-comentarios">
          <div className="empty-icon">💭</div>
          <p>No hay comentarios aún</p>
          <p className="texto-secundario">Sé el primero en compartir tu opinión</p>
        </div>
      ) : (
        <div className="foro-lista">
          {comentarios.map((comentario) => (
            <div key={comentario.id} className="comentario-card">
              <div className="comentario-header">
                <div className="usuario-info">
                  <div 
                    className="avatar" 
                    style={{ backgroundColor: obtenerColorAvatar(comentario.nombre) }}
                  >
                    {obtenerIniciales(comentario.nombre)}
                  </div>
                  <div className="usuario-datos">
                    <div className="usuario-nombre">{comentario.nombre}</div>
                    <div className="comentario-fecha">{formatearFecha(comentario.fecha)}</div>
                  </div>
                </div>
              </div>
              <div className="comentario-contenido">
                <p>{comentario.comentario}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Comentarios;
