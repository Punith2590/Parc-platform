import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { CalendarIcon } from '../icons/Icons';
import Leaderboard from '../shared/Leaderboard';

interface TrainerHomeProps {
  setView: (view: string) => void;
}

const TrainerHome: React.FC<TrainerHomeProps> = ({ setView }) => {
  const { user } = useAuth();
  const { schedules, leaderboard } = useData();

  const mySchedules = schedules.filter(s => s.trainerId === user?.id);
  const upcomingSchedules = mySchedules.filter(s => s.endDate > new Date());

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome, {user?.name}!</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">Here's what's on your agenda.</p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-8">
            <div onClick={() => setView('schedules')} className="p-5 bg-white dark:bg-slate-800/50 rounded-xl shadow-sm hover:shadow-lg transition-shadow cursor-pointer border border-slate-200 dark:border-slate-700 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Upcoming Classes</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{upcomingSchedules.length}</p>
                    </div>
                    <div className="p-3 bg-violet-100 dark:bg-violet-500/10 rounded-full">
                        <CalendarIcon className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Next Upcoming Class</h2>
                {upcomingSchedules.length > 0 ? (
                    (() => {
                        const nextClass = upcomingSchedules.sort((a,b) => a.startDate.getTime() - b.startDate.getTime())[0];
                        return (
                            <div>
                                <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{nextClass.course}</p>
                                <p className="text-md text-slate-600 dark:text-slate-400">at {nextClass.college}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                                  {nextClass.startDate.toLocaleString()}
                                </p>
                                <button onClick={() => setView('schedules')} className="mt-4 px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors text-sm shadow-sm">
                                    View All Schedules
                                </button>
                            </div>
                        );
                    })()
                ) : (
                    <p className="text-slate-500 dark:text-slate-400">You have no upcoming classes scheduled.</p>
                )}
            </div>
        </div>
        
        <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Student Leaderboard</h2>
            <Leaderboard leaderboardData={leaderboard.slice(0, 10)} />
        </div>
      </div>
    </div>
  );
};

export default TrainerHome;