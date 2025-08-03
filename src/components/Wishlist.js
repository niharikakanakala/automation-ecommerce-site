import React from 'react';
import { useTheme, useNotifications } from '../App';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromWishlist, updateStock } from '../store';

const Wishlist = () => {
  const { colors } = useTheme();
  const { addNotification } = useNotifications();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  
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
  
  const getResponsiveStyles = () => {
    const width = window.innerWidth;
    const isMobile = width < 499;
    const isTablet = width >= 499 && width < 768;
    
    return {
      container: {
        backgroundColor: colors.surface,
        padding: isMobile ? '16px' : '24px',
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
      },
      emptyContainer: {
        backgroundColor: colors.surface,
        padding: isMobile ? '30px 16px' : '50px 30px',
        borderRadius: '12px',
        textAlign: 'center',
        border: `1px solid ${colors.border}`,
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      },
      header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isMobile ? '20px' : '24px',
        flexWrap: 'wrap',
        gap: '12px'
      },
      title: {
        margin: 0,
        color: colors.text,
        fontSize: isMobile ? '18px' : '22px',
        fontWeight: '700'
      },
      grid: {
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 
                           isTablet ? 'repeat(2, 1fr)' : 
                           'repeat(auto-fill, minmax(260px, 1fr))',
        gap: isMobile ? '12px' : '16px'
      },
      wishlistItem: {
        backgroundColor: colors.background,
        padding: isMobile ? '12px' : '16px',
        borderRadius: '10px',
        border: `1px solid ${colors.border}`,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s ease'
      },
      productIcon: {
        width: '100%',
        height: isMobile ? '100px' : '120px',
        background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`,
        borderRadius: '8px',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: isMobile ? '32px' : '40px',
        fontWeight: 'bold',
        color: colors.primary,
        position: 'relative',
        border: `1px solid ${colors.border}`
      },
      clearBtn: {
        padding: isMobile ? '6px 12px' : '8px 16px',
        border: `2px solid ${colors.textSecondary}`,
        borderRadius: '6px',
        backgroundColor: 'transparent',
        color: colors.textSecondary,
        cursor: 'pointer',
        fontSize: isMobile ? '11px' : '13px',
        fontWeight: '600',
        transition: 'all 0.2s ease'
      },
      productName: {
        margin: '0 0 8px 0',
        color: colors.text,
        fontSize: isMobile ? '14px' : '16px',
        fontWeight: '600',
        lineHeight: '1.3',
        height: isMobile ? '36px' : '42px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
      },
      category: {
        fontSize: isMobile ? '10px' : '12px',
        color: colors.textSecondary,
        marginBottom: '8px',
        textTransform: 'capitalize'
      },
      rating: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '8px'
      },
      price: {
        color: colors.primary,
        fontWeight: 'bold',
        marginBottom: '12px',
        fontSize: isMobile ? '16px' : '18px'
      },
      originalPrice: {
        fontSize: isMobile ? '12px' : '14px',
        textDecoration: 'line-through',
        color: colors.textSecondary,
        marginLeft: '8px'
      },
      notes: {
        fontSize: isMobile ? '11px' : '12px',
        color: colors.textSecondary,
        fontStyle: 'italic',
        marginBottom: '12px',
        padding: '6px 8px',
        backgroundColor: colors.surface,
        borderRadius: '4px',
        border: `1px solid ${colors.border}`,
        lineHeight: '1.3'
      },
      addedDate: {
        fontSize: isMobile ? '9px' : '10px',
        color: colors.textSecondary,
        marginBottom: '12px'
      },
      actions: {
        display: 'flex',
        gap: '8px',
        flexDirection: isMobile ? 'column' : 'row'
      },
      addToCartBtn: {
        flex: 1,
        padding: isMobile ? '10px 12px' : '12px 16px',
        backgroundColor: colors.primary,
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: isMobile ? '12px' : '14px',
        fontWeight: '600',
        transition: 'all 0.2s ease',
        minHeight: '36px'
      },
      removeBtn: {
        padding: isMobile ? '10px' : '12px',
        border: `2px solid ${colors.error}`,
        borderRadius: '6px',
        backgroundColor: 'transparent',
        color: colors.error,
        cursor: 'pointer',
        fontSize: isMobile ? '12px' : '14px',
        fontWeight: '600',
        transition: 'all 0.2s ease',
        minWidth: isMobile ? '100%' : '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
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
        <div className="empty-wishlist-icon" style={{ 
          fontSize: window.innerWidth < 499 ? '48px' : '64px', 
          marginBottom: '20px' 
        }}>
          ❤️
        </div>
        <h2 className="empty-wishlist-title" style={{ 
          color: colors.text, 
          marginBottom: '12px',
          fontSize: window.innerWidth < 499 ? '20px' : '24px',
          fontWeight: '700'
        }}>
          Your wishlist is empty
        </h2>
        <p className="empty-wishlist-description" style={{ 
          color: colors.textSecondary,
          fontSize: window.innerWidth < 499 ? '14px' : '16px',
          maxWidth: '280px',
          lineHeight: '1.4'
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
        style={styles.header}
      >
        <h2 
          className="wishlist-title"
          id="wishlist-title"
          data-testid="wishlist-title"
          style={styles.title}
        >
          ❤️ Wishlist ({wishlistItems.length})
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
            style={styles.clearBtn}
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
            {/* Product Icon */}
            <div 
              className="wishlist-item-icon-container"
              style={styles.productIcon}
            >
              <div className="product-category-icon">
                {getCategoryIcon(item.product.category)}
              </div>
              
              {/* Priority Badge */}
              <div 
                className={`priority-badge priority-${item.priority}`}
                id={`priority-badge-${item.product.id}`}
                style={{
                  position: 'absolute',
                  top: '6px',
                  left: '6px',
                  padding: '2px 6px',
                  borderRadius: '8px',
                  fontSize: window.innerWidth < 499 ? '8px' : '9px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  backgroundColor: item.priority === 'high' ? colors.error : 
                                 item.priority === 'medium' ? colors.warning : colors.success,
                  color: item.priority === 'medium' ? 'black' : 'white'
                }}
              >
                {item.priority}
              </div>
              
              {/* Stock Status */}
              <div 
                className="stock-status"
                id={`stock-status-${item.product.id}`}
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  padding: '2px 6px',
                  borderRadius: '8px',
                  fontSize: window.innerWidth < 499 ? '8px' : '9px',
                  fontWeight: 'bold',
                  backgroundColor: item.product.stock > 0 ? colors.success : colors.error,
                  color: 'white'
                }}
              >
                {item.product.stock > 0 ? `${item.product.stock}` : '0'}
              </div>
            </div>
            
            {/* Product Info */}
            <div className="wishlist-item-info" id={`wishlist-info-${item.product.id}`}>
              <h4 
                className="wishlist-item-name"
                id={`wishlist-item-name-${item.product.id}`}
                style={styles.productName}
              >
                {item.product.name}
              </h4>
              
              {/* Category */}
              <div 
                className="wishlist-item-category"
                style={styles.category}
              >
                📂 {item.product.category.toLowerCase().replace('_', ' ')}
              </div>
              
              {/* Rating */}
              <div 
                className="wishlist-item-rating"
                style={styles.rating}
              >
                <div style={{ 
                  color: colors.warning, 
                  fontSize: window.innerWidth < 499 ? '11px' : '12px' 
                }}>
                  {'★'.repeat(Math.floor(item.product.rating))}
                  {'☆'.repeat(5 - Math.floor(item.product.rating))}
                </div>
                <span style={{ 
                  fontSize: window.innerWidth < 499 ? '9px' : '10px', 
                  color: colors.textSecondary 
                }}>
                  ({item.product.reviewsCount})
                </span>
              </div>
              
              <p 
                className="wishlist-item-price"
                id={`wishlist-item-price-${item.product.id}`}
                style={styles.price}
              >
                {formatPrice(item.product.price)}
                {item.product.originalPrice && (
                  <span 
                    className="wishlist-original-price"
                    style={styles.originalPrice}
                  >
                    {formatPrice(item.product.originalPrice)}
                  </span>
                )}
              </p>
              
              {/* Notes */}
              {item.notes && (
                <p 
                  className="wishlist-item-notes"
                  id={`wishlist-notes-${item.product.id}`}
                  style={styles.notes}
                >
                  💭 {item.notes}
                </p>
              )}
              
              {/* Added Date */}
              <p 
                className="wishlist-added-date"
                style={styles.addedDate}
              >
                Added {new Date(item.addedAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: window.innerWidth >= 499 ? 'numeric' : '2-digit'
                })}
              </p>
            </div>
            
            {/* Actions */}
            <div 
              className="wishlist-item-actions"
              id={`wishlist-actions-${item.product.id}`}
              style={styles.actions}
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
                  ...styles.addToCartBtn,
                  backgroundColor: item.product.stock === 0 ? colors.textSecondary : colors.primary,
                  opacity: item.product.stock === 0 ? 0.6 : 1,
                  cursor: item.product.stock === 0 ? 'not-allowed' : 'pointer'
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
                style={styles.removeBtn}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = colors.error;
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = colors.error;
                }}
              >
                {window.innerWidth < 499 ? '🗑️ Remove' : '🗑️'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;