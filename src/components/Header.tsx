import React, { useState } from 'react';
import {
  Sprout,
  CloudSun,
  Store,
  Stethoscope,
  Users,
  Globe,
  MapPin,
  ChevronDown,
  Volume2,
  Bell,
  Sparkles
} from 'lucide-react';
import { LanguageCode, RegionInfo } from '../types';
import { SUPPORTED_LANGUAGES, translations } from '../i18n/translations';
import { audioSpeech } from '../utils/audioSpeech';

interface HeaderProps {
  currentTab: 'weather' | 'marketplace' | 'agronomy' | 'forum';
  setCurrentTab: (tab: 'weather' | 'marketplace' | 'agronomy' | 'forum') => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  regions: RegionInfo[];
  selectedRegion: RegionInfo;
  setSelectedRegion: (region: RegionInfo) => void;
  onOpenQuickGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  regions,
  selectedRegion,
  setSelectedRegion,
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const t = translations[language] || translations.en;
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const handleLangSelect = (code: LanguageCode) => {
    setLanguage(code);
    setLangDropdownOpen(false);
    audioSpeech.stop();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#13221b] text-stone-100 shadow-md border-b border-stone-800/80">
      {/* Top Bento Utility Bar */}
      <div className="bg-[#0b1611] px-4 py-2 border-b border-stone-800/60 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-stone-300">
            <span className="inline-flex items-center gap-1.5 bg-emerald-950 px-2.5 py-0.5 rounded-full font-semibold text-emerald-400 border border-emerald-800/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Agro Feed
            </span>
            <span className="hidden sm:inline text-stone-400">
              Regional Mandis Active • Weather Advisory Live
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Region Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
                className="flex items-center gap-1.5 bg-stone-900/90 hover:bg-stone-800 text-stone-200 px-3 py-1 rounded-xl border border-stone-700/70 transition-all font-semibold text-xs cursor-pointer shadow-xs"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span className="max-w-[140px] sm:max-w-[200px] truncate">{selectedRegion.name}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {regionDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-72 bg-white text-stone-900 rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-1.5 text-[11px] font-bold text-stone-500 uppercase tracking-wider border-b border-stone-100 font-heading">
                    {t.selectRegion}
                  </div>
                  <div className="max-h-64 overflow-y-auto py-1">
                    {regions.map((reg) => (
                      <button
                        key={reg.id}
                        type="button"
                        onClick={() => {
                          setSelectedRegion(reg);
                          setRegionDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 text-xs hover:bg-emerald-50/70 flex items-start justify-between gap-2 transition-colors cursor-pointer ${
                          selectedRegion.id === reg.id ? 'bg-emerald-50 font-bold text-emerald-950' : 'text-stone-700'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-stone-900">{reg.name}</div>
                          <div className="text-[11px] text-stone-500">{reg.stateOrCountry} • {reg.avgRainfallMm}mm rain</div>
                        </div>
                        <span className="text-emerald-800 font-bold text-[11px] bg-emerald-100 px-2 py-0.5 rounded-md">
                          {reg.currentTemp}°C
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 bg-stone-900/90 hover:bg-stone-800 text-stone-100 px-3 py-1 rounded-xl border border-stone-700/70 transition-all font-semibold text-xs cursor-pointer shadow-xs"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentLangObj.flag}</span>
                <span className="font-bold">{currentLangObj.nativeName}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-56 bg-white text-stone-900 rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-1.5 text-[11px] font-bold text-stone-500 uppercase tracking-wider border-b border-stone-100 flex items-center justify-between font-heading">
                    <span>Language / भाषा</span>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="max-h-64 overflow-y-auto py-1">
                    {SUPPORTED_LANGUAGES.map((langItem) => (
                      <button
                        key={langItem.code}
                        type="button"
                        onClick={() => handleLangSelect(langItem.code)}
                        className={`w-full text-left px-3.5 py-2 text-xs hover:bg-emerald-50/70 flex items-center justify-between transition-colors cursor-pointer ${
                          language === langItem.code ? 'bg-emerald-50 font-bold text-emerald-950' : 'text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{langItem.flag}</span>
                          <span>{langItem.nativeName}</span>
                        </div>
                        <span className="text-[11px] text-stone-400 font-normal">({langItem.name})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header & Brand Bento Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-400 flex items-center justify-center shadow-lg text-stone-950 flex-shrink-0 font-black">
            <Sprout className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2 font-heading">
                {t.appName}
                <span className="text-[10px] font-sans font-extrabold bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Kisan Hub
                </span>
              </h1>
            </div>
            <p className="text-xs text-stone-300 line-clamp-1 font-medium">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Bento Pill Navigation Tabs */}
        <nav className="flex items-center gap-1.5 sm:gap-2 bg-stone-900/80 p-1.5 rounded-2xl border border-stone-800 overflow-x-auto pb-1 md:pb-1.5 scrollbar-none">
          <button
            type="button"
            onClick={() => setCurrentTab('weather')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'weather'
                ? 'bg-amber-400 text-stone-950 shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
            }`}
          >
            <CloudSun className="w-4 h-4 flex-shrink-0" />
            <span>{t.navWeatherCrops}</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('marketplace')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'marketplace'
                ? 'bg-amber-400 text-stone-950 shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
            }`}
          >
            <Store className="w-4 h-4 flex-shrink-0" />
            <span>{t.navMarketplace}</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('agronomy')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'agronomy'
                ? 'bg-amber-400 text-stone-950 shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
            }`}
          >
            <Stethoscope className="w-4 h-4 flex-shrink-0" />
            <span>{t.navAgronomy}</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('forum')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'forum'
                ? 'bg-amber-400 text-stone-950 shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
            }`}
          >
            <Users className="w-4 h-4 flex-shrink-0" />
            <span>{t.navForum}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
