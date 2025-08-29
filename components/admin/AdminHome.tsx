import React from 'react';
import { useData } from '../../context/DataContext';
import { UserCheckIcon, BookOpenIcon, CalendarIcon, UsersIcon, AcademicCapIcon } from '../icons/Icons';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ElementType;
    onClick: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, onClick }) => (
    <div onClick={onClick} className="p-5 bg-white dark:bg-slate-800/50 rounded-xl shadow-sm hover:shadow-lg transition-shadow cursor-pointer border border-slate-200 dark:border-slate-700 hover:-translate-y-1">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
            </div>
            <div className="p-3 bg-violet-100 dark:bg-violet-500/10 rounded-full">
                <Icon className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            </div>
        </div>
    </div>
);


interface AdminHomeProps {
    setView: (view: string) => void;
}

const AdminHome: React.FC<AdminHomeProps> = ({ setView }) => {
    const { applications, materials, schedules, trainers, students, colleges } = useData();

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Welcome back! Here's a quick overview of the platform.</p>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <StatCard title="Pending Approvals" value={applications.length} icon={UserCheckIcon} onClick={() => setView('approvals')} />
                <StatCard title="Active Trainers" value={trainers.length} icon={UsersIcon} onClick={() => setView('trainers')} />
                <StatCard title="Total Students" value={students.length} icon={UsersIcon} onClick={() => setView('colleges')} />
                <StatCard title="Partner Colleges" value={colleges.length} icon={AcademicCapIcon} onClick={() => setView('colleges')} />
                <StatCard title="Total Materials" value={materials.length} icon={BookOpenIcon} onClick={() => setView('materials')} />
                <StatCard title="Upcoming Schedules" value={schedules.length} icon={CalendarIcon} onClick={() => setView('schedules')} />
            </div>
            
            <div className="mt-10 bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                     <button onClick={() => setView('schedules')} className="px-5 py-2.5 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors shadow-sm">Schedule a Class</button>
                     <button onClick={() => setView('materials')} className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-sm">Upload Material</button>
                     <button onClick={() => setView('approvals')} className="px-5 py-2.5 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors shadow-sm">Review Applications</button>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;