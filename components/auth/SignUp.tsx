import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ParcLogo, UserCheckIcon } from '../icons/Icons';
import Spinner from '../shared/Spinner';

interface SignUpProps {
  onLoginClick: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onLoginClick }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    expertise: '',
    experience: 0,
    idProof: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addApplication } = useData();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setFormData(prev => ({ ...prev, [name]: isNumber ? parseInt(value, 10) || 0 : value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, idProof: e.target.files![0].name }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSuccess(false);
    try {
      await addApplication(formData);
      setSuccess(true);
    } catch (err) {
      setError('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const formInputClasses = "mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white";
  const formLabelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-200";

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen main-bg">
        <div className="w-full max-w-md p-8 text-center bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-800">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/50">
            <UserCheckIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-slate-900 dark:text-white">
            Application Submitted!
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Thank you! An admin will review your details and you will be notified upon approval.
          </p>
          <button onClick={onLoginClick} className="mt-8 font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300">
            &larr; Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen main-bg py-12">
      <div className="w-full max-w-2xl p-8 md:p-12 space-y-8 bg-white rounded-2xl shadow-2xl dark:bg-slate-900 border border-slate-800">
        <div className="text-center">
          <ParcLogo className="mx-auto h-12 w-auto text-violet-500" />
          <h2 className="mt-6 text-3xl font-bold text-slate-900 dark:text-white">
            Trainer Onboarding
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Complete the form below to join our team of experts.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-sm text-center text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-md">{error}</p>}
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={formLabelClasses}>Full Name</label>
              <input type="text" name="name" id="name" required onChange={handleChange} className={formInputClasses} />
            </div>
             <div>
              <label htmlFor="email" className={formLabelClasses}>Email Address</label>
              <input type="email" name="email" id="email" required onChange={handleChange} className={formInputClasses} />
            </div>
            <div>
              <label htmlFor="phone" className={formLabelClasses}>Phone</label>
              <input type="tel" name="phone" id="phone" required onChange={handleChange} className={formInputClasses} />
            </div>
            <div>
              <label htmlFor="experience" className={formLabelClasses}>Years of Experience</label>
              <input type="number" name="experience" id="experience" required onChange={handleChange} className={formInputClasses} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="expertise" className={formLabelClasses}>Area of Expertise</label>
              <textarea name="expertise" id="expertise" rows={3} required onChange={handleChange} className={formInputClasses} />
            </div>
            <div className="sm:col-span-2">
               <label htmlFor="idProof" className={formLabelClasses}>ID Proof</label>
               <input type="file" name="idProof" id="idProof" required onChange={handleFileChange} className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-600 hover:file:bg-violet-100 dark:file:bg-slate-700 dark:file:text-violet-300 dark:hover:file:bg-slate-600"/>
            </div>
          </div>
          <div>
            <button type="submit" disabled={loading} className="flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-white bg-violet-600 rounded-md shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:bg-violet-400">
              {loading ? <Spinner size="sm" color="text-white"/> : 'Submit Application'}
            </button>
          </div>
        </form>
         <p className="text-sm text-center text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <button onClick={onLoginClick} className="font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;