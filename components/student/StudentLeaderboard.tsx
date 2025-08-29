
import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import Leaderboard from '../shared/Leaderboard';

const StudentLeaderboard: React.FC = () => {
    const { leaderboard } = useData();
    const { user } = useAuth();

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Leaderboard</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">See how you stack up against other students!</p>

            <div className="mt-8">
                <Leaderboard leaderboardData={leaderboard} currentUser={user} />
            </div>
        </div>
    );
};

export default StudentLeaderboard;