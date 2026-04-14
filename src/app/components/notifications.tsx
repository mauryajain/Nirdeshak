import { X, Bell, TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import { formatIndianRupee } from '../utils/format';
import type { NotificationRecord } from '../lib/api';
import { useLanguage } from '../lib/LanguageContext';

interface NotificationsProps {
  isOpen: boolean;
  notifications: NotificationRecord[];
  onClose: () => void;
  onNotificationCTA: (notification: NotificationRecord) => void;
}

export function Notifications({ isOpen, notifications, onClose, onNotificationCTA }: NotificationsProps) {
  const { lang } = useLanguage();
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'idle':
        return <Bell className="w-5 h-5 text-orange-600" />;
      case 'rate-increase':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'deadline':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'maturity':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'idle':
        return 'bg-orange-50 border-orange-200';
      case 'rate-increase':
        return 'bg-green-50 border-green-200';
      case 'deadline':
        return 'bg-red-50 border-red-200';
      case 'maturity':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 animate-in fade-in duration-200">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Notification Panel */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-[390px] bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-primary text-white px-4 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{lang.notifications.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification List */}
        <div className="overflow-y-auto h-[calc(100%-64px)] p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="rounded-2xl p-6 text-center border border-gray-200 bg-gray-50">
              <p className="font-semibold text-gray-800 mb-2">{lang.notifications.noNotifications}</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-2xl p-4 border-2 shadow-sm ${getBgColor(notification.type)}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">{notification.title}</h3>
                    <p className="text-sm text-gray-700 leading-relaxed mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleDateString('hi-IN', {
                        day: 'numeric',
                        month: 'long',
                      })}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNotificationCTA(notification)}
                  className="w-full bg-white border-2 border-primary text-primary font-semibold py-2 rounded-xl hover:bg-primary hover:text-white transition-all active:scale-98"
                >
                  {notification.cta}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
