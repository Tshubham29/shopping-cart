const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const productsRoute = require('./routes/products');
const cartRoute = require('./routes/cart');

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected to :',process.env.MONGO_URI))
.catch(err => console.error('MongoDB connection error:', err));
app.use(cors())
app.use('/products', productsRoute);
app.use('/cart', cartRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
