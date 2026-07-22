import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getVendors, createVendorProfile, updateVendorProfile } from '../../api/vendorApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import Toast from '../../components/common/Toast';
import { Sparkles, ArrowLeft, Building, DollarSign, Image as ImageIcon, FileText, Phone, MapPin, Award, User, CheckCircle2, CalendarDays, X } from 'lucide-react';

const EditVendorProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [vendorId, setVendorId] = useState(null);
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('VENUE');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [description, setDescription] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [gender, setGender] = useState('male');
  const [location, setLocation] = useState('');
  const [experienceYears, setExperienceYears] = useState('3');
  const [available, setAvailable] = useState(true);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    const fetchExistingProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getVendors();
        if (response.success && response.data) {
          const myProfile = response.data.find(v => v.userId === user?.id || v.userId === user?.email);
          if (myProfile) {
            setVendorId(myProfile.id);
            setBusinessName(myProfile.businessName || '');
            setCategory(myProfile.category || 'VENUE');
            setPriceMin(myProfile.priceRange?.min?.toString() || '');
            setPriceMax(myProfile.priceRange?.max?.toString() || '');
            setDescription(myProfile.description || '');
            setPhoneNo(myProfile.phoneNo || user?.phoneNo || '');
            setGender(myProfile.gender || user?.gender || 'male');
            setLocation(myProfile.location || '');
            setExperienceYears(myProfile.experienceYears?.toString() || '3');
            setAvailable(myProfile.available !== false);
            setPortfolioImages(myProfile.portfolioImages || []);
            setBlockedDates(myProfile.blockedDates || []);
          } else {
            setPhoneNo(user?.phoneNo || '');
            setGender(user?.gender || 'male');
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to fetch existing profile details.');
      } finally {
        setLoading(false);
      }
    };

    fetchExistingProfile();
  }, [user]);

  const handleAddImage = (e) => {
    e.preventDefault();
    if (imageUrlInput.trim()) {
      setPortfolioImages(prev => [...prev, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index) => {
    setPortfolioImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!businessName || !priceMin || !priceMax || !description || !phoneNo) {
      setToastType('error');
      setToastMsg('Please fill in all required fields including Phone Number.');
      return;
    }

    const min = Number(priceMin);
    const max = Number(priceMax);

    if (isNaN(min) || isNaN(max) || min < 0 || max < min) {
      setToastType('error');
      setToastMsg('Please enter valid pricing bounds.');
      return;
    }

    setSaving(true);
    const payload = {
      businessName,
      category,
      priceRange: { min, max },
      description,
      phoneNo,
      gender,
      location,
      experienceYears: Number(experienceYears) || 0,
      available,
      portfolioImages,
      blockedDates
    };

    try {
      let res;
      if (vendorId) {
        res = await updateVendorProfile(vendorId, payload);
      } else {
        res = await createVendorProfile(payload);
      }

      if (res.success) {
        setToastType('success');
        setToastMsg('Vendor Business Profile saved successfully!');
        setTimeout(() => navigate('/vendor/dashboard'), 1500);
      } else {
        setToastType('error');
        setToastMsg(res.message || 'Failed to save profile.');
      }
    } catch (err) {
      console.error(err);
      setToastType('error');
      setToastMsg(err.response?.data?.message || 'Error occurred while saving profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner size="large" />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {toastMsg && <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />}

      <div>
        <button
          onClick={() => navigate('/vendor/dashboard')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>

      <div className="glass-card p-8 border border-[var(--border-color)]">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Vendor Business Profile Settings</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
          {vendorId ? 'Edit Marketplace Profile' : 'Register Service Profile'}
        </h1>
        <p className="text-[var(--text-muted)] mt-1">Provide business details, phone number, gender, service location, rates, and portfolio images to showcase your business to event planners.</p>
      </div>

      <div className="glass-card py-8 px-6 border border-[var(--border-color)] sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Business Name */}
          <div>
            <label htmlFor="businessName" className="block text-sm font-semibold text-[var(--text-main)] mb-1">
              Business Name *
            </label>
            <div className="relative">
              <input
                id="businessName"
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all pl-11"
                placeholder="e.g. Royal Grand Catering & Decor"
              />
              <Building className="w-5 h-5 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Phone & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phoneNo" className="block text-sm font-semibold text-[var(--text-main)] mb-1">
                Contact Phone Number *
              </label>
              <div className="relative">
                <input
                  id="phoneNo"
                  type="tel"
                  required
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all pl-11"
                  placeholder="+91 9876543210"
                />
                <Phone className="w-5 h-5 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-semibold text-[var(--text-main)] mb-1">
                Gender *
              </label>
              <div className="relative">
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all pl-11"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other / Prefer not to say</option>
                </select>
                <User className="w-5 h-5 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
              </div>
            </div>
          </div>

          {/* Location & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-[var(--text-main)] mb-1">
                Service Location / City *
              </label>
              <div className="relative">
                <input
                  id="location"
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all pl-11"
                  placeholder="e.g. Bangalore, Karnataka"
                />
                <MapPin className="w-5 h-5 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label htmlFor="experienceYears" className="block text-sm font-semibold text-[var(--text-main)] mb-1">
                Experience (Years)
              </label>
              <div className="relative">
                <input
                  id="experienceYears"
                  type="number"
                  min="0"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all pl-11"
                  placeholder="e.g. 5"
                />
                <Award className="w-5 h-5 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
              </div>
            </div>
          </div>

          {/* Category & Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-[var(--text-main)] mb-1">
                Service Category *
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
              >
                <option value="VENUE">VENUE (Event Hall & Grounds)</option>
                <option value="CATERING">CATERING (Catering & Food)</option>
                <option value="DECOR">DECOR (Styling & Decorations)</option>
                <option value="AV">AV (Audio, Visual & DJ)</option>
                <option value="OTHER">OTHER (Other Event Services)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-main)] mb-1">
                Booking Availability Status
              </label>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAvailable(!available)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                    available 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{available ? 'Available for New Events' : 'Currently Fully Booked'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="priceMin" className="block text-sm font-semibold text-[var(--text-main)] mb-1">
                Min Price (₹) *
              </label>
              <div className="relative">
                <input
                  id="priceMin"
                  type="number"
                  required
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all pl-11"
                  placeholder="e.g. 15000"
                />
                <DollarSign className="w-5 h-5 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
              </div>
            </div>
            <div>
              <label htmlFor="priceMax" className="block text-sm font-semibold text-[var(--text-main)] mb-1">
                Max Price (₹) *
              </label>
              <div className="relative">
                <input
                  id="priceMax"
                  type="number"
                  required
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all pl-11"
                  placeholder="e.g. 80000"
                />
                <DollarSign className="w-5 h-5 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-[var(--text-main)] mb-1">
              Business Overview & Services Offered *
            </label>
            <div className="relative">
              <textarea
                id="description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all pl-11 resize-none"
                placeholder="Describe your service packages, specialized menus, equipment, team size, and booking terms..."
              />
              <FileText className="w-5 h-5 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Portfolio Images */}
          <div>
            <label className="block text-sm font-semibold text-[var(--text-main)] mb-1">
              Portfolio Image URLs
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all pl-11"
                  placeholder="https://images.unsplash.com/photo-..."
                />
                <ImageIcon className="w-5 h-5 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
              </div>
              <button
                type="button"
                onClick={handleAddImage}
                className="px-5 py-3 bg-[var(--bg-surface)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-[var(--text-main)] font-bold text-sm rounded-xl transition-all"
              >
                Add Image
              </button>
            </div>

            {portfolioImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {portfolioImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-video bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl overflow-hidden group">
                    <img src={img} alt="Portfolio" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute inset-0 bg-red-600/80 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Availability Calendar */}
          <div>
            <label className="block text-sm font-semibold text-[var(--text-main)] mb-3 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-emerald-400" />
              Availability Calendar — Mark Blocked Dates
            </label>
            <p className="text-xs text-[var(--text-muted)] mb-4">Click dates to mark as unavailable. Click again to unblock. Green = free, Red = blocked.</p>
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <button type="button" onClick={() => setCalendarMonth(prev => { const d = new Date(prev); d.setMonth(d.getMonth() - 1); return d; })} className="px-3 py-1.5 bg-[var(--bg-primary)] hover:bg-[var(--border-color)] border border-[var(--border-color)] rounded-lg text-xs font-bold text-[var(--text-main)] transition-all">← Prev</button>
                <span className="text-sm font-bold text-[var(--text-main)]">{calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                <button type="button" onClick={() => setCalendarMonth(prev => { const d = new Date(prev); d.setMonth(d.getMonth() + 1); return d; })} className="px-3 py-1.5 bg-[var(--bg-primary)] hover:bg-[var(--border-color)] border border-[var(--border-color)] rounded-lg text-xs font-bold text-[var(--text-main)] transition-all">Next →</button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {(() => {
                  const year = calendarMonth.getFullYear();
                  const month = calendarMonth.getMonth();
                  const firstDay = new Date(year, month, 1).getDay();
                  const daysInMonth = new Date(year, month + 1, 0).getDate();
                  const cells = [];
                  for (let i = 0; i < firstDay; i++) cells.push(<div key={`empty-${i}`} />);
                  for (let day = 1; day <= daysInMonth; day++) {
                    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                    const isBlocked = blockedDates.includes(dateStr);
                    const today = new Date();
                    const isPast = new Date(dateStr) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    cells.push(
                      <button
                        key={dateStr}
                        type="button"
                        disabled={isPast}
                        onClick={() => {
                          if (isBlocked) {
                            setBlockedDates(prev => prev.filter(d => d !== dateStr));
                          } else {
                            setBlockedDates(prev => [...prev, dateStr]);
                          }
                        }}
                        className={`aspect-square rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                          isPast ? 'text-[var(--text-muted)] opacity-30 cursor-not-allowed' :
                          isBlocked ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  }
                  return cells;
                })()}
              </div>
              {blockedDates.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
                  <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-2">Blocked Dates ({blockedDates.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {blockedDates.sort().map(d => (
                      <span key={d} className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-lg text-[10px] font-mono font-bold">
                        {d}
                        <button type="button" onClick={() => setBlockedDates(prev => prev.filter(x => x !== d))}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full btn-primary py-3.5 px-4 rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Save Business Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVendorProfilePage;
