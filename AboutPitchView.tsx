import React from 'react';
import {
  Sprout,
  TrendingUp,
  Stethoscope,
  MessageSquare,
  ShieldCheck,
  Target,
  Users,
  Compass,
  Radio,
  Sparkles,
  Phone,
  Globe,
} from 'lucide-react';

export const AboutPitchView: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12">
      {/* 1. HERO PITCH BANNER */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Hackathon Project Pitch
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            MKULIMA<span className="text-emerald-400">AI</span>
          </h1>
          <p className="text-xl sm:text-2xl text-emerald-200 font-medium italic">
            &ldquo;Turning agricultural uncertainty into informed decisions.&rdquo;
          </p>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            An AI-powered agricultural decision-support engine designed initially for smallholder farmers in Kenya and across East Africa.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-emerald-800/40 text-center text-xs">
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">75%</p>
            <p className="text-slate-400 mt-1">Kenya Food Output from Smallholders</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">40%+</p>
            <p className="text-slate-400 mt-1">Crop Loss from Pests & Bad Timing</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">1:1,500</p>
            <p className="text-slate-400 mt-1">Extension Officer to Farmer Deficit</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-sky-400">100%</p>
            <p className="text-slate-400 mt-1">Transparent Explainable AI</p>
          </div>
        </div>
      </div>

      {/* 2. THE PROBLEM */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-rose-600" />
          <h2 className="text-lg font-bold text-slate-900">The Problem Smallholders Face</h2>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          Smallholder farmers in Kenya often invest their entire family life savings into planting seasons based on guesswork, outdated word-of-mouth, or arbitrary market rumors.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="font-bold text-slate-900 text-sm">1. Timing & Climate Shocks</span>
            <p className="text-slate-600 leading-relaxed">
              Unpredictable rainy seasons lead to failed germination or water stress during critical flowering stages.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="font-bold text-slate-900 text-sm">2. Market Price Gluts</span>
            <p className="text-slate-600 leading-relaxed">
              Farmers plant the same crop as all neighbors, harvesting into oversaturated markets and selling at a loss.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="font-bold text-slate-900 text-sm">3. Late Pathology Detection</span>
            <p className="text-slate-600 leading-relaxed">
              Foliar blights and rusts spread through plots before farmers can access an agricultural extension officer.
            </p>
          </div>
        </div>
      </div>

      {/* 3. THE THREE AI CAPABILITIES */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900">The Smart Shamba 360 Solution: 3 Core Pillars</h2>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-emerald-950 text-base">1. Agro-Economic Decision Engine</h3>
              <p className="text-xs text-emerald-900 leading-relaxed">
                Evaluates soil type, water reliability, county microclimate, and production costs to predict potential yield, net profit, and break-even targets with complete mathematical transparency.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sky-950 text-base">2. Crop Doctor (Multimodal Vision)</h3>
              <p className="text-xs text-sky-900 leading-relaxed">
                Processes smartphone camera photos of leaf lesions, outputting non-chemical cultural sanitation steps, severity assessments, and warnings within safe agronomic boundaries.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-amber-950 text-base">3. Conversational AI Agronomist</h3>
              <p className="text-xs text-amber-900 leading-relaxed">
                Tuned specifically for Kenya smallholders, understanding local regional terminology, recommending certified varieties, and promoting Integrated Pest Management (IPM).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. EXPANSION ROADMAP */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900">Scalability & Expansion Roadmap</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>USSD & SMS Interface for Feature Phones</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Enabling smallholders without smartphones to query market prices and planting calendars via simple `*384#` USSD menus.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Globe className="w-4 h-4 text-sky-600" />
              <span>Kiswahili Voice & Dialect Translation</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Real-time voice-in voice-out for farmers with limited literacy, speaking in Swahili, Ekegusii, or Kikuyu.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Radio className="w-4 h-4 text-purple-600" />
              <span>Sentinel-2 Satellite NDVI Monitoring</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Automated 10m-resolution multispectral imagery tracking farm vegetation vigor and moisture anomalies from orbit.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Users className="w-4 h-4 text-amber-600" />
              <span>Agribusiness & Extension Officer Portal</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Ward-level dashboards for cooperatives to forecast harvest volumes and coordinate bulk fertilizer procurement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
