// homeView.js
import CustomRouter from '../../utils/customRouter.util.js';
import passport from '../../middlewares/passport.mid.js';
import UserController from '../../data/mongo/controllers/userController.js';
import ProductController from '../../data/mongo/controllers/productController.js';


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
        this.create('/register', passport.authenticate('register', {
            successRedirect: '/',
            failureRedirect: '/register',
        }));
        this.read('/login', getLogin);
        this.create('/login', passport.authenticate('login', {
            successRedirect: '/',
            failureRedirect: '/login',
        }));
        this.read('/logout', getLogout);
        this.read('/products', getProducts);
        this.read('/admin', getAdmin);
    }
}



// Route handler functions
async function getHome(req, res) {
    const { limit, page, sort, query } = req.query; // Agregar el parámetro sort

    const sortOrder = sort === 'desc' ? -1 : (sort === 'asc' ? 1 : null);


    const options = {
        limit: parseInt(limit) || 10,
        page: parseInt(page) || 1,
        sort: sortOrder !== null ? { priceList: sortOrder } : {},
        populate: 'category'
        // sort: sort ? { [sort]: 1 } : {} // Ordenar por el campo proporcionado
    };
    // console.log(options);

    const searchQuery = { ...JSON.parse(query || '{}'), status: true };
    const products = await productController.getPaginated(searchQuery, options);

    res.render('home', { 
        title: 'Inicio',
        user: req.user || "public",
        products: products
    });
}

async function getRegister(req, res) {
    res.render('register', { title: 'Registro' });
}

async function getLogin(req, res) {
    res.render('login', { title: 'Iniciar Sesión' });
}

async function getLogout(req, res) {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
}

async function getProducts(req, res) {
    try {
        const products = await productController.getAll();
        res.render('products', { 
            title: 'Productos',
            products, 
            user: req.user,
            isAdmin: req.user.role === 'admin'
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

let homeRouter = new HomeViewRouter();
homeRouter = homeRouter.getRouter();

export default homeRouter;