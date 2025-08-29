import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ParcLogo, DashboardIcon, UserCheckIcon, BookOpenIcon, CalendarIcon, ChartBarIcon, UsersIcon, AcademicCapIcon, TrophyIcon, LogoutIcon, ClipboardListIcon, CurrencyDollarIcon } from '../icons/Icons';
import { Role } from '../../types';

interface NavItem {
  name: string;
  view: string;
  icon: React.ElementType;
}

const adminNavItems: NavItem[] = [
  { name: 'Dashboard', view: 'dashboard', icon: DashboardIcon },
  { name: 'Trainer Approvals', view: 'approvals', icon: UserCheckIcon },
  { name: 'Trainers', view: 'trainers', icon: UsersIcon },
  { name: 'Colleges', view: 'colleges', icon: AcademicCapIcon },
  { name: 'Materials', view: 'materials', icon: BookOpenIcon },
  { name: 'Schedules', view: 'schedules', icon: CalendarIcon },
  { name: 'Reporting', view: 'reporting', icon: ChartBarIcon },
  { name: 'Billing', view: 'billing', icon: CurrencyDollarIcon },
];

const trainerNavItems: NavItem[] = [
  { name: 'Dashboard', view: 'dashboard', icon: DashboardIcon },
  { name: 'My Schedules', view: 'schedules', icon: CalendarIcon },
  { name: 'My Materials', view: 'materials', icon: BookOpenIcon },
  { name: 'Students', view: 'students', icon: UsersIcon },
  { name: 'Billing', view: 'billing', icon: CurrencyDollarIcon },
];

const studentNavItems: NavItem[] = [
  { name: 'Dashboard', view: 'dashboard', icon: DashboardIcon },
  { name: 'My Courses', view: 'courses', icon: BookOpenIcon },
  { name: 'My Assessments', view: 'assessments', icon: ClipboardListIcon },
  { name: 'Leaderboard', view: 'leaderboard', icon: TrophyIcon },
];

const navItemsMap = {
  [Role.ADMIN]: adminNavItems,
  [Role.TRAINER]: trainerNavItems,
  [Role.STUDENT]: studentNavItems,
};


interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  userRole: Role;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, userRole }) => {
  const { user, logout } = useAuth();
  const navItems = navItemsMap[userRole];

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900/70 backdrop-blur-sm border-r border-slate-200 dark:border-slate-800 flex flex-col">
      <div className="h-20 flex items-center justify-center border-b border-slate-200 dark:border-slate-800">
        <ParcLogo className="h-9 w-auto text-violet-500" />
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setView(item.view)}
            className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors relative ${
              currentView === item.view
                ? 'bg-violet-500/10 text-violet-600 dark:text-violet-300'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
            }`}
          >
            {currentView === item.view && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-violet-500 rounded-r-full"></div>}
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800/50">
          <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-slate-700 flex items-center justify-center text-violet-600 dark:text-violet-300 font-bold">
            {user?.name.charAt(0)}
          </div>
          <div className="ml-3">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role}</p>
          </div>
          <button onClick={logout} className="ml-auto text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white" aria-label="Logout">
            <LogoutIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;