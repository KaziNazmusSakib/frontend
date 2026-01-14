'use client';

import { useState, useEffect } from 'react';
import axiosClient from '@/lib/axiosClient';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axiosClient.get('/notifications', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setNotifications(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axiosClient.put(`/notifications/${id}/read`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axiosClient.put('/notifications/read-all', {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axiosClient.delete(`/notifications/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info':
        return '💡';
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '📢';
    }
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">🔔 Notifications</h1>
        <p className="text-gray-600">
          {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
        </p>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="tabs">
          <button
            className={`tab tab-bordered ${filter === 'all' ? 'tab-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({notifications.length})
          </button>
          <button
            className={`tab tab-bordered ${filter === 'unread' ? 'tab-active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
        </div>
        <button
          className="btn btn-sm btn-outline"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
        >
          Mark all as read
        </button>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔔</div>
          <h2 className="text-2xl font-bold mb-2">No notifications</h2>
          <p className="text-gray-600">You&apos;re all caught up!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`card shadow-lg ${notification.read ? 'bg-base-100' : 'bg-primary/5'}`}
            >
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div>
                      <h3 className="card-title text-lg">{notification.title}</h3>
                      <p className="text-gray-600">{notification.message}</p>
                      <p className="text-sm text-gray-400 mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!notification.read && (
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-ghost text-error"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}