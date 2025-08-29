
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { AcademicCapIcon, ChartBarIcon } from '../icons/Icons';

interface StudentHomeProps {
  setView: (view: string) => void;
}

const StudentHome: React.FC<StudentHomeProps> = ({ setView }) => {
  const { user } = useAuth();
  const { studentAttempts } = useData();

  const myAttempts = studentAttempts.filter(a => a.studentName === user?.name);
  const latestScore = myAttempts.length > 0 ? myAttempts.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime())[0].score : 'N/A';

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome, {user?.name}!</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">Ready to learn something new today?</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div onClick={() => setView('courses')} className="p-6 bg-white dark:bg-slate-800/50 rounded-xl shadow-sm hover:shadow-lg transition-shadow cursor-pointer border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Your Course</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{user?.course || 'Not Enrolled'}</p>
                </div>
                <div className="p-3 bg-violet-100 dark:bg-violet-500/10 rounded-full">
                    <AcademicCapIcon className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                </div>
            </div>
        </div>
        <div onClick={() => setView('leaderboard')} className="p-6 bg-white dark:bg-slate-800/50 rounded-xl shadow-sm hover:shadow-lg transition-shadow cursor-pointer border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Latest Score</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{latestScore}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-500/10 rounded-full">
                    <ChartBarIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
            </div>
        </div>
      </div>
      
       <div className="mt-10 bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Quick Links</h2>
            <div className="flex flex-wrap gap-4">
                 <button onClick={() => setView('courses')} className="px-5 py-2.5 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors shadow-sm">View My Course</button>
                 <button onClick={() => setView('leaderboard')} className="px-5 py-2.5 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors shadow-sm">Check Leaderboard</button>
            </div>
        </div>
    </div>
  );
};

export default StudentHome;