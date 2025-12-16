# 🎰 Casino21React - Sistema de Autenticación Local

## 📊 Estructura de Base de Datos en Xano

Tu base de datos de Xano tiene la siguiente estructura:

```
Tabla: apostador
├── id: integer (auto-generado)
├── created_at: timestamp (auto-generado)
├── nombre: text
├── apellido: text  
├── username: text
└── correo: email
```

**⚠️ IMPORTANTE:** La base de datos NO tiene campo de contraseña.

## 🔐 Sistema de Autenticación Implementado

Dado que Xano no almacena contraseñas en tu tabla, el sistema funciona así:

### Registro de Usuario:
1. Se envían a Xano: `nombre`, `apellido`, `username`, `correo`
2. Xano crea el usuario y devuelve el registro completo con `id` y `created_at`
3. **La contraseña se guarda LOCALMENTE** en `localStorage` del navegador
4. Estructura en localStorage:
   ```javascript
   usuarios_local = [
     {
       id: 1,
       created_at: timestamp,
       nombre: "Juan",
       apellido: "Pérez", 
       username: "juanp",
       correo: "juan@example.com",
       contrasena: "mipassword123" // Solo local
     }
   ]
   ```

### Login:
1. Se busca el usuario en `localStorage` (usuarios_local)
2. Se valida la contraseña localmente
3. Si coincide, el usuario se autentica
4. Si el usuario existe en Xano pero NO en localStorage, se le pide registrarse nuevamente

### Cambio de Contraseña:
1. Solo actualiza el `localStorage`
2. NO se envía nada a Xano (porque no tiene ese campo)

### Eliminación de Cuenta:
1. Se elimina de Xano vía API DELETE
2. Se elimina de `localStorage`
3. Se cierra la sesión automáticamente

## 📁 Archivos Modificados

### Servicios de API
**`src/services/apostadorService.js`**
- `crearApostador()` - POST a Xano + guarda contraseña en localStorage
- `obtenerApostadores()` - GET de Xano
- `actualizarApostador()` - PUT a Xano (solo datos de perfil)
- `actualizarContrasenaLocal()` - Actualiza contraseña en localStorage
- `eliminarApostador()` - DELETE de Xano
- `validarLogin()` - Valida contra localStorage

### Componentes
- **`Register.js`** - Registra en Xano y localStorage
- **`Login.js`** - Valida contra localStorage
- **`UserProfile.js`** - Gestión de perfil y contraseña
- **`Topbar.js`** - Botón de perfil
- **`App.js`** - Integración de todos los componentes

## 🚀 Cómo Usar

### 1. Registrar Usuario
```
1. Click en "Registrarse"
2. Completa todos los campos
3. El usuario se crea en Xano
4. La contraseña se guarda localmente
5. Puedes hacer login inmediatamente
```

### 2. Iniciar Sesión
```
1. Click en "Iniciar sesión"
2. Ingresa correo/username y contraseña
3. Se valida contra localStorage
4. Si existe y la contraseña coincide, accedes
```

### 3. Ver/Editar Perfil
```
1. Click en el avatar (círculo con iniciales)
2. Ve tu información:
   - Nombre y apellido
   - Username
   - Correo
3. Puedes cambiar tu contraseña (se guarda localmente)
4. Puedes eliminar tu cuenta (se elimina de Xano y local)
```

## ⚠️ Limitaciones del Sistema Actual

### Seguridad
- ❌ Las contraseñas están en texto plano en localStorage
- ❌ No hay hash de contraseñas
- ❌ No hay encriptación
- ❌ Cualquiera con acceso al navegador puede ver las contraseñas

### Persistencia
- ❌ Si limpias el localStorage, pierdes las contraseñas
- ❌ No funciona entre diferentes navegadores
- ❌ No funciona entre diferentes dispositivos
- ❌ Los usuarios existentes en Xano necesitan "re-registrarse" para crear contraseña local

### Sincronización
- ❌ No hay sincronización entre dispositivos
- ❌ Si otro admin crea usuarios en Xano, no tendrán contraseña local

## ✅ Soluciones Recomendadas (Para el Futuro)

### Opción A: Agregar Campo de Contraseña en Xano (RECOMENDADO)
1. Ve a tu tabla `apostador` en Xano
2. Agrega un nuevo campo: `contrasena` tipo `password`
3. Xano automáticamente hasheará las contraseñas
4. Crea un endpoint `/auth/login` para validación
5. Actualiza el código para usar el endpoint de auth

### Opción B: Usar Sistema de Autenticación de Xano
1. Usa el addon "Authentication" de Xano
2. Crea usuarios en la tabla de usuarios predeterminada
3. Usa tokens JWT para autenticación
4. Implementa refresh tokens

### Opción C: Autenticación Externa
1. Integra con Firebase Auth, Auth0, o similar
2. Almacena solo el UID en Xano
3. Deja que el servicio externo maneje passwords

## 🐛 Debugging

Para ver qué está pasando:
1. Abre DevTools (F12)
2. Ve a Console
3. Intenta registrarte o hacer login
4. Verás logs detallados de cada paso

Para ver los datos almacenados:
1. Abre DevTools (F12)
2. Ve a Application > Local Storage
3. Busca la key `usuarios_local`
4. Ahí verás todos los usuarios con sus contraseñas

## 📝 Estado Actual del Sistema

✅ **Funciona:**
- Registro de usuarios
- Login de usuarios
- Cambio de contraseña
- Eliminación de cuenta
- Persistencia de sesión

⚠️ **Limitaciones:**
- Solo funciona localmente
- No es seguro para producción
- No sincroniza entre dispositivos

## 🔄 Próximos Pasos Recomendados

1. **Corto plazo:**
   - Agregar campo `contrasena` a Xano
   - Implementar endpoint de autenticación en Xano
   - Migrar contraseñas de localStorage a Xano

2. **Mediano plazo:**
   - Implementar tokens JWT
   - Agregar refresh tokens
   - Implementar recuperación de contraseña

3. **Largo plazo:**
   - Migrar a Auth0 o Firebase Auth
   - Implementar 2FA
   - Agregar roles y permisos

## 📞 Soporte

Si necesitas ayuda:
1. Revisa los logs en la consola
2. Verifica el localStorage
3. Asegúrate de que Xano esté respondiendo correctamente
4. Lee la documentación de Xano sobre autenticación

---

**Nota:** Este sistema es funcional para desarrollo y pruebas, pero NO es recomendado para producción debido a las limitaciones de seguridad.
