import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingBag,
  TrendingUp,
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Users,
  Scale,
  Truck,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  DollarSign,
  Info,
  Check,
  Volume2,
} from 'lucide-react';
import { FarmerProfile, ProduceListing, BuyerRequest, HarvestCluster } from '../types/index.ts';
import {
  INITIAL_PRODUCE_LISTINGS,
  INITIAL_BUYER_REQUESTS,
  INITIAL_HARVEST_CLUSTERS,
  REGIONAL_MARKET_BENCHMARKS,
} from '../data/marketplaceData.ts';
import { useAccessibility } from '../context/AccessibilityContext.tsx';

interface FarmerMarketplaceViewProps {
  farmer: FarmerProfile;
  language: 'sw' | 'en';
  showToast: (msg: string) => void;
  onClose?: () => void;
}

type MarketSubTab = 'browse' | 'post' | 'buyers' | 'clusters' | 'calculator';

const STORAGE_KEY_LISTINGS = 'mkulima_produce_listings_v1';
const STORAGE_KEY_JOINED_CLUSTERS = 'mkulima_joined_clusters_v1';

export const FarmerMarketplaceView: React.FC<FarmerMarketplaceViewProps> = ({
  farmer,
  language,
  showToast,
  onClose,
}) => {
  const { speakText } = useAccessibility();
  const [activeTab, setActiveTab] = useState<MarketSubTab>('browse');

  // Listings State with LocalStorage Persistence
  const [listings, setListings] = useState<ProduceListing[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LISTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load listings from storage', e);
    }
    return INITIAL_PRODUCE_LISTINGS;
  });

  // Joined Clusters State
  const [joinedClusters, setJoinedClusters] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_JOINED_CLUSTERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // New Listing Form State
  const [formData, setFormData] = useState({
    crop: farmer.currentCrop || 'Tomatoes',
    variety: '',
    quantity: 30,
    unit: 'Crates (64kg)',
    pricePerUnitKes: 3800,
    county: farmer.county || 'Nakuru',
    subCounty: farmer.subCounty || '',
    harvestStatus: 'ready_now' as 'ready_now' | 'harvesting_this_week' | 'ready_in_2_weeks',
    description: '',
    isOrganic: true,
    farmerPhone: farmer.phone || '+254712345678',
  });

  // Interactive Calculator State
  const [calcCrop, setCalcCrop] = useState('Tomatoes');
  const [calcMarketPrice, setCalcMarketPrice] = useState(4400); // KES in Nairobi/Mombasa
  const [calcTransportPerUnit, setCalcTransportPerUnit] = useState(450); // KES per unit
  const [calcQuantity, setCalcQuantity] = useState(40);

  // Sync listings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(listings));
    } catch (e) {
      console.error('Failed to save listings', e);
    }
  }, [listings]);

  // Sync joined clusters to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_JOINED_CLUSTERS, JSON.stringify(joinedClusters));
    } catch (e) {
      console.error(e);
    }
  }, [joinedClusters]);

  // Filtered Produce Listings
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchesSearch =
        item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.county.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.farmerName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCrop = selectedCrop === 'all' || item.crop.toLowerCase() === selectedCrop.toLowerCase();
      const matchesCounty = selectedCounty === 'all' || item.county.toLowerCase() === selectedCounty.toLowerCase();
      const matchesStatus = selectedStatus === 'all' || item.harvestStatus === selectedStatus;

      return matchesSearch && matchesCrop && matchesCounty && matchesStatus;
    });
  }, [listings, searchQuery, selectedCrop, selectedCounty, selectedStatus]);

  // Handle Publish New Listing
  const handlePublishListing = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.crop || !formData.quantity || !formData.pricePerUnitKes) {
      showToast(language === 'sw' ? 'Tafadhali jaza taarifa zote muhimu' : 'Please fill all required fields');
      return;
    }

    const newListing: ProduceListing = {
      id: `user-prod-${Date.now()}`,
      farmerName: farmer.name || 'Mkulima Mwelewa',
      farmerPhone: formData.farmerPhone || '+254700000000',
      county: formData.county,
      subCounty: formData.subCounty || 'Eneo la Shamba',
      crop: formData.crop,
      variety: formData.variety || `${formData.crop} Safi ya Shambani`,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      pricePerUnitKes: Number(formData.pricePerUnitKes),
      fairMarketPriceKes: Math.round(Number(formData.pricePerUnitKes) * 1.05),
      harvestStatus: formData.harvestStatus,
      description: formData.description || (language === 'sw' ? 'Mazao bora ya shambani yasiyo na madalali.' : 'High quality farm harvest directly from farmer.'),
      isOrganic: formData.isOrganic,
      verifiedSeller: true,
      createdAt: language === 'sw' ? 'Sasa hivi' : 'Just now',
      viewsCount: 1,
      inquiriesCount: 0,
    };

    setListings([newListing, ...listings]);
    showToast(language === 'sw' ? '🎉 Tangazo lako limechapishwa sokoni!' : '🎉 Your harvest is now live on Soko Hub!');
    setActiveTab('browse');

    // Reset some fields
    setFormData((prev) => ({
      ...prev,
      variety: '',
      description: '',
    }));
  };

  // Handle Join Cluster
  const handleToggleJoinCluster = (clusterId: string, title: string) => {
    if (joinedClusters.includes(clusterId)) {
      setJoinedClusters(joinedClusters.filter((id) => id !== clusterId));
      showToast(language === 'sw' ? `Umejiondoa kwenye ${title}` : `Left cluster: ${title}`);
    } else {
      setJoinedClusters([...joinedClusters, clusterId]);
      showToast(language === 'sw' ? `✅ Umefaulu kujiunga na ${title}!` : `✅ Successfully joined cluster: ${title}!`);
    }
  };

  // Generate WhatsApp Direct Trading Link
  const getWhatsAppLink = (phone: string, farmerName: string, crop: string, quantity: number, unit: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message =
      language === 'sw'
        ? `Habari ${farmerName}, nimeona tangazo lako la ${crop} (${quantity} ${unit}) kwenye Smart Shamba 360 Soko Hub. Ningependa kununua au kujadili uchukuaji shambani. Ni lini naweza kutembelea shamba?`
        : `Hello ${farmerName}, I saw your ${crop} listing (${quantity} ${unit}) on Smart Shamba 360 Soko Hub. I am interested in purchasing directly from your farm. When can we arrange pickup?`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  // Generate Buyer Inquiry WhatsApp Link
  const getBuyerWhatsAppLink = (buyer: BuyerRequest) => {
    const cleanPhone = buyer.buyerPhone.replace(/[^0-9]/g, '');
    const message =
      language === 'sw'
        ? `Habari ${buyer.buyerName}, nimeona oda yenu ya ${buyer.targetCrop} (${buyer.quantityRequired}) kwenye Smart Shamba 360 Soko Hub. Mimi ni mkulima kutoka kaunti ya ${farmer.county} na nina uwezo wa kuwasambazia mazao haya bora. Je, tunaweza kuongea zaidi?`
        : `Hello ${buyer.buyerName}, I saw your order request for ${buyer.targetCrop} (${buyer.quantityRequired}) on Smart Shamba 360 Soko Hub. I am a farmer from ${farmer.county} county ready to supply high-grade produce. Let us discuss delivery terms.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  // Calculator computations
  const fairGatePrice = Math.max(0, calcMarketPrice - calcTransportPerUnit - 150); // deducting transport + KES 150 offloading/handling
  const brokerAverageOffer = Math.round(calcMarketPrice * 0.55); // Typical predatory broker gives 50-60% of wholesale
  const farmerExtraEarnings = Math.max(0, (fairGatePrice - brokerAverageOffer) * calcQuantity);

  return (
    <div className="space-y-5 pb-8 max-w-5xl mx-auto">
      {/* 1. HERO BANNER: ELIMINATING BROKERS & SECURING FAIR PRICES */}
      <div className="bg-gradient-to-r from-[#15532E] via-[#1B5E20] to-[#2E7D32] text-white rounded-3xl p-5 sm:p-7 shadow-lg relative overflow-hidden">
        {/* Background circuit leaves pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-10 pointer-events-none flex items-center justify-center">
          <img src="/logo.svg" alt="" className="w-full h-full object-contain filter invert" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-bold border border-white/20">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>{language === 'sw' ? 'Soko Huria Bila Madalali' : 'Direct Farm-to-Buyer Marketplace'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {language === 'sw' ? 'Soko la Mkulima & Bei za Mazao' : 'Mkulima Marketplace & Fair Pricing'}
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-2xl font-medium">
            {language === 'sw'
              ? 'Wafikie wanunuzi wakubwa, maduka makubwa, na shule moja kwa moja bila kupoteza 40% ya faida kwa walanguzi. Angalia bei halisi za Marikiti na uuze kwa faida.'
              : 'Connect directly with wholesale buyers, supermarkets, and schools. Eliminate broker exploitation, track live regional wholesale prices, and pool harvests for maximum profit.'}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/15">
              <div className="text-lg sm:text-xl font-black text-white">{listings.length}</div>
              <div className="text-[11px] text-emerald-200 font-medium">
                {language === 'sw' ? 'Mazao Yaliyotangazwa' : 'Active Harvests'}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/15">
              <div className="text-lg sm:text-xl font-black text-white">4</div>
              <div className="text-[11px] text-emerald-200 font-medium">
                {language === 'sw' ? 'Oda za Wanunuzi' : 'Buyer Tenders'}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/15">
              <div className="text-lg sm:text-xl font-black text-yellow-300">+35%</div>
              <div className="text-[11px] text-emerald-200 font-medium">
                {language === 'sw' ? 'Faida Ziada kwa Mkulima' : 'Farmer Income Gain'}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/15">
              <div className="text-lg sm:text-xl font-black text-white">5 Masoko</div>
              <div className="text-[11px] text-emerald-200 font-medium">
                {language === 'sw' ? 'Bei za Moja kwa Moja' : 'Live Wholesale Tracker'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'browse', labelSw: '🛒 Nunua / Mazao Yaliyopo', labelEn: '🛒 Browse Harvests', icon: ShoppingBag },
          { id: 'post', labelSw: '📢 Weka Tangazo Lako', labelEn: '📢 List My Harvest', icon: Plus },
          { id: 'buyers', labelSw: '🏢 Oda za Wanunuzi (Tenders)', labelEn: '🏢 Buyer Requests', icon: Building2 },
          { id: 'clusters', labelSw: '🤝 Umoja wa Wakulima (Pooling)', labelEn: '🤝 Group Selling Pools', icon: Users },
          { id: 'calculator', labelSw: '⚖️ Kikokotoo cha Bei Halisi', labelEn: '⚖️ Fair Price Calculator', icon: Scale },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as MarketSubTab);
                if (tab.id === 'calculator') {
                  speakText(
                    language === 'sw'
                      ? 'Kikokotoo hiki kinakukinga na madalali kwa kukuonyesha bei ya chini kabisa unayopaswa kuuza shambani.'
                      : 'This fair gate price calculator protects you against middlemen by showing the minimum acceptable price at your farm gate.'
                  );
                }
              }}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs ${
                isActive
                  ? 'bg-[#15532E] text-white shadow-md ring-2 ring-emerald-600/30'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <span>{language === 'sw' ? tab.labelSw : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB 1: BROWSE PRODUCE LISTINGS */}
      {activeTab === 'browse' && (
        <div className="space-y-4">
          {/* Search & Filters Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    language === 'sw'
                      ? 'Tafuta zao, kaunti au mkulima (mf. Nyanya Kiambu, Mahindi Nakuru)...'
                      : 'Search crop, county or farmer (e.g. Tomatoes Kiambu, Maize Nakuru)...'
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#15532E]/30 focus:border-[#15532E]"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto">
                {/* Crop Filter */}
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  aria-label={language === 'sw' ? 'Chuja kwa Zao' : 'Filter by Crop'}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                >
                  <option value="all">{language === 'sw' ? 'Mazao Yote' : 'All Crops'}</option>
                  <option value="tomatoes">Tomatoes (Nyanya)</option>
                  <option value="maize">Maize (Mahindi)</option>
                  <option value="onions">Onions (Vitunguu)</option>
                  <option value="potatoes">Potatoes (Viazi)</option>
                  <option value="avocados">Avocados (Parachichi)</option>
                  <option value="beans">Beans (Maharage)</option>
                  <option value="bananas">Bananas (Ndizi)</option>
                </select>

                {/* County Filter */}
                <select
                  value={selectedCounty}
                  onChange={(e) => setSelectedCounty(e.target.value)}
                  aria-label={language === 'sw' ? 'Chuja kwa Kaunti' : 'Filter by County'}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                >
                  <option value="all">{language === 'sw' ? 'Kaunti Zote' : 'All Counties'}</option>
                  <option value="kiambu">Kiambu</option>
                  <option value="nakuru">Nakuru</option>
                  <option value="uasin gishu">Uasin Gishu</option>
                  <option value="machakos">Machakos</option>
                  <option value="meru">Meru</option>
                  <option value="kisii">Kisii</option>
                  <option value="trans nzoia">Trans Nzoia</option>
                </select>

                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  aria-label={language === 'sw' ? 'Chuja kwa Hali ya Mavuno' : 'Filter by Harvest Status'}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                >
                  <option value="all">{language === 'sw' ? 'Hali Yoyote' : 'Any Readiness'}</option>
                  <option value="ready_now">{language === 'sw' ? 'Tayari Sasa' : 'Ready Now'}</option>
                  <option value="harvesting_this_week">{language === 'sw' ? 'Wiki Hii' : 'This Week'}</option>
                  <option value="ready_in_2_weeks">{language === 'sw' ? 'Wiki 2 Zijazo' : 'In 2 Weeks'}</option>
                </select>
              </div>
            </div>

            {/* Quick Helper Bar */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
              <span>
                {language === 'sw'
                  ? `Mazao ${filteredListings.length} yamepatikana kwa ununuzi wa moja kwa moja`
                  : `Showing ${filteredListings.length} active farm harvests ready for direct trade`}
              </span>
              <button
                onClick={() => setActiveTab('post')}
                className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-bold hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'sw' ? 'Uza Mavuno Yako Hapa' : 'Sell Your Harvest Here'}</span>
              </button>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredListings.map((item) => {
              const whatsAppUrl = getWhatsAppLink(item.farmerPhone, item.farmerName, item.crop, item.quantity, item.unit);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Crop Badge & Readiness */}
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-lg text-slate-900 leading-snug">{item.crop}</h3>
                          {item.isOrganic && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                              🌱 Organic
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 font-semibold">{item.variety}</div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 ${
                          item.harvestStatus === 'ready_now'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {item.harvestStatus === 'ready_now'
                          ? language === 'sw' ? '🟢 Tayari Sasa' : '🟢 Ready Now'
                          : language === 'sw' ? '⏳ Wiki Hii' : '⏳ This Week'}
                      </span>
                    </div>

                    {/* Location & Farmer Profile */}
                    <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl mb-3 border border-slate-100">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>{item.county}, {item.subCounty}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        {item.verifiedSeller && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                        <span>{item.farmerName}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
                      {item.description}
                    </p>

                    {/* Quantity & Fair Price Highlights */}
                    <div className="grid grid-cols-2 gap-2 bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100/80 mb-4">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">
                          {language === 'sw' ? 'Kiasi Kilichopo' : 'Available Volume'}
                        </div>
                        <div className="text-base font-extrabold text-slate-900">
                          {item.quantity} <span className="text-xs font-semibold text-slate-600">{item.unit}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">
                          {language === 'sw' ? 'Bei ya Shambani' : 'Farm-Gate Price'}
                        </div>
                        <div className="text-base font-black text-[#15532E]">
                          KSh {item.pricePerUnitKes.toLocaleString()}
                          <span className="text-[10px] font-normal text-slate-500 block">
                            {language === 'sw' ? 'Bila dalali' : 'Direct trade'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons: Direct WhatsApp & Call */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <a
                      href={whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 text-center"
                    >
                      <MessageCircle className="w-4 h-4 fill-white/20" />
                      <span>{language === 'sw' ? 'Oda kwa WhatsApp' : 'Order via WhatsApp'}</span>
                    </a>

                    <a
                      href={`tel:${item.farmerPhone}`}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all border border-slate-200"
                      title={language === 'sw' ? 'Piga simu moja kwa moja' : 'Call farmer directly'}
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-700" />
                      <span className="hidden sm:inline">{language === 'sw' ? 'Piga' : 'Call'}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: POST / LIST YOUR HARVEST */}
      {activeTab === 'post' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'sw' ? 'Weka Mazao Sokoni Bure' : 'List Harvest For Free'}</span>
            </div>
            <h3 className="text-xl font-black text-slate-900">
              {language === 'sw' ? 'Weka Tangazo la Mazao Yako' : 'List Your Farm Harvest'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'sw'
                ? 'Wanunuzi wa mikahawa, maduka makubwa, na shule wanatafuta mazao kila siku. Tangazo lako litaonekana papo hapo.'
                : 'Supermarkets, schools, and wholesale aggregators check Smart Shamba 360 daily. Fill in your details below.'}
            </p>
          </div>

          <form onSubmit={handlePublishListing} className="space-y-4">
            {/* Crop & Variety */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === 'sw' ? 'Zao la Kilimo *' : 'Crop Type *'}
                </label>
                <select
                  value={formData.crop}
                  onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                  required
                >
                  <option value="Tomatoes">Tomatoes (Nyanya)</option>
                  <option value="Maize">Maize (Mahindi)</option>
                  <option value="Potatoes">Potatoes (Viazi)</option>
                  <option value="Onions">Onions (Vitunguu)</option>
                  <option value="Beans">Beans (Maharage)</option>
                  <option value="Avocados">Avocados (Parachichi)</option>
                  <option value="Bananas">Bananas (Ndizi)</option>
                  <option value="Cabbages / Vegetables">Cabbages / Sukuma Wiki</option>
                  <option value="Watermelon">Watermelon (Tikiti)</option>
                  <option value="Milk / Maziwa">Fresh Dairy Milk (Maziwa)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === 'sw' ? 'Aina / Mbegu (Variety) *' : 'Variety / Grade *'}
                </label>
                <input
                  type="text"
                  value={formData.variety}
                  onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                  placeholder={language === 'sw' ? 'mf. Anna F1, Shangi, Red Pinoy, H614' : 'e.g. Anna F1, Shangi, Hass, Grade 1'}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                  required
                />
              </div>
            </div>

            {/* Quantity & Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === 'sw' ? 'Kiasi Kilichopo (Quantity) *' : 'Available Quantity *'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === 'sw' ? 'Kipimo (Unit) *' : 'Packaging Unit *'}
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                >
                  <option value="Crates (64kg)">Crates (Tenga 64kg)</option>
                  <option value="Bags (90kg)">Bags (Gunia 90kg)</option>
                  <option value="Bags (50kg)">Bags (Gunia 50kg)</option>
                  <option value="Sacks (50kg)">Sacks (Viroba 50kg)</option>
                  <option value="Kilograms (kg)">Kilograms (kg)</option>
                  <option value="Tonnes">Tonnes (Tani)</option>
                  <option value="Bunches (Mikungu)">Bunches (Mikungu ya Ndizi)</option>
                  <option value="Liters">Liters (Lita za Maziwa)</option>
                </select>
              </div>
            </div>

            {/* Farm-Gate Price & Fair Warning */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {language === 'sw' ? 'Bei Unayotaka Shambani (KSh kwa kila kipimo) *' : 'Asking Price (KSh per unit) *'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">KSh</span>
                <input
                  type="number"
                  min="10"
                  value={formData.pricePerUnitKes}
                  onChange={(e) => setFormData({ ...formData, pricePerUnitKes: Number(e.target.value) })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-black text-[#15532E] focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                  required
                />
              </div>

              {/* Fair Price Guidance Alert */}
              <div className="mt-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-900">
                <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">
                    {language === 'sw' ? 'Miongozo ya Bei Halisi:' : 'Fair Pricing Protection:'}
                  </span>{' '}
                  {language === 'sw'
                    ? `Wakulima wengi wanauza ${formData.crop} kati ya KSh ${(formData.pricePerUnitKes * 0.95).toFixed(0)} hadi KSh ${(formData.pricePerUnitKes * 1.1).toFixed(0)}. Bei yako inalinda jasho lako na kuwavutia wanunuzi wakubwa bila madalali.`
                    : `Current market average for ${formData.crop} is around KSh ${(formData.pricePerUnitKes * 0.95).toFixed(0)} - KSh ${(formData.pricePerUnitKes * 1.1).toFixed(0)}. Direct trading saves you from 40% broker markdowns.`}
                </div>
              </div>
            </div>

            {/* Location: County & Sub-county */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === 'sw' ? 'Kaunti ya Shamba *' : 'Farm County *'}
                </label>
                <input
                  type="text"
                  value={formData.county}
                  onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                  placeholder="e.g. Nakuru, Kiambu, Machakos"
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === 'sw' ? 'Eneo / Kijiji (Sub-county / Town) *' : 'Sub-County / Town *'}
                </label>
                <input
                  type="text"
                  value={formData.subCounty}
                  onChange={(e) => setFormData({ ...formData, subCounty: e.target.value })}
                  placeholder="e.g. Molo, Gatundu, Moiben"
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                  required
                />
              </div>
            </div>

            {/* Harvest Readiness & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === 'sw' ? 'Upatikanaji wa Mazao *' : 'Harvest Readiness *'}
                </label>
                <select
                  value={formData.harvestStatus}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      harvestStatus: e.target.value as 'ready_now' | 'harvesting_this_week' | 'ready_in_2_weeks',
                    })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                >
                  <option value="ready_now">{language === 'sw' ? 'Tayari Shambani Leo' : 'Ready on Farm Today'}</option>
                  <option value="harvesting_this_week">{language === 'sw' ? 'Tutavuna Wiki Hii' : 'Harvesting This Week'}</option>
                  <option value="ready_in_2_weeks">{language === 'sw' ? 'Mavuno Wiki 2 Zijazo (Pre-order)' : 'Ready in 2 Weeks (Pre-order)'}</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === 'sw' ? 'Nambari ya WhatsApp / Simu *' : 'WhatsApp / Call Number *'}
                </label>
                <input
                  type="tel"
                  value={formData.farmerPhone}
                  onChange={(e) => setFormData({ ...formData, farmerPhone: e.target.value })}
                  placeholder="+254712345678"
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                  required
                />
              </div>
            </div>

            {/* Notes / Description */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {language === 'sw' ? 'Maelezo ya Ziada (Upatikanaji, ubora, usafiri)' : 'Additional Notes (Access, Quality, Transport)'}
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={
                  language === 'sw'
                    ? 'mf. Shamba liko karibu na barabara ya lami, lori linaweza kufika kwa urahisi...'
                    : 'e.g. Farm easily accessible by tarmac, truck loading assistance available...'
                }
                className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#15532E] hover:bg-[#1B5E20] text-white font-extrabold py-3.5 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>{language === 'sw' ? 'Chapisha Tangazo Sokoni (Bila Malipo)' : 'Publish My Harvest (100% Free)'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: BUYER TENDERS & REQUESTS */}
      {activeTab === 'buyers' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                {language === 'sw' ? 'Oda Kubwa za Wanunuzi (Institutional Tenders)' : 'Institutional Buyer Orders & Tenders'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'sw'
                  ? 'Maduka makubwa, shule na viwanda vinavyonunua mazao kwa mikataba ya moja kwa moja.'
                  : 'Verified supermarkets, boarding schools, and food exporters with guaranteed off-take contracts.'}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 self-start sm:self-auto">
              ✓ {INITIAL_BUYER_REQUESTS.length} Verified Tenders
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INITIAL_BUYER_REQUESTS.map((buyer) => {
              const whatsAppUrl = getBuyerWhatsAppLink(buyer);

              return (
                <div
                  key={buyer.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[10px] font-extrabold border border-blue-200">
                          {buyer.buyerType}
                        </span>
                        <h4 className="font-extrabold text-base text-slate-900 mt-1">{buyer.buyerName}</h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
                        KSh {buyer.buyingPriceKes.toLocaleString()} /{buyer.unit}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      {buyer.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          {language === 'sw' ? 'Kiasi Kinachohitajika' : 'Quantity Needed'}
                        </span>
                        <span className="font-bold text-slate-800">{buyer.quantityRequired}</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          {language === 'sw' ? 'Muda wa Mwisho' : 'Deadline'}
                        </span>
                        <span className="font-bold text-amber-800">{buyer.deadline}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{language === 'sw' ? 'Kaunti Zinazopendelewa:' : 'Target Counties:'} {buyer.preferredCounty}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-4 flex items-center gap-2">
                    <a
                      href={whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 text-center"
                    >
                      <MessageCircle className="w-4 h-4 fill-white/20" />
                      <span>{language === 'sw' ? 'Tuma Ombi la Kusambaza' : 'Apply to Supply via WhatsApp'}</span>
                    </a>

                    <a
                      href={`tel:${buyer.buyerPhone}`}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                      title={language === 'sw' ? 'Piga simu ofisini' : 'Call buyer office'}
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: HARVEST POOLING / GROUP SELLING (UMOJA WA WAKULIMA) */}
      {activeTab === 'clusters' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#15532E] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Users className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-slate-900">
                  {language === 'sw' ? 'Muungano wa Wakulima (Harvest Aggregation Pooling)' : 'Harvest Aggregation & Group Selling'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'sw'
                    ? 'Kwa nini uuze peke yako kwa dalali kwa bei ya chini? Jiunge na wakulima wenzako katika kaunti yako. Mkikusanya tani 10 au mifuko 200, makampuni makubwa ya usindikaji (millers na supermarkets) yanaleta lori na kulipa bei ya juu zaidi!'
                    : 'Why sell individually to farm-gate brokers at low prices? Group up with neighboring farmers in your ward. Combining 10 tonnes attracts large institutional buyers who send their own trucks and pay wholesale rates.'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {INITIAL_HARVEST_CLUSTERS.map((cluster) => {
              const isJoined = joinedClusters.includes(cluster.id);

              return (
                <div
                  key={cluster.id}
                  className={`bg-white rounded-3xl p-5 border transition-all flex flex-col justify-between ${
                    isJoined ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md' : 'border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold">
                        📍 {cluster.county}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{cluster.farmersCount} {language === 'sw' ? 'Wakulima' : 'Farmers'}</span>
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900 leading-snug">{cluster.title}</h4>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-500">
                        <span>{language === 'sw' ? 'Jumla ya Mazao:' : 'Total Pooled:'}</span>
                        <span className="font-bold text-slate-800">{cluster.totalPooled}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>{language === 'sw' ? 'Mteja Anayetarajiwa:' : 'Target Off-Taker:'}</span>
                        <span className="font-bold text-emerald-800">{cluster.targetBuyer}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 pt-1 border-t border-slate-200/60">
                        <span>{language === 'sw' ? 'Bei Iliyojadiliwa:' : 'Agreed Bulk Rate:'}</span>
                        <span className="font-black text-[#15532E]">KSh {cluster.negotiatedPriceKes.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Progress Bar towards Target Truckload */}
                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                        <span>{language === 'sw' ? 'Kujaza Lori (Target Truckload)' : 'Truck Capacity'}</span>
                        <span className="font-bold text-emerald-700">{cluster.progressPercent}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all"
                          style={{ width: `${cluster.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-4">
                    <button
                      onClick={() => handleToggleJoinCluster(cluster.id, cluster.title)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                        isJoined
                          ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                          : 'bg-[#15532E] hover:bg-[#1B5E20] text-white shadow-xs'
                      }`}
                    >
                      {isJoined ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-700" />
                          <span>{language === 'sw' ? '✓ Umejiunga na Kundi' : '✓ Joined Pool'}</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>{language === 'sw' ? 'Jiunge na Muungano Huu' : 'Join This Pool'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: FAIR FARM-GATE CALCULATOR & REGIONAL PRICE RADAR */}
      {activeTab === 'calculator' && (
        <div className="space-y-6">
          {/* Interactive Calculator Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-1">
                  <Scale className="w-3.5 h-3.5" />
                  <span>{language === 'sw' ? 'Mkingaji wa Mkulima Dhidi ya Madalali' : 'Middleman Defense Tool'}</span>
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  {language === 'sw' ? 'Kikokotoo cha Bei Halisi ya Shambani' : 'Fair Farm-Gate Price Calculator'}
                </h3>
              </div>

              <button
                onClick={() =>
                  speakText(
                    language === 'sw'
                      ? `Bei halisi ya chini unayopaswa kuuza ni Shilingi ${fairGatePrice.toLocaleString()}. Dalali asikupunje chini ya hapo.`
                      : `The fair minimum farm-gate price is ${fairGatePrice.toLocaleString()} shillings. Do not accept broker low-ball offers.`
                  )
                }
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                title={language === 'sw' ? 'Soma kwa sauti' : 'Read aloud'}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'sw'
                ? 'Madalali huja shambani wakidai kuwa bei ya mjini imeporomoka ili wanunue mazao yako kwa nusu bei. Weka bei ya soko la jiji na gharama ya usafiri ili ujue kiwango cha chini unachopaswa kukubali!'
                : 'Brokers often claim urban prices have collapsed to buy your crops at 50% discount. Enter the urban wholesale rate and transport cost to calculate your defended minimum.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === 'sw' ? 'Zao la Kilimo' : 'Select Crop'}
                </label>
                <select
                  value={calcCrop}
                  onChange={(e) => {
                    const c = e.target.value;
                    setCalcCrop(c);
                    if (c === 'Tomatoes') setCalcMarketPrice(4400);
                    if (c === 'Maize') setCalcMarketPrice(3800);
                    if (c === 'Onions') setCalcMarketPrice(5500);
                    if (c === 'Potatoes') setCalcMarketPrice(2800);
                  }}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                >
                  <option value="Tomatoes">Tomatoes (Nyanya - Crate 64kg)</option>
                  <option value="Maize">Maize (Mahindi - Bag 90kg)</option>
                  <option value="Onions">Onions (Vitunguu - Sack 50kg)</option>
                  <option value="Potatoes">Potatoes (Viazi - Bag 50kg)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === 'sw' ? 'Kiasi cha Kuuza' : 'Harvest Volume to Sell'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={calcQuantity}
                  onChange={(e) => setCalcQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === 'sw' ? 'Bei ya Jumla Sokoni (Marikiti/Kongowea)' : 'Urban Wholesale Rate (KES)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">KSh</span>
                  <input
                    type="number"
                    min="100"
                    value={calcMarketPrice}
                    onChange={(e) => setCalcMarketPrice(Number(e.target.value))}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === 'sw' ? 'Gharama ya Usafiri kwa Kila Kipimo' : 'Transport & Logistics Cost (KES)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">KSh</span>
                  <input
                    type="number"
                    min="0"
                    value={calcTransportPerUnit}
                    onChange={(e) => setCalcTransportPerUnit(Number(e.target.value))}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                  />
                </div>
              </div>
            </div>

            {/* RESULTS DEFENSE CARD */}
            <div className="bg-gradient-to-br from-[#15532E] to-[#1B5E20] text-white p-6 rounded-3xl shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
                  {language === 'sw' ? 'Ushauri wa Smart Shamba 360' : 'Defended Farm Gate Guidance'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-100 text-[10px] font-bold border border-emerald-400/40">
                  {language === 'sw' ? 'Usiuze Chini ya Hapa' : 'Defended Floor Price'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-emerald-200">
                    {language === 'sw' ? 'Kiwango cha Chini Shambani:' : 'Minimum Fair Gate Price:'}
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                    KSh {fairGatePrice.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-300">
                    {language === 'sw' ? 'kwa kila kipimo' : 'per unit'}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-emerald-200">
                    {language === 'sw' ? 'Ofa ya Kawaida ya Dalali:' : 'Typical Broker Low-Ball:'}
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-red-300 mt-1 line-through">
                    KSh {brokerAverageOffer.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-red-200">
                    {language === 'sw' ? 'Dalali anapata faida kubwa' : 'Loss of 45% farm revenue'}
                  </div>
                </div>
              </div>

              {/* Extra Earnings Saved */}
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/15 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-yellow-300">
                    {language === 'sw' ? 'Jumla ya Faida Unayookoa Shambani:' : 'Total Extra Farm Revenue Saved:'}
                  </div>
                  <div className="text-xs text-emerald-100">
                    {language === 'sw' ? `Kwa kuuza mazao ${calcQuantity} bila dalali` : `For ${calcQuantity} units sold directly`}
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-yellow-300">
                  +KSh {farmerExtraEarnings.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* REGIONAL LIVE BENCHMARKS TABLE */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h4 className="font-extrabold text-base text-slate-900 mb-1">
              {language === 'sw' ? 'Bei za Jumla za Masoko Makuu ya Kenya' : 'Major Kenyan Regional Wholesale Benchmarks'}
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              {language === 'sw'
                ? 'Wakulima Marikiti (Nairobi), Kongowea (Mombasa), Kibuye (Kisumu), Nakuru, na Eldoret.'
                : 'Direct from Nairobi Marikiti, Kongowea Mombasa, Kibuye Kisumu, Nakuru and Eldoret.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {REGIONAL_MARKET_BENCHMARKS.map((m, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-extrabold text-sm text-slate-900 block">{m.crop}</span>
                      <span className="text-[11px] text-slate-500">{m.market}</span>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        m.trend === 'rising'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.trend === 'falling'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {m.change}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1 border-t border-slate-200/60">
                    <span className="text-xs text-slate-500">{m.unit}</span>
                    <span className="text-lg font-black text-[#15532E]">
                      KSh {m.wholesalePriceKes.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-[11px] text-emerald-800 bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
                    <span className="font-bold">
                      {language === 'sw' ? 'Kiwango cha chini shambani: ' : 'Fair gate minimum: '}
                    </span>
                    KSh {m.fairGateMinKes.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
