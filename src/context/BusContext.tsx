import React, { createContext, useContext, useState, useEffect } from 'react';
import { BusRoute, AppNotification, CrowdLevel, UserRole, CCTVCamera } from '../types';
import { INITIAL_ROUTES, INITIAL_NOTIFICATIONS, CCTV_CAMERAS } from '../data/mockData';

interface BusContextType {
  userRole: UserRole | null;
  setUserRole: (role: UserRole | null) => void;
  activeStudentTab: 'home' | 'live' | 'cctv' | 'routes' | 'alerts';
  setActiveStudentTab: (tab: 'home' | 'live' | 'cctv' | 'routes' | 'alerts') => void;
  routes: BusRoute[];
  selectedRouteId: string;
  setSelectedRouteId: (id: string) => void;
  selectedRoute: BusRoute;
  selectedUserStopId: string;
  setSelectedUserStopId: (id: string) => void;
  tripStarted: boolean;
  toggleTrip: (status?: boolean) => void;
  busProgress: number; // 0.0 to 1.0 along the route path
  setBusProgress: (val: number | ((prev: number) => number)) => void;
  isSimulating: boolean;
  setIsSimulating: (sim: boolean) => void;
  simSpeed: number;
  setSimSpeed: (speed: number) => void;
  currentSpeedKmh: number;
  passengerCount: number;
  setPassengerCount: (count: number) => void;
  updatePassengers: (delta: number) => void;
  maxCapacity: number;
  crowdLevel: CrowdLevel;
  notifications: AppNotification[];
  addNotification: (title: string, message: string, type?: AppNotification['type']) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  displayMode: 'phone' | 'desktop';
  setDisplayMode: (mode: 'phone' | 'desktop') => void;
  currentStopIndex: number;
  nextStopName: string;
  etaToUserStopMinutes: number;
  // CCTV Access
  cctvCameras: CCTVCamera[];
  activeCameraId: string;
  setActiveCameraId: (id: string) => void;
  activeCamera: CCTVCamera;
  isNightVision: boolean;
  setIsNightVision: (val: boolean | ((prev: boolean) => boolean)) => void;
  showAIDetections: boolean;
  setShowAIDetections: (val: boolean | ((prev: boolean) => boolean)) => void;
  cctvLayout: 'single' | 'quad';
  setCctvLayout: (layout: 'single' | 'quad') => void;
  cctvModalOpen: boolean;
  setCctvModalOpen: (open: boolean) => void;
}

const BusContext = createContext<BusContextType | undefined>(undefined);

export const BusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [activeStudentTab, setActiveStudentTab] = useState<'home' | 'live' | 'cctv' | 'routes' | 'alerts'>('home');
  const [routes, setRoutes] = useState<BusRoute[]>(INITIAL_ROUTES);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('bus-01');
  const [selectedUserStopId, setSelectedUserStopId] = useState<string>('stop-3');
  const [tripStarted, setTripStarted] = useState<boolean>(true);
  const [busProgress, setBusProgress] = useState<number>(0.35); // Initial progress ~35%
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [passengerCount, setPassengerCount] = useState<number>(20);
  const maxCapacity = 50;
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [displayMode, setDisplayMode] = useState<'phone' | 'desktop'>('desktop');

  // CCTV State
  const [cctvCameras] = useState<CCTVCamera[]>(CCTV_CAMERAS);
  const [activeCameraId, setActiveCameraId] = useState<string>('cam-b1-cabin');
  const [isNightVision, setIsNightVision] = useState<boolean>(false);
  const [showAIDetections, setShowAIDetections] = useState<boolean>(true);
  const [cctvLayout, setCctvLayout] = useState<'single' | 'quad'>('single');
  const [cctvModalOpen, setCctvModalOpen] = useState<boolean>(false);

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];
  const activeCamera = cctvCameras.find((c) => c.id === activeCameraId) || cctvCameras[0];

  // Derive crowd level from passenger count
  const crowdLevel: CrowdLevel =
    passengerCount > 45
      ? 'FULL'
      : passengerCount > 35
      ? 'HIGH'
      : passengerCount > 20
      ? 'MEDIUM'
      : 'LOW';

  // Derive current speed based on simulation state
  const currentSpeedKmh = tripStarted
    ? isSimulating
      ? Math.round(32 + Math.sin(busProgress * 20) * 8)
      : 0
    : 0;

  // Derive stop indices
  const numStops = selectedRoute.stops.length;
  const segmentSize = 1 / (numStops - 1 || 1);
  const currentStopIndex = Math.min(
    numStops - 1,
    Math.floor(busProgress / segmentSize)
  );
  const nextStopIndex = Math.min(numStops - 1, currentStopIndex + 1);
  const nextStopName = selectedRoute.stops[nextStopIndex]?.name || selectedRoute.stops[numStops - 1]?.name;

  // Compute ETA to user's stop
  const userStopIndex = selectedRoute.stops.findIndex((s) => s.id === selectedUserStopId);
  const targetStopIdx = userStopIndex !== -1 ? userStopIndex : 2;
  const targetStopProgress = targetStopIdx * segmentSize;
  const remainingFraction = Math.max(0, targetStopProgress - busProgress);
  const baseMinutes = Math.round(remainingFraction * 20);
  const etaToUserStopMinutes = tripStarted ? Math.max(1, baseMinutes) : 0;

  // Bus continuous movement ticker
  useEffect(() => {
    if (!tripStarted || !isSimulating) return;

    const interval = setInterval(() => {
      setBusProgress((prev) => {
        const step = 0.0025 * simSpeed;
        const next = prev + step;
        if (next >= 1) {
          // Reached terminus, loop back after a brief pause
          return 0;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [tripStarted, isSimulating, simSpeed]);

  const toggleTrip = (status?: boolean) => {
    const nextState = status !== undefined ? status : !tripStarted;
    setTripStarted(nextState);
    if (nextState) {
      addNotification(
        `${selectedRoute.busNumber} started trip`,
        `GPS is active and heading toward ${selectedRoute.stops[1]?.name || 'next stop'}.`,
        'bus_started'
      );
    } else {
      addNotification(
        `${selectedRoute.busNumber} trip ended`,
        `Trip was paused or concluded by the driver.`,
        'alert'
      );
    }
  };

  const updatePassengers = (delta: number) => {
    setPassengerCount((prev) => {
      const next = Math.max(0, Math.min(maxCapacity, prev + delta));
      if (next > 40 && prev <= 40) {
        addNotification('High Crowd Alert', `${selectedRoute.busNumber} is filling up quickly (${next}/${maxCapacity} seats).`, 'crowd');
      }
      return next;
    });
  };

  const addNotification = (title: string, message: string, type: AppNotification['type'] = 'alert') => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      time: 'Just now',
      timestamp: Date.now(),
      type,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <BusContext.Provider
      value={{
        userRole,
        setUserRole,
        activeStudentTab,
        setActiveStudentTab,
        routes,
        selectedRouteId,
        setSelectedRouteId,
        selectedRoute,
        selectedUserStopId,
        setSelectedUserStopId,
        tripStarted,
        toggleTrip,
        busProgress,
        setBusProgress,
        isSimulating,
        setIsSimulating,
        simSpeed,
        setSimSpeed,
        currentSpeedKmh,
        passengerCount,
        setPassengerCount,
        updatePassengers,
        maxCapacity,
        crowdLevel,
        notifications,
        addNotification,
        markAllNotificationsRead,
        clearNotifications,
        displayMode,
        setDisplayMode,
        currentStopIndex,
        nextStopName,
        etaToUserStopMinutes,
        cctvCameras,
        activeCameraId,
        setActiveCameraId,
        activeCamera,
        isNightVision,
        setIsNightVision,
        showAIDetections,
        setShowAIDetections,
        cctvLayout,
        setCctvLayout,
        cctvModalOpen,
        setCctvModalOpen,
      }}
    >
      {children}
    </BusContext.Provider>
  );
};

export const useBus = (): BusContextType => {
  const context = useContext(BusContext);
  if (!context) {
    throw new Error('useBus must be used within a BusProvider');
  }
  return context;
};
