
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import type { User } from '../../types';
import AssignMaterialsModal from '../shared/AssignMaterialsModal';
import { BookOpenIcon } from '../icons/Icons';

const TrainerStudentManager: React.FC = () => {
  const { students, schedules } = useData();
  const { user: trainer } = useAuth();
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  const myStudents = useMemo(() => {
    if (!trainer) return [];
    
    // Find all unique courses this trainer teaches
    const trainerCourses = [...new Set(
        schedules
            .filter(s => s.trainerId === trainer.id)
            .map(s => s.course)
    )];

    // Filter students who are in those courses
    return students.filter(student => student.course && trainerCourses.includes(student.course));
  }, [students, schedules, trainer]);


  const handleOpenAssignModal = (student: User) => {
      setSelectedStudent(student);
      setIsAssignModalOpen(true);
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Students</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">View students in your courses and assign materials.</p>
        </div>
      </div>
      
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 sm:rounded-lg border dark:border-slate-700">
              <table className="min-w-full divide-y divide-slate-300 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-white sm:pl-6">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Email</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Enrolled Course</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {myStudents.length > 0 ? myStudents.map((student: User) => (
                    <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 dark:text-white sm:pl-6">{student.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-300">{student.email}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-300">{student.course}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button onClick={() => handleOpenAssignModal(student)} className="text-violet-600 hover:text-violet-900 dark:text-violet-400 dark:hover:text-violet-200 flex items-center gap-1">
                            <BookOpenIcon className="w-4 h-4" />
                            Assign Materials
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="text-center py-10 text-slate-500 dark:text-slate-400">
                        No students found in your courses.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

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

export default TrainerStudentManager;