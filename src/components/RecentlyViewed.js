import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addRecentlyViewed } from '../store';
import { useTheme, useAnalytics } from '../App';

const RecentlyViewed = () => {
  const { colors } = useTheme();
  const { trackEvent } = useAnalytics();
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
  
  const getResponsiveStyles = () => {
    const isMobile = window.innerWidth < 499;
    
    return {
      container: {
        backgroundColor: colors.surface,
        padding: isMobile ? '16px' : '20px',
        borderRadius: '12px',
        marginTop: '32px',
        border: `1px solid ${colors.border}`,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      },
      title: {
        margin: '0 0 20px 0',
        color: colors.text,
        fontSize: isMobile ? '18px' : '20px',
        fontWeight: '700'
      },
      scrollContainer: {
        display: 'flex',
        gap: isMobile ? '12px' : '16px',
        overflowX: 'auto',
        paddingBottom: '12px',
        scrollbarWidth: 'thin',
        scrollbarColor: `${colors.border} transparent`
      },
      productItem: {
        minWidth: isMobile ? '140px' : '160px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        padding: '8px',
        borderRadius: '8px'
      },
      productImage: {
        width: isMobile ? '120px' : '140px',
        height: isMobile ? '120px' : '140px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginBottom: '12px',
        border: `1px solid ${colors.border}`,
        transition: 'all 0.2s ease'
      },
      productName: {
        fontSize: isMobile ? '12px' : '14px',
        margin: '0 0 6px 0',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: colors.text,
        fontWeight: '500'
      },
      productPrice: {
        fontSize: isMobile ? '14px' : '16px',
        fontWeight: 'bold',
        color: colors.primary,
        margin: 0
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
      <h3 
        className="recently-viewed-title"
        id="recently-viewed-title"
        style={styles.title}
      >
        👁️ Recently Viewed
      </h3>
      
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
              e.target.style.transform = 'translateY(-2px)';
              const img = e.target.querySelector('.recently-viewed-image');
              if (img) {
                img.style.transform = 'scale(1.05)';
                img.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.transform = 'translateY(0)';
              const img = e.target.querySelector('.recently-viewed-image');
              if (img) {
                img.style.transform = 'scale(1)';
                img.style.boxShadow = 'none';
              }
            }}
          >
            <img
              className="recently-viewed-image"
              src={`https://via.placeholder.com/140x140/e2e8f0/64748b?text=${encodeURIComponent(product.name.substring(0, 12))}`}
              alt={product.name}
              style={styles.productImage}
            />
            
            <p 
              className="recently-viewed-name"
              id={`recently-viewed-name-${product.id}`}
              style={styles.productName}
              title={product.name}
            >
              {product.name}
            </p>
            
            <div 
              className="recently-viewed-rating"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '4px',
                marginBottom: '6px'
              }}
            >
              <div style={{ color: colors.warning, fontSize: '12px' }}>
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
              </div>
              <span style={{ fontSize: '10px', color: colors.textSecondary }}>
                ({product.reviewsCount})
              </span>
            </div>
            
            <p 
              className="recently-viewed-price"
              id={`recently-viewed-price-${product.id}`}
              style={styles.productPrice}
            >
              {formatPrice(product.price)}
            </p>
            
            {product.originalPrice && (
              <p 
                className="recently-viewed-original-price"
                style={{
                  fontSize: '12px',
                  textDecoration: 'line-through',
                  color: colors.textSecondary,
                  margin: '2px 0 0 0'
                }}
              >
                {formatPrice(product.originalPrice)}
              </p>
            )}
            
            {/* Stock indicator */}
            <div 
              className="recently-viewed-stock"
              style={{
                marginTop: '6px',
                fontSize: '10px',
                fontWeight: '600',
                color: product.stock > 0 ? colors.success : colors.error
              }}
            >
              {product.stock > 0 ? `✅ ${product.stock} left` : '❌ Out of stock'}
            </div>
          </div>
        ))}
      </div>
      
      {/* View All Button */}
      <div 
        className="recently-viewed-actions"
        style={{
          marginTop: '16px',
          textAlign: 'center'
        }}
      >
        <button
          className="view-all-recent-btn btn"
          id="view-all-recent-button"
          data-testid="view-all-recent"
          onClick={() => {
            trackEvent('view_all_recent_clicked');
            // This could trigger a modal or navigate to a dedicated page
          }}
          style={{
            padding: '8px 16px',
            border: `2px solid ${colors.primary}`,
            borderRadius: '8px',
            backgroundColor: 'transparent',
            color: colors.primary,
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = colors.primary;
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = colors.primary;
          }}
        >
          👁️ View All Recent
        </button>
      </div>
      
      {/* Clear Recent History */}
      <div 
        className="clear-recent-container"
        style={{
          marginTop: '12px',
          textAlign: 'center'
        }}
      >
        <button
          className="clear-recent-btn"
          id="clear-recent-history"
          data-testid="clear-recent-history"
          onClick={() => {
            // Clear recent history
            recentlyViewed.forEach(() => {
              // This would need a clear action in the store
            });
            trackEvent('clear_recent_history');
          }}
          style={{
            padding: '4px 12px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            color: colors.textSecondary,
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = colors.error;
            e.target.style.backgroundColor = `${colors.error}10`;
          }}
          onMouseLeave={(e) => {
            e.target.style.color = colors.textSecondary;
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          🗑️ Clear History
        </button>
      </div>
      
      {/* Custom scrollbar styles for webkit browsers */}
      <style>{`
        .recently-viewed-scroll::-webkit-scrollbar {
          height: 6px;
        }
        
        .recently-viewed-scroll::-webkit-scrollbar-track {
          background: ${colors.surface};
          border-radius: 3px;
        }
        
        .recently-viewed-scroll::-webkit-scrollbar-thumb {
          background: ${colors.border};
          border-radius: 3px;
        }
        
        .recently-viewed-scroll::-webkit-scrollbar-thumb:hover {
          background: ${colors.textSecondary};
        }
      `}</style>
    </div>
  );
};

export default RecentlyViewed;