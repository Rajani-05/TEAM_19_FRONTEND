import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { LogoWithText } from '../../components/common/Logo';
import { Calendar, MessageSquare, ShieldCheck, Sparkles, ArrowRight, Star, Sun, Moon, ArrowUpRight } from 'lucide-react';

const LandingPage = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  const showcaseEvents = [
    {
      title: "Royal Marriage & Wedding Decor",
      desc: "Warm champagne drapes, blush rose floral arches, and luxury dining stages designed for fairy-tale moments.",
      img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      tag: "Wedding",
      rating: "5.0",
      theme: "Champagne Blush"
    },
    {
      title: "Chic & Modern Birthday Soiree",
      desc: "Pastel balloon arches, custom gold backdrop hoops, peach floral sprays, and custom aesthetic dessert tables.",
      img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
      tag: "Birthday",
      rating: "4.9",
      theme: "Pastel Lavender"
    },
    {
      title: "Sage & Slate Corporate Gala",
      desc: "Sleek minimalist panel staging, warm architectural lighting, and modern layouts for business summits.",
      img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
      tag: "Corporate",
      rating: "4.8",
      theme: "Sage Green"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] flex flex-col font-sans event-bg-atmosphere transition-colors duration-300">
      {/* Navigation Bar */}
      <header className="bg-[var(--bg-surface-glass)] backdrop-blur-md border-b border-[var(--border-color)] sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <LogoWithText size="md" />

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 bg-[var(--bg-surface)] hover:bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] transition-all flex items-center gap-2 text-xs font-semibold"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
              <span className="hidden sm:inline capitalize">{theme} Mode</span>
            </button>

            <Link to="/login" className="text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
              Workspace Login
            </Link>

            <Link 
              to="/register" 
              className="btn-primary px-5 py-2.5 text-sm font-bold rounded-xl shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="pt-20 pb-24 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-8 border border-emerald-500/20">
            <Sparkles className="w-4 h-4 text-emerald-450 text-emerald-450" />
            Next-Gen Bespoke Event Management System
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[var(--text-main)] tracking-tight leading-[1.1] mb-8 max-w-4xl mx-auto">
            Design Breathtaking Events. <br />
            Sourcing Vendors. <span className="gradient-text">Close Deals with AI.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base text-[var(--text-muted)] mb-12 leading-relaxed">
            EventPro streamlines high-end event workflows. Curate custom vendor packages, track budgets in real-time, draft polite counter-offers with AI, and secure instant client approvals.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/register" 
              className="w-full sm:w-auto btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold rounded-xl shadow-xl transition-all"
            >
              Start Free Workspace
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-[var(--text-main)] bg-[var(--bg-surface)] hover:bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl shadow-sm transition-all"
            >
              Sign In
            </Link>
          </div>
        </section>

        {/* Dynamic Showcase Grid */}
        <section className="py-20 bg-[var(--bg-surface-glass)] border-t border-[var(--border-color)]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <h2 className="text-3xl font-black text-[var(--text-main)] tracking-tight">Curate Exquisite Moments</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Explore real stage decors, dining themes, and party layouts built by event planners.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {showcaseEvents.map((item, idx) => (
                <div 
                  key={idx} 
                  className="glass-card overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-white shadow-sm backdrop-blur-sm border border-white/10">
                        {item.tag}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex-grow flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                        <span>Theme: {item.theme}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                          <span className="text-[var(--text-main)]">{item.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-[var(--text-main)] group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="pt-4 border-t border-[var(--border-color)] flex justify-between items-center text-xs">
                      <span className="text-[var(--text-muted)] font-medium">Verified Package</span>
                      <Link to="/register" className="text-[var(--text-main)] font-bold inline-flex items-center gap-0.5 group-hover:text-indigo-400 transition-colors">
                        Explore Marketplace <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 space-y-4">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-main)]">Custom Event Package Builder</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Assemble venues, caterers, sound systems, and decorators into a single proposal with real-time budget tracking.
              </p>
            </div>

            <div className="glass-card p-8 space-y-4">
              <div className="w-12 h-12 bg-pink-500/20 text-pink-400 rounded-2xl flex items-center justify-center border border-pink-500/30">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-main)]">AI Negotiation Assistant</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Generate polite, professional counter-offers to vendors based on target event budget powered by Google Gemini AI.
              </p>
            </div>

            <div className="glass-card p-8 space-y-4">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-main)]">Razorpay Payment Integration</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Send tokenized event links to clients for instant online approval and secure Razorpay payment processing.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-955 text-slate-400 border-t border-slate-800 py-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">EventPro System</span>
            <span className="text-slate-600">|</span>
            <span>Bespoke Event Management</span>
          </div>
          <p className="text-slate-500">© {new Date().getFullYear()} EventPro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
