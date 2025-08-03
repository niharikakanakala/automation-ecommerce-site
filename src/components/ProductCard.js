import React, { useState, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, addToWishlist, removeFromWishlist, updateStock, addRecentlyViewed } from '../store';
import { useTheme, useNotifications, useAnalytics } from '../App';

const ProductCard = memo(({ product, viewMode }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { addNotification } = useNotifications();
  const { trackEvent } = useAnalytics();
  
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  
  const wishlistItem = useSelector((state) => 
    state.wishlist.items.find(item => item.product.id === product.id)
  );
  
  const isInCart = useSelector((state) =>
    state.cart.items.some(item => item.product.id === product.id)
  );
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  
  const handleAddToCart = () => {
    if (product.stock >= quantity) {
      dispatch(addToCart(product, quantity));
      dispatch(updateStock(product.id, product.stock - quantity));
      addNotification({
        message: `Added ${quantity} ${product.name} to cart`,
        type: 'success',
        action: {
          label: 'Undo',
          callback: () => {
            dispatch(updateStock(product.id, product.stock));
          }
        }
      });
      trackEvent('add_to_cart', { productId: product.id, quantity });
      setQuantity(1);
    }
  };
  
  const handleAddToWishlist = () => {
    if (wishlistItem) {
      dispatch(removeFromWishlist(product.id));
      addNotification({
        message: `Removed ${product.name} from wishlist`,
        type: 'info'
      });
    } else {
      dispatch(addToWishlist(product, 'medium'));
      addNotification({
        message: `Added ${product.name} to wishlist`,
        type: 'success'
      });
    }
    trackEvent('wishlist_toggle', { productId: product.id, action: wishlistItem ? 'remove' : 'add' });
  };
  
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  
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
    const isVerySmall = width < 400;
    
    if (viewMode === 'grid') {
      return {
        card: {
          backgroundColor: colors.surface,
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: isHovered ? '0 6px 20px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)',
          transition: 'all 0.3s ease',
          transform: isHovered ? 'translateY(-3px)' : 'none',
          cursor: 'pointer',
          border: `1px solid ${colors.border}`,
          minHeight: isMobile ? '260px' : '300px',
          position: 'relative'
        },
        productHeader: {
          position: 'relative',
          height: isMobile ? '70px' : '100px',
          background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: isMobile ? '20px' : '32px',
          fontWeight: 'bold',
          color: colors.primary,
          borderBottom: `1px solid ${colors.border}`
        },
        productInfo: {
          padding: isMobile ? '8px' : '12px'
        },
        quantitySelector: {
          display: 'flex',
          alignItems: 'center',
          border: `2px solid ${colors.border}`,
          borderRadius: '6px',
          overflow: 'hidden',
          backgroundColor: colors.background,
          height: '32px'
        },
        quantityInput: {
          width: isMobile ? '30px' : '40px',
          padding: '4px 2px',
          border: 'none',
          textAlign: 'center',
          backgroundColor: colors.background,
          color: colors.text,
          fontSize: isMobile ? '11px' : '13px',
          fontWeight: '600',
          outline: 'none'
        },
        quantityBtn: {
          padding: '4px 6px',
          border: 'none',
          backgroundColor: colors.background,
          color: colors.text,
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          transition: 'background-color 0.2s ease',
          minWidth: '24px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      };
    } else {
      return {
        card: {
          backgroundColor: colors.surface,
          borderRadius: '10px',
          padding: isMobile ? '12px' : '16px',
          marginBottom: '12px',
          display: 'flex',
          gap: isMobile ? '12px' : '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          transition: 'all 0.3s ease',
          border: `1px solid ${colors.border}`,
          flexDirection: isMobile ? 'column' : 'row',
          minHeight: isMobile ? 'auto' : '120px'
        },
        productIcon: {
          width: isMobile ? '100%' : '80px',
          height: isMobile ? '80px' : '80px',
          background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`,
          borderRadius: '8px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: isMobile ? '24px' : '28px',
          fontWeight: 'bold',
          color: colors.primary,
          border: `1px solid ${colors.border}`
        },
        quantitySelector: {
          display: 'flex',
          alignItems: 'center',
          border: `2px solid ${colors.border}`,
          borderRadius: '6px',
          overflow: 'hidden',
          backgroundColor: colors.background,
          height: '32px'
        },
        quantityInput: {
          width: '35px',
          padding: '4px 2px',
          border: 'none',
          textAlign: 'center',
          backgroundColor: colors.background,
          color: colors.text,
          fontSize: '12px',
          fontWeight: '600',
          outline: 'none'
        },
        quantityBtn: {
          padding: '4px 8px',
          border: 'none',
          backgroundColor: colors.background,
          color: colors.text,
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          height: '32px'
        }
      };
    }
  };
  
  const styles = getResponsiveStyles();
  
  return (
    <div
      className={`product-card ${viewMode}-view`}
      id={`product-${product.id}`}
      data-testid={`product-card-${product.id}`}
      style={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        dispatch(addRecentlyViewed(product.id));
        trackEvent('product_view', { productId: product.id });
      }}
    >
      {viewMode === 'grid' ? (
        <>
          <div 
            className="product-header"
            id={`product-header-${product.id}`}
            style={styles.productHeader}
          >
            {discount > 0 && (
              <div 
                className="discount-badge"
                id={`discount-badge-${product.id}`}
                style={{
                  position: 'absolute',
                  top: '4px',
                  left: '4px',
                  backgroundColor: colors.error,
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: window.innerWidth < 499 ? '9px' : '11px',
                  fontWeight: 'bold',
                  zIndex: 2
                }}
              >
                -{discount}%
              </div>
            )}
            
            {product.stock < 5 && product.stock > 0 && (
              <div 
                className="low-stock-badge"
                id={`low-stock-badge-${product.id}`}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  backgroundColor: colors.warning,
                  color: 'black',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: window.innerWidth < 499 ? '8px' : '10px',
                  fontWeight: 'bold',
                  zIndex: 2
                }}
              >
                Only {product.stock}!
              </div>
            )}
            
            <div 
              className="product-category-icon"
              style={{
                fontSize: window.innerWidth < 499 ? '20px' : '32px',
                transition: 'transform 0.3s ease',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)'
              }}
            >
              {getCategoryIcon(product.category)}
            </div>
            
            <button
              className="wishlist-toggle-btn"
              id={`wishlist-btn-${product.id}`}
              data-testid={`wishlist-toggle-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                handleAddToWishlist();
              }}
              style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                backgroundColor: wishlistItem ? colors.error : 'white',
                border: `1px solid ${colors.border}`,
                borderRadius: '50%',
                width: window.innerWidth < 499 ? '24px' : '28px',
                height: window.innerWidth < 499 ? '24px' : '28px',
                cursor: 'pointer',
                fontSize: window.innerWidth < 499 ? '10px' : '12px',
                transition: 'all 0.3s ease',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2
              }}
            >
              {wishlistItem ? '❤️' : '🤍'}
            </button>
          </div>
          
          <div 
            className="product-info"
            style={styles.productInfo}
          >
            <h3 
              className="product-name"
              id={`product-name-${product.id}`}
              style={{ 
                margin: '0 0 4px 0', 
                fontSize: window.innerWidth < 499 ? '12px' : '15px',
                fontWeight: '600',
                height: window.innerWidth < 499 ? '30px' : '36px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: colors.text,
                lineHeight: '1.2',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {product.name}
            </h3>
            
            <div 
              className="product-category"
              style={{
                fontSize: window.innerWidth < 499 ? '9px' : '11px',
                color: colors.textSecondary,
                marginBottom: '4px',
                textTransform: 'capitalize'
              }}
            >
              {product.category.toLowerCase().replace('_', ' ')}
            </div>
            
            <div 
              className="product-rating"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px', 
                marginBottom: '6px' 
              }}
            >
              <div className="rating-stars" style={{ 
                color: colors.warning, 
                fontSize: window.innerWidth < 499 ? '10px' : '12px' 
              }}>
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
              </div>
              <span 
                className="review-count"
                style={{ 
                  fontSize: window.innerWidth < 499 ? '8px' : '10px', 
                  color: colors.textSecondary 
                }}
              >
                ({product.reviewsCount})
              </span>
            </div>
            
            <div 
              className="product-pricing"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                marginBottom: '8px' 
              }}
            >
              <span 
                className="current-price"
                id={`price-${product.id}`}
                style={{ 
                  fontSize: window.innerWidth < 499 ? '14px' : '16px', 
                  fontWeight: 'bold', 
                  color: colors.primary 
                }}
              >
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span 
                  className="original-price"
                  style={{ 
                    fontSize: window.innerWidth < 499 ? '10px' : '12px', 
                    textDecoration: 'line-through',
                    color: colors.textSecondary 
                  }}
                >
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            <div 
              className="product-actions"
              style={{ 
                display: 'flex', 
                gap: '6px', 
                alignItems: 'center' 
              }}
            >
              <div 
                className="quantity-selector quantity-controls"
                id={`quantity-controls-${product.id}`}
                style={styles.quantitySelector}
              >
                <button
                  className="quantity-decrease quantity-btn"
                  id={`qty-decrease-${product.id}`}
                  data-testid={`quantity-decrease-${product.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuantity(Math.max(1, quantity - 1));
                  }}
                  style={styles.quantityBtn}
                  onMouseEnter={(e) => e.target.style.backgroundColor = colors.border}
                  onMouseLeave={(e) => e.target.style.backgroundColor = colors.background}
                >
                  -
                </button>
                <input
                  className="quantity-input"
                  id={`qty-input-${product.id}`}
                  data-testid={`quantity-input-${product.id}`}
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  onClick={(e) => e.stopPropagation()}
                  style={styles.quantityInput}
                />
                <button
                  className="quantity-increase quantity-btn"
                  id={`qty-increase-${product.id}`}
                  data-testid={`quantity-increase-${product.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuantity(Math.min(product.stock, quantity + 1));
                  }}
                  style={styles.quantityBtn}
                  onMouseEnter={(e) => e.target.style.backgroundColor = colors.border}
                  onMouseLeave={(e) => e.target.style.backgroundColor = colors.background}
                >
                  +
                </button>
              </div>
              
              <button
                className="add-to-cart-btn btn"
                id={`add-cart-${product.id}`}
                data-testid={`add-to-cart-${product.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart();
                }}
                disabled={product.stock === 0}
                style={{
                  flex: 1,
                  padding: window.innerWidth < 499 ? '6px 8px' : '8px 12px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: product.stock === 0 ? colors.textSecondary : colors.primary,
                  color: 'white',
                  cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: window.innerWidth < 499 ? '10px' : '12px',
                  transition: 'all 0.2s ease',
                  opacity: product.stock === 0 ? 0.6 : 1,
                  minHeight: '32px'
                }}
              >
                {product.stock === 0 ? 'Out of Stock' : isInCart ? 'Add More' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </>
      ) : (
        // List view layout
        <>
          <div 
            className="product-icon-list"
            style={styles.productIcon}
          >
            {getCategoryIcon(product.category)}
          </div>
          
          <div 
            className="product-details-list"
            style={{ flex: 1, minWidth: 0 }}
          >
            <h3 
              className="product-name-list"
              id={`product-name-list-${product.id}`}
              style={{ 
                margin: '0 0 4px 0',
                color: colors.text,
                fontSize: window.innerWidth < 499 ? '14px' : '16px',
                fontWeight: '600',
                lineHeight: '1.3'
              }}
            >
              {product.name}
            </h3>
            
            <div 
              className="product-category-list"
              style={{
                fontSize: window.innerWidth < 499 ? '10px' : '12px',
                color: colors.textSecondary,
                marginBottom: '4px',
                textTransform: 'capitalize'
              }}
            >
              📂 {product.category.toLowerCase().replace('_', ' ')}
            </div>
            
            <p 
              className="product-description"
              style={{ 
                margin: '0 0 8px 0', 
                color: colors.textSecondary,
                fontSize: window.innerWidth < 499 ? '11px' : '13px',
                lineHeight: '1.3',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {product.description}
            </p>
            
            <div 
              className="product-meta-list"
              style={{ 
                display: 'flex', 
                gap: window.innerWidth < 499 ? '8px' : '16px', 
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              <span 
                className="list-price"
                style={{ 
                  fontSize: window.innerWidth < 499 ? '16px' : '18px', 
                  fontWeight: 'bold', 
                  color: colors.primary 
                }}
              >
                {formatPrice(product.price)}
              </span>
              <div 
                className="list-rating"
                style={{ 
                  color: colors.warning, 
                  fontSize: window.innerWidth < 499 ? '10px' : '12px' 
                }}
              >
                {'★'.repeat(Math.floor(product.rating))} ({product.reviewsCount})
              </div>
              <span 
                className="list-stock"
                style={{ 
                  color: product.stock > 0 ? colors.success : colors.error,
                  fontWeight: 'bold',
                  fontSize: window.innerWidth < 499 ? '10px' : '12px'
                }}
              >
                {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
              </span>
            </div>
          </div>
          
          <div 
            className="product-actions-list"
            style={{ 
              display: 'flex', 
              flexDirection: window.innerWidth < 499 ? 'column' : 'row',
              gap: '8px',
              alignItems: window.innerWidth < 499 ? 'stretch' : 'center',
              flexShrink: 0,
              minWidth: window.innerWidth < 499 ? '100%' : 'auto'
            }}
          >
            <button
              className="wishlist-btn-list"
              id={`wishlist-list-${product.id}`}
              data-testid={`wishlist-list-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                handleAddToWishlist();
              }}
              style={{
                padding: window.innerWidth < 499 ? '6px 12px' : '8px 12px',
                border: `2px solid ${colors.primary}`,
                borderRadius: '6px',
                backgroundColor: 'transparent',
                color: colors.primary,
                cursor: 'pointer',
                fontSize: window.innerWidth < 499 ? '11px' : '13px',
                transition: 'all 0.2s ease',
                fontWeight: '600',
                minHeight: '32px'
              }}
            >
              {wishlistItem ? '❤️ Remove' : '🤍 Wishlist'}
            </button>
            
            <div 
              className="cart-controls-list"
              style={{ 
                display: 'flex', 
                gap: '6px', 
                alignItems: 'center' 
              }}
            >
              <div 
                className="quantity-selector-list quantity-controls"
                style={styles.quantitySelector}
              >
                <button
                  className="qty-btn-decrease quantity-btn"
                  id={`qty-list-decrease-${product.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuantity(Math.max(1, quantity - 1));
                  }}
                  style={styles.quantityBtn}
                >
                  -
                </button>
                <input
                  className="qty-input-list quantity-input"
                  id={`qty-list-input-${product.id}`}
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  onClick={(e) => e.stopPropagation()}
                  style={styles.quantityInput}
                />
                <button
                  className="qty-btn-increase quantity-btn"
                  id={`qty-list-increase-${product.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuantity(Math.min(product.stock, quantity + 1));
                  }}
                  style={styles.quantityBtn}
                >
                  +
                </button>
              </div>
              
              <button
                className="add-cart-list-btn btn"
                id={`add-cart-list-${product.id}`}
                data-testid={`add-cart-list-${product.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart();
                }}
                disabled={product.stock === 0}
                style={{
                  padding: window.innerWidth < 499 ? '6px 12px' : '8px 12px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: product.stock === 0 ? colors.textSecondary : colors.primary,
                  color: 'white',
                  cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: window.innerWidth < 499 ? '11px' : '13px',
                  opacity: product.stock === 0 ? 0.6 : 1,
                  transition: 'all 0.2s ease',
                  minHeight: '32px',
                  whiteSpace: 'nowrap'
                }}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;