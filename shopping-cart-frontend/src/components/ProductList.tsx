import React from 'react';
import { useCart } from '../context/CartContext';
import './ProductList.css';

interface Product {
  _id: string;
  name: string;
  price: number;
}

const ProductList: React.FC = () => {
  const { addToCart, products } = useCart();

  return (
    <div className="page-container">
      <h1 className="page-title">Explore Products</h1>
      <div className="product-grid">
        {products.map((product: Product) => (
          <div key={product._id} className="product-card">
            <img
              loading="lazy"
              src={"/images/mobile.svg"}
              alt={product.name}
            />
            <h2>{product.name}</h2>
            <p className="price">&#8377;{product.price.toFixed(2)}</p>
            <button className="btn" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
