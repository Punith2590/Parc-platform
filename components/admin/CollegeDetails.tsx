import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { BookOpenIcon, UsersIcon, CalendarIcon } from '../icons/Icons';

interface CollegeDetailsProps {
  collegeName: string;
}

const StatCard = ({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) => (
    <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg flex items-center gap-4 border dark:border-gray-600">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
            <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const CollegeDetails: React.FC<CollegeDetailsProps> = ({ collegeName }) => {
    const { schedules, trainers } = useData();

    const collegeData = useMemo(() => {
        const collegeSchedules = schedules.filter(s => s.college === collegeName);
        
        // FIX: Property 'dateTime' does not exist on type 'Schedule'. Used 'endDate' for filtering and 'startDate' for sorting.
        const upcoming = collegeSchedules
            .filter(s => s.endDate > new Date())
            .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

        // FIX: Property 'dateTime' does not exist on type 'Schedule'. Used 'endDate' for filtering and 'startDate' for sorting.
        const past = collegeSchedules
            .filter(s => s.endDate <= new Date())
            .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

        const courseList = [...new Set(collegeSchedules.map(s => s.course))];

        const trainerIds = [...new Set(collegeSchedules.map(s => s.trainerId))];
        const trainerList = trainers.filter(t => trainerIds.includes(t.id));

        return { upcoming, past, courseList, trainerList, totalCount: collegeSchedules.length };
    }, [collegeName, schedules, trainers]);

    const getTrainerName = (trainerId: string) => trainers.find(t => t.id === trainerId)?.name || 'Unknown';

    if (collegeData.totalCount === 0) {
        return <p className="text-center text-gray-500 dark:text-gray-400">No schedule data found for {collegeName}.</p>
    }

    return (
        <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard title="Courses Offered" value={collegeData.courseList.length} icon={BookOpenIcon} />
                <StatCard title="Associated Trainers" value={collegeData.trainerList.length} icon={UsersIcon} />
                <StatCard title="Total Schedules" value={collegeData.totalCount} icon={CalendarIcon} />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Upcoming Schedules</h3>
                <div className="overflow-hidden border dark:border-gray-600 rounded-lg shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Course</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Trainer</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                            {collegeData.upcoming.length > 0 ? collegeData.upcoming.map(s => (
                                <tr key={s.id}>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{s.course}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{getTrainerName(s.trainerId)}</td>
                                    {/* FIX: Property 'dateTime' does not exist on type 'Schedule'. Use 'startDate' instead. */}
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{s.startDate.toLocaleString()}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={3} className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">No upcoming schedules.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Past Schedules</h3>
                 <div className="overflow-hidden border dark:border-gray-600 rounded-lg shadow-sm">
                     <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Course</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Trainer</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                             {collegeData.past.length > 0 ? collegeData.past.map(s => (
                                <tr key={s.id}>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{s.course}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{getTrainerName(s.trainerId)}</td>
                                    {/* FIX: Property 'dateTime' does not exist on type 'Schedule'. Use 'startDate' instead. */}
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{s.startDate.toLocaleString()}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={3} className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">No past schedules.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
        </div>
    )
}

export default CollegeDetails;