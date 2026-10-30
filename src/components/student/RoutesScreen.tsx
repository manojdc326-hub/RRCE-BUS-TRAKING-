import React, { useState } from 'react';
import { useBus } from '../../context/BusContext';
import { BusRoute } from '../../types';
import { 
  Bus, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Users, 
  Search, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const RoutesScreen: React.FC = () => {
  const { routes, selectedRouteId, setSelectedRouteId, setActiveStudentTab } = useBus();
  const [filter, setFilter] = useState<'All' | 'Active' | 'Not Started'>('All');
  const [expandedRouteId, setExpandedRouteId] = useState<string | null>(selectedRouteId);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRoutes = routes.filter((route) => {
    const matchesFilter = filter === 'All' || route.status === filter;
    const matchesSearch =
      route.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.routeTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleTrackRoute = (route: BusRoute) => {
    setSelectedRouteId(route.id);
    setActiveStudentTab('live');
  };

  return (
    <div className="p-4 sm:p-5 max-w-2xl mx-auto space-y-5 pb-28">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight">
          Bus Routes
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-0.5">
          Find your daily campus commute routes and schedules
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by bus number or stop..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1769AA] shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['All', 'Active', 'Not Started'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filter === tab
                  ? 'bg-[#1769AA] text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Routes List */}
      <div className="space-y-3">
        {filteredRoutes.map((route) => {
          const isSelected = route.id === selectedRouteId;
          const isExpanded = expandedRouteId === route.id;

          return (
            <div
              key={route.id}
              className={`bg-white rounded-[20px] transition-all duration-200 shadow-sm border ${
                isSelected ? 'border-[#1769AA] ring-1 ring-[#1769AA]/30' : 'border-slate-100'
              } overflow-hidden`}
            >
              {/* Flutter-style RouteCard Item */}
              <div
                onClick={() => setExpandedRouteId(isExpanded ? null : route.id)}
                className="p-4 sm:p-4.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 transition"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-[#E7F1FA] flex items-center justify-center shrink-0">
                    <Bus className="w-6 h-6 text-[#1769AA]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base">
                        {route.busNumber}
                      </h3>
                      {isSelected && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#1769AA]">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">
                      {route.routeTitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs sm:text-sm font-bold px-2.5 py-1 rounded-full ${
                      route.status === 'Active'
                        ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                        : 'text-slate-500 bg-slate-100'
                    }`}
                  >
                    {route.status}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Expandable Route Details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-100 space-y-3 bg-slate-50/40">
                  {/* Quick Meta */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-2">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                      <p className="text-slate-400 text-[10px] font-bold">DEPARTURE</p>
                      <p className="text-slate-800 font-bold mt-0.5">{route.departureTime}</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                      <p className="text-slate-400 text-[10px] font-bold">DRIVER</p>
                      <p className="text-slate-800 font-bold mt-0.5 truncate">{route.driverName}</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                      <p className="text-slate-400 text-[10px] font-bold">DISTANCE</p>
                      <p className="text-slate-800 font-bold mt-0.5">{route.totalDistanceKm} km</p>
                    </div>
                  </div>

                  {/* Route Stops Sequence */}
                  <div>
                    <p className="text-xs font-bold text-slate-700 mb-2">
                      Stops Sequence ({route.stops.length}):
                    </p>
                    <div className="space-y-1.5 pl-2 border-l-2 border-blue-200">
                      {route.stops.map((stop, sIdx) => (
                        <div key={stop.id} className="flex items-center justify-between text-xs py-1">
                          <span className="text-slate-700 font-medium">
                            <span className="font-bold text-[#1769AA] mr-1.5">{sIdx + 1}.</span>
                            {stop.name}
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            ~{stop.etaMinutes} min from start
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Track CTA */}
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => handleTrackRoute(route)}
                      className="flex-1 py-2.5 bg-[#1769AA] hover:bg-[#13568c] text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Bus className="w-3.5 h-3.5" />
                      <span>Track {route.busNumber} Live</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    {isSelected ? (
                      <span className="px-3 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Selected
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedRouteId(route.id)}
                        className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition cursor-pointer"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredRoutes.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm">
            No routes matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};
