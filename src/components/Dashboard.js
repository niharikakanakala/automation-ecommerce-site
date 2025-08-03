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
  
  const getTabButtonStyle = (tabName) => ({
    padding: window.innerWidth < 499 ? '8px 16px' : '12px 24px',
    border: 'none',
    backgroundColor: 'transparent',
    color: activeTab === tabName ? colors.primary : colors.textSecondary,
    borderBottom: activeTab === tabName ? `3px solid ${colors.primary}` : '3px solid transparent',
    cursor: 'pointer',
    fontSize: window.innerWidth < 499 ? '14px' : '16px',
    fontWeight: activeTab === tabName ? '700' : '500',
    transition: 'all 0.3s ease',
    borderRadius: '4px 4px 0 0',
    minWidth: window.innerWidth < 499 ? '80px' : '100px',
    textAlign: 'center'
  });
  
  return (
    <div className="dashboard-container" id="dashboard-main">
      <Header onCartClick={handleCartClick} onWishlistClick={handleWishlistClick} />
      
      <div 
        className="dashboard-content container"
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: window.innerWidth < 499 ? '16px 12px' : window.innerWidth < 768 ? '20px 16px' : '24px 20px'
        }}
      >
        {/* Tab Navigation */}
        <div 
          className="tab-navigation"
          id="main-navigation"
          style={{
            display: 'flex',
            gap: window.innerWidth < 499 ? '4px' : '8px',
            marginBottom: '24px',
            borderBottom: `1px solid ${colors.border}`,
            paddingBottom: '0',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <button
            className={`tab-btn ${activeTab === 'shop' ? 'tab-active' : ''}`}
            id="shop-tab-btn"
            data-testid="shop-tab"
            onClick={() => setActiveTab('shop')}
            style={getTabButtonStyle('shop')}
          >
            🛍️ Shop
          </button>
          
          <button
            className={`tab-btn ${activeTab === 'cart' ? 'tab-active' : ''}`}
            id="cart-tab-btn"
            data-testid="cart-tab"
            onClick={() => setActiveTab('cart')}
            style={getTabButtonStyle('cart')}
          >
            🛒 Cart
          </button>
          
          <button
            className={`tab-btn ${activeTab === 'wishlist' ? 'tab-active' : ''}`}
            id="wishlist-tab-btn"
            data-testid="wishlist-tab"
            onClick={() => setActiveTab('wishlist')}
            style={getTabButtonStyle('wishlist')}
          >
            ❤️ Wishlist
          </button>
        </div>
        
        {/* Content Area */}
        <div className="tab-content" id="tab-content-area">
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