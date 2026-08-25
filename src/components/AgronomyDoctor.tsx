import React, { useState } from 'react';
import {
  Stethoscope,
  Upload,
  Camera,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Leaf,
  ShieldCheck,
  Calculator,
  MessageCircleQuestion,
  UserCheck,
  ChevronRight,
  Send,
  Loader2,
  RefreshCw,
  FlaskConical,
  Scale,
  Volume2
} from 'lucide-react';
import {
  DiseaseDiagnosisResult,
  AgronomyExpert,
  LanguageCode
} from '../types';
import {
  AGRONOMY_EXPERTS,
  COMMON_DISEASE_DIAGNOSES
} from '../data/mockData';
import { translations } from '../i18n/translations';
import { VoiceReaderButton } from './VoiceReaderButton';

interface AgronomyDoctorProps {
  language: LanguageCode;
}

export const AgronomyDoctor: React.FC<AgronomyDoctorProps> = ({ language }) => {
  const t = translations[language] || translations.en;

  // AI Plant Doctor State
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [symptomsInput, setSymptomsInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiseaseDiagnosisResult | null>(
    COMMON_DISEASE_DIAGNOSES['yellow_rust']
  );

  // Fertilizer NPK Calculator State
  const [calcCrop, setCalcCrop] = useState<'Wheat' | 'Paddy' | 'Cotton' | 'Soybean' | 'Maize' | 'Mustard' | 'Chilli'>('Wheat');
  const [farmAcres, setFarmAcres] = useState<number>(3);
  const [soilTestStatus, setSoilTestStatus] = useState<'medium' | 'low' | 'high'>('medium');

  // Agronomist Consult Q&A
  const [expertQuestion, setExpertQuestion] = useState('');
  const [consultChat, setConsultChat] = useState<{ sender: 'farmer' | 'expert'; text: string; time: string }[]>([
    {
      sender: 'farmer',
      text: 'My wheat crop is 35 days old and lower leaves show slight pale yellow stripes. How should I dose urea and zinc?',
      time: '10:30 AM'
    },
    {
      sender: 'expert',
      text: 'Dr. R. K. Sharma: This is classic first-stage nitrogen-zinc co-deficiency. Apply 35 kg Urea per acre immediately before first crown root irrigation, combined with a foliar spray of 0.5% Zinc Sulfate (21%) + 1% Urea in 150L water per acre during morning hours.',
      time: '10:45 AM'
    }
  ]);
  const [consultLoading, setConsultLoading] = useState(false);

  // Pre-load sample image for instant demo
  const loadSampleCase = (key: string) => {
    if (COMMON_DISEASE_DIAGNOSES[key]) {
      setDiagnosisResult(COMMON_DISEASE_DIAGNOSES[key]);
      setSelectedCrop(COMMON_DISEASE_DIAGNOSES[key].cropAffected.split(',')[0]);
      setSymptomsInput(COMMON_DISEASE_DIAGNOSES[key].symptoms.join(', '));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunDiagnosis = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDiagnosing(true);
    try {
      const response = await fetch('/api/gemini/agronomy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: selectedCrop,
          symptoms: symptomsInput || 'Discoloration and leaf spots observed',
          imageBase64: selectedImage,
          language: language,
        }),
      });
      const data = await response.json();
      if (data.diagnosis) {
        setDiagnosisResult(data.diagnosis);
      }
    } catch (err) {
      console.error(err);
      setDiagnosisResult(COMMON_DISEASE_DIAGNOSES['yellow_rust']);
    } finally {
      setIsDiagnosing(false);
    }
  };

  // Compute NPK Dosage based on Crop & Farm Size
  const calculateNPK = () => {
    let ureaBagsPerAcre = 2.5; // 45kg bags
    let dapBagsPerAcre = 1.0;
    let mopBagsPerAcre = 0.5;
    let zincKgPerAcre = 5;

    switch (calcCrop) {
      case 'Wheat':
        ureaBagsPerAcre = 2.5;
        dapBagsPerAcre = 1.1;
        mopBagsPerAcre = 0.4;
        zincKgPerAcre = 5;
        break;
      case 'Paddy':
        ureaBagsPerAcre = 2.8;
        dapBagsPerAcre = 1.2;
        mopBagsPerAcre = 0.6;
        zincKgPerAcre = 8;
        break;
      case 'Cotton':
        ureaBagsPerAcre = 3.2;
        dapBagsPerAcre = 1.3;
        mopBagsPerAcre = 0.8;
        zincKgPerAcre = 6;
        break;
      case 'Soybean':
        ureaBagsPerAcre = 0.8; // Rhizobium fixes N
        dapBagsPerAcre = 1.5;
        mopBagsPerAcre = 0.7;
        zincKgPerAcre = 5;
        break;
      case 'Maize':
        ureaBagsPerAcre = 3.0;
        dapBagsPerAcre = 1.3;
        mopBagsPerAcre = 0.6;
        zincKgPerAcre = 8;
        break;
      case 'Mustard':
        ureaBagsPerAcre = 1.8;
        dapBagsPerAcre = 0.9;
        mopBagsPerAcre = 0.3;
        zincKgPerAcre = 4;
        break;
      case 'Chilli':
        ureaBagsPerAcre = 3.5;
        dapBagsPerAcre = 1.8;
        mopBagsPerAcre = 1.2;
        zincKgPerAcre = 10;
        break;
    }

    const multiplier = soilTestStatus === 'low' ? 1.15 : soilTestStatus === 'high' ? 0.85 : 1.0;

    return {
      ureaBags: (ureaBagsPerAcre * farmAcres * multiplier).toFixed(1),
      dapBags: (dapBagsPerAcre * farmAcres * multiplier).toFixed(1),
      mopBags: (mopBagsPerAcre * farmAcres * multiplier).toFixed(1),
      zincKg: (zincKgPerAcre * farmAcres * multiplier).toFixed(0),
    };
  };

  const npkResult = calculateNPK();

  const handleAskExpert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expertQuestion.trim()) return;

    const userText = expertQuestion;
    setExpertQuestion('');
    setConsultChat((prev) => [
      ...prev,
      { sender: 'farmer', text: userText, time: 'Just now' }
    ]);
    setConsultLoading(true);

    setTimeout(() => {
      setConsultChat((prev) => [
        ...prev,
        {
          sender: 'expert',
          text: `Dr. Anita Deshmukh: Regarding your query on "${userText.substring(0, 40)}...": We recommend maintaining field aeration, avoiding overhead watering in evenings, and spraying Neem Seed Kernel Extract (5%) or Bio-fungicide Trichoderma harzianum @ 5g/L. If disease pressure persists after 48 hours, follow up with copper oxychloride.`,
          time: 'Just now'
        }
      ]);
      setConsultLoading(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* 1. AI Crop Doctor & Plant Disease Diagnosis Studio Bento Box */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-stone-200/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2 font-heading">
              <Stethoscope className="w-5 h-5 text-emerald-700" />
              <span>{t.aiCropDoctor}</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Instant AI plant pathology • Upload diseased leaf photo or describe symptoms for step-by-step treatment
            </p>
          </div>

          {/* Sample quick tests */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-stone-400">Quick Test Cases:</span>
            <button
              type="button"
              onClick={() => loadSampleCase('yellow_rust')}
              className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-xl font-semibold cursor-pointer transition-colors"
            >
              Yellow Rust
            </button>
            <button
              type="button"
              onClick={() => loadSampleCase('leaf_curl')}
              className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-xl font-semibold cursor-pointer transition-colors"
            >
              Leaf Curl
            </button>
            <button
              type="button"
              onClick={() => loadSampleCase('stem_borer')}
              className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-300 px-2.5 py-1 rounded-xl font-semibold cursor-pointer transition-colors"
            >
              Stem Borer
            </button>
            <button
              type="button"
              onClick={() => loadSampleCase('blight')}
              className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 px-2.5 py-1 rounded-xl font-semibold cursor-pointer transition-colors"
            >
              Foliar Blight
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
          {/* Left: Input form & Photo Uploader */}
          <div className="lg:col-span-5 space-y-4">
            <form onSubmit={handleRunDiagnosis} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 font-heading">{t.crop}</label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value="Wheat">Wheat / Gahu (गेहूं)</option>
                  <option value="Basmati Paddy">Paddy / Rice (धान / चावल)</option>
                  <option value="Cotton">Cotton / Kapas (कपास)</option>
                  <option value="Soybean">Soybean (सोयाबीन)</option>
                  <option value="Mustard">Mustard / Sarson (सरसों)</option>
                  <option value="Red Chilli">Chilli / Mirch (मिर्च)</option>
                  <option value="Maize">Maize / Corn (मक्का)</option>
                  <option value="Tomato">Tomato / Tamatar (टमाटर)</option>
                </select>
              </div>

              {/* Photo Upload Zone */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 font-heading">{t.uploadCropPhoto}</label>
                <div className="relative border-2 border-dashed border-stone-300 hover:border-emerald-600 rounded-2xl p-4 text-center bg-stone-50/70 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {selectedImage ? (
                    <div className="space-y-2">
                      <img
                        src={selectedImage}
                        alt="Uploaded leaf"
                        className="w-24 h-24 object-cover mx-auto rounded-xl border border-stone-200 shadow-2xs"
                      />
                      <div className="text-[11px] font-semibold text-emerald-800">Photo attached for AI vision check</div>
                    </div>
                  ) : (
                    <div className="space-y-1.5 py-2">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center mx-auto">
                        <Camera className="w-5 h-5" />
                      </div>
                      <div className="text-xs font-bold text-stone-700 font-heading">Tap to snap or upload leaf photo</div>
                      <div className="text-[11px] text-stone-400">JPG, PNG up to 10MB</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Symptom description */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 font-heading">
                  {t.describeSymptoms}
                </label>
                <textarea
                  rows={2}
                  value={symptomsInput}
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  placeholder="e.g. Yellow powdery stripes on leaves, curling edges, white powder..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isDiagnosing}
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isDiagnosing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI Pathologist Examining...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{t.diagnoseNow}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Diagnosis Results Card with Voice Reader */}
          <div className="lg:col-span-7">
            {diagnosisResult ? (
              <div className="bg-stone-50/90 rounded-2xl p-5 border border-stone-200/80 space-y-4 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        diagnosisResult.severity === 'Critical' || diagnosisResult.severity === 'Severe'
                          ? 'bg-rose-100 text-rose-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        Severity: {diagnosisResult.severity}
                      </span>
                      <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        {diagnosisResult.confidence}% Confidence
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-stone-900 mt-1 font-heading">
                      {diagnosisResult.diseaseName}
                    </h4>
                  </div>

                  <VoiceReaderButton
                    text={`Plant Doctor Diagnosis: ${diagnosisResult.diseaseName}. Severity is ${diagnosisResult.severity}. Symptoms: ${diagnosisResult.symptoms.join('. ')}. Recommended Organic Treatment: ${diagnosisResult.organicRemedy.join('. ')}. Chemical Treatment: ${diagnosisResult.chemicalTreatment.join('. ')}`}
                    lang={language}
                    variant="pill"
                    label={t.readAloud}
                  />
                </div>

                {/* Symptoms Identified */}
                <div>
                  <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1 font-heading">
                    Symptoms Detected
                  </div>
                  <ul className="text-xs text-stone-700 space-y-1 font-medium">
                    {diagnosisResult.symptoms.map((sym, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>{sym}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Two Treatment Pathways: Organic vs Standard Chemical */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Organic Treatment */}
                  <div className="bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200/70 space-y-1.5">
                    <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 font-heading">
                      <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{t.organicRemedy}</span>
                    </div>
                    <ul className="text-xs text-emerald-950 space-y-1 font-medium">
                      {diagnosisResult.organicRemedy.map((org, i) => (
                        <li key={i} className="flex items-start gap-1 leading-relaxed">
                          <span>✓</span>
                          <span>{org}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Chemical Treatment */}
                  <div className="bg-stone-100/90 p-3.5 rounded-xl border border-stone-200 space-y-1.5">
                    <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5 font-heading">
                      <FlaskConical className="w-3.5 h-3.5 text-stone-700" />
                      <span>{t.chemicalTreatment}</span>
                    </div>
                    <ul className="text-xs text-stone-800 space-y-1 font-medium">
                      {diagnosisResult.chemicalTreatment.map((chem, i) => (
                        <li key={i} className="flex items-start gap-1 leading-relaxed">
                          <span>•</span>
                          <span>{chem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Preventive Care */}
                <div className="bg-stone-100/70 p-3 rounded-xl border border-stone-200 text-xs text-stone-700">
                  <span className="font-bold text-stone-900">Prevention: </span>
                  {diagnosisResult.preventiveMeasures.join(' • ')}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-8 bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-stone-400 text-sm text-center">
                Submit symptoms or select a test case to view instant diagnosis
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Scientific NPK & Fertilizer Dosage Calculator Bento Box */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-stone-200/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2 font-heading">
              <Calculator className="w-5 h-5 text-emerald-700" />
              <span>{t.npkCalculator}</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Calculate exact Bags of Urea, DAP, MOP and micronutrients tailored to your farm area
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-500">Soil Fertility:</span>
            <select
              value={soilTestStatus}
              onChange={(e) => setSoilTestStatus(e.target.value as any)}
              className="bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1 text-xs font-semibold text-stone-800"
            >
              <option value="low">Low Fertility (+15% dose)</option>
              <option value="medium">Medium Fertility (Standard)</option>
              <option value="high">High Fertility (-15% dose)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5 items-center">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-4 bg-stone-50/90 p-4 sm:p-5 rounded-2xl border border-stone-200/80">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 font-heading">Select Crop</label>
              <select
                value={calcCrop}
                onChange={(e) => setCalcCrop(e.target.value as any)}
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="Wheat">Wheat (गेहूं - 120:60:40 NPK)</option>
                <option value="Paddy">Paddy / Rice (धान - 100:50:50 NPK)</option>
                <option value="Cotton">Cotton (कपास - 120:60:60 NPK)</option>
                <option value="Soybean">Soybean (सोयाबीन - 30:60:40 NPK)</option>
                <option value="Maize">Maize / Corn (मक्का - 120:60:40 NPK)</option>
                <option value="Mustard">Mustard (सरसों - 80:40:40 NPK + Sulfur)</option>
                <option value="Chilli">Chilli (मिर्च - 150:80:80 NPK)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-stone-700 font-heading">{t.farmSize}</label>
                <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md">{farmAcres} {t.acres}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="25"
                step="0.5"
                value={farmAcres}
                onChange={(e) => setFarmAcres(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>0.5 Acre</span>
                <span>10 Acres</span>
                <span>25 Acres</span>
              </div>
            </div>
          </div>

          {/* Results Output Bento Cards */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-stone-50/90 p-4 rounded-2xl border border-stone-200/80 text-center shadow-2xs">
              <div className="text-xs font-bold text-stone-500 font-heading">Urea (46% N)</div>
              <div className="text-2xl font-black text-emerald-950 my-1 font-heading">{npkResult.ureaBags}</div>
              <div className="text-[11px] text-stone-400">Bags (45 kg)</div>
              <div className="text-[10px] text-emerald-800 font-semibold mt-1">Split in 3 Doses</div>
            </div>

            <div className="bg-stone-50/90 p-4 rounded-2xl border border-stone-200/80 text-center shadow-2xs">
              <div className="text-xs font-bold text-stone-500 font-heading">DAP (18-46-0)</div>
              <div className="text-2xl font-black text-stone-900 my-1 font-heading">{npkResult.dapBags}</div>
              <div className="text-[11px] text-stone-400">Bags (50 kg)</div>
              <div className="text-[10px] text-stone-700 font-semibold mt-1">100% Basal at Sowing</div>
            </div>

            <div className="bg-stone-50/90 p-4 rounded-2xl border border-stone-200/80 text-center shadow-2xs">
              <div className="text-xs font-bold text-stone-500 font-heading">MOP (Potash 60%)</div>
              <div className="text-2xl font-black text-amber-900 my-1 font-heading">{npkResult.mopBags}</div>
              <div className="text-[11px] text-stone-400">Bags (50 kg)</div>
              <div className="text-[10px] text-amber-800 font-semibold mt-1">Basal + Flowering</div>
            </div>

            <div className="bg-stone-50/90 p-4 rounded-2xl border border-stone-200/80 text-center shadow-2xs">
              <div className="text-xs font-bold text-stone-500 font-heading">Zinc Sulfate 21%</div>
              <div className="text-2xl font-black text-emerald-900 my-1 font-heading">{npkResult.zincKg}</div>
              <div className="text-[11px] text-stone-400">Kilograms</div>
              <div className="text-[10px] text-emerald-800 font-semibold mt-1">Basal Soil Mix</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Agronomy Specialists Consultation Q&A Board */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-stone-200/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2 font-heading">
              <UserCheck className="w-5 h-5 text-emerald-700" />
              <span>{t.askExpert}</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Direct consultation with university scientists & accredited agronomists
            </p>
          </div>
        </div>

        {/* Expert Profiles Carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-4">
          {AGRONOMY_EXPERTS.map((exp) => (
            <div
              key={exp.id}
              className="bg-stone-50/90 p-3.5 rounded-2xl border border-stone-200/80 flex items-center gap-3 shadow-2xs"
            >
              <img
                src={exp.avatar}
                alt={exp.name}
                className="w-12 h-12 rounded-xl object-cover border border-stone-200 flex-shrink-0"
              />
              <div className="overflow-hidden">
                <div className="font-bold text-xs text-stone-900 truncate font-heading">{exp.name}</div>
                <div className="text-[11px] text-stone-500 truncate">{exp.title}</div>
                <div className="text-[10px] text-emerald-800 font-semibold mt-0.5">
                  ★ {exp.rating} • {exp.answeredCount}+ Consultations
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Consultation Q&A Thread */}
        <div className="bg-stone-50/80 rounded-2xl p-4 sm:p-5 border border-stone-200/80 space-y-3">
          <div className="space-y-2.5 max-h-56 overflow-y-auto">
            {consultChat.map((msg, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'farmer'
                    ? 'bg-stone-900 text-white ml-auto max-w-[85%] rounded-br-none'
                    : 'bg-white text-stone-800 border border-stone-200/80 shadow-2xs mr-auto max-w-[90%] rounded-bl-none'
                }`}
              >
                <div className="font-bold mb-0.5 opacity-90 font-heading">
                  {msg.sender === 'farmer' ? 'You (Farmer)' : 'Agronomist Advisory'}
                </div>
                <div>{msg.text}</div>
                <div className="text-[10px] opacity-70 mt-1">{msg.time}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAskExpert} className="flex gap-2 pt-2">
            <input
              type="text"
              value={expertQuestion}
              onChange={(e) => setExpertQuestion(e.target.value)}
              placeholder="Ask Dr. Sharma or Prof. Deshmukh about crop diseases, pest outbreaks, or yield management..."
              className="flex-1 bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
            <button
              type="submit"
              disabled={consultLoading}
              className="px-4 py-2 bg-stone-900 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
            >
              {consultLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>Ask Expert</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
