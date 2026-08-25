export type LanguageCode = 'en' | 'hi' | 'te' | 'bn' | 'pa' | 'mr' | 'or' | 'es' | 'sw';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export type SoilType = 'alluvial' | 'black' | 'red_loamy' | 'sandy_loam' | 'clayey' | 'laterite';
export type IrrigationType = 'canal' | 'borewell_drip' | 'rainfed' | 'limited';
export type SeasonType = 'kharif' | 'rabi' | 'zaid' | 'annual';

export interface RegionInfo {
  id: string;
  name: string;
  stateOrCountry: string;
  climateZone: string;
  majorSoil: SoilType;
  avgRainfallMm: number;
  currentTemp: number;
  currentHumidity: number;
  condition: string;
  conditionIcon: string;
  windKmh: number;
  soilMoisturePct: number;
  weatherAdvisory: string;
  forecast: {
    day: string;
    tempMax: number;
    tempMin: number;
    condition: string;
    rainChance: number;
  }[];
}

export interface SuitableCrop {
  id: string;
  name: string;
  scientificName: string;
  category: 'grain' | 'cash_crop' | 'pulse' | 'vegetable' | 'oilseed' | 'fruit';
  suitabilityScore: number; // 0-100
  season: SeasonType;
  optimalSoil: SoilType[];
  waterRequirement: 'High' | 'Medium' | 'Low';
  growthDurationDays: number;
  expectedYieldPerAcre: string;
  estProfitPerAcre: string;
  marketDemand: 'Very High' | 'High' | 'Moderate' | 'Stable';
  bestSowingWindow: string;
  keyPractices: string[];
  pestRisks: string[];
  imageUrl: string;
}

export interface MandiPriceItem {
  id: string;
  cropName: string;
  variety: string;
  marketName: string;
  state: string;
  currentPrice: number; // per Quintal (100kg)
  currency: string;
  unit: string;
  change24h: number; // percentage
  mspPrice?: number; // Minimum Support Price
  arrivalVolumeTons: number;
  trend: 'up' | 'down' | 'stable';
  updatedAt: string;
}

export interface HarvestListing {
  id: string;
  farmerName: string;
  farmerPhone: string;
  farmerLocation: string;
  cropName: string;
  variety: string;
  quantity: number; // in Quintals
  unit: string;
  expectedPricePerUnit: number;
  minAcceptablePrice: number;
  harvestDate: string;
  isOrganic: boolean;
  qualityGrade: 'Grade A+ (Premium)' | 'Grade A (Standard)' | 'Grade B';
  moisturePercentage: number;
  description: string;
  status: 'active' | 'under_negotiation' | 'sold';
  postedAt: string;
  imageUrl?: string;
}

export interface BuyerOffer {
  id: string;
  listingId: string;
  buyerName: string;
  buyerCompany: string;
  buyerType: 'Mandi Trader' | 'Food Processing Mill' | 'Agri Exporter' | 'Retail Co-op';
  buyerLocation: string;
  buyerRating: number;
  offeredPricePerUnit: number;
  offeredQuantity: number;
  pickupTerms: 'Buyer arranges transport' | 'Farmer delivers to hub' | 'Farmgate pickup';
  paymentTerms: 'Instant Bank Transfer on Loading' | '50% Advance, 50% on Delivery' | 'Cash on Farmgate';
  status: 'pending' | 'countered' | 'accepted' | 'declined';
  counterPrice?: number;
  counterNotes?: string;
  messages: {
    sender: 'buyer' | 'farmer';
    senderName: string;
    text: string;
    timestamp: string;
    proposedPrice?: number;
  }[];
}

export interface BuyerDemand {
  id: string;
  buyerName: string;
  buyerOrg: string;
  cropNeeded: string;
  requiredQuantity: string;
  maxBudgetPerUnit: number;
  location: string;
  deliveryDeadline: string;
  contactNumber: string;
  status: 'open' | 'fulfilled';
}

export interface DiseaseDiagnosisResult {
  diseaseName: string;
  confidence: number;
  cropAffected: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Critical';
  symptoms: string[];
  organicRemedy: string[];
  chemicalTreatment: string[];
  preventiveMeasures: string[];
  estimatedYieldImpact: string;
}

export interface AgronomyExpert {
  id: string;
  name: string;
  title: string;
  organization: string;
  specialization: string;
  rating: number;
  answeredCount: number;
  avatar: string;
}

export interface ForumPost {
  id: string;
  authorName: string;
  authorLocation: string;
  authorBadge?: string;
  authorAvatar: string;
  category: 'high_yield' | 'pest_control' | 'water_drip' | 'machinery' | 'govt_schemes' | 'general';
  title: string;
  content: string;
  cropTag?: string;
  likes: number;
  hasLiked?: boolean;
  commentsCount: number;
  postedAt: string;
  isVerifiedTip: boolean;
  comments: {
    id: string;
    authorName: string;
    authorLocation: string;
    content: string;
    postedAt: string;
    likes: number;
  }[];
}
