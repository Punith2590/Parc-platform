
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import type { User } from '../../types';
import { Role } from '../../types';
import Modal from '../shared/Modal';
import { SearchIcon } from '../icons/Icons';

const TrainerManager: React.FC = () => {
  const { trainers, addUser } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTrainer, setNewTrainer] = useState({
      name: '',
      email: '',
      phone: '',
      expertise: '',
      experience: 0,
  });
  
  const formInputClasses = "mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white";
  const formLabelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-200";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type } = e.target;
      setNewTrainer(prev => ({
          ...prev,
          [name]: type === 'number' ? parseInt(value) || 0 : value
      }));
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      addUser({
          ...newTrainer,
          role: Role.TRAINER,
          password: 'password' // Default password
      });
      setIsModalOpen(false);
      setNewTrainer({ name: '', email: '', phone: '', expertise: '', experience: 0 });
  };
  
  const filteredTrainers = useMemo(() => {
    if (!searchTerm) return trainers;
    const lowercasedFilter = searchTerm.toLowerCase();
    return trainers.filter(trainer =>
      trainer.name.toLowerCase().includes(lowercasedFilter) ||
      trainer.email.toLowerCase().includes(lowercasedFilter) ||
      trainer.expertise?.toLowerCase().includes(lowercasedFilter)
    );
  }, [trainers, searchTerm]);


  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Trainer Management</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">View and manage all active trainers in the platform.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors shadow-sm">
            Create Trainer
        </button>
      </div>
      
       <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search trainers by name, email, or expertise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2.5 pl-10 pr-4 text-slate-900 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500"
            aria-label="Search trainers"
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
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Contact</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Expertise</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Experience</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {filteredTrainers.length > 0 ? filteredTrainers.map((trainer: User) => (
                    <tr key={trainer.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 dark:text-white sm:pl-6">{trainer.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-300">
                        <div>{trainer.email}</div>
                        <div>{trainer.phone}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-300">{trainer.expertise}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-300">{trainer.experience} years</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="text-center py-10 text-slate-500 dark:text-slate-400">
                        {searchTerm ? 'No trainers match your search.' : 'No active trainers found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Trainer">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className={formLabelClasses}>Full Name</label>
              <input type="text" name="name" id="name" value={newTrainer.name} onChange={handleInputChange} required className={formInputClasses} />
            </div>
             <div>
              <label htmlFor="email" className={formLabelClasses}>Email Address</label>
              <input type="email" name="email" id="email" value={newTrainer.email} onChange={handleInputChange} required className={formInputClasses} />
            </div>
             <div>
              <label htmlFor="phone" className={formLabelClasses}>Phone</label>
              <input type="tel" name="phone" id="phone" value={newTrainer.phone} onChange={handleInputChange} required className={formInputClasses} />
            </div>
             <div>
              <label htmlFor="expertise" className={formLabelClasses}>Expertise</label>
              <input type="text" name="expertise" id="expertise" value={newTrainer.expertise} onChange={handleInputChange} required className={formInputClasses} />
            </div>
            <div>
              <label htmlFor="experience" className={formLabelClasses}>Years of Experience</label>
              <input type="number" name="experience" id="experience" value={newTrainer.experience} onChange={handleInputChange} required className={formInputClasses} />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md shadow-sm hover:bg-violet-700">Create Trainer</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TrainerManager;