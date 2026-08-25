import React, { useState } from 'react';
import {
  LanguageCode,
  RegionInfo
} from './types';
import { INITIAL_REGIONS } from './data/mockData';
import { translations } from './i18n/translations';
import { Header } from './components/Header';
import { WeatherAndCrops } from './components/WeatherAndCrops';
import { MarketplaceAndNegotiation } from './components/MarketplaceAndNegotiation';
import { AgronomyDoctor } from './components/AgronomyDoctor';
import { CommunityForum } from './components/CommunityForum';
import { Sprout, PhoneCall, Heart, Sparkles, Volume2, ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'weather' | 'marketplace' | 'agronomy' | 'forum'>('weather');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [regions] = useState<RegionInfo[]>(INITIAL_REGIONS);
  const [selectedRegion, setSelectedRegion] = useState<RegionInfo>(INITIAL_REGIONS[0]);

  const t = translations[language] || translations.en;

  return (
    <div className="min-h-screen bg-[#f7f6f2] text-stone-900 flex flex-col font-sans antialiased selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Bento Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={setLanguage}
        regions={regions}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
      />

      {/* Main Content Area in Bento Grid container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {currentTab === 'weather' && (
          <WeatherAndCrops
            selectedRegion={selectedRegion}
            language={language}
            onSelectCropForMarket={() => setCurrentTab('marketplace')}
          />
        )}

        {currentTab === 'marketplace' && (
          <MarketplaceAndNegotiation language={language} />
        )}

        {currentTab === 'agronomy' && (
          <AgronomyDoctor language={language} />
        )}

        {currentTab === 'forum' && (
          <CommunityForum language={language} />
        )}
      </main>

      {/* Bento Footer */}
      <footer className="bg-stone-900 text-stone-300 py-6 px-4 text-xs mt-auto border-t border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 font-bold text-stone-100">
            <div className="w-7 h-7 rounded-xl bg-emerald-500 text-stone-950 flex items-center justify-center font-black shadow-sm">
              <Sprout className="w-4 h-4" />
            </div>
            <span className="font-heading tracking-tight text-sm">AgriSetu (एग्री सेतु) • Digital Farmer Hub & Marketplace</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800/60">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified APMC Data
            </span>
            <span className="inline-flex items-center gap-1.5 text-amber-300 font-semibold bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-800/60">
              <Sparkles className="w-3.5 h-3.5" />
              Gemini Agronomy Intelligence
            </span>
          </div>

          <div className="text-stone-400 text-[11px] font-medium">
            Empowering Diverse Farming Communities Across Odisha & India in 9 Regional Languages
          </div>
        </div>
      </footer>
    </div>
  );
}
