import React, { useState } from 'react';
import { useBus } from '../../context/BusContext';
import { CampusMapCanvas } from '../map/CampusMapCanvas';
import { 
  Bus, 
  MapPin, 
  Navigation, 
  Phone, 
  Share2, 
  Bell, 
  CheckCircle, 
  Users, 
  Info, 
  ChevronUp, 
  ChevronDown,
  Clock,
  ShieldCheck,
  Flame,
  Camera
} from 'lucide-react';

export const LiveBusScreen: React.FC = () => {
  const {
    selectedRoute,
    routes,
    setSelectedRouteId,
    setActiveStudentTab,
    busProgress,
    nextStopName,
    etaToUserStopMinutes,
    crowdLevel,
    currentSpeedKmh,
    tripStarted,
    addNotification,
  } = useBus();

  const [expandedDetails, setExpandedDetails] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [subscribedAlert, setSubscribedAlert] = useState<boolean>(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Track my college bus (${selectedRoute.busNumber}) arriving at ${nextStopName} in ~${etaToUserStopMinutes} min: ${window.location.href}`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleNotifyToggle = () => {
    const nextState = !subscribedAlert;
    setSubscribedAlert(nextState);
    if (nextState) {
      addNotification('Arrival Alert Set', `We will notify you 3 minutes before ${selectedRoute.busNumber} reaches your stop.`, 'approaching');
    }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4 sm:p-5 space-y-4 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight">
            Live Bus
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-0.5">
            {selectedRoute.busNumber} • Live location
          </p>
        </div>

        {/* Bus switcher dropdown/chips */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          {routes.slice(0, 3).map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRouteId(r.id)}
              className={`px-2.5 py-1 text-xs font-bold rounded-xl transition cursor-pointer ${
                r.id === selectedRoute.id
                  ? 'bg-[#1769AA] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r.busNumber.replace('BUS ', 'B')}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Map View */}
      <div className="relative rounded-[25px] overflow-hidden shadow-lg border border-slate-200/80">
        <CampusMapCanvas interactive={true} />

        {/* Floating Trip Status Pill & CCTV Quick Button */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md backdrop-blur-md border flex items-center gap-2 ${
            tripStarted 
              ? 'bg-white/95 text-emerald-700 border-emerald-200' 
              : 'bg-white/95 text-slate-700 border-slate-200'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${tripStarted ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            {tripStarted ? `${currentSpeedKmh} km/h • Tracking Active` : 'Trip Paused'}
          </span>

          <button
            onClick={() => setActiveStudentTab('cctv')}
            className="px-2.5 py-1.5 rounded-full text-xs font-bold shadow-md backdrop-blur-md bg-slate-900/90 hover:bg-slate-900 text-white border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Bus CCTV</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          </button>
        </div>
      </div>

      {/* Floating Bottom Card - Replicating Flutter card styling with rich controls */}
      <div className="bg-white rounded-[22px] p-5 shadow-xl shadow-slate-200/60 border border-slate-100 transition-all">
        {/* Top summary row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E7F1FA] flex items-center justify-center text-[#1769AA] shadow-inner">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {selectedRoute.busNumber}
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                  {selectedRoute.plateNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {selectedRoute.routeTitle}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xl sm:text-2xl font-black text-[#1769AA]">
              {tripStarted ? `${etaToUserStopMinutes} min` : '--'}
            </div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              EST. ARRIVAL
            </span>
          </div>
        </div>

        {/* Progress Bar matching Flutter LinearProgressIndicator */}
        <div className="mt-4 space-y-1.5">
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/50">
            <div
              className="bg-gradient-to-r from-[#1769AA] to-[#2388D9] h-full rounded-full transition-all duration-300 relative"
              style={{ width: `${Math.min(100, Math.max(5, busProgress * 100))}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/60 rounded-full animate-pulse" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-1">
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-[#1769AA]" />
              <span>Next stop: <strong className="text-[#1769AA]">{nextStopName}</strong></span>
            </div>
            <span>{Math.round(busProgress * 100)}% route complete</span>
          </div>
        </div>

        {/* Quick telemetry tags */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-center">
          <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Crowd</p>
            <p className="text-xs font-bold text-slate-800 mt-0.5 flex items-center justify-center gap-1">
              <Users className="w-3 h-3 text-[#1769AA]" />
              {crowdLevel}
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Bus Type</p>
            <p className="text-xs font-bold text-slate-800 mt-0.5 truncate">
              AC Deluxe
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Schedule</p>
            <p className="text-xs font-bold text-emerald-600 mt-0.5">
              ON TIME
            </p>
          </div>
        </div>

        {/* Expandable Driver & Bus Info */}
        {expandedDetails && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 bg-slate-50/70 p-3.5 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1769AA] text-white flex items-center justify-center font-bold">
                  {selectedRoute.driverName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {selectedRoute.driverName}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Verified Driver • 4.9 ★ Rating
                  </p>
                </div>
              </div>

              <a
                href={`tel:${selectedRoute.driverPhone}`}
                className="p-2.5 bg-white hover:bg-slate-100 text-emerald-700 rounded-xl border border-slate-200 transition shadow-sm flex items-center gap-1.5 text-xs font-bold"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>
            </div>

            <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200/80 space-y-1">
              <p><strong>Vehicle Model:</strong> {selectedRoute.busType}</p>
              <p><strong>Total Trip Distance:</strong> {selectedRoute.totalDistanceKm} km</p>
              <p><strong>Campus Security Helpline:</strong> +91 1800 200 4545</p>
            </div>
          </div>
        )}

        {/* Action button row */}
        <div className="flex items-center gap-2 mt-4 pt-2">
          <button
            onClick={() => setExpandedDetails(!expandedDetails)}
            className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>{expandedDetails ? 'Hide Details' : 'Driver & Bus Info'}</span>
            {expandedDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleNotifyToggle}
            className={`py-2.5 px-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 border cursor-pointer ${
              subscribedAlert
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Get sound / ping alert when 3 minutes away"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{subscribedAlert ? 'Alert Set' : 'Alert Me'}</span>
          </button>

          <button
            onClick={() => setActiveStudentTab('cctv')}
            className="py-2.5 px-3 bg-[#1769AA]/10 hover:bg-[#1769AA]/20 text-[#1769AA] text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 border border-[#1769AA]/20 cursor-pointer"
            title="Watch Live Bus CCTV"
          >
            <Camera className="w-3.5 h-3.5 text-[#1769AA]" />
            <span>CCTV</span>
          </button>

          <button
            onClick={handleShare}
            className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer"
            title="Share Live Bus ETA"
          >
            {copiedLink ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
