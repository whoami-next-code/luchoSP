import { renderHook, act } from '@testing-library/react-hooks';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CartProvider, useCart } from '@/contexts/CartContext';
import { CartItem, Product } from '@/types';

const mockProduct: Product = {
  id: 1,
  name: 'Producto de Prueba',
  price: 99.99,
  image: '/images/product1.jpg',
  description: 'Descripción del producto',
  category: 'Categoría 1',
  stock: 10,
  rating: 4.5,
  reviews: 25,
  discount: 0,
};

const mockCartItem: CartItem = {
  id: 1,
  name: 'Producto de Prueba',
  price: 99.99,
  image: '/images/product1.jpg',
  quantity: 2,
  stock: 10,
};

// Wrapper para el provider
test('CartProvider renders without errors', () => {
  render(
    <CartProvider>
      <div>Test Content</div>
    </CartProvider>
  );
  
  expect(screen.getByText('Test Content')).toBeInTheDocument();
});

test('useCart hook throws error when used outside CartProvider', () => {
  // Silenciar console.error para esta prueba
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
  expect(() => {
    renderHook(() => useCart());
  }).toThrow('useCart must be used within a CartProvider');
  
  consoleSpy.mockRestore();
});

describe('Cart Context', () => {
  test('adds item to cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe('Producto de Prueba');
    expect(result.current.items[0].quantity).toBe(1);
  });

  test('increments quantity when adding existing item', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.addToCart(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
  });

  test('removes item from cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.removeFromCart(1);
    });

    expect(result.current.items).toHaveLength(0);
  });

  test('updates item quantity', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.updateQuantity(1, 3);
    });

    expect(result.current.items[0].quantity).toBe(3);
  });

  test('does not update quantity beyond stock', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.updateQuantity(1, 15); // stock es 10
    });

    expect(result.current.items[0].quantity).toBe(10);
  });

  test('clears cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
  });

  test('calculates total correctly', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.addToCart({ ...mockProduct, id: 2, price: 50 });
    });

    expect(result.current.total).toBe(149.99); // 99.99 + 50
  });

  test('toggles cart visibility', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.toggleCart();
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggleCart();
    });

    expect(result.current.isOpen).toBe(false);
  });

  test('persists cart to localStorage', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockProduct);
    });

    const storedData = localStorage.getItem('cart');
    expect(storedData).toBeTruthy();
    
    const parsedData = JSON.parse(storedData!);
    expect(parsedData.items).toHaveLength(1);
    expect(parsedData.items[0].name).toBe('Producto de Prueba');
  });

  test('loads cart from localStorage', () => {
    // Preparar localStorage con datos
    const existingCart = {
      items: [mockCartItem],
      isOpen: false,
    };
    localStorage.setItem('cart', JSON.stringify(existingCart));

    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe('Producto de Prueba');
    expect(result.current.items[0].quantity).toBe(2);
  });

  test('handles localStorage errors gracefully', () => {
    // Simular error de localStorage
    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('localStorage error');
    });

    // No debe lanzar errores
    expect(() => {
      renderHook(() => useCart(), {
        wrapper: CartProvider,
      });
    }).not.toThrow();

    getItemSpy.mockRestore();
  });
});

describe('Cart Component Integration', () => {
  test('CartProvider provides context to child components', () => {
    const TestComponent = () => {
      const { items, addToCart } = useCart();
      
      return (
        <div>
          <span data-testid="item-count">{items.length}</span>
          <button onClick={() => addToCart(mockProduct)}>Add Item</button>
        </div>
      );
    };

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('item-count')).toHaveTextContent('0');
    
    fireEvent.click(screen.getByText('Add Item'));
    
    expect(screen.getByTestId('item-count')).toHaveTextContent('1');
  });
});