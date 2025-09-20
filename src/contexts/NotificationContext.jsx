import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      type: 'info',
      title: 'Notification',
      message: '',
      duration: 5000,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove notification after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Convenience methods for different notification types
  const success = (message, title = 'Success', options = {}) => {
    return addNotification({
      type: 'success',
      title,
      message,
      ...options,
    });
  };

  const error = (message, title = 'Error', options = {}) => {
    return addNotification({
      type: 'error',
      title,
      message,
      duration: 8000, // Errors stay longer
      ...options,
    });
  };

  const warning = (message, title = 'Warning', options = {}) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      ...options,
    });
  };

  const info = (message, title = 'Information', options = {}) => {
    return addNotification({
      type: 'info',
      title,
      message,
      ...options,
    });
  };

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    warning,
    info,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
