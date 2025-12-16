# 🎰 Casino21React - Integración con Xano

## ✅ Endpoints Integrados

### 1. POST - Registro de Usuario
- **URL**: `https://x8ki-letl-twmt.n7.xano.io/api:W_i_EmGE/apostador`
- **Ubicación**: Componente `Register.js`
- **Función**: Crea nuevos usuarios en la base de datos

### 2. GET - Obtener Usuarios
- **URL**: `https://x8ki-letl-twmt.n7.xano.io/api:W_i_EmGE/apostador`
- **Ubicación**: Componente `Login.js` (para validación)
- **Función**: Obtiene la lista de usuarios para validar credenciales

### 3. PUT - Actualizar Contraseña
- **URL**: `https://x8ki-letl-twmt.n7.xano.io/api:W_i_EmGE/apostador/{apostador_id}`
- **Ubicación**: Componente `UserProfile.js`
- **Función**: Permite a los usuarios cambiar su contraseña

### 4. DELETE - Eliminar Cuenta
- **URL**: `https://x8ki-letl-twmt.n7.xano.io/api:W_i_EmGE/apostador/{apostador_id}`
- **Ubicación**: Componente `UserProfile.js`
- **Función**: Permite a los usuarios eliminar su cuenta

## 🔧 Componentes Creados/Modificados

### Nuevos Archivos:
1. **`src/services/apostadorService.js`** - Servicio para manejar todas las peticiones a la API
2. **`src/components/UserProfile.js`** - Componente para gestionar perfil de usuario
3. **`XANO-AUTH-CONFIG.md`** - Documentación sobre configuración de autenticación

### Archivos Modificados:
1. **`src/components/Register.js`** - Ahora usa la API para registrar usuarios
2. **`src/components/Login.js`** - Ahora usa la API para validar login
3. **`src/components/ConfirmModal.js`** - Mejorado para ser más genérico
4. **`src/components/Topbar.js`** - Agregado botón para abrir perfil
5. **`src/App.js`** - Integrado el componente UserProfile

## ⚠️ PROBLEMA ACTUAL - Autenticación

### El Problema:
Xano está hasheando automáticamente las contraseñas, lo que hace que la comparación directa falle.

### Solución Temporal Implementada:
- Los usuarios que se registren AHORA podrán hacer login inmediatamente
- Se guarda una copia temporal de la contraseña en localStorage para pruebas

### Solución Permanente Requerida:

**Opción A: Crear endpoint de autenticación en Xano (RECOMENDADO)**
1. Ve a tu panel de Xano
2. Crea un endpoint: `POST /auth/login`
3. Usa el addon "Authentication" de Xano para validar contraseñas hasheadas
4. El código ya está preparado para usar este endpoint

**Opción B: Cambiar tipo de campo (NO RECOMENDADO - Inseguro)**
1. En Xano, cambia el campo `contrasena` de tipo `password` a `text`
2. Esto guardará contraseñas en texto plano (no seguro)

## 🚀 Cómo Usar

### Registro de Usuario:
1. Click en "Registrarse"
2. Completa el formulario
3. El usuario se crea en Xano con contraseña hasheada
4. Puedes hacer login inmediatamente (almacenado temporalmente)

### Login:
1. Click en "Iniciar sesión"
2. Ingresa correo/username y contraseña
3. **Para usuarios nuevos**: Login funcionará inmediatamente
4. **Para usuarios existentes en Xano**: Necesitas configurar el endpoint de auth

### Ver/Editar Perfil:
1. Una vez logueado, click en el avatar (círculo con iniciales)
2. Se abre el modal de perfil con tu información
3. Puedes cambiar tu contraseña
4. Puedes eliminar tu cuenta

### Cerrar Sesión:
1. Click en "Cerrar sesión" en el topbar

## 🐛 Debugging

### Ver logs en la consola del navegador:
1. Abre DevTools (F12)
2. Ve a la pestaña "Console"
3. Intenta hacer login
4. Verás mensajes detallados sobre el proceso de autenticación

### Mensajes comunes:
- `✓ Usuario encontrado en localStorage temporal` - Usuario registrado recientemente
- `✓ Método 2: Autenticación exitosa` - Endpoint /auth/login funcionando
- `CONTRASEÑA INCORRECTA o CONFIGURACIÓN NECESARIA` - Necesitas configurar Xano

## 📝 Próximos Pasos

1. **Configurar endpoint de autenticación en Xano** (ver XANO-AUTH-CONFIG.md)
2. **Agregar manejo de tokens JWT** si Xano lo proporciona
3. **Implementar sistema de saldo** (crear tabla separada en Xano)
4. **Agregar validación de sesión** al recargar la página
5. **Implementar recuperación de contraseña**

## 🔗 Enlaces Útiles

- [Documentación de Xano](https://docs.xano.com/)
- [Xano Authentication Addon](https://docs.xano.com/authentication)
- [API Base URL](https://x8ki-letl-twmt.n7.xano.io/api:W_i_EmGE)

## 📱 Contacto

Si necesitas ayuda adicional, consulta la documentación de Xano o contacta a tu desarrollador.
