# 🚀 Primer Entrega Backend 1

## Carlos Damian Arebalo

---

## 📚 Tabla de Contenidos
- [Descripción del Proyecto](#descripción-del-proyecto)
- [Estructura de Archivos](#estructura-de-archivos)
- [Componentes Principales](#componentes-principales)
  - [productsRoutes.js](#productsroutesjs)
  - [cartsRouter.js](#cartsrouterjs)
- [Cómo Ejecutar Mi Código](#cómo-ejecutar-mi-código)

---

## 🌟 Descripción del Proyecto

Este proyecto es una aplicación Node.js que utiliza Express.js para crear una API backend para gestionar productos y carritos de compras. Demuestra operaciones CRUD básicas y diseño de API RESTful.

---

## 📁 Estructura de Archivos

```
.
├── app.js
├── config.js
├── uploader.js
├──routes
│  ├── productsRoutes.js
│  └── cartsRouter.js
├──public
   └── uploads
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

---

## 🏃‍♂️ Cómo Ejecutar Mi Código

1. Asegúrate de tener Node.js instalado en tu sistema.
2. Clona el repositorio en tu máquina local.
3. Navega hasta el directorio del proyecto en tu terminal.
4. Ejecuta `npm install` para instalar las dependencias.
5. Inicia el servidor con `node src/app.js`.
6. El servidor estará corriendo en `http://localhost:8080`.

> **Nota:** Todas las pruebas e interacciones con la API se realizan utilizando Postman. Asegúrate de configurar tu entorno de Postman para probar los diversos endpoints descritos anteriormente.

---
