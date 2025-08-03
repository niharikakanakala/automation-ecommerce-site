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
  
  const getResponsiveStyles = () => {
    const isMobile = window.innerWidth < 499;
    
    if (viewMode === 'grid') {
      return {
        card: {
          backgroundColor: colors.surface,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: isHovered ? '0 8px 25px rgba(0,0,0,0.15)' : '0 2px 10px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          transform: isHovered ? 'translateY(-4px)' : 'none',
          cursor: 'pointer',
          border: `1px solid ${colors.border}`
        },
        imageContainer: {
          position: 'relative',
          height: isMobile ? '180px' : '200px',
          overflow: 'hidden',
          backgroundColor: colors.background
        },
        productInfo: {
          padding: isMobile ? '12px' : '16px'
        },
        quantitySelector: {
          display: 'flex',
          alignItems: 'center',
          border: `2px solid ${colors.border}`,
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: colors.background
        },
        quantityInput: {
          width: isMobile ? '45px' : '50px',
          padding: '8px 4px',
          border: 'none',
          textAlign: 'center',
          backgroundColor: colors.background,
          color: colors.text,
          fontSize: '14px',
          fontWeight: '600',
          outline: 'none'
        }
      };
    } else {
      return {
        card: {
          backgroundColor: colors.surface,
          borderRadius: '12px',
          padding: isMobile ? '16px' : '20px',
          marginBottom: '15px',
          display: 'flex',
          gap: isMobile ? '16px' : '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          border: `1px solid ${colors.border}`,
          flexDirection: isMobile ? 'column' : 'row'
        },
        image: {
          width: isMobile ? '100%' : '150px',
          height: isMobile ? '200px' : '150px',
          objectFit: 'cover',
          borderRadius: '8px',
          flexShrink: 0
        },
        quantitySelector: {
          display: 'flex',
          alignItems: 'center',
          border: `2px solid ${colors.border}`,
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: colors.background
        },
        quantityInput: {
          width: '45px',
          padding: '6px 4px',
          border: 'none',
          textAlign: 'center',
          backgroundColor: colors.background,
          color: colors.text,
          fontSize: '14px',
          fontWeight: '600',
          outline: 'none'
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
            className="product-image-container"
            style={styles.imageContainer}
          >
            {discount > 0 && (
              <div 
                className="discount-badge"
                id={`discount-badge-${product.id}`}
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: colors.error,
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  zIndex: 1
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
                  top: '12px',
                  right: '12px',
                  backgroundColor: colors.warning,
                  color: 'black',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  zIndex: 1
                }}
              >
                Only {product.stock} left!
              </div>
            )}
            
            <img 
              className="product-image"
              src={`https://via.placeholder.com/200x200/e2e8f0/64748b?text=${encodeURIComponent(product.name.substring(0, 15))}`}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)'
              }}
            />
            
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
                top: '12px',
                right: product.stock < 5 ? '140px' : '12px',
                backgroundColor: wishlistItem ? colors.error : 'white',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
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
                margin: '0 0 8px 0', 
                fontSize: '16px',
                fontWeight: '600',
                height: '40px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: colors.text,
                lineHeight: '1.3'
              }}
            >
              {product.name}
            </h3>
            
            <div 
              className="product-rating"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginBottom: '8px' 
              }}
            >
              <div className="rating-stars" style={{ color: colors.warning, fontSize: '14px' }}>
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
              </div>
              <span 
                className="review-count"
                style={{ 
                  fontSize: '12px', 
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
                gap: '10px', 
                marginBottom: '16px' 
              }}
            >
              <span 
                className="current-price"
                id={`price-${product.id}`}
                style={{ 
                  fontSize: '18px', 
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
                    fontSize: '14px', 
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
                gap: '8px', 
                alignItems: 'center' 
              }}
            >
              <div 
                className="quantity-selector quantity-controls"
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
                  style={{
                    padding: '8px 10px',
                    border: 'none',
                    backgroundColor: colors.background,
                    color: colors.text,
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'background-color 0.2s ease'
                  }}
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
                  style={{
                    padding: '8px 10px',
                    border: 'none',
                    backgroundColor: colors.background,
                    color: colors.text,
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'background-color 0.2s ease'
                  }}
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
                  padding: '10px 16px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: product.stock === 0 ? colors.textSecondary : colors.primary,
                  color: 'white',
                  cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  opacity: product.stock === 0 ? 0.6 : 1
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
          <img 
            className="product-image-list"
            src={`https://via.placeholder.com/150x150/e2e8f0/64748b?text=${encodeURIComponent(product.name.substring(0, 10))}`}
            alt={product.name}
            style={styles.image}
          />
          
          <div 
            className="product-details-list"
            style={{ flex: 1, minWidth: 0 }}
          >
            <h3 
              className="product-name-list"
              id={`product-name-list-${product.id}`}
              style={{ 
                margin: '0 0 8px 0',
                color: colors.text,
                fontSize: window.innerWidth < 499 ? '16px' : '18px',
                fontWeight: '600'
              }}
            >
              {product.name}
            </h3>
            <p 
              className="product-description"
              style={{ 
                margin: '0 0 12px 0', 
                color: colors.textSecondary,
                fontSize: '14px',
                lineHeight: '1.4'
              }}
            >
              {product.description}
            </p>
            <div 
              className="product-meta-list"
              style={{ 
                display: 'flex', 
                gap: '20px', 
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              <span 
                className="list-price"
                style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  color: colors.primary 
                }}
              >
                {formatPrice(product.price)}
              </span>
              <div 
                className="list-rating"
                style={{ color: colors.warning, fontSize: '14px' }}
              >
                {'★'.repeat(Math.floor(product.rating))} ({product.reviewsCount} reviews)
              </div>
              <span 
                className="list-stock"
                style={{ 
                  color: product.stock > 0 ? colors.success : colors.error,
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>
          
          <div 
            className="product-actions-list"
            style={{ 
              display: 'flex', 
              flexDirection: window.innerWidth < 499 ? 'row' : 'column',
              gap: '12px',
              alignItems: window.innerWidth < 499 ? 'center' : 'flex-end',
              flexShrink: 0,
              justifyContent: window.innerWidth < 499 ? 'space-between' : 'flex-start'
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
                padding: '8px 16px',
                border: `2px solid ${colors.primary}`,
                borderRadius: '8px',
                backgroundColor: 'transparent',
                color: colors.primary,
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                fontWeight: '600'
              }}
            >
              {wishlistItem ? '❤️ Remove' : '🤍 Add to Wishlist'}
            </button>
            
            <div 
              className="cart-controls-list"
              style={{ 
                display: 'flex', 
                gap: '8px', 
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
                  style={{
                    padding: '6px 8px',
                    border: 'none',
                    backgroundColor: colors.background,
                    color: colors.text,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
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
                  style={{
                    padding: '6px 8px',
                    border: 'none',
                    backgroundColor: colors.background,
                    color: colors.text,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
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
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: product.stock === 0 ? colors.textSecondary : colors.primary,
                  color: 'white',
                  cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  opacity: product.stock === 0 ? 0.6 : 1,
                  transition: 'all 0.2s ease'
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