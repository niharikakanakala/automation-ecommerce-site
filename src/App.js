import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { Dashboard } from './components/Dashboard';

// Theme configurations with responsive considerations
const themes = {
  light: {
    primary: '#2563eb',
    secondary: '#6b7280', 
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1f2937',
    textSecondary: '#6b7280',
    error: '#dc2626',
    success: '#16a34a',
    warning: '#f59e0b',
    border: '#e5e7eb'
  },
  dark: {
    primary: '#3b82f6',
    secondary: '#6b7280',
    background: '#111827',
    surface: '#1f2937', 
    text: '#f9fafb',
    textSecondary: '#9ca3af',
    error: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
    border: '#374151'
  },
  colorblind: {
    primary: '#0072B2',
    secondary: '#999999',
    background: '#ffffff',
    surface: '#f5f5f5',
    text: '#000000',
    textSecondary: '#666666',
    error: '#D55E00',
    success: '#009E73',
    warning: '#F0E442',
    border: '#cccccc'
  }
};

// Create contexts
const ThemeContext = createContext();
const NotificationContext = createContext();
const AnalyticsContext = createContext();

// Custom hooks
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) throw new Error('useAnalytics must be used within AnalyticsProvider');
  return context;
};

// Theme Provider
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const themeOptions = ['light', 'dark', 'colorblind'];
      const currentIndex = themeOptions.indexOf(prev);
      return themeOptions[(currentIndex + 1) % themeOptions.length];
    });
  }, []);
  
  return (
    <ThemeContext.Provider value={{ 
      theme, 
      colors: themes[theme], 
      toggleTheme,
      setTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Notification Provider
const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const timeoutRefs = useRef(new Map());
  
  const addNotification = useCallback((notification) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
    
    const duration = notification.duration || 5000;
    const timeout = setTimeout(() => {
      removeNotification(id);
    }, duration);
    
    timeoutRefs.current.set(id, timeout);
  }, []);
  
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    
    const timeout = timeoutRefs.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutRefs.current.delete(id);
    }
  }, []);
  
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);
  
  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Analytics Provider
const AnalyticsProvider = ({ children }) => {
  const [sessionStart] = useState(new Date());
  const [events, setEvents] = useState([]);
  
  const trackEvent = useCallback((event, data) => {
    const eventData = {
      event,
      data,
      timestamp: new Date()
    };
    
    setEvents(prev => [...prev, eventData]);
    console.log('Analytics Event:', eventData);
  }, []);
  
  useEffect(() => {
    const handleBeforeUnload = () => {
      const sessionDuration = Date.now() - sessionStart.getTime();
      trackEvent('session_end', { duration: sessionDuration });
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [sessionStart, trackEvent]);
  
  return (
    <AnalyticsContext.Provider value={{ trackEvent, sessionStart, events }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

// Responsive Notification System Component
const NotificationSystem = () => {
  const { notifications, removeNotification } = useNotifications();
  const { colors } = useTheme();
  
  const getResponsiveStyles = () => {
    const isMobile = window.innerWidth < 499;
    const isTablet = window.innerWidth >= 499 && window.innerWidth < 768;
    
    return {
      position: 'fixed',
      top: isMobile ? '10px' : '20px',
      right: isMobile ? '10px' : '20px',
      left: isMobile ? '10px' : 'auto',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '8px' : '12px',
      maxWidth: isMobile ? 'calc(100vw - 20px)' : isTablet ? '350px' : '400px'
    };
  };
  
  return (
    <div 
      className="notification-system"
      id="notification-container"
      style={getResponsiveStyles()}
    >
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type} animate-slideIn`}
          id={`notification-${notification.id}`}
          data-testid={`notification-${notification.type}`}
          style={{
            padding: window.innerWidth < 499 ? '12px 16px' : '16px 20px',
            borderRadius: '8px',
            backgroundColor: colors[notification.type === 'error' ? 'error' : 
                                   notification.type === 'success' ? 'success' : 
                                   notification.type === 'warning' ? 'warning' : 'primary'],
            color: 'white',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: window.innerWidth < 499 ? '14px' : '16px',
            fontWeight: '500'
          }}
        >
          <span className="notification-message" style={{ flex: 1, wordBreak: 'break-word' }}>
            {notification.message}
          </span>
          {notification.action && (
            <button
              className="notification-action-btn"
              onClick={notification.action.callback}
              style={{
                background: 'none',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}
            >
              {notification.action.label}
            </button>
          )}
          <button
            className="notification-close-btn"
            onClick={() => removeNotification(notification.id)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '0 4px',
              lineHeight: 1,
              minWidth: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <NotificationProvider>
          <AnalyticsProvider>
            <AppContent />
          </AnalyticsProvider>
        </NotificationProvider>
      </ThemeProvider>
    </Provider>
  );
};

const AppContent = () => {
  const { colors } = useTheme();
  
  return (
    <div 
      className="app-root"
      id="app-root"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        minHeight: '100vh',
        transition: 'all 0.3s ease'
      }}
    >
      <Dashboard />
      <NotificationSystem />
    </div>
  );
};

export default App;