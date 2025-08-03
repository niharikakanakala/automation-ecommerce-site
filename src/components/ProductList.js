import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SortBy, setViewMode } from '../store';
import { useTheme } from '../App';
import ProductCard from './ProductCard';

const ProductList = () => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const products = useSelector((state) => Object.values(state.products.items));
  const filters = useSelector((state) => state.ui.filters);
  const sortBy = useSelector((state) => state.ui.sortBy);
  const viewMode = useSelector((state) => state.ui.viewMode);
  
  // Apply filters and sorting
  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(p => filters.categories.includes(p.category));
    }
    
    // Price filter
    filtered = filtered.filter(p => 
      p.price >= filters.priceRange.min && p.price <= filters.priceRange.max
    );
    
    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter(p => p.stock > 0);
    }
    
    // Rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(p => p.rating >= filters.minRating);
    }
    
    // Sorting
    const sorted = [...filtered];
    switch (sortBy) {
      case SortBy.PRICE_ASC:
        sorted.sort((a, b) => a.price - b.price);
        break;
      case SortBy.PRICE_DESC:
        sorted.sort((a, b) => b.price - a.price);
        break;
      case SortBy.NAME_ASC:
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case SortBy.NAME_DESC:
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case SortBy.RATING_DESC:
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case SortBy.POPULARITY_DESC:
        sorted.sort((a, b) => b.popularity - a.popularity);
        break;
      default:
        break;
    }
    
    return sorted;
  }, [products, filters, sortBy]);
  
  const getResponsiveStyles = () => {
    const width = window.innerWidth;
    const isMobile = width < 499;
    const isTablet = width >= 499 && width < 768;
    
    return {
      container: {
        marginBottom: isMobile ? '20px' : '32px'
      },
      header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isMobile ? '16px' : '24px',
        flexWrap: 'wrap',
        gap: '12px',
        padding: isMobile ? '0 4px' : '0'
      },
      title: {
        margin: 0,
        color: colors.text,
        fontSize: isMobile ? '18px' : '24px',
        fontWeight: '700'
      },
      viewToggle: {
        display: 'flex',
        gap: '4px',
        padding: '2px',
        backgroundColor: colors.surface,
        borderRadius: '8px',
        border: `2px solid ${colors.border}`
      },
      viewBtn: (active) => ({
        padding: isMobile ? '6px 10px' : '8px 16px',
        border: 'none',
        borderRadius: '6px',
        backgroundColor: active ? colors.primary : 'transparent',
        color: active ? 'white' : colors.text,
        cursor: 'pointer',
        fontSize: isMobile ? '12px' : '14px',
        fontWeight: '600',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        minWidth: isMobile ? '50px' : '70px',
        justifyContent: 'center'
      }),
      grid: {
        display: 'grid',
        gap: isMobile ? '12px' : '16px'
      },
      noProducts: {
        textAlign: 'center',
        padding: isMobile ? '40px 16px' : '60px 20px',
        backgroundColor: colors.surface,
        borderRadius: '12px',
        border: `1px solid ${colors.border}`
      }
    };
  };
  
  const styles = getResponsiveStyles();
  
  const getGridColumns = () => {
    if (viewMode === 'list') return '1fr';
    
    const width = window.innerWidth;
    if (width < 400) return '1fr';
    if (width < 499) return 'repeat(2, 1fr)';
    if (width < 768) return 'repeat(2, 1fr)';
    if (width < 1024) return 'repeat(3, 1fr)';
    return 'repeat(4, 1fr)';
  };
  
  return (
    <div 
      className="product-list-container"
      id="products-section"
      data-testid="product-list-container"
      style={styles.container}
    >
      <div 
        className="product-list-header"
        id="product-list-header"
        style={styles.header}
      >
        <h2 
          className="products-title"
          id="products-count"
          data-testid="products-count"
          style={styles.title}
        >
          Products ({filteredProducts.length})
        </h2>
        
        <div 
          className="view-toggle"
          id="view-toggle-controls"
          data-testid="view-toggle"
          style={styles.viewToggle}
        >
          <button
            className={`view-btn grid-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            id="grid-view-btn"
            data-testid="grid-view-button"
            onClick={() => dispatch(setViewMode('grid'))}
            style={styles.viewBtn(viewMode === 'grid')}
          >
            <span>📱</span>
            {window.innerWidth >= 499 && <span>Grid</span>}
          </button>
          <button
            className={`view-btn list-view-btn ${viewMode === 'list' ? 'active' : ''}`}
            id="list-view-btn"
            data-testid="list-view-button"
            onClick={() => dispatch(setViewMode('list'))}
            style={styles.viewBtn(viewMode === 'list')}
          >
            <span>📋</span>
            {window.innerWidth >= 499 && <span>List</span>}
          </button>
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div 
          className="no-products"
          id="no-products-message"
          data-testid="no-products-found"
          style={styles.noProducts}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ 
            color: colors.text, 
            marginBottom: '8px',
            fontSize: window.innerWidth < 499 ? '18px' : '24px'
          }}>
            No products found
          </h3>
          <p style={{ 
            color: colors.textSecondary, 
            fontSize: window.innerWidth < 499 ? '14px' : '16px',
            maxWidth: '300px',
            margin: '0 auto'
          }}>
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        <div 
          className={`products-grid ${viewMode}-layout`}
          id="products-grid"
          data-testid="products-grid"
          style={{
            ...styles.grid,
            gridTemplateColumns: getGridColumns()
          }}
        >
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              viewMode={viewMode} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;