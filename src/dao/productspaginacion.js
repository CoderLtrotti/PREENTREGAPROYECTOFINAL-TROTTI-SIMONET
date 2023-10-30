import Product from '../dao/models/product.js';






export default async function getProducts(req, res) {
    try {
      const { page = 1, limit = 10, category, availability, sort } = req.query;
  
      const filters = {
        category,
        availability,
      };
  
      const sortOptions = {};
  
      if (sort) {
        const [sortField, sortOrder] = sort.split(':');
        sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;
      }
  
      const skip = (page - 1) * limit;
  
      const products = await Product.find(filters)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
  
      const totalProducts = await Product.countDocuments(filters);
      const totalPages = Math.ceil(totalProducts / limit);
  
      const response = {
        status: 'success',
        payload: products,
        totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        page: parseInt(page),
        hasPrevPage: page > 1,
        prevLink: page > 1 ? `/products?limit=${limit}&page=${page - 1}` : null,
        nextLink: page < totalPages ? `/products?limit=${limit}&page=${page + 1}` : null,
      };
  
      res.render('product-details', {
        products,
        hasPrevPage: page > 1,
        prevPage: page > 1 ? page - 1 : null,
        hasNextPage: products.length === limit,
        nextPage: page + 1,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }