import React, { useState } from 'react';
import { useBus } from '../../context/BusContext';
import { 
  Bus, 
  MapPin, 
  Users, 
  Gauge, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Navigation2,
  Sparkles,
  Camera,
  Eye,
  ShieldCheck
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    selectedRoute,
    setActiveStudentTab,
    selectedUserStopId,
    setSelectedUserStopId,
    crowdLevel,
    tripStarted,
    currentSpeedKmh,
    currentStopIndex,
    etaToUserStopMinutes,
  } = useBus();

  const [isChangingStop, setIsChangingStop] = useState<boolean>(false);

  // Dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning 👋';
    if (hour < 17) return 'Good Afternoon 👋';
    return 'Good Evening 👋';
  };

  const userStop = selectedRoute.stops.find((s) => s.id === selectedUserStopId) || selectedRoute.stops[2] || selectedRoute.stops[0];

  return (
    <div className="p-4 sm:p-5 max-w-2xl mx-auto space-y-6 pb-24">
      {/* Header Greeting */}
      <div>
        <p className="text-slate-500 font-medium text-[15px] sm:text-base">
          {getGreeting()}
        </p>
        <h1 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight mt-0.5">
          Where is my bus?
        </h1>
      </div>

      {/* Main Bus Status Card with Gradient */}
      <div className="bg-gradient-to-br from-[#1769AA] to-[#2388D9] rounded-[25px] p-5 sm:p-6 text-white shadow-xl shadow-blue-800/25 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-12 bottom-0 w-32 h-32 bg-sky-300/10 rounded-full blur-xl pointer-events-none" />

        {/* Top Header Row */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-md">
              <Bus className="w-6 h-6 text-[#1769AA]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight">
                  {selectedRoute.busNumber}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/20">
                  {selectedRoute.routeTitle}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
            <span className={`w-2.5 h-2.5 rounded-full ${tripStarted ? 'bg-emerald-400 animate-pulse' : 'bg-amber-300'}`} />
            <span className="text-xs font-bold tracking-wider">
              {tripStarted ? 'LIVE' : 'STANDBY'}
            </span>
          </div>
        </div>

        {/* ETA Section */}
        <div className="mt-6 relative z-10">
          <p className="text-white/80 text-sm font-medium">
            Arriving at <span className="font-bold underline decoration-sky-300/60">{userStop.name}</span> in
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl sm:text-[42px] font-black tracking-tight drop-shadow-sm">
              {tripStarted ? `${etaToUserStopMinutes} minutes` : 'Not in service'}
            </span>
          </div>
        </div>

        {/* Quick Status Boxes */}
        <div className="grid grid-cols-2 gap-3 mt-5 relative z-10">
          {/* Crowd Status Box */}
          <div className="bg-white/15 backdrop-blur-md rounded-[15px] p-3 border border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/70 text-[11px] font-medium leading-none">Crowd</p>
              <p className="text-white font-bold text-sm mt-1">{crowdLevel}</p>
            </div>
          </div>

          {/* Status Box */}
          <div className="bg-white/15 backdrop-blur-md rounded-[15px] p-3 border border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Gauge className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/70 text-[11px] font-medium leading-none">Status</p>
              <p className="text-white font-bold text-sm mt-1">
                {tripStarted ? `${currentSpeedKmh} km/h • ON TIME` : 'PARKED'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-2 gap-2 mt-5 relative z-10">
          <button
            onClick={() => setActiveStudentTab('live')}
            className="py-3.5 bg-white hover:bg-slate-50 active:scale-[0.99] text-[#1769AA] font-bold rounded-[15px] shadow-md flex items-center justify-center gap-2 transition cursor-pointer text-sm"
          >
            <Navigation2 className="w-4 h-4 fill-[#1769AA]" />
            <span>TRACK BUS</span>
          </button>
          <button
            onClick={() => setActiveStudentTab('cctv')}
            className="py-3.5 bg-white/20 hover:bg-white/30 active:scale-[0.99] text-white font-bold rounded-[15px] border border-white/30 backdrop-blur-md shadow-md flex items-center justify-center gap-2 transition cursor-pointer text-sm"
          >
            <Camera className="w-4 h-4" />
            <span>LIVE CCTV</span>
          </button>
        </div>
      </div>

      {/* Live CCTV Access Banner */}
      <div 
        onClick={() => setActiveStudentTab('cctv')}
        className="bg-white rounded-[20px] p-4 border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md relative">
            <Camera className="w-5 h-5 text-emerald-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Live Bus CCTV Feeds
              </h3>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                Active
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">
              Check {selectedRoute.busNumber} cabin crowd & road view in real-time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[#1769AA] text-xs font-bold group-hover:translate-x-0.5 transition-transform">
          <span>View</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* Your Stop Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-[19px] font-bold text-slate-900">
            Your Stop
          </h2>
          <button
            onClick={() => setIsChangingStop(!isChangingStop)}
            className="text-xs font-semibold text-[#1769AA] hover:underline cursor-pointer"
          >
            {isChangingStop ? 'Close selection' : 'Change stop'}
          </button>
        </div>

        {isChangingStop && (
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3 mb-2 space-y-1.5 transition-all">
            <p className="text-xs font-semibold text-blue-900 mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Select your pickup or dropoff point:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedRoute.stops.map((stop) => (
                <button
                  key={stop.id}
                  onClick={() => {
                    setSelectedUserStopId(stop.id);
                    setIsChangingStop(false);
                  }}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-medium border transition flex items-center justify-between ${
                    stop.id === selectedUserStopId
                      ? 'bg-[#1769AA] text-white border-[#1769AA]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{stop.stopNumber}. {stop.name}</span>
                  {stop.id === selectedUserStopId && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* InfoCard for Stop */}
        <div className="bg-white rounded-[18px] p-4 flex items-center gap-4 shadow-sm border border-slate-100 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-full bg-[#E7F1FA] flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6 text-[#1769AA]" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 text-base">
              {userStop.name}
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              Your designated stop on {selectedRoute.busNumber}
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {tripStarted ? `ETA ${etaToUserStopMinutes} min` : 'Scheduled'}
          </span>
        </div>
      </div>

      {/* Upcoming Stops List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-[19px] font-bold text-slate-900">
            Upcoming Stops
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            {selectedRoute.stops.length} stops on line
          </span>
        </div>

        <div className="bg-white rounded-[20px] p-2 shadow-sm border border-slate-100 divide-y divide-slate-100">
          {selectedRoute.stops.map((stop, index) => {
            const isPassed = index < currentStopIndex;
            const isCurrent = index === currentStopIndex;
            const isSelectedUser = stop.id === selectedUserStopId;

            // Calculate dynamic arrival time
            const diffFromCurrent = index - currentStopIndex;
            const estMinutes = diffFromCurrent > 0 
              ? diffFromCurrent * 4 + 2 
              : isCurrent 
              ? 'Arriving now' 
              : 'Passed';

            return (
              <div
                key={stop.id}
                onClick={() => setSelectedUserStopId(stop.id)}
                className={`p-3 sm:p-3.5 flex items-center justify-between rounded-xl transition cursor-pointer ${
                  isSelectedUser ? 'bg-blue-50/50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition ${
                      isPassed
                        ? 'bg-emerald-100 text-emerald-700'
                        : isCurrent
                        ? 'bg-[#1769AA] text-white animate-pulse'
                        : isSelectedUser
                        ? 'bg-[#1769AA] text-white'
                        : 'bg-[#E7F1FA] text-[#1769AA]'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-4 h-4" /> : stop.stopNumber}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${isSelectedUser ? 'text-[#1769AA]' : 'text-slate-800'}`}>
                        {stop.name}
                      </span>
                      {isSelectedUser && (
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {isCurrent ? 'Next immediate stop' : isPassed ? 'Departed' : `Stop #${stop.stopNumber}`}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-sm font-bold ${
                      isPassed
                        ? 'text-slate-400 line-through'
                        : isCurrent
                        ? 'text-blue-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    {typeof estMinutes === 'number' ? `${estMinutes} min` : estMinutes}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
