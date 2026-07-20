import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MessageSquare, ShieldCheck, Sparkles, ArrowRight, Star, Heart, Award, ArrowUpRight } from 'lucide-react';

const LandingPage = () => {
  const showcaseEvents = [
    {
      title: "Royal Marriage & Wedding Decor",
      desc: "Warm champagne drapes, blush rose floral arches, and luxury dining stages designed for fairy-tale moments.",
      img: "/images/marriage_deco.png",
      tag: "Wedding",
      rating: "5.0",
      theme: "Champagne Blush"
    },
    {
      title: "Chic & Modern Birthday Soiree",
      desc: "Pastel balloon arches, custom gold backdrop hoops, peach floral sprays, and custom aesthetic dessert tables.",
      img: "/images/birthday_deco.png",
      tag: "Birthday",
      rating: "4.9",
      theme: "Pastel Lavender"
    },
    {
      title: "Sage & Slate Corporate Gala",
      desc: "Sleek minimalist panel staging, warm architectural lighting, and modern layouts for business summits.",
      img: "/images/corporate_event.png",
      tag: "Corporate",
      rating: "4.8",
      theme: "Sage Green"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900">
      {/* Navigation Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-700 shadow-sm">
              <Calendar className="w-5.5 h-5.5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Event<span className="text-amber-600 font-medium">Pro</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              Planner Workspace
            </Link>
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-850 hover:bg-slate-800 transition-all rounded-xl shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="pt-20 pb-24 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/5 text-amber-800 text-xs font-semibold mb-8 border border-amber-500/10 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Bespoke Luxury Event Planning
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-slate-950 tracking-tight leading-[1.1] mb-8 max-w-4xl mx-auto">
            Design breathtaking events. <br />
            Connect vendors. <span className="italic text-amber-700 font-normal">Close deals with AI.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base text-slate-500 mb-12 leading-relaxed">
            EventPro streamlines high-end event workflows. Curate custom vendor packages, track budgets in real-time, draft polite counter-offers with AI, and secure instant client approvals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/register" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-all hover:translate-y-[-1px]"
            >
              Start Free Workspace
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/60 rounded-xl shadow-sm transition-all"
            >
              Log In
            </Link>
          </div>
        </section>

        {/* Dynamic Showcase Grid */}
        <section className="py-20 bg-white border-t border-slate-100/80">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <h2 className="text-3xl font-serif text-slate-950 tracking-tight">Curate Exquisite Moments</h2>
              <p className="text-sm text-slate-400">
                Explore real stage aesthetics, dining decors, and party themes built on our platform.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {showcaseEvents.map((item, idx) => (
                <div 
                  key={idx} 
                  className="bg-[#FAF9F6]/40 rounded-3xl border border-slate-100 overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-slate-100 hover:border-slate-200/50 transition-all duration-300"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-all duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 text-slate-800 shadow-sm backdrop-blur-sm">
                        {item.tag}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex-grow flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-amber-600 font-bold">
                        <span>Theme: {item.theme}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{item.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors">{item.title}</h3>
                      <p className="text-xs text-slate-450 leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="pt-4 border-t border-slate-100/50 flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium">Platform Package Verified</span>
                      <span className="text-slate-900 font-bold inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-all">
                        Explore Directory <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-20 bg-[#FAF9F6]/40 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 space-y-6 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-amber-500/5 text-amber-700 rounded-2xl flex items-center justify-center border border-amber-500/10">
                  <Calendar className="w-5.5 h-5.5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">Custom Package Builder</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Easily assemble venue hires, catering services, audio-visuals, and decors. Instantly track price items and check budget limits.
                  </p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-100 space-y-6 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-rose-500/5 text-rose-700 rounded-2xl flex items-center justify-center border border-rose-500/10">
                  <MessageSquare className="w-5.5 h-5.5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">AI Negotiation Assistant</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Automate polite negotiation drafts based on your budget parameters and current vendor rates. Save time on communication.
                  </p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-100 space-y-6 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-emerald-500/5 text-emerald-700 rounded-2xl flex items-center justify-center border border-emerald-500/10">
                  <ShieldCheck className="w-5.5 h-5.5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">Secure Razorpay Escrow</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Seamlessly share beautiful proposal links with clients. Clients sign off on proposals and complete secure online checkout instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-450 border-t border-slate-800/60 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">EventPro</span>
            <span className="text-slate-500">|</span>
            <span>Bespoke Luxury Events</span>
          </div>
          <p className="text-slate-500">© {new Date().getFullYear()} EventPro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
