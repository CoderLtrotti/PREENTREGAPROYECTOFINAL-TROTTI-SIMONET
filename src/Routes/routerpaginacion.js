import express from 'express';
import getProducts from '../dao/productspaginacion.js';

const productRoutes = express.Router();

productRoutes.get('/', getProducts);

export default productRoutes;