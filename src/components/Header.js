import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '../App';

const Header = ({ onCartClick, onWishlistClick }) => {
  const { colors, toggleTheme, theme } = useTheme();
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  
  const cartCount = useMemo(() => 
    cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );
  
  const cartTotal = useMemo(() =>
    cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0),
    [cartItems]
  );
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  
  const getResponsiveStyles = () => {
    const width = window.innerWidth;
    const isMobile = width < 499;
    const isTablet = width >= 499 && width < 768;
    
    return {
      header: {
        backgroundColor: colors.surface,
        borderBottom: `2px solid ${colors.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      },
      container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile ? '8px 12px' : isTablet ? '12px 16px' : '16px 20px',
        minHeight: isMobile ? '50px' : '60px'
      },
      title: {
        margin: 0,
        fontSize: isMobile ? '16px' : isTablet ? '20px' : '24px',
        color: colors.text,
        fontWeight: '800',
        letterSpacing: '-0.5px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      },
      actions: {
        display: 'flex',
        gap: isMobile ? '4px' : isTablet ? '8px' : '12px',
        alignItems: 'center',
        flexWrap: 'nowrap'
      },
      themeBtn: {
        padding: isMobile ? '4px 8px' : '6px 12px',
        border: `2px solid ${colors.primary}`,
        borderRadius: isMobile ? '16px' : '20px',
        backgroundColor: 'transparent',
        color: colors.primary,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '2px' : '4px',
        fontSize: isMobile ? '10px' : '12px',
        fontWeight: '600',
        transition: 'all 0.2s ease',
        minHeight: '32px',
        whiteSpace: 'nowrap'
      },
      actionBtn: {
        background: 'none',
        border: `1px solid transparent`,
        borderRadius: '6px',
        cursor: 'pointer',
        color: colors.textSecondary,
        fontSize: isMobile ? '10px' : '12px',
        position: 'relative',
        padding: isMobile ? '4px 6px' : '6px 8px',
        transition: 'all 0.2s ease',
        fontWeight: '600',
        minHeight: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        whiteSpace: 'nowrap'
      },
      badge: {
        position: 'absolute',
        top: '-4px',
        right: '-4px',
        backgroundColor: colors.error,
        color: 'white',
        borderRadius: '8px',
        padding: '1px 4px',
        fontSize: isMobile ? '8px' : '9px',
        fontWeight: 'bold',
        minWidth: '16px',
        textAlign: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        animation: 'pulse 2s infinite'
      }
    };
  };
  
  const styles = getResponsiveStyles();
  
  return (
    <header 
      className="app-header"
      id="main-header"
      data-testid="main-header"
      style={styles.header}
    >
      <div 
        className="header-container"
        id="header-content"
        style={styles.container}
      >
        <h1 
          className="site-title"
          id="site-title"
          data-testid="site-title"
          style={styles.title}
        >
          <span>🛍️</span>
          <span>Premium Store</span>
        </h1>
        
        <div 
          className="header-actions"
          id="header-actions"
          style={styles.actions}
        >
          <button
            className="theme-toggle-btn btn"
            id="theme-toggle"
            data-testid="theme-toggle-button"
            onClick={toggleTheme}
            style={styles.themeBtn}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.primary;
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = colors.primary;
            }}
          >
            <span className="theme-icon">
              {theme === 'light' ? '🌙' : theme === 'dark' ? '☀️' : '👁️'}
            </span>
            {window.innerWidth >= 499 && (
              <span className="theme-text">
                {theme === 'colorblind' ? 'Safe' : theme}
              </span>
            )}
          </button>
          
          <button
            className="wishlist-btn header-btn"
            id="wishlist-header-btn"
            data-testid="wishlist-button"
            onClick={onWishlistClick}
            style={styles.actionBtn}
            onMouseEnter={(e) => {
              e.target.style.borderColor = colors.primary;
              e.target.style.backgroundColor = `${colors.primary}10`;
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'transparent';
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <span className="wishlist-icon">❤️</span>
            <span className="wishlist-count">
              {window.innerWidth >= 499 ? `(${wishlistCount})` : wishlistCount}
            </span>
          </button>
          
          <button
            className="cart-btn header-btn"
            id="cart-header-btn"
            data-testid="cart-button"
            onClick={onCartClick}
            style={styles.actionBtn}
            onMouseEnter={(e) => {
              e.target.style.borderColor = colors.primary;
              e.target.style.backgroundColor = `${colors.primary}10`;
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'transparent';
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <span className="cart-icon">🛒</span>
            <span className="cart-count">
              {window.innerWidth >= 499 ? `(${cartCount})` : cartCount}
            </span>
            {cartCount > 0 && (
              <div 
                className="cart-total-badge"
                id="cart-total-display"
                style={styles.badge}
              >
                {window.innerWidth >= 768 ? formatPrice(cartTotal) : cartCount}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;