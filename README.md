# 🚀 Segunda Entrega Backend 1

## Carlos Damian Arebalo

---

## 📚 Tabla de Contenidos
- [Descripción del Proyecto](#descripción-del-proyecto)
- [Estructura de Archivos](#estructura-de-archivos)
- [Componentes Principales](#componentes-principales)
  - [productsRoutes.js](#productsroutesjs)
  - [cartsRouter.js](#cartsrouterjs)
  - [viewsRouter.js](#viewsrouterjs)
- [Vistas y Tiempo Real](#vistas-y-tiempo-real)
- [Cómo Ejecutar Mi Código](#cómo-ejecutar-mi-código)


---

## 🌟 Descripción del Proyecto

Este proyecto es una aplicación Node.js que utiliza Express.js para crear una API backend para gestionar productos y carritos de compras. Además, integra Socket.IO para actualizaciones en tiempo real y Handlebars como motor de plantillas para renderizar vistas dinámicas.

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
│   ├── views
│   │   ├── home.handlebars
│   │   ├── realTimeProducts.handlebars
│   │   └── layouts
│   │       └── main.handlebars
│   └── public
│       ├── css
│       │   └── index.css
│       └── admin.html
└── README.md
```

---

## 🔑 Componentes Principales

### productsRoutes.js

Este archivo maneja todas las operaciones relacionadas con productos:

- 📋 **GET /api/products**: Obtener todos los productos (con límite opcional)
- 🔍 **GET /api/products/:id**: Obtener un producto específico por ID
- ➕ **POST /api/products**: Agregar un nuevo producto
- 🔄 **PUT /api/products/:id**: Actualizar un producto existente
- ❌ **DELETE /api/products/:id**: Eliminar un producto

#### 🌈 Aspectos Destacados:
- Utiliza una clase `Product` para crear nuevos productos
- Implementa middleware de validación de entrada

### cartsRouter.js

Este archivo gestiona las operaciones del carrito de compras:

- 🛒 **POST /api/carts**: Crear un nuevo carrito
- 📦 **GET /api/carts/:cid**: Listar productos en un carrito específico
- ➕ **POST /api/carts/:cid/product/:pid**: Agregar un producto a un carrito

#### 🌈 Aspectos Destacados:
- Mantiene un array separado para los carritos
- Verifica la existencia del producto antes de agregarlo al carrito
- Incrementa la cantidad si el producto ya existe en el carrito


### viewsRouter.js

Este archivo maneja las rutas para las vistas renderizadas:

- 🏠 **GET /**: Renderiza la vista principal con la lista de productos
- 🔄 **GET /realtimeproducts**: Renderiza la vista de productos en tiempo real
- ➕ **POST /realtimeproducts**: Agrega un nuevo producto y actualiza la vista en tiempo real

#### 🌈 Aspectos Destacados:
- Utiliza Handlebars para renderizar las vistas
- Implementa Socket.IO para actualizaciones en tiempo real
- Crea nuevos productos utilizando la clase `Product`

---

## 🖥️ Vistas y Tiempo Real

### Handlebars Templates

- **home.handlebars**: Muestra una lista estática de productos
- **realTimeProducts.handlebars**: Presenta un formulario para agregar productos y una lista actualizable en tiempo real
- **main.handlebars**: Plantilla principal que define la estructura HTML común

### Socket.IO Integration

- Permite la actualización en tiempo real de la lista de productos
- Cuando se agrega un nuevo producto, todos los clientes conectados ven la actualización inmediatamente

### Agregar Nuevos Productos

1. Navega a la ruta `/views/realtimeproducts`
2. Completa el formulario con los detalles del producto
3. Envía el formulario
4. La página se actualizará automáticamente para todos los usuarios conectados, mostrando el nuevo producto

---



## 🏃‍♂️ Cómo Ejecutar Mi Código

1. Asegúrate de tener Node.js instalado en tu sistema.
2. Clona el repositorio en tu máquina local.
3. Navega hasta el directorio del proyecto en tu terminal.
4. Ejecuta `npm install` para instalar las dependencias.
5. Inicia el servidor con `node src/app.js`.
6. El servidor estará corriendo en `http://localhost:8080`.
7. Accede a `http://localhost:8080/views` para ver la lista de productos estática.
8. Accede a `http://localhost:8080/views/realtimeproducts` para interactuar con la vista en tiempo real.

> **Nota:** Asegúrate de tener instaladas las dependencias necesarias como `express`, `express-handlebars`, y `socket.io`.

---






