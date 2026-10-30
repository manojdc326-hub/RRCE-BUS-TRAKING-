import React, { useState, useEffect } from 'react';
import { useBus } from '../../context/BusContext';
import { CCTVCamera } from '../../types';
import { 
  Camera, 
  Eye, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Scan, 
  ShieldCheck, 
  Radio, 
  Zap, 
  Download,
  AlertCircle
} from 'lucide-react';

interface CCTVFeedPlayerProps {
  camera: CCTVCamera;
  isCompact?: boolean;
  onMaximize?: () => void;
  showControls?: boolean;
}

export const CCTVFeedPlayer: React.FC<CCTVFeedPlayerProps> = ({
  camera,
  isCompact = false,
  onMaximize,
  showControls = true,
}) => {
  const { 
    currentSpeedKmh, 
    passengerCount, 
    maxCapacity, 
    isNightVision, 
    setIsNightVision,
    showAIDetections,
    setShowAIDetections,
    tripStarted,
    selectedRoute,
    nextStopName,
  } = useBus();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [flashSnapshot, setFlashSnapshot] = useState<boolean>(false);
  const [snapshotToast, setSnapshotToast] = useState<string | null>(null);

  // High precision CCTV clock ticker
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const datePart = now.toISOString().slice(0, 10);
      const timePart = now.toTimeString().slice(0, 8);
      const ms = String(now.getMilliseconds()).padStart(3, '0');
      setCurrentTime(`${datePart} ${timePart}.${ms}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 60);
    return () => clearInterval(interval);
  }, []);

  const handleSnapshot = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFlashSnapshot(true);
    setSnapshotToast(`Snapshot saved: ${camera.name}_${Date.now()}.jpg`);
    setTimeout(() => setFlashSnapshot(false), 200);
    setTimeout(() => setSnapshotToast(null), 3500);
  };

  return (
    <div 
      className={`relative w-full rounded-2xl overflow-hidden bg-slate-950 font-mono select-none border border-slate-800 shadow-2xl group ${
        isCompact ? 'h-48' : 'h-[360px] sm:h-[420px]'
      }`}
    >
      {/* Flash Snapshot Animation */}
      {flashSnapshot && (
        <div className="absolute inset-0 bg-white z-50 pointer-events-none opacity-80 transition-opacity" />
      )}

      {/* Toast */}
      {snapshotToast && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 bg-black/90 text-emerald-400 text-xs px-3 py-1.5 rounded-full border border-emerald-500/40 backdrop-blur-md shadow-lg flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{snapshotToast}</span>
        </div>
      )}

      {/* Night Vision / IR Matrix Filter Layer */}
      {isNightVision && (
        <div className="absolute inset-0 pointer-events-none z-10 bg-emerald-950/40 mix-blend-color-dodge">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-emerald-950/20 to-black/60" />
        </div>
      )}

      {/* CCTV Scanlines & Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Animated Camera Stream Rendering (SVG / CSS Graphics) */}
      <div className={`w-full h-full relative ${isNightVision ? 'brightness-125 contrast-125 hue-rotate-[90deg]' : ''}`}>
        {camera.location === 'cabin' && (
          /* BUS PASSENGER CABIN VIEW */
          <div className="w-full h-full bg-[#181d24] relative overflow-hidden flex flex-col justify-end">
            {/* Bus Ceiling & Luggage Racks */}
            <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#0f141a] to-transparent z-0">
              <div className="flex justify-between px-8 pt-3 opacity-40">
                <div className="w-32 h-2 bg-slate-600 rounded" />
                <div className="w-32 h-2 bg-slate-600 rounded" />
              </div>
              {/* Overhead AC lights */}
              <div className="flex justify-around pt-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400/80 shadow-[0_0_8px_#22d3ee]" />
                <span className="w-2 h-2 rounded-full bg-cyan-400/80 shadow-[0_0_8px_#22d3ee]" />
                <span className="w-2 h-2 rounded-full bg-cyan-400/80 shadow-[0_0_8px_#22d3ee]" />
              </div>
            </div>

            {/* Bus Windows on both sides with moving outside scenery */}
            <div className="absolute inset-y-12 left-2 w-14 rounded-lg bg-sky-950/40 border border-slate-700/50 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-b from-sky-400/20 to-emerald-600/10 animate-pulse" />
            </div>
            <div className="absolute inset-y-12 right-2 w-14 rounded-lg bg-sky-950/40 border border-slate-700/50 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-b from-sky-400/20 to-emerald-600/10 animate-pulse" />
            </div>

            {/* Central Aisle and Passenger Seats Grid */}
            <div className="relative z-0 h-64 max-w-sm mx-auto w-full px-6 flex justify-between items-end pb-8">
              {/* Left Row Seats */}
              <div className="space-y-4">
                {[1, 2, 3].map((seatNum) => {
                  const isOccupied = seatNum * 6 <= passengerCount;
                  return (
                    <div key={seatNum} className="relative w-16 h-12 bg-blue-950/70 border border-blue-800/60 rounded-t-xl flex items-center justify-center">
                      <span className="text-[9px] text-blue-300 font-bold opacity-60">S-0{seatNum}</span>
                      {isOccupied && (
                        <div className="absolute -top-4 w-9 h-9 rounded-full bg-slate-700/90 border border-slate-500 flex items-center justify-center shadow-lg">
                          <span className="w-5 h-5 rounded-full bg-slate-800" />
                        </div>
                      )}
                      {/* AI Bounding Box */}
                      {showAIDetections && (
                        <div className={`absolute -inset-1 border border-dashed rounded-lg pointer-events-none flex items-start justify-end p-0.5 ${
                          isOccupied ? 'border-emerald-500/80' : 'border-slate-600/50'
                        }`}>
                          <span className="text-[7px] text-emerald-400 bg-black/70 px-1 rounded">
                            {isOccupied ? 'PERSON' : 'EMPTY'}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Aisle Walking Path */}
              <div className="w-12 h-48 border-x border-slate-700/40 flex flex-col justify-around items-center">
                <span className="w-4 h-1 bg-yellow-500/40 rounded-full" />
                <span className="w-4 h-1 bg-yellow-500/40 rounded-full" />
                <span className="w-4 h-1 bg-yellow-500/40 rounded-full" />
              </div>

              {/* Right Row Seats */}
              <div className="space-y-4">
                {[4, 5, 6].map((seatNum) => {
                  const isOccupied = seatNum * 5 <= passengerCount;
                  return (
                    <div key={seatNum} className="relative w-16 h-12 bg-blue-950/70 border border-blue-800/60 rounded-t-xl flex items-center justify-center">
                      <span className="text-[9px] text-blue-300 font-bold opacity-60">S-0{seatNum}</span>
                      {isOccupied && (
                        <div className="absolute -top-4 w-9 h-9 rounded-full bg-slate-700/90 border border-slate-500 flex items-center justify-center shadow-lg">
                          <span className="w-5 h-5 rounded-full bg-slate-800" />
                        </div>
                      )}
                      {/* AI Bounding Box */}
                      {showAIDetections && (
                        <div className={`absolute -inset-1 border border-dashed rounded-lg pointer-events-none flex items-start justify-end p-0.5 ${
                          isOccupied ? 'border-emerald-500/80' : 'border-slate-600/50'
                        }`}>
                          <span className="text-[7px] text-emerald-400 bg-black/70 px-1 rounded">
                            {isOccupied ? 'PERSON' : 'EMPTY'}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cabin HUD Overlay */}
            <div className="absolute bottom-2 left-4 z-20 flex items-center gap-3 text-[10px] text-slate-400">
              <span className="text-cyan-400">AC: 22.0°C</span>
              <span>OCCUPANCY: <strong className="text-white">{passengerCount}/{maxCapacity}</strong></span>
              <span className="text-emerald-400">SMOKE DETECTOR: OK</span>
            </div>
          </div>
        )}

        {camera.location === 'dashcam' && (
          /* ROAD DASHCAM VIEW */
          <div className="w-full h-full bg-[#1c2430] relative overflow-hidden">
            {/* Horizon & Sky */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#111822] to-[#253346]" />

            {/* Campus Background Silhouette */}
            <div className="absolute inset-x-0 top-1/3 flex justify-between px-6 opacity-30">
              <div className="w-20 h-16 bg-slate-600 rounded-t-md" />
              <div className="w-28 h-20 bg-slate-500 rounded-t-lg" />
              <div className="w-16 h-14 bg-slate-600 rounded-t-md" />
            </div>

            {/* Road Perspective Surface */}
            <div 
              className="absolute inset-x-0 bottom-0 h-3/5 bg-[#171a21]"
              style={{
                clipPath: 'polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)',
              }}
            >
              {/* Moving road center dashed line */}
              <div className="w-2 h-full mx-auto border-r-4 border-dashed border-yellow-400/70 animate-pulse" />
            </div>

            {/* Roadside Trees & Curbs */}
            <div className="absolute bottom-0 left-0 w-1/4 h-3/5 bg-gradient-to-t from-emerald-950/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-1/4 h-3/5 bg-gradient-to-t from-emerald-950/40 to-transparent pointer-events-none" />

            {/* Windshield Wipers Silhouette Watermark */}
            <div className="absolute bottom-0 inset-x-0 h-8 bg-black/80 rounded-t-3xl" />

            {/* Dashcam AI Vehicle & Road Detection HUD */}
            {showAIDetections && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* Lane Guide Lines */}
                <svg className="w-full h-full opacity-60">
                  <line x1="38%" y1="45%" x2="10%" y2="95%" stroke="#0284c7" strokeWidth="2" strokeDasharray="6 4" />
                  <line x1="62%" y1="45%" x2="90%" y2="95%" stroke="#0284c7" strokeWidth="2" strokeDasharray="6 4" />
                </svg>

                {/* Road Ahead Tag */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-emerald-500/80 px-4 py-2 rounded text-[10px] text-emerald-400 bg-black/50">
                  CLEAR PATH • NEXT: {nextStopName}
                </div>
              </div>
            )}

            {/* Telemetry HUD */}
            <div className="absolute bottom-3 left-4 z-20 flex items-center gap-4 text-[10px] text-slate-300">
              <span className="text-emerald-400 font-bold text-xs">{currentSpeedKmh} KM/H</span>
              <span>28.545°N 77.192°E</span>
              <span className="text-yellow-400">HD DASHCAM</span>
            </div>
          </div>
        )}

        {camera.location === 'door' && (
          /* REAR / PASSENGER BOARDING DOOR VIEW */
          <div className="w-full h-full bg-[#1a1f26] relative overflow-hidden flex flex-col justify-end p-6">
            {/* Door Frame */}
            <div className="absolute inset-x-8 inset-y-6 border-2 border-slate-700/60 rounded-xl bg-slate-900/60 flex flex-col justify-between p-4">
              <div className="flex justify-between items-center text-[10px] text-slate-400">
                <span>DOOR SENSOR: ACTIVE</span>
                <span className="text-emerald-400 font-bold">LATCHED</span>
              </div>

              {/* Rubber Safety Edge & Step Lines */}
              <div className="space-y-2">
                <div className="w-full h-4 bg-yellow-500/60 rounded flex items-center justify-center text-[9px] font-bold text-black">
                  CAUTION: WATCH YOUR STEP
                </div>
                <div className="w-full h-8 bg-slate-800 rounded border border-slate-700 flex items-center justify-center text-xs text-slate-400">
                  Boarding Footwell Cleared
                </div>
              </div>
            </div>

            {/* Door Safety Status Overlay */}
            <div className="relative z-20 flex items-center justify-between text-[10px] text-slate-400">
              <span className="text-emerald-400 font-bold">DOOR: CLOSED (AUTO-LOCK)</span>
              <span>OBSTRUCTION: NONE</span>
            </div>
          </div>
        )}

        {camera.location === 'campus_gate' && (
          /* CAMPUS MAIN GATE CCTV */
          <div className="w-full h-full bg-[#1b232c] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
            
            {/* Gate Archway */}
            <div className="absolute top-12 inset-x-12 h-20 border-t-4 border-x-4 border-slate-600/60 rounded-t-2xl flex items-center justify-center">
              <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">
                CAMPUS NORTH MAIN GATE
              </span>
            </div>

            {/* Boom Barrier */}
            <div className="absolute top-36 inset-x-16 h-3 bg-red-600 border border-white flex justify-around">
              <span className="w-4 h-full bg-white" />
              <span className="w-4 h-full bg-white" />
              <span className="w-4 h-full bg-white" />
            </div>

            {/* Security Guard Cabin */}
            <div className="absolute bottom-6 right-8 w-24 h-28 bg-slate-800/90 border border-slate-600 rounded-lg p-2 text-[9px] text-slate-300">
              <p className="font-bold text-yellow-400">BOOTH #01</p>
              <p className="text-[8px] text-slate-400 mt-1">Guard On Duty</p>
              <p className="text-emerald-400 mt-2">ANPR: KA-04</p>
            </div>

            {/* AI License Plate OCR / Gate HUD */}
            {showAIDetections && (
              <div className="absolute top-24 left-16 border border-cyan-400 bg-cyan-950/40 p-1.5 rounded text-[9px] text-cyan-300">
                DETECTED: BUS 01 APPROACHING (KA-04-CB-1024)
              </div>
            )}
          </div>
        )}
      </div>

      {/* Top CCTV Info Bar (REC, Timestamp, Camera Name) */}
      <div className="absolute top-3 inset-x-3 z-30 flex items-center justify-between text-[11px] text-white">
        {/* Live Recording Badge */}
        <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
          </span>
          <span className="font-bold tracking-wider text-red-500">LIVE</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300 font-semibold truncate max-w-[140px] sm:max-w-none">
            {camera.name}
          </span>
        </div>

        {/* Real-time Precision Clock */}
        <div className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-emerald-400 font-bold tracking-wider text-[10px] sm:text-[11px]">
          {currentTime || '2026-10-15 13:17:42.108'}
        </div>
      </div>

      {/* Camera Specs Tag (Top-right below time or bottom) */}
      <div className="absolute top-12 right-3 z-30 hidden sm:flex items-center gap-2 bg-black/60 px-2 py-0.5 rounded text-[9px] text-slate-400 border border-slate-800">
        <span>{camera.resolution}</span>
        <span>•</span>
        <span>{camera.fps} FPS</span>
        <span>•</span>
        <span className="text-emerald-400">3.8 Mbps</span>
      </div>

      {/* Interactive Controls Overlay Bar (Bottom) */}
      {showControls && (
        <div className="absolute bottom-3 inset-x-3 z-30 flex items-center justify-between pointer-events-auto">
          {/* Left quick toggles */}
          <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md p-1 rounded-xl border border-white/10">
            {/* Night Vision Toggle */}
            <button
              onClick={() => setIsNightVision(!isNightVision)}
              className={`p-1.5 rounded-lg text-xs transition cursor-pointer flex items-center gap-1 ${
                isNightVision
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
              title="Toggle Night Vision / Infrared Mode"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline">IR Mode</span>
            </button>

            {/* AI Detection Toggle */}
            <button
              onClick={() => setShowAIDetections(!showAIDetections)}
              className={`p-1.5 rounded-lg text-xs transition cursor-pointer flex items-center gap-1 ${
                showAIDetections
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
              title="Toggle AI Crowd & Object Detection"
            >
              <Scan className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline">AI Vision</span>
            </button>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md p-1 rounded-xl border border-white/10">
            {/* Snapshot */}
            <button
              onClick={handleSnapshot}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
              title="Capture CCTV Snapshot"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>

            {/* Audio Toggle */}
            {camera.hasAudio && (
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
              </button>
            )}

            {/* Maximize */}
            {onMaximize && (
              <button
                onClick={onMaximize}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
                title="Fullscreen / Single Focus"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
