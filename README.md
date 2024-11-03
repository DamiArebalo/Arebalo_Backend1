# 🚀 Segunda Entrega Backend 1

## Carlos Damian Arebalo

---

## 📚 Tabla de Contenidos
- [Descripción del Proyecto](#descripción-del-proyecto)
- [Estructura de Archivos](#estructura-de-archivos)
- [Componentes Principales](#componentes-principales)
  - [app.js](#appjs)
  - [productsRoutes.js](#productsroutesjs)
  - [cartsRouter.js](#cartsrouterjs)
  - [viewsRouter.js](#viewsrouterjs)
- [Controladores](#controladores)
  - [productController.js](#productcontrollerjs)
  - [cartsController.js](#cartscontrollerjs)
  - [categoryController.js](#categorycontrollerjs)
- [Modelos](#modelos)
- [Vistas y Tiempo Real](#vistas-y-tiempo-real)
- [Cómo Ejecutar Mi Código](#cómo-ejecutar-mi-código)

---

## 🌟 Descripción del Proyecto

Este proyecto es una aplicación Node.js que utiliza Express.js para crear una API backend para gestionar productos y carritos de compras. Integra MongoDB para la persistencia de datos, Socket.IO para actualizaciones en tiempo real y Handlebars como motor de plantillas para renderizar vistas dinámicas. El proyecto incluye funcionalidades avanzadas como paginación, filtrado y ordenamiento de productos, así como operaciones CRUD completas para carritos de compra.

---

## 📁 Estructura de Archivos

```
.
├── src
│   ├── app.js
│   ├── config.js
│   ├── uploader.js
│   ├── routes
│   │   ├── productsRoutes.js
│   │   ├── cartsRouter.js
│   │   └── viewsRouter.js
│   ├── dao
│   │   ├── models
│   │   │   ├── productsModel.js
│   │   │   ├── cartsModel.js
│   │   │   └── categoriesModel.js
│   │   ├── productController.js
│   │   ├── cartsController.js
│   │   └── categoryController.js
│   ├── views
│   │   ├── home.handlebars
|   |   ├── cart.handlebars
│   │   ├── realTimeProducts.handlebars
│   │   └── layouts
│   │       └── main.handlebars
│   └── public
│       ├── css
│       │   └── index.css
│       └── js
│           └── utils.js
└── README.md
```

---

## 🔑 Componentes Principales

### app.js

Este archivo es el punto de entrada principal de la aplicación:

- Configura Express y middleware necesarios
- Establece la conexión con MongoDB
- Configura Handlebars como motor de plantillas
- Inicializa Socket.IO para comunicación en tiempo real
- Define las rutas principales de la aplicación

### productsRoutes.js

Maneja todas las operaciones relacionadas con productos:

- 📋 **GET /api/products**: Obtener productos con filtros, paginación y ordenamiento
- 🔍 **GET /api/products/:id**: Obtener un producto específico por ID
- ➕ **POST /api/products**: Agregar un nuevo producto
- 🔄 **PUT /api/products/:id**: Actualizar un producto existente
- ❌ **DELETE /api/products/:id**: Eliminar un producto

#### 🌈 Aspectos Destacados:
- Implementa filtrado por categoría y disponibilidad
- Soporta ordenamiento ascendente y descendente por precio
- Utiliza paginación para manejar grandes conjuntos de datos

### cartsRouter.js

Gestiona las operaciones del carrito de compras:

- 🛒 **POST /api/carts**: Crear un nuevo carrito
- 📦 **GET /api/carts/:cid**: Listar productos en un carrito específico
- ➕ **POST /api/carts/:cid/product/:pid**: Agregar un producto a un carrito
- ❌ **DELETE /api/carts/:cid/products/:pid**: Eliminar un producto del carrito
- 🔄 **PUT /api/carts/:cid**: Actualizar el carrito con un arreglo de productos
- 🔢 **PUT /api/carts/:cid/products/:pid**: Actualizar la cantidad de un producto en el carrito
- 🗑️ **DELETE /api/carts/:cid**: Eliminar todos los productos del carrito

#### 🌈 Aspectos Destacados:
- Utiliza referencias a productos en lugar de embeber los datos
- Implementa operaciones CRUD completas para carritos

### viewsRouter.js

Maneja las rutas para las vistas renderizadas:

- 🏠 **GET /**: Renderiza la vista principal con la lista de productos paginada
- 🔄 **GET /realtimeproducts**: Renderiza la vista de productos en tiempo real
- 🛒 **GET /carts/:cid**: Renderiza la vista de un carrito específico

#### 🌈 Aspectos Destacados:
- Utiliza Handlebars para renderizar las vistas
- Implementa paginación en la vista de productos
- Muestra detalles completos del carrito, incluyendo productos y total

---

## Controladores

### productController.js

Maneja la lógica de negocio para productos:

- Obtener productos con filtros y paginación
- Agregar, actualizar y eliminar productos
- Obtener estadísticas de productos

### cartsController.js

Gestiona la lógica de carritos de compra:

- Crear y obtener carritos
- Agregar y eliminar productos del carrito
- Actualizar cantidades de productos
- Calcular totales del carrito

### categoryController.js

Maneja operaciones relacionadas con categorías de productos:

- Buscar categorías por nombre

---

## Modelos

- **productsModel.js**: Define el esquema para productos
- **cartsModel.js**: Define el esquema para carritos, con referencia a productos
- **categoriesModel.js**: Define el esquema para categorías de productos

---

## 🖥️ Vistas y Tiempo Real

### Handlebars Templates

- **home.handlebars**: Muestra una lista paginada de productos
- **realTimeProducts.handlebars**: Presenta un formulario para agregar productos y una lista actualizable en tiempo real
- **cart.handlebars**: Muestra los detalles de un carrito específico, incluyendo:
  - Lista de productos en el carrito con título, precio y cantidad
  - Total del carrito
  - Botones para vaciar el carrito y completar la compra
  - Mensajes de carrito vacío y compra completada

### Socket.IO Integration

- Permite la actualización en tiempo real de la lista de productos
- Facilita la actualización del carrito en tiempo real

### Funcionalidades del Carrito

- Visualización detallada de los productos en el carrito
- Cálculo automático del total del carrito
- Opción para vaciar el carrito completamente
- Proceso de completar la compra
- Mensajes interactivos para carrito vacío y compra completada
- Integración con el controlador de carritos para operaciones en tiempo real

### Estilos y Interactividad

- Estilos CSS personalizados para la vista del carrito (cart.css)
- Interactividad mediante JavaScript para manejar acciones del carrito
- Mensajes dinámicos que se muestran/ocultan según las acciones del usuario

### Integración con Backend

- Utiliza helpers de Handlebars para formatear precios y manejar lógica condicional
- Interactúa con el backend a través de llamadas API para vaciar el carrito y completar la compra

---

## 🏃‍♂️ Cómo Ejecutar Mi Código

1. Asegúrate de tener Node.js y MongoDB instalados en tu sistema.
2. Clona el repositorio: `git clone https://github.com/DamiArebalo/Arebalo_Backend1.git`
3. Navega hasta el directorio del proyecto en tu terminal.
4. Ejecuta `npm install` para instalar las dependencias.
5. Configura las variables de entorno necesarias (como la URI de MongoDB) en un archivo `.env`.
6. Inicia el servidor con `npm start` o `node src/app.js`.
7. El servidor estará corriendo en `http://localhost:8080`.
8. Accede a `http://localhost:8080/views` para ver la lista de productos paginada.
9. Accede a `http://localhost:8080/views/realtimeproducts` para interactuar con la vista en tiempo real.
10. Utiliza `http://localhost:8080/api/carts/:cartId` para ver los detalles de un carrito específico.

> **Nota:** Asegúrate de tener instaladas las dependencias necesarias como `express`, `express-handlebars`, `socket.io`, y `mongoose`.





