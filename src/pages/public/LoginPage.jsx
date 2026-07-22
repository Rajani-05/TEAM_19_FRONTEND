import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login as loginApi, sendOtp, verifyOtp } from '../../api/authApi';
import { LogoWithText } from '../../components/common/Logo';
import { Eye, EyeOff, AlertCircle, LogIn, Lock, Mail, KeyRound, ArrowLeft, Sparkles } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingState, setLoadingState] = useState(false);

  // OTP flow state
  const [otpMode, setOtpMode] = useState(false); // false = normal login, true = forgot password
  const [otpStep, setOtpStep] = useState(1); // 1 = enter email, 2 = enter OTP
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpHint, setOtpHint] = useState(''); // Demo hint from backend
  const [otpLoading, setOtpLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const redirectByRole = (role) => {
    switch (role) {
      case 'PLANNER': navigate('/planner/dashboard'); break;
      case 'VENDOR': navigate('/vendor/dashboard'); break;
      case 'ADMIN': navigate('/admin/dashboard'); break;
      case 'CLIENT': navigate('/client/dashboard'); break;
      default: navigate('/');
    }
  };

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
      if (response.success && response.data) {
        const { token, user } = response.data;
        login(token, user);
        redirectByRole(user.role);
      } else {
        setErrorMsg(response.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg(err.response?.data?.message || 'Invalid credentials or connection error.');
    } finally {
      setLoadingState(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!otpEmail) {
      setErrorMsg('Please enter your registered email.');
      return;
    }
    setErrorMsg('');
    setOtpLoading(true);
    try {
      const res = await sendOtp(otpEmail);
      if (res.success && res.data) {
        setOtpHint(res.data.otpHint || '');
        setOtpStep(2);
        setErrorMsg('');
      } else {
        setErrorMsg(res.message || 'Failed to send OTP.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Error sending OTP. Check your email.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode) {
      setErrorMsg('Please enter the 6-digit OTP.');
      return;
    }
    setErrorMsg('');
    setOtpLoading(true);
    try {
      const res = await verifyOtp(otpEmail, otpCode);
      if (res.success && res.data) {
        const { token, user } = res.data;
        login(token, user);
        redirectByRole(user.role);
      } else {
        setErrorMsg(res.message || 'OTP verification failed.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const resetToLogin = () => {
    setOtpMode(false);
    setOtpStep(1);
    setOtpEmail('');
    setOtpCode('');
    setOtpHint('');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 event-bg-atmosphere transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center flex flex-col items-center">
        <Link to="/" className="mb-6">
          <LogoWithText size="lg" />
        </Link>
        <h2 className="text-3xl font-extrabold text-[var(--text-main)] mt-2">
          {otpMode ? 'Forgot Password' : 'Welcome back'}
        </h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          {otpMode ? (
            <button onClick={resetToLogin} className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to password login
            </button>
          ) : (
            <>
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                Create a new workspace account
              </Link>
            </>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-card py-8 px-6 shadow-2xl sm:rounded-2xl sm:px-10 border border-[var(--border-color)]">
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ===== NORMAL PASSWORD LOGIN ===== */}
          {!otpMode && (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[var(--text-main)] mb-1">
                  Email Address
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

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-[var(--text-main)] mb-1">
                  Password
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

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { setOtpMode(true); setErrorMsg(''); }}
                  className="text-xs font-semibold text-pink-400 hover:text-pink-300 transition-colors"
                >
                  Forgot Password? Login with OTP
                </button>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loadingState}
                  className="w-full btn-primary py-3.5 px-4 rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {loadingState ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span>Sign In to Workspace</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ===== OTP STEP 1: ENTER EMAIL ===== */}
          {otpMode && otpStep === 1 && (
            <form className="space-y-6" onSubmit={handleSendOtp}>
              <div className="text-center mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <KeyRound className="w-7 h-7 text-white" />
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-xs mx-auto">
                  Enter your registered email address. We'll send a 6-digit OTP to verify your identity.
                </p>
              </div>

              <div>
                <label htmlFor="otpEmail" className="block text-sm font-semibold text-[var(--text-main)] mb-1">
                  Registered Email
                </label>
                <div className="relative">
                  <input
                    id="otpEmail"
                    type="email"
                    required
                    value={otpEmail}
                    onChange={(e) => setOtpEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm placeholder-[var(--text-muted)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all pl-11"
                    placeholder="rishika@example.com"
                  />
                  <Mail className="w-5 h-5 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={otpLoading}
                className="w-full btn-primary py-3.5 px-4 rounded-xl text-sm font-bold disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {otpLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Send OTP</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ===== OTP STEP 2: ENTER OTP CODE ===== */}
          {otpMode && otpStep === 2 && (
            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <div className="text-center mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <KeyRound className="w-7 h-7 text-white" />
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-xs mx-auto">
                  A 6-digit OTP has been sent to <span className="font-bold text-[var(--text-main)]">{otpEmail}</span>
                </p>
                {otpHint && (
                  <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-mono font-bold">
                    Demo OTP: {otpHint}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="otpCode" className="block text-sm font-semibold text-[var(--text-main)] mb-1">
                  Enter 6-Digit OTP
                </label>
                <div className="relative">
                  <input
                    id="otpCode"
                    type="text"
                    maxLength="6"
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-4 py-4 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm placeholder-[var(--text-muted)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-center text-2xl font-mono tracking-[0.5em] font-bold"
                    placeholder="• • • • • •"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={otpLoading || otpCode.length !== 6}
                className="w-full btn-primary py-3.5 px-4 rounded-xl text-sm font-bold disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {otpLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Verify OTP & Login</span>
                  </>
                )}
              </button>

              <div className="flex justify-between text-xs">
                <button
                  type="button"
                  onClick={() => { setOtpStep(1); setOtpCode(''); setOtpHint(''); setErrorMsg(''); }}
                  className="text-[var(--text-muted)] hover:text-[var(--text-main)] font-semibold transition-colors inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Change Email
                </button>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-pink-400 hover:text-pink-300 font-semibold transition-colors"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
