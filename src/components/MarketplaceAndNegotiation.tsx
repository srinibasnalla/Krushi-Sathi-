import React, { useState } from 'react';
import {
  Store,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  MessageSquare,
  Sparkles,
  Award,
  Calendar,
  DollarSign,
  Truck,
  Building,
  Scale,
  FileText,
  FileCheck,
  AlertCircle,
  X,
  Send,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  MandiPriceItem,
  HarvestListing,
  BuyerOffer,
  BuyerDemand,
  LanguageCode
} from '../types';
import {
  INITIAL_MANDI_PRICES,
  INITIAL_HARVEST_LISTINGS,
  INITIAL_BUYER_OFFERS,
  INITIAL_BUYER_DEMANDS
} from '../data/mockData';
import { translations } from '../i18n/translations';
import { VoiceReaderButton } from './VoiceReaderButton';

interface MarketplaceAndNegotiationProps {
  language: LanguageCode;
}

export const MarketplaceAndNegotiation: React.FC<MarketplaceAndNegotiationProps> = ({ language }) => {
  const t = translations[language] || translations.en;

  const [mandiPrices, setMandiPrices] = useState<MandiPriceItem[]>(INITIAL_MANDI_PRICES);
  const [harvestListings, setHarvestListings] = useState<HarvestListing[]>(INITIAL_HARVEST_LISTINGS);
  const [buyerOffers, setBuyerOffers] = useState<BuyerOffer[]>(INITIAL_BUYER_OFFERS);
  const [buyerDemands] = useState<BuyerDemand[]>(INITIAL_BUYER_DEMANDS);

  // Active negotiation session
  const [selectedOffer, setSelectedOffer] = useState<BuyerOffer | null>(buyerOffers[0] || null);
  const [counterPriceInput, setCounterPriceInput] = useState<string>('4350');
  const [negotiationNote, setNegotiationNote] = useState<string>('Our Basmati lot has 12.8% certified moisture and stored on pallets. Ready for immediate dispatch.');
  const [aiBargainLoading, setAiBargainLoading] = useState<boolean>(false);
  const [aiBargainTip, setAiBargainTip] = useState<any>(null);

  // Modals
  const [isNewListingModalOpen, setIsNewListingModalOpen] = useState<boolean>(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState<boolean>(false);
  const [confirmedDeal, setConfirmedDeal] = useState<{ offer: BuyerOffer; listing: HarvestListing } | null>(null);

  // New Harvest Form
  const [newCropName, setNewCropName] = useState('Wheat (HD-3086)');
  const [newVariety, setNewVariety] = useState('Certified Seed Grade A');
  const [newQuantity, setNewQuantity] = useState('100');
  const [newExpectedPrice, setNewExpectedPrice] = useState('2550');
  const [newMinPrice, setNewMinPrice] = useState('2450');
  const [newMoisture, setNewMoisture] = useState('11.5');
  const [newIsOrganic, setNewIsOrganic] = useState(false);
  const [newLocation, setNewLocation] = useState('Ludhiana / Khanna');
  const [newDescription, setNewDescription] = useState('Freshly harvested, cleaned and packed in 50kg bags.');

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    const newLot: HarvestListing = {
      id: `harvest_${Date.now()}`,
      farmerName: 'Kisan Member',
      farmerPhone: '+91 98111-22334',
      farmerLocation: newLocation,
      cropName: newCropName,
      variety: newVariety,
      quantity: Number(newQuantity) || 50,
      unit: 'Quintals',
      expectedPricePerUnit: Number(newExpectedPrice) || 2500,
      minAcceptablePrice: Number(newMinPrice) || 2400,
      harvestDate: 'Ready for loading',
      isOrganic: newIsOrganic,
      qualityGrade: 'Grade A+ (Premium)',
      moisturePercentage: Number(newMoisture) || 12,
      description: newDescription,
      status: 'active',
      postedAt: 'Just now',
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    };

    setHarvestListings([newLot, ...harvestListings]);
    setIsNewListingModalOpen(false);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {}
  };

  const handleGetAiBargainingTip = async () => {
    if (!selectedOffer) return;
    const listing = harvestListings.find((l) => l.id === selectedOffer.listingId);
    setAiBargainLoading(true);
    try {
      const response = await fetch('/api/gemini/market-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: listing?.cropName || 'Basmati Paddy',
          quantity: selectedOffer.offeredQuantity,
          farmerPrice: listing?.expectedPricePerUnit || 4400,
          buyerOffer: selectedOffer.offeredPricePerUnit,
          location: selectedOffer.buyerLocation,
          language: language,
        }),
      });
      const data = await response.json();
      if (data.analysis) {
        setAiBargainTip(data.analysis);
        if (data.analysis.recommendedCounterPrice) {
          setCounterPriceInput(String(data.analysis.recommendedCounterPrice));
        }
      }
    } catch (err) {
      console.error(err);
      setAiBargainTip({
        verdict: 'Counter at ₹4,350',
        bargainingAdvice: 'Current market mandi arrivals are low. Stress your moisture certificate and demand buyer-side loading transportation.',
      });
    } finally {
      setAiBargainLoading(false);
    }
  };

  const handleSendCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOffer) return;

    const price = Number(counterPriceInput);
    const updatedOffers = buyerOffers.map((off) => {
      if (off.id === selectedOffer.id) {
        return {
          ...off,
          status: 'countered' as const,
          counterPrice: price,
          messages: [
            ...off.messages,
            {
              sender: 'farmer' as const,
              senderName: 'You (Farmer)',
              text: `Counter offer sent: ₹${price}/Quintal. Note: ${negotiationNote}`,
              timestamp: 'Just now',
              proposedPrice: price,
            },
          ],
        };
      }
      return off;
    });

    setBuyerOffers(updatedOffers);
    setSelectedOffer(updatedOffers.find((o) => o.id === selectedOffer.id) || null);
  };

  const handleAcceptDeal = (offer: BuyerOffer) => {
    const listing = harvestListings.find((l) => l.id === offer.listingId) || harvestListings[0];
    
    // Update statuses
    setBuyerOffers(
      buyerOffers.map((o) => (o.id === offer.id ? { ...o, status: 'accepted' } : o))
    );
    setHarvestListings(
      harvestListings.map((l) => (l.id === listing.id ? { ...l, status: 'sold' } : l))
    );

    setConfirmedDeal({ offer, listing });
    setIsInvoiceModalOpen(true);

    // Launch celebratory confetti fireworks!
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  return (
    <div className="space-y-6">
      {/* 1. Live Mandi & Wholesale Market Ticker Bento Tile */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2 font-heading">
              <TrendingUp className="w-5 h-5 text-emerald-700" />
              <span>{t.mandiPrices}</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Live APMC spot rates, arrivals and Govt Minimum Support Price (MSP) benchmarks
            </p>
          </div>

          <VoiceReaderButton
            text={`Live Mandi Prices summary: ${mandiPrices.slice(0, 4).map((p) => `${p.cropName} at ${p.marketName} trading at ${p.currency}${p.currentPrice} per ${p.unit}`).join('. ')}`}
            lang={language}
            variant="pill"
            label="Listen to Mandi Rates"
          />
        </div>

        {/* Mandi Cards Bento Subgrid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
          {mandiPrices.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-stone-50/90 border border-stone-200/80 hover:border-emerald-500 hover:bg-emerald-50/20 transition-all flex flex-col justify-between shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between gap-1 text-[11px] text-stone-500 mb-1">
                  <span className="font-semibold text-stone-700 truncate">{item.marketName}</span>
                  <span>{item.updatedAt}</span>
                </div>
                <h4 className="text-sm font-bold text-stone-900 leading-tight line-clamp-1 font-heading">
                  {item.cropName}
                </h4>
                <div className="text-[11px] text-stone-500 italic truncate">{item.variety}</div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-stone-200/70 flex items-baseline justify-between">
                <div>
                  <div className="text-lg font-black text-stone-900">
                    {item.currency}{item.currentPrice.toLocaleString()}{' '}
                    <span className="text-xs font-normal text-stone-500">/ {item.unit}</span>
                  </div>
                  {item.mspPrice && (
                    <div className="text-[11px] text-emerald-800 font-semibold">
                      MSP: {item.currency}{item.mspPrice.toLocaleString()}
                    </div>
                  )}
                </div>

                <div
                  className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    item.change24h >= 0
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-rose-100 text-rose-900'
                  }`}
                >
                  {item.change24h >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-emerald-700" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-rose-700" />
                  )}
                  <span>{item.change24h > 0 ? `+${item.change24h}%` : `${item.change24h}%`}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Direct Marketplace & Active Buyer Negotiation Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Farmer's Barn & Harvest Lots */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200/90 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 font-heading">
                  <Store className="w-4 h-4 text-emerald-700" />
                  <span>{t.myHarvestListings}</span>
                </h3>
                <p className="text-xs text-stone-500">Directly sell to certified millers & traders</p>
              </div>

              <button
                type="button"
                onClick={() => setIsNewListingModalOpen(true)}
                className="bg-stone-900 hover:bg-emerald-900 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>{t.postNewHarvest}</span>
              </button>
            </div>

            {/* Listings List */}
            <div className="space-y-3">
              {harvestListings.map((listing) => (
                <div
                  key={listing.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    listing.status === 'sold'
                      ? 'bg-stone-100/70 border-stone-200 opacity-75'
                      : 'bg-stone-50/90 border-stone-200/90 hover:border-emerald-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      {listing.imageUrl && (
                        <img
                          src={listing.imageUrl}
                          alt={listing.cropName}
                          className="w-14 h-14 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-bold text-sm text-stone-900 font-heading">{listing.cropName}</h4>
                          {listing.isOrganic && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                              Organic
                            </span>
                          )}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            listing.status === 'sold'
                              ? 'bg-stone-200 text-stone-700'
                              : listing.status === 'under_negotiation'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-emerald-100 text-emerald-900'
                          }`}>
                            {listing.status === 'sold' ? 'Sold' : listing.status === 'under_negotiation' ? 'Offers Active' : 'Available'}
                          </span>
                        </div>
                        <div className="text-xs text-stone-600 font-medium mt-0.5">
                          {listing.quantity} {listing.unit} • Moisture {listing.moisturePercentage}%
                        </div>
                        <div className="text-xs text-stone-500 mt-0.5">{listing.farmerLocation}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-black text-emerald-900">
                        ₹{listing.expectedPricePerUnit.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-stone-400">per Quintal</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Buyer Demands (Procurement Board) */}
          <div className="bg-[#122019] text-stone-100 rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 font-heading">
                <Building className="w-4 h-4 text-amber-400" />
                <span>{t.buyerDemands}</span>
              </h3>
              <span className="text-[11px] bg-amber-400 text-stone-950 font-bold px-2.5 py-0.5 rounded-full uppercase">
                Direct Mill Procurement
              </span>
            </div>

            <div className="space-y-2.5">
              {buyerDemands.map((demand) => (
                <div
                  key={demand.id}
                  className="bg-stone-900/90 p-3.5 rounded-2xl border border-stone-800 text-xs flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-bold text-amber-300">{demand.cropNeeded}</div>
                    <div className="text-stone-300 font-medium">{demand.buyerOrg} • {demand.requiredQuantity}</div>
                    <div className="text-[11px] text-stone-400">Budget: up to ₹{demand.maxBudgetPerUnit.toLocaleString()}/Q</div>
                  </div>

                  <a
                    href={`tel:${demand.contactNumber}`}
                    className="p-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl flex items-center gap-1 font-bold text-xs transition-colors flex-shrink-0"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Pitch Lot</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Live Negotiation Room & Interactive Deal Closer */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200/90 h-full flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2 font-heading">
                    <Scale className="w-5 h-5 text-emerald-700" />
                    <span>{t.negotiationRoom}</span>
                  </h3>
                  <p className="text-xs text-stone-500">Live price bargaining with registered agri-buyers</p>
                </div>

                {/* Offer Tabs */}
                <div className="flex items-center gap-1.5 bg-stone-100 p-1.5 rounded-2xl border border-stone-200/60">
                  {buyerOffers.map((offer, idx) => (
                    <button
                      key={offer.id}
                      type="button"
                      onClick={() => {
                        setSelectedOffer(offer);
                        setAiBargainTip(null);
                      }}
                      className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all cursor-pointer ${
                        selectedOffer?.id === offer.id
                          ? 'bg-stone-900 text-amber-300 shadow-xs'
                          : 'text-stone-600 hover:text-stone-950'
                      }`}
                    >
                      Offer #{idx + 1} ({offer.buyerName.split(' ')[0]})
                    </button>
                  ))}
                </div>
              </div>

              {selectedOffer ? (
                <div className="mt-4 space-y-4">
                  {/* Buyer Profile & Live Terms */}
                  <div className="bg-stone-50/90 p-4 sm:p-5 rounded-2xl border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm font-heading">{selectedOffer.buyerName}</span>
                        <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Award className="w-3 h-3 text-emerald-800" />
                          {selectedOffer.buyerRating} ★ Verified Buyer
                        </span>
                      </div>
                      <div className="text-xs text-stone-600 mt-1 font-medium">
                        {selectedOffer.buyerCompany} ({selectedOffer.buyerType}) • {selectedOffer.buyerLocation}
                      </div>
                      <div className="text-xs text-stone-500 mt-2 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1 font-semibold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                          <Truck className="w-3.5 h-3.5 text-emerald-700" />
                          {selectedOffer.pickupTerms}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                          {selectedOffer.paymentTerms}
                        </span>
                      </div>
                    </div>

                    <div className="text-right sm:border-l sm:border-stone-200 sm:pl-4">
                      <div className="text-xs text-stone-500 font-medium">Buyer's Offer</div>
                      <div className="text-2xl font-black text-emerald-950 font-heading">
                        ₹{selectedOffer.offeredPricePerUnit.toLocaleString()}
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-800">
                        Total: ₹{(selectedOffer.offeredPricePerUnit * selectedOffer.offeredQuantity).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Negotiation Messages Log */}
                  <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200/80 max-h-48 overflow-y-auto space-y-2.5">
                    {selectedOffer.messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex flex-col ${
                          msg.sender === 'farmer' ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div
                          className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                            msg.sender === 'farmer'
                              ? 'bg-stone-900 text-white rounded-br-none'
                              : 'bg-white text-stone-800 border border-stone-200/80 shadow-2xs rounded-bl-none'
                          }`}
                        >
                          <div className="font-bold mb-0.5 opacity-90">{msg.senderName}</div>
                          <div>{msg.text}</div>
                        </div>
                        <span className="text-[10px] text-stone-400 mt-0.5 px-1">{msg.timestamp}</span>
                      </div>
                    ))}
                  </div>

                  {/* AI Bargaining Advisor Button */}
                  <div className="flex items-center justify-between gap-3 bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-700 flex-shrink-0" />
                      <div className="text-xs text-amber-950">
                        <span className="font-bold">AI Market Strategist: </span>
                        Get real-time Mandi bargaining insight for this lot.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleGetAiBargainingTip}
                      disabled={aiBargainLoading}
                      className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all flex-shrink-0 cursor-pointer disabled:opacity-50 shadow-2xs"
                    >
                      {aiBargainLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      <span>Analyze Offer</span>
                    </button>
                  </div>

                  {aiBargainTip && (
                    <div className="p-4 bg-[#122019] text-stone-100 rounded-2xl text-xs space-y-1.5 border border-stone-800 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between text-amber-400 font-bold font-heading">
                        <span>Strategy: {aiBargainTip.verdict}</span>
                        {aiBargainTip.recommendedCounterPrice && (
                          <span className="bg-amber-400 text-stone-950 font-black px-2.5 py-0.5 rounded-full text-[11px]">
                            Recommended: ₹{aiBargainTip.recommendedCounterPrice}/Q
                          </span>
                        )}
                      </div>
                      <p className="text-stone-200">{aiBargainTip.bargainingAdvice}</p>
                      {aiBargainTip.logisticsTip && (
                        <p className="text-emerald-300 text-[11px] font-medium">💡 {aiBargainTip.logisticsTip}</p>
                      )}
                    </div>
                  )}

                  {/* Actions: Send Counter or Accept Deal */}
                  <form onSubmit={handleSendCounter} className="space-y-3 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1 font-heading">
                          Counter Price (₹/Quintal)
                        </label>
                        <input
                          type="number"
                          value={counterPriceInput}
                          onChange={(e) => setCounterPriceInput(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-stone-700 mb-1 font-heading">
                          Terms & Quality Note
                        </label>
                        <input
                          type="text"
                          value={negotiationNote}
                          onChange={(e) => setNegotiationNote(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                          placeholder="e.g. Moisture 12%, farmgate pickup with advance"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="w-full sm:flex-1 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{t.counterOffer}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAcceptDeal(selectedOffer)}
                        className="w-full sm:flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                        <span>{t.acceptOffer} (₹{selectedOffer.offeredPricePerUnit.toLocaleString()}/Q)</span>
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="text-center py-12 text-stone-400 text-sm">
                  Select an offer above to begin price negotiation
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Post New Harvest Lot */}
      {isNewListingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900 font-heading">{t.postNewHarvest}</h3>
              <button
                type="button"
                onClick={() => setIsNewListingModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1 font-heading">{t.crop}</label>
                  <input
                    type="text"
                    required
                    value={newCropName}
                    onChange={(e) => setNewCropName(e.target.value)}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1 font-heading">Variety</label>
                  <input
                    type="text"
                    required
                    value={newVariety}
                    onChange={(e) => setNewVariety(e.target.value)}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1 font-heading">{t.quantity} (Q)</label>
                  <input
                    type="number"
                    required
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1 font-heading">Asking Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newExpectedPrice}
                    onChange={(e) => setNewExpectedPrice(e.target.value)}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1 font-heading">Moisture %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMoisture}
                    onChange={(e) => setNewMoisture(e.target.value)}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 font-heading">{t.location}</label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 font-heading">Quality & Storage Details</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl p-2.5 text-xs text-stone-800"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="organicCheck"
                  checked={newIsOrganic}
                  onChange={(e) => setNewIsOrganic(e.target.checked)}
                  className="w-4 h-4 text-emerald-700 rounded"
                />
                <label htmlFor="organicCheck" className="text-xs font-bold text-stone-700 cursor-pointer">
                  Certified Organic / Zero Chemical Residue Lot
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsNewListingModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-stone-900 hover:bg-emerald-900 shadow-xs cursor-pointer"
                >
                  Publish Harvest Lot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Deal Invoice & Contract Generation */}
      {isInvoiceModalOpen && confirmedDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-in zoom-in-95 duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-inner">
                <FileCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-stone-900 font-heading">
                {t.dealConfirmed}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Digital Trade Agreement Contract #AST-{Math.floor(100000 + Math.random() * 900000)}
              </p>
            </div>

            {/* Contract Summary Box */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs space-y-2 font-mono">
              <div className="flex justify-between border-b border-stone-200 pb-1.5 font-sans">
                <span className="text-stone-500 font-bold">Commodity:</span>
                <span className="font-bold text-stone-900">{confirmedDeal.listing.cropName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Contract Quantity:</span>
                <span className="font-bold text-stone-900">{confirmedDeal.offer.offeredQuantity} Quintals</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Agreed Price:</span>
                <span className="font-bold text-emerald-800">₹{confirmedDeal.offer.offeredPricePerUnit.toLocaleString()} / Quintal</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-1.5 font-sans text-sm">
                <span className="font-bold text-stone-800">Total Settlement:</span>
                <span className="font-black text-emerald-950 font-heading">
                  ₹{(confirmedDeal.offer.offeredPricePerUnit * confirmedDeal.offer.offeredQuantity).toLocaleString()}
                </span>
              </div>
              <div className="pt-2 text-[11px] font-sans text-stone-600">
                <div>• Transport: {confirmedDeal.offer.pickupTerms}</div>
                <div>• Payment: {confirmedDeal.offer.paymentTerms}</div>
                <div>• Buyer: {confirmedDeal.offer.buyerName} ({confirmedDeal.offer.buyerCompany})</div>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="space-y-2 pt-1">
              <a
                href={`tel:+919876543210`}
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <PhoneCall className="w-4 h-4 text-amber-400" />
                <span>Call Buyer Directly ({confirmedDeal.offer.buyerName})</span>
              </a>

              <button
                type="button"
                onClick={() => setIsInvoiceModalOpen(false)}
                className="w-full py-2 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Done & Return to Marketplace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
