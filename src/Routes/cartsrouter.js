import { Router } from 'express';
import Cart from '../dao/models/cart.js'; // Importa tu modelo de carrito aquí

const cartsrouter = Router();

cartsrouter.get('/', async (req, res) => {
  try {
    // Recupera todos los carritos desde la base de datos
    const carts = await Cart.find({}); // Asume que tienes un modelo de base de datos llamado 'Cart'

    // Extrae solo los IDs de los carritos
    const cartIds = carts.map((cart) => cart._id);

    // Renderiza la plantilla de Handlebars y pasa los IDs de los carritos
    res.render('cart', { cartIds });
  } catch (error) {
    console.error('Error al recuperar carritos:', error);
    res.status(500).send('Error al recuperar carritos');
  }
});

export default cartsrouter;