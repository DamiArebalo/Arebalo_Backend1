// homeView.js
import CustomRouter from '../../utils/customRouter.util.js';
import passport from '../../middlewares/passport.mid.js';
import userController from '../../controllers/userController.js';
import productController from '../../controllers/productController.js';
import config from '../../config.js';
import { verifyTokenUtil } from '../../utils/token.util.js';
import cookieParser from 'cookie-parser';
import { socketServer } from '../../app.js';
import e from 'express';

import validateUser from '../../middlewares/validateUser.mid.js';
import validateAdmin from '../../middlewares/validateAdmin.mid.js';
import UserDto from '../../dtos/userDto.js';


class HomeViewRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }

    // Inicializa las rutas del enrutador
    init() {
        this.read('/', getHome);
        this.read('/register', getRegister);
        this.create('/register', register);
        this.use('/login', cookieParser());
        this.read('/login', getLogin);
        this.create('/login', login);
        this.read('/logout', getLogout);
        this.read('/products', getProducts);
        this.read('/admin',validateUser,validateAdmin, getAdmin);
        
    }
}

// Función para manejar el inicio de sesión
async function login(req, res, next) {
    passport.authenticate('login', { session: false }, async (err, user, message) => {
        if (err || !user) {
            console.log("error: ", err);
            socketServer.emit('errorLogin', {
                err: err.message
            });
            return res.json401();
        }

        let token = req.token;
        console.log("token: ", token);

        if (token) {
            console.log("token guardado");
            res.cookie('authToken', token, { httpOnly: true, secure: true });
        }

        console.log("user loged: ", user);
        console.log("message loged: ", message);

        // Emitir evento de login
        socketServer.emit('loged', {
            message: message
        });

        return res.json200({ message: "ok" });
    })(req, res, next);
}

// Función para manejar el registro de usuarios
async function register(req, res, next) {
    passport.authenticate('register', { session: false }, async (err, user, message) => {
        if (err || !user) {
            console.log("error: ", err);

            socketServer.emit('errorRegister', {
                err: err.message
            });

            return res.json401();
        }

        console.log("user: ", user);
        console.log("message: ", message);

        socketServer.emit('registered', {
            message: message
        });
    })(req, res, next);
}

// Route handler functions

// Función para renderizar la vista principal (home)
async function getHome(req, res) {
    const { limit, page, sort, query } = req.query;

    const sortOrder = sort === 'desc' ? -1 : (sort === 'asc' ? 1 : null);

    let admin, isAuthenticated, userName;

    const options = {
        limit: parseInt(limit) || 10,
        page: parseInt(page) || 1,
        sort: sortOrder !== null ? { priceList: sortOrder } : {},
        populate: 'category',
        sort: sort ? { [sort]: 1 } : {}
    };

    // Obtener el token de la cookie
    const token = req.cookies.authToken;
    console.log("token: ", token);

    if (token) {
        try {
            const user = await tokenToUser(token);
            console.log("user get: ", user);
            userName = user.name;
            req.user = user;
            isAuthenticated = true;
           if(user.role === 'ADMIN')admin = true;
        } catch (error) {
            console.log("error en tokenToUser: ", error);
            return res.json401();
        }
    } else {
        console.log("No hay token");
        isAuthenticated = false;
        admin = false;
    }

    // console.log("isAdmin: " + admin);
    // console.log("isAuthenticated: " + isAuthenticated);
    // console.log("userName: " + userName);

    const searchQuery = { ...JSON.parse(query || '{}'), status: true };
    const products = await productController.getPaginated(searchQuery, options);

    res.render('home', {
        title: 'Inicio',
        user: req.user || "public",
        isAuthenticated: isAuthenticated,
        isAdmin: admin,
        products: products,
        route: "/views/home"
    });
}

// Función para renderizar la vista de registro
async function getRegister(req, res) {
    res.render('register', { title: 'Registro' });
}

// Función para renderizar la vista de inicio de sesión
async function getLogin(req, res) {
    res.render('login', { title: 'Iniciar Sesión' });
}

// Función para manejar el cierre de sesión
async function getLogout(req, res) {
    req.session.destroy();
    res.clearCookie('authToken');
    res.redirect('/views/home');
}

// Función para obtener y renderizar los productos
async function getProducts(req, res) {
    try {
        let isAdmin;
        if(req.user.role === 'ADMIN'){
            isAdmin = true;
        }else{
            isAdmin = false;
        }
        const { limit, page, sort, query } = req.query;

        const sortOrder = sort === 'desc' ? -1 : (sort === 'asc' ? 1 : null);

        const options = {
            limit: parseInt(limit) || 10,
            page: parseInt(page) || 1,
            sort: sortOrder !== null ? { priceList: sortOrder } : {},
            populate: 'category'
        };
        console.log(options);

        const searchQuery = { ...JSON.parse(query || '{}'), status: true };
        const products = await productController.getPaginated(searchQuery, options);
        console.log("products: ", products);

        res.render('home', {
            title: 'Productos',
            products: products,
            user: req.user,
            isAdmin: isAdmin
        });
    } catch (error) {
        res.status(500).send('Error al obtener productos');
    }
}


// Función para renderizar el panel de administración
async function getAdmin(req, res) {
    try {
        
        const products = await productController.getAllProducts();
        //console.log("products: ", products);

        const token = req.cookies.authToken;
        console.log("token: ", token);
        let admin, isAuthenticated;

        if (token) {
            try {
                const user = await tokenToUser(token);
                if (!user) {
                    const error = new Error("USER NOT FOUND");
                    error.statusCode = 404;
                    return error;
                }
            
                console.log("user get: ", user);
                console.log("user role: ", user.role);

                if (user.role !== "ADMIN") {
                    const error = new Error("USER NOT ADMIN");
                    error.statusCode = 401;
                    return error;
                }else{
                    isAuthenticated = true;
                    admin = true;
                }

                req.user = user;      
                
            } catch (error) {
                console.log("error en tokenToUser: ", error);
                return res.json401();
            }
        } else {
            console.log("No hay token");
            isAuthenticated = false;
            admin = false;
        }

       console.log("isAdmin: " + admin);
        // console.log("isAuthenticated: " + isAuthenticated);
        // console.log("userName: " + userName);


        const user = new UserDto(req.user);
        console.log("userDTO: ", user);

        if (!admin) {
            res.json404();
        }else{
            res.render('admin', {
                title: 'Panel de Administración',
                //products: products,
                user: user,
                isAdmin: admin,
                isAuthenticated: isAuthenticated,
            });

        }


        
    } catch (error) {
        res.status(500).send('Error al obtener productos para el panel de administración');
    }
}

// Función para convertir un token en un usuario
async function tokenToUser(token) {
    try {
        const verifydata = verifyTokenUtil(token);
        console.log("tokentouser"+verifydata._id);
        const user = await userController.getById(verifydata._id);

        if (user) {
            return user;
        } else {
            const error = new Error("USER NOT FOUND");
            error.statusCode = 401;
            return error;
        }
    } catch (error) {
        return error;
    }
}



let homeRouter = new HomeViewRouter();
homeRouter = homeRouter.getRouter();

export default homeRouter;
