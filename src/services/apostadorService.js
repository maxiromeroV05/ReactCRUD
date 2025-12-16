const API_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:W_i_EmGE';

// POST - Crear un nuevo apostador (registro)
export const crearApostador = async (datosApostador) => {
  try {
    console.log('Enviando datos a Xano:', datosApostador);
    
    // Estructura que coincide con la base de datos de Xano:
    // id (auto), created_at (auto), nombre, apellido, username, correo
    const datosParaXano = {
      nombre: datosApostador.nombre,
      apellido: datosApostador.apellido,
      username: datosApostador.username,
      correo: datosApostador.correo
      // NO incluimos contraseña porque no existe en la BD
    };
    
    const response = await fetch(`${API_BASE_URL}/apostador`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosParaXano)
    });

    console.log('Respuesta del servidor:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error de la API:', errorData);
      throw new Error(errorData.message || 'Error al crear el apostador');
    }

    const resultado = await response.json();
    console.log('Usuario creado:', resultado);
    
    // Guardar la contraseña localmente para autenticación
    const usuarioCompleto = {
      ...resultado,
      contrasena: datosApostador.contrasena // Guardar localmente
    };
    
    // Guardar en localStorage para autenticación local
    const usuariosLocal = JSON.parse(localStorage.getItem('usuarios_local') || '[]');
    usuariosLocal.push(usuarioCompleto);
    localStorage.setItem('usuarios_local', JSON.stringify(usuariosLocal));
    
    return resultado;
  } catch (error) {
    console.error('Error en crearApostador:', error);
    throw error;
  }
};

// GET - Obtener todos los apostadores (para validar login)
export const obtenerApostadores = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/apostador`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener los apostadores');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en obtenerApostadores:', error);
    throw error;
  }
};

// PUT - Actualizar datos del apostador (nombre, apellido, username, correo)
export const actualizarApostador = async (apostadorId, datosActualizados) => {
  try {
    // Solo enviamos campos que existen en Xano
    const datosParaXano = {
      nombre: datosActualizados.nombre,
      apellido: datosActualizados.apellido,
      username: datosActualizados.username,
      correo: datosActualizados.correo
      // NO incluimos contraseña porque no existe en la BD
    };
    
    const response = await fetch(`${API_BASE_URL}/apostador/${apostadorId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosParaXano)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al actualizar el apostador');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en actualizarApostador:', error);
    throw error;
  }
};

// Actualizar contraseña localmente (ya que no existe en Xano)
export const actualizarContrasenaLocal = async (apostadorId, nuevaContrasena) => {
  try {
    const usuariosLocal = JSON.parse(localStorage.getItem('usuarios_local') || '[]');
    const index = usuariosLocal.findIndex(u => u.id === apostadorId);
    
    if (index !== -1) {
      usuariosLocal[index].contrasena = nuevaContrasena;
      localStorage.setItem('usuarios_local', JSON.stringify(usuariosLocal));
      return usuariosLocal[index];
    }
    
    throw new Error('Usuario no encontrado en almacenamiento local');
  } catch (error) {
    console.error('Error en actualizarContrasenaLocal:', error);
    throw error;
  }
};

// DELETE - Eliminar apostador
export const eliminarApostador = async (apostadorId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/apostador/${apostadorId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el apostador');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en eliminarApostador:', error);
    throw error;
  }
};

// Función de login con autenticación de Xano
export const loginApostador = async (emailOrUsername, password) => {
  try {
    // Primero intentamos obtener todos los apostadores
    const apostadores = await obtenerApostadores();
    
    // Buscar usuario por correo o username
    const apostador = apostadores.find(
      a => a.correo === emailOrUsername || a.username === emailOrUsername
    );

    if (!apostador) {
      return null; // Usuario no encontrado
    }

    // Intentar autenticar con Xano usando el endpoint de login
    // Xano espera el campo de contraseña para validar contra el hash
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: apostador.correo,
        password: password
      })
    });

    if (loginResponse.ok) {
      const authData = await loginResponse.json();
      return { ...apostador, authToken: authData.authToken };
    } else {
      // Si falla la autenticación, retornar null
      return null;
    }
  } catch (error) {
    console.error('Error en loginApostador:', error);
    // Si el endpoint de login no existe, hacemos un workaround
    // verificando manualmente la estructura de datos
    throw error;
  }
};

// Función de emergencia: Importar usuarios de Xano a localStorage con contraseña temporal
export const importarUsuariosDeXano = async (passwordTemporal = '123456') => {
  try {
    console.log('=== Importando usuarios desde Xano ===');
    
    // Obtener todos los usuarios de Xano
    const apostadores = await obtenerApostadores();
    console.log(`Total usuarios en Xano: ${apostadores.length}`);
    
    // Obtener usuarios locales existentes
    const usuariosLocal = JSON.parse(localStorage.getItem('usuarios_local') || '[]');
    const correosExistentes = usuariosLocal.map(u => u.correo);
    
    // Filtrar usuarios que NO están en localStorage
    const usuariosNuevos = apostadores.filter(a => !correosExistentes.includes(a.correo));
    
    if (usuariosNuevos.length === 0) {
      console.log('✓ Todos los usuarios de Xano ya están en localStorage');
      return { importados: 0, total: apostadores.length };
    }
    
    // Agregar contraseña temporal a usuarios nuevos
    const usuariosConPassword = usuariosNuevos.map(u => ({
      ...u,
      contrasena: passwordTemporal
    }));
    
    // Guardar en localStorage
    const todosLosUsuarios = [...usuariosLocal, ...usuariosConPassword];
    localStorage.setItem('usuarios_local', JSON.stringify(todosLosUsuarios));
    
    console.log(`✓ Se importaron ${usuariosNuevos.length} usuarios con contraseña temporal: "${passwordTemporal}"`);
    console.log('Usuarios importados:', usuariosNuevos.map(u => ({
      username: u.username,
      correo: u.correo
    })));
    
    return { 
      importados: usuariosNuevos.length, 
      total: apostadores.length,
      usuarios: usuariosNuevos 
    };
  } catch (error) {
    console.error('Error al importar usuarios:', error);
    throw error;
  }
};

// Función auxiliar para validar login
export const validarLogin = async (emailOrUsername, password) => {
  try {
    console.log('=== Validando Login ===');
    console.log('Buscando usuario:', emailOrUsername);
    console.log('Contraseña ingresada (longitud):', password.length);
    
    // IMPORTANTE: La BD de Xano NO tiene campo de contraseña
    // Por lo tanto, la autenticación se hace localmente usando localStorage
    
    // Buscar en localStorage (usuarios registrados con contraseña local)
    const usuariosLocal = JSON.parse(localStorage.getItem('usuarios_local') || '[]');
    console.log('Usuarios en localStorage:', usuariosLocal.length);
    console.log('Usuarios disponibles:', usuariosLocal.map(u => ({
      username: u.username,
      correo: u.correo,
      tienePassword: !!u.contrasena
    })));
    
    const usuarioLocal = usuariosLocal.find(
      u => (u.correo === emailOrUsername || u.username === emailOrUsername) 
           && u.contrasena === password
    );
    
    if (usuarioLocal) {
      console.log('✓ Usuario encontrado y contraseña válida');
      return usuarioLocal;
    }
    
    // Verificar si existe el usuario pero la contraseña es incorrecta
    const usuarioSinPassword = usuariosLocal.find(
      u => (u.correo === emailOrUsername || u.username === emailOrUsername)
    );
    
    if (usuarioSinPassword) {
      console.log('✗ Usuario encontrado pero contraseña incorrecta');
      console.log('Contraseña esperada:', usuarioSinPassword.contrasena);
      console.log('Contraseña ingresada:', password);
      return null;
    }
    
    // Verificar si el usuario existe en Xano pero no tiene contraseña local
    const apostadores = await obtenerApostadores();
    console.log('Total usuarios en Xano:', apostadores.length);
    
    const apostadorEnXano = apostadores.find(
      a => a.correo === emailOrUsername || a.username === emailOrUsername
    );

    if (apostadorEnXano) {
      console.log('⚠️ IMPORTANTE: Usuario existe en Xano pero NO tiene contraseña local');
      console.log('Usuario en Xano:', {
        id: apostadorEnXano.id,
        username: apostadorEnXano.username,
        correo: apostadorEnXano.correo
      });
      console.log('📝 Solución: Necesitas registrarte nuevamente desde este navegador');
      console.log('   O usar el usuario que registraste en ESTE navegador');
      return null;
    }
    
    console.log('✗ Usuario no encontrado ni en localStorage ni en Xano');
    return null;
  } catch (error) {
    console.error('Error en validarLogin:', error);
    throw error;
  }
};
