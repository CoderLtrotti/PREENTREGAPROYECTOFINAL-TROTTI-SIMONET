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

import loginrouter from './Routes/loginroutes.js';
import sessionsRouter from './Routes/sessions.router.js';
import bodyParser from 'body-parser';
import usersRouter from './Routes/user.router.js'
import businessRouter from './Routes/business.router.js'
import ordersRouter from './Routes/orders.router.js'
import cors from "cors"
import cartsrouter from './Routes/cartsrouter.js';





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

app.use('/cart', cartsrouter);
  // Actualizar la cantidad de ejemplares

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

// Usar el enrutador de vistas
app.use('/', viewsRouter);
app.use('/login', loginrouter);
const webServer = app.listen(8080, () => {
  console.log('Escuchando 8080');
});

