import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addRecentlyViewed, clearRecentlyViewed } from '../store';
import { useTheme, useAnalytics, useNotifications } from '../App';

const RecentlyViewed = () => {
  const { colors } = useTheme();
  const { trackEvent } = useAnalytics();
  const { addNotification } = useNotifications();
  const dispatch = useDispatch();
  const recentlyViewed = useSelector((state) => state.user.recentlyViewed);
  const products = useSelector((state) => state.products.items);
  
  const recentProducts = recentlyViewed
    .map(item => products[item.productId])
    .filter(Boolean)
    .slice(0, 5);
  
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
  
  const handleClearHistory = () => {
    dispatch(clearRecentlyViewed());
    trackEvent('clear_recent_history');
    addNotification({
      message: 'Recent viewing history cleared',
      type: 'info'
    });
  };
  
  const getResponsiveStyles = () => {
    const width = window.innerWidth;
    const isMobile = width < 499;
    const isVerySmall = width < 400;
    
    return {
      container: {
        backgroundColor: colors.surface,
        padding: isMobile ? '12px' : '16px',
        borderRadius: '10px',
        marginTop: isMobile ? '16px' : '24px',
        border: `1px solid ${colors.border}`,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      },
      header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      },
      title: {
        margin: '0',
        color: colors.text,
        fontSize: isMobile ? '16px' : '18px',
        fontWeight: '700'
      },
      clearBtn: {
        padding: isMobile ? '4px 8px' : '6px 12px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: 'transparent',
        color: colors.textSecondary,
        cursor: 'pointer',
        fontSize: isMobile ? '10px' : '12px',
        fontWeight: '500',
        transition: 'all 0.2s ease'
      },
      scrollContainer: {
        display: 'flex',
        gap: isMobile ? '6px' : '12px',
        overflowX: 'auto',
        paddingBottom: '8px',
        scrollbarWidth: 'thin',
        scrollbarColor: `${colors.border} transparent`
      },
      productItem: {
        minWidth: isMobile ? '90px' : '120px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        padding: '4px',
        borderRadius: '6px',
        flexShrink: 0
      },
      productIcon: {
        width: isMobile ? '80px' : '110px',
        height: isMobile ? '60px' : '80px',
        background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`,
        borderRadius: '6px',
        marginBottom: '6px',
        border: `1px solid ${colors.border}`,
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: isMobile ? '18px' : '28px',
        fontWeight: 'bold',
        color: colors.primary,
        position: 'relative'
      },
      productName: {
        fontSize: isMobile ? '9px' : '12px',
        margin: '0 0 3px 0',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: colors.text,
        fontWeight: '500',
        lineHeight: '1.2'
      },
      productPrice: {
        fontSize: isMobile ? '11px' : '14px',
        fontWeight: 'bold',
        color: colors.primary,
        margin: 0
      },
      stockBadge: {
        position: 'absolute',
        top: '2px',
        right: '2px',
        padding: '1px 4px',
        borderRadius: '6px',
        fontSize: '7px',
        fontWeight: 'bold',
        color: 'white'
      },
      category: {
        fontSize: '8px',
        color: colors.textSecondary,
        marginBottom: '2px',
        textTransform: 'capitalize'
      },
      rating: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2px',
        marginBottom: '3px'
      }
    };
  };
  
  const styles = getResponsiveStyles();
  
  if (recentProducts.length === 0) {
    return null;
  }
  
  return (
    <div 
      className="recently-viewed-container card"
      id="recently-viewed-section"
      data-testid="recently-viewed"
      style={styles.container}
    >
      <div style={styles.header}>
        <h3 
          className="recently-viewed-title"
          id="recently-viewed-title"
          style={styles.title}
        >
          👁️ Recently Viewed
        </h3>
        
        <button
          className="clear-recent-btn"
          id="clear-recent-history"
          data-testid="clear-recent-history"
          onClick={handleClearHistory}
          style={styles.clearBtn}
          onMouseEnter={(e) => {
            e.target.style.color = colors.error;
            e.target.style.backgroundColor = `${colors.error}10`;
          }}
          onMouseLeave={(e) => {
            e.target.style.color = colors.textSecondary;
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          🗑️ Clear
        </button>
      </div>
      
      <div 
        className="recently-viewed-scroll hide-scrollbar"
        id="recently-viewed-list"
        style={styles.scrollContainer}
      >
        {recentProducts.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            className="recently-viewed-item"
            id={`recently-viewed-${product.id}`}
            data-testid={`recently-viewed-item-${product.id}`}
            style={styles.productItem}
            onClick={() => {
              dispatch(addRecentlyViewed(product.id));
              trackEvent('recently_viewed_click', { productId: product.id });
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.background;
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <div
              className="recently-viewed-icon"
              style={styles.productIcon}
            >
              <div className="product-category-icon">
                {getCategoryIcon(product.category)}
              </div>
              
              {/* Stock indicator badge */}
              <div 
                className="recently-viewed-stock-badge"
                style={{
                  ...styles.stockBadge,
                  backgroundColor: product.stock > 0 ? colors.success : colors.error
                }}
              >
                {product.stock > 0 ? `${product.stock}` : '0'}
              </div>
            </div>
            
            <p 
              className="recently-viewed-name"
              id={`recently-viewed-name-${product.id}`}
              style={styles.productName}
              title={product.name}
            >
              {product.name.length > 12 ? `${product.name.substring(0, 12)}...` : product.name}
            </p>
            
            {window.innerWidth >= 499 && (
              <div 
                className="recently-viewed-category"
                style={styles.category}
              >
                {product.category.toLowerCase().replace('_', ' ')}
              </div>
            )}
            
            <div 
              className="recently-viewed-rating"
              style={styles.rating}
            >
              <div style={{ 
                color: colors.warning, 
                fontSize: window.innerWidth < 499 ? '7px' : '10px' 
              }}>
                {'★'.repeat(Math.floor(product.rating))}
              </div>
              {window.innerWidth >= 499 && (
                <span style={{ fontSize: '8px', color: colors.textSecondary }}>
                  ({product.reviewsCount})
                </span>
              )}
            </div>
            
            <p 
              className="recently-viewed-price"
              id={`recently-viewed-price-${product.id}`}
              style={styles.productPrice}
            >
              {formatPrice(product.price)}
            </p>
            
            {product.originalPrice && window.innerWidth >= 499 && (
              <p 
                className="recently-viewed-original-price"
                style={{
                  fontSize: '9px',
                  textDecoration: 'line-through',
                  color: colors.textSecondary,
                  margin: '1px 0 0 0'
                }}
              >
                {formatPrice(product.originalPrice)}
              </p>
            )}
          </div>
        ))}
      </div>
      
      {/* Custom scrollbar styles for webkit browsers */}
      <style>{`
        .recently-viewed-scroll::-webkit-scrollbar {
          height: 4px;
        }
        
        .recently-viewed-scroll::-webkit-scrollbar-track {
          background: ${colors.surface};
          border-radius: 2px;
        }
        
        .recently-viewed-scroll::-webkit-scrollbar-thumb {
          background: ${colors.border};
          border-radius: 2px;
        }
        
        .recently-viewed-scroll::-webkit-scrollbar-thumb:hover {
          background: ${colors.textSecondary};
        }
        
        @media (max-width: 498px) {
          .recently-viewed-scroll::-webkit-scrollbar {
            height: 3px;
          }
        }
      `}</style>
    </div>
  );
};

export default RecentlyViewed;