import React from 'react';
import { useBus } from '../../context/BusContext';
import { StudentDashboard } from './StudentDashboard';
import { LiveBusScreen } from './LiveBusScreen';
import { RoutesScreen } from './RoutesScreen';
import { NotificationsScreen } from './NotificationsScreen';
import { LiveCCTVScreen } from '../cctv/LiveCCTVScreen';
import { 
  Home, 
  MapPin, 
  Route as RouteIcon, 
  Bell,
  Camera
} from 'lucide-react';

export const StudentHome: React.FC = () => {
  const { activeStudentTab, setActiveStudentTab, notifications } = useBus();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const renderActiveScreen = () => {
    switch (activeStudentTab) {
      case 'home':
        return <StudentDashboard />;
      case 'live':
        return <LiveBusScreen />;
      case 'cctv':
        return <LiveCCTVScreen />;
      case 'routes':
        return <RoutesScreen />;
      case 'alerts':
        return <NotificationsScreen />;
      default:
        return <StudentDashboard />;
    }
  };

  interface TabItem {
    id: 'home' | 'live' | 'cctv' | 'routes' | 'alerts';
    label: string;
    icon: typeof Home;
    badge?: number;
    isLiveBadge?: boolean;
  }

  const tabs: TabItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'live', label: 'Live Bus', icon: MapPin },
    { id: 'cctv', label: 'CCTV', icon: Camera, isLiveBadge: true },
    { id: 'routes', label: 'Routes', icon: RouteIcon },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: unreadCount },
  ];

  return (
    <div className="relative min-h-full flex flex-col justify-between">
      {/* Screen Body */}
      <div className="flex-1 overflow-y-auto">
        {renderActiveScreen()}
      </div>

      {/* Floating / Fixed Flutter Material 3 NavigationBar */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg pb-safe">
        <div className="max-w-md mx-auto flex items-center justify-around py-2 px-3">
          {tabs.map((tab) => {
            const isActive = activeStudentTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveStudentTab(tab.id)}
                className="flex flex-col items-center justify-center py-1 px-3 min-w-[64px] transition cursor-pointer group"
              >
                <div
                  className={`relative px-4 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                    isActive
                      ? 'bg-[#1769AA]/15 text-[#1769AA]'
                      : 'text-slate-500 group-hover:text-slate-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                  {tab.isLiveBadge ? (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                  ) : tab.badge && tab.badge > 0 ? (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {tab.badge}
                    </span>
                  ) : null}
                </div>
                <span
                  className={`text-[11px] font-semibold mt-1 transition ${
                    isActive ? 'text-[#1769AA] font-bold' : 'text-slate-500'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
