import React, { useState, useEffect, useCallback } from 'react';
import { MkulimaAppView } from './components/MkulimaAppView.tsx';
import {
  FarmerProfile,
  FarmAnalysisResult,
  CropDiseaseResult,
  WeatherSnapshot,
  MarketPriceItem,
  FarmAnalysisInput,
} from './types/index.ts';
import { useApp } from './context/AppContext.tsx';
import { offlineStorageService } from './services/offlineStorageService.ts';
import { getWeatherForCounty } from './services/weatherService.ts';
import { getMarketPrices } from './services/marketDataService.ts';
import { calculateFarmAnalysis } from './services/decisionEngine.ts';
import { Sparkles } from 'lucide-react';

const DEFAULT_FARM_INPUT: FarmAnalysisInput = {
  county: 'Kisii',
  subCounty: 'Kitutu Chache South',
  town: 'Bogusero Ward',
  latitude: -0.6817,
  longitude: 34.7667,
  farmSizeAcres: 2.0,
  soilType: 'Volcanic Red Loam',
  waterAvailability: 'River / Stream Gravity',
  experience: 'Intermediate (2 - 5 years)',
  availableBudget: 150000,
  cropType: 'Tomatoes',
  seedCost: 28000,
  fertilizerCost: 44000,
  labourCost: 48000,
  pestCost: 34000,
  otherCosts: 12000,
  plantingSeason: 'Short Rains (Oct-Dec)',
};

export default function App() {
  const { language } = useApp();

  // Hydrate initial farmer profile
  const [farmer, setFarmer] = useState<FarmerProfile>(() => {
    return (
      offlineStorageService.getLastFarmerProfile() || {
        id: 'demo-farmer-kisii',
        name: 'Hesbon Nchoro (Mkulima)',
        email: 'nchorohesbon96@gmail.com',
        phone: '+254 712 345 678',
        county: 'Kisii',
        subCounty: 'Kitutu Chache South',
        town: 'Bogusero Ward',
        farmSizeAcres: 2.0,
        currentCrop: 'Tomatoes',
        experience: 'Intermediate (2 - 5 years)',
        createdAt: new Date().toISOString(),
      }
    );
  });

  // Always initialize with fresh live mathematical analysis for today
  const [recentAnalysis, setRecentAnalysis] = useState<FarmAnalysisResult | null>(() => {
    return calculateFarmAnalysis(DEFAULT_FARM_INPUT, 'farmer-kisii-001');
  });

  // Starts null for fresh daily scan (no stale local storage reports)
  const [recentDisease, setRecentDisease] = useState<CropDiseaseResult | null>(null);

  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);

  const [marketPrices, setMarketPrices] = useState<MarketPriceItem[]>(() => {
    return getMarketPrices();
  });

  const [isScenarioLoading, setIsScenarioLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load live data from server or direct client fallbacks
  const loadDashboardData = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch('/api/dashboard', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (data.farmer) setFarmer(data.farmer);
          if (data.recentAnalysis) setRecentAnalysis(data.recentAnalysis);
          if (data.recentDisease) setRecentDisease(data.recentDisease);
          if (data.weather) setWeather(data.weather);
          if (data.marketPrices) setMarketPrices(data.marketPrices);
          return;
        }
      }
    } catch (e) {
      // Static host fallback (Vercel)
    }

    try {
      const liveWeather = await getWeatherForCounty(farmer.county);
      setWeather(liveWeather);
    } catch (wErr) {
      // Maintain weather
    }

    setMarketPrices(getMarketPrices());

    const liveAnalysis = calculateFarmAnalysis(
      {
        ...DEFAULT_FARM_INPUT,
        county: farmer.county,
        subCounty: farmer.subCounty,
        town: farmer.town,
        farmSizeAcres: farmer.farmSizeAcres,
        experience: farmer.experience,
      },
      farmer.id
    );
    setRecentAnalysis(liveAnalysis);
  }, [farmer]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleLoadDemoScenario = async () => {
    setIsScenarioLoading(true);
    try {
      try {
        const res = await fetch('/api/hackathon/scenario', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setFarmer(data.farmer);
            setRecentAnalysis(data.recentAnalysis);
            setRecentDisease(data.recentDisease);
            setWeather(data.weather);
            setMarketPrices(data.marketPrices);
            showToast(
              language === 'sw'
                ? '✓ Mfano wa Nyanya Kisii umepakiwa kikamilifu!'
                : '✓ Demo Scenario Loaded (Kisii Tomatoes, 2.0 Acres)'
            );
            return;
          }
        }
      } catch (err) {
        // Fallback
      }

      const demoFarmer: FarmerProfile = {
        id: 'demo-farmer-kisii',
        name: 'Hesbon Nchoro (Mkulima)',
        email: 'nchorohesbon96@gmail.com',
        phone: '+254 712 345 678',
        county: 'Kisii',
        subCounty: 'Kitutu Chache South',
        town: 'Bogusero Ward',
        farmSizeAcres: 2.0,
        currentCrop: 'Tomatoes',
        experience: 'Intermediate (2 - 5 years)',
        createdAt: new Date().toISOString(),
      };
      setFarmer(demoFarmer);

      const demoAnalysis = calculateFarmAnalysis(DEFAULT_FARM_INPUT, demoFarmer.id);
      setRecentAnalysis(demoAnalysis);

      try {
        const demoWeather = await getWeatherForCounty('Kisii');
        setWeather(demoWeather);
      } catch (e) {
        // Weather
      }

      setMarketPrices(getMarketPrices());

      showToast(
        language === 'sw'
          ? '✓ Mfano wa Nyanya Kisii umepakiwa kikamilifu!'
          : '✓ Demo Scenario Loaded (Kisii Tomatoes, 2.0 Acres)'
      );
    } finally {
      setIsScenarioLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full font-sans antialiased overflow-x-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#1B5E20] text-white px-5 py-2.5 rounded-full shadow-2xl border border-emerald-400/40 flex items-center gap-2 text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-bottom-4 whitespace-nowrap">
          <Sparkles className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary Smart Shamba 360 App Interface (Fits screen size exactly) */}
      <MkulimaAppView
        farmer={farmer}
        setFarmer={(updated) => {
          setFarmer(updated);
          offlineStorageService.saveFarmerProfile(updated);
        }}
        recentAnalysis={recentAnalysis}
        setRecentAnalysis={(updated) => {
          setRecentAnalysis(updated);
          if (updated) offlineStorageService.saveFarmAnalysis(updated);
        }}
        recentDisease={recentDisease}
        setRecentDisease={(updated) => {
          setRecentDisease(updated);
          if (updated) offlineStorageService.saveDiseaseReport(updated);
        }}
        weather={weather}
        marketPrices={marketPrices}
        onLoadScenario={handleLoadDemoScenario}
        isScenarioLoading={isScenarioLoading}
        showToast={showToast}
      />
    </div>
  );
}
