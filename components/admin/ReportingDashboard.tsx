
import React from 'react';
import { useData } from '../../context/DataContext';
import Leaderboard from '../shared/Leaderboard';

const ReportingDashboard: React.FC = () => {
    const { leaderboard, studentAttempts } = useData();

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reporting & Tracking</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Monitor student progress and trainer activity.</p>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Leaderboard</h2>
                    <Leaderboard leaderboardData={leaderboard} />
                </div>

                <div className="lg:col-span-2">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Recent Student Attempts</h2>
                     <div className="mt-4 flow-root">
                        <div className="overflow-x-auto">
                            <div className="inline-block min-w-full align-middle">
                                <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg border dark:border-slate-700">
                                    <table className="min-w-full divide-y divide-slate-300 dark:divide-slate-700">
                                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                                            <tr>
                                                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-white sm:pl-6">Student</th>
                                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Course</th>
                                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Score</th>
                                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Timestamp</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                                            {studentAttempts.slice(0, 10).map((attempt, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 dark:text-white sm:pl-6">{attempt.studentName}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-300">{attempt.course}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-300">{attempt.score}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-300">{attempt.timestamp.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportingDashboard;