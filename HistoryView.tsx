import React, { useState, useEffect } from 'react';
import {
  History,
  Sprout,
  Stethoscope,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { FarmAnalysisResult, CropDiseaseResult } from '../types/index.ts';
import { useApp } from '../context/AppContext.tsx';
import { offlineStorageService } from '../services/offlineStorageService.ts';

interface HistoryViewProps {
  onSelectAnalysis: (item: FarmAnalysisResult) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onSelectAnalysis }) => {
  const { t, language } = useApp();
  const [activeTab, setActiveTab] = useState<'analyses' | 'scans'>('analyses');
  const [analyses, setAnalyses] = useState<FarmAnalysisResult[]>(() => {
    return offlineStorageService.getFarmAnalysesHistory();
  });
  const [scans, setScans] = useState<CropDiseaseResult[]>(() => {
    return offlineStorageService.getDiseaseReportsHistory();
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

      try {
        const [aRes, sRes] = await Promise.all([
          fetch('/api/farm-analysis'),
          fetch('/api/crop-diagnosis'),
        ]);
        const aData = await aRes.json();
        const sData = await sRes.json();

        if (aData.success && Array.isArray(aData.data) && aData.data.length > 0) {
          setAnalyses(aData.data);
          aData.data.forEach((item: FarmAnalysisResult) => {
            offlineStorageService.saveFarmAnalysis(item);
          });
        } else {
          setAnalyses(offlineStorageService.getFarmAnalysesHistory());
        }

        if (sData.success && Array.isArray(sData.data) && sData.data.length > 0) {
          setScans(sData.data);
          sData.data.forEach((item: CropDiseaseResult) => {
            offlineStorageService.saveDiseaseReport(item);
          });
        } else {
          setScans(offlineStorageService.getDiseaseReportsHistory());
        }
      } catch (err) {
        setAnalyses(offlineStorageService.getFarmAnalysesHistory());
        setScans(offlineStorageService.getDiseaseReportsHistory());
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-700">
                {language === 'sw' ? 'Kumbukumbu & Nyaraka' : 'Audit & Records'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">{t('historyTitle')}</h1>
            <p className="text-xs text-slate-500">{t('historySubtitle')}</p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('analyses')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'analyses'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('tabAnalyses')} ({analyses.length})
            </button>
            <button
              onClick={() => setActiveTab('scans')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'scans'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('tabScans')} ({scans.length})
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400">
          {language === 'sw'
            ? 'Inapakia kumbukumbu za kihistoria za shamba...'
            : 'Loading historical shamba records...'}
        </div>
      ) : activeTab === 'analyses' ? (
        <div className="space-y-4">
          {analyses.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-200/80">
              {t('noAnalysesFound')}
            </div>
          ) : (
            analyses.map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <Sprout className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">
                        {a.recommendedCrop} • {a.input.farmSizeAcres} {language === 'sw' ? 'Ekari' : 'Acres'} ({a.input.county})
                      </h3>
                      <p className="text-xs text-slate-500">
                        {new Date(a.timestamp).toLocaleDateString()} • {a.input.plantingSeason}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {language === 'sw' ? 'Ufaafu:' : 'Suitability:'} {a.cropSuitabilityScore}/100
                    </span>
                    <button
                      onClick={() => onSelectAnalysis(a)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 cursor-pointer"
                    >
                      {t('viewAnalysisBtn')}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-slate-500">{t('totalCost')}:</span>
                    <p className="font-extrabold text-slate-900 mt-0.5">
                      KES {a.financials.totalCost.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-slate-500">{t('estimatedYield')}:</span>
                    <p className="font-extrabold text-slate-900 mt-0.5">
                      {a.financials.estimatedYield} {a.financials.yieldUnit}
                    </p>
                  </div>
                  <div className="p-2.5 bg-emerald-50 rounded-xl">
                    <span className="text-emerald-800 font-medium">{t('netProfit')}:</span>
                    <p className="font-extrabold text-emerald-800 mt-0.5">
                      KES {a.financials.estimatedProfit.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-slate-500">{t('metricRisk')}:</span>
                    <p className="font-extrabold text-slate-900 mt-0.5">{a.riskLevel}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {scans.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-200/80">
              {t('noScansFound')}
            </div>
          ) : (
            scans.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{s.possibleCondition}</h3>
                      <p className="text-xs text-slate-500">
                        {s.cropType} • {new Date(s.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      s.severity === 'Severe'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {s.severity} • {s.confidencePercent.toFixed(1)}% {t('doctorConfidence')}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <span className="font-bold text-slate-700">{t('doctorIndicators')}:</span>
                  <ul className="list-disc list-inside space-y-0.5">
                    {s.observedIndicators.map((ind, i) => (
                      <li key={i}>{ind}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
