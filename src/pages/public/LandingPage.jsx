import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MessageSquare, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-200">
              <Calendar className="w-5.5 h-5.5" />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">Apex<span className="text-violet-600">Planners</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 transition-all rounded-lg shadow-sm shadow-violet-100 hover:shadow-violet-200">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 text-xs font-semibold mb-6 border border-violet-100 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Next-Gen Event Planning Marketplace
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-none mb-6">
            Plan Events. Connect Vendors.<br />
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Close Deals with AI.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-10 leading-relaxed">
            ApexPlanners streamlines your event coordination workflows. Build packages, track budgets in real-time, negotiate using a context-aware AI assistant, and secure instant client sign-offs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-lg shadow-violet-200 transition-all">
              Create an Account
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl shadow-sm transition-all">
              Sign In to Your Workspace
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-slate-900 tracking-tight mb-12">
              Everything you need in a single platform
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-violet-200 transition-all group">
                <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-violet-600 group-hover:text-white transition-all shadow-sm">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Package Builder</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Easily assemble a curated package from top vendors. Lock specific services, swap out items, and see budget calculations update instantly.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-violet-200 transition-all group">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">AI Negotiation Assistant</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Struggling with vendor negotiations? Our context-aware assistant reads the remaining budget gap and drafts polite, professional counter-offers.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-violet-200 transition-all group">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Instant Approvals</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Share a secure, interactive link with your client. They can review vendor details, approve the event package, and make payment instantly.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>© {new Date().getFullYear()} ApexPlanners. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
