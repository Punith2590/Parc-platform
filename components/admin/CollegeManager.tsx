import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { AcademicCapIcon } from '../icons/Icons';
import Modal from '../shared/Modal';
import { College } from '../../types';

interface CollegeManagerProps {
  onCollegeSelect: (college: College) => void;
}

const CollegeManager: React.FC<CollegeManagerProps> = ({ onCollegeSelect }) => {
  const { colleges, addCollege } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const getInitialCollegeState = (): Omit<College, 'id'> => ({
    name: '',
    address: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [newCollege, setNewCollege] = useState<Omit<College, 'id'>>(getInitialCollegeState());

  const formInputClasses = "mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white";
  const formLabelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-200";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setNewCollege(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCollege.name.trim()) {
        addCollege(newCollege);
        setNewCollege(getInitialCollegeState());
        setIsModalOpen(false);
    }
  };

  return (
    <div>
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Partner Colleges</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">Select a college to view its detailed training dashboard.</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors shadow-sm whitespace-nowrap">
                Onboard College
            </button>
      </div>
      
      <div className="mt-8">
        {colleges.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {colleges.map((college) => (
              <button
                key={college.id}
                onClick={() => onCollegeSelect(college)}
                className="p-5 bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border dark:border-slate-700 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:shadow-md hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 dark:focus:ring-offset-slate-900"
              >
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-violet-100 dark:bg-violet-500/10 rounded-full">
                        <AcademicCapIcon className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{college.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{college.address || 'No address'}</p>
                    </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-6 bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border dark:border-slate-700">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No Colleges Found</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Onboard a new college to get started.</p>
          </div>
        )}
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Onboard New College">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className={formLabelClasses}>College Name</label>
              <input type="text" name="name" id="name" value={newCollege.name} onChange={handleInputChange} required className={formInputClasses} placeholder="e.g. State University"/>
            </div>
            <div>
                <label htmlFor="address" className={formLabelClasses}>Address</label>
                <textarea name="address" id="address" value={newCollege.address} onChange={handleInputChange} rows={3} className={formInputClasses} placeholder="123 University Ave, Capital City"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="contactPerson" className={formLabelClasses}>Contact Person</label>
                    <input type="text" name="contactPerson" id="contactPerson" value={newCollege.contactPerson} onChange={handleInputChange} required className={formInputClasses} placeholder="Dr. Eleanor Vance" />
                </div>
                <div>
                    <label htmlFor="contactEmail" className={formLabelClasses}>Contact Email</label>
                    <input type="email" name="contactEmail" id="contactEmail" value={newCollege.contactEmail} onChange={handleInputChange} required className={formInputClasses} placeholder="evance@stateu.edu" />
                </div>
            </div>
             <div>
                <label htmlFor="contactPhone" className={formLabelClasses}>Contact Phone</label>
                <input type="tel" name="contactPhone" id="contactPhone" value={newCollege.contactPhone} onChange={handleInputChange} className={formInputClasses} placeholder="555-0102" />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md shadow-sm hover:bg-violet-700">Onboard College</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CollegeManager;