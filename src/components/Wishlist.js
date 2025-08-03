import React from 'react';
import { useTheme, useNotifications } from '../App';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromWishlist, updateStock } from '../store';

const Wishlist = () => {
  const { colors } = useTheme();
  const { addNotification } = useNotifications();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const products = useSelector((state) => state.products.items);
  
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
      container: {
        backgroundColor: colors.surface,
        padding: isMobile ? '20px' : '30px',
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
      },
      emptyContainer: {
        backgroundColor: colors.surface,
        padding: isMobile ? '40px 20px' : '60px 40px',
        borderRadius: '12px',
        textAlign: 'center',
        border: `1px solid ${colors.border}`,
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      },
      grid: {
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 
                           isTablet ? 'repeat(2, 1fr)' : 
                           'repeat(auto-fill, minmax(280px, 1fr))',
        gap: isMobile ? '16px' : '20px'
      },
      wishlistItem: {
        backgroundColor: colors.background,
        padding: isMobile ? '16px' : '20px',
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s ease'
      }
    };
  };
  
  const styles = getResponsiveStyles();
  
  if (wishlistItems.length === 0) {
    return (
      <div 
        className="empty-wishlist card"
        id="empty-wishlist-container"
        data-testid="empty-wishlist"
        style={styles.emptyContainer}
      >
        <div className="empty-wishlist-icon" style={{ fontSize: '64px', marginBottom: '24px' }}>❤️</div>
        <h2 className="empty-wishlist-title" style={{ 
          color: colors.text, 
          marginBottom: '12px',
          fontSize: '24px',
          fontWeight: '700'
        }}>
          Your wishlist is empty
        </h2>
        <p className="empty-wishlist-description" style={{ 
          color: colors.textSecondary,
          fontSize: '16px',
          maxWidth: '300px',
          lineHeight: '1.5'
        }}>
          Save items you love for later and never lose track of them
        </p>
      </div>
    );
  }
  
  return (
    <div 
      className="wishlist-container card"
      id="wishlist-main-container"
      data-testid="wishlist-container"
      style={styles.container}
    >
      <div 
        className="wishlist-header"
        id="wishlist-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <h2 
          className="wishlist-title"
          id="wishlist-title"
          data-testid="wishlist-title"
          style={{ 
            margin: 0,
            color: colors.text,
            fontSize: window.innerWidth < 499 ? '20px' : '24px',
            fontWeight: '700'
          }}
        >
          ❤️ My Wishlist ({wishlistItems.length} items)
        </h2>
        
        {wishlistItems.length > 1 && (
          <button
            className="clear-wishlist-btn"
            id="clear-wishlist-button"
            data-testid="clear-wishlist-button"
            onClick={() => {
              wishlistItems.forEach(item => {
                dispatch(removeFromWishlist(item.product.id));
              });
              addNotification({
                message: 'Wishlist cleared',
                type: 'info'
              });
            }}
            style={{
              padding: '8px 16px',
              border: `2px solid ${colors.textSecondary}`,
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: colors.textSecondary,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = colors.error;
              e.target.style.color = colors.error;
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = colors.textSecondary;
              e.target.style.color = colors.textSecondary;
            }}
          >
            🗑️ Clear All
          </button>
        )}
      </div>
      
      <div 
        className="wishlist-grid"
        id="wishlist-items-grid"
        data-testid="wishlist-grid"
        style={styles.grid}
      >
        {wishlistItems.map(item => (
          <div
            key={item.product.id}
            className="wishlist-item card"
            id={`wishlist-item-${item.product.id}`}
            data-testid={`wishlist-item-${item.product.id}`}
            style={styles.wishlistItem}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
            }}
          >
            {/* Product Image */}
            <div 
              className="wishlist-item-image-container"
              style={{
                position: 'relative',
                marginBottom: '16px',
                borderRadius: '8px',
                overflow: 'hidden',
                height: '200px',
                backgroundColor: colors.surface
              }}
            >
              <img
                className="wishlist-item-image"
                src={`https://via.placeholder.com/280x200/e2e8f0/64748b?text=${encodeURIComponent(item.product.name.substring(0, 12))}`}
                alt={item.product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              
              {/* Priority Badge */}
              <div 
                className={`priority-badge priority-${item.priority}`}
                style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  backgroundColor: item.priority === 'high' ? colors.error : 
                                 item.priority === 'medium' ? colors.warning : colors.success,
                  color: item.priority === 'medium' ? 'black' : 'white'
                }}
              >
                {item.priority} priority
              </div>
              
              {/* Stock Status */}
              <div 
                className="stock-status"
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  backgroundColor: item.product.stock > 0 ? colors.success : colors.error,
                  color: 'white'
                }}
              >
                {item.product.stock > 0 ? `${item.product.stock} in stock` : 'Out of stock'}
              </div>
            </div>
            
            {/* Product Info */}
            <div className="wishlist-item-info">
              <h4 
                className="wishlist-item-name"
                id={`wishlist-item-name-${item.product.id}`}
                style={{ 
                  margin: '0 0 8px 0',
                  color: colors.text,
                  fontSize: '16px',
                  fontWeight: '600',
                  lineHeight: '1.3',
                  height: '40px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {item.product.name}
              </h4>
              
              {/* Rating */}
              <div 
                className="wishlist-item-rating"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}
              >
                <div style={{ color: colors.warning, fontSize: '12px' }}>
                  {'★'.repeat(Math.floor(item.product.rating))}
                  {'☆'.repeat(5 - Math.floor(item.product.rating))}
                </div>
                <span style={{ fontSize: '12px', color: colors.textSecondary }}>
                  ({item.product.reviewsCount})
                </span>
              </div>
              
              <p 
                className="wishlist-item-price"
                id={`wishlist-item-price-${item.product.id}`}
                style={{ 
                  color: colors.primary, 
                  fontWeight: 'bold', 
                  marginBottom: '16px',
                  fontSize: '20px'
                }}
              >
                {formatPrice(item.product.price)}
                {item.product.originalPrice && (
                  <span 
                    style={{ 
                      fontSize: '14px',
                      textDecoration: 'line-through',
                      color: colors.textSecondary,
                      marginLeft: '8px'
                    }}
                  >
                    {formatPrice(item.product.originalPrice)}
                  </span>
                )}
              </p>
              
              {/* Notes */}
              {item.notes && (
                <p 
                  className="wishlist-item-notes"
                  style={{
                    fontSize: '12px',
                    color: colors.textSecondary,
                    fontStyle: 'italic',
                    marginBottom: '16px',
                    padding: '8px',
                    backgroundColor: colors.surface,
                    borderRadius: '4px',
                    border: `1px solid ${colors.border}`
                  }}
                >
                  💭 {item.notes}
                </p>
              )}
              
              {/* Added Date */}
              <p 
                className="wishlist-added-date"
                style={{
                  fontSize: '11px',
                  color: colors.textSecondary,
                  marginBottom: '16px'
                }}
              >
                Added on {new Date(item.addedAt).toLocaleDateString()}
              </p>
            </div>
            
            {/* Actions */}
            <div 
              className="wishlist-item-actions"
              style={{ 
                display: 'flex', 
                gap: '8px',
                flexDirection: window.innerWidth < 499 ? 'column' : 'row'
              }}
            >
              <button
                className="add-to-cart-wishlist-btn btn"
                id={`add-to-cart-wishlist-${item.product.id}`}
                data-testid={`add-to-cart-wishlist-${item.product.id}`}
                onClick={() => {
                  if (item.product.stock > 0) {
                    dispatch(addToCart(item.product, 1));
                    dispatch(updateStock(item.product.id, item.product.stock - 1));
                    addNotification({
                      message: `Added ${item.product.name} to cart`,
                      type: 'success'
                    });
                  } else {
                    addNotification({
                      message: 'Item is out of stock',
                      type: 'error'
                    });
                  }
                }}
                disabled={item.product.stock === 0}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  backgroundColor: item.product.stock === 0 ? colors.textSecondary : colors.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: item.product.stock === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  opacity: item.product.stock === 0 ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (item.product.stock > 0) {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (item.product.stock > 0) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                {item.product.stock === 0 ? '❌ Out of Stock' : '🛒 Add to Cart'}
              </button>
              
              <button
                className="remove-wishlist-btn"
                id={`remove-wishlist-${item.product.id}`}
                data-testid={`remove-wishlist-${item.product.id}`}
                onClick={() => {
                  dispatch(removeFromWishlist(item.product.id));
                  addNotification({
                    message: `Removed ${item.product.name} from wishlist`,
                    type: 'info'
                  });
                }}
                style={{
                  padding: '12px',
                  border: `2px solid ${colors.error}`,
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  color: colors.error,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  minWidth: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = colors.error;
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = colors.error;
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;