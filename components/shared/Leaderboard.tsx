
import React from 'react';
import type { User, LeaderboardEntry } from '../../types';
import { CrownIcon } from '../icons/Icons';

interface LeaderboardProps {
    leaderboardData: LeaderboardEntry[];
    currentUser?: User | null;
}

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
};

const LeaderboardPodiumItem: React.FC<{
    entry: LeaderboardEntry;
    rank: number;
    isCurrentUser: boolean;
}> = ({ entry, rank, isCurrentUser }) => {
    const podiumStyles = [
        { // Rank 1
            height: 'h-40',
            bgColor: 'bg-yellow-400 dark:bg-yellow-500',
            textColor: 'text-yellow-900 dark:text-yellow-100',
            borderColor: 'border-yellow-500',
            shadow: 'shadow-yellow-500/50',
            icon: <CrownIcon className="w-8 h-8 text-yellow-600 dark:text-yellow-300 absolute -top-4 -left-2 transform -rotate-12" />
        },
        { // Rank 2
            height: 'h-32',
            bgColor: 'bg-slate-300 dark:bg-slate-400',
            textColor: 'text-slate-800 dark:text-slate-100',
            borderColor: 'border-slate-400',
            shadow: 'shadow-slate-500/50',
            icon: null
        },
        { // Rank 3
            height: 'h-24',
            bgColor: 'bg-amber-600 dark:bg-amber-700',
            textColor: 'text-amber-100',
            borderColor: 'border-amber-700',
            shadow: 'shadow-amber-700/50',
            icon: null
        },
    ];

    const style = podiumStyles[rank - 1];

    return (
        <div className={`relative flex flex-col items-center justify-end ${style.height} w-1/3 mx-2`}>
            {style.icon}
            <div className="text-4xl font-black text-white" style={{WebkitTextStroke: '2px #0f172a'}}>{rank}</div>
            <div className={`w-full p-2 text-center rounded-t-lg ${style.bgColor} ${style.textColor} ${isCurrentUser ? `ring-4 ring-offset-2 ring-violet-500 dark:ring-offset-slate-800` : ''}`}>
                 <div className={`mx-auto -mt-8 w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white border-4 ${style.borderColor} bg-slate-700 shadow-lg ${style.shadow}`}>
                    {getInitials(entry.studentName)}
                </div>
                <p className="mt-2 font-bold truncate">{entry.studentName}</p>
                <p className="text-sm font-semibold">{entry.totalScore} pts</p>
            </div>
        </div>
    );
};


const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboardData, currentUser }) => {
    if (!leaderboardData || leaderboardData.length === 0) {
        return (
            <div className="text-center py-10 px-6 bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border dark:border-slate-700">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">No Leaderboard Data</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Student performance data is not available yet.</p>
            </div>
        );
    }

    const rest = leaderboardData.slice(3);

    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border dark:border-slate-700 p-6 space-y-6">
            <div className="flex items-end justify-center h-48">
                {leaderboardData[1] && (
                    <LeaderboardPodiumItem 
                        entry={leaderboardData[1]} 
                        rank={2} 
                        isCurrentUser={currentUser?.name === leaderboardData[1]?.studentName}
                    />
                )}
                {leaderboardData[0] && (
                     <LeaderboardPodiumItem 
                        entry={leaderboardData[0]} 
                        rank={1} 
                        isCurrentUser={currentUser?.name === leaderboardData[0]?.studentName}
                    />
                )}
                {leaderboardData[2] && (
                     <LeaderboardPodiumItem 
                        entry={leaderboardData[2]} 
                        rank={3} 
                        isCurrentUser={currentUser?.name === leaderboardData[2]?.studentName}
                    />
                )}
            </div>
            <ul className="divide-y dark:divide-slate-700">
                {rest.map((entry, index) => {
                    const isCurrentUser = currentUser?.name === entry.studentName;
                    return (
                        <li key={entry.studentName} className={`py-3 flex items-center justify-between ${isCurrentUser ? 'bg-violet-50 dark:bg-violet-500/10 rounded-md px-4 -mx-4' : ''}`}>
                            <div className="flex items-center">
                                <div className="font-bold w-8 text-center text-slate-500 dark:text-slate-400">{index + 4}</div>
                                <div className="ml-4 flex items-center">
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white bg-slate-500">
                                        {getInitials(entry.studentName)}
                                    </div>
                                    <span className="ml-3 font-medium text-slate-800 dark:text-slate-200">{entry.studentName}</span>
                                </div>
                            </div>
                            <span className="font-semibold text-violet-600 dark:text-violet-400">{entry.totalScore} pts</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Leaderboard;