# Pruebas Unitarias con Jasmine y Karma

Este proyecto incluye pruebas unitarias para el componente Blackjack usando Jasmine como framework de testing y Karma como test runner.

## 📋 Configuración

### Dependencias instaladas:
- `jasmine-core`: Framework de testing
- `karma`: Test runner
- `karma-jasmine`: Adaptador de Jasmine para Karma
- `karma-chrome-launcher`: Lanzador de Chrome para Karma
- `karma-webpack`: Preprocesador de webpack
- `@babel/core`, `@babel/preset-env`, `@babel/preset-react`: Transpilación de código React
- `babel-loader`: Loader de Babel para webpack
- `@testing-library/react`, `@testing-library/jest-dom`: Utilidades de testing

### Archivos de configuración:
- `karma.conf.js`: Configuración principal de Karma
- `src/components/Blackjack.spec.js`: Archivo de pruebas del componente Blackjack

## 🧪 Pruebas Implementadas

### 1. **Renderizado del componente** (`should render the Blackjack component with initial elements`)
   - Verifica que el componente se renderice correctamente
   - Comprueba la presencia de elementos básicos: título CRUPIER, saldo, botón Repartir
   - Valida que las fichas estén presentes

### 2. **Selección de fichas** (`should enable deal button after selecting a chip`)
   - Verifica que el botón Repartir esté deshabilitado inicialmente
   - Comprueba que se habilita después de seleccionar una ficha
   - Valida el flujo de habilitación de la interfaz

### 3. **Acumulación de apuesta** (`should accumulate bet when clicking multiple chips`)
   - Verifica que la apuesta inicial sea 0
   - Comprueba que al hacer clic en múltiples fichas se acumule el valor
   - Valida la lógica de suma de apuestas (ejemplo: 100 + 50 = 150)

### 4. **Inicio de ronda** (`should deal cards when clicking Repartir button after selecting chip`)
   - Verifica el flujo completo de inicio de ronda
   - Comprueba que se repartan las cartas después de hacer clic en Repartir
   - Valida que haya al menos 2 cartas visibles (del jugador y crupier)

### 5. **Validación de saldo** (`should show insufficient balance message when selecting chip higher than balance`)
   - Verifica la validación de saldo insuficiente
   - Comprueba que aparezca un mensaje de advertencia
   - Valida que no se pueda seleccionar fichas mayores al saldo disponible

### 6. **Botones de acción** (`should enable action buttons during player turn`)
   - Verifica que los botones de acción (Pedir, Plantarse) se habiliten
   - Comprueba el estado de los botones durante el turno del jugador
   - Valida la interactividad del juego durante la partida

## 🚀 Ejecución de Pruebas

### Ejecutar todas las pruebas con Karma:
```powershell
npm run test:karma
```

Este comando:
1. Inicia el servidor de Karma
2. Abre Chrome automáticamente
3. Ejecuta todas las pruebas en `src/**/*.spec.js`
4. Muestra los resultados en la consola
5. Observa cambios en los archivos (modo watch)

### Ejecutar en modo single-run (CI):
Para ejecutar las pruebas una sola vez y salir (útil para CI/CD):

Edita `karma.conf.js` y cambia:
```javascript
singleRun: true
```

### Ejecutar con navegador headless:
Para ejecutar sin abrir ventana del navegador, instala:
```powershell
npm install --save-dev karma-chrome-launcher
```

Y en `karma.conf.js`:
```javascript
browsers: ['ChromeHeadless']
```

## 📊 Cobertura de Pruebas

Las 6 pruebas unitarias cubren:
- ✅ Renderizado de componentes
- ✅ Manejo de props (currentUser)
- ✅ Eventos de clic en botones y fichas
- ✅ Lógica de acumulación de apuesta
- ✅ Validación de reglas de negocio (saldo)
- ✅ Estados del juego (idle, player, dealer)
- ✅ Renderizado condicional de elementos

## 🔧 Solución de Problemas

### Si Karma no encuentra Chrome:
Asegúrate de tener Chrome instalado o usa ChromeHeadless:
```javascript
browsers: ['ChromeHeadless']
```

### Si hay errores de importación de imágenes:
El archivo `karma.conf.js` ya está configurado para manejar assets (png, jpg, svg).

### Si hay errores de CSS:
Los loaders `style-loader` y `css-loader` están configurados en webpack.

## 📝 Notas

- Las pruebas usan `@testing-library/react` para interactuar con los componentes
- Se usa `jest-dom` para matchers adicionales (`toBeInTheDocument`, etc.)
- Karma está configurado con webpack para transpilar código React/JSX
- El modo watch está activado por defecto para desarrollo iterativo
