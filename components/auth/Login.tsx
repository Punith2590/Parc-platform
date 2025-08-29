
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ParcLogo, MailIcon, LockIcon } from '../icons/Icons';
import Spinner from '../shared/Spinner';

interface LoginProps {
  onSignUpClick: () => void;
}

const Login: React.FC<LoginProps> = ({ onSignUpClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // On successful login, the App component will handle navigation
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full main-bg">
      <div className="flex w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
        {/* Left Side (Form) */}
        <div className="w-full lg:w-1/2 p-8 md:p-12">
          <div className="text-left mb-8">
            <ParcLogo className="h-10 w-auto text-violet-500" />
            <h2 className="mt-6 text-3xl font-bold text-slate-900 dark:text-white">
              Welcome Back
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to continue to Parc Platform.</p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <p className="text-sm text-center text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-md">{error}</p>}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MailIcon className="w-5 h-5 text-slate-400" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full py-3 pl-10 pr-4 text-slate-900 bg-slate-50 border border-slate-300 rounded-md placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 focus:border-violet-500"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <LockIcon className="w-5 h-5 text-slate-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full py-3 pl-10 pr-4 text-slate-900 bg-slate-50 border border-slate-300 rounded-md placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 focus:border-violet-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-white bg-violet-600 rounded-md shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:bg-violet-400"
              >
                {loading ? <Spinner size="sm" color="text-white"/> : 'Sign in'}
              </button>
            </div>
          </form>
          <p className="text-sm text-center text-slate-500 dark:text-slate-400 mt-8">
            Not a trainer yet?{' '}
            <button onClick={onSignUpClick} className="font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300">
              Sign up here
            </button>
          </p>
        </div>
        
        {/* Right Side (Decorative) */}
        <div className="hidden lg:flex w-1/2 bg-slate-950 p-12 flex-col justify-center items-center text-center">
            <div className="w-full h-full border-4 border-dashed border-slate-800 rounded-lg flex flex-col justify-center items-center">
                <ParcLogo className="h-16 w-auto text-violet-600" />
                <h1 className="text-3xl font-bold text-white mt-6">Unlock Your Potential</h1>
                <p className="text-slate-400 mt-2">Join the next generation of professional training.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;