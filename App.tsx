
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import AdminDashboard from './components/admin/AdminDashboard';
import TrainerDashboard from './components/trainer/TrainerDashboard';
import StudentDashboard from './components/student/StudentDashboard';
import { Role } from './types';
import RoleSwitcher from './components/shared/RoleSwitcher';
import { ParcLogo } from './components/icons/Icons';
import AuthPage from './components/auth/AuthPage';


const AppContainer = () => {
  const { user } = useAuth();

  if (!user) {
    // This is the initial state before any user is selected.
    // It could also be the state after a logout.
    return <AuthPage />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case Role.ADMIN:
        return <AdminDashboard />;
      case Role.TRAINER:
        return <TrainerDashboard />;
      case Role.STUDENT:
        return <StudentDashboard />;
      default:
        return (
            <div className="flex flex-col items-center justify-center min-h-screen main-bg text-slate-200">
                <div className="text-center p-8 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700">
                    <ParcLogo className="mx-auto h-16 w-auto text-violet-500" />
                    <h1 className="mt-8 text-3xl font-bold text-white">
                        Welcome to Parc Platform
                    </h1>
                    <p className="mt-4 text-lg text-slate-400">
                        Please select a user role to begin.
                    </p>
                </div>
                <RoleSwitcher />
            </div>
        );
    }
  }

  return (
    <>
      {renderDashboard()}
      <RoleSwitcher />
    </>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <AuthProvider>
        <AppContainer />
      </AuthProvider>
    </DataProvider>
  );
};

export default App;