import React, { useState, useEffect } from 'react';
import {
  Activity,
  Sprout,
  Stethoscope,
  MessageSquare,
  History,
  Cpu,
  Presentation,
  Sparkles,
  Menu,
  X,
  ChevronRight,
  Radio,
  CloudSun,
  ShoppingBag,
} from 'lucide-react';
import { FarmerProfile, WeatherSnapshot } from '../types/index.ts';
import { useApp } from '../context/AppContext.tsx';
import { LanguageToggle } from './LanguageToggle.tsx';
import { PWAInstallButton } from './PWAInstallButton.tsx';
import { AccessibilityToolbar } from './AccessibilityToolbar.tsx';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  farmer: FarmerProfile;
  weather?: WeatherSnapshot | null;
  onLoadDemoScenario: () => void;
  isScenarioLoading: boolean;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  farmer,
  weather,
  onLoadDemoScenario,
  isScenarioLoading,
  onOpenProfile,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, language } = useApp();

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { id: 'dashboard', label: t('navDashboard'), icon: Activity },
    { id: 'marketplace', label: language === 'sw' ? 'Soko la Mazao' : 'Marketplace', icon: ShoppingBag },
    { id: 'farm-analysis', label: t('navFarmAnalysis'), icon: Sprout },
    { id: 'crop-doctor', label: t('navCropDoctor'), icon: Stethoscope },
    { id: 'agronomist', label: t('navAgronomist'), icon: MessageSquare },
    { id: 'history', label: t('navHistory'), icon: History },
    { id: 'metrics', label: t('navMetrics'), icon: Cpu },
    { id: 'about', label: t('navAbout'), icon: Presentation },
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format today's live date
  const todayFormatted = new Intl.DateTimeFormat(language === 'sw' ? 'sw-KE' : 'en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-3 sm:gap-4">
          {/* 1. Left: Brand Identity & Live Day Indicator */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleSelectTab('dashboard')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="h-9 w-9 rounded-xl bg-white text-white font-black text-sm flex items-center justify-center shadow-xs border border-emerald-100 group-hover:scale-105 transition-transform overflow-hidden p-1">
                <img src="/icon.svg" alt="Smart Shamba 360 Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold tracking-tight text-slate-950">
                    Smart Shamba <span className="text-[#15532E]">360</span>
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase -mt-0.5">
                  {language === 'sw' ? 'Uchambuzi wa Shamba' : 'Agro Decision Engine'}
                </span>
              </div>
            </button>

            {/* Live Day Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{todayFormatted}</span>
            </div>
          </div>

          {/* 2. Center: Desktop Clean Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-900 font-extrabold border border-emerald-200/70 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* 3. Right: Tools, Language, Accessibility & User Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Live Weather Indicator */}
            {weather && (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50/80 border border-blue-100 text-blue-900 text-xs font-bold">
                <CloudSun className="w-3.5 h-3.5 text-blue-600" />
                <span>{weather.temperatureC}°C</span>
                <span className="text-[10px] text-blue-600 font-medium hidden xl:inline">
                  • {weather.county}
                </span>
              </div>
            )}

            {/* Accessibility & Low-Vision Options */}
            <AccessibilityToolbar />

            {/* Language Switcher */}
            <LanguageToggle variant="header" />

            {/* Demo Mode Button (Desktop) */}
            <button
              onClick={onLoadDemoScenario}
              disabled={isScenarioLoading}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              title={t('loadDemoScenario')}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{isScenarioLoading ? '...' : t('demoMode')}</span>
            </button>

            {/* Farmer Profile Avatar */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1 pl-2 sm:pr-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer min-h-[38px]"
              title={t('editProfile')}
              aria-label="Edit farmer profile"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                {farmer.name.charAt(0)}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold leading-tight max-w-[90px] truncate">
                  {farmer.name.split(' ')[0]}
                </span>
                <span className="text-[9px] text-slate-300 leading-tight">
                  {farmer.county}
                </span>
              </div>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 active:bg-slate-200 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Smooth Responsive Mobile Drawer / Slide-Over (Non-sticky, clean, comfortable) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          {/* Backdrop dismiss touch area */}
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />

          {/* Slide-in Panel */}
          <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto p-5 animate-in slide-in-from-right duration-250">
            <div className="space-y-5">
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center">
                    <Sprout className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">MKULIMA AI</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] text-emerald-800 font-bold">
                        {todayFormatted} (Live)
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Farmer Profile Card in Mobile Menu */}
              <div
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenProfile();
                }}
                className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between cursor-pointer active:scale-[0.99] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-600 font-bold flex items-center justify-center text-sm shadow-xs">
                    {farmer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold">{farmer.name}</p>
                    <p className="text-[10px] text-slate-300">
                      {farmer.county} County • {farmer.farmSizeAcres} {language === 'sw' ? 'Ekari' : 'Acres'} • {farmer.currentCrop}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              {/* Navigation Items List */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                  {language === 'sw' ? 'Sehemu za Programu' : 'Application Sections'}
                </span>
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[48px] ${
                        isActive
                          ? 'bg-emerald-600 text-white font-extrabold shadow-sm'
                          : 'text-slate-700 hover:bg-slate-100 active:bg-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-emerald-200' : 'text-slate-300'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              {/* Demo Mode Button */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLoadDemoScenario();
                }}
                disabled={isScenarioLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all cursor-pointer min-h-[44px]"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{isScenarioLoading ? '...' : t('loadDemoScenario')}</span>
              </button>

              <PWAInstallButton className="w-full justify-center py-2.5" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
