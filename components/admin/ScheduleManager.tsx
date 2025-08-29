import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Schedule } from '../../types';
import Modal from '../shared/Modal';
import { SearchIcon } from '../icons/Icons';

const ScheduleManager: React.FC = () => {
  const { schedules, trainers, materials, addSchedule, colleges } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const getInitialScheduleState = (): Omit<Schedule, 'id'> => {
    const startDate = new Date();
    startDate.setMinutes(startDate.getMinutes() + 30 - (startDate.getMinutes() % 30)); // Set to nearest 30 mins
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1);
    return {
      trainerId: '',
      college: '',
      course: '',
      startDate,
      endDate,
      materialIds: [],
    };
  };
  
  const [newSchedule, setNewSchedule] = useState<Omit<Schedule, 'id'>>(getInitialScheduleState());
  
  const formInputClasses = "mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white";
  const formLabelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-200";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSchedule(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newDate = new Date(value);

    if (name === 'startDate') {
        const currentEndDate = newSchedule.endDate;
        if (newDate > currentEndDate) {
            setNewSchedule(prev => ({ ...prev, startDate: newDate, endDate: newDate }));
        } else {
            setNewSchedule(prev => ({ ...prev, startDate: newDate }));
        }
    } else { // name is 'endDate'
        setNewSchedule(prev => ({ ...prev, endDate: newDate }));
    }
  };

  const handleMaterialCheckboxChange = (materialId: string) => {
    setNewSchedule(prev => {
        const newMaterialIds = prev.materialIds.includes(materialId)
            ? prev.materialIds.filter(id => id !== materialId)
            : [...prev.materialIds, materialId];
        return { ...prev, materialIds: newMaterialIds };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchedule.trainerId || newSchedule.materialIds.length === 0) {
        alert("Please select a trainer and at least one material.");
        return;
    }
    addSchedule(newSchedule);
    setIsModalOpen(false);
    setNewSchedule(getInitialScheduleState());
  };
  
  const getTrainerName = (trainerId: string) => trainers.find(t => t.id === trainerId)?.name || 'Unknown Trainer';

  const filteredSchedules = useMemo(() => {
    if (!searchTerm) return schedules;
    const lowercasedFilter = searchTerm.toLowerCase();
    return schedules.filter(schedule =>
      schedule.course.toLowerCase().includes(lowercasedFilter) ||
      schedule.college.toLowerCase().includes(lowercasedFilter) ||
      getTrainerName(schedule.trainerId).toLowerCase().includes(lowercasedFilter)
    );
  }, [schedules, searchTerm, trainers]);

  const availableCourses = useMemo(() => [...new Set(materials.map(m => m.course))], [materials]);
  
  const toDateTimeLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Schedule Management</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Create and manage class schedules for trainers.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors shadow-sm">
          Create Schedule
        </button>
      </div>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search schedules by course, college, or trainer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2.5 pl-10 pr-4 text-slate-900 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500"
            aria-label="Search schedules"
          />
        </div>
      </div>
      
      <div className="mt-4 flow-root">
        <div className="inline-block min-w-full py-2 align-middle">
           <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg border dark:border-slate-700">
              <table className="min-w-full divide-y divide-slate-300 dark:divide-slate-700">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                      <tr>
                          <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-white sm:pl-6">Course</th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Trainer</th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">College</th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Schedule Dates</th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Materials</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                      {filteredSchedules.length > 0 ? filteredSchedules.map(schedule => (
                          <tr key={schedule.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 dark:text-white sm:pl-6">{schedule.course}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-300">{getTrainerName(schedule.trainerId)}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-300">{schedule.college}</td>
                              <td className="px-3 py-4 text-sm text-slate-500 dark:text-slate-300">
                                  <div><span className="font-semibold text-slate-600 dark:text-slate-400">Start:</span> {schedule.startDate.toLocaleString()}</div>
                                  <div><span className="font-semibold text-slate-600 dark:text-slate-400">End:</span> {schedule.endDate.toLocaleString()}</div>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-300">{schedule.materialIds.length}</td>
                          </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="text-center py-10 text-slate-500 dark:text-slate-400">
                            {searchTerm ? 'No schedules match your search.' : 'No schedules found.'}
                          </td>
                        </tr>
                      )}
                  </tbody>
              </table>
            </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Schedule">
        <form onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div>
                    <label htmlFor="trainerId" className={formLabelClasses}>Trainer</label>
                    <select name="trainerId" id="trainerId" value={newSchedule.trainerId} onChange={handleInputChange} required className={formInputClasses}>
                        <option value="" disabled>Select a trainer</option>
                        {trainers.map(trainer => <option key={trainer.id} value={trainer.id}>{trainer.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="college" className={formLabelClasses}>College</label>
                    <input
                      type="text"
                      name="college"
                      id="college"
                      value={newSchedule.college}
                      onChange={handleInputChange}
                      required
                      className={formInputClasses}
                      list="colleges-list"
                      placeholder="Select or add a new college"
                    />
                    <datalist id="colleges-list">
                      {colleges.map(c => <option key={c.id} value={c.name} />)}
                    </datalist>
                </div>
                <div>
                    <label htmlFor="course" className={formLabelClasses}>Course</label>
                    <input
                      type="text"
                      name="course"
                      id="course"
                      value={newSchedule.course}
                      onChange={handleInputChange}
                      required
                      className={formInputClasses}
                      list="courses-list"
                      placeholder="Select or add a new course"
                    />
                    <datalist id="courses-list">
                      {availableCourses.map(c => <option key={c} value={c} />)}
                    </datalist>
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="startDate" className={formLabelClasses}>Start Date & Time</label>
                        <input type="datetime-local" name="startDate" id="startDate" value={toDateTimeLocal(newSchedule.startDate)} onChange={handleDateTimeChange} required className={formInputClasses} />
                    </div>
                    <div>
                        <label htmlFor="endDate" className={formLabelClasses}>End Date & Time</label>
                        <input type="datetime-local" name="endDate" id="endDate" value={toDateTimeLocal(newSchedule.endDate)} min={toDateTimeLocal(newSchedule.startDate)} onChange={handleDateTimeChange} required className={formInputClasses} />
                    </div>
                </div>
                <div>
                  <label className={formLabelClasses}>Materials</label>
                  <div className="mt-1 max-h-40 overflow-y-auto p-2 border border-slate-300 dark:border-slate-700 rounded-md space-y-2">
                    {materials.length > 0 ? materials.map(material => (
                        <label key={material.id} className="flex items-center p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={newSchedule.materialIds.includes(material.id)}
                                onChange={() => handleMaterialCheckboxChange(material.id)}
                                className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 dark:bg-slate-700 dark:border-slate-600"
                            />
                            <span className="ml-3 text-sm text-slate-800 dark:text-slate-200">{material.title}</span>
                            <span className="ml-auto text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-full">{material.type}</span>
                        </label>
                    )) : (
                        <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-4">No materials found. Please add materials first.</p>
                    )}
                  </div>
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md shadow-sm hover:bg-violet-700">Create Schedule</button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default ScheduleManager;