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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  const debouncedSearch = useCallback(
    debounce((query) => {
      dispatch(updateFilters({ searchQuery: query }));
    }, 300),
    [dispatch]
  );
  
  useEffect(() => {
    debouncedSearch(localSearch);
  }, [localSearch, debouncedSearch]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const getResponsiveStyles = () => {
    const isMobile = windowWidth < 640;
    const isTablet = windowWidth >= 640 && windowWidth < 1024;
    const isDesktop = windowWidth >= 1024;
    
    return {
      container: {
        backgroundColor: colors.surface,
        padding: isMobile ? '12px' : '16px',
        borderRadius: '8px',
        marginBottom: '16px',
        border: `1px solid ${colors.border}`,
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      },
      
      // Main search controls container
      searchControls: {
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '8px' : '12px',
        alignItems: isMobile ? 'stretch' : 'center',
        width: '100%'
      },
      
      // Search input wrapper - takes remaining space
      searchWrapper: {
        flex: '1',
        minWidth: 0,
        width: '100%'
      },
      
      searchInput: {
        width: '100%',
        padding: isMobile ? '10px 12px' : '10px 14px',
        border: `1px solid ${colors.border}`,
        borderRadius: '6px',
        fontSize: '14px',
        backgroundColor: colors.background,
        color: colors.text,
        outline: 'none',
        transition: 'all 0.2s ease',
        fontWeight: '400',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        boxSizing: 'border-box'
      },
      
      // Controls wrapper for sort and filter button
      controlsWrapper: {
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '6px' : '8px',
        width: isMobile ? '100%' : 'auto',
        flexShrink: 0
      },
      
      select: {
        padding: '10px 12px',
        border: `1px solid ${colors.border}`,
        borderRadius: '6px',
        backgroundColor: colors.background,
        color: colors.text,
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500',
        minWidth: isMobile ? '100%' : '140px',
        outline: 'none',
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        boxSizing: 'border-box'
      },
      
      filterBtn: {
        padding: '10px 16px',
        border: `1px solid ${colors.primary}`,
        borderRadius: '6px',
        backgroundColor: showAdvancedFilters ? colors.primary : 'transparent',
        color: showAdvancedFilters ? 'white' : colors.primary,
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '600',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        justifyContent: 'center',
        minHeight: '38px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        minWidth: isMobile ? '100%' : '100px',
        boxSizing: 'border-box'
      },
      
      advancedFilters: {
        marginTop: '12px',
        padding: isMobile ? '12px' : '16px',
        border: `1px solid ${colors.border}`,
        borderRadius: '6px',
        backgroundColor: colors.background,
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
        width: '100%',
        boxSizing: 'border-box'
      },
      
      filterGrid: {
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 
                           isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gap: isMobile ? '16px' : '20px',
        width: '100%'
      },
      
      filterSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      },
      
      filterLabel: {
        display: 'block',
        marginBottom: '6px',
        fontWeight: '600',
        color: colors.text,
        fontSize: '14px'
      },
      
      checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        color: colors.text,
        fontSize: '13px',
        fontWeight: '400',
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
        height: '4px',
        borderRadius: '2px',
        outline: 'none',
        accentColor: colors.primary,
        cursor: 'pointer'
      },
      
      resetBtn: {
        padding: '8px 16px',
        border: `1px solid ${colors.textSecondary}`,
        borderRadius: '6px',
        backgroundColor: 'transparent',
        color: colors.textSecondary,
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500',
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
        {/* Search Input */}
        <div 
          className="search-input-wrapper" 
          style={styles.searchWrapper}
        >
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
              e.target.style.boxShadow = `0 0 0 2px ${colors.primary}15`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.border;
              e.target.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
            }}
          />
        </div>
        
        {/* Controls (Sort + Filter Button) */}
        <div 
          className="controls-wrapper"
          style={styles.controlsWrapper}
        >
          <select
            className="sort-select"
            id="sort-dropdown"
            data-testid="sort-select"
            value={sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value))}
            style={styles.select}
            onFocus={(e) => {
              e.target.style.borderColor = colors.primary;
              e.target.style.boxShadow = `0 0 0 2px ${colors.primary}15`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.border;
              e.target.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
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
            <span>Filters</span>
          </button>
        </div>
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
              <div className="category-checkboxes" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                    fontSize: '12px',
                    fontWeight: '500',
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                      fontSize: '13px',
                      fontWeight: '400',
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
                        border: `1px solid ${colors.border}`,
                        borderRadius: '4px',
                        backgroundColor: colors.background,
                        color: colors.text,
                        fontSize: '12px',
                        fontWeight: '400',
                        outline: 'none',
                        cursor: 'pointer',
                        minWidth: '70px'
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
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
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