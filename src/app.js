//dependencias principales
import express from 'express'; 
import "dotenv/config.js"; // Cargar variables de entorno desde .env
import morgan from 'morgan'; // Midd para manejo de peticiones
import cookieParser from 'cookie-parser'; // Midd para analizar cookies
import session from 'express-session'; // Midd para manejar sesiones

import mongoStore from 'connect-mongo'; // Almacén de sesiones en MongoDB

// Importar middlewares personalizados y rutas
import pathHandler from './middlewares/pathHandler.mid.js'; // Midd para manejar rutas
import errorHandler from './middlewares/errorHandler.mid.js'; // Midd para manejar errores
import indexRouter from './routes/indexRouter.js'; // Rutas principales de la aplicación
import dbConnect from './utils/dbConnect.js'; // Función para conectar a la base de datos
import config from './config.js'; // Configuración de la aplicación

//dependencias para handlebars
import Handlebars from 'handlebars'; // Motor de plantillas Handlebars
import { create } from 'express-handlebars'; // Motor de plantillas Handlebars
import {allowInsecurePrototypeAccess} from '@handlebars/allow-prototype-access'; // Seguridad para Handlebars

//dependencias para sockets
import { Server } from 'socket.io'; // Librería para manejar WebSockets
import { handleSocketConnection } from './sockets/handlerSockets.js'; // Función para manejar WebSockets



// Inicializar la aplicación Express
const app = express();

// Midd para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Midd para logging de peticiones
app.use(morgan('dev'));

// Midd para parsear cookies
app.use(cookieParser(process.env.SECRET_KEY));

// Midd para manejar sesiones
app.use(session({ 
    secret: process.env.SECRET_KEY, // Clave secreta para firmar la sesión
    resave: true, // Fuerza a guardar la sesión en cada petición
    saveUninitialized: true, // Guarda sesiones vacías
    store: new mongoStore({ // Almacén de sesiones en MongoDB
        mongoUrl: process.env.MONGODB_URI, // URL de conexión a MongoDB
        ttl: 60 * 60 * 24 // Tiempo de vida de la sesión en segundos
    })

}));

/**
 * Configuración de Handlebars como motor de plantillas.
 * Se especifica la extensión de los archivos, el layout por defecto y helpers personalizados.
 */
const hbs = create({
    extname: '.handlebars', // Extensión de los archivos de plantilla
    defaultLayout: 'main', // Layout por defecto
    helpers: {
        json: (context) => {
            return JSON.stringify(context); // Helper para convertir contexto a JSON
        },
        getPrice: function (product) {
            return product.offer !== 0 ? product.offer : product.priceList; // Helper para obtener el precio del producto
        }
    },
    handlebars: allowInsecurePrototypeAccess(Handlebars) // Permitir acceso inseguro a prototipos
});

// Configurar Handlebars como motor de plantillas en Express
app.engine('handlebars', hbs.engine);
app.set('views', `${config.DIRNAME}/views`); // Directorio de vistas
app.set('view engine', 'handlebars'); // Establecer Handlebars como motor de vistas

// Configuración de rutas
app.use(indexRouter); // Usar las rutas del indexRouter
app.use(pathHandler); // Usar el middleware para manejar rutas
app.use(errorHandler); // Usar el middleware para manejar errores

// Función que se ejecuta cuando el servidor está listo
const ready = () => {
    console.log(`Server activo en puerto ${config.PORT}`); // Mensaje en consola
    dbConnect.getInstance(); // Conectar a la base de datos
}

// Iniciar el servidor HTTP
const httpServer = app.listen(config.PORT, ready);

// Inicializar el servidor de WebSocket
const socketServer = new Server(httpServer);

// Manejar conexiones de clientes a través de WebSocket
socketServer.on('connection', handleSocketConnection);

// Exportar el servidor de WebSocket
export { socketServer };
