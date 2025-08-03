import React, { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart, saveForLater, moveToCart, clearCart, addToCart, updateStock } from '../store';
import { useTheme, useNotifications } from '../App';

const Cart = ({ onContinueShopping }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { addNotification } = useNotifications();
  const cartItems = useSelector((state) => state.cart.items);
  const savedItems = useSelector((state) => state.cart.savedForLater);
  const products = useSelector((state) => state.products.items);
  
  const [showSaved, setShowSaved] = useState(false);
  const [clearMessage, setClearMessage] = useState('');
  
  const subtotal = useMemo(() => 
    cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0),
    [cartItems]
  );
  
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  
  const getCategoryIcon = (category) => {
    const icons = {
      'ELECTRONICS': '📱',
      'CLOTHING': '👕',
      'BOOKS': '📚',
      'HOME': '🏠',
      'SPORTS': '⚽'
    };
    return icons[category] || '📦';
  };
  
  const handleQuantityUpdate = (item, newQuantity) => {
    const currentStock = products[item.product.id]?.stock || 0;
    const diff = newQuantity - item.quantity;
    
    if (diff > 0 && currentStock < diff) {
      addNotification({
        message: `Only ${currentStock} more items available`,
        type: 'warning'
      });
      return;
    }
    
    if (newQuantity <= 0) {
      dispatch(removeFromCart(item.product.id));
      dispatch(updateStock(item.product.id, currentStock + item.quantity));
      addNotification({
        message: `Removed ${item.product.name} from cart`,
        type: 'info'
      });
    } else {
      dispatch(updateQuantity(item.product.id, newQuantity));
      dispatch(updateStock(item.product.id, currentStock - diff));
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    setClearMessage('Cart cleared successfully!');
    addNotification({
      message: 'Cart cleared',
      type: 'info'
    });
    
    setTimeout(() => {
      setClearMessage('');
    }, 3000);
  };
  
  const getResponsiveStyles = () => {
    const width = window.innerWidth;
    const isMobile = width < 499;
    const isTablet = width >= 499 && width < 768;
    
    return {
      container: {
        backgroundColor: colors.surface,
        padding: isMobile ? '12px' : isTablet ? '16px' : '20px',
        borderRadius: '12px',
        minHeight: '300px',
        border: `1px solid ${colors.border}`,
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
      },
      header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isMobile ? '16px' : '20px',
        flexWrap: 'wrap',
        gap: '12px'
      },
      title: {
        margin: 0,
        color: colors.text,
        fontSize: isMobile ? '18px' : '22px',
        fontWeight: '700'
      },
      clearBtn: {
        padding: isMobile ? '6px 12px' : '8px 16px',
        border: `2px solid ${colors.error}`,
        borderRadius: '6px',
        backgroundColor: 'transparent',
        color: colors.error,
        cursor: 'pointer',
        fontSize: isMobile ? '11px' : '13px',
        fontWeight: '600',
        transition: 'all 0.2s ease'
      },
      cartItem: {
        display: 'flex',
        gap: isMobile ? '8px' : '12px',
        padding: isMobile ? '12px' : '16px',
        borderBottom: `1px solid ${colors.border}`,
        backgroundColor: colors.background,
        borderRadius: '8px',
        marginBottom: '12px',
        flexDirection: isMobile ? 'column' : 'row',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)'
      },
      productIcon: {
        width: isMobile ? '60px' : '70px',
        height: isMobile ? '60px' : '70px',
        background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`,
        borderRadius: '6px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: isMobile ? '20px' : '24px',
        fontWeight: 'bold',
        color: colors.primary,
        border: `1px solid ${colors.border}`,
        alignSelf: isMobile ? 'center' : 'flex-start'
      },
      quantityControls: {
        display: 'flex',
        alignItems: 'center',
        border: `2px solid ${colors.border}`,
        borderRadius: '6px',
        overflow: 'hidden',
        backgroundColor: colors.background,
        height: '32px'
      },
      quantityBtn: {
        padding: '4px 8px',
        border: 'none',
        backgroundColor: colors.background,
        color: colors.text,
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        transition: 'background-color 0.2s ease',
        minWidth: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      quantityInput: {
        width: '40px',
        padding: '4px 2px',
        border: 'none',
        textAlign: 'center',
        backgroundColor: colors.background,
        color: colors.text,
        fontSize: '13px',
        fontWeight: '600',
        outline: 'none'
      }
    };
  };
  
  const styles = getResponsiveStyles();
  
  if (cartItems.length === 0 && savedItems.length === 0) {
    return (
      <div 
        className="empty-cart card"
        id="empty-cart-container"
        data-testid="empty-cart"
        style={{
          backgroundColor: colors.surface,
          padding: window.innerWidth < 499 ? '30px 16px' : '50px 30px',
          borderRadius: '12px',
          textAlign: 'center',
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          border: `1px solid ${colors.border}`
        }}
      >
        <div className="empty-cart-icon" style={{ 
          fontSize: window.innerWidth < 499 ? '48px' : '64px', 
          marginBottom: '20px' 
        }}>
          🛒
        </div>
        <h2 className="empty-cart-title" style={{ 
          color: colors.text, 
          marginBottom: '12px', 
          fontSize: window.innerWidth < 499 ? '20px' : '24px' 
        }}>
          Your cart is empty
        </h2>
        <p className="empty-cart-description" style={{ 
          color: colors.textSecondary, 
          marginBottom: '24px', 
          fontSize: window.innerWidth < 499 ? '14px' : '16px',
          maxWidth: '280px',
          lineHeight: '1.4'
        }}>
          Start shopping to add items to your cart
        </p>
        <button
          className="continue-shopping-btn btn"
          id="continue-shopping-button"
          data-testid="continue-shopping-button"
          onClick={onContinueShopping}
          style={{
            padding: window.innerWidth < 499 ? '12px 24px' : '16px 32px',
            backgroundColor: colors.primary,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: window.innerWidth < 499 ? '14px' : '16px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
          }}
        >
          🛍️ Continue Shopping
        </button>
      </div>
    );
  }
  
  return (
    <div 
      className="cart-container card"
      id="cart-main-container"
      data-testid="cart-container"
      style={styles.container}
    >
      {/* Cart Header */}
      <div 
        className="cart-header"
        id="cart-header"
        style={styles.header}
      >
        <h2 
          className="cart-title"
          id="cart-title"
          data-testid="cart-title"
          style={styles.title}
        >
          🛒 Cart ({cartItems.length})
        </h2>
        
        <button
          className="clear-cart-btn"
          id="clear-cart-button"
          data-testid="clear-cart-button"
          onClick={handleClearCart}
          style={styles.clearBtn}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = colors.error;
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = colors.error;
          }}
        >
          🗑️ Clear
        </button>
      </div>
      
      {clearMessage && (
        <div 
          className="clear-message animate-fadeIn"
          id="clear-success-message"
          data-testid="clear-message"
          style={{
            padding: '10px 16px',
            backgroundColor: colors.success,
            color: 'white',
            borderRadius: '6px',
            marginBottom: '16px',
            textAlign: 'center',
            fontWeight: '600',
            fontSize: window.innerWidth < 499 ? '12px' : '14px',
            boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)'
          }}
        >
          ✅ {clearMessage}
        </div>
      )}
      
      {/* Cart Items */}
      <div className="cart-items" id="cart-items-list" style={{ marginBottom: '20px' }}>
        {cartItems.map(item => (
          <div
            key={item.product.id}
            className="cart-item"
            id={`cart-item-${item.product.id}`}
            data-testid={`cart-item-${item.product.id}`}
            style={styles.cartItem}
          >
            <div
              className="cart-item-icon"
              id={`cart-item-icon-${item.product.id}`}
              style={styles.productIcon}
            >
              {getCategoryIcon(item.product.category)}
            </div>
            
            <div className="cart-item-details" style={{ flex: 1, minWidth: 0 }}>
              <h3 
                className="cart-item-name"
                id={`cart-item-name-${item.product.id}`}
                style={{ 
                  margin: '0 0 4px 0',
                  color: colors.text,
                  fontSize: window.innerWidth < 499 ? '14px' : '16px',
                  fontWeight: '600',
                  lineHeight: '1.3'
                }}
              >
                {item.product.name}
              </h3>
              
              <div 
                className="cart-item-category"
                style={{
                  fontSize: window.innerWidth < 499 ? '10px' : '12px',
                  color: colors.textSecondary,
                  marginBottom: '6px',
                  textTransform: 'capitalize'
                }}
              >
                📂 {item.product.category.toLowerCase().replace('_', ' ')}
              </div>
              
              <p 
                className="cart-item-price"
                id={`cart-item-price-${item.product.id}`}
                style={{ 
                  margin: '0 0 12px 0', 
                  color: colors.textSecondary,
                  fontSize: window.innerWidth < 499 ? '12px' : '14px'
                }}
              >
                {formatPrice(item.product.price)} each
              </p>
              
              <div 
                className="cart-item-controls"
                style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}
              >
                <div 
                  className="quantity-controls"
                  id={`quantity-controls-${item.product.id}`}
                  style={styles.quantityControls}
                >
                  <button
                    className="qty-decrease-btn quantity-btn"
                    id={`decrease-quantity-${item.product.id}`}
                    data-testid={`decrease-quantity-${item.product.id}`}
                    onClick={() => handleQuantityUpdate(item, item.quantity - 1)}
                    style={styles.quantityBtn}
                    onMouseEnter={(e) => e.target.style.backgroundColor = colors.border}
                    onMouseLeave={(e) => e.target.style.backgroundColor = colors.background}
                  >
                    -
                  </button>
                  
                  <input
                    className="qty-input quantity-input"
                    id={`quantity-input-${item.product.id}`}
                    data-testid={`quantity-input-${item.product.id}`}
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityUpdate(item, parseInt(e.target.value) || 0)}
                    style={styles.quantityInput}
                  />
                  
                  <button
                    className="qty-increase-btn quantity-btn"
                    id={`increase-quantity-${item.product.id}`}
                    data-testid={`increase-quantity-${item.product.id}`}
                    onClick={() => handleQuantityUpdate(item, item.quantity + 1)}
                    style={styles.quantityBtn}
                    onMouseEnter={(e) => e.target.style.backgroundColor = colors.border}
                    onMouseLeave={(e) => e.target.style.backgroundColor = colors.background}
                  >
                    +
                  </button>
                </div>
                
                <button
                  className="save-later-btn btn"
                  id={`save-later-${item.product.id}`}
                  data-testid={`save-later-${item.product.id}`}
                  onClick={() => {
                    dispatch(saveForLater(item.product.id));
                    addNotification({
                      message: 'Moved to saved items',
                      type: 'info'
                    });
                  }}
                  style={{
                    padding: window.innerWidth < 499 ? '6px 10px' : '8px 12px',
                    border: `2px solid ${colors.primary}`,
                    borderRadius: '6px',
                    backgroundColor: 'transparent',
                    color: colors.primary,
                    cursor: 'pointer',
                    fontSize: window.innerWidth < 499 ? '10px' : '12px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease'
                  }}
                >
                  💾 Save
                </button>
              </div>
            </div>
            
            <div 
              className="cart-item-total"
              style={{ 
                textAlign: window.innerWidth < 499 ? 'center' : 'right',
                display: 'flex',
                flexDirection: window.innerWidth < 499 ? 'row' : 'column',
                justifyContent: 'space-between',
                alignItems: window.innerWidth < 499 ? 'center' : 'flex-end',
                minWidth: window.innerWidth < 499 ? '100%' : '100px',
                gap: '8px'
              }}
            >
              <p 
                className="item-total-price"
                id={`item-total-${item.product.id}`}
                data-testid={`item-total-${item.product.id}`}
                style={{ 
                  margin: '0', 
                  fontSize: window.innerWidth < 499 ? '16px' : '18px', 
                  fontWeight: 'bold',
                  color: colors.primary
                }}
              >
                {formatPrice(item.product.price * item.quantity)}
              </p>
              <button
                className="remove-item-btn"
                id={`remove-item-${item.product.id}`}
                data-testid={`remove-item-${item.product.id}`}
                onClick={() => {
                  dispatch(removeFromCart(item.product.id));
                  const product = products[item.product.id];
                  dispatch(updateStock(item.product.id, product.stock + item.quantity));
                  addNotification({
                    message: `Removed ${item.product.name}`,
                    type: 'info',
                    action: {
                      label: 'Undo',
                      callback: () => {
                        dispatch(addToCart(item.product, item.quantity));
                        dispatch(updateStock(item.product.id, product.stock - item.quantity));
                      }
                    }
                  });
                }}
                style={{
                  padding: '4px 8px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: 'transparent',
                  color: colors.error,
                  cursor: 'pointer',
                  fontSize: window.innerWidth < 499 ? '10px' : '12px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
              >
                🗑️ Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Order Summary */}
      <div 
        className="order-summary card"
        id="order-summary-section"
        data-testid="order-summary"
        style={{
          backgroundColor: colors.background,
          padding: window.innerWidth < 499 ? '16px' : '20px',
          borderRadius: '10px',
          border: `2px solid ${colors.border}`,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h3 
          className="summary-title"
          id="summary-title"
          style={{ 
            margin: '0 0 16px 0',
            color: colors.text,
            fontSize: window.innerWidth < 499 ? '16px' : '18px',
            fontWeight: '700'
          }}
        >
          📋 Order Summary
        </h3>
        
        <div 
          className="summary-line"
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '8px',
            fontSize: window.innerWidth < 499 ? '13px' : '15px'
          }}
        >
          <span style={{ color: colors.text }}>Subtotal:</span>
          <span 
            className="subtotal-amount"
            id="subtotal-amount"
            data-testid="subtotal"
            style={{ color: colors.text, fontWeight: '600' }}
          >
            {formatPrice(subtotal)}
          </span>
        </div>
        
        <div 
          className="summary-line"
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '8px',
            fontSize: window.innerWidth < 499 ? '13px' : '15px'
          }}
        >
          <span style={{ color: colors.text }}>Shipping:</span>
          <span 
            className="shipping-amount"
            id="shipping-amount"
            data-testid="shipping"
            style={{ 
              color: shipping === 0 ? colors.success : colors.text, 
              fontWeight: '600' 
            }}
          >
            {shipping === 0 ? 'FREE 🎉' : formatPrice(shipping)}
          </span>
        </div>
        
        <div 
          className="summary-total"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: `2px solid ${colors.border}`,
            fontSize: window.innerWidth < 499 ? '18px' : '20px',
            fontWeight: 'bold'
          }}
        >
          <span style={{ color: colors.text }}>Total:</span>
          <span 
            className="total-amount"
            id="total-amount"
            data-testid="total"
            style={{ color: colors.primary }}
          >
            {formatPrice(total)}
          </span>
        </div>
        
        <button
          className="checkout-btn btn"
          id="checkout-button"
          data-testid="checkout-button"
          style={{
            width: '100%',
            padding: window.innerWidth < 499 ? '14px' : '16px',
            marginTop: '16px',
            backgroundColor: colors.primary,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: window.innerWidth < 499 ? '15px' : '17px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 16px rgba(37, 99, 235, 0.3)'
          }}
        >
          🚀 Proceed to Checkout
        </button>
      </div>
      
      {/* Saved Items */}
      {savedItems.length > 0 && (
        <div 
          className="saved-items-section"
          id="saved-items-container"
          data-testid="saved-items-section"
          style={{ marginTop: '24px' }}
        >
          <button
            className="toggle-saved-btn btn"
            id="toggle-saved-items"
            data-testid="toggle-saved-items"
            onClick={() => setShowSaved(!showSaved)}
            style={{
              padding: window.innerWidth < 499 ? '8px 16px' : '10px 20px',
              border: `2px solid ${colors.primary}`,
              borderRadius: '6px',
              backgroundColor: showSaved ? colors.primary : 'transparent',
              color: showSaved ? 'white' : colors.primary,
              cursor: 'pointer',
              marginBottom: '16px',
              fontSize: window.innerWidth < 499 ? '12px' : '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
          >
            {showSaved ? '👁️ Hide' : '👁️ Show'} Saved ({savedItems.length})
          </button>
          
          {showSaved && (
            <div className="saved-items-list animate-fadeIn" id="saved-items-list">
              {savedItems.map(item => (
                <div
                  key={item.product.id}
                  className="saved-item"
                  id={`saved-item-${item.product.id}`}
                  data-testid={`saved-item-${item.product.id}`}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: colors.background,
                    borderRadius: '6px',
                    marginBottom: '8px',
                    border: `1px solid ${colors.border}`,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                    alignItems: 'center'
                  }}
                >
                  <div
                    className="saved-item-icon"
                    style={{
                      width: '40px',
                      height: '40px',
                      background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`,
                      borderRadius: '6px',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: colors.primary
                    }}
                  >
                    {getCategoryIcon(item.product.category)}
                  </div>
                  
                  <div className="saved-item-details" style={{ flex: 1 }}>
                    <h4 
                      className="saved-item-name"
                      style={{ 
                        margin: '0 0 4px 0',
                        color: colors.text,
                        fontSize: window.innerWidth < 499 ? '12px' : '14px',
                        fontWeight: '600'
                      }}
                    >
                      {item.product.name}
                    </h4>
                    <p 
                      className="saved-item-price"
                      style={{ 
                        margin: 0, 
                        color: colors.textSecondary,
                        fontSize: window.innerWidth < 499 ? '11px' : '12px'
                      }}
                    >
                      {formatPrice(item.product.price)}
                    </p>
                  </div>
                  
                  <button
                    className="move-to-cart-btn btn"
                    id={`move-to-cart-${item.product.id}`}
                    data-testid={`move-to-cart-${item.product.id}`}
                    onClick={() => {
                      dispatch(moveToCart(item.product.id));
                      addNotification({
                        message: 'Moved to cart',
                        type: 'success'
                      });
                    }}
                    style={{
                      padding: window.innerWidth < 499 ? '6px 10px' : '8px 12px',
                      backgroundColor: colors.primary,
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: window.innerWidth < 499 ? '10px' : '12px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    🛒 Move
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;