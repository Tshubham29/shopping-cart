import React, { useState } from 'react';
import ProductList from './components/ProductList';
import CartSidebar from './components/CartSidebar';
import { useCart } from './context/CartContext';
import ErrorBoundary from './ErrorBoundary';

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { fetchCart } = useCart();

  return (
    <div className="App">
      <ErrorBoundary>
        <div style={{ width: '100%', textAlign: 'right' }}>
          <button
            className="btn"
            onClick={() => {
              setIsOpen(true);
              fetchCart();
            }}
          >
            <span>🛒 Open Cart</span>
          </button>
        </div>

        <ProductList />
        <CartSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </ErrorBoundary>
    </div>
  );
};

export default App;
