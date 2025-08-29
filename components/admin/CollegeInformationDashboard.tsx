import React, { useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import { College, User, Role } from '../../types';
import { BookOpenIcon, UsersIcon, CalendarIcon } from '../icons/Icons';
import Modal from '../shared/Modal';
import AssignMaterialsModal from '../shared/AssignMaterialsModal';

interface CollegeInformationDashboardProps {
  college: College;
  onBack: () => void;
}

const StatCard = ({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) => (
    <div className="p-5 bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
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

const CollegeInformationDashboard: React.FC<CollegeInformationDashboardProps> = ({ college, onBack }) => {
    const { schedules, trainers, students, addUser } = useData();
    const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
    const [newStudent, setNewStudent] = useState({ name: '', email: '', course: '' });

    const collegeData = useMemo(() => {
        const collegeSchedules = schedules.filter(s => s.college === college.name);
        const collegeStudents = students.filter(s => s.college === college.name);
        
        const upcoming = collegeSchedules
            .filter(s => s.endDate > new Date())
            .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

        const past = collegeSchedules
            .filter(s => s.endDate <= new Date())
            .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

        const courseList = [...new Set(collegeStudents.map(s => s.course))];

        return { upcoming, past, courseList, totalSchedules: collegeSchedules.length, collegeStudents };
    }, [college, schedules, students]);

    const getTrainerName = (trainerId: string) => trainers.find(t => t.id === trainerId)?.name || 'Unknown';
    
    const formInputClasses = "mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white";
    const formLabelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-200";

    const handleStudentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewStudent(prev => ({ ...prev, [name]: value }));
    };

    const handleStudentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addUser({
            ...newStudent,
            college: college.name,
            role: Role.STUDENT,
        });
        setIsAddStudentModalOpen(false);
        setNewStudent({ name: '', email: '', course: '' });
    };

    const handleOpenAssignModal = (student: User) => {
        setSelectedStudent(student);
        setIsAssignModalOpen(true);
    };

    return (
        <div className="space-y-8">
            <div>
                <button onClick={onBack} className="text-sm font-medium text-violet-600 dark:text-violet-400 hover:underline mb-4">
                    &larr; Back to Colleges
                </button>
                <div className="p-6 bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border dark:border-slate-700">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{college.name}</h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">{college.address}</p>
                    <div className="mt-4 pt-4 border-t dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300">
                        <p><span className="font-semibold">Contact:</span> {college.contactPerson}</p>
                        <p><span className="font-semibold">Email:</span> {college.contactEmail}</p>
                        <p><span className="font-semibold">Phone:</span> {college.contactPhone}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Students" value={collegeData.collegeStudents.length} icon={UsersIcon} />
                <StatCard title="Courses Offered" value={collegeData.courseList.length} icon={BookOpenIcon} />
                <StatCard title="Total Schedules" value={collegeData.totalSchedules} icon={CalendarIcon} />
            </div>

            <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Students</h2>
                    <button onClick={() => setIsAddStudentModalOpen(true)} className="px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors shadow-sm">
                        Add Student
                    </button>
                 </div>
                <div className="overflow-hidden border dark:border-slate-700 rounded-lg shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Course</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                            {collegeData.collegeStudents.length > 0 ? collegeData.collegeStudents.map(s => (
                                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{s.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">{s.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">{s.course}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button onClick={() => handleOpenAssignModal(s)} className="text-violet-600 hover:text-violet-900 dark:text-violet-400 dark:hover:text-violet-200 flex items-center gap-1">
                                            <BookOpenIcon className="w-4 h-4" />
                                            Assign
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-4 text-sm text-slate-500 dark:text-slate-400">No students found for this college.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Upcoming & Past Schedules</h3>
                <div className="mt-4 overflow-hidden border dark:border-slate-700 rounded-lg shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Course</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Trainer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                             {[...collegeData.upcoming, ...collegeData.past].sort((a,b) => a.startDate.getTime() - b.startDate.getTime()).map(s => (
                                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{s.course}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">{getTrainerName(s.trainerId)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">
                                      <div>{s.startDate.toLocaleString()}</div>
                                      <div className="text-xs text-slate-400">to {s.endDate.toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {s.endDate > new Date() ? 
                                          (s.startDate > new Date() ?
                                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">Upcoming</span> :
                                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">Ongoing</span>
                                          ) :
                                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200">Past</span>
                                        }
                                    </td>
                                </tr>
                            ))}
                             {collegeData.totalSchedules === 0 && (
                                 <tr>
                                    <td colSpan={4} className="text-center py-4 text-sm text-slate-500 dark:text-slate-400">No schedules found for this college.</td>
                                </tr>
                             )}
                        </tbody>
                    </table>
                </div>
            </div>
             <Modal isOpen={isAddStudentModalOpen} onClose={() => setIsAddStudentModalOpen(false)} title={`Add Student to ${college.name}`}>
                <form onSubmit={handleStudentSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className={formLabelClasses}>Full Name</label>
                            <input type="text" name="name" id="name" value={newStudent.name} onChange={handleStudentInputChange} required className={formInputClasses} />
                        </div>
                        <div>
                            <label htmlFor="email" className={formLabelClasses}>Email Address</label>
                            <input type="email" name="email" id="email" value={newStudent.email} onChange={handleStudentInputChange} required className={formInputClasses} />
                        </div>
                        <div>
                            <label htmlFor="course" className={formLabelClasses}>Course</label>
                            <input type="text" name="course" id="course" value={newStudent.course} onChange={handleStudentInputChange} required className={formInputClasses} />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                        <button type="button" onClick={() => setIsAddStudentModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md shadow-sm hover:bg-violet-700">Add Student</button>
                    </div>
                </form>
            </Modal>
             {selectedStudent && (
                <AssignMaterialsModal 
                    student={selectedStudent} 
                    isOpen={isAssignModalOpen}
                    onClose={() => setIsAssignModalOpen(false)}
                />
            )}
        </div>
    );
};

export default CollegeInformationDashboard;