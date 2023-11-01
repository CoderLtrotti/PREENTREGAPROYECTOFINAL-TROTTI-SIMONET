import { Router } from 'express';
import CartController from '../controllers/cart.controllers.js';
import { checkRoles } from '../middleware/checkroles.middleware.js';
import { isAuth } from '../middleware/auth.middleware.js';

const router = Router();
const cartController = new CartController();

// DELETE /api/carts/:cid/products/:pid - Remove a product from the cart
router.delete('/:cid/:productId/:pid', cartController.removeProduct);

// PUT /api/carts/:cid - Update the cart with an array of products
router.put('/:cid', cartController.updateCart);

// PUT /api/carts/:cid/products/:pid - Update the quantity of a product in the cart
router.put('/:cid/:productId/:pid', cartController.updateProductQuantity);

// DELETE /api/carts/:cid - Remove all products from the cart
router.delete('/:cid', cartController.clearCart);

// GET CART
router.get('/:cid', cartController.getCart);

router.post('/:cid/:productId', cartController.addProduct);
// CREATE CART
router.post('/', cartController.createCart);
 
router.delete('/:cid', cartController.clearCart);

router.post('/:cid/purchase', cartController.purchaseCart); 
router.post('/:cid/:productId', isAuth, checkRoles(['user']), cartController.addProduct);


router.put('/:cid', isAuth, checkRoles(['admin']), cartController.updateCart);
//RUTA PARA ELIMINAR EL CARRITO DE LA BASE DE DATOS , SE DEBE COMENTAR CLEAR CAR
//*router.delete('/:cartId', cartManager.deleteCartById);/*


export default router;