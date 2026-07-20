import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login as loginApi } from '../../api/authApi';
import { Calendar, Eye, EyeOff, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingState, setLoadingState] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    setErrorMsg('');
    setLoadingState(true);

    try {
      const response = await loginApi(email, password);
      // Response wrapper shape: { success: true, message: "...", data: { token, user } }
      if (response.success && response.data) {
        const { token, user } = response.data;
        login(token, user);

        // Redirect based on role
        switch (user.role) {
          case 'PLANNER':
            navigate('/planner/dashboard');
            break;
          case 'VENDOR':
            navigate('/vendor/dashboard');
            break;
          case 'ADMIN':
            navigate('/admin/dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        setErrorMsg(response.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      const apiMessage = err.response?.data?.message || 'Invalid credentials or connection error.';
      setErrorMsg(apiMessage);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-violet-200">
            <Calendar className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">Event<span className="text-amber-650 text-amber-600">Pro</span></span>
        </Link>
        <h2 className="text-3xl font-extrabold text-slate-950">Welcome back</h2>
        <p className="mt-2 text-sm text-slate-600">
          Or{' '}
          <Link to="/register" className="font-semibold text-violet-600 hover:text-violet-500 transition-colors">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-100 sm:rounded-2xl sm:px-10 border border-slate-100">
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-slate-900 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-slate-900 transition-all pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loadingState}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:bg-violet-400 disabled:cursor-not-allowed transition-all"
              >
                {loadingState ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
