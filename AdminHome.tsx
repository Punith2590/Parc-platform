
import React from 'react';
import { useData } from './context/DataContext';
import { UserCheckIcon, BookOpenIcon, CalendarIcon, ChartBarIcon } from './components/icons/Icons';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ElementType;
    onClick: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, onClick }) => (
    <div onClick={onClick} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
                <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
            </div>
        </div>
    </div>
);


interface AdminHomeProps {
    setView: (view: string) => void;
}

const AdminHome: React.FC<AdminHomeProps> = ({ setView }) => {
    const { applications, materials, schedules, trainers } = useData();

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Welcome back! Here's a quick overview of the platform.</p>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Pending Approvals" value={applications.length} icon={UserCheckIcon} onClick={() => setView('approvals')} />
                <StatCard title="Total Materials" value={materials.length} icon={BookOpenIcon} onClick={() => setView('materials')} />
                <StatCard title="Upcoming Schedules" value={schedules.length} icon={CalendarIcon} onClick={() => setView('schedules')} />
                <StatCard title="Active Trainers" value={trainers.length} icon={ChartBarIcon} onClick={() => setView('reporting')} />
            </div>
            
            <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                     <button onClick={() => setView('schedules')} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">Schedule a Class</button>
                     <button onClick={() => setView('materials')} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">Upload Material</button>
                     <button onClick={() => setView('approvals')} className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors">Review Applications</button>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;