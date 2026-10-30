import React, { useState } from 'react';
import { useBus } from '../context/BusContext';
import { Bus, User, Lock, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Camera } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { setUserRole, setActiveStudentTab } = useBus();
  const [isStudent, setIsStudent] = useState<boolean>(true);
  const [idValue, setIdValue] = useState<string>('STU-10492');
  const [passwordValue, setPasswordValue] = useState<string>('••••••••');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRoleToggle = (studentRole: boolean) => {
    setIsStudent(studentRole);
    if (studentRole) {
      setIdValue('STU-10492');
      setPasswordValue('••••••••');
    } else {
      setIdValue('DRV-01');
      setPasswordValue('••••••••');
    }
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setUserRole(isStudent ? 'student' : 'driver');
      setIsLoading(false);
    }, 350);
  };

  return (
    <div className="min-h-full flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-900/5 border border-slate-100">
        {/* Brand Icon */}
        <div className="flex flex-col items-center text-center">
          <div className="w-[90px] h-[90px] bg-[#1769AA] rounded-[25px] flex items-center justify-center shadow-lg shadow-blue-600/30 mb-5 transition-transform hover:scale-105">
            <Bus className="w-[50px] h-[50px] text-white" />
          </div>

          <h1 className="text-2xl sm:text-[25px] font-extrabold text-slate-900 tracking-tight uppercase">
            NAMASTE CAMPUS BUS
          </h1>

          <p className="text-slate-500 text-[15px] font-medium mt-1">
            Smart College Bus Tracking
          </p>
        </div>

        {/* Role Toggle Chips */}
        <div className="grid grid-cols-2 gap-3 mt-8">
          <button
            type="button"
            onClick={() => handleRoleToggle(true)}
            className={`py-3.5 px-4 rounded-[15px] font-bold text-center border transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
              isStudent
                ? 'bg-[#1769AA] text-white border-[#1769AA] shadow-md shadow-blue-700/20'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleToggle(false)}
            className={`py-3.5 px-4 rounded-[15px] font-bold text-center border transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
              !isStudent
                ? 'bg-[#1769AA] text-white border-[#1769AA] shadow-md shadow-blue-700/20'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Driver</span>
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              {isStudent ? 'Student ID' : 'Driver ID'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={idValue}
                onChange={(e) => setIdValue(e.target.value)}
                placeholder={isStudent ? 'e.g. STU-10492' : 'e.g. DRV-01'}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-[15px] text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#1769AA] focus:border-transparent transition shadow-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-[15px] text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#1769AA] focus:border-transparent transition shadow-sm"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Demo pre-filled credentials
            </span>
            <button
              type="button"
              onClick={() => {
                if (isStudent) {
                  setIdValue('STU-10492');
                } else {
                  setIdValue('DRV-01');
                }
              }}
              className="text-xs font-semibold text-[#1769AA] hover:underline"
            >
              Reset
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[55px] mt-4 bg-[#1769AA] hover:bg-[#13568c] active:scale-[0.99] text-white font-bold rounded-[15px] shadow-lg shadow-blue-800/25 flex items-center justify-center gap-2 text-[17px] tracking-wide transition cursor-pointer disabled:opacity-75"
          >
            {isLoading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>LOGIN</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Direct Live CCTV Access for All */}
          <button
            type="button"
            onClick={() => {
              setUserRole('student');
              setActiveStudentTab('cctv');
            }}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-[15px] text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md border border-slate-700"
          >
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>OPEN LIVE CCTV FEEDS</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse ml-1" />
          </button>
        </form>

        {/* Prototype Footer */}
        <div className="mt-6 text-center pt-2 border-t border-slate-100 flex flex-col items-center gap-1.5">
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            Prototype version • Namaste Campus Bus 2026
          </p>
          <div className="flex gap-2 text-[11px] text-slate-500 font-medium">
            <button 
              onClick={() => { setIsStudent(true); setIdValue('STU-10492'); handleLogin(); }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 transition text-[#1769AA]"
            >
              Instant Student View
            </button>
            <button 
              onClick={() => { setIsStudent(false); setIdValue('DRV-01'); handleLogin(); }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 transition text-emerald-700"
            >
              Instant Driver View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
