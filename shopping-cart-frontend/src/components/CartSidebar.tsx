import React from 'react';
import { useCart } from '../context/CartContext';
import './CartSidebar.css';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { cart, increment, decrement, removeItem, total, loading } = useCart();

  return (
    <>
      {isOpen && <div className="cart-backdrop" data-testid="cart-backdrop" onClick={onClose} />}

      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        {loading ? (
          <p className="cart-loading">Loading...</p>
        ) : cart.length === 0 ? (
          <p className="cart-empty">Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item._id} className="cart-item">
                  <div className="item-info">
                    <h4>{item.productId && item.productId.name}</h4>
                    <p>&#8377;{item.productId && item.productId.price * item.quantity}</p>
                    <div className="quantity-controls">
                      <button onClick={() => decrement(item._id)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increment(item._id)}>+</button>
                    </div>
                    <button className="remove" onClick={() => removeItem(item._id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <h3>Total: &#8377;{total ? total.toFixed(2) : 0}</h3>
              <button className="checkout-btn">Checkout</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default CartSidebar;
