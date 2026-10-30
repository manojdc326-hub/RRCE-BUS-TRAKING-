import React, { useState } from 'react';
import { useBus } from '../../context/BusContext';
import { CCTVFeedPlayer } from './CCTVFeedPlayer';
import { CCTVCamera } from '../../types';
import { 
  Camera, 
  LayoutGrid, 
  Square, 
  ShieldCheck, 
  AlertTriangle, 
  Radio, 
  Bus, 
  Eye, 
  Lock, 
  Scan, 
  Sparkles,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';

export const LiveCCTVScreen: React.FC = () => {
  const { 
    cctvCameras, 
    activeCameraId, 
    setActiveCameraId, 
    activeCamera,
    cctvLayout, 
    setCctvLayout,
    passengerCount,
    maxCapacity,
    selectedRoute,
    tripStarted,
    addNotification,
  } = useBus();

  const [sosModalOpen, setSosModalOpen] = useState<boolean>(false);
  const [sosSuccessToast, setSosSuccessToast] = useState<string | null>(null);

  const handleSosReport = (reason: string) => {
    addNotification(
      'CCTV Safety Alert Raised',
      `Student flagged incident from ${activeCamera.name}: "${reason}". Driver and Campus Security notified.`,
      'alert'
    );
    setSosModalOpen(false);
    setSosSuccessToast(`Incident logged & security team notified.`);
    setTimeout(() => setSosSuccessToast(null), 3500);
  };

  return (
    <div className="p-4 sm:p-5 max-w-4xl mx-auto space-y-5 pb-28">
      {/* Toast Alert */}
      {sosSuccessToast && (
        <div className="fixed top-16 inset-x-4 max-w-md mx-auto z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs sm:text-sm font-semibold">{sosSuccessToast}</p>
        </div>
      )}

      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight">
              Live CCTV Access
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
              LIVE FEED
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium mt-0.5">
            Real-time passenger safety and road surveillance feeds
          </p>
        </div>

        {/* View Layout Controls (Single vs Quad Matrix) */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setCctvLayout('single')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                cctvLayout === 'single'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Square className="w-3.5 h-3.5" />
              <span>Single</span>
            </button>
            <button
              onClick={() => setCctvLayout('quad')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                cctvLayout === 'quad'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Quad 4x</span>
            </button>
          </div>

          {/* SOS Safety Button */}
          <button
            onClick={() => setSosModalOpen(true)}
            className="px-3 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Report Incident</span>
          </button>
        </div>
      </div>

      {/* Camera Selection Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {cctvCameras.map((cam) => {
          const isSelected = cam.id === activeCameraId;
          return (
            <button
              key={cam.id}
              onClick={() => {
                setActiveCameraId(cam.id);
                if (cctvLayout === 'quad') setCctvLayout('single');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 border ${
                isSelected && cctvLayout === 'single'
                  ? 'bg-[#1769AA] text-white border-[#1769AA] shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{cam.name}</span>
              {cam.busNumber && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isSelected && cctvLayout === 'single' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {cam.busNumber}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Video Presentation */}
      {cctvLayout === 'single' ? (
        <div className="space-y-4">
          <CCTVFeedPlayer 
            camera={activeCamera} 
            isCompact={false} 
            onMaximize={() => setCctvLayout('quad')}
          />

          {/* Camera Telemetry & Info Details */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-slate-400 text-[10px] font-bold uppercase">Feed Location</p>
              <p className="font-bold text-slate-900 mt-0.5 truncate">{activeCamera.name}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-slate-400 text-[10px] font-bold uppercase">Stream Security</p>
              <p className="font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                TLS 256-bit Encrypted
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-slate-400 text-[10px] font-bold uppercase">Hardware Sensor</p>
              <p className="font-bold text-slate-900 mt-0.5">Sony Starvis 1080p</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-slate-400 text-[10px] font-bold uppercase">Recording Status</p>
              <p className="font-bold text-rose-600 mt-0.5 flex items-center gap-1">
                <Radio className="w-3 h-3 animate-pulse" />
                Continuous 24/7
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Quad Matrix (4 cameras grid) */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cctvCameras.slice(0, 4).map((cam) => (
            <div 
              key={cam.id} 
              onClick={() => {
                setActiveCameraId(cam.id);
                setCctvLayout('single');
              }}
              className="cursor-pointer transition-transform hover:scale-[1.01]"
            >
              <CCTVFeedPlayer 
                camera={cam} 
                isCompact={true}
                showControls={false}
              />
              <div className="flex items-center justify-between text-xs py-1.5 px-2 bg-white rounded-b-xl border border-t-0 border-slate-200">
                <span className="font-bold text-slate-800 truncate">{cam.name}</span>
                <span className="text-[10px] text-[#1769AA] font-bold hover:underline">Tap to Expand</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Safety Policy & Campus Notice */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-[#1769AA] shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs text-blue-950 space-y-1">
          <h4 className="font-bold text-sm text-[#1769AA]">Campus Safety & Privacy Compliance</h4>
          <p className="text-blue-900/80 leading-relaxed">
            All campus bus CCTV streams are monitored 24/7 by the College Security Cell under National Campus Transit Guidelines. Footage is retained for 30 days for student welfare and dispute prevention.
          </p>
          <div className="flex items-center gap-4 pt-1 font-semibold text-blue-900">
            <span>Security Helpline: 1800-CAMPUS-SAFE</span>
            <span>•</span>
            <span>Driver Intercom: Active</span>
          </div>
        </div>
      </div>

      {/* Incident / SOS Modal */}
      {sosModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Report CCTV Incident</h3>
                <p className="text-xs text-slate-500">Flag an observation directly to Driver & Campus Safety</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold text-slate-700">Choose reason:</p>
              {[
                'Overcrowding / Standing Hazard',
                'Unattended Baggage / Lost Item',
                'Medical Assistance Needed',
                'Suspicious Activity / Harassment',
                'Door Not Closing Securely',
              ].map((reason) => (
                <button
                  key={reason}
                  onClick={() => handleSosReport(reason)}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-rose-400 hover:bg-rose-50/50 text-xs font-semibold text-slate-800 transition cursor-pointer flex items-center justify-between"
                >
                  <span>{reason}</span>
                  <span className="text-rose-600 font-bold text-xs">Flag →</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setSosModalOpen(false)}
              className="w-full py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
