import React from 'react';
import { useBus } from '../../context/BusContext';
import { Wifi, Battery, Signal } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const { displayMode } = useBus();

  if (displayMode === 'desktop') {
    return <div className="w-full min-h-[calc(100vh-65px)]">{children}</div>;
  }

  // Current digital clock for mobile status bar
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="py-6 px-4 flex justify-center items-center min-h-[calc(100vh-65px)]">
      <div className="relative w-full max-w-[400px] h-[820px] bg-slate-900 rounded-[50px] p-3 shadow-2xl shadow-blue-950/30 border-4 border-slate-800 ring-1 ring-slate-700/50 flex flex-col overflow-hidden">
        {/* Dynamic Island / Speaker Pill */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 mr-3" />
          <div className="w-2.5 h-2.5 rounded-full bg-blue-900/40" />
        </div>

        {/* Mobile Screen Shell */}
        <div className="relative w-full h-full bg-[#F5F7FA] rounded-[38px] overflow-hidden flex flex-col">
          {/* iOS / Android Status Bar */}
          <div className="h-10 pt-2 px-6 flex items-center justify-between text-[11px] font-bold text-slate-700 select-none shrink-0 z-30">
            <span>{timeString}</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Inner Content Area */}
          <div className="flex-1 overflow-y-auto relative">
            {children}
          </div>

          {/* Home indicator bar */}
          <div className="h-4 bg-transparent flex items-center justify-center shrink-0 pb-1 z-30">
            <div className="w-32 h-1 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
