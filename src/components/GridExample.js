import React from 'react';

function GridExample() {
  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <h2 style={{ 
        color: 'var(--gold)', 
        textAlign: 'center',
        marginBottom: '30px',
        textShadow: '0 0 12px var(--gold-glow)'
      }}>
        Ejemplo de Sistema Grid de 12 Columnas
      </h2>

      <div className="row" style={{ marginBottom: '20px' }}>
        <div className="col-4">
          <div className="panel">
            <h3>Columna 1 (4/12)</h3>
            <p>Esta columna ocupa 4 de 12 columnas (33.33%)</p>
          </div>
        </div>
        <div className="col-4">
          <div className="panel">
            <h3>Columna 2 (4/12)</h3>
            <p>Esta columna ocupa 4 de 12 columnas (33.33%)</p>
          </div>
        </div>
        <div className="col-4">
          <div className="panel">
            <h3>Columna 3 (4/12)</h3>
            <p>Esta columna ocupa 4 de 12 columnas (33.33%)</p>
          </div>
        </div>
      </div>

      <div className="row" style={{ marginBottom: '20px' }}>
        <div className="col-6">
          <div className="panel">
            <h3>Columna Izquierda (6/12)</h3>
            <p>Esta columna ocupa la mitad del ancho (50%)</p>
          </div>
        </div>
        <div className="col-6">
          <div className="panel">
            <h3>Columna Derecha (6/12)</h3>
            <p>Esta columna ocupa la mitad del ancho (50%)</p>
          </div>
        </div>
      </div>

      <div className="row" style={{ marginBottom: '20px' }}>
        <div className="col-8">
          <div className="panel">
            <h3>Contenido Principal (8/12)</h3>
            <p>Esta columna ocupa 8 de 12 columnas (66.67%)</p>
          </div>
        </div>
        <div className="col-4">
          <div className="panel">
            <h3>Sidebar (4/12)</h3>
            <p>Esta columna ocupa 4 de 12 columnas (33.33%)</p>
          </div>
        </div>
      </div>

      <div className="row" style={{ marginBottom: '20px' }}>
        <div className="col-3">
          <div className="panel">
            <h3>Col 1</h3>
            <p>25%</p>
          </div>
        </div>
        <div className="col-3">
          <div className="panel">
            <h3>Col 2</h3>
            <p>25%</p>
          </div>
        </div>
        <div className="col-3">
          <div className="panel">
            <h3>Col 3</h3>
            <p>25%</p>
          </div>
        </div>
        <div className="col-3">
          <div className="panel">
            <h3>Col 4</h3>
            <p>25%</p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="panel">
            <h3>Columna Completa (12/12)</h3>
            <p>Esta columna ocupa el ancho completo (100%)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GridExample;
