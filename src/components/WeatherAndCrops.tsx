import React, { useState } from 'react';
import {
  CloudSun,
  Droplets,
  Wind,
  Layers,
  Thermometer,
  Calendar,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Send,
  Loader2,
  CheckCircle2,
  Info,
  BadgePercent,
  Search,
  Filter,
  Volume2
} from 'lucide-react';
import { RegionInfo, SuitableCrop, SoilType, IrrigationType, SeasonType, LanguageCode } from '../types';
import { CROPS_CATALOG } from '../data/mockData';
import { translations } from '../i18n/translations';
import { VoiceReaderButton } from './VoiceReaderButton';

interface WeatherAndCropsProps {
  selectedRegion: RegionInfo;
  language: LanguageCode;
  onSelectCropForMarket?: (crop: SuitableCrop) => void;
}

export const WeatherAndCrops: React.FC<WeatherAndCropsProps> = ({
  selectedRegion,
  language,
  onSelectCropForMarket,
}) => {
  const t = translations[language] || translations.en;

  const [selectedSoil, setSelectedSoil] = useState<SoilType>(selectedRegion.majorSoil);
  const [selectedIrrigation, setSelectedIrrigation] = useState<IrrigationType>('canal');
  const [selectedSeason, setSelectedSeason] = useState<SeasonType>('kharif');
  const [activeCropModal, setActiveCropModal] = useState<SuitableCrop | null>(null);

  // AI Advisor state
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // Calculate dynamic suitability score for crops based on user inputs
  const scoredCrops = CROPS_CATALOG.map((crop) => {
    let score = crop.suitabilityScore;

    // Soil match adjustment
    if (crop.optimalSoil.includes(selectedSoil)) {
      score += 4;
    } else {
      score -= 12;
    }

    // Irrigation adjustment
    if (crop.waterRequirement === 'High' && (selectedIrrigation === 'rainfed' || selectedIrrigation === 'limited')) {
      score -= 18;
    } else if (crop.waterRequirement === 'Low' && selectedIrrigation === 'borewell_drip') {
      score += 2;
    }

    // Season match adjustment
    if (crop.season === selectedSeason || crop.season === 'annual') {
      score += 3;
    } else {
      score -= 10;
    }

    // Clamp score
    const finalScore = Math.max(45, Math.min(99, score));
    return { ...crop, dynamicScore: finalScore };
  }).sort((a, b) => b.dynamicScore - a.dynamicScore);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim() && !aiResponse) {
      setAiQuestion('What are the best companion crops and soil preparation steps for this season?');
    }
    setAiLoading(true);
    try {
      const response = await fetch('/api/gemini/crop-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region: selectedRegion.name,
          soilType: selectedSoil,
          irrigation: selectedIrrigation,
          season: selectedSeason,
          userQuery: aiQuestion || 'Provide top crop recommendations and soil health management for this region.',
          language: language,
        }),
      });
      const data = await response.json();
      if (data.recommendation) {
        setAiResponse(data.recommendation);
      }
    } catch (err) {
      console.error(err);
      setAiResponse(
        `For ${selectedRegion.name} with ${selectedSoil} soil: We recommend soil testing for organic carbon and incorporating green manure (Dhaincha). Top suited crops are Wheat/Paddy hybrids and Mustard with balanced NPK (120:60:40) and micronutrient Zinc Sulfate.`
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Regional Weather & Agricultural Meteorological Bento Tile */}
      <div className="bg-[#122019] text-stone-100 rounded-3xl p-5 sm:p-7 shadow-sm border border-stone-800 relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-400 text-stone-950 font-bold text-xs px-3 py-0.5 rounded-full uppercase tracking-wider">
                {selectedRegion.stateOrCountry}
              </span>
              <span className="text-xs text-stone-300 font-medium">
                {selectedRegion.climateZone}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-heading">
              {selectedRegion.name}
            </h2>
            <p className="text-sm text-stone-300 mt-1 flex items-center gap-2 font-medium">
              <CloudSun className="w-4 h-4 text-amber-400" />
              <span>{selectedRegion.condition}</span>
            </p>
          </div>

          {/* Core Metrics Bento Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-900/90 p-3.5 rounded-2xl border border-stone-800/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-400/15 text-amber-400">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-stone-400 font-medium">{t.currentWeather}</div>
                <div className="text-lg font-black text-white">{selectedRegion.currentTemp}°C</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-400/15 text-cyan-400">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-stone-400 font-medium">{t.humidity}</div>
                <div className="text-lg font-black text-white">{selectedRegion.currentHumidity}%</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-400/15 text-emerald-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-stone-400 font-medium">{t.soilMoisture}</div>
                <div className="text-lg font-black text-white">{selectedRegion.soilMoisturePct}%</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-400/15 text-teal-400">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-stone-400 font-medium">{t.windSpeed}</div>
                <div className="text-lg font-black text-white">{selectedRegion.windKmh} km/h</div>
              </div>
            </div>
          </div>
        </div>

        {/* Agricultural Advisory Callout */}
        <div className="mt-5 pt-4 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-950/60 -mx-5 -mb-5 sm:-mx-7 sm:-mb-7 p-4 sm:p-5 rounded-b-3xl">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-400 text-stone-950 flex-shrink-0 mt-0.5">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider font-heading">
                {t.agriculturalAdvisory}
              </div>
              <p className="text-xs sm:text-sm text-stone-200 mt-0.5 leading-relaxed font-medium">
                {selectedRegion.weatherAdvisory}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 self-end sm:self-center">
            <VoiceReaderButton
              text={`${t.agriculturalAdvisory}: ${selectedRegion.weatherAdvisory}`}
              lang={language}
              variant="pill"
              label={t.readAloud}
            />
          </div>
        </div>
      </div>

      {/* 5-Day Agro Weather Forecast Bento Strip */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200/90">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-2 font-heading">
          <Calendar className="w-4 h-4 text-emerald-700" />
          <span>5-Day Sowing & Irrigation Forecast</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {selectedRegion.forecast.map((fc, i) => (
            <div
              key={i}
              className="bg-stone-50/90 rounded-2xl p-3.5 border border-stone-200/80 text-center hover:border-emerald-500 hover:bg-emerald-50/20 transition-all shadow-2xs"
            >
              <div className="text-xs font-bold text-stone-800">{fc.day}</div>
              <div className="text-xs text-stone-500 my-1 font-medium">{fc.condition}</div>
              <div className="text-sm font-black text-stone-900">
                {fc.tempMax}° / <span className="text-stone-500 font-medium text-xs">{fc.tempMin}°</span>
              </div>
              <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                <Droplets className="w-3 h-3 text-emerald-600" />
                <span>{fc.rainChance}% rain</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Interactive Soil, Season & Irrigation Match Engine */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200/90">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-100">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2 font-heading">
              <Sparkles className="w-5 h-5 text-emerald-700" />
              <span>{t.cropRecommendations}</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Personalized crop suitability matrix calculated for your farm parameters
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Season Selector */}
            <div className="flex items-center gap-1.5 bg-stone-100 p-1.5 rounded-2xl text-xs font-medium border border-stone-200/60">
              {(['kharif', 'rabi', 'zaid'] as SeasonType[]).map((sn) => (
                <button
                  key={sn}
                  type="button"
                  onClick={() => setSelectedSeason(sn)}
                  className={`px-3 py-1.5 rounded-xl capitalize transition-all cursor-pointer font-semibold ${
                    selectedSeason === sn
                      ? 'bg-stone-900 text-amber-300 font-bold shadow-xs'
                      : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  {sn === 'kharif' ? 'Kharif (Monsoon)' : sn === 'rabi' ? 'Rabi (Winter)' : 'Zaid (Summer)'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Soil & Irrigation Parameter Dropdowns Bento Tile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5 bg-stone-50/90 p-4 sm:p-5 rounded-2xl border border-stone-200/80">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider font-heading">
              {t.soilType}
            </label>
            <select
              value={selectedSoil}
              onChange={(e) => setSelectedSoil(e.target.value as SoilType)}
              className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-800 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-2xs"
            >
              <option value="alluvial">Alluvial Soil (जलोढ़ मिट्टी / Fertile plains)</option>
              <option value="black">Black Cotton Soil (काली मिट्टी / High moisture retain)</option>
              <option value="red_loamy">Red Loamy Soil (लाल मिट्टी / Good drainage)</option>
              <option value="sandy_loam">Sandy Loam Soil (रेतीली दोमट / Arid zones)</option>
              <option value="clayey">Clayey Heavy Soil (चिकनी मिट्टी / Paddy friendly)</option>
              <option value="laterite">Laterite Soil (लेटराइट / Plantation crops)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider font-heading">
              {t.irrigationType}
            </label>
            <select
              value={selectedIrrigation}
              onChange={(e) => setSelectedIrrigation(e.target.value as IrrigationType)}
              className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-800 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-2xs"
            >
              <option value="canal">Canal / River Water Ingress (Abundant)</option>
              <option value="borewell_drip">Tube-well + Micro Drip/Sprinkler (Controlled)</option>
              <option value="rainfed">Rainfed / Monsoon Reliant (Dryland)</option>
              <option value="limited">Limited Seasonal Ground Water (Water-stressed)</option>
            </select>
          </div>
        </div>

        {/* Suitable Crops Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {scoredCrops.map((crop) => (
            <div
              key={crop.id}
              className="group bg-white rounded-3xl border border-stone-200/90 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col overflow-hidden"
            >
              {/* Image & Match Badge */}
              <div className="relative h-40 w-full overflow-hidden bg-stone-100">
                <img
                  src={crop.imageUrl}
                  alt={crop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent" />

                {/* Score Badge */}
                <div className="absolute top-3 left-3 bg-emerald-700 text-white font-black text-xs px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 border border-emerald-500">
                  <BadgePercent className="w-3.5 h-3.5" />
                  <span>{crop.dynamicScore}% {t.suitabilityMatch}</span>
                </div>

                {/* Market Demand Chip */}
                <div className="absolute top-3 right-3 bg-amber-400 text-stone-950 font-bold text-[11px] px-2.5 py-0.5 rounded-full shadow">
                  Demand: {crop.marketDemand}
                </div>

                <div className="absolute bottom-2.5 left-3.5 right-3.5 text-white">
                  <h4 className="text-base font-bold drop-shadow leading-tight font-heading">{crop.name}</h4>
                  <div className="text-[11px] text-stone-300 italic">{crop.scientificName}</div>
                </div>
              </div>

              {/* Crop Stats Bento sub-tiles */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-stone-50/90 p-2.5 rounded-xl border border-stone-200/70">
                    <div className="text-stone-500 text-[11px]">{t.expectedYield}</div>
                    <div className="font-bold text-stone-900">{crop.expectedYieldPerAcre}</div>
                  </div>
                  <div className="bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200/70">
                    <div className="text-emerald-800 text-[11px] font-semibold">{t.estProfit}</div>
                    <div className="font-bold text-emerald-950">{crop.estProfitPerAcre}</div>
                  </div>
                  <div className="bg-stone-50/90 p-2.5 rounded-xl border border-stone-200/70">
                    <div className="text-stone-500 text-[11px]">{t.growthCycle}</div>
                    <div className="font-bold text-stone-900">{crop.growthDurationDays} {t.days}</div>
                  </div>
                  <div className="bg-stone-50/90 p-2.5 rounded-xl border border-stone-200/70">
                    <div className="text-stone-500 text-[11px]">{t.sowingWindow}</div>
                    <div className="font-bold text-stone-900 truncate">{crop.bestSowingWindow}</div>
                  </div>
                </div>

                {/* Key practice bullet */}
                <p className="text-xs text-stone-600 line-clamp-2 italic bg-stone-50/80 p-2.5 rounded-xl border-l-2 border-emerald-700">
                  "{crop.keyPractices[0]}"
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveCropModal(crop)}
                    className="flex-1 py-2.5 px-3 bg-stone-900 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>{t.viewCropDetails}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <VoiceReaderButton
                    text={`${crop.name}. Suitability score: ${crop.dynamicScore} percent. Expected yield: ${crop.expectedYieldPerAcre}. Estimated profit: ${crop.estProfitPerAcre}. Sowing window: ${crop.bestSowingWindow}. Key practice: ${crop.keyPractices.join('. ')}`}
                    lang={language}
                    variant="compact"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. AI Regional Agronomy & Soil Intelligence Bento Box */}
      <div className="bg-[#122019] text-stone-100 rounded-3xl p-5 sm:p-7 shadow-sm border border-stone-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-2xl bg-amber-400 text-stone-950 font-black">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-heading">
              AI Regional Agronomy & Crop Advisory
            </h3>
            <p className="text-xs text-stone-300 font-medium">
              Powered by Gemini Agri-LLM • Real-time soil, seed and fertilizer formulation
            </p>
          </div>
        </div>

        <form onSubmit={handleAskAI} className="mt-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              placeholder={t.aiCropAdvisorPrompt}
              className="flex-1 bg-stone-900/90 border border-stone-700 text-white placeholder-stone-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
            />
            <button
              type="submit"
              disabled={aiLoading}
              className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer disabled:opacity-50 shadow-xs"
            >
              {aiLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Soil...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t.askAiAdvisor}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {aiResponse && (
          <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-stone-900/90 border border-stone-800 text-sm leading-relaxed relative animate-in fade-in duration-200">
            <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-stone-800">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider font-heading">
                <CheckCircle2 className="w-4 h-4" />
                Agronomist Analysis
              </span>
              <VoiceReaderButton text={aiResponse} lang={language} variant="pill" label={t.readAloud} />
            </div>
            <div className="text-stone-200 whitespace-pre-line text-xs sm:text-sm font-sans">
              {aiResponse}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Full Crop Details & Management Blueprint */}
      {activeCropModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 space-y-5">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-stone-100">
              <div>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full uppercase">
                  {activeCropModal.category}
                </span>
                <h3 className="text-xl font-bold text-stone-900 mt-1 font-heading">{activeCropModal.name}</h3>
                <p className="text-xs text-stone-500 italic">{activeCropModal.scientificName}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveCropModal(null)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200/70">
              <div>
                <div className="text-[11px] text-stone-500">{t.suitabilityMatch}</div>
                <div className="text-base font-bold text-emerald-800">{activeCropModal.suitabilityScore}%</div>
              </div>
              <div>
                <div className="text-[11px] text-stone-500">{t.expectedYield}</div>
                <div className="text-base font-bold text-stone-800">{activeCropModal.expectedYieldPerAcre}</div>
              </div>
              <div>
                <div className="text-[11px] text-stone-500">{t.estProfit}</div>
                <div className="text-base font-bold text-emerald-800">{activeCropModal.estProfitPerAcre}</div>
              </div>
              <div>
                <div className="text-[11px] text-stone-500">{t.growthCycle}</div>
                <div className="text-base font-bold text-stone-800">{activeCropModal.growthDurationDays} {t.days}</div>
              </div>
            </div>

            {/* Key Practices */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2 flex items-center gap-1.5 font-heading">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Scientific Cultivation & High-Yield Blueprint</span>
              </h4>
              <ul className="space-y-2">
                {activeCropModal.keyPractices.map((practice, idx) => (
                  <li key={idx} className="text-xs text-stone-700 bg-stone-50/90 p-2.5 rounded-xl border border-stone-200/70 flex items-start gap-2">
                    <span className="font-bold text-emerald-800">{idx + 1}.</span>
                    <span>{practice}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pest Risks & Shields */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2 flex items-center gap-1.5 font-heading">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Pest & Disease Vulnerabilities to Monitor</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeCropModal.pestRisks.map((pest, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full font-medium"
                  >
                    ⚠️ {pest}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-100">
              <VoiceReaderButton
                text={`Farming guide for ${activeCropModal.name}. ${activeCropModal.keyPractices.join('. ')}. Major pest risks to monitor: ${activeCropModal.pestRisks.join(', ')}`}
                lang={language}
                variant="full"
                label={t.readAloud}
              />
              <button
                type="button"
                onClick={() => setActiveCropModal(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
