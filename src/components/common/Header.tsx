import React from 'react';
import { useBus } from '../../context/BusContext';
import { 
  Bus, 
  Smartphone, 
  Monitor, 
  LogOut, 
  UserCheck, 
  ShieldCheck, 
  Radio, 
  Sparkles,
  ArrowRightLeft,
  Camera
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    userRole, 
    setUserRole, 
    displayMode, 
    setDisplayMode, 
    tripStarted,
    selectedRoute,
    setActiveStudentTab,
  } = useBus();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 sm:px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#1769AA] flex items-center justify-center text-white shadow-sm shadow-blue-800/20">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 tracking-tight text-sm sm:text-base">
                NAMASTE CAMPUS BUS
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#1769AA] border border-blue-200">
                PROTOTYPE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Smart College Bus Tracking
            </p>
          </div>
        </div>

        {/* Center / Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Trip Status Mini Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
            <span className={`w-2 h-2 rounded-full ${tripStarted ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span>{selectedRoute.busNumber}: {tripStarted ? 'Live Tracking' : 'Standby'}</span>
          </div>

          {/* Quick CCTV Access Button for All */}
          <button
            onClick={() => {
              if (!userRole) setUserRole('student');
              setActiveStudentTab('cctv');
            }}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm bg-slate-900 text-white hover:bg-slate-800 border border-slate-700"
            title="Open Live CCTV Surveillance Feeds"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Live CCTV</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          </button>

          {/* Quick Role Switcher Button */}
          {userRole && (
            <button
              onClick={() => setUserRole(userRole === 'student' ? 'driver' : 'student')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm border ${
                userRole === 'student'
                  ? 'bg-blue-50 hover:bg-blue-100 text-[#1769AA] border-blue-200'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
              }`}
              title="Switch role instantly to test student & driver view synchronization"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Role:</span>
              <span className="capitalize">{userRole}</span>
            </button>
          )}

          {/* Device Frame View Toggle */}
          <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setDisplayMode('phone')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                displayMode === 'phone'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Mobile Flutter Phone Frame View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDisplayMode('desktop')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                displayMode === 'desktop'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Responsive Web View"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>

          {/* Logout / Switch Role */}
          {userRole && (
            <button
              onClick={() => setUserRole(null)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
              title="Sign Out / Back to Login"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
