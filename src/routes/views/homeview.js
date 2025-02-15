// homeView.js
import CustomRouter from '../../utils/customRouter.util.js';
import passport from '../../middlewares/passport.mid.js';
import UserController from '../../data/mongo/controllers/userController.js';
import ProductController from '../../data/mongo/controllers/productController.js';
import config from '../../config.js';
import { verifyTokenUtil } from '../../utils/token.util.js';
import cookieParser from 'cookie-parser';
import { socketServer } from '../../app.js';


const userController = new UserController();
const productController = new ProductController();

class HomeViewRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }

    init() {
        this.read('/', getHome);
        this.read('/register', getRegister);
        this.create('/register', register);
        this.read('/login', getLogin);
        this.create('/login', login);
        this.read('/logout', getLogout);
        this.read('/products', getProducts);
        this.read('/admin', getAdmin);
        this.use('/login', cookieParser());
    }
}

async function login(req, res, next){
    passport.authenticate('login', { session: false }, async (err, user, message)  => {
        if (err || !user) {
            console.log("error: ", err);
            socketServer.emit('errorLogin',{
                err: err.message
            });
            return res.json401();   
        }

        let token = req.token;
        console.log("token: ", token);
       
        if(token){
            console.log("token guardado");
            res.cookie('authToken', token, { httpOnly: true, secure: true })
        }
        

        console.log("user loged: ", user);
        console.log("message loged: ", message);
        

         // Emitir evento de login
         socketServer.emit('loged', {
            message: message
        });

        return res.json200({message: "ok"});
       
         
       
    })(req, res, next);
};

async function register(req, res, next){
    passport.authenticate('register', { session: false }, async (err, user, message)  => {
        
        if (err || !user) {
            console.log("error: ", err);

            socketServer.emit('errorRegister', {
                err: err.message
            });

            return res.json401();
            
        }
        
        //puesto de control
        console.log("user: ", user);
        console.log("message: ", message);

        socketServer.emit('registered',{
            message: message
        });

    })(req, res, next);
};    


// Route handler functions
async function getHome(req, res) {
    const { limit, page, sort, query } = req.query; 

    const sortOrder = sort === 'desc' ? -1 : (sort === 'asc' ? 1 : null);

    let admin, isAuthenticated, userName;

    const options = {
        limit: parseInt(limit) || 10,
        page: parseInt(page) || 1,
        sort: sortOrder !== null ? { priceList: sortOrder } : {},
        populate: 'category',
        sort: sort ? { [sort]: 1 } : {} // Ordenar por el campo proporcionado
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
            admin = await isAdmin(user);

        } catch (error) {
            console.log("error en tokenToUser: ", error);
            return res.json401() 
        }
    }else{
        
        console.log("No hay token");
        isAuthenticated = false;
        admin = false;

    }

    //puesto de control
    console.log("isAdmin: "+admin);
    console.log("isAuthenticated: "+isAuthenticated);
    console.log("userName: "+userName);

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

async function getRegister(req, res) {
    res.render('register', { title: 'Registro' });
}

async function getLogin(req, res) {
    res.render('login', { title: 'Iniciar Sesión' });
}

async function getLogout(req, res) {
    
     // Eliminar el token de la cookie
    req.session.destroy();
    res.clearCookie('authToken');
    res.redirect('/views/home');
     
}

async function getProducts(req, res) {
    
    try {
        const isAdmin = await isAdmin(req);
        const { limit, page, sort, query } = req.query; // Agregar el parámetro sort

        const sortOrder = sort === 'desc' ? -1 : (sort === 'asc' ? 1 : null);

        const options = {
            limit: parseInt(limit) || 10,
            page: parseInt(page) || 1,
            sort: sortOrder !== null ? { priceList: sortOrder } : {},
            populate: 'category'
            // sort: sort ? { [sort]: 1 } : {} // Ordenar por el campo proporcionado
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

async function getAdmin(req, res) {
    try {
        const products = await productController.getAll();
        
        res.render('admin', { 
            title: 'Panel de Administración',
            products, 
            user: req.user
        });
    } catch (error) {
        
        res.status(500).send('Error al obtener productos para el panel de administración');
    }
}

async function tokenToUser(token){
    try { 

        //verificar si existe el token
        const verifydata = verifyTokenUtil(token);
        //console.log(verifydata);
        const user = await userController.readById(verifydata._id);
        
        if(user){
            return user;
           
        }else{
            const error = new Error("USER NOT FOUND"); 
            error.statusCode = 401;
            return error;
        }
    }catch (error) {
        return error;
    }
}

async function isAdmin(user) {
    try {
        let result
        if(user){
            if(user.role == "ADMIN"){
                result = true;
            }else{
                result = false;
            }
            return result;
        }else{
            const error = new Error("USER NOT FOUND"); 
            error.statusCode = 401;
            return error;
        }
    }catch (error) {
        return error;
    }    
}

let homeRouter = new HomeViewRouter();
homeRouter = homeRouter.getRouter();

export default homeRouter;