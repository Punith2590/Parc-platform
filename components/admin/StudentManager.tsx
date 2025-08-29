import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import type { User } from '../../types';
import { Role } from '../../types';
import Modal from '../shared/Modal';
import AssignMaterialsModal from '../shared/AssignMaterialsModal';
import { BookOpenIcon, SearchIcon } from '../icons/Icons';

const StudentManager: React.FC = () => {
  const { students, colleges, addUser } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newStudent, setNewStudent] = useState({ name: '', email: '', course: '', college: '' });

  const formInputClasses = "mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white";
  const formLabelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-200";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setNewStudent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      addUser({
          ...newStudent,
          role: Role.STUDENT,
      });
      setIsModalOpen(false);
      setNewStudent({ name: '', email: '', course: '', college: '' });
  };

  const handleOpenAssignModal = (student: User) => {
      setSelectedStudent(student);
      setIsAssignModalOpen(true);
  }

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    const lowercasedFilter = searchTerm.toLowerCase();
    return students.filter(student =>
      student.name.toLowerCase().includes(lowercasedFilter) ||
      student.email.toLowerCase().includes(lowercasedFilter) ||
      (student.course && student.course.toLowerCase().includes(lowercasedFilter)) ||
      (student.college && student.college.toLowerCase().includes(lowercasedFilter))
    );
  }, [students, searchTerm]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Student Management</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">View and manage all students in the platform.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors shadow-sm">
            Add Student
        </button>
      </div>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search students by name, email, college, or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2.5 pl-10 pr-4 text-slate-900 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500"
            aria-label="Search students"
          />
        </div>
      </div>
      
      <div className="mt-4 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 sm:rounded-lg border dark:border-slate-700">
              <table className="min-w-full divide-y divide-slate-300 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-white sm:pl-6">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Email</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">College</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Enrolled Course</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {filteredStudents.length > 0 ? filteredStudents.map((student: User) => (
                    <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 dark:text-white sm:pl-6">{student.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-300">{student.email}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-300">{student.college}</td>
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
                      <td colSpan={5} className="text-center py-10 text-slate-500 dark:text-slate-400">
                        {searchTerm ? 'No students match your search.' : 'No students found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Student">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className={formLabelClasses}>Full Name</label>
              <input type="text" name="name" id="name" value={newStudent.name} onChange={handleInputChange} required className={formInputClasses} />
            </div>
             <div>
              <label htmlFor="email" className={formLabelClasses}>Email Address</label>
              <input type="email" name="email" id="email" value={newStudent.email} onChange={handleInputChange} required className={formInputClasses} />
            </div>
            <div>
              <label htmlFor="college" className={formLabelClasses}>College</label>
              <select name="college" id="college" value={newStudent.college} onChange={handleInputChange} required className={formInputClasses}>
                <option value="" disabled>Select a college</option>
                {/* FIX: A `College` object cannot be used as a React key, option value, or child. Using `c.id` for the key and `c.name` for the value and display text. */}
                {colleges.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
             <div>
              <label htmlFor="course" className={formLabelClasses}>Course</label>
              <input type="text" name="course" id="course" value={newStudent.course} onChange={handleInputChange} required className={formInputClasses} />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600">Cancel</button>
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

export default StudentManager;