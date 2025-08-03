import { createStore, combineReducers, applyMiddleware } from 'redux';

// Enums and Constants
export const Category = {
  ELECTRONICS: 'ELECTRONICS',
  CLOTHING: 'CLOTHING', 
  BOOKS: 'BOOKS',
  HOME: 'HOME',
  SPORTS: 'SPORTS'
};

export const SortBy = {
  NAME_ASC: 'NAME_ASC',
  NAME_DESC: 'NAME_DESC',
  PRICE_ASC: 'PRICE_ASC',
  PRICE_DESC: 'PRICE_DESC',
  RATING_DESC: 'RATING_DESC',
  POPULARITY_DESC: 'POPULARITY_DESC'
};

// Sample products data
const sampleProducts = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 299.99,
    originalPrice: 399.99,
    description: 'High-quality noise-cancelling wireless headphones with 30-hour battery life',
    category: Category.ELECTRONICS,
    stock: 15,
    rating: 4.5,
    reviewsCount: 234,
    images: ['headphones1.jpg', 'headphones2.jpg'],
    weight: 0.3,
    tags: ['wireless', 'noise-cancelling', 'premium'],
    createdAt: new Date('2024-01-15'),
    popularity: 89
  },
  {
    id: '2', 
    name: 'Smart Watch Pro',
    price: 399.99,
    description: 'Advanced fitness tracking and health monitoring smartwatch',
    category: Category.ELECTRONICS,
    stock: 8,
    rating: 4.7,
    reviewsCount: 156,
    images: ['watch1.jpg', 'watch2.jpg'],
    weight: 0.1,
    tags: ['fitness', 'health', 'smart'],
    createdAt: new Date('2024-02-01'),
    popularity: 76
  },
  {
    id: '3',
    name: 'Eco-Friendly Yoga Mat',
    price: 49.99,
    originalPrice: 69.99,
    description: 'Sustainable, non-slip yoga mat made from natural materials',
    category: Category.SPORTS,
    stock: 25,
    rating: 4.8,
    reviewsCount: 89,
    images: ['yogamat1.jpg'],
    weight: 1.2,
    tags: ['eco-friendly', 'yoga', 'fitness'],
    createdAt: new Date('2024-01-20'),
    popularity: 65
  },
  {
    id: '4',
    name: 'Bestselling Novel Collection',
    price: 79.99,
    description: 'Collection of top 10 bestselling novels of the year',
    category: Category.BOOKS,
    stock: 3,
    rating: 4.6,
    reviewsCount: 312,
    images: ['books1.jpg'],
    weight: 2.5,
    tags: ['bestseller', 'fiction', 'collection'],
    createdAt: new Date('2024-01-10'),
    popularity: 92
  },
  {
    id: '5',
    name: 'Designer Winter Jacket',
    price: 199.99,
    originalPrice: 299.99,
    description: 'Stylish and warm winter jacket with premium materials',
    category: Category.CLOTHING,
    stock: 0,
    rating: 4.4,
    reviewsCount: 67,
    images: ['jacket1.jpg', 'jacket2.jpg'],
    weight: 0.8,
    tags: ['winter', 'designer', 'premium'],
    createdAt: new Date('2024-02-10'),
    popularity: 58
  }
];

// Initial state
const initialState = {
  products: {
    items: sampleProducts.reduce((acc, p) => ({ ...acc, [p.id]: p }), {}),
    loading: false,
    error: null,
    lastUpdated: new Date()
  },
  cart: {
    items: [],
    savedForLater: [],
    cartId: Date.now().toString(),
    lastModified: new Date()
  },
  wishlist: {
    items: []
  },
  ui: {
    viewMode: 'grid',
    sortBy: SortBy.POPULARITY_DESC,
    filters: {
      categories: [],
      priceRange: { min: 0, max: 1000 },
      inStock: false,
      minRating: 0,
      searchQuery: ''
    },
    quickViewProduct: null,
    compareProducts: [],
    isLoading: {}
  },
  user: {
    recentlyViewed: [],
    sessionStart: new Date(),
    preferences: {
      currency: 'USD',
      language: 'en'
    }
  }
};

// Root reducer
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    // Product actions
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: {
          ...state.products,
          items: action.payload.reduce((acc, p) => ({ ...acc, [p.id]: p }), {}),
          lastUpdated: new Date()
        }
      };
      
    case 'UPDATE_STOCK':
      return {
        ...state,
        products: {
          ...state.products,
          items: {
            ...state.products.items,
            [action.payload.id]: {
              ...state.products.items[action.payload.id],
              stock: action.payload.quantity
            }
          }
        }
      };
      
    // Cart actions
    case 'ADD_TO_CART': {
      const existingItem = state.cart.items.find(item => item.product.id === action.payload.product.id);
      
      if (existingItem) {
        return {
          ...state,
          cart: {
            ...state.cart,
            items: state.cart.items.map(item =>
              item.product.id === action.payload.product.id
                ? { ...item, quantity: item.quantity + action.payload.quantity }
                : item
            ),
            lastModified: new Date()
          }
        };
      }
      
      return {
        ...state,
        cart: {
          ...state.cart,
          items: [...state.cart.items, {
            product: action.payload.product,
            quantity: action.payload.quantity,
            addedAt: new Date(),
            savedForLater: false
          }],
          lastModified: new Date()
        }
      };
    }
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.map(item =>
            item.product.id === action.payload.id
              ? { ...item, quantity: action.payload.quantity }
              : item
          ).filter(item => item.quantity > 0),
          lastModified: new Date()
        }
      };
      
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.filter(item => item.product.id !== action.payload.id),
          lastModified: new Date()
        }
      };
      
    case 'SAVE_FOR_LATER': {
      const item = state.cart.items.find(i => i.product.id === action.payload.id);
      if (!item) return state;
      
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.filter(i => i.product.id !== action.payload.id),
          savedForLater: [...state.cart.savedForLater, { ...item, savedForLater: true }],
          lastModified: new Date()
        }
      };
    }
    
    case 'MOVE_TO_CART': {
      const item = state.cart.savedForLater.find(i => i.product.id === action.payload.id);
      if (!item) return state;
      
      return {
        ...state,
        cart: {
          ...state.cart,
          savedForLater: state.cart.savedForLater.filter(i => i.product.id !== action.payload.id),
          items: [...state.cart.items, { ...item, savedForLater: false }],
          lastModified: new Date()
        }
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        cart: {
          ...state.cart,
          items: [],
          lastModified: new Date()
        }
      };
      
    // Wishlist actions
    case 'ADD_TO_WISHLIST': {
      const exists = state.wishlist.items.some(item => item.product.id === action.payload.product.id);
      if (exists) return state;
      
      return {
        ...state,
        wishlist: {
          ...state.wishlist,
          items: [...state.wishlist.items, {
            product: action.payload.product,
            priority: action.payload.priority,
            addedAt: new Date(),
            notes: action.payload.notes
          }]
        }
      };
    }
    
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: {
          ...state.wishlist,
          items: state.wishlist.items.filter(item => item.product.id !== action.payload.id)
        }
      };
      
    // UI actions
    case 'SET_VIEW_MODE':
      return {
        ...state,
        ui: { ...state.ui, viewMode: action.payload }
      };
      
    case 'SET_SORT_BY':
      return {
        ...state,
        ui: { ...state.ui, sortBy: action.payload }
      };
      
    case 'UPDATE_FILTERS':
      return {
        ...state,
        ui: {
          ...state.ui,
          filters: { ...state.ui.filters, ...action.payload }
        }
      };
      
    case 'RESET_FILTERS':
      return {
        ...state,
        ui: {
          ...state.ui,
          filters: {
            categories: [],
            priceRange: { min: 0, max: 1000 },
            inStock: false,
            minRating: 0,
            searchQuery: ''
          }
        }
      };
      
    // User actions
    case 'ADD_RECENTLY_VIEWED': {
      const filtered = state.user.recentlyViewed.filter(v => v.productId !== action.payload);
      return {
        ...state,
        user: {
          ...state.user,
          recentlyViewed: [
            { productId: action.payload, timestamp: new Date() },
            ...filtered
          ].slice(0, 10)
        }
      };
    }
    
    default:
      return state;
  }
};

// Analytics middleware
const analyticsMiddleware = store => next => action => {
  if (action.type.startsWith('ADD_TO_CART') || 
      action.type.startsWith('REMOVE_FROM_CART') ||
      action.type.startsWith('ADD_TO_WISHLIST')) {
    console.log('Analytics Event:', action);
  }
  
  return next(action);
};

// Create store
export const store = createStore(rootReducer, applyMiddleware(analyticsMiddleware));

// Action creators
export const addToCart = (product, quantity) => ({
  type: 'ADD_TO_CART',
  payload: { product, quantity }
});

export const updateQuantity = (id, quantity) => ({
  type: 'UPDATE_QUANTITY',
  payload: { id, quantity }
});

export const removeFromCart = (id) => ({
  type: 'REMOVE_FROM_CART',
  payload: { id }
});

export const saveForLater = (id) => ({
  type: 'SAVE_FOR_LATER',
  payload: { id }
});

export const moveToCart = (id) => ({
  type: 'MOVE_TO_CART',
  payload: { id }
});

export const clearCart = () => ({
  type: 'CLEAR_CART'
});

export const addToWishlist = (product, priority = 'medium', notes) => ({
  type: 'ADD_TO_WISHLIST',
  payload: { product, priority, notes }
});

export const removeFromWishlist = (id) => ({
  type: 'REMOVE_FROM_WISHLIST',
  payload: { id }
});

export const updateStock = (id, quantity) => ({
  type: 'UPDATE_STOCK',
  payload: { id, quantity }
});

export const updateFilters = (filters) => ({
  type: 'UPDATE_FILTERS',
  payload: filters
});

export const setSortBy = (sortBy) => ({
  type: 'SET_SORT_BY',
  payload: sortBy
});

export const setViewMode = (mode) => ({
  type: 'SET_VIEW_MODE',
  payload: mode
});

export const addRecentlyViewed = (productId) => ({
  type: 'ADD_RECENTLY_VIEWED',
  payload: productId
});