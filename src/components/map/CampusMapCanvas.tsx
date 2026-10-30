import React, { useState } from 'react';
import { useBus } from '../../context/BusContext';
import { BusStop } from '../../types';
import { 
  Navigation, 
  MapPin, 
  Plus, 
  Minus, 
  Compass, 
  Play, 
  Pause, 
  FastForward,
  Layers,
  School,
  Building2,
  TreePine,
  Coffee,
  CheckCircle2
} from 'lucide-react';

interface CampusMapProps {
  interactive?: boolean;
  compact?: boolean;
  onStopSelect?: (stop: BusStop) => void;
}

export const CampusMapCanvas: React.FC<CampusMapProps> = ({ 
  interactive = true, 
  compact = false,
  onStopSelect
}) => {
  const { 
    selectedRoute, 
    busProgress, 
    tripStarted, 
    isSimulating, 
    setIsSimulating,
    simSpeed,
    setSimSpeed,
    selectedUserStopId,
    setSelectedUserStopId
  } = useBus();

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [mapStyle, setMapStyle] = useState<'standard' | 'satellite' | 'transit'>('standard');
  const [hoveredStop, setHoveredStop] = useState<BusStop | null>(null);

  const stops = selectedRoute.stops;

  // Calculate current bus position along route segments
  const calculateBusCoords = (progress: number): { x: number; y: number; angle: number } => {
    if (stops.length < 2) {
      const fallback = stops[0]?.coords || { x: 500, y: 300 };
      return { x: fallback.x, y: fallback.y, angle: 0 };
    }
    const numSegments = stops.length - 1;
    const scaledProgress = Math.max(0, Math.min(0.999, progress)) * numSegments;
    const segmentIndex = Math.floor(scaledProgress);
    const segmentFraction = scaledProgress - segmentIndex;

    const start = stops[segmentIndex].coords;
    const end = stops[segmentIndex + 1].coords;

    // Linear interpolation
    const x = start.x + (end.x - start.x) * segmentFraction;
    const y = start.y + (end.y - start.y) * segmentFraction;

    // Heading angle in degrees
    const angle = Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI);

    return { x, y, angle };
  };

  const busPos = calculateBusCoords(busProgress);

  // SVG Path for the bus route
  const routePathD = stops.reduce((acc, stop, i) => {
    if (i === 0) return `M ${stop.coords.x} ${stop.coords.y}`;
    // Smooth quadratic curve via midpoint
    const prev = stops[i - 1].coords;
    const midX = (prev.x + stop.coords.x) / 2;
    const midY = (prev.y + stop.coords.y) / 2;
    return `${acc} Q ${prev.x + 30} ${prev.y - 20}, ${stop.coords.x} ${stop.coords.y}`;
  }, '');

  return (
    <div className={`relative w-full ${compact ? 'h-64' : 'h-[380px] sm:h-[440px]'} bg-[#E6EFF8] overflow-hidden rounded-3xl select-none border border-slate-200/80 shadow-inner`}>
      {/* Map Controls */}
      {interactive && (
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-md border border-slate-200/60">
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.15))}
            className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-700 transition"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.15))}
            className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-700 transition"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="h-px bg-slate-200 my-0.5" />
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`p-1.5 rounded-xl transition ${isSimulating ? 'bg-[#1769AA]/10 text-[#1769AA]' : 'text-slate-400'}`}
            title={isSimulating ? 'Pause Bus' : 'Resume Bus'}
          >
            {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setSimSpeed(simSpeed === 1 ? 2 : simSpeed === 2 ? 4 : 1)}
            className="px-1.5 py-1 text-[10px] font-bold text-[#1769AA] hover:bg-slate-100 rounded-xl transition"
            title="Simulation Speed"
          >
            {simSpeed}x
          </button>
        </div>
      )}

      {/* Map Type & Compass Watermark */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-md shadow-sm border border-slate-200/60 text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Campus GPS Grid: 28.545° N, 77.192° E
        </span>
      </div>

      {/* SVG Canvas Map */}
      <div 
        className="w-full h-full transition-transform duration-300 ease-out origin-center"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <svg
          viewBox="0 0 1000 650"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Background Grids & Campus Zones */}
          <defs>
            <pattern id="campusGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D7E4F2" strokeWidth="1" opacity="0.6" />
            </pattern>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1769AA" />
              <stop offset="100%" stopColor="#2388D9" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#1769AA" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Base Campus Fill */}
          <rect width="1000" height="650" fill="#E8F1F8" />
          <rect width="1000" height="650" fill="url(#campusGrid)" />

          {/* Green Zones / Campus Gardens */}
          <path
            d="M 50 40 Q 180 30 220 120 T 150 250 Q 70 230 40 140 Z"
            fill="#D5EAD8"
            opacity="0.8"
          />
          <path
            d="M 640 60 Q 820 40 890 140 T 780 280 Q 670 240 630 140 Z"
            fill="#D5EAD8"
            opacity="0.8"
          />
          <path
            d="M 320 380 Q 450 340 500 450 T 360 550 Z"
            fill="#D5EAD8"
            opacity="0.7"
          />

          {/* Lake / Water Feature */}
          <ellipse cx="750" cy="480" rx="90" ry="55" fill="#C5DFF8" opacity="0.9" />
          <text x="750" y="485" textAnchor="middle" fill="#5F8CB2" fontSize="11" fontWeight="600">
            Lotus Lake
          </text>

          {/* Campus Buildings / Blocks */}
          {/* Hostel Complex */}
          <rect x="70" y="80" width="100" height="70" rx="8" fill="#D2DFEC" stroke="#B0C8DC" strokeWidth="1.5" />
          <text x="120" y="122" textAnchor="middle" fill="#3D5A73" fontSize="10" fontWeight="bold">Hostels A-D</text>

          {/* Sports Complex */}
          <rect x="300" y="80" width="120" height="80" rx="10" fill="#E1EBE2" stroke="#BDD4C1" strokeWidth="1.5" />
          <circle cx="360" cy="120" r="22" fill="none" stroke="#A7C7AD" strokeWidth="2" strokeDasharray="4 2" />
          <text x="360" y="124" textAnchor="middle" fill="#4B6E52" fontSize="10" fontWeight="bold">Sports Arena</text>

          {/* Main Academic Quad */}
          <rect x="520" y="110" width="130" height="90" rx="10" fill="#D7E1EE" stroke="#ADC0D7" strokeWidth="1.5" />
          <text x="585" y="155" textAnchor="middle" fill="#314B68" fontSize="10" fontWeight="bold">Central Admin</text>

          {/* Library & Research Hub */}
          <rect x="720" y="170" width="140" height="85" rx="12" fill="#D7E1EE" stroke="#ADC0D7" strokeWidth="1.5" />
          <text x="790" y="215" textAnchor="middle" fill="#314B68" fontSize="10" fontWeight="bold">Knowledge Center</text>

          {/* Engineering Block */}
          <rect x="740" y="320" width="130" height="80" rx="10" fill="#DCE5F2" stroke="#BACCDD" strokeWidth="1.5" />
          <text x="805" y="365" textAnchor="middle" fill="#33506E" fontSize="10" fontWeight="bold">Tech Wings 1-4</text>

          {/* College Main Gate Arch */}
          <rect x="530" y="350" width="100" height="40" rx="6" fill="#FCEADE" stroke="#E6BEA0" strokeWidth="1.5" />
          <text x="580" y="375" textAnchor="middle" fill="#8A5123" fontSize="11" fontWeight="bold">Main Gate</text>

          {/* Campus Roads (Grey Network) */}
          <path
            d="M 50 150 L 950 150 M 500 40 L 500 620 M 150 80 L 150 580 M 820 100 L 820 600 M 340 100 L 340 580"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 50 150 L 950 150 M 500 40 L 500 620 M 150 80 L 150 580 M 820 100 L 820 600 M 340 100 L 340 580"
            fill="none"
            stroke="#CBDCEB"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Road center dashes */}
          <path
            d="M 50 150 L 950 150 M 500 40 L 500 620 M 150 80 L 150 580 M 820 100 L 820 600 M 340 100 L 340 580"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeDasharray="8 8"
          />

          {/* Active Bus Route (Vibrant Blue Highway) */}
          <path
            d={routePathD}
            fill="none"
            stroke="#90CAF9"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          />
          <path
            d={routePathD}
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="6 4"
            filter="url(#glow)"
          />

          {/* Bus Stops Pins */}
          {stops.map((stop, index) => {
            const isUserSelected = stop.id === selectedUserStopId;
            const isHovered = hoveredStop?.id === stop.id;

            return (
              <g
                key={stop.id}
                className="cursor-pointer group"
                onClick={() => {
                  setSelectedUserStopId(stop.id);
                  if (onStopSelect) onStopSelect(stop);
                }}
                onMouseEnter={() => setHoveredStop(stop)}
                onMouseLeave={() => setHoveredStop(null)}
              >
                {/* Outer halo if selected */}
                {isUserSelected && (
                  <circle
                    cx={stop.coords.x}
                    cy={stop.coords.y}
                    r="22"
                    fill="#1769AA"
                    opacity="0.2"
                    className="animate-ping"
                  />
                )}

                {/* Base pin */}
                <circle
                  cx={stop.coords.x}
                  cy={stop.coords.y}
                  r={isUserSelected ? "13" : "10"}
                  fill={isUserSelected ? "#1769AA" : "#FFFFFF"}
                  stroke={isUserSelected ? "#FFFFFF" : "#1769AA"}
                  strokeWidth="3"
                  className="transition-all duration-200"
                />

                {/* Number inside */}
                <text
                  x={stop.coords.x}
                  y={stop.coords.y + 4}
                  textAnchor="middle"
                  fill={isUserSelected ? "#FFFFFF" : "#1769AA"}
                  fontSize="10"
                  fontWeight="bold"
                >
                  {stop.stopNumber}
                </text>

                {/* Stop Label Banner */}
                <g transform={`translate(${stop.coords.x}, ${stop.coords.y - 18})`}>
                  <rect
                    x="-60"
                    y="-18"
                    width="120"
                    height="18"
                    rx="9"
                    fill={isUserSelected ? "#1769AA" : "rgba(255,255,255,0.92)"}
                    stroke={isUserSelected ? "#1769AA" : "#CBDCEB"}
                    strokeWidth="1"
                    filter="url(#glow)"
                  />
                  <text
                    x="0"
                    y="-6"
                    textAnchor="middle"
                    fill={isUserSelected ? "#FFFFFF" : "#1E293B"}
                    fontSize="9.5"
                    fontWeight="700"
                  >
                    {stop.name}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Animated Bus Marker on Map */}
          {tripStarted && (
            <g
              transform={`translate(${busPos.x}, ${busPos.y})`}
              className="transition-transform duration-100 ease-linear"
            >
              {/* Radar pulse ripples */}
              <circle r="36" fill="#1769AA" opacity="0.15" className="animate-ping" />
              <circle r="24" fill="#1769AA" opacity="0.25" />

              {/* Direction Indicator Cone */}
              <g transform={`rotate(${busPos.angle})`}>
                <polygon
                  points="20,0 32,-8 32,8"
                  fill="#0284C7"
                  opacity="0.8"
                />
              </g>

              {/* Bus Icon Container */}
              <circle r="18" fill="#1769AA" stroke="#FFFFFF" strokeWidth="2.5" />
              
              {/* Bus Mini Icon inside */}
              <g transform="translate(-10, -10)">
                <path
                  d="M4 16C4 16.5523 4.44772 17 5 17H6C6.55228 17 7 16.5523 7 16V15H13V16C13 16.5523 13.4477 17 14 17H15C15.5523 17 16 16.5523 16 16V15H17C17.5523 15 18 14.5523 18 14V6C18 4.34315 16.6569 3 15 3H5C3.34315 3 2 4.34315 2 6V14C2 14.5523 2.44772 15 3 15H4V16ZM4 6C4 5.44772 4.44772 5 5 5H15C15.5523 5 16 5.44772 16 6V9H4V6ZM4 11H7V13H4V11ZM9 11H11V13H9V11ZM13 11H16V13H13V11Z"
                  fill="#FFFFFF"
                  transform="scale(1)"
                />
              </g>

              {/* Floating Bus Tag */}
              <g transform="translate(0, 32)">
                <rect
                  x="-35"
                  y="-10"
                  width="70"
                  height="20"
                  rx="10"
                  fill="#111827"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {selectedRoute.busNumber} • LIVE
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Map Footer Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 shadow-sm border border-slate-200/60 flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          <span>Tap any stop to set as destination</span>
        </div>

        <div className="pointer-events-auto bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-800 shadow-sm border border-slate-200/60 flex items-center gap-2">
          <span className="text-slate-400">Route:</span>
          <span>{selectedRoute.routeTitle}</span>
        </div>
      </div>
    </div>
  );
};
