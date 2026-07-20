/**
 * Event-type Styling Theme Resolver
 * Generates custom elegant pastel/light themes and selects matching high-quality decoration images
 * based on event titles (e.g. Wedding, Birthday, Corporate, etc.).
 */

export const resolveEventTheme = (title = '') => {
  const normalized = title.toLowerCase();

  // 1. Wedding / Marriage Theme (Warm Rose Gold & Champagne)
  if (normalized.includes('wed') || normalized.includes('marry') || normalized.includes('marriage') || normalized.includes('shaadi') || normalized.includes('groom') || normalized.includes('bride') || normalized.includes('reception')) {
    return {
      name: 'Wedding',
      bgClass: 'bg-[#FAF5F5]', // Soft blush tint
      cardBg: 'bg-white',
      accentText: 'text-rose-700',
      accentBg: 'bg-rose-50',
      accentBorder: 'border-rose-100',
      badgeClass: 'bg-rose-50 text-rose-750 border-rose-200/50',
      btnClass: 'bg-rose-700 hover:bg-rose-850 hover:bg-rose-800 text-white shadow-rose-200/40 focus:ring-rose-500',
      btnSecondary: 'border-rose-200 text-rose-700 hover:bg-rose-50',
      summaryBg: 'bg-[#402F2F]', // Elegant deep mahogany
      summaryText: 'text-rose-200',
      heroImage: '/images/marriage_deco.png',
      patternClass: 'from-rose-100/30 via-transparent to-transparent'
    };
  }

  // 2. Birthday Theme (Pastel Lavender & Mint)
  if (normalized.includes('birth') || normalized.includes('bday') || normalized.includes('birthday') || normalized.includes('party') || normalized.includes('anniversary')) {
    return {
      name: 'Birthday',
      bgClass: 'bg-[#F6F6FA]', // Soft indigo/lavender tint
      cardBg: 'bg-white',
      accentText: 'text-indigo-700',
      accentBg: 'bg-indigo-50/70',
      accentBorder: 'border-indigo-100',
      badgeClass: 'bg-indigo-50 text-indigo-750 border-indigo-200/50',
      btnClass: 'bg-indigo-650 bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200/40 focus:ring-indigo-500',
      btnSecondary: 'border-indigo-200 text-indigo-750 hover:bg-indigo-50',
      summaryBg: 'bg-[#2E2E3D]', // Dark indigo
      summaryText: 'text-indigo-200',
      heroImage: '/images/birthday_deco.png',
      patternClass: 'from-indigo-100/30 via-transparent to-transparent'
    };
  }

  // 3. Corporate Theme (Professional Sage & Slate)
  if (normalized.includes('corp') || normalized.includes('corporate') || normalized.includes('meet') || normalized.includes('meeting') || normalized.includes('office') || normalized.includes('gala') || normalized.includes('conference') || normalized.includes('summit')) {
    return {
      name: 'Corporate',
      bgClass: 'bg-[#F4F6F4]', // Soft sage/gray tint
      cardBg: 'bg-white',
      accentText: 'text-emerald-800',
      accentBg: 'bg-emerald-50',
      accentBorder: 'border-emerald-100/80',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-250',
      btnClass: 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-emerald-200/40 focus:ring-emerald-600',
      btnSecondary: 'border-emerald-200 text-emerald-850 hover:bg-emerald-50',
      summaryBg: 'bg-[#242D28]', // Deep slate forest
      summaryText: 'text-emerald-200',
      heroImage: '/images/corporate_event.png',
      patternClass: 'from-emerald-100/30 via-transparent to-transparent'
    };
  }

  // 4. Default Theme (Sophisticated Sand & Cream)
  return {
    name: 'Bespoke',
    bgClass: 'bg-[#FAF8F5]', // Elegant sand/cream tint
    cardBg: 'bg-white',
    accentText: 'text-amber-800',
    accentBg: 'bg-amber-50',
    accentBorder: 'border-amber-100/80',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/50',
    btnClass: 'bg-amber-800 hover:bg-amber-900 text-white shadow-amber-200/40 focus:ring-amber-600',
    btnSecondary: 'border-amber-250 text-amber-800 hover:bg-amber-50',
    summaryBg: 'bg-[#3A332B]', // Rich warm charcoal
    summaryText: 'text-amber-200',
    heroImage: '/images/marriage_deco.png', // Default wedding stage
    patternClass: 'from-amber-100/30 via-transparent to-transparent'
  };
};
