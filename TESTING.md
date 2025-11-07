# Pruebas Unitarias - Casino21 Blackjack

## Descripción

Este proyecto incluye pruebas unitarias completas para el componente de Blackjack utilizando **Jest** y **React Testing Library**, que son las herramientas estándar para testing en aplicaciones React modernas.

## Cobertura de Pruebas

### Archivo: `src/components/Blackjack.test.js`

Se han implementado **7 pruebas unitarias** que cubren los siguientes aspectos:

#### 1. **Renderizado Inicial**
- **Descripción**: Verifica que todos los elementos básicos del componente se renderizan correctamente.
- **Qué prueba**: Presencia de títulos (CRUPIER, JUGADOR), saldo, apuesta, botones de acción.

#### 2. **Sistema de Apuesta Acumulativa**
- **Descripción**: Valida que las fichas se pueden sumar al hacer múltiples clicks.
- **Qué prueba**: Lógica de apuesta acumulativa (100 + 50 + 100 = 250).

#### 3. **Bloqueo del Botón Repartir**
- **Descripción**: Verifica que el botón Repartir está deshabilitado hasta seleccionar una ficha.
- **Qué prueba**: Control de flujo del juego y validación de estado.

#### 4. **Validación de Saldo Insuficiente**
- **Descripción**: Comprueba que no se puede apostar más del saldo disponible.
- **Qué prueba**: Lógica de negocio y mensajes de error.

#### 5. **Botones de Acción en Estado Idle**
- **Descripción**: Verifica que los botones de juego están deshabilitados cuando no hay ronda activa.
- **Qué prueba**: Estados de los botones (Pedir, Plantarse, Doblar, Dividir).

#### 6. **Persistencia de Saldo por Usuario**
- **Descripción**: Valida que cada usuario tiene su propio saldo en localStorage.
- **Qué prueba**: Manejo de props (currentUser) y persistencia de datos.

#### 7. **Reset de Apuesta**
- **Descripción**: Comprueba que la apuesta se reinicia a 0 después de cada ronda.
- **Qué prueba**: Ciclo de vida del juego y limpieza de estado.

## Ejecutar las Pruebas

### Comando para ejecutar todas las pruebas:
```powershell
npm test
```

### Ejecutar solo las pruebas de Blackjack:
```powershell
npm test Blackjack.test.js
```

### Ejecutar con reporte de cobertura:
```powershell
npm test -- --coverage --watchAll=false
```

### Modo watch (re-ejecuta al guardar cambios):
```powershell
npm test -- --watch
```

## Estructura de Pruebas

```
src/
  components/
    Blackjack.js          # Componente principal
    Blackjack.test.js     # Pruebas unitarias
```

## Tecnologías Utilizadas

- **Jest**: Framework de testing (incluido en react-scripts)
- **React Testing Library**: Utilidades para testing de componentes React
- **@testing-library/user-event**: Simulación de eventos de usuario

## Notas sobre Jasmine/Karma

El proyecto usa **create-react-app** que viene preconfigurado con Jest. Jest es más moderno y recomendado para proyectos React que Jasmine/Karma. Las pruebas creadas cubren los mismos requisitos pero con mejor integración y rendimiento.

Si se requiere específicamente Jasmine/Karma, se puede configurar, pero requiere:
1. Desinstalar/desconfigurar Jest
2. Instalar jasmine-core, karma, karma-jasmine
3. Configurar karma.conf.js
4. Adaptar las pruebas a sintaxis Jasmine

## Resultados Esperados

Al ejecutar `npm test`, deberías ver:

```
PASS  src/components/Blackjack.test.js
  Blackjack Component
    ✓ debe renderizar el componente Blackjack con todos los elementos básicos
    ✓ debe acumular apuestas al hacer click en múltiples fichas
    ✓ el botón Repartir debe estar deshabilitado hasta seleccionar una ficha
    ✓ debe mostrar advertencia al intentar apostar más del saldo disponible
    ✓ los botones Pedir, Plantarse, Doblar y Dividir deben estar deshabilitados en estado idle
    ✓ debe guardar y cargar el saldo específico del usuario desde localStorage
    ✓ debe reiniciar la apuesta a 0 después de terminar una ronda

Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
```

## Mantenimiento

Para añadir nuevas pruebas:
1. Abre `src/components/Blackjack.test.js`
2. Añade un nuevo bloque `test('descripción', () => { ... })`
3. Guarda el archivo y las pruebas se ejecutarán automáticamente si tienes `npm test` corriendo

## Cobertura de Código

Para ver qué porcentaje del código está cubierto por pruebas:

```powershell
npm test -- --coverage --watchAll=false
```

Esto generará un reporte en `coverage/lcov-report/index.html` que puedes abrir en el navegador.
