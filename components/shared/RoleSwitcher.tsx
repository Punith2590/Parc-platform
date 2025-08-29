
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserIcon, ChevronUpIcon } from '../icons/Icons';

const RoleSwitcher: React.FC = () => {
    const { user, users, switchUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const handleSelectUser = (userId: string) => {
        switchUser(userId);
        setIsOpen(false);
    }

    if (!user) return null;

    return (
        <div className="fixed bottom-5 right-5 z-50">
            <div className="relative">
                {isOpen && (
                     <div className="absolute bottom-full right-0 mb-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 border border-slate-700">
                        <div className="py-1">
                            <div className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Switch User</div>
                            {users.map((u) => (
                                <button
                                    key={u.id}
                                    onClick={() => handleSelectUser(u.id)}
                                    className={`w-full text-left flex items-center px-4 py-2 text-sm ${
                                        user.id === u.id 
                                        ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-white' 
                                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {u.name}
                                    <span className="ml-auto text-xs font-medium text-slate-500 dark:text-slate-400">{u.role}</span>
                                </button>
                            ))}
                        </div>
                     </div>
                )}
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-center w-14 h-14 bg-violet-600 text-white rounded-full shadow-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 dark:ring-offset-slate-950 transition-transform transform hover:scale-105"
                    aria-label="Switch user role"
                >
                    <UserIcon className="w-7 h-7" />
                    <ChevronUpIcon className={`w-4 h-4 absolute top-1 right-1 text-violet-200 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                </button>
            </div>
        </div>
    );
};

export default RoleSwitcher;