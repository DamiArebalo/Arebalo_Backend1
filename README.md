# 🚀 Entrega Final Backend 1

## Carlos Damian Arebalo

---

## 📚 Tabla de Contenidos
- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Componentes Principales](#-componentes-principales)
  - [app.js](#appjs)
  - [customRouter.js](#customrouterjs)
- [Mapeo de Rutas](#-mapeo-de-rutas)
  - [indexRouter](#1-index-router-indexrouterjs)
  - [apiRouter](#2-api-router-apirouterjs)
  - [viewsRouter](#3-views-router-viewsrouterjs)
- [Autenticación con Passport](#-autenticación-con-passport)
  - [Register](#-register)
  - [Login](#-login)
  - [Utilidades Importantes](#-utilidades-importantes)
  - [Seguridad](#-seguridad)
- [Alertas de Confirmación y Error](#-alertas-de-confirmación-y-error)
- [Cómo Ejecutar Mi Código](#-cómo-ejecutar-mi-código)

---

## 🌟 Descripción del Proyecto

Este proyecto es una aplicación Node.js que utiliza Express.js para crear una API backend para gestionar productos y carritos de compras. Integra MongoDB para la persistencia de datos, Socket.IO para actualizaciones en tiempo real y Handlebars como motor de plantillas para renderizar vistas dinámicas. El proyecto incluye funcionalidades avanzadas como paginación, filtrado y ordenamiento de productos, así como operaciones CRUD completas para carritos de compra.

---

## 🔑 Componentes Principales

### app.js

Este archivo es el punto de entrada principal de la aplicación:

- **Configuración de Middleware**:
  - **Express**: Configura Express y middleware necesarios para el manejo de peticiones.
  - **Morgan**: Middleware para logging de peticiones.
  - **Cookie Parser**: Para analizar cookies.
  - **Express-session**: Manejo de sesiones con almacenamiento en MongoDB.

- **Configuración de Handlebars**: 
  - Define Handlebars como motor de plantillas, especificando la extensión de los archivos y el layout por defecto.

- **Conexión a la Base de Datos**: Establece la conexión con MongoDB.

- **Inicialización de Socket.IO**: Para comunicación en tiempo real.

- **Definición de Rutas**: Configura las rutas principales de la aplicación.

### customRouter.js

_Ubicado en `src/utils/customRouter.util.js`_

El `CustomRouter` facilita la creación de rutas en Express. Algunos puntos importantes:

- **Centraliza Errores**: Maneja errores de forma consistente.
- **Respuestas Personalizadas**: Define respuestas estándar (`json200`, `json404`, etc.).
- **Métodos CRUD**: Simplifica la definición de rutas para crear, leer, actualizar y eliminar.

#### ¿Cómo Funciona?

El `CustomRouter` utiliza varios métodos clave:

- **_applyCallbacks**: Transforma los callbacks en funciones asíncronas que manejan errores.
    ```javascript
    _applyCallbacks = (callbacks) =>
        callbacks.map((cb) => async (req, res, next) => {
            try {
                await cb(req, res, next);
            } catch (error) {
                return next(error);
            }
        });
    ```

- **responses**: Añade métodos de respuesta personalizados al objeto `res`.
    ```javascript
    responses = (req, res, next) => {
        res.json200 = (response, message) =>
            res.status(200).json({ response, message });
        res.json201 = (response, message) =>
            res.status(201).json({ response, message });
        res.json400 = (message) => res.status(400).json({ error: message });
        return next();
    };
    ```

- **create, read, update, destroy**: Métodos para definir rutas HTTP (`POST`, `GET`, `PUT`, `DELETE`).
    ```javascript
    create = (path, ...cbs) => {
        this._router.post(
            path,
            this.responses,
            this._applyCallbacks(cbs)
        );
    };
    read = (path, ...cbs) => {
        this._router.get(
            path,
            this.responses,
            this._applyCallbacks(cbs)
        );
    };
    ```

#### Beneficios:
- **Código Limpio**: Reduce repetición de código.
- **Flexibilidad**: Fácil de adaptar y extender.
- **Consistencia**: Respuestas uniformes en toda la API.



## Mapeo de Rutas

La aplicación está estructurada en dos ramas principales: **API** y **Views**, divididas en rutas específicas a través de los siguientes archivos:

### 1. **Index Router** (`indexRouter.js`)
- **Rutas Principales**:
  - `/api`: Rutas de la API
  - `/views`: Rutas de las vistas

### 2. **API Router** (`apiRouter.js`)
Maneja todas las rutas relacionadas con la API para operaciones CRUD sobre productos, carritos, usuarios y sesiones:

#### 📦 **Productos** (`/api/products`):
- **GET /**: Listar productos con filtros, paginación y ordenamiento.
- **GET /:id**: Obtener un producto específico por ID.
- **POST /**: Agregar un nuevo producto.
- **PUT /:id**: Actualizar un producto existente.
- **DELETE /:id**: Eliminar un producto.

#### 🛒 **Carritos** (`/api/carts`):
- **POST /**: Crear un nuevo carrito.
- **GET /:cid**: Listar productos en un carrito específico.
- **POST /:cid/products/:pid**: Agregar un producto a un carrito.
- **DELETE /:cid/products/:pid**: Eliminar un producto del carrito.
- **PUT /:cid**: Actualizar el carrito con un arreglo de productos.
- **PUT /:cid/products/:pid**: Actualizar la cantidad de un producto en el carrito.
- **DELETE /:cid**: Eliminar todos los productos del carrito.

#### 👥 **Usuarios** (`/api/users`):
- **POST /**: Crear un nuevo usuario.
- **GET /**: Listar todos los usuarios.
- **PUT /:id**: Actualizar un usuario.
- **DELETE /:id**: Eliminar un usuario.

#### 🔐 **Sesiones** (`/api/sessions`):
- **POST /logout**: Cerrar sesión.
- **GET /current**: Obtener datos la sesión actual mediante un token JWT.

### 3. **Views Router** (`viewsRouter.js`)
Gestiona las rutas para las vistas renderizadas que interactúan con el frontend:

#### 🔄 **Productos en Tiempo Real** (`views/products`):
- **GET /**: Renderiza la vista de productos .
- **GET /realtimeproducts**: Renderiza la vista de productos en tiempo real.
- **POST /realtime products**: Crear un nuevo producto en la vista de productos en tiempo real.

#### 🛒 **Carritos** (`views/carts):
- **GET /:cid`**: Renderiza la vista de un carrito específico.

#### 🏠 **Home** (`views/home`):
- **GET /**: Renderiza la vista principal.
- **GET /register**: Renderiza la vista de registro.
- **POST /register**: Registrar un nuevo usuario.
- **GET /login**: Renderiza la vista de inicio de sesión.
- **POST /login**: Iniciar sesión.
- **GET /logout**: Cerrar sesión.
- **GET /products**: Renderiza la vista de productos.
- **GET /admin**: Renderiza la vista de administración.

---

## 🔐 Autenticación con Passport

### 📝 Register

Nuestro proceso de registro utiliza Passport con una estrategia local para crear nuevas cuentas de usuario de forma segura. Aquí está lo que sucede entre bastidores:

1. 📧 Verificamos si el email ya existe en nuestra base de datos.
2. 🔒 Si el usuario es nuevo, utilizamos bcrypt para hashear la contraseña:
   ```javascript
   req.body.password = createHashUtil(password);

3. 👤 Creamos un nuevo usuario en la base de datos con la contraseña hasheada.
4. 🎉 ¡Listo! El usuario está registrado y listo para iniciar sesión.


### 🔑 Login

El proceso de inicio de sesión también utiliza Passport con una estrategia local. Así es como funciona:

1. 🔍 Buscamos al usuario en la base de datos por su email.
2. 🔐 Utilizamos bcrypt para verificar la contraseña:

```javascript
const verify = verifyHashUtil(passwordForm, passwordDb);
```


3. 🎫 Si las credenciales son correctas, generamos un token JWT:

```javascript
req.token = createTokenUtil(data);
```


4. 💾 Guardamos el token en el objeto del usuario y lo devolvemos.
5. 🟢 Actualizamos el estado del usuario a 'en línea'.


### 🛠️ Utilidades Importantes

- **createHashUtil**: Crea un hash seguro de la contraseña para almacenarla.
- **verifyHashUtil**: Compara una contraseña en texto plano con su versión hasheada.
- **createTokenUtil**: Genera un token JWT con la información del usuario.
- **verifyTokenUtil**: Verifica la validez de un token JWT.


### 🔒 Seguridad

- Utilizamos bcrypt para el hashing de contraseñas, lo que proporciona una capa adicional de seguridad contra ataques de fuerza bruta.
- Los tokens JWT nos permiten mantener sesiones sin estado, mejorando la escalabilidad de nuestra aplicación.


¡Con estas medidas, mantenemos la información de nuestros usuarios segura y nuestra aplicación robusta! 🚀

---
## ⚡ Alertas de Confirmación y Error

### Uso de SWAL fire y Sockets

Para manejar alertas de confirmación y error, utilizamos **SWAL fire** junto con **Sockets** para la emisión y escucha de eventos de cambios, tales como registro, inicio de sesión y agregar al carrito. Esto nos permite brindar una experiencia de usuario interactiva y en tiempo real.

### Funciones Principales

#### 1. Manejo de Conexiones de Socket (`handlerSockets.js`)

Este archivo se encarga de gestionar las conexiones de WebSocket y los eventos relacionados. Por ejemplo, cuando se agrega un producto o se actualiza el carrito, emitimos eventos a todos los clientes conectados.

- **Agregar Producto**: Escuchamos el evento `addProduct` y emitimos `productAdded` o `error` dependiendo del resultado.
    ```javascript
    socket.on('addProduct', async (productData) => {
        const newProduct = await addOneProduct(productData);
        if (newProduct) {
            socket.emit('productAdded', newProduct);
        } else {
            socket.emit('error', { message: 'Error al agregar el producto' });
        }
    });
    ```

- **Agregar al Carrito**: Similar al anterior, pero para actualizar el carrito.
    ```javascript
    socket.on('addToCart', async (data) => {
        const newCart = await addToCart(data);
        if (newCart) {
            socket.emit('cartUpdate', { message: 'Carrito actualizado', data: newCart });
        } else {
            socket.emit('errorCart', { message: 'Error al actualizar el carrito' });
        }
    });
    ```

#### 2. Función de Inicio de Sesión (`login` en `views/home/login`)

Esta función maneja el proceso de inicio de sesión, emitiendo eventos en caso de éxito o error.

- **Login**: Si el login es exitoso, emitimos el evento `loged`.
    ```javascript
    socketServer.emit('loged', { message: message });
    ```

- **Error de Login**: Si hay un error, emitimos `errorLogin`.
    ```javascript
    socketServer.emit('errorLogin', { err: err.message });
    ```

#### 3. Función de Registro (`register` en `views/home/register`)

Similar a la función de inicio de sesión, esta función maneja el proceso de registro, emitiendo eventos en caso de éxito o error.

- **Registro**: Emitimos `registered` si el registro es exitoso.
    ```javascript
    socketServer.emit('registered', { message: message });
    ```

- **Error de Registro**: Emitimos `errorRegister` en caso de error.
    ```javascript
    socketServer.emit('errorRegister', { err: err.message });
    ```

### Implementación en el Frontend

Utilizamos SWAL fire para mostrar alertas basadas en los eventos emitidos por los sockets. Por ejemplo, en el archivo `register.js`:

- **Escuchar Evento de Registro Exitoso**:
    ```javascript
    socket.on('registered', (data) => {
        Swal.fire({
            icon: 'success',
            title: 'Registro exitoso',
            text: data.message.message,
            timer: 3000
        }).then(() => {
            window.location.href = '/views/home/login';
        });
    });
    ```

- **Escuchar Evento de Error en Registro**:
    ```javascript
    socket.on('errorRegister', (data) => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: JSON.stringify(data.err),
            timer: 3000
        });
    });
    ```

De esta manera, garantizamos que los usuarios reciban retroalimentación inmediata y clara sobre sus acciones, mejorando la experiencia general de la aplicación.
---


## 🏃‍♂️ Cómo Ejecutar Mi Código

1. Asegúrate de tener Node.js y MongoDB instalados en tu sistema.
2. Clona el repositorio: `git clone https://github.com/DamiArebalo/Arebalo_Backend1.git`
3. Navega hasta el directorio del proyecto en tu terminal.
4. Ejecuta `npm install` para instalar las dependencias.
5. Configura las variables de entorno necesarias (como la URI de MongoDB) en un archivo `.env`.
6. Inicia el servidor con `node --watch src/app.js` o `node src/app.js`.
7. El servidor estará corriendo en `http://localhost:8080`.
8. Ingresa la ruta: `http://localhost:8080/views/home/` y prueba el codigo

> **Nota:** Asegúrate de tener instaladas las dependencias necesarias como `express`, `express-handlebars`, `socket.io`, y `mongoose`.





