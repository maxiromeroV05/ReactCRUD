Este proyecto es una aplicación web desarrollada con React que implementa un CRUD completo (Create, Read, Update, Delete) y se conecta a una base de datos externa mediante Xano, funcionando como Backend as a Service (BaaS).

El objetivo del proyecto es demostrar cómo un frontend en React puede comunicarse con una API REST externa para gestionar datos de forma dinámica, moderna y escalable.

📌 ¿Qué hace este proyecto?

La aplicación permite:

✅ Crear registros
✅ Listar registros desde una base de datos externa
✅ Editar registros existentes
✅ Eliminar registros
✅ Consumir una API REST real (Xano)
✅ Manejar estado y eventos en React

Todo el flujo de datos se realiza mediante peticiones HTTP entre React y Xano.

🧠 Tecnologías utilizadas
Frontend

⚛ React JS

📦 Create React App

🌐 Fetch API / Axios (para consumir la API)

🎨 CSS básico

🧠 useState / useEffect

Backend / Base de Datos

☁ Xano

Base de datos en la nube

API REST

Gestión de endpoints

Persistencia de datos real

🏗 Arquitectura general
[ React (Frontend) ]
        |
        |  HTTP (GET, POST, PUT, DELETE)
        |
[ Xano (Backend + Base de Datos) ]


React se encarga de la interfaz y la lógica de usuario, mientras que Xano maneja la persistencia de datos y la lógica del servidor.

🗄 ¿Qué es Xano y por qué se usa?

Xano es una plataforma Backend as a Service que permite:

✔ Crear bases de datos sin programar backend
✔ Exponer datos mediante APIs REST
✔ Manejar endpoints CRUD fácilmente
✔ Evitar crear un backend tradicional (Java, Node, etc.)

En este proyecto, Xano reemplaza completamente el backend, actuando como:

Base de datos

Servidor

API REST

🔗 Comunicación con Xano

La aplicación se conecta a Xano usando URLs de endpoints REST, por ejemplo:

fetch("https://xano-url/api:endpoint")


Operaciones utilizadas:

Operación	Método HTTP
Obtener datos	GET
Crear datos	POST
Actualizar datos	PUT
Eliminar datos	DELETE
📂 Estructura del proyecto
ReactCRUD/
│
├── public/
│   └── index.html
│
├── src/
│   ├── components/
│   │   ├── Form.jsx
│   │   └── List.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.js
│   ├── index.js
│   └── App.css
│
├── package.json
└── README.md

📁 src/components

Contiene los componentes visuales, como:

Formularios

Listados

Botones de editar/eliminar

📁 src/services

Centraliza la lógica de conexión con Xano, separando la API del resto de la aplicación.

🔄 Flujo de funcionamiento

1️⃣ El usuario interactúa con la interfaz React
2️⃣ React ejecuta una función (crear, editar, eliminar, listar)
3️⃣ Se envía una petición HTTP a Xano
4️⃣ Xano procesa la solicitud y responde
5️⃣ React actualiza el estado y la interfaz

🧪 Manejo de estado

El proyecto utiliza:

useState → para manejar datos y formularios

useEffect → para cargar datos desde Xano al iniciar

Ejemplo:

useEffect(() => {
  obtenerDatos();
}, []);

▶️ Cómo ejecutar el proyecto
🔧 Requisitos

Node.js (v14 o superior)

npm o yarn

Acceso a una API creada en Xano

▶️ Pasos de instalación

1️⃣ Clonar el repositorio

git clone https://github.com/maxiromeroV05/ReactCRUD.git


2️⃣ Entrar al proyecto

cd ReactCRUD


3️⃣ Instalar dependencias

npm install


4️⃣ Ejecutar el proyecto

npm start


📍 Se abrirá en:

http://localhost:3000

🔐 Configuración de Xano

Para que el proyecto funcione correctamente:

✔ Debes tener una tabla creada en Xano
✔ Los endpoints deben estar activos
✔ La URL de la API debe coincidir con la usada en React

⚠️ Importante:
No subas tus API Keys privadas a GitHub.
Si es necesario, usa variables de entorno (.env).

🧩 Funcionalidades implementadas

✔ CRUD completo
✔ Conexión a base de datos real
✔ Separación de lógica y componentes
✔ Código legible y escalable
✔ Fácil de adaptar a otros proyectos

📈 Posibles mejoras futuras

🔐 Autenticación con Xano

🧭 React Router

🧪 Pruebas unitarias

📦 Context API o Redux

🎨 Mejorar UI/UX

🌍 Variables de entorno para producción

🎓 Uso académico

Este proyecto es ideal para:

✔ Evaluaciones académicas
✔ Aprender CRUD con React
✔ Consumo de APIs reales
✔ Introducción a Backend as a Service
