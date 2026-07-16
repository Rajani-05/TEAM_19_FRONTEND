import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getVendors, createVendorProfile, updateVendorProfile } from '../../api/vendorApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import Toast from '../../components/common/Toast';
import { Sparkles, ArrowLeft, Building, DollarSign, Image as ImageIcon, FileText, AlertCircle } from 'lucide-react';

const EditVendorProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [vendorId, setVendorId] = useState(null);
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('VENUE');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [portfolioImages, setPortfolioImages] = useState([]);

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
          // Find the vendor linked to the current logged-in user
          const myProfile = response.data.find(v => v.userId === user?.id || v.userId === user?.email);
          if (myProfile) {
            setVendorId(myProfile.id);
            setBusinessName(myProfile.businessName || '');
            setCategory(myProfile.category || 'VENUE');
            setPriceMin(myProfile.priceRange?.min?.toString() || '');
            setPriceMax(myProfile.priceRange?.max?.toString() || '');
            setDescription(myProfile.description || '');
            setPortfolioImages(myProfile.portfolioImages || []);
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
    if (!businessName || !priceMin || !priceMax || !description) {
      setToastType('error');
      setToastMsg('Please fill in all required fields.');
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
      portfolioImages
    };

    try {
      let res;
      if (vendorId) {
        // Update profile
        res = await updateVendorProfile(vendorId, payload);
      } else {
        // Create profile
        res = await createVendorProfile(payload);
      }

      if (res.success) {
        setToastType('success');
        setToastMsg('Profile saved successfully!');
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
    <div className="space-y-6 max-w-3xl mx-auto">
      {toastMsg && <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />}

      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/vendor/dashboard')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-650 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>

      {/* Title */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 text-violet-650 font-bold text-sm mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Vendor Settings</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-905 tracking-tight">
          {vendorId ? 'Manage Marketplace Profile' : 'Register Service Profile'}
        </h1>
        <p className="text-slate-500 mt-1">Provide business details, categories, rates, and portfolio images to attract event planners.</p>
      </div>

      {/* Form Card */}
      <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Business Name */}
          <div>
            <label htmlFor="businessName" className="block text-sm font-semibold text-slate-700">
              Business Name *
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Building className="w-4 h-4" />
              </div>
              <input
                id="businessName"
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="appearance-none block w-full pl-10 pr-4 py-3 border border-slate-205 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 transition-all text-xs"
                placeholder="e.g. Royal Catering Hub"
              />
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-slate-700">
              Service Category *
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-xs text-slate-950 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
            >
              <option value="VENUE">VENUE (Event Venue)</option>
              <option value="CATERING">CATERING (Catering & Food)</option>
              <option value="DECOR">DECOR (Decorations & Styling)</option>
              <option value="AV">AV (Audio-Visual & Sound)</option>
              <option value="OTHER">OTHER (Other Services)</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="priceMin" className="block text-sm font-semibold text-slate-700">
                Minimum Pricing (INR) *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <DollarSign className="w-4 h-4" />
                </div>
                <input
                  id="priceMin"
                  type="number"
                  required
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-4 py-3 border border-slate-205 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 transition-all text-xs"
                  placeholder="e.g. 15000"
                />
              </div>
            </div>
            <div>
              <label htmlFor="priceMax" className="block text-sm font-semibold text-slate-700">
                Maximum Pricing (INR) *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <DollarSign className="w-4 h-4" />
                </div>
                <input
                  id="priceMax"
                  type="number"
                  required
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-4 py-3 border border-slate-205 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 transition-all text-xs"
                  placeholder="e.g. 80000"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-slate-700">
              Business Description *
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute top-3 left-3 pointer-events-none text-slate-400">
                <FileText className="w-4 h-4" />
              </div>
              <textarea
                id="description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="block w-full pl-10 pr-4 py-3 border border-slate-205 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 transition-all text-xs resize-none"
                placeholder="Describe your services, specializations, and booking policies..."
              />
            </div>
          </div>

          {/* Portfolio Images */}
          <div>
            <label className="block text-sm font-semibold text-slate-750">
              Portfolio Image URLs
            </label>
            <div className="flex gap-2 mt-1">
              <div className="relative flex-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-4 py-3 border border-slate-205 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 transition-all text-xs"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Add Image
              </button>
            </div>

            {/* Selected Images Chips */}
            {portfolioImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {portfolioImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-video bg-slate-50 border border-slate-150 rounded-xl overflow-hidden group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
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

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={saving}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-violet-600 hover:bg-violet-750 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:bg-violet-400 disabled:cursor-not-allowed transition-all"
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
