import Cart from './models/cart.js';
import Product from './models/product.js';
import mongoose from 'mongoose';

class CartManager {

async getCart(req, res) {
  try {
    const { cid } = req.params;
    
    const cart = await Cart.findById(cid).populate('products');

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }

    console.log('Carrito recuperado:', cart); // Agregar esta línea para verificar los datos recuperados
    res.render('cart-details', { cartItems: cart.products });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

async createCart() {
  try {
    const cart = new Cart();
    await cart.save();
    console.log('Nuevo carrito creado:', cart);
    return cart;
  } catch (error) {
    console.error('Error al crear un carrito:', error);
    throw error;
  }
}

async addProduct(req, res) {
  try {
    const { cid } = req.params;
    const { product } = req.body;

    const cart = await Cart.findById(cid);

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }

    cart.products.push(product);

    await cart.save();

    res.json({ status: 'success', message: 'Product added to cart successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

async removeProduct(req, res) {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }

    cart.products = cart.products.filter((product) => product.toString() !== pid);

    await cart.save();

    res.json({ status: 'success', message: 'Product removed from cart' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

async updateCart(req, res) {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    const cart = await Cart.findById(cid);

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }

  
    console.log(products);
    
    cart.products = products;

    await cart.save();

    res.json({ status: 'success', message: 'Cart updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

async updateProductQuantity(req, res) {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findById(cid);

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }

    const product = cart.products.find((product) => product.toString() === pid);

    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found in cart' });
    }

    product.quantity = quantity;

    await cart.save();

    res.json({ status: 'success', message: 'Product quantity updated successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

// PERMITE BORRAR EL CARRITO 
async clearCart(req, res) {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid);

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }

    cart.products = [];

    await cart.save();

    res.json({ status: 'success', message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

async purchaseCart(req, res) {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate('products');

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }

    const productsToPurchase = []; // Almacenará los productos disponibles para la compra
    const productsNotPurchased = []; // Almacenará los productos sin suficiente stock

    for (const cartItem of cart.products) {
      // Verifica si el producto tiene suficiente stock
      const product = await Product.findById(cartItem.product);
      if (product.stock >= cartItem.quantity) {
        // El producto tiene suficiente stock, réstalo del stock del producto
        product.stock -= cartItem.quantity;
        await product.save();
        productsToPurchase.push(cartItem);
      } else {
        // El producto no tiene suficiente stock, omítelo
        productsNotPurchased.push(cartItem);
      }
    }

    // Realiza la lógica de finalización de la compra solo para los productos disponibles
    // Puedes calcular el precio total para los productos disponibles
    const amount = calculateTotalPrice(productsToPurchase);

    // Supongamos que se realiza una operación de pago simulada y se guarda un registro de la compra solo para los productos disponibles
    const purchase = {
      cart: cart._id,
      purchase_datetime: new Date(),
      amount,
      purchaser: req.user.email,
    };

    const purchaseRecord = await Purchase.create(purchase);

    // Actualiza el carrito solo con los productos disponibles
    cart.products = productsNotPurchased;
    await cart.save();

    // Responde con la lista de productos no comprados y un mensaje de éxito
    res.json({
      status: 'success',
      message: 'Purchase completed successfully',
      productsNotPurchased,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

}

//PERMITE BORRAR EL CARRITO DE LA BASE DE DATOS 

/*async deleteCartById(req, res) {
  try {
    const { cartId } = req.params;

    // Verifica si el ID del carrito es válido
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      return res.status(400).json({ error: 'ID de carrito no válido' });
    }

    // Busca y elimina el carrito por su ID
    const deletedCart = await Cart.findByIdAndRemove(cartId);

    // Verifica si se encontró y eliminó el carrito
    if (!deletedCart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Responde con un mensaje de éxito
    res.json({ message: 'Carrito eliminado con éxito' });
  } catch (error) {
    // Maneja los errores de manera adecuada
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
}*/

export default CartManager;