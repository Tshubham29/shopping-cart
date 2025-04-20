import { render, screen, fireEvent } from '@testing-library/react';
import CartSidebar from './components/CartSidebar';
import { useCart } from './context/CartContext';
import '@testing-library/jest-dom'; 

jest.mock('./context/CartContext');

const mockUseCart = useCart as jest.MockedFunction<typeof useCart>;

describe('CartSidebar', () => {
  beforeEach(() => {
    mockUseCart.mockReturnValue({
      cart: [],
      increment: jest.fn(),
      decrement: jest.fn(),
      removeItem: jest.fn(),
      total: 0,
      loading: false,
      products: [], 
      error: null, 
      fetchCart: jest.fn(),
      addToCart: jest.fn(),
    });
  });

  it('renders loading state', () => {
    mockUseCart.mockReturnValueOnce({
      ...mockUseCart(),
      loading: true,
    });

    render(<CartSidebar isOpen={true} onClose={() => {}} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders empty cart state', () => {
    render(<CartSidebar isOpen={true} onClose={() => {}} />);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', () => {
    const onCloseMock = jest.fn();
    render(<CartSidebar isOpen={true} onClose={onCloseMock} />);

    const backdrop = screen.getByTestId('cart-backdrop');
    fireEvent.click(backdrop);

    expect(onCloseMock).toHaveBeenCalled();
  });
});
