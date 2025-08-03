import React, { useState } from 'react';
import { useTheme } from '../App';
import Header from './Header';
import SearchAndFilter from './SearchAndFilter';
import ProductList from './ProductList';
import Cart from './Cart';
import Wishlist from './Wishlist';
import RecentlyViewed from './RecentlyViewed';

export const Dashboard = () => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('shop');
  
  const handleCartClick = () => {
    setActiveTab('cart');
  };
  
  const handleWishlistClick = () => {
    setActiveTab('wishlist');
  };
  
  const handleContinueShopping = () => {
    setActiveTab('shop');
  };
  
  const getResponsiveStyles = () => {
    const width = window.innerWidth;
    const isMobile = width < 499;
    const isTablet = width >= 499 && width < 768;
    
    return {
      container: {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile ? '8px' : isTablet ? '12px' : '20px'
      },
      tabNavigation: {
        display: 'flex',
        gap: isMobile ? '2px' : '4px',
        marginBottom: isMobile ? '16px' : '24px',
        borderBottom: `2px solid ${colors.border}`,
        paddingBottom: '0',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        backgroundColor: colors.surface,
        borderRadius: '8px 8px 0 0',
        padding: isMobile ? '4px' : '8px'
      },
      tabButton: (isActive) => ({
        flex: 1,
        padding: isMobile ? '8px 12px' : '12px 20px',
        border: 'none',
        backgroundColor: isActive ? colors.primary : 'transparent',
        color: isActive ? 'white' : colors.textSecondary,
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: isMobile ? '12px' : '14px',
        fontWeight: isActive ? '700' : '500',
        transition: 'all 0.2s ease',
        minWidth: isMobile ? '60px' : '80px',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px'
      })
    };
  };
  
  const styles = getResponsiveStyles();
  
  return (
    <div className="dashboard-container" id="dashboard-main">
      <Header onCartClick={handleCartClick} onWishlistClick={handleWishlistClick} />
      
      <div 
        className="dashboard-content container"
        style={styles.container}
      >
        {/* Tab Navigation */}
        <div 
          className="tab-navigation"
          id="main-navigation"
          data-testid="main-navigation"
          style={styles.tabNavigation}
        >
          <button
            className={`tab-btn shop-tab ${activeTab === 'shop' ? 'tab-active' : ''}`}
            id="shop-tab-btn"
            data-testid="shop-tab"
            onClick={() => setActiveTab('shop')}
            style={styles.tabButton(activeTab === 'shop')}
            onMouseEnter={(e) => {
              if (activeTab !== 'shop') {
                e.target.style.backgroundColor = colors.border;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'shop') {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span>🛍️</span>
            {window.innerWidth >= 499 && <span>Shop</span>}
          </button>
          
          <button
            className={`tab-btn cart-tab ${activeTab === 'cart' ? 'tab-active' : ''}`}
            id="cart-tab-btn"
            data-testid="cart-tab"
            onClick={() => setActiveTab('cart')}
            style={styles.tabButton(activeTab === 'cart')}
            onMouseEnter={(e) => {
              if (activeTab !== 'cart') {
                e.target.style.backgroundColor = colors.border;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'cart') {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span>🛒</span>
            {window.innerWidth >= 499 && <span>Cart</span>}
          </button>
          
          <button
            className={`tab-btn wishlist-tab ${activeTab === 'wishlist' ? 'tab-active' : ''}`}
            id="wishlist-tab-btn"
            data-testid="wishlist-tab"
            onClick={() => setActiveTab('wishlist')}
            style={styles.tabButton(activeTab === 'wishlist')}
            onMouseEnter={(e) => {
              if (activeTab !== 'wishlist') {
                e.target.style.backgroundColor = colors.border;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'wishlist') {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span>❤️</span>
            {window.innerWidth >= 499 && <span>Wishlist</span>}
          </button>
        </div>
        
        {/* Content Area */}
        <div 
          className="tab-content" 
          id="tab-content-area"
          style={{
            backgroundColor: colors.background,
            borderRadius: '0 0 12px 12px',
            minHeight: '400px'
          }}
        >
          {activeTab === 'shop' && (
            <div className="shop-content" id="shop-section">
              <SearchAndFilter />
              <ProductList />
              <RecentlyViewed />
            </div>
          )}
          
          {activeTab === 'cart' && (
            <div className="cart-content" id="cart-section">
              <Cart onContinueShopping={handleContinueShopping} />
            </div>
          )}
          
          {activeTab === 'wishlist' && (
            <div className="wishlist-content" id="wishlist-section">
              <Wishlist />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;