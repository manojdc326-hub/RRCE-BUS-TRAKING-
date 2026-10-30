import React, { useState } from 'react';
import { useBus } from '../../context/BusContext';
import { CCTVFeedPlayer } from '../cctv/CCTVFeedPlayer';
import { 
  User, 
  Bus, 
  MapPin, 
  Route as RouteIcon, 
  Users, 
  Navigation, 
  Play, 
  Square, 
  Plus, 
  Minus, 
  AlertTriangle, 
  Radio, 
  ShieldCheck, 
  CheckCircle2, 
  Gauge, 
  RotateCcw,
  Camera,
  Maximize2
} from 'lucide-react';

export const DriverHome: React.FC = () => {
  const {
    selectedRoute,
    cctvCameras,
    tripStarted,
    toggleTrip,
    passengerCount,
    updatePassengers,
    maxCapacity,
    crowdLevel,
    currentSpeedKmh,
    busProgress,
    setBusProgress,
    nextStopName,
    currentStopIndex,
    addNotification,
  } = useBus();

  const [snackBarMessage, setSnackBarMessage] = useState<string | null>(null);
  const [driverCameraId, setDriverCameraId] = useState<string>('cam-b1-cabin');
  const [isDriverCctvExpanded, setIsDriverCctvExpanded] = useState<boolean>(true);

  const showToast = (msg: string) => {
    setSnackBarMessage(msg);
    setTimeout(() => setSnackBarMessage(null), 3000);
  };

  const handleTripToggle = () => {
    const nextState = !tripStarted;
    toggleTrip(nextState);
    showToast(
      nextState
        ? 'Trip started. GPS is now active and broadcasting to students.'
        : 'Trip stopped. GPS broadcast terminated.'
    );
  };

  const handleBroadcastDelay = (minutes: number) => {
    addNotification(
      'Traffic Advisory from Driver',
      `${selectedRoute.busNumber} is moving slowly due to campus rush. Estimated +${minutes} min delay.`,
      'delay'
    );
    showToast(`Delay alert of +${minutes} min broadcasted to students.`);
  };

  return (
    <div className="p-4 sm:p-5 max-w-xl mx-auto space-y-5 pb-20">
      {/* Toast Notification */}
      {snackBarMessage && (
        <div className="fixed top-16 inset-x-4 max-w-md mx-auto z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs sm:text-sm font-semibold">{snackBarMessage}</p>
        </div>
      )}

      {/* Driver Profile Card */}
      <div className="bg-white rounded-[25px] p-6 text-center shadow-md border border-slate-100 relative overflow-hidden">
        {tripStarted && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>BROADCASTING</span>
          </div>
        )}

        <div className="w-[90px] h-[90px] mx-auto rounded-full bg-[#1769AA] flex items-center justify-center text-white shadow-lg shadow-blue-800/20 mb-4 ring-4 ring-blue-50">
          <User className="w-[50px] h-[50px]" />
        </div>

        <h2 className="text-[23px] font-extrabold text-slate-900 tracking-tight">
          Rajesh Kumar
        </h2>
        <p className="text-slate-400 font-bold text-sm mt-0.5 uppercase tracking-wide">
          {selectedRoute.busNumber} • {selectedRoute.plateNumber}
        </p>

        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
            Shift: 07:30 AM - 04:30 PM
          </span>
          <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-bold">
            Safety Score: 98%
          </span>
        </div>
      </div>

      {/* Info Cards matching Flutter InfoCard */}
      <div className="space-y-3">
        {/* Route InfoCard */}
        <div className="bg-white rounded-[18px] p-4 flex items-center gap-4 shadow-sm border border-slate-100">
          <div className="w-12 h-12 rounded-full bg-[#E7F1FA] flex items-center justify-center text-[#1769AA] shrink-0">
            <RouteIcon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-400 font-semibold uppercase">Current Route</p>
            <h3 className="font-extrabold text-slate-900 text-base mt-0.5">
              {selectedRoute.routeTitle}
            </h3>
          </div>
          <span className="text-xs bg-slate-100 px-2.5 py-1 rounded-lg font-bold text-slate-700">
            {selectedRoute.stops.length} Stops
          </span>
        </div>

        {/* Passengers InfoCard with Interactive Counter */}
        <div className="bg-white rounded-[18px] p-4 flex items-center justify-between shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#E7F1FA] flex items-center justify-center text-[#1769AA] shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Passengers</p>
              <h3 className="font-extrabold text-slate-900 text-base mt-0.5">
                {passengerCount} / {maxCapacity}
                <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${
                  crowdLevel === 'FULL'
                    ? 'bg-rose-100 text-rose-700'
                    : crowdLevel === 'HIGH'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {crowdLevel}
                </span>
              </h3>
            </div>
          </div>

          {/* Stepper Buttons for driver to update crowd in real-time */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => updatePassengers(-1)}
              disabled={passengerCount <= 0}
              className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-700 transition disabled:opacity-40 cursor-pointer shadow-sm"
              title="Minus passenger"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={() => updatePassengers(1)}
              disabled={passengerCount >= maxCapacity}
              className="w-8 h-8 rounded-lg bg-[#1769AA] hover:bg-[#13568c] active:scale-95 flex items-center justify-center text-white transition disabled:opacity-40 cursor-pointer shadow-sm"
              title="Add passenger"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* GPS InfoCard */}
        <div className="bg-white rounded-[18px] p-4 flex items-center justify-between shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#E7F1FA] flex items-center justify-center text-[#1769AA] shrink-0">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">GPS Status</p>
              <h3 className="font-extrabold text-slate-900 text-base mt-0.5 flex items-center gap-2">
                <span>{tripStarted ? 'LIVE' : 'Not started'}</span>
                {tripStarted && (
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {currentSpeedKmh} km/h • ±3m Acc
                  </span>
                )}
              </h3>
            </div>
          </div>

          <div className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
            <span className={`w-3.5 h-3.5 rounded-full ${tripStarted ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'}`} />
          </div>
        </div>
      </div>

      {/* Driver Controls & Quick Broadcasts */}
      <div className="bg-slate-100/80 rounded-2xl p-4 space-y-3 border border-slate-200/60">
        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
          Driver Actions & Passenger Alerts
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleBroadcastDelay(5)}
            className="p-3 bg-white hover:bg-slate-50 text-slate-800 rounded-xl border border-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Traffic Alert (+5m)</span>
          </button>

          <button
            onClick={() => {
              addNotification('Bus Full Notice', `${selectedRoute.busNumber} has reached maximum capacity. Follower bus is 10 min behind.`, 'crowd');
              showToast('Notified students that bus is full.');
            }}
            className="p-3 bg-white hover:bg-slate-50 text-slate-800 rounded-xl border border-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Users className="w-3.5 h-3.5 text-rose-500" />
            <span>Notify: Bus Full</span>
          </button>
        </div>

        {/* Reset / Jump to Origin simulation helper */}
        <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
          <span>Current progress: {Math.round(busProgress * 100)}%</span>
          <button
            onClick={() => {
              setBusProgress(0);
              showToast('Bus returned to route starting point (Hostel).');
            }}
            className="flex items-center gap-1 text-[#1769AA] hover:underline font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Start</span>
          </button>
        </div>
      </div>

      {/* Driver CCTV Live Safety Monitor */}
      <div className="bg-white rounded-[22px] p-4 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Camera className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Driver CCTV Safety Monitor
              </h3>
              <p className="text-[11px] text-slate-400">
                Cabin & road live video feeds
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[11px] font-bold text-red-600">LIVE</span>
          </div>
        </div>

        {/* Camera Selector Pills for Driver */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'cam-b1-cabin', label: 'Cabin' },
            { id: 'cam-b1-dash', label: 'Dashcam' },
            { id: 'cam-b1-door', label: 'Step Door' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setDriverCameraId(c.id)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                driverCameraId === c.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Embedded CCTV Player */}
        {isDriverCctvExpanded && (
          <div className="pt-1">
            {cctvCameras.find((c) => c.id === driverCameraId) && (
              <CCTVFeedPlayer 
                camera={cctvCameras.find((c) => c.id === driverCameraId)!} 
                isCompact={true}
                showControls={true}
              />
            )}
          </div>
        )}
      </div>

      {/* Primary Trip Toggle Button matching Flutter ElevatedButton.icon */}
      <div>
        <button
          onClick={handleTripToggle}
          className={`w-full h-[58px] font-bold text-lg rounded-[18px] shadow-xl transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer ${
            tripStarted
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30 active:scale-[0.99]'
              : 'bg-[#1769AA] hover:bg-[#13568c] text-white shadow-blue-800/30 active:scale-[0.99]'
          }`}
        >
          {tripStarted ? (
            <>
              <Square className="w-5 h-5 fill-white" />
              <span>STOP TRIP</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-white" />
              <span>START TRIP</span>
            </>
          )}
        </button>
        <p className="text-center text-xs text-slate-400 mt-2">
          {tripStarted
            ? 'GPS location is being transmitted in real-time to student apps.'
            : 'Click START TRIP when departing from Hostel Complex.'}
        </p>
      </div>
    </div>
  );
};
