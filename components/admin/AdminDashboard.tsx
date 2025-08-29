import React, { useState } from 'react';
import { Role, College } from '../../types';
import Sidebar from '../shared/Sidebar';
import AdminHome from './AdminHome';
import TrainerApproval from './TrainerApproval';
import MaterialManager from './MaterialManager';
import ScheduleManager from './ScheduleManager';
import ReportingDashboard from './ReportingDashboard';
import TrainerManager from './TrainerManager';
import CollegeManager from './CollegeManager';
import CollegeInformationDashboard from './CollegeInformationDashboard';
import BillingManager from './BillingManager';

const AdminDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);

  const navigateToCollege = (college: College) => {
    setSelectedCollege(college);
    setCurrentView('collegeDetails');
  };

  const handleSetView = (view: string) => {
    if (view !== 'collegeDetails') {
      setSelectedCollege(null);
    }
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'approvals':
        return <TrainerApproval />;
      case 'trainers':
        return <TrainerManager />;
      case 'colleges':
        return <CollegeManager onCollegeSelect={navigateToCollege} />;
      case 'materials':
        return <MaterialManager />;
      case 'schedules':
        return <ScheduleManager />;
      case 'reporting':
        return <ReportingDashboard />;
      case 'billing':
        return <BillingManager />;
      case 'collegeDetails':
        return selectedCollege 
          ? <CollegeInformationDashboard college={selectedCollege} onBack={() => handleSetView('colleges')} />
          : <CollegeManager onCollegeSelect={navigateToCollege} />; // Fallback if no college is selected
      case 'dashboard':
      default:
        return <AdminHome setView={handleSetView} />;
    }
  };

  return (
    <div className="flex h-screen text-slate-800 dark:text-slate-200 main-bg">
      <Sidebar currentView={currentView} setView={handleSetView} userRole={Role.ADMIN} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="w-full h-full bg-slate-100 dark:bg-slate-900 rounded-2xl p-4 sm:p-6 md:p-8 overflow-y-auto">
         {renderView()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;