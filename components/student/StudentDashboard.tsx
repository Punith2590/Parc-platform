
import React, { useState } from 'react';
import { Role } from '../../types';
import Sidebar from '../shared/Sidebar';
import StudentHome from './StudentHome';
import MyCourses from './MyCourses';
import StudentLeaderboard from './StudentLeaderboard';
import MyAssessments from './MyAssessments';


const StudentDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'courses':
        return <MyCourses />;
      case 'assessments':
        return <MyAssessments />;
      case 'leaderboard':
        return <StudentLeaderboard />;
      case 'dashboard':
      default:
        return <StudentHome setView={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen text-slate-800 dark:text-slate-200 main-bg">
      <Sidebar currentView={currentView} setView={setCurrentView} userRole={Role.STUDENT} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="w-full h-full bg-slate-100 dark:bg-slate-900 rounded-2xl p-4 sm:p-6 md:p-8 overflow-y-auto">
         {renderView()}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;