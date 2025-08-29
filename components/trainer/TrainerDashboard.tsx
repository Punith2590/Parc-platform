
import React, { useState } from 'react';
import { Role } from '../../types';
import Sidebar from '../shared/Sidebar';
import TrainerHome from './TrainerHome';
import TrainerSchedules from './TrainerSchedules';
import TrainerMaterialManager from './TrainerMaterialManager';
import TrainerStudentManager from './TrainerStudentManager';
import TrainerBilling from './TrainerBilling';

const TrainerDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'schedules':
        return <TrainerSchedules />;
      case 'materials':
        return <TrainerMaterialManager />;
      case 'students':
        return <TrainerStudentManager />;
      case 'billing':
        return <TrainerBilling />;
      case 'dashboard':
      default:
        return <TrainerHome setView={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen text-slate-800 dark:text-slate-200 main-bg">
      <Sidebar currentView={currentView} setView={setCurrentView} userRole={Role.TRAINER} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="w-full h-full bg-slate-100 dark:bg-slate-900 rounded-2xl p-4 sm:p-6 md:p-8 overflow-y-auto">
         {renderView()}
        </div>
      </main>
    </div>
  );
};

export default TrainerDashboard;
