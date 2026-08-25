import {
  RegionInfo,
  SuitableCrop,
  MandiPriceItem,
  HarvestListing,
  BuyerOffer,
  BuyerDemand,
  AgronomyExpert,
  ForumPost,
  DiseaseDiagnosisResult
} from '../types';

export const INITIAL_REGIONS: RegionInfo[] = [
  {
    id: 'punjab_malwa',
    name: 'Malwa & Doaba Basin (Punjab)',
    stateOrCountry: 'Punjab, India',
    climateZone: 'Semi-arid Subtropical',
    majorSoil: 'alluvial',
    avgRainfallMm: 650,
    currentTemp: 29,
    currentHumidity: 58,
    condition: 'Partly Cloudy with Good Sunlight',
    conditionIcon: 'sun-cloud',
    windKmh: 12,
    soilMoisturePct: 46,
    weatherAdvisory: 'Ideal weather for field preparation and canal water rotation. Light rain showers expected in 3 days; postpone heavy pesticide spraying until humidity stabilizes.',
    forecast: [
      { day: 'Today', tempMax: 31, tempMin: 22, condition: 'Sunny & Warm', rainChance: 10 },
      { day: 'Tomorrow', tempMax: 30, tempMin: 21, condition: 'Partly Cloudy', rainChance: 25 },
      { day: 'Wed', tempMax: 28, tempMin: 20, condition: 'Light Showers', rainChance: 65 },
      { day: 'Thu', tempMax: 29, tempMin: 21, condition: 'Clearing Sky', rainChance: 20 },
      { day: 'Fri', tempMax: 32, tempMin: 23, condition: 'Bright & Clear', rainChance: 5 },
    ]
  },
  {
    id: 'maharashtra_vidarbha',
    name: 'Vidarbha & Marathwada (Maharashtra)',
    stateOrCountry: 'Maharashtra, India',
    climateZone: 'Tropical Wet & Dry (Deccan)',
    majorSoil: 'black',
    avgRainfallMm: 850,
    currentTemp: 33,
    currentHumidity: 52,
    condition: 'Warm & Breezy',
    conditionIcon: 'sun',
    windKmh: 16,
    soilMoisturePct: 40,
    weatherAdvisory: 'High evapotranspiration rate detected. Check cotton and soybean drip systems. Drip fertigation recommended in evening hours.',
    forecast: [
      { day: 'Today', tempMax: 34, tempMin: 24, condition: 'Clear Sky', rainChance: 5 },
      { day: 'Tomorrow', tempMax: 34, tempMin: 24, condition: 'Warm & Dry', rainChance: 10 },
      { day: 'Wed', tempMax: 33, tempMin: 23, condition: 'Isolated Cloud', rainChance: 15 },
      { day: 'Thu', tempMax: 32, tempMin: 22, condition: 'Breezy', rainChance: 20 },
      { day: 'Fri', tempMax: 33, tempMin: 23, condition: 'Sunny', rainChance: 10 },
    ]
  },
  {
    id: 'andhra_telangana_plateau',
    name: 'Deccan & Krishna Delta (AP & Telangana)',
    stateOrCountry: 'Andhra Pradesh & Telangana, India',
    climateZone: 'Tropical Semi-Arid',
    majorSoil: 'red_loamy',
    avgRainfallMm: 920,
    currentTemp: 31,
    currentHumidity: 68,
    condition: 'Humid & Mild Breeze',
    conditionIcon: 'cloud',
    windKmh: 14,
    soilMoisturePct: 55,
    weatherAdvisory: 'Optimal soil moisture for paddy nurseries and chilli transplanting. Monitor for thrips and leaf curl with sticky traps.',
    forecast: [
      { day: 'Today', tempMax: 32, tempMin: 24, condition: 'Humid & Overcast', rainChance: 35 },
      { day: 'Tomorrow', tempMax: 31, tempMin: 23, condition: 'Scattered Showers', rainChance: 60 },
      { day: 'Wed', tempMax: 30, tempMin: 23, condition: 'Rain Likely', rainChance: 75 },
      { day: 'Thu', tempMax: 31, tempMin: 24, condition: 'Passing Clouds', rainChance: 30 },
      { day: 'Fri', tempMax: 33, tempMin: 25, condition: 'Warm & Humid', rainChance: 15 },
    ]
  },
  {
    id: 'gangetic_bengal_up',
    name: 'Indo-Gangetic Plain (UP & West Bengal)',
    stateOrCountry: 'Uttar Pradesh & West Bengal, India',
    climateZone: 'Humid Subtropical',
    majorSoil: 'alluvial',
    avgRainfallMm: 1200,
    currentTemp: 28,
    currentHumidity: 74,
    condition: 'Moist & Overcast',
    conditionIcon: 'cloud-rain',
    windKmh: 10,
    soilMoisturePct: 68,
    weatherAdvisory: 'High relative humidity favors fungal blast in paddy and late blight in early vegetables. Ensure proper drainage in low-lying plots.',
    forecast: [
      { day: 'Today', tempMax: 29, tempMin: 23, condition: 'Overcast & Humid', rainChance: 45 },
      { day: 'Tomorrow', tempMax: 28, tempMin: 22, condition: 'Light Rain', rainChance: 70 },
      { day: 'Wed', tempMax: 29, tempMin: 23, condition: 'Showers', rainChance: 60 },
      { day: 'Thu', tempMax: 30, tempMin: 24, condition: 'Partly Cloudy', rainChance: 25 },
      { day: 'Fri', tempMax: 31, tempMin: 24, condition: 'Sunny Breaks', rainChance: 20 },
    ]
  },
  {
    id: 'rajasthan_arid',
    name: 'Thar & Semi-Arid Zone (Rajasthan & Gujarat)',
    stateOrCountry: 'Rajasthan & Gujarat, India',
    climateZone: 'Arid & Dry',
    majorSoil: 'sandy_loam',
    avgRainfallMm: 380,
    currentTemp: 36,
    currentHumidity: 32,
    condition: 'Hot & Clear',
    conditionIcon: 'sun',
    windKmh: 20,
    soilMoisturePct: 22,
    weatherAdvisory: 'Dry hot winds active. Recommended for drought-tolerant Pearl Millet (Bajra), Mustard, and Cluster Bean (Guar). Implement mulching to conserve root zone moisture.',
    forecast: [
      { day: 'Today', tempMax: 37, tempMin: 25, condition: 'Intense Sun', rainChance: 0 },
      { day: 'Tomorrow', tempMax: 38, tempMin: 26, condition: 'Hot & Windy', rainChance: 0 },
      { day: 'Wed', tempMax: 36, tempMin: 25, condition: 'Dust Haze', rainChance: 5 },
      { day: 'Thu', tempMax: 35, tempMin: 24, condition: 'Sunny', rainChance: 0 },
      { day: 'Fri', tempMax: 36, tempMin: 25, condition: 'Clear Sky', rainChance: 0 },
    ]
  },
  {
    id: 'karnataka_tamilnadu_south',
    name: 'Kaveri Basin & Southern Hills (Karnataka & TN)',
    stateOrCountry: 'Karnataka & Tamil Nadu, India',
    climateZone: 'Tropical High & Plains',
    majorSoil: 'red_loamy',
    avgRainfallMm: 980,
    currentTemp: 27,
    currentHumidity: 65,
    condition: 'Pleasant & Mild Breeze',
    conditionIcon: 'sun-cloud',
    windKmh: 13,
    soilMoisturePct: 52,
    weatherAdvisory: 'Favorable temperature range for pulses, ragi (finger millet), maize, and horticulture. Excellent window for organic foliar sprays.',
    forecast: [
      { day: 'Today', tempMax: 28, tempMin: 20, condition: 'Pleasant & Partly Cloudy', rainChance: 20 },
      { day: 'Tomorrow', tempMax: 28, tempMin: 19, condition: 'Afternoon Cloud', rainChance: 30 },
      { day: 'Wed', tempMax: 27, tempMin: 19, condition: 'Scattered Showers', rainChance: 45 },
      { day: 'Thu', tempMax: 29, tempMin: 20, condition: 'Sunny', rainChance: 15 },
      { day: 'Fri', tempMax: 30, tempMin: 21, condition: 'Clear', rainChance: 10 },
    ]
  },
  {
    id: 'odisha_coastal_plateau',
    name: 'Mahanadi Basin & Coastal Plains (Odisha)',
    stateOrCountry: 'Odisha, India',
    climateZone: 'Tropical Maritime & Moist Sub-humid',
    majorSoil: 'alluvial',
    avgRainfallMm: 1450,
    currentTemp: 30,
    currentHumidity: 76,
    condition: 'Warm & Moist with Coastal Breeze',
    conditionIcon: 'sun-cloud',
    windKmh: 14,
    soilMoisturePct: 64,
    weatherAdvisory: 'High coastal humidity favors Paddy tillering, Groundnut pod development, and Blackgram. Ensure drainage channels in low-lying Hirakud and coastal delta belts against sudden monsoon shower accumulation.',
    forecast: [
      { day: 'Today', tempMax: 31, tempMin: 24, condition: 'Humid & Partly Sunny', rainChance: 30 },
      { day: 'Tomorrow', tempMax: 30, tempMin: 23, condition: 'Scattered Coastal Showers', rainChance: 55 },
      { day: 'Wed', tempMax: 29, tempMin: 23, condition: 'Thunder Showers', rainChance: 70 },
      { day: 'Thu', tempMax: 30, tempMin: 24, condition: 'Breezy & Clearing', rainChance: 35 },
      { day: 'Fri', tempMax: 32, tempMin: 25, condition: 'Bright & Humid', rainChance: 20 },
    ]
  }
];

export const CROPS_CATALOG: SuitableCrop[] = [
  {
    id: 'crop_wheat_sharbati',
    name: 'Wheat (HD-2967 / Sharbati)',
    scientificName: 'Triticum aestivum',
    category: 'grain',
    suitabilityScore: 96,
    season: 'rabi',
    optimalSoil: ['alluvial', 'clayey'],
    waterRequirement: 'Medium',
    growthDurationDays: 135,
    expectedYieldPerAcre: '20 - 24 Quintals',
    estProfitPerAcre: '₹38,000 - ₹48,000 / acre',
    marketDemand: 'Very High',
    bestSowingWindow: 'Oct 25 - Nov 15',
    keyPractices: [
      'Zero-tillage sowing conserves residual moisture and cuts diesel cost by 30%.',
      'Apply first crown root irrigation (CRI) at 21 days after sowing.',
      'Split Nitrogen into 3 equal doses: basal, first irrigation, and jointing stage.'
    ],
    pestRisks: ['Yellow Rust', 'Aphids', 'Termites in dry soil'],
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'crop_basmati_rice',
    name: 'Basmati Paddy (PB-1121 / 1509)',
    scientificName: 'Oryza sativa',
    category: 'grain',
    suitabilityScore: 94,
    season: 'kharif',
    optimalSoil: ['alluvial', 'clayey'],
    waterRequirement: 'High',
    growthDurationDays: 120,
    expectedYieldPerAcre: '18 - 22 Quintals',
    estProfitPerAcre: '₹55,000 - ₹72,000 / acre',
    marketDemand: 'Very High',
    bestSowingWindow: 'June 20 - July 10 (Transplanting)',
    keyPractices: [
      'Alternate Wetting and Drying (AWD) saves up to 30% canal water without yield reduction.',
      'Incorporate green manure (Dhaincha) 45 days prior to puddling for organic nitrogen enrichment.',
      'Maintain 2-3 cm shallow water layer during tillering to suppress weeds.'
    ],
    pestRisks: ['Stem Borer', 'Bacterial Leaf Blight', 'Brown Plant Hopper'],
    imageUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'crop_cotton_bt',
    name: 'Cotton (Hybrid Long Staple)',
    scientificName: 'Gossypium hirsutum',
    category: 'cash_crop',
    suitabilityScore: 92,
    season: 'kharif',
    optimalSoil: ['black', 'alluvial'],
    waterRequirement: 'Medium',
    growthDurationDays: 160,
    expectedYieldPerAcre: '10 - 14 Quintals',
    estProfitPerAcre: '₹45,000 - ₹60,000 / acre',
    marketDemand: 'High',
    bestSowingWindow: 'May 15 - June 20',
    keyPractices: [
      'Deep black soil retains moisture; install drip fertigation for 25% yield boost.',
      'Install yellow sticky traps (10/acre) and pheromone traps for pink bollworm monitoring.',
      'Nipping/detopping at 80 days controls vegetative growth and promotes boll development.'
    ],
    pestRisks: ['Pink Bollworm', 'Whitefly', 'Leaf Curl Virus'],
    imageUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'crop_soybean_js335',
    name: 'Soybean (JS-335 / NRC-37)',
    scientificName: 'Glycine max',
    category: 'oilseed',
    suitabilityScore: 90,
    season: 'kharif',
    optimalSoil: ['black', 'red_loamy'],
    waterRequirement: 'Medium',
    growthDurationDays: 95,
    expectedYieldPerAcre: '8 - 12 Quintals',
    estProfitPerAcre: '₹28,000 - ₹38,000 / acre',
    marketDemand: 'High',
    bestSowingWindow: 'June 15 - July 5',
    keyPractices: [
      'Seed treatment with Bradyrhizobium culture ensures 40 kg/acre atmospheric nitrogen fixation.',
      'Maintain broad-bed furrow (BBF) to prevent waterlogging during heavy monsoon downpours.',
      'Foliar spray of 2% DAP at pod initiation stage significantly enhances grain size.'
    ],
    pestRisks: ['Girdle Beetle', 'Semilooper', 'Yellow Mosaic'],
    imageUrl: 'https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'crop_mustard_pusa',
    name: 'Mustard (Pusa Bold / Giriraj)',
    scientificName: 'Brassica juncea',
    category: 'oilseed',
    suitabilityScore: 89,
    season: 'rabi',
    optimalSoil: ['sandy_loam', 'alluvial', 'red_loamy'],
    waterRequirement: 'Low',
    growthDurationDays: 110,
    expectedYieldPerAcre: '7 - 10 Quintals',
    estProfitPerAcre: '₹32,000 - ₹42,000 / acre',
    marketDemand: 'High',
    bestSowingWindow: 'Oct 05 - Oct 25',
    keyPractices: [
      'Low water consumer: requires only 2 irrigations (flowering & siliqua development).',
      'Apply Sulfur @ 20 kg/acre to boost oil content above 41%.',
      'Thinning at 15-20 days maintains 30x10 cm spacing for robust branching.'
    ],
    pestRisks: ['Mustard Aphid', 'White Rust', 'Alternaria Blight'],
    imageUrl: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'crop_chickpea_desi',
    name: 'Chickpea / Gram (JG-11 / Vishal)',
    scientificName: 'Cicer arietinum',
    category: 'pulse',
    suitabilityScore: 88,
    season: 'rabi',
    optimalSoil: ['black', 'red_loamy', 'sandy_loam'],
    waterRequirement: 'Low',
    growthDurationDays: 105,
    expectedYieldPerAcre: '8 - 11 Quintals',
    estProfitPerAcre: '₹30,000 - ₹44,000 / acre',
    marketDemand: 'Very High',
    bestSowingWindow: 'Oct 15 - Nov 10',
    keyPractices: [
      'Excellent restorative crop; fixes nitrogen and enriches soil for next season.',
      'Avoid excess irrigation to prevent wilt disease and excessive vegetative growth.',
      'Nipping terminal shoots at 30 days induces prolific side branching and pod density.'
    ],
    pestRisks: ['Pod Borer (Helicoverpa)', 'Fusarium Wilt', 'Collar Rot'],
    imageUrl: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'crop_maize_hybrid',
    name: 'Hybrid Maize / Corn (DKC-9108)',
    scientificName: 'Zea mays',
    category: 'grain',
    suitabilityScore: 87,
    season: 'kharif',
    optimalSoil: ['alluvial', 'red_loamy', 'black'],
    waterRequirement: 'Medium',
    growthDurationDays: 100,
    expectedYieldPerAcre: '28 - 35 Quintals',
    estProfitPerAcre: '₹35,000 - ₹48,000 / acre',
    marketDemand: 'High',
    bestSowingWindow: 'June 10 - July 15',
    keyPractices: [
      'High response to balanced NPK (120:60:40 kg/ha) + Zinc Sulfate (25 kg/ha).',
      'Early detection and whorl application of Emamectin Benzoate for Fall Armyworm.',
      'Ensure adequate moisture during tasseling and silking to prevent sterile ears.'
    ],
    pestRisks: ['Fall Armyworm (FAW)', 'Stem Borer', 'Turcicum Leaf Blight'],
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'crop_red_chilli',
    name: 'Red Chilli (Guntur Teja / Byadgi)',
    scientificName: 'Capsicum annuum',
    category: 'cash_crop',
    suitabilityScore: 86,
    season: 'kharif',
    optimalSoil: ['black', 'red_loamy'],
    waterRequirement: 'Medium',
    growthDurationDays: 150,
    expectedYieldPerAcre: '18 - 25 Quintals (Dry)',
    estProfitPerAcre: '₹90,000 - ₹1,40,000 / acre',
    marketDemand: 'Very High',
    bestSowingWindow: 'July 15 - Aug 20 (Nursery transplant)',
    keyPractices: [
      'Raised bed cultivation with silver-black plastic mulch for weed suppression and soil warmth.',
      'Drip fertigation twice a week with water soluble NPK 19:19:19 and Calcium Nitrate.',
      'Neem oil foliar sprays prevent sucking pest vectors like thrips and mites.'
    ],
    pestRisks: ['Thrips (Black Thrips)', 'Mites', 'Anthracnose Fruit Rot', 'Leaf Curl'],
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'crop_groundnut_odisha',
    name: 'Groundnut / Peanut (Kadiri-6 / TMV-2)',
    scientificName: 'Arachis hypogaea',
    category: 'oilseed',
    suitabilityScore: 93,
    season: 'rabi',
    optimalSoil: ['alluvial', 'sandy_loam', 'red_loamy'],
    waterRequirement: 'Medium',
    growthDurationDays: 115,
    expectedYieldPerAcre: '12 - 16 Quintals (Pods)',
    estProfitPerAcre: '₹42,000 - ₹56,000 / acre',
    marketDemand: 'Very High',
    bestSowingWindow: 'Nov 15 - Dec 20 (Rabi / Coastal)',
    keyPractices: [
      'Apply Gypsum @ 200 kg/acre at 40-45 days (pegging stage) to ensure full pod filling and high shell strength.',
      'Maintain light, frequent irrigations during flowering and peg entry stages.',
      'Treat seed with Trichoderma viride and Rhizobium culture before sowing.'
    ],
    pestRisks: ['Tikka Leaf Spot', 'Collar Rot', 'Spodoptera (Leaf Miner)'],
    imageUrl: 'https://images.unsplash.com/photo-1567892328224-e9b626490333?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'crop_kalajeera_rice',
    name: 'Kalajeera Rice (Odisha GI Aromatic)',
    scientificName: 'Oryza sativa (Kalajeera)',
    category: 'grain',
    suitabilityScore: 95,
    season: 'kharif',
    optimalSoil: ['alluvial', 'clayey', 'red_loamy'],
    waterRequirement: 'High',
    growthDurationDays: 140,
    expectedYieldPerAcre: '16 - 20 Quintals',
    estProfitPerAcre: '₹60,000 - ₹85,000 / acre',
    marketDemand: 'Very High',
    bestSowingWindow: 'June 15 - July 10 (Transplanting)',
    keyPractices: [
      'System of Rice Intensification (SRI) with single seedling transplanting increases tillering by 40%.',
      'Incorporate Dhaincha (green manure) and neem cake during puddling for natural fragrance enrichment.',
      'Maintain shallow 2 cm water layer; drain field 10 days before harvest for uniform ripening.'
    ],
    pestRisks: ['Yellow Stem Borer', 'Bacterial Leaf Blight', 'Brown Plant Hopper (BPH)'],
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'
  }
];

export const INITIAL_MANDI_PRICES: MandiPriceItem[] = [
  {
    id: 'mp_odisha_paddy',
    cropName: 'Paddy (Grade A / Swarna)',
    variety: 'Swarna (MTU-7029) & Pooja',
    marketName: 'Bargarh APMC Mandi, Odisha',
    state: 'Odisha',
    currentPrice: 2320,
    currency: '₹',
    unit: 'Quintal',
    change24h: 1.8,
    mspPrice: 2203,
    arrivalVolumeTons: 2200,
    trend: 'up',
    updatedAt: '8 mins ago'
  },
  {
    id: 'mp_odisha_groundnut',
    cropName: 'Groundnut Pods (Oil & Bold Grade)',
    variety: 'TMV-2 / Kadiri Bold',
    marketName: 'Cuttack Malgodown, Odisha',
    state: 'Odisha',
    currentPrice: 6850,
    currency: '₹',
    unit: 'Quintal',
    change24h: 2.2,
    mspPrice: 6377,
    arrivalVolumeTons: 740,
    trend: 'up',
    updatedAt: '12 mins ago'
  },
  {
    id: 'mp_wheat',
    cropName: 'Wheat (Sharbati & Mill Quality)',
    variety: 'HD-2967 / Mill Quality',
    marketName: 'Khanna Mandi, Punjab',
    state: 'Punjab',
    currentPrice: 2480,
    currency: '₹',
    unit: 'Quintal',
    change24h: 2.4,
    mspPrice: 2275,
    arrivalVolumeTons: 1450,
    trend: 'up',
    updatedAt: '10 mins ago'
  },
  {
    id: 'mp_basmati',
    cropName: 'Basmati Paddy 1121 (Pusa)',
    variety: '1121 Golden Sella / Raw',
    marketName: 'Karnal Grain Market, Haryana',
    state: 'Haryana',
    currentPrice: 4250,
    currency: '₹',
    unit: 'Quintal',
    change24h: 3.8,
    mspPrice: 2183,
    arrivalVolumeTons: 820,
    trend: 'up',
    updatedAt: '25 mins ago'
  },
  {
    id: 'mp_cotton',
    cropName: 'Cotton (Medium & Long Staple)',
    variety: 'Bt Shankar-6 / Bunny',
    marketName: 'Rajkot APMC, Gujarat',
    state: 'Gujarat',
    currentPrice: 7620,
    currency: '₹',
    unit: 'Quintal',
    change24h: -0.8,
    mspPrice: 7122,
    arrivalVolumeTons: 2100,
    trend: 'down',
    updatedAt: '1 hour ago'
  },
  {
    id: 'mp_soybean',
    cropName: 'Soybean (Yellow)',
    variety: 'JS-335 Yellow Grade A',
    marketName: 'Indore Mandi, MP',
    state: 'Madhya Pradesh',
    currentPrice: 4890,
    currency: '₹',
    unit: 'Quintal',
    change24h: 1.5,
    mspPrice: 4600,
    arrivalVolumeTons: 3400,
    trend: 'up',
    updatedAt: '15 mins ago'
  },
  {
    id: 'mp_mustard',
    cropName: 'Mustard Seed / Rapeseed',
    variety: '42% Oil Content Bold',
    marketName: 'Alwar Mandi, Rajasthan',
    state: 'Rajasthan',
    currentPrice: 5650,
    currency: '₹',
    unit: 'Quintal',
    change24h: 0.5,
    mspPrice: 5650,
    arrivalVolumeTons: 1100,
    trend: 'stable',
    updatedAt: '35 mins ago'
  },
  {
    id: 'mp_chilli',
    cropName: 'Red Chilli (Dry)',
    variety: 'Guntur Teja / 334',
    marketName: 'Guntur Mirchi Yard, AP',
    state: 'Andhra Pradesh',
    currentPrice: 19800,
    currency: '₹',
    unit: 'Quintal',
    change24h: 4.2,
    mspPrice: undefined,
    arrivalVolumeTons: 650,
    trend: 'up',
    updatedAt: '5 mins ago'
  },
  {
    id: 'mp_onion',
    cropName: 'Onion (Nashik Red)',
    variety: 'Garwa / Medium Bold',
    marketName: 'Lasalgaon APMC, Maharashtra',
    state: 'Maharashtra',
    currentPrice: 2150,
    currency: '₹',
    unit: 'Quintal',
    change24h: -3.2,
    mspPrice: undefined,
    arrivalVolumeTons: 4800,
    trend: 'down',
    updatedAt: '40 mins ago'
  },
  {
    id: 'mp_maize',
    cropName: 'Maize / Corn (Yellow Feed)',
    variety: 'Feed & Starch Grade',
    marketName: 'Davanagere APMC, Karnataka',
    state: 'Karnataka',
    currentPrice: 2280,
    currency: '₹',
    unit: 'Quintal',
    change24h: 1.1,
    mspPrice: 2090,
    arrivalVolumeTons: 1950,
    trend: 'up',
    updatedAt: '18 mins ago'
  }
];

export const INITIAL_HARVEST_LISTINGS: HarvestListing[] = [
  {
    id: 'harvest_1',
    farmerName: 'Gurpreet Singh',
    farmerPhone: '+91 98765-43210',
    farmerLocation: 'Ludhiana, Punjab (15 km from Mandi)',
    cropName: 'Basmati Paddy (PB-1121)',
    variety: 'Pusa Basmati 1121 Premium Long Grain',
    quantity: 120,
    unit: 'Quintals',
    expectedPricePerUnit: 4400,
    minAcceptablePrice: 4200,
    harvestDate: 'Harvested 3 days ago (Dry in shed)',
    isOrganic: false,
    qualityGrade: 'Grade A+ (Premium)',
    moisturePercentage: 12.8,
    description: 'High-quality sun-dried Basmati paddy. Moisture tested at 12.8%. Stored in clean, covered warehouse on wooden pallets. Ready for instant dispatch.',
    status: 'under_negotiation',
    postedAt: '2 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'harvest_2',
    farmerName: 'Rameshwar Patil',
    farmerPhone: '+91 94231-88765',
    farmerLocation: 'Amravati, Maharashtra',
    cropName: 'Soybean (JS-335)',
    variety: 'JS-335 Clean Yellow Seed',
    quantity: 85,
    unit: 'Quintals',
    expectedPricePerUnit: 5100,
    minAcceptablePrice: 4850,
    harvestDate: 'Fresh harvest (Ready today)',
    isOrganic: true,
    qualityGrade: 'Grade A+ (Premium)',
    moisturePercentage: 11.2,
    description: '100% Certified organic soybean lot. Zero chemical residue. High oil content (21%). Sorted and cleaned with seed grader.',
    status: 'active',
    postedAt: '5 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'harvest_3',
    farmerName: 'Venkata Reddy',
    farmerPhone: '+91 98480-12345',
    farmerLocation: 'Guntur, Andhra Pradesh',
    cropName: 'Dry Red Chilli (Teja Variety)',
    variety: 'Teja S17 Stemless',
    quantity: 45,
    unit: 'Quintals',
    expectedPricePerUnit: 20500,
    minAcceptablePrice: 19500,
    harvestDate: 'Sun-dried last week',
    isOrganic: false,
    qualityGrade: 'Grade A+ (Premium)',
    moisturePercentage: 9.5,
    description: 'Bright red color, high SHU pungency index. Cold storage bagged in 25kg gunny packs. Sample available for lab verification.',
    status: 'active',
    postedAt: '1 day ago',
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'harvest_odisha',
    farmerName: 'Pabitra Mohan Sahu',
    farmerPhone: '+91 94370-65432',
    farmerLocation: 'Bargarh, Odisha (Hirakud Command Area)',
    cropName: 'Aromatic Kalajeera Rice & Swarna Paddy',
    variety: 'GI Kalajeera / Swarna Grade A',
    quantity: 95,
    unit: 'Quintals',
    expectedPricePerUnit: 4800,
    minAcceptablePrice: 4500,
    harvestDate: 'Sun-dried last week (Moisture 12.2%)',
    isOrganic: true,
    qualityGrade: 'Grade A+ (Premium)',
    moisturePercentage: 12.2,
    description: 'Authentic GI-tagged aromatic Kalajeera rice lot grown using bio-inputs in Hirakud command canal zone. Excellent natural aroma and uniform grain length.',
    status: 'active',
    postedAt: '4 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'
  }
];

export const INITIAL_BUYER_OFFERS: BuyerOffer[] = [
  {
    id: 'offer_1',
    listingId: 'harvest_1',
    buyerName: 'Vikram Oswal',
    buyerCompany: 'Oswal Rice Mills & Agro Exporters',
    buyerType: 'Agri Exporter',
    buyerLocation: 'Amritsar, Punjab',
    buyerRating: 4.9,
    offeredPricePerUnit: 4300,
    offeredQuantity: 120,
    pickupTerms: 'Buyer arranges transport',
    paymentTerms: 'Instant Bank Transfer on Loading',
    status: 'pending',
    messages: [
      {
        sender: 'buyer',
        senderName: 'Vikram Oswal',
        text: 'Hello Sardarji, we inspected your PB-1121 listing. We need this lot for Middle East export. We offer ₹4,300/Quintal for all 120 Quintals with our own truck pickup.',
        timestamp: '1 hour ago',
        proposedPrice: 4300
      }
    ]
  },
  {
    id: 'offer_2',
    listingId: 'harvest_1',
    buyerName: 'Anil Agrawal',
    buyerCompany: 'Agrawal Grain Traders',
    buyerType: 'Mandi Trader',
    buyerLocation: 'Khanna APMC',
    buyerRating: 4.6,
    offeredPricePerUnit: 4220,
    offeredQuantity: 60,
    pickupTerms: 'Farmgate pickup',
    paymentTerms: 'Cash on Farmgate',
    status: 'pending',
    messages: [
      {
        sender: 'buyer',
        senderName: 'Anil Agrawal',
        text: 'We can buy 60 quintals immediately at ₹4,220 with cash settlement at your farm gate.',
        timestamp: '45 mins ago',
        proposedPrice: 4220
      }
    ]
  }
];

export const INITIAL_BUYER_DEMANDS: BuyerDemand[] = [
  {
    id: 'demand_1',
    buyerName: 'Sunil Mittal',
    buyerOrg: 'Patanjali Agro & Organic Mills',
    cropNeeded: 'Organic Mustard Seed (42%+ Oil)',
    requiredQuantity: '500 Quintals',
    maxBudgetPerUnit: 5800,
    location: 'Jaipur & Alwar hubs',
    deliveryDeadline: 'Within 10 days',
    contactNumber: '+91 98290-55443',
    status: 'open'
  },
  {
    id: 'demand_2',
    buyerName: 'Karthik Raman',
    buyerOrg: 'South Indian Feed Mills Consortium',
    cropNeeded: 'Yellow Maize / Corn (Moisture <13%)',
    requiredQuantity: '1200 Quintals',
    maxBudgetPerUnit: 2350,
    location: 'Coimbatore & Davanagere',
    deliveryDeadline: 'Immediate bulk requirement',
    contactNumber: '+91 94432-11009',
    status: 'open'
  },
  {
    id: 'demand_3',
    buyerName: 'Farhan Siddiqui',
    buyerOrg: 'Deccan Spices Extraction Ltd',
    cropNeeded: 'Red Chilli (Guntur Teja / Byadgi)',
    requiredQuantity: '250 Quintals',
    maxBudgetPerUnit: 21000,
    location: 'Guntur / Hyderabad',
    deliveryDeadline: 'Next 15 days',
    contactNumber: '+91 98499-77221',
    status: 'open'
  },
  {
    id: 'demand_odisha',
    buyerName: 'Debabrata Das',
    buyerOrg: 'Kalinga Rice Mills & Agri Export Co-operative',
    cropNeeded: 'Aromatic Kalajeera Paddy & Groundnut Pods',
    requiredQuantity: '800 Quintals',
    maxBudgetPerUnit: 4900,
    location: 'Bhubaneswar / Cuttack Malgodown Hub',
    deliveryDeadline: 'Immediate bulk dispatch',
    contactNumber: '+91 94371-22990',
    status: 'open'
  }
];

export const AGRONOMY_EXPERTS: AgronomyExpert[] = [
  {
    id: 'exp_1',
    name: 'Dr. M. S. Swaminathan Research Fellow: Dr. R. K. Sharma',
    title: 'Senior Principal Agronomist & Soil Scientist',
    organization: 'ICAR - Indian Agricultural Research Institute',
    specialization: 'Crop Nutrition, Organic Disease Management, NPK Formulations',
    rating: 4.95,
    answeredCount: 1420,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'exp_2',
    name: 'Prof. Anita Deshmukh',
    title: 'Plant Pathology & Integrated Pest Management Specialist',
    organization: 'State Agricultural University (PDKV)',
    specialization: 'Cotton & Pulse Pest Shield, Fungal Rusts & Blight Cures',
    rating: 4.88,
    answeredCount: 980,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'exp_3',
    name: 'Er. Balwinder Singh Dhillon',
    title: 'Water Management & Micro-Irrigation Engineer',
    organization: 'Center for Water Technology & Precision Agri',
    specialization: 'Drip Fertigation, Canal Automation, Soil Moisture Optimization',
    rating: 4.92,
    answeredCount: 1150,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
  }
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 'forum_1',
    authorName: 'Harpreet Singh Sandhu',
    authorLocation: 'Bathinda, Punjab',
    authorBadge: 'Progressive Farmer of the Year',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    category: 'high_yield',
    title: 'How I increased my Wheat yield to 24.5 Quintals/Acre with Zero Tillage & Bed Sowing',
    content: 'Brothers, for 3 years I had high diesel expenses and lodging in wheat due to sudden March rains. Last season, I switched to Super Seeder zero-tillage directly into paddy stubble. Result: saved ₹2,800/acre in tilling, no yellow rust emergence, and the stubble acted as natural mulch conserving moisture during the March heat spike!',
    cropTag: 'Wheat',
    likes: 184,
    hasLiked: false,
    commentsCount: 28,
    postedAt: '1 day ago',
    isVerifiedTip: true,
    comments: [
      {
        id: 'c1',
        authorName: 'Sukhdev Mann',
        authorLocation: 'Moga, Punjab',
        content: 'Did you apply basal DAP at sowing time with the seed drill?',
        postedAt: '18 hours ago',
        likes: 14
      },
      {
        id: 'c2',
        authorName: 'Harpreet Singh Sandhu',
        authorLocation: 'Bathinda, Punjab',
        content: 'Yes brother Sukhdev, 50kg DAP per acre placed 2 inches below the seed level through the combined seed drill.',
        postedAt: '14 hours ago',
        likes: 22
      }
    ]
  },
  {
    id: 'forum_2',
    authorName: 'Shivaji Jadhav',
    authorLocation: 'Solapur, Maharashtra',
    authorBadge: 'Organic Pioneer',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    category: 'pest_control',
    title: 'Home-made Dashaparni Ark recipe: 100% control of sucking pests in Cotton & Chilli',
    content: 'Instead of spending ₹1,200 per bottle on chemical sprays that kill friendly bees and ladybird beetles, prepare Dashaparni Ark: Mix 10 bitter leaves (Neem, Karanj, Calotropis, Custard apple, Papaya, etc.) with 10L cow urine and 2kg fresh cow dung. Ferment for 30 days. Spray 200ml per 15L pump. Repels whiteflies, thrips, and aphids safely.',
    cropTag: 'Cotton & Chilli',
    likes: 245,
    hasLiked: false,
    commentsCount: 42,
    postedAt: '2 days ago',
    isVerifiedTip: true,
    comments: [
      {
        id: 'c3',
        authorName: 'Malleshappa K',
        authorLocation: 'Raichur, Karnataka',
        content: 'Tested this on my Byadgi chilli last week. Sucking pests vanished within 48 hours without burning tender tips!',
        postedAt: '1 day ago',
        likes: 31
      }
    ]
  },
  {
    id: 'forum_3',
    authorName: 'Manjula Devi',
    authorLocation: 'Warangal, Telangana',
    authorBadge: 'Drip Tech Farmer',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    category: 'water_drip',
    title: 'Solar Drip Irrigation with Automation Timer: Cut electricity bills to ZERO',
    content: 'Installed 5HP PM-KUSUM solar pump coupled with Venturi drip injector and automatic solenoid valve. My farm runs on 4-hour cycle. Water reaches root zones directly at 6 AM before sun evaporation.',
    cropTag: 'Vegetables & Maize',
    likes: 132,
    hasLiked: false,
    commentsCount: 19,
    postedAt: '3 days ago',
    isVerifiedTip: true,
    comments: []
  },
  {
    id: 'forum_4',
    authorName: 'Ramesh Chand Choudhary',
    authorLocation: 'Nagaur, Rajasthan',
    authorBadge: 'FPO Director',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    category: 'govt_schemes',
    title: 'PM Fasal Bima Yojana (PMFBY) & KCC Limit Hike 2026: Steps to claim weather insurance',
    content: 'Important guide for all farmers: In case of localized unseasonal hail or heavy rains, inform your district insurance nodal officer or toll-free within 72 hours with geotagged photo via the Crop Insurance app. Do not wait for harvest survey!',
    cropTag: 'All Crops',
    likes: 310,
    hasLiked: false,
    commentsCount: 56,
    postedAt: '4 days ago',
    isVerifiedTip: true,
    comments: []
  },
  {
    id: 'forum_5',
    authorName: 'Soumya Ranjan Mohapatra',
    authorLocation: 'Bargarh, Odisha',
    authorBadge: 'Krishi Ratna Awardee',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    category: 'high_yield',
    title: 'SRI (System of Rice Intensification) in Hirakud Canal Zone: 26 Quintals/Acre paddy yield',
    content: 'ନମସ୍କାର ଭାଇମାନେ (Namaskar brothers), in our canal irrigated areas of Bargarh & Sambalpur, we achieved 26 Q/acre with SRI method: 12-day-old single seedling transplanting at 25x25 cm grid spacing, rotating weeder 3 times instead of manual weeding, and keeping alternate wetting and drying. We reduced seed requirement by 80% and water by 35% while doubling productive tillers per hill!',
    cropTag: 'Paddy / Rice',
    likes: 198,
    hasLiked: false,
    commentsCount: 34,
    postedAt: '2 days ago',
    isVerifiedTip: true,
    comments: [
      {
        id: 'c_odisha_1',
        authorName: 'Manas Jena',
        authorLocation: 'Cuttack, Odisha',
        content: 'Did you use bio-fertilizers like Azospirillum at transplanting time?',
        postedAt: '1 day ago',
        likes: 18
      },
      {
        id: 'c_odisha_2',
        authorName: 'Soumya Ranjan Mohapatra',
        authorLocation: 'Bargarh, Odisha',
        content: 'Yes brother Manas, seedling root dip with Azospirillum and PSB (Phosphate Solubilizing Bacteria) for 30 minutes before transplanting.',
        postedAt: '20 hours ago',
        likes: 27
      }
    ]
  }
];

export const COMMON_DISEASE_DIAGNOSES: Record<string, DiseaseDiagnosisResult> = {
  'yellow_rust': {
    diseaseName: 'Yellow Rust / Stripe Rust (Puccinia striiformis)',
    confidence: 96,
    cropAffected: 'Wheat & Barley',
    severity: 'Severe',
    symptoms: [
      'Yellow or orange pustules arranged in distinct linear stripes along leaf veins',
      'Powdery yellow spores rubbing off on fingers when touched',
      'Premature chlorosis and leaf drying leading to shriveled grains'
    ],
    organicRemedy: [
      'Foliar spray of Sour Buttermilk (Lassi fermented 5 days in copper pot) @ 50ml/L',
      'Spray 5% Neem Seed Kernel Extract (NSKE) at first appearance',
      'Dusting of wood ash mixed with sulfur powder in early morning dew'
    ],
    chemicalTreatment: [
      'Propiconazole 25% EC (Tilt) @ 1 ml per liter of water (200 ml/acre in 200L water)',
      'Tebuconazole 25.9% EC @ 1 ml/L on cloudy weather warning',
      'Repeat spray after 15 days if stripe development continues'
    ],
    preventiveMeasures: [
      'Plant rust-resistant certified varieties (e.g. HD-3086, DBW-187, PBW-725)',
      'Avoid late sowing; ensure timely planting by November 15',
      'Balanced nitrogen fertilization; avoid excessive urea which softens leaf cuticle'
    ],
    estimatedYieldImpact: '25% - 40% reduction if left untreated during grain filling'
  },
  'leaf_curl': {
    diseaseName: 'Chilli & Cotton Leaf Curl Virus (transmitted by Whitefly)',
    confidence: 94,
    cropAffected: 'Chilli, Cotton, Tomato, Papaya',
    severity: 'Moderate',
    symptoms: [
      'Upward and downward curling, puckering and crinkling of leaves',
      'Thickened, brittle veins and stunted plant growth',
      'Drastic reduction in flower buds and small deformed fruits'
    ],
    organicRemedy: [
      'Spray Agniastra / Dashaparni Ark @ 30ml/L every 7 days',
      'Install 15 Yellow Sticky Traps and 10 Blue Sticky Traps per acre to catch vector whiteflies and thrips',
      'Neem Oil (10,000 ppm) @ 3 ml/L + liquid soap sticker'
    ],
    chemicalTreatment: [
      'Diafenthiuron 50% WP @ 1.25 g/L or Acetamiprid 20% SP @ 0.5 g/L to eliminate vector whiteflies',
      'Pyriproxyfen 10% + Bifenthrin 10% EC @ 2 ml/L',
      'Foliar micronutrient spray (Zinc + Boron + Magnesium) to restore green vigor'
    ],
    preventiveMeasures: [
      'Grow barrier crops like 3 rows of Maize or Jowar around chilli border to block windborne whiteflies',
      'Remove and burn infected weed hosts (Parthenium / Congress grass) around bunds'
    ],
    estimatedYieldImpact: '30% - 50% loss in fruit set if vectors are uncontrolled'
  },
  'stem_borer': {
    diseaseName: 'Yellow Stem Borer & Leaf Folder (Scirpophaga incertulas)',
    confidence: 92,
    cropAffected: 'Paddy / Rice, Maize, Sugarcane',
    severity: 'Severe',
    symptoms: [
      'Dead hearts (drying of central shoot) in vegetative tillering stage',
      'White heads (empty, bleached panicles without grains) during flowering',
      'Bore holes with larval excreta near the base of the stem'
    ],
    organicRemedy: [
      'Release Trichogramma japonicum egg parasitoids @ 50,000/acre at weekly intervals',
      'Install Pheromone traps @ 8 per acre with specific sex lures',
      'Spray Bacillus thuringiensis (Bt) @ 2 g/L during twilight'
    ],
    chemicalTreatment: [
      'Chlorantraniliprole 18.5% SC (Coragen) @ 60 ml/acre in 200L water',
      'Cartap Hydrochloride 4G granules @ 7.5 kg/acre applied in standing water',
      'Flubendiamide 39.35% SC @ 0.3 ml/L'
    ],
    preventiveMeasures: [
      'Clip off seedling leaf tips before transplanting to eliminate egg masses',
      'Avoid high density planting; maintain 20x15 cm spacing for air circulation'
    ],
    estimatedYieldImpact: '20% - 35% empty panicles (Whiteheads) at harvest'
  },
  'blight': {
    diseaseName: 'Early & Late Blight (Phytophthora & Alternaria)',
    confidence: 91,
    cropAffected: 'Potato, Tomato, Mustard, Pulses',
    severity: 'Critical',
    symptoms: [
      'Water-soaked dark brown circular to irregular necrotic lesions with concentric rings',
      'White cottony fungal growth on leaf undersides during high humidity morning fog',
      'Rapid stem collapse and tuber/fruit rotting'
    ],
    organicRemedy: [
      'Bordeaux mixture (1%) or Copper Oxychloride 50% WP @ 2.5 g/L',
      'Trichoderma harzianum bio-fungicide @ 5 g/L root drench & foliar spray',
      'Cow urine + Garlic extract spray (10% solution)'
    ],
    chemicalTreatment: [
      'Cymoxanil 8% + Mancozeb 64% WP (Curzate) @ 2.5 g/L',
      'Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1 ml/L',
      'Metalaxyl 8% + Mancozeb 64% WP (Ridomil MZ) @ 2 g/L'
    ],
    preventiveMeasures: [
      'Ensure strict crop rotation with non-solanaceous crops',
      'Avoid overhead sprinkler irrigation; use drip irrigation to keep foliage dry'
    ],
    estimatedYieldImpact: '40% - 70% rapid foliage loss if fog persists'
  }
};
