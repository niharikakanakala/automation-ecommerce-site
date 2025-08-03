import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Category, SortBy, updateFilters, setSortBy } from '../store';
import { useTheme } from '../App';

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const SearchAndFilter = () => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const filters = useSelector((state) => state.ui.filters);
  const sortBy = useSelector((state) => state.ui.sortBy);
  
  const [localSearch, setLocalSearch] = useState(filters.searchQuery);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const debouncedSearch = useCallback(
    debounce((query) => {
      dispatch(updateFilters({ searchQuery: query }));
    }, 300),
    [dispatch]
  );
  
  useEffect(() => {
    debouncedSearch(localSearch);
  }, [localSearch, debouncedSearch]);
  
  const getResponsiveStyles = () => {
    const width = window.innerWidth;
    const isMobile = width < 499;
    const isTablet = width >= 499 && width < 768;
    
    return {
      container: {
        backgroundColor: colors.surface,
        padding: isMobile ? '12px' : '20px',
        borderRadius: '12px',
        marginBottom: isMobile ? '16px' : '20px',
        border: `1px solid ${colors.border}`,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      },
      searchControls: {
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 
                           isTablet ? '1fr auto' : '1fr auto auto',
        gap: isMobile ? '8px' : '12px',
        alignItems: 'center'
      },
      searchInput: {
        width: '100%',
        padding: isMobile ? '10px 12px' : '12px 16px',
        border: `2px solid ${colors.border}`,
        borderRadius: '8px',
        fontSize: isMobile ? '14px' : '16px',
        backgroundColor: colors.background,
        color: colors.text,
        outline: 'none',
        transition: 'all 0.2s ease',
        fontWeight: '500',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      },
      select: {
        padding: isMobile ? '10px 12px' : '12px 16px',
        border: `2px solid ${colors.border}`,
        borderRadius: '8px',
        backgroundColor: colors.background,
        color: colors.text,
        cursor: 'pointer',
        fontSize: isMobile ? '12px' : '14px',
        fontWeight: '500',
        minWidth: isMobile ? '100%' : '160px',
        outline: 'none',
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      },
      filterBtn: {
        padding: isMobile ? '10px 16px' : '12px 20px',
        border: `2px solid ${colors.primary}`,
        borderRadius: '8px',
        backgroundColor: showAdvancedFilters ? colors.primary : 'transparent',
        color: showAdvancedFilters ? 'white' : colors.primary,
        cursor: 'pointer',
        fontSize: isMobile ? '12px' : '14px',
        fontWeight: '700',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        justifyContent: 'center',
        minHeight: '40px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      },
      advancedFilters: {
        marginTop: '16px',
        padding: isMobile ? '12px' : '20px',
        border: `2px solid ${colors.border}`,
        borderRadius: '8px',
        backgroundColor: colors.background,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      },
      filterGrid: {
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 
                           isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gap: isMobile ? '16px' : '20px'
      },
      filterSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      },
      filterLabel: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '700',
        color: colors.text,
        fontSize: isMobile ? '14px' : '16px'
      },
      checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        color: colors.text,
        fontSize: isMobile ? '12px' : '14px',
        fontWeight: '500',
        padding: '2px 0',
        gap: '8px'
      },
      checkbox: {
        width: '16px',
        height: '16px',
        accentColor: colors.primary,
        cursor: 'pointer'
      },
      priceSlider: {
        width: '100%',
        marginBottom: '8px',
        height: '6px',
        borderRadius: '3px',
        outline: 'none',
        accentColor: colors.primary,
        cursor: 'pointer'
      },
      resetBtn: {
        padding: isMobile ? '8px 16px' : '10px 20px',
        border: `2px solid ${colors.textSecondary}`,
        borderRadius: '8px',
        backgroundColor: 'transparent',
        color: colors.textSecondary,
        cursor: 'pointer',
        fontSize: isMobile ? '12px' : '14px',
        fontWeight: '600',
        transition: 'all 0.2s ease'
      }
    };
  };
  
  const styles = getResponsiveStyles();
  
  return (
    <div 
      className="search-filter-container card"
      id="search-filter-section"
      data-testid="search-filter-container"
      style={styles.container}
    >
      <div 
        className="search-controls"
        id="search-controls"
        style={styles.searchControls}
      >
        <div className="search-input-wrapper" style={{ position: 'relative' }}>
          <input
            className="search-input input"
            id="product-search"
            data-testid="product-search-input"
            type="text"
            placeholder="🔍 Search products..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            style={styles.searchInput}
            onFocus={(e) => {
              e.target.style.borderColor = colors.primary;
              e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.border;
              e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }}
          />
        </div>
        
        <select
          className="sort-select"
          id="sort-dropdown"
          data-testid="sort-select"
          value={sortBy}
          onChange={(e) => dispatch(setSortBy(e.target.value))}
          style={styles.select}
          onFocus={(e) => {
            e.target.style.borderColor = colors.primary;
            e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = colors.border;
            e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
          }}
        >
          <option value={SortBy.POPULARITY_DESC}>🔥 Popular</option>
          <option value={SortBy.PRICE_ASC}>💰 Low Price</option>
          <option value={SortBy.PRICE_DESC}>💸 High Price</option>
          <option value={SortBy.RATING_DESC}>⭐ Top Rated</option>
          <option value={SortBy.NAME_ASC}>🔤 A to Z</option>
          <option value={SortBy.NAME_DESC}>🔤 Z to A</option>
        </select>
        
        <button
          className="advanced-filter-btn btn"
          id="advanced-filters-toggle"
          data-testid="advanced-filters-button"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          style={styles.filterBtn}
          onMouseEnter={(e) => {
            if (!showAdvancedFilters) {
              e.target.style.backgroundColor = colors.primary;
              e.target.style.color = 'white';
            }
          }}
          onMouseLeave={(e) => {
            if (!showAdvancedFilters) {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = colors.primary;
            }
          }}
        >
          <span>🔧</span>
          <span>{window.innerWidth >= 499 ? 'Filters' : 'Filter'}</span>
        </button>
      </div>
      
      {showAdvancedFilters && (
        <div 
          className="advanced-filters animate-fadeIn"
          id="advanced-filters-panel"
          data-testid="advanced-filters-panel"
          style={styles.advancedFilters}
        >
          <div 
            className="filter-grid"
            style={styles.filterGrid}
          >
            {/* Categories Filter */}
            <div className="category-filter" id="category-filter-section" style={styles.filterSection}>
              <label 
                className="filter-label"
                style={styles.filterLabel}
              >
                📂 Categories
              </label>
              <div className="category-checkboxes" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {Object.values(Category).map(cat => (
                  <label 
                    key={cat} 
                    className="checkbox-label"
                    id={`category-label-${cat.toLowerCase()}`}
                    style={styles.checkboxLabel}
                  >
                    <input
                      className="category-checkbox"
                      id={`category-${cat.toLowerCase()}`}
                      data-testid={`category-checkbox-${cat.toLowerCase()}`}
                      type="checkbox"
                      checked={filters.categories.includes(cat)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          dispatch(updateFilters({ 
                            categories: [...filters.categories, cat] 
                          }));
                        } else {
                          dispatch(updateFilters({ 
                            categories: filters.categories.filter(c => c !== cat) 
                          }));
                        }
                      }}
                      style={styles.checkbox}
                    />
                    <span>{cat.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Price Range Filter */}
            <div className="price-filter" id="price-filter-section" style={styles.filterSection}>
              <label 
                className="filter-label"
                style={styles.filterLabel}
              >
                💰 Price Range
              </label>
              <div className="price-range-container">
                <input
                  className="price-range-slider"
                  id="price-range-max"
                  data-testid="price-range-slider"
                  type="range"
                  min="0"
                  max="1000"
                  value={filters.priceRange.max}
                  onChange={(e) => dispatch(updateFilters({ 
                    priceRange: { ...filters.priceRange, max: parseInt(e.target.value) }
                  }))}
                  style={{
                    ...styles.priceSlider,
                    background: `linear-gradient(to right, ${colors.primary} 0%, ${colors.primary} ${(filters.priceRange.max/1000)*100}%, ${colors.border} ${(filters.priceRange.max/1000)*100}%, ${colors.border} 100%)`
                  }}
                />
                <div 
                  className="price-range-display"
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: window.innerWidth < 499 ? '12px' : '14px',
                    fontWeight: '600',
                    color: colors.textSecondary
                  }}
                >
                  <span className="price-min" id="price-min-display">${filters.priceRange.min}</span>
                  <span className="price-max" id="price-max-display">${filters.priceRange.max}</span>
                </div>
              </div>
            </div>
            
            {/* Other Filters */}
            <div className="other-filters" id="other-filters-section" style={styles.filterSection}>
              <label 
                className="filter-label"
                style={styles.filterLabel}
              >
                ⚙️ Other Filters
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label 
                  className="checkbox-label"
                  id="stock-filter-label"
                  style={styles.checkboxLabel}
                >
                  <input
                    className="stock-checkbox"
                    id="in-stock-filter"
                    data-testid="in-stock-checkbox"
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => dispatch(updateFilters({ inStock: e.target.checked }))}
                    style={styles.checkbox}
                  />
                  <span>📦 In Stock Only</span>
                </label>
                
                <div className="rating-filter">
                  <label 
                    className="rating-filter-label"
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      color: colors.text,
                      fontSize: window.innerWidth < 499 ? '12px' : '14px',
                      fontWeight: '500',
                      gap: '8px'
                    }}
                  >
                    <span>⭐ Min Rating:</span>
                    <select
                      className="rating-select"
                      id="min-rating-select"
                      data-testid="min-rating-select"
                      value={filters.minRating}
                      onChange={(e) => dispatch(updateFilters({ minRating: parseFloat(e.target.value) }))}
                      style={{ 
                        padding: '4px 8px',
                        border: `2px solid ${colors.border}`,
                        borderRadius: '4px',
                        backgroundColor: colors.background,
                        color: colors.text,
                        fontSize: window.innerWidth < 499 ? '11px' : '13px',
                        fontWeight: '500',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="0">All</option>
                      <option value="3">3+ Stars</option>
                      <option value="4">4+ Stars</option>
                      <option value="4.5">4.5+ Stars</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Reset Filters Button */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              className="reset-filters-btn btn"
              id="reset-filters"
              data-testid="reset-filters-button"
              onClick={() => dispatch({ type: 'RESET_FILTERS' })}
              style={styles.resetBtn}
              onMouseEnter={(e) => {
                e.target.style.borderColor = colors.error;
                e.target.style.color = colors.error;
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = colors.textSecondary;
                e.target.style.color = colors.textSecondary;
              }}
            >
              🔄 Reset All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;