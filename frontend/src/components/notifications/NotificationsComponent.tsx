/*
 * File: NotificationsComponent.tsx
 * Path: C:\CFH\frontend\src\components\notifications\NotificationsComponent.tsx
 * Purpose: View and manage user notifications in the CFH Automotive Ecosystem
 * Author: CFH Dev Team
 * Date: 2025-06-22T17:39:00.000Z
 * Batch ID: Notifications-062225
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../../i18n';
import { analyticsApi } from '../../services/analyticsApi';

type UserTier = 'Free' | 'Standard' | 'Premium' | 'Wow++';

interface Notification {
  notificationId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: 'Auction' | 'Marketplace' | 'System';
}

interface NotificationsComponentProps {
  userTier: UserTier;
}

const NotificationsComponent: React.FC<NotificationsComponentProps> = ({ userTier }) => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'read' | 'unread' | 'auction' | 'marketplace' | 'system'>('all');
  const [settings, setSettings] = useState<{ auction: boolean; marketplace: boolean; system: boolean }>({
    auction: true,
    marketplace: true,
    system: true,
  });

  const hasPermission = (requiredTier: UserTier): boolean => {
    const tierLevels = { Free: 0, Standard: 1, Premium: 2, 'Wow++': 3 };
    return tierLevels[userTier] >= tierLevels[requiredTier];
  };

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await analyticsApi.getNotifications();
      if (!response.data.length) {
        setError(t('notifications.error.noNotifications'));
      }
      setNotifications(response.data);
    } catch (err) {
      setError(t('notifications.error.fetchFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkRead = async (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.notificationId === notificationId ? { ...n, isRead: true } : n))
    );
    try {
      await analyticsApi.markNotificationRead(notificationId);
    } catch (error) {
      console.error('Failed to mark as read:', error);
      fetchNotifications();
    }
  };

  const handleDelete = async (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.notificationId !== notificationId));
    try {
      await analyticsApi.deleteNotification(notificationId);
    } catch (error) {
      console.error('Failed to delete:', error);
      fetchNotifications();
    }
  };

  const handleSelect = (notificationId: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  const handleBatchAction = async (action: 'markRead' | 'delete') => {
    const ids = Array.from(selectedIds);
    try {
      if (action === 'markRead') {
        await analyticsApi.batchMarkAsRead(ids);
      } else {
        await analyticsApi.batchDeleteNotifications(ids);
      }
      setSelectedIds(new Set());
      fetchNotifications();
    } catch (error) {
      console.error(`Batch ${action} failed:`, error);
      setError(t(`notifications.error.batch${action === 'markRead' ? 'MarkRead' : 'Delete'}Failed`));
    }
  };

  const handleSettingsChange = (category: 'auction' | 'marketplace' | 'system') => {
    setSettings((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return settings[n.type.toLowerCase() as keyof typeof settings];
    if (filter === 'read') return n.isRead && settings[n.type.toLowerCase() as keyof typeof settings];
    if (filter === 'unread') return !n.isRead && settings[n.type.toLowerCase() as keyof typeof settings];
    return n.type.toLowerCase() === filter && settings[n.type.toLowerCase() as keyof typeof settings];
  });

  return (
    <div className="notifications-container" role="main" aria-label={t('notifications.title')}>
      <h2>{t('notifications.title')}</h2>
      <div className="settings">
        <h3>{t('notifications.settings')}</h3>
        <label>
          <input
            type="checkbox"
            checked={settings.auction}
            onChange={() => handleSettingsChange('auction')}
            aria-label={t('notifications.toggle.auction')}
          />
          {t('notifications.toggle.auction')}
        </label>
        <label>
          <input
            type="checkbox"
            checked={settings.marketplace}
            onChange={() => handleSettingsChange('marketplace')}
            aria-label={t('notifications.toggle.marketplace')}
          />
          {t('notifications.toggle.marketplace')}
        </label>
        <label>
          <input
            type="checkbox"
            checked={settings.system}
            onChange={() => handleSettingsChange('system')}
            aria-label={t('notifications.toggle.system')}
          />
          {t('notifications.toggle.system')}
        </label>
      </div>
      <div className="filters">
        <label>{t('notifications.filter.label')}</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          aria-label={t('notifications.filter.label')}
        >
          <option value="all">{t('notifications.filter.all')}</option>
          <option value="read">{t('notifications.filter.read')}</option>
          <option value="unread">{t('notifications.filter.unread')}</option>
          <option value="auction">{t('notifications.filter.auction')}</option>
          <option value="marketplace">{t('notifications.filter.marketplace')}</option>
          <option value="system">{t('notifications.filter.system')}</option>
        </select>
      </div>
      {hasPermission('Standard') && selectedIds.size > 0 && (
        <div className="batch-actions">
          <button
            onClick={() => handleBatchAction('markRead')}
            aria-label={t('notifications.batch.markRead')}
          >
            {t('notifications.batch.markRead')}
          </button>
          <button
            onClick={() => handleBatchAction('delete')}
            aria-label={t('notifications.batch.delete')}
          >
            {t('notifications.batch.delete')}
          </button>
        </div>
      )}
      {isLoading && <div>{t('loading')}</div>}
      {error && <div className="error-message">{error}</div>}
      <ul className="notifications-list" aria-label={t('notifications.list')}>
        {filteredNotifications.map((notification) => (
          <li
            key={notification.notificationId}
            className={notification.isRead ? 'is-read' : ''}
            role="listitem"
          >
            {hasPermission('Standard') && (
              <input
                type="checkbox"
                onChange={() => handleSelect(notification.notificationId)}
                checked={selectedIds.has(notification.notificationId)}
                aria-label={t('notifications.select', { title: notification.title })}
              />
            )}
            <div className="notification-content">
              <strong>{notification.title}</strong>
              <p>{notification.message}</p>
              <small>{new Date(notification.createdAt).toLocaleString()}</small>
            </div>
            <div className="notification-actions">
              {!notification.isRead && (
                <button
                  onClick={() => handleMarkRead(notification.notificationId)}
                  aria-label={t('notifications.markRead')}
                >
                  {t('notifications.markRead')}
                </button>
              )}
              <button
                onClick={() => handleDelete(notification.notificationId)}
                aria-label={t('notifications.delete')}
              >
                {t('notifications.delete')}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsComponent;