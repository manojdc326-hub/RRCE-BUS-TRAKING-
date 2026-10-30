import React, { useState } from 'react';
import { useBus } from '../../context/BusContext';
import { 
  Bell, 
  Bus, 
  MapPin, 
  Users, 
  AlertTriangle, 
  CheckCheck, 
  Trash2, 
  Clock,
  Sparkles
} from 'lucide-react';

export const NotificationsScreen: React.FC = () => {
  const { 
    notifications, 
    markAllNotificationsRead, 
    clearNotifications,
    addNotification,
    selectedRoute
  } = useBus();

  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter((n) => !n.read) 
    : notifications;

  const getIconForType = (type: string) => {
    switch (type) {
      case 'bus_started':
        return <Bus className="w-5 h-5 text-[#1769AA]" />;
      case 'approaching':
        return <MapPin className="w-5 h-5 text-[#1769AA]" />;
      case 'crowd':
        return <Users className="w-5 h-5 text-[#1769AA]" />;
      case 'delay':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      default:
        return <Bell className="w-5 h-5 text-[#1769AA]" />;
    }
  };

  const handleSimulateAlert = () => {
    addNotification(
      'Bus Arriving Soon',
      `${selectedRoute.busNumber} is within 3 minutes of your stop. Please proceed to the boarding area.`,
      'approaching'
    );
  };

  return (
    <div className="p-4 sm:p-5 max-w-2xl mx-auto space-y-5 pb-28">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight">
            Notifications
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-0.5">
            Real-time trip updates and campus transit alerts
          </p>
        </div>

        {unreadCount > 0 && (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#1769AA] text-white shadow-sm">
            {unreadCount} new
          </span>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'unread'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="px-2.5 py-1.5 text-xs font-semibold text-[#1769AA] hover:bg-blue-50 rounded-lg transition flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
              title="Clear all alerts"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notif) => (
          <div
            key={notif.id}
            className={`bg-white rounded-[18px] p-4 transition-all shadow-sm border ${
              !notif.read ? 'border-blue-200 bg-blue-50/20' : 'border-slate-100'
            } flex items-start gap-3.5`}
          >
            {/* Circle Avatar matching Flutter CircleAvatar */}
            <div className="w-11 h-11 rounded-full bg-[#E7F1FA] flex items-center justify-center shrink-0 mt-0.5">
              {getIconForType(notif.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                  {notif.title}
                </h4>
                <span className="text-[11px] font-medium text-slate-400 shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {notif.time}
                </span>
              </div>

              <p className="text-slate-500 text-xs sm:text-[13px] mt-1 leading-relaxed">
                {notif.message}
              </p>
            </div>

            {/* Unread indicator dot */}
            {!notif.read && (
              <span className="w-2 h-2 rounded-full bg-[#1769AA] shrink-0 mt-2" />
            )}
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 space-y-2">
            <Bell className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-medium">No alerts right now</p>
            <p className="text-xs text-slate-400">You're all caught up with your campus bus updates.</p>
          </div>
        )}
      </div>

      {/* Simulation Helper */}
      <div className="pt-2">
        <button
          onClick={handleSimulateAlert}
          className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#1769AA]" />
          <span>Simulate Arrival Notification</span>
        </button>
      </div>
    </div>
  );
};
