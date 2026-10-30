import React from 'react';
import { BusProvider, useBus } from './context/BusContext';
import { Header } from './components/common/Header';
import { DeviceFrame } from './components/common/DeviceFrame';
import { LoginScreen } from './components/LoginScreen';
import { StudentHome } from './components/student/StudentHome';
import { DriverHome } from './components/driver/DriverHome';

const MainAppContent: React.FC = () => {
  const { userRole } = useBus();

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-800 flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col justify-center">
        <DeviceFrame>
          {!userRole ? (
            <LoginScreen />
          ) : userRole === 'student' ? (
            <StudentHome />
          ) : (
            <div className="min-h-full">
              {/* Flutter Driver App Bar */}
              <div className="bg-white border-b border-slate-100 py-3.5 px-4 sticky top-0 z-20 shadow-sm text-center">
                <h1 className="text-lg font-bold text-slate-800">Driver Mode</h1>
              </div>
              <DriverHome />
            </div>
          )}
        </DeviceFrame>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <BusProvider>
      <MainAppContent />
    </BusProvider>
  );
}
