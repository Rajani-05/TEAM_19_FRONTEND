import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { register as registerApi } from '../../api/authApi';
import { LogoWithText } from '../../components/common/Logo';
import { Eye, EyeOff, AlertCircle, Phone, UserCheck, Lock, Mail, User } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('PLANNER');
  const [phoneNo, setPhoneNo] = useState('');
  const [gender, setGender] = useState('male');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingState, setLoadingState] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !role || !phoneNo) {
      setErrorMsg('Please fill in all required fields including your phone number.');
      return;
    }

    setErrorMsg('');
    setLoadingState(true);

    try {
      const response = await registerApi(name, email, password, role, phoneNo, gender);
      if (response.success && response.data) {
        const { token, user } = response.data;
        login(token, user);

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
          case 'CLIENT':
            navigate('/client/dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        setErrorMsg(response.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      const apiMessage = err.response?.data?.message || 'Error occurred during registration.';
      setErrorMsg(apiMessage);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 event-bg-atmosphere transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center flex flex-col items-center">
        <Link to="/" className="mb-6">
          <LogoWithText size="lg" />
        </Link>
        <h2 className="text-3xl font-extrabold text-[var(--text-main)]">Create an account</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
            Sign in to your workspace
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="glass-card py-8 px-6 shadow-2xl sm:rounded-2xl sm:px-10 border border-[var(--border-color)]">
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-[var(--text-main)] mb-1">
                Full Name *
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm placeholder-[var(--text-muted)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all pl-11"
                  placeholder="Rishika"
                />
                <User className="w-5 h-5 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[var(--text-main)] mb-1">
                Email Address *
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm placeholder-[var(--text-muted)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all pl-11"
                  placeholder="rishika@example.com"
                />
                <Mail className="w-5 h-5 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phoneNo" className="block text-sm font-semibold text-[var(--text-main)] mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <input
                    id="phoneNo"
                    type="tel"
                    required
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm placeholder-[var(--text-muted)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all pl-11"
                    placeholder="+91 9876543210"
                  />
                  <Phone className="w-5 h-5 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-semibold text-[var(--text-main)] mb-1">
                  Gender *
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other / Prefer not to say</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-[var(--text-main)] mb-1">
                Register Role *
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-semibold"
              >
                <option value="PLANNER">Event Planner</option>
                <option value="VENDOR">Service Vendor</option>
                <option value="CLIENT">Client</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[var(--text-main)] mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm placeholder-[var(--text-muted)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all pl-11 pr-12"
                  placeholder="••••••••"
                />
                <Lock className="w-5 h-5 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loadingState}
                className="w-full btn-primary py-3.5 px-4 rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loadingState ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <UserCheck className="w-5 h-5" />
                    <span>Complete Registration</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
