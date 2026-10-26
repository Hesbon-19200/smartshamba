import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingBag,
  Users,
  Plus,
  Search,
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  ShieldCheck,
  Star,
  Building2,
  Calendar,
  DollarSign,
  Info,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Filter,
  Volume2,
  Scale,
  Truck,
  ExternalLink,
  Bell,
  BellRing,
  Trash2,
  TrendingUp,
  Flame,
  Check,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  Sliders,
  MessageSquare,
  Mic,
} from 'lucide-react';
import { FarmerProfile, ProduceListing, LocalBuyerContact, PriceAlert } from '../types/index.ts';
import {
  INITIAL_PRODUCE_LISTINGS,
  LOCAL_BUYERS_DIRECTORY,
  REGIONAL_MARKET_BENCHMARKS,
  DEFAULT_PRICE_ALERTS,
} from '../data/marketplaceData.ts';
import { BuyerChatModal } from './BuyerChatModal.tsx';
import { VoiceInputButton } from './VoiceInputButton.tsx';
import { useAccessibility } from '../context/AccessibilityContext.tsx';
import { useApp } from '../context/AppContext.tsx';

export interface MarketplaceViewProps {
  farmer: FarmerProfile;
  onNavigate?: (tab: string) => void;
  showToast: (msg: string) => void;
  onClose?: () => void;
}

type MarketplaceTab = 'buyers' | 'list_produce' | 'browse_produce' | 'alerts' | 'calculator';

const STORAGE_KEY_PRODUCE = 'mkulima_produce_listings_v1';
const STORAGE_KEY_PRICE_ALERTS = 'mkulima_price_alerts_v1';

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  farmer,
  onNavigate,
  showToast,
  onClose,
}) => {
  const { language } = useApp();
  const { speakText } = useAccessibility();

  const [activeTab, setActiveTab] = useState<MarketplaceTab>('buyers');
  const [chattingBuyer, setChattingBuyer] = useState<LocalBuyerContact | null>(null);

  // Produce listings with local storage persistence
  const [produceListings, setProduceListings] = useState<ProduceListing[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PRODUCE_LISTINGS;
  });

  // Filters for Local Buyers Directory
  const [buyerSearchQuery, setBuyerSearchQuery] = useState('');
  const [buyerCountyFilter, setBuyerCountyFilter] = useState<string>('all');
  const [buyerCategoryFilter, setBuyerCategoryFilter] = useState<string>('all');
  const [buyerCropFilter, setBuyerCropFilter] = useState<string>('all');

  // Filters for Produce Listings
  const [produceSearchQuery, setProduceSearchQuery] = useState('');
  const [produceCropFilter, setProduceCropFilter] = useState<string>('all');
  const [produceCountyFilter, setProduceCountyFilter] = useState<string>('all');

  // New Produce Form State
  const [newProduce, setNewProduce] = useState({
    crop: farmer.currentCrop || 'Tomatoes',
    variety: '',
    quantity: 35,
    unit: 'Crates (64kg)',
    pricePerUnitKes: 3850,
    county: farmer.county || 'Nakuru',
    subCounty: farmer.subCounty || '',
    harvestStatus: 'ready_now' as 'ready_now' | 'harvesting_this_week' | 'ready_in_2_weeks',
    description: '',
    isOrganic: true,
    farmerPhone: farmer.phone || '+254712345678',
  });

  // Calculator State
  const [calcCrop, setCalcCrop] = useState('Tomatoes');
  const [calcMarketPrice, setCalcMarketPrice] = useState(4400);
  const [calcTransport, setCalcTransport] = useState(400);
  const [calcQuantity, setCalcQuantity] = useState(30);

  // Price Alerts State with LocalStorage Persistence
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRICE_ALERTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PRICE_ALERTS;
  });

  // Regional benchmarks (can be simulated or dynamically spiked)
  const [marketBenchmarks, setMarketBenchmarks] = useState(REGIONAL_MARKET_BENCHMARKS);
  const [isAlertBannerDismissed, setIsAlertBannerDismissed] = useState(false);

  // New Price Alert Form State
  const [newAlertForm, setNewAlertForm] = useState({
    crop: farmer.currentCrop || 'Tomatoes',
    targetMarket: 'Wakulima Market (Marikiti - Nairobi)',
    thresholdPriceKes: 4300,
    unit: 'Crate (64kg)',
  });

  // Sync produce to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCE, JSON.stringify(produceListings));
    } catch (e) {
      console.error(e);
    }
  }, [produceListings]);

  // Sync price alerts to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRICE_ALERTS, JSON.stringify(priceAlerts));
    } catch (e) {
      console.error(e);
    }
  }, [priceAlerts]);

  // Evaluated Alerts against real-time wholesale benchmarks
  const evaluatedAlerts = useMemo(() => {
    return priceAlerts.map((alert) => {
      const matchingBenchmark = marketBenchmarks.find(
        (b) =>
          b.crop.toLowerCase().includes(alert.crop.toLowerCase()) ||
          alert.crop.toLowerCase().includes(b.crop.toLowerCase())
      );

      const currentPrice = matchingBenchmark ? matchingBenchmark.wholesalePriceKes : 0;
      const isExceeded = alert.enabled && currentPrice >= alert.thresholdPriceKes;

      return {
        ...alert,
        currentMarketPrice: currentPrice,
        marketName: matchingBenchmark ? matchingBenchmark.market : alert.targetMarket,
        isTriggered: isExceeded,
        differenceKes: currentPrice - alert.thresholdPriceKes,
      };
    });
  }, [priceAlerts, marketBenchmarks]);

  // Triggered Alerts that exceeded custom threshold
  const triggeredAlerts = useMemo(() => {
    return evaluatedAlerts.filter((a) => a.isTriggered);
  }, [evaluatedAlerts]);

  // Filtered Local Buyers
  const filteredBuyers = useMemo(() => {
    return LOCAL_BUYERS_DIRECTORY.filter((buyer) => {
      const q = buyerSearchQuery.toLowerCase();
      const matchesSearch =
        buyer.businessName.toLowerCase().includes(q) ||
        buyer.contactPerson.toLowerCase().includes(q) ||
        buyer.county.toLowerCase().includes(q) ||
        buyer.subCounty.toLowerCase().includes(q) ||
        buyer.cropsPurchased.some((c) => c.toLowerCase().includes(q));

      const matchesCounty = buyerCountyFilter === 'all' || buyer.county.toLowerCase() === buyerCountyFilter.toLowerCase();
      const matchesCategory = buyerCategoryFilter === 'all' || buyer.category === buyerCategoryFilter;
      const matchesCrop =
        buyerCropFilter === 'all' ||
        buyer.cropsPurchased.some((c) => c.toLowerCase().includes(buyerCropFilter.toLowerCase()));

      return matchesSearch && matchesCounty && matchesCategory && matchesCrop;
    });
  }, [buyerSearchQuery, buyerCountyFilter, buyerCategoryFilter, buyerCropFilter]);

  // Filtered Produce Listings
  const filteredProduce = useMemo(() => {
    return produceListings.filter((item) => {
      const q = produceSearchQuery.toLowerCase();
      const matchesSearch =
        item.crop.toLowerCase().includes(q) ||
        item.variety.toLowerCase().includes(q) ||
        item.county.toLowerCase().includes(q) ||
        item.farmerName.toLowerCase().includes(q);

      const matchesCrop = produceCropFilter === 'all' || item.crop.toLowerCase() === produceCropFilter.toLowerCase();
      const matchesCounty = produceCountyFilter === 'all' || item.county.toLowerCase() === produceCountyFilter.toLowerCase();

      return matchesSearch && matchesCrop && matchesCounty;
    });
  }, [produceListings, produceSearchQuery, produceCropFilter, produceCountyFilter]);

  // Handle Submit New Produce Listing
  const handlePublishProduce = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newProduce.crop || !newProduce.quantity || !newProduce.pricePerUnitKes) {
      showToast(language === 'sw' ? 'Tafadhali jaza taarifa zote muhimu' : 'Please fill all required fields');
      return;
    }

    const created: ProduceListing = {
      id: `prod-${Date.now()}`,
      farmerName: farmer.name || 'Mkulima Mwelewa',
      farmerPhone: newProduce.farmerPhone || '+254700000000',
      county: newProduce.county,
      subCounty: newProduce.subCounty || 'Eneo la Shamba',
      crop: newProduce.crop,
      variety: newProduce.variety || `${newProduce.crop} Grade 1`,
      quantity: Number(newProduce.quantity),
      unit: newProduce.unit,
      pricePerUnitKes: Number(newProduce.pricePerUnitKes),
      fairMarketPriceKes: Math.round(Number(newProduce.pricePerUnitKes) * 1.05),
      harvestStatus: newProduce.harvestStatus,
      description:
        newProduce.description ||
        (language === 'sw'
          ? 'Mazao safi ya shambani yanauzwa moja kwa moja bila madalali.'
          : 'High quality farm harvest directly for sale without middlemen.'),
      isOrganic: newProduce.isOrganic,
      verifiedSeller: true,
      createdAt: language === 'sw' ? 'Sasa hivi' : 'Just now',
      viewsCount: 1,
      inquiriesCount: 0,
    };

    setProduceListings([created, ...produceListings]);
    showToast(language === 'sw' ? '🎉 Mazao yako yamewekwa sokoni!' : '🎉 Produce successfully listed for sale!');
    setActiveTab('browse_produce');

    setNewProduce((prev) => ({
      ...prev,
      variety: '',
      description: '',
    }));
  };

  // Handle Create Custom Price Alert
  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertForm.crop || !newAlertForm.thresholdPriceKes) {
      showToast(language === 'sw' ? 'Tafadhali jaza zao na bei ya lengo' : 'Please select crop and threshold price');
      return;
    }

    const created: PriceAlert = {
      id: `alert-${Date.now()}`,
      crop: newAlertForm.crop,
      targetMarket: newAlertForm.targetMarket,
      thresholdPriceKes: Number(newAlertForm.thresholdPriceKes),
      unit: newAlertForm.unit,
      enabled: true,
      createdAt: language === 'sw' ? 'Sasa hivi' : 'Just now',
      isTriggered: false,
    };

    setPriceAlerts([created, ...priceAlerts]);
    showToast(
      language === 'sw'
        ? `🔔 Tahadhari ya bei ya ${created.crop} (> KSh ${created.thresholdPriceKes.toLocaleString()}) imewekwa kikamilifu!`
        : `🔔 Price alert for ${created.crop} (> KSh ${created.thresholdPriceKes.toLocaleString()}) set successfully!`
    );
    speakText(
      language === 'sw'
        ? `Tahadhari ya bei ya ${created.crop} imewekwa. Bei ikifika au kupita Shilingi ${created.thresholdPriceKes.toLocaleString()}, utapata taarifa papo hapo.`
        : `Price tracking alert set for ${created.crop}. You will be alerted when market rates exceed ${created.thresholdPriceKes.toLocaleString()} shillings.`
    );
  };

  // Toggle Alert Active / Inactive
  const handleToggleAlert = (alertId: string) => {
    setPriceAlerts(
      priceAlerts.map((a) => {
        if (a.id === alertId) {
          const next = !a.enabled;
          showToast(
            next
              ? language === 'sw' ? '🔔 Tahadhari imewashwa' : '🔔 Alert activated'
              : language === 'sw' ? '🔕 Tahadhari imezimwa' : '🔕 Alert paused'
          );
          return { ...a, enabled: next };
        }
        return a;
      })
    );
  };

  // Delete Alert
  const handleDeleteAlert = (alertId: string) => {
    setPriceAlerts(priceAlerts.filter((a) => a.id !== alertId));
    showToast(language === 'sw' ? 'Tahadhari imefutwa' : 'Alert removed');
  };

  // Simulate Market Price Surge (+15% to +25% shortage spike)
  const handleSimulatePriceSpike = () => {
    setMarketBenchmarks((prev) =>
      prev.map((b) => {
        if (b.crop.toLowerCase().includes('tomato') || b.crop.toLowerCase().includes('onion')) {
          const spikedWholesale = Math.round(b.wholesalePriceKes * 1.22);
          return {
            ...b,
            wholesalePriceKes: spikedWholesale,
            retailPriceKes: Math.round(b.retailPriceKes * 1.25),
            change: '+22%',
            trend: 'rising',
            notes: 'Mvua kubwa imezuia malori kufika sokoni, bei imelipuka juu!',
          };
        }
        return b;
      })
    );

    setIsAlertBannerDismissed(false);
    showToast(
      language === 'sw'
        ? '⚡ Mlipuko wa bei sokoni umeanza! Angalia tahadhari zilizopanda!'
        : '⚡ Market price surge simulated! High priority alerts triggered!'
    );
    speakText(
      language === 'sw'
        ? 'Tahadhari ya soko: Bei ya nyanya na vitunguu imelipuka juu sokoni Nairobi na Mombasa! Huu ndio muda wa kuuza kwa faida ya juu zaidi.'
        : 'Market alert: Tomato and onion wholesale prices have spiked across Nairobi and Mombasa! Best window to sell your harvest.'
    );
  };

  // Reset Market Simulation
  const handleResetSimulation = () => {
    setMarketBenchmarks(REGIONAL_MARKET_BENCHMARKS);
    showToast(language === 'sw' ? 'Bei za kawaida za soko zimerejeshwa' : 'Standard market benchmarks restored');
  };

  // Quick Sell from Triggered Alert
  const handleQuickSellFromAlert = (crop: string, targetPrice: number) => {
    setNewProduce((prev) => ({
      ...prev,
      crop: crop as any,
      pricePerUnitKes: targetPrice,
    }));
    setActiveTab('list_produce');
    showToast(
      language === 'sw'
        ? `Jaza kiasi cha ${crop} unachotaka kuuza kwa KSh ${targetPrice.toLocaleString()}`
        : `Specify volume of ${crop} you want to sell at KSh ${targetPrice.toLocaleString()}`
    );
  };

  // WhatsApp Link for Contacting Local Buyer
  const getBuyerWhatsAppLink = (buyer: LocalBuyerContact) => {
    const cleanPhone = buyer.whatsapp.replace(/[^0-9]/g, '');
    const message =
      language === 'sw'
        ? `Habari ${buyer.contactPerson} wa ${buyer.businessName}. Mimi ni mkulima kutoka kaunti ya ${farmer.county}. Nimeona unanunua ${buyer.cropsPurchased.join(', ')} kwenye Smart Shamba 360 Marketplace. Nina mazao bora ya shambani tayari kwa usambazaji. Tafadhali tujadiliane kuhusu ununuzi.`
        : `Hello ${buyer.contactPerson} (${buyer.businessName}). I am a farmer from ${farmer.county} County. I noticed your procurement listing for ${buyer.cropsPurchased.join(', ')} on Smart Shamba 360 Marketplace. I have quality produce ready for delivery and would like to supply your business.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  // WhatsApp Link for Ordering Produce from Farmer
  const getProduceWhatsAppLink = (item: ProduceListing) => {
    const cleanPhone = item.farmerPhone.replace(/[^0-9]/g, '');
    const message =
      language === 'sw'
        ? `Habari ${item.farmerName}, nimeona tangazo lako la ${item.crop} (${item.quantity} ${item.unit}) kwenye Smart Shamba 360 Marketplace. Ningependa kununua kutoka shambani kwako. Ni lini naweza kutembelea au kupanga usafiri?`
        : `Hello ${item.farmerName}, I saw your ${item.crop} listing (${item.quantity} ${item.unit}) on Smart Shamba 360 Marketplace. I want to buy directly from your farm. How can we arrange collection?`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  // Calculator computations
  const fairGateFloor = Math.max(0, calcMarketPrice - calcTransport - 150);
  const brokerOffer = Math.round(calcMarketPrice * 0.55);
  const totalSaved = Math.max(0, (fairGateFloor - brokerOffer) * calcQuantity);

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* 1. EMPOWERMENT HERO BANNER */}
      <div className="bg-gradient-to-r from-[#15532E] via-[#1B5E20] to-[#2E7D32] text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-bold border border-white/20">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>{language === 'sw' ? 'Soko la Moja kwa Moja la Wakulima' : 'Direct Farmer-to-Buyer Marketplace'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            {language === 'sw' ? 'Soko la Mazao & Mawasiliano ya Wanunuzi' : 'Marketplace & Verified Local Buyers'}
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-2xl font-medium">
            {language === 'sw'
              ? 'Suluhisho la ukosefu wa soko: Weka mazao yako yanayouzwa hadharani na ufikie orodha ya wanunuzi wa ndani (maduka makubwa, shule, na viwanda) wenye nambari za simu na WhatsApp zilizothibitishwa bila madalali.'
              : 'Directly solving the market access gap: List your harvest for sale and connect directly with verified local buyers (supermarkets, schools, processors, and exporters) complete with verified phone numbers and WhatsApp.'}
          </p>

          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/15">
              <div className="text-xl font-black text-white">{LOCAL_BUYERS_DIRECTORY.length} Wanunuzi</div>
              <div className="text-[11px] text-emerald-200 font-medium">
                {language === 'sw' ? 'Wanunuzi wa Ndani' : 'Verified Local Buyers'}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/15">
              <div className="text-xl font-black text-white">{produceListings.length} Mazao</div>
              <div className="text-[11px] text-emerald-200 font-medium">
                {language === 'sw' ? 'Yaliyowekwa Sokoni' : 'Harvests For Sale'}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/15">
              <div className="text-xl font-black text-yellow-300">0% Madalali</div>
              <div className="text-[11px] text-emerald-200 font-medium">
                {language === 'sw' ? 'Hakuna Walanguzi' : 'Zero Broker Cut'}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/15">
              <div className="text-xl font-black text-white">M-PESA / Benki</div>
              <div className="text-[11px] text-emerald-200 font-medium">
                {language === 'sw' ? 'Malipo ya Moja kwa Moja' : 'Instant Direct Payouts'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE PRICE SURGE ALERT NOTIFICATION BANNER */}
      {triggeredAlerts.length > 0 && !isAlertBannerDismissed && (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white rounded-3xl p-5 sm:p-6 shadow-xl border-2 border-amber-300 animate-in fade-in slide-in-from-top-3 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 text-amber-200">
                <Flame className="w-6 h-6 animate-bounce text-yellow-300" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-red-700 text-[10px] font-black uppercase tracking-wider shadow-xs">
                    {language === 'sw' ? '🔥 BEI IMEPANDA JUU!' : '🔥 PRICE THRESHOLD EXCEEDED!'}
                  </span>
                  <span className="text-xs text-amber-100 font-bold">
                    {triggeredAlerts.length} {language === 'sw' ? 'zao limefikia bei ya lengo' : 'crop alert(s) triggered'}
                  </span>
                </div>
                <h3 className="font-black text-lg sm:text-xl text-white">
                  {triggeredAlerts.map((a) => `${a.crop} (KSh ${a.currentMarketPrice.toLocaleString()})`).join(' • ')}
                </h3>
                <p className="text-xs text-amber-100 font-medium max-w-2xl leading-relaxed">
                  {language === 'sw'
                    ? 'Bei ya jumla ya sokoni imepita kiwango chako cha tahadhari. Huu ndio muda bora kabisa wa kuuza mazao yako moja kwa moja na kufunga mikataba na wanunuzi!'
                    : 'Wholesale market rates have crossed your target threshold. Sell your harvest now to secure top market profit without middleman discounts!'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('alerts')}
                className="bg-white text-red-700 hover:bg-amber-50 font-black py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <BellRing className="w-4 h-4" />
                <span>{language === 'sw' ? 'Angalia Tahadhari' : 'View Alerts'}</span>
              </button>

              <button
                onClick={() => {
                  speakText(
                    language === 'sw'
                      ? `Tahadhari ya soko: ${triggeredAlerts.map((a) => `Bei ya ${a.crop} imefika Shilingi ${a.currentMarketPrice.toLocaleString()} kwa kila ${a.unit}`).join('. ')}. Uza sasa upate faida ya juu.`
                      : `Market alert: ${triggeredAlerts.map((a) => `${a.crop} price has reached ${a.currentMarketPrice.toLocaleString()} shillings per ${a.unit}`).join('. ')}. Sell now for maximum return.`
                  );
                }}
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/20 transition-all cursor-pointer"
                title={language === 'sw' ? 'Sikiliza tahadhari' : 'Listen to alert'}
              >
                <Volume2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsAlertBannerDismissed(true)}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PRIMARY NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          {
            id: 'buyers',
            labelSw: '🏢 Wanunuzi wa Ndani (Local Buyers Directory)',
            labelEn: '🏢 Local Buyers Directory',
            icon: Users,
            badge: LOCAL_BUYERS_DIRECTORY.length,
          },
          {
            id: 'alerts',
            labelSw: '🔔 Tahadhari za Bei (Price Alerts)',
            labelEn: '🔔 Crop Price Alerts',
            icon: BellRing,
            badge: triggeredAlerts.length > 0 ? `🔥 ${triggeredAlerts.length}` : priceAlerts.length,
          },
          {
            id: 'list_produce',
            labelSw: '📢 Weka Mazao Yako Sokoni',
            labelEn: '📢 List Produce for Sale',
            icon: Plus,
          },
          {
            id: 'browse_produce',
            labelSw: '🛒 Mazao Yanayouzwa Shambani',
            labelEn: '🛒 Harvests For Sale',
            icon: ShoppingBag,
            badge: produceListings.length,
          },
          {
            id: 'calculator',
            labelSw: '⚖️ Kinga ya Bei (Fair Price Defender)',
            labelEn: '⚖️ Fair Price Defender',
            icon: Scale,
          },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as MarketplaceTab);
                if (tab.id === 'buyers') {
                  speakText(
                    language === 'sw'
                      ? 'Hawa hapa wanunuzi wa ndani walioidhinishwa wenye nambari za simu na WhatsApp.'
                      : 'Here is the verified local buyers directory with active phone and WhatsApp contacts.'
                  );
                } else if (tab.id === 'alerts') {
                  speakText(
                    language === 'sw'
                      ? 'Mfumo wa tahadhari za bei unakujulisha wakati bei ya zao lako inapozidi kiwango unachotaka.'
                      : 'The price tracking notification system alerts you when market rates for your crops exceed your threshold.'
                  );
                }
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer shrink-0 shadow-xs ${
                isActive
                  ? 'bg-[#15532E] text-white shadow-md ring-2 ring-emerald-500/30'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <span>{language === 'sw' ? tab.labelSw : tab.labelEn}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : typeof tab.badge === 'string' && tab.badge.includes('🔥')
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB 1: LOCAL BUYERS DIRECTORY (DIRECT MARKET ACCESS) */}
      {activeTab === 'buyers' && (
        <div className="space-y-4">
          {/* Search & County Filter Bar */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row gap-2.5">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={buyerSearchQuery}
                  onChange={(e) => setBuyerSearchQuery(e.target.value)}
                  placeholder={
                    language === 'sw'
                      ? 'Tafuta mnunuzi, kaunti, shule au zao (mf. Naivas, Nakuru, Nyanya, Mahindi)...'
                      : 'Search buyer, county, school, or crop (e.g. Naivas, Nakuru, Maize, Tomatoes)...'
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#15532E]/30 focus:border-[#15532E]"
                />
              </div>

              {/* County Filter */}
              <select
                value={buyerCountyFilter}
                onChange={(e) => setBuyerCountyFilter(e.target.value)}
                aria-label={language === 'sw' ? 'Chuja kwa Kaunti' : 'Filter by County'}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
              >
                <option value="all">{language === 'sw' ? 'Kaunti Zote za Kenya' : 'All Kenya Counties'}</option>
                <option value="nairobi">Nairobi</option>
                <option value="nakuru">Nakuru</option>
                <option value="kiambu">Kiambu</option>
                <option value="uasin gishu">Uasin Gishu</option>
                <option value="meru">Meru</option>
                <option value="kisii">Kisii</option>
                <option value="kilifi">Kilifi / Mombasa</option>
              </select>

              {/* Category Filter */}
              <select
                value={buyerCategoryFilter}
                onChange={(e) => setBuyerCategoryFilter(e.target.value)}
                aria-label={language === 'sw' ? 'Chuja kwa Aina ya Mnunuzi' : 'Filter by Category'}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
              >
                <option value="all">{language === 'sw' ? 'Aina Zote za Wanunuzi' : 'All Buyer Types'}</option>
                <option value="Supermarket">Supermarket</option>
                <option value="School / College">School / College</option>
                <option value="Food Processor / Miller">Food Processor / Miller</option>
                <option value="Wholesaler / Aggregator">Wholesaler / Aggregator</option>
                <option value="Hotel / Restaurant">Hotel / Restaurant</option>
                <option value="Export House">Export House</option>
              </select>
            </div>

            {/* Sub-bar hint */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span className="font-medium">
                {language === 'sw'
                  ? `Wanunuzi ${filteredBuyers.length} walioidhinishwa wanatafuta mazao sasa`
                  : `Showing ${filteredBuyers.length} verified buyers ready to purchase produce directly`}
              </span>

              <span className="text-[11px] text-emerald-800 font-bold hidden sm:inline">
                ✓ {language === 'sw' ? 'Nambari za simu zimehakikishwa' : 'Phone numbers verified by Smart Shamba 360'}
              </span>
            </div>
          </div>

          {/* Buyers Directory Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBuyers.map((buyer) => {
              const whatsAppUrl = getBuyerWhatsAppLink(buyer);

              return (
                <div
                  key={buyer.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3.5">
                    {/* Top Row: Business Name & Category Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[10px] font-extrabold border border-blue-200">
                            {buyer.category}
                          </span>
                          {buyer.verified && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span>{language === 'sw' ? 'Mnunuzi Halisi' : 'Verified Buyer'}</span>
                            </span>
                          )}
                        </div>
                        <h3 className="font-black text-lg text-slate-900 mt-1 leading-snug">
                          {buyer.businessName}
                        </h3>
                      </div>

                      {/* Rating & Volume */}
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 text-amber-500 font-extrabold text-xs justify-end">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{buyer.rating}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          {buyer.transactionsCompleted} {language === 'sw' ? 'mikataba' : 'trades'}
                        </span>
                      </div>
                    </div>

                    {/* Contact Person & Physical Location */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                      <div className="flex items-center gap-2 text-slate-800 font-bold">
                        <Users className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>{buyer.contactPerson}</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{buyer.physicalLocation} ({buyer.county} County)</span>
                      </div>
                    </div>

                    {/* Crops Needed Chips */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        {language === 'sw' ? 'Mazao Wanayonunua:' : 'Crops Purchased:'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {buyer.cropsPurchased.map((cropName, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 text-xs font-semibold border border-emerald-200/80"
                          >
                            {cropName}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Procurement & Payment Terms */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                          {language === 'sw' ? 'Mzunguko wa Ununuzi' : 'Buying Frequency'}
                        </span>
                        <span className="font-bold text-slate-800">{buyer.buyingFrequency}</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                          {language === 'sw' ? 'Njia ya Malipo' : 'Payment Terms'}
                        </span>
                        <span className="font-bold text-emerald-800">{buyer.paymentTerms}</span>
                      </div>
                    </div>

                    {/* Minimum Volume */}
                    <div className="text-[11px] text-slate-500 flex items-center justify-between px-1">
                      <span>{language === 'sw' ? 'Kiwango cha chini kinachochukuliwa:' : 'Minimum batch accepted:'}</span>
                      <span className="font-bold text-slate-800">{buyer.minimumVolume}</span>
                    </div>
                  </div>

                  {/* Direct Contact Action Buttons */}
                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center gap-2">
                    <button
                      onClick={() => setChattingBuyer(buyer)}
                      className="flex-1 bg-[#15532E] hover:bg-[#1B5E20] text-white font-extrabold py-2.5 px-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 text-center shadow-xs cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-300" />
                      <span>{language === 'sw' ? 'Ongea na Mnunuzi' : 'Chat with Buyer'}</span>
                    </button>

                    <a
                      href={whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all cursor-pointer"
                      title={language === 'sw' ? 'Ongea kwa WhatsApp' : 'WhatsApp'}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>

                    <a
                      href={`tel:${buyer.phone}`}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                      title={language === 'sw' ? 'Piga simu' : 'Call'}
                    >
                      <Phone className="w-4 h-4" />
                    </a>

                    {buyer.email && (
                      <a
                        href={`mailto:${buyer.email}`}
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all"
                        title={buyer.email}
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: CROP PRICE TRACKING & NOTIFICATION SYSTEM */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          {/* Header & Simulation Control Bar */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  <BellRing className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{language === 'sw' ? 'Ufuatiliaji wa Bei za Soko' : 'Real-Time Price Radar & Alerts'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {language === 'sw' ? 'Tahadhari za Bei kwa Mazao Yako' : 'Crop Price Tracking & Smart Alert System'}
                </h2>
                <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                  {language === 'sw'
                    ? 'Weka kiwango chako cha bei unayotaka kuuza. Mfumo unapogundua bei ya jumla ya soko jijini Nairobi, Mombasa au Nakuru imezidi lengo lako, utapata taarifa papo hapo ili uuze kwa faida ya juu.'
                    : 'Set custom price triggers for your harvest. When wholesale rates across Nairobi, Mombasa, Kisumu, or Nakuru exceed your threshold, you receive instant alerts to sell at peak profit.'}
                </p>
              </div>

              {/* Simulation Testing Tool */}
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 self-start md:self-auto shrink-0">
                <button
                  onClick={handleSimulatePriceSpike}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 text-yellow-300" />
                  <span>{language === 'sw' ? '⚡ Jaribu Mlipuko wa Bei (+22%)' : '⚡ Simulate Market Spike (+22%)'}</span>
                </button>

                <button
                  onClick={handleResetSimulation}
                  className="bg-white hover:bg-slate-100 text-slate-700 font-bold py-2 px-3 rounded-xl text-xs border border-slate-200 transition-all cursor-pointer"
                  title="Reset prices"
                >
                  <span>{language === 'sw' ? 'Rejesha' : 'Reset'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 5 Cols: Create Custom Threshold Alert Form */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-700" />
                  <span>{language === 'sw' ? 'Tengeneza Tahadhari Mpya ya Zao' : 'Set New Crop Price Alert'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'sw' ? 'Chagua zao na bei ya chini ya kuanza kuuza' : 'Specify target crop and target selling threshold'}
                </p>
              </div>

              <form onSubmit={handleCreateAlert} className="space-y-4">
                {/* Crop Selection */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {language === 'sw' ? 'Zao Lako *' : 'Your Crop *'}
                  </label>
                  <select
                    value={newAlertForm.crop}
                    onChange={(e) => {
                      const c = e.target.value;
                      let defaultUnit = 'Crates (64kg)';
                      let defaultPrice = 4300;
                      if (c === 'Maize') {
                        defaultUnit = 'Bags (90kg)';
                        defaultPrice = 3800;
                      } else if (c === 'Onions') {
                        defaultUnit = 'Sacks (50kg)';
                        defaultPrice = 5500;
                      } else if (c === 'Potatoes') {
                        defaultUnit = 'Bags (50kg)';
                        defaultPrice = 2800;
                      } else if (c === 'Beans') {
                        defaultUnit = 'Bags (90kg)';
                        defaultPrice = 11500;
                      } else if (c === 'Avocados') {
                        defaultUnit = 'Kilograms (kg)';
                        defaultPrice = 90;
                      }
                      setNewAlertForm({
                        ...newAlertForm,
                        crop: c,
                        unit: defaultUnit,
                        thresholdPriceKes: defaultPrice,
                      });
                    }}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                  >
                    <option value="Tomatoes">Tomatoes (Nyanya)</option>
                    <option value="Maize">Maize (Mahindi)</option>
                    <option value="Potatoes">Potatoes (Viazi Mviringo)</option>
                    <option value="Onions">Onions (Vitunguu)</option>
                    <option value="Beans">Beans (Maharage)</option>
                    <option value="Avocados">Avocados (Parachichi)</option>
                    <option value="Bananas">Bananas (Ndizi)</option>
                    <option value="Cabbages / Vegetables">Cabbages / Sukuma</option>
                  </select>
                </div>

                {/* Target Market Hub */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {language === 'sw' ? 'Soko la Lengo la Kufuatilia *' : 'Target Market Hub *'}
                  </label>
                  <select
                    value={newAlertForm.targetMarket}
                    onChange={(e) => setNewAlertForm({ ...newAlertForm, targetMarket: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                  >
                    <option value="Wakulima Market (Marikiti - Nairobi)">Wakulima Market (Marikiti - Nairobi)</option>
                    <option value="Kongowea Wholesale Market (Mombasa)">Kongowea Wholesale Market (Mombasa)</option>
                    <option value="Kibuye Market (Kisumu)">Kibuye Market (Kisumu)</option>
                    <option value="Wakulima Wholesale (Nakuru)">Wakulima Wholesale (Nakuru)</option>
                    <option value="Eldoret Municipal Wholesale">Eldoret Municipal Wholesale</option>
                  </select>
                </div>

                {/* Packaging Unit */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {language === 'sw' ? 'Kipimo cha Mazao (Unit) *' : 'Packaging Unit *'}
                  </label>
                  <input
                    type="text"
                    value={newAlertForm.unit}
                    onChange={(e) => setNewAlertForm({ ...newAlertForm, unit: e.target.value })}
                    placeholder="e.g. Crate (64kg), Bag (90kg)"
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                    required
                  />
                </div>

                {/* Threshold Price KES */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      {language === 'sw' ? 'Bei ya Lengo ya Tahadhari (KSh) *' : 'Target Price Threshold (KES) *'}
                    </label>
                    <span className="text-[11px] text-emerald-800 font-bold">
                      {language === 'sw' ? 'Kiwango cha arifa' : 'Alert Trigger'}
                    </span>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">KSh</span>
                    <input
                      type="number"
                      min="10"
                      step="50"
                      value={newAlertForm.thresholdPriceKes}
                      onChange={(e) =>
                        setNewAlertForm({ ...newAlertForm, thresholdPriceKes: Math.max(1, Number(e.target.value)) })
                      }
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-black text-[#15532E] focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                      required
                    />
                  </div>

                  {/* Helpful benchmark reminder */}
                  <div className="mt-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                    <span>
                      {language === 'sw' ? 'Bei ya sasa sokoni:' : 'Current market rate:'}
                    </span>
                    <span className="font-bold text-slate-800">
                      {(() => {
                        const m = marketBenchmarks.find((b) =>
                          b.crop.toLowerCase().includes(newAlertForm.crop.toLowerCase())
                        );
                        return m ? `KSh ${m.wholesalePriceKes.toLocaleString()} (${m.market.split('(')[0]})` : 'KSh 4,400';
                      })()}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#15532E] hover:bg-[#1B5E20] text-white font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Bell className="w-4 h-4 text-emerald-300" />
                  <span>{language === 'sw' ? 'Washa Tahadhari ya Bei' : 'Activate Price Alert'}</span>
                </button>
              </form>
            </div>

            {/* Right 7 Cols: Active Alerts Monitor */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {language === 'sw' ? 'Tahadhari Zako Zinazoendelea' : 'Your Active Price Subscriptions'}
                  </h3>
                  <span className="text-xs text-slate-500">
                    {priceAlerts.length} {language === 'sw' ? 'tahadhari zinasimamiwa' : 'alerts monitored continuously'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-800">
                    {language === 'sw' ? 'Inafuatilia Moja kwa Moja' : 'Live Tracking'}
                  </span>
                </div>
              </div>

              {/* Alerts List */}
              <div className="space-y-3">
                {evaluatedAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`bg-white rounded-3xl p-5 border transition-all ${
                      alert.isTriggered
                        ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-md bg-gradient-to-r from-white to-amber-50/50'
                        : alert.enabled
                        ? 'border-slate-200 shadow-xs'
                        : 'border-slate-200 opacity-60 bg-slate-50/80'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-black text-base text-slate-900">{alert.crop}</h4>
                          <span className="text-xs text-slate-500 font-medium">({alert.unit})</span>

                          {/* Trigger Status Badge */}
                          {alert.isTriggered ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black shadow-xs animate-pulse">
                              <Flame className="w-3 h-3 fill-white text-white" />
                              <span>{language === 'sw' ? 'BEI IMEPANDA!' : 'THRESHOLD REACHED!'}</span>
                            </span>
                          ) : alert.enabled ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                              <span>⏳ {language === 'sw' ? 'Inafuatilia' : 'Monitoring'}</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold">
                              {language === 'sw' ? 'Imezimwa' : 'Paused'}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{alert.marketName}</span>
                        </div>

                        {/* Price Comparison Row */}
                        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">
                              {language === 'sw' ? 'Lengo Lako (Target)' : 'Your Threshold'}
                            </span>
                            <span className="font-extrabold text-slate-800">
                              KSh {alert.thresholdPriceKes.toLocaleString()}
                            </span>
                          </div>

                          <div
                            className={`p-2 rounded-xl border ${
                              alert.isTriggered
                                ? 'bg-amber-100/70 border-amber-200 text-amber-950'
                                : 'bg-slate-50 border-slate-100 text-slate-800'
                            }`}
                          >
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">
                              {language === 'sw' ? 'Bei Halisi ya Soko' : 'Current Market Rate'}
                            </span>
                            <span className="font-black text-sm">
                              KSh {alert.currentMarketPrice.toLocaleString()}
                              {alert.differenceKes > 0 && (
                                <span className="text-[10px] font-black text-emerald-700 ml-1">
                                  (+KSh {alert.differenceKes.toLocaleString()})
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Control Actions */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleAlert(alert.id)}
                            className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 cursor-pointer transition-all"
                            title={alert.enabled ? 'Pause alert' : 'Resume alert'}
                          >
                            {alert.enabled ? (
                              <ToggleRight className="w-6 h-6 text-emerald-600" />
                            ) : (
                              <ToggleLeft className="w-6 h-6 text-slate-400" />
                            )}
                          </button>

                          <button
                            onClick={() => handleDeleteAlert(alert.id)}
                            className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 cursor-pointer transition-all"
                            title="Delete alert"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Quick Sell CTA if Triggered */}
                        {alert.isTriggered && (
                          <button
                            onClick={() => handleQuickSellFromAlert(alert.crop, alert.currentMarketPrice)}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-xs whitespace-nowrap"
                          >
                            <span>{language === 'sw' ? 'Uza Mazao Sasa' : 'Sell This Now'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIST YOUR PRODUCE FOR SALE */}
      {activeTab === 'list_produce' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'sw' ? 'Tangaza Mazao Yako Bila Madalali' : 'Direct Produce Sale'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {language === 'sw' ? 'Weka Mazao Yako Sokoni' : 'List Your Produce for Sale'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'sw'
                ? 'Wajulishe wanunuzi wa ndani kile unachovuna. Tangazo lako litachapishwa mara moja likiwa na nambari yako ya simu na WhatsApp.'
                : 'Notify verified buyers of what you are harvesting. Your produce goes live immediately with your direct contact details.'}
            </p>
          </div>

          {/* Hands-Free Voice Auto-Fill Assistant */}
          <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Mic className="w-4 h-4" />
              </div>
              <div className="text-xs text-emerald-950">
                <span className="font-extrabold block">
                  {language === 'sw' ? 'Jaza Tangazo kwa Sauti (Hands-Free Voice Fill)' : 'Voice-Powered Listing Assistant'}
                </span>
                <span className="text-[11px] text-emerald-800">
                  {language === 'sw'
                    ? 'Mikono ina matope? Ongea maelezo ya mazao na maelezo yatajazwa moja kwa moja.'
                    : 'Muddy hands in the field? Speak your harvest notes hands-free.'}
                </span>
              </div>
            </div>

            <VoiceInputButton
              lang={language}
              size="md"
              label={language === 'sw' ? 'Ongea Hapa' : 'Speak Listing'}
              onTranscript={(spokenText) => {
                setNewProduce((prev) => ({
                  ...prev,
                  description: prev.description ? `${prev.description}. ${spokenText}` : spokenText,
                }));
                showToast(
                  language === 'sw'
                    ? '🎤 Sauti imenaswa na kuongezwa kwenye maelezo ya zao!'
                    : '🎤 Voice captured and added to produce notes!'
                );
              }}
            />
          </div>

          <form onSubmit={handlePublishProduce} className="space-y-4">
            {/* Crop & Variety */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === 'sw' ? 'Zao la Kilimo *' : 'Crop for Sale *'}
                </label>
                <select
                  value={newProduce.crop}
                  onChange={(e) => setNewProduce({ ...newProduce, crop: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                  required
                >
                  <option value="Tomatoes">Tomatoes (Nyanya)</option>
                  <option value="Maize">Maize (Mahindi)</option>
                  <option value="Potatoes">Potatoes (Viazi Mviringo)</option>
                  <option value="Onions">Onions (Vitunguu)</option>
                  <option value="Beans">Beans (Maharage)</option>
                  <option value="Avocados">Avocados (Parachichi)</option>
                  <option value="Bananas">Bananas (Ndizi)</option>
                  <option value="Cabbages / Vegetables">Cabbages / Sukuma Wiki</option>
                  <option value="Watermelon">Watermelon (Tikiti)</option>
                  <option value="Milk / Maziwa">Fresh Milk (Maziwa)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'sw' ? 'Aina ya Mbegu / Daraja (Variety) *' : 'Variety / Quality Grade *'}
                  </label>
                  <VoiceInputButton
                    lang={language}
                    size="sm"
                    label={language === 'sw' ? 'Sema Aina' : 'Speak'}
                    onTranscript={(text) => setNewProduce((prev) => ({ ...prev, variety: text }))}
                  />
                </div>
                <input
                  type="text"
                  value={newProduce.variety}
                  onChange={(e) => setNewProduce({ ...newProduce, variety: e.target.value })}
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
                  {language === 'sw' ? 'Kiasi Unachouza (Quantity) *' : 'Quantity for Sale *'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={newProduce.quantity}
                  onChange={(e) => setNewProduce({ ...newProduce, quantity: Number(e.target.value) })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === 'sw' ? 'Kipimo (Unit) *' : 'Packaging Unit *'}
                </label>
                <select
                  value={newProduce.unit}
                  onChange={(e) => setNewProduce({ ...newProduce, unit: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                >
                  <option value="Crates (64kg)">Crates (Tenga 64kg)</option>
                  <option value="Bags (90kg)">Bags (Gunia 90kg)</option>
                  <option value="Bags (50kg)">Bags (Gunia 50kg)</option>
                  <option value="Sacks (50kg)">Sacks (Viroba 50kg)</option>
                  <option value="Kilograms (kg)">Kilograms (kg)</option>
                  <option value="Tonnes">Tonnes (Tani)</option>
                  <option value="Bunches (Mikungu)">Bunches (Mikungu ya Ndizi)</option>
                  <option value="Liters">Liters (Lita)</option>
                </select>
              </div>
            </div>

            {/* Price in KES */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {language === 'sw' ? 'Bei ya Shambani (KSh kwa kila kipimo) *' : 'Asking Price (KSh per unit) *'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">KSh</span>
                <input
                  type="number"
                  min="10"
                  value={newProduce.pricePerUnitKes}
                  onChange={(e) => setNewProduce({ ...newProduce, pricePerUnitKes: Number(e.target.value) })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-black text-[#15532E] focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                  required
                />
              </div>

              {/* Real-time fair price advice */}
              <div className="mt-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2 text-xs text-emerald-900">
                <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">
                    {language === 'sw' ? 'Ushauri wa Smart Shamba 360:' : 'Fair Price Defender:'}
                  </span>{' '}
                  {language === 'sw'
                    ? `Wakulima wanauza ${newProduce.crop} kwa wastani wa KSh ${(newProduce.pricePerUnitKes * 0.95).toFixed(0)} - KSh ${(newProduce.pricePerUnitKes * 1.1).toFixed(0)}. Bei yako inakupa faida ya 30% zaidi ukilinganisha na madalali wa shambani.`
                    : `Average price for ${newProduce.crop} ranges between KSh ${(newProduce.pricePerUnitKes * 0.95).toFixed(0)} - KSh ${(newProduce.pricePerUnitKes * 1.1).toFixed(0)}. Selling directly secures 30% more profit than farm-gate brokers.`}
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
                  value={newProduce.county}
                  onChange={(e) => setNewProduce({ ...newProduce, county: e.target.value })}
                  placeholder="e.g. Nakuru, Kiambu, Machakos"
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === 'sw' ? 'Eneo / Kijiji (Sub-county / Ward) *' : 'Sub-County / Ward *'}
                </label>
                <input
                  type="text"
                  value={newProduce.subCounty}
                  onChange={(e) => setNewProduce({ ...newProduce, subCounty: e.target.value })}
                  placeholder="e.g. Molo, Gatundu North, Moiben"
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                  required
                />
              </div>
            </div>

            {/* Readiness & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === 'sw' ? 'Hali ya Mavuno *' : 'Harvest Readiness *'}
                </label>
                <select
                  value={newProduce.harvestStatus}
                  onChange={(e) =>
                    setNewProduce({
                      ...newProduce,
                      harvestStatus: e.target.value as 'ready_now' | 'harvesting_this_week' | 'ready_in_2_weeks',
                    })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                >
                  <option value="ready_now">{language === 'sw' ? '🟢 Tayari Shambani Leo' : '🟢 Ready on Farm Today'}</option>
                  <option value="harvesting_this_week">{language === 'sw' ? '🟡 Tutavuna Wiki Hii' : '🟡 Harvesting This Week'}</option>
                  <option value="ready_in_2_weeks">{language === 'sw' ? '🔵 Tayari Wiki 2 Zijazo (Oda ya Mapema)' : '🔵 Ready in 2 Weeks (Pre-order)'}</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === 'sw' ? 'Nambari ya Simu & WhatsApp *' : 'Phone & WhatsApp Number *'}
                </label>
                <input
                  type="tel"
                  value={newProduce.farmerPhone}
                  onChange={(e) => setNewProduce({ ...newProduce, farmerPhone: e.target.value })}
                  placeholder="+254712345678"
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  {language === 'sw' ? 'Maelezo ya Ziada ya Mazao na Njia ya Kufika Shambani' : 'Additional Notes (Pickup access, Quality)'}
                </label>
                <VoiceInputButton
                  lang={language}
                  size="sm"
                  label={language === 'sw' ? 'Eleza kwa Sauti' : 'Speak Notes'}
                  onTranscript={(text) =>
                    setNewProduce((prev) => ({
                      ...prev,
                      description: prev.description ? `${prev.description} ${text}` : text,
                    }))
                  }
                />
              </div>
              <textarea
                rows={2}
                value={newProduce.description}
                onChange={(e) => setNewProduce({ ...newProduce, description: e.target.value })}
                placeholder={
                  language === 'sw'
                    ? 'mf. Shamba liko mita 200 kutoka barabara ya lami, gari linaweza kuingia moja kwa moja kupakia...'
                    : 'e.g. Farm located 200m from tarmac road, direct truck loading available...'
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
                <span>{language === 'sw' ? 'Weka Mazao Sokoni (Bila Malipo)' : 'Publish Produce Listing (Free)'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: BROWSE PRODUCE FOR SALE */}
      {activeTab === 'browse_produce' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={produceSearchQuery}
                  onChange={(e) => setProduceSearchQuery(e.target.value)}
                  placeholder={
                    language === 'sw'
                      ? 'Tafuta zao au mkulima (mf. Nyanya, Mahindi, Kiambu, Molo)...'
                      : 'Search produce or farmer (e.g. Tomatoes, Maize, Kiambu, Molo)...'
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#15532E]/30"
                />
              </div>

              <select
                value={produceCropFilter}
                onChange={(e) => setProduceCropFilter(e.target.value)}
                aria-label={language === 'sw' ? 'Chuja kwa Zao' : 'Filter by Crop'}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
              >
                <option value="all">{language === 'sw' ? 'Mazao Yote' : 'All Crops'}</option>
                <option value="tomatoes">Tomatoes</option>
                <option value="maize">Maize</option>
                <option value="potatoes">Potatoes</option>
                <option value="onions">Onions</option>
                <option value="avocados">Avocados</option>
                <option value="beans">Beans</option>
                <option value="bananas">Bananas</option>
              </select>

              <select
                value={produceCountyFilter}
                onChange={(e) => setProduceCountyFilter(e.target.value)}
                aria-label={language === 'sw' ? 'Chuja kwa Kaunti' : 'Filter by County'}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
              >
                <option value="all">{language === 'sw' ? 'Kaunti Zote' : 'All Counties'}</option>
                <option value="kiambu">Kiambu</option>
                <option value="nakuru">Nakuru</option>
                <option value="uasin gishu">Uasin Gishu</option>
                <option value="machakos">Machakos</option>
                <option value="meru">Meru</option>
                <option value="trans nzoia">Trans Nzoia</option>
              </select>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 pt-1 border-t border-slate-100">
              <span>{produceListings.length} {language === 'sw' ? 'orodha za mazao' : 'harvest listings active'}</span>
              <button
                onClick={() => setActiveTab('list_produce')}
                className="text-emerald-800 font-extrabold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'sw' ? 'Ongeza Mazao Yako' : 'Add Your Produce'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProduce.map((item) => {
              const whatsAppUrl = getProduceWhatsAppLink(item);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
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
                          ? language === 'sw' ? '🟢 Tayari Shambani' : '🟢 Ready Now'
                          : language === 'sw' ? '🟡 Wiki Hii' : '🟡 This Week'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl mb-3 border border-slate-100">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>{item.county}, {item.subCounty}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{item.farmerName}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
                      {item.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100 mb-3">
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
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <a
                      href={whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all text-center"
                    >
                      <MessageCircle className="w-4 h-4 fill-white/20" />
                      <span>{language === 'sw' ? 'Wasiliana kwa WhatsApp' : 'Contact via WhatsApp'}</span>
                    </a>

                    <a
                      href={`tel:${item.farmerPhone}`}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                      title={language === 'sw' ? 'Piga simu moja kwa moja' : 'Call farmer directly'}
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

      {/* TAB 4: FAIR PRICE DEFENDER CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-1">
              <Scale className="w-3.5 h-3.5" />
              <span>{language === 'sw' ? 'Ulinzi Dhidi ya Walanguzi' : 'Middleman Protection'}</span>
            </div>
            <h3 className="text-xl font-black text-slate-900">
              {language === 'sw' ? 'Kikokotoo cha Bei ya Chini ya Shambani' : 'Defended Farm Gate Floor Calculator'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'sw'
                ? 'Jua bei ya chini kabisa unayopaswa kukubali shambani ili madalali wasichukue jasho lako.'
                : 'Calculate your non-negotiable minimum farm-gate price based on real urban wholesale benchmarks.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {language === 'sw' ? 'Chagua Zao' : 'Select Crop'}
              </label>
              <select
                value={calcCrop}
                onChange={(e) => {
                  const val = e.target.value;
                  setCalcCrop(val);
                  if (val === 'Tomatoes') setCalcMarketPrice(4400);
                  if (val === 'Maize') setCalcMarketPrice(3800);
                  if (val === 'Onions') setCalcMarketPrice(5500);
                  if (val === 'Potatoes') setCalcMarketPrice(2800);
                }}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
              >
                <option value="Tomatoes">Tomatoes (Nyanya - Crate 64kg)</option>
                <option value="Maize">Maize (Mahindi - Bag 90kg)</option>
                <option value="Onions">Onions (Vitunguu - Sack 50kg)</option>
                <option value="Potatoes">Potatoes (Viazi - Bag 50kg)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {language === 'sw' ? 'Kiasi cha Kuuza' : 'Volume to Sell'}
              </label>
              <input
                type="number"
                min="1"
                value={calcQuantity}
                onChange={(e) => setCalcQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {language === 'sw' ? 'Bei ya Jumla Sokoni (Marikiti/Kongowea)' : 'Urban Wholesale Rate (KES)'}
              </label>
              <input
                type="number"
                value={calcMarketPrice}
                onChange={(e) => setCalcMarketPrice(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {language === 'sw' ? 'Gharama ya Usafiri kwa Kila Kipimo' : 'Transport & Logistics per Unit (KES)'}
              </label>
              <input
                type="number"
                value={calcTransport}
                onChange={(e) => setCalcTransport(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
              />
            </div>
          </div>

          {/* Defense Result */}
          <div className="bg-gradient-to-br from-[#15532E] to-[#1B5E20] text-white p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/20 pb-3">
              <span className="text-xs font-bold text-emerald-200 uppercase">
                {language === 'sw' ? 'Uamuzi wa Bei' : 'Defended Price Decision'}
              </span>
              <span className="text-xs bg-emerald-500/30 px-2 py-0.5 rounded-full border border-white/20">
                {language === 'sw' ? 'Kiwango cha Chini' : 'Floor Price'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-emerald-200">
                  {language === 'sw' ? 'Bei Halisi ya Chini Shambani:' : 'Defended Minimum Gate Price:'}
                </div>
                <div className="text-2xl font-black text-white mt-1">
                  KSh {fairGateFloor.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-300">
                  {language === 'sw' ? 'Usiuze chini ya bei hii' : 'Do not sell below this'}
                </div>
              </div>

              <div>
                <div className="text-xs text-emerald-200">
                  {language === 'sw' ? 'Ofa ya Kawaida ya Dalali:' : 'Broker Low-Ball Offer:'}
                </div>
                <div className="text-xl font-bold text-red-300 mt-1 line-through">
                  KSh {brokerOffer.toLocaleString()}
                </div>
                <div className="text-[11px] text-red-200">
                  {language === 'sw' ? 'Hasara ya 45% ya jasho lako' : '45% broker cut'}
                </div>
              </div>
            </div>

            <div className="bg-white/10 p-3.5 rounded-2xl flex items-center justify-between">
              <span className="text-xs font-bold text-yellow-300">
                {language === 'sw' ? 'Faida Unayookoa kwa Kuuza Moja kwa Moja:' : 'Total Extra Revenue Defended:'}
              </span>
              <span className="text-xl font-black text-yellow-300">
                +KSh {totalSaved.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* CHAT WITH BUYER MODAL */}
      {chattingBuyer && (
        <BuyerChatModal
          buyer={chattingBuyer}
          farmer={farmer}
          language={language}
          onClose={() => setChattingBuyer(null)}
          showToast={showToast}
        />
      )}
    </div>
  );
};
