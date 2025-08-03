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
    const isMobile = window.innerWidth < 499;
    const isTablet = window.innerWidth >= 499 && window.innerWidth < 768;
    
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
        padding: isMobile ? '12px 16px' : isTablet ? '16px 20px' : '18px 24px',
        minHeight: isMobile ? '56px' : '64px'
      },
      title: {
        margin: 0,
        fontSize: isMobile ? '18px' : isTablet ? '22px' : '26px',
        color: colors.text,
        fontWeight: '800',
        letterSpacing: '-0.5px'
      },
      actions: {
        display: 'flex',
        gap: isMobile ? '8px' : isTablet ? '12px' : '16px',
        alignItems: 'center',
        flexWrap: 'wrap'
      },
      themeBtn: {
        padding: isMobile ? '6px 10px' : '8px 14px',
        border: `2px solid ${colors.primary}`,
        borderRadius: '20px',
        backgroundColor: 'transparent',
        color: colors.primary,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: isMobile ? '12px' : '14px',
        fontWeight: '600',
        transition: 'all 0.2s ease',
        minHeight: '36px'
      },
      actionBtn: {
        background: 'none',
        border: `2px solid transparent`,
        borderRadius: '8px',
        cursor: 'pointer',
        color: colors.textSecondary,
        fontSize: isMobile ? '12px' : '14px',
        position: 'relative',
        padding: isMobile ? '6px 8px' : '8px 12px',
        transition: 'all 0.2s ease',
        fontWeight: '600',
        minHeight: '36px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }
    };
  };
  
  const styles = getResponsiveStyles();
  
  return (
    <header 
      className="app-header"
      id="main-header"
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
          style={styles.title}
        >
          🛍️ Premium Store
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
                {theme === 'colorblind' ? 'Accessible' : theme}
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
              {window.innerWidth >= 499 ? `Wishlist (${wishlistCount})` : `(${wishlistCount})`}
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
              {window.innerWidth >= 499 ? `Cart (${cartCount})` : `(${cartCount})`}
            </span>
            {cartCount > 0 && (
              <div 
                className="cart-total-badge"
                id="cart-total-display"
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  backgroundColor: colors.error,
                  color: 'white',
                  borderRadius: '12px',
                  padding: '2px 6px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  minWidth: '18px',
                  textAlign: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  animation: 'pulse 2s infinite'
                }}
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