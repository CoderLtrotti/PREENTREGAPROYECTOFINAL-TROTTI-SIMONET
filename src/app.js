import express from 'express';
import handlerbars from 'express-handlebars';
import { create } from 'express-handlebars';
import config from './config/config.js';
import viewsRouter from './Routes/viewsRouter.js';
import __dirname from './utils.js';
import mongoose from 'mongoose';
import ContenedorManager from './dao/ContenedorManager.js';
import CartManager from './dao/cartsManajer.js';
import productRoutes from './Routes/routerpaginacion.js';
import Product from './dao/models/product.js';
import Cart from './dao/models/cart.js';
import router from './Routes/cartRouter.js'
import Productrouter from './Routes/products.js';
import cookieParser from 'cookie-parser';
import cookieRouter from './Routes/cookies.router.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import userRouter from './Routes/user.router.js';
import initializePassport from './config/passport.config.js';
import passport from 'passport';


import sessionsRouter from './Routes/sessions.router.js';
import bodyParser from 'body-parser';
import usersRouter from './Routes/user.router.js'
import businessRouter from './Routes/business.router.js'
import ordersRouter from './Routes/orders.router.js'
import cors from "cors"





const app = express();
const contenedorManager = new ContenedorManager();
const cartManager = new CartManager();

const cart = new Cart();

 

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cors({ origin: 'http://localhost:8080', methods: ["GET", "POST", "PUT"] }))


            //DB conection usando config archivo.env

            mongoose.connect(config.dbConnectionString, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message);
  });
 
// Configurar la carpeta de vistas y el motor de plantillas
app.engine('handlebars', handlerbars.engine());
app.set('views', 'src/views');
/*app.set('views', '../views/');*/ //ruta alternativa para utilizar con node app.js
app.set('view engine', 'handlebars');
const hbs = create({
defaultLayout: '',
runtimeOptions: {
  allowProtoPropertiesByDefault: true,
  allowProtoMethodsByDefault: true,
}
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


app.use('/api/cart', router);
app.use('/api/usersRouter', usersRouter)
app.use("/api/business", businessRouter)
app.use("/api/orders", ordersRouter)
app.use('/api1/products', Productrouter);

app.use('/products', productRoutes);

  // Actualizar la cantidad de ejemplares

    app.get('/cart', async (req, res) => {
      try {
        // Recupera todos los carritos desde la base de datos
        const carts = await Cart.find({}); // Esto supone que tienes un modelo de base de datos llamado 'Cart'
    
        // Extrae solo los IDs de los carritos
        const cartIds = carts.map(cart => cart._id);
    
        // Renderiza la plantilla de Handlebars y pasa los IDs de los carritos
        res.render('cart', { cartIds });
      } catch (error) {
        console.error('Error al recuperar carritos:', error);
        res.status(500).send('Error al recuperar carritos');
      }
    });
  
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser('')); // Aquí puedes agregar una clave secreta si lo deseas

    app.use(
      session({
        store: MongoStore.create({
          mongoUrl:
            config.dbConnectionString, // DB conection usando config archivo.env
          mongoOptions: {
            useNewUrlParser: true,
          },
          ttl: 15,
        }),
        secret: config.sessionSecret, //aqui la session secret usando config archivo.env
        resave: true,
        saveUninitialized: true,
      })
    );
 initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.post('/api/sessions/login', passport.authenticate('local', { session: false }), (req, res) => {
  // Si la autenticación es exitosa, puedes responder con éxito aquí
  res.json({ message: 'Inicio de sesión exitoso' });
});
app.use('/', viewsRouter);
//Middleware cookies
app.post('/api/sessions/github', passport.authenticate('github'));
app.use('/api/sessions', sessionsRouter);
app.use('/cookies', cookieRouter);
app.use('/',viewsRouter);
app.use('/api/users', userRouter);
app.get('/register', (req, res) => {
  res.render('register', {
    title: 'Registrar nuevo Usuario'
  });
});
// Ruta principal para mostrar la página de inicio
app.get('/index', (req, res) => {
  const { user } = req.session;

  // Renderiza la vista "index" con el mensaje de bienvenida y el botón de cierre de sesión
  res.render('index', {
    title: 'Página de Inicio',
    user,
    showWelcomeMessage: !!user, // Muestra el mensaje de bienvenida si el usuario está autenticado
    showLogoutButton: !!user, // Muestra el botón de cierre de sesión si el usuario está autenticado
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body; // Supongamos que se envía el correo y la contraseña desde el formulario

  // Aquí debes realizar la lógica de autenticación, por ejemplo, consultar una base de datos
  // para verificar si el usuario existe y si la contraseña es válida

  // Ejemplo de verificación simple (esto puede variar dependiendo de tu implementación real):
  if (email === 'usuario@example.com' && password === 'contraseña') {
    // Autenticación exitosa, configura la variable de sesión con los datos del usuario
    const user = {
      id: 1,
      email: email,
      // Otras propiedades del usuario
    };
    req.session.user = user;

    // Redirige al usuario a la página de bienvenida (index)
    res.redirect('/index');
  } else {
    // Autenticación fallida, puedes mostrar un mensaje de error o redirigir a la página de inicio de sesión nuevamente
    res.render('login', { error: 'Credenciales incorrectas' });
  }
});
// Usar el enrutador de vistas
app.use('/', viewsRouter);

const webServer = app.listen(8080, () => {
  console.log('Escuchando 8080');
});

