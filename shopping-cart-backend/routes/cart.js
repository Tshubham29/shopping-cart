const express = require('express');
const CartItem = require('../models/cartItem');
const Product = require('../models/product');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await CartItem.find().populate('productId');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || quantity < 1) {
      return res.status(400).json({ error: 'Invalid product or quantity' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let item = await CartItem.findOne({ productId });
    if (item) {
      item.quantity += quantity;
    } else {
      item = new CartItem({ productId, quantity });
    }

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

router.put('/:id', async (req, res) => {
  try {

    const { quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ error: 'Quantity must be at least 1' });
    const item = await CartItem
      .findByIdAndUpdate(req.params.id, { quantity }, { new: true })
      .populate('productId')
    if (item === null) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await CartItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

module.exports = router;
