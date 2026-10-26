import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Upload,
  Camera,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  Cpu,
  Volume2,
  VolumeX,
  Mic,
} from 'lucide-react';
import { CropType, CropDiseaseResult } from '../types/index.ts';
import { SAMPLE_LEAVES, SampleLeaf } from '../data/sampleLeaves.ts';
import { useApp } from '../context/AppContext.tsx';
import { useAccessibility } from '../context/AccessibilityContext.tsx';
import { VoiceInputButton } from './VoiceInputButton.tsx';
import { offlineStorageService } from '../services/offlineStorageService.ts';
import { diagnoseCropClientSide } from '../services/clientDiagnosticService.ts';

interface CropDoctorViewProps {
  onDiagnosisComplete: (result: CropDiseaseResult) => void;
  recentDiagnosis: CropDiseaseResult | null;
}

const CROPS: CropType[] = [
  'Tomatoes',
  'Maize',
  'Potatoes',
  'Beans',
  'Bananas',
  'Cabbages / Vegetables',
  'Onions',
  'Watermelon',
];

// Helper to optimize and resize smartphone camera photos before network transmission
function compressAndResizeImage(
  file: File,
  maxDimension = 1280,
  quality = 0.85
): Promise<{ base64Data: string; previewUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const raw = (reader.result as string).split(',')[1];
          return resolve({ base64Data: raw, previewUrl: reader.result as string });
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        const base64Data = compressedDataUrl.split(',')[1];
        resolve({ base64Data, previewUrl: compressedDataUrl });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export const CropDoctorView: React.FC<CropDoctorViewProps> = ({
  onDiagnosisComplete,
  recentDiagnosis,
}) => {
  const { t, language } = useApp();
  const { isSpeaking, speakText, stopSpeaking } = useAccessibility();

  const handleSpeakDiagnosis = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else if (diagnosis) {
      const steps = diagnosis.recommendedNextSteps.join('. ');
      const text =
        language === 'sw'
          ? `Matokeo ya Uchunguzi: Zao la ${diagnosis.cropType} lina dalili za ${diagnosis.possibleCondition}. Kiwango cha ukali ni ${diagnosis.severity === 'Severe' ? 'mkali' : diagnosis.severity === 'Moderate' ? 'wa wastani' : 'mdogo'}. Hatua za kufuata: ${steps}`
          : `Diagnostic Result: Your ${diagnosis.cropType} shows signs of ${diagnosis.possibleCondition}. Severity level is ${diagnosis.severity}. Recommended next steps: ${steps}`;
      speakText(text, language);
    }
  };

  const [selectedCrop, setSelectedCrop] = useState<CropType>('Tomatoes');
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [selectedSample, setSelectedSample] = useState<SampleLeaf | null>(SAMPLE_LEAVES[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uiError, setUiError] = useState<string | null>(null);
  const [voiceSymptoms, setVoiceSymptoms] = useState<string>('');
  const [diagnosis, setDiagnosis] = useState<CropDiseaseResult | null>(() => {
    return recentDiagnosis || null;
  });

  useEffect(() => {
    if (recentDiagnosis) {
      setDiagnosis(recentDiagnosis);
      offlineStorageService.saveDiseaseReport(recentDiagnosis);
    }
  }, [recentDiagnosis]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUiError(null);

    try {
      const { base64Data, previewUrl } = await compressAndResizeImage(file);
      setSelectedImageBase64(base64Data);
      setImagePreviewUrl(previewUrl);
      setSelectedSample(null);
    } catch (err) {
      setUiError(
        language === 'sw'
          ? 'Imeshindwa kuchakata picha. Tafadhali jaribu picha nyingine.'
          : 'Could not process selected image. Please try another photo.'
      );
    }
  };

  const handleSelectSample = (sample: SampleLeaf) => {
    setSelectedSample(sample);
    setSelectedCrop(sample.crop);
    setImagePreviewUrl(sample.previewUrl);
    setSelectedImageBase64(null);
    setUiError(null);
  };

  const handleRunAnalysis = async () => {
    setIsLoading(true);
    setUiError(null);

    try {
      const payload: any = {
        cropType: selectedCrop,
        isSampleDemo: Boolean(selectedSample),
        voiceSymptoms: voiceSymptoms.trim() || undefined,
      };

      if (selectedImageBase64) {
        payload.imageBase64 = selectedImageBase64;
        payload.imageMimeType = 'image/jpeg';
        payload.isSampleDemo = false;
      }

      let resolvedResult: CropDiseaseResult | null = null;

      // Try server endpoint with 2.5s timeout (works when server is available)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);
        const res = await fetch('/api/crop-diagnosis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            resolvedResult = data.data;
          }
        }
      } catch (networkErr) {
        // Fall through to instant client-side diagnostic inference
      }

      // If backend API is not hosted (e.g. Vercel static deployment) or failed, run client-side live engine
      if (!resolvedResult) {
        resolvedResult = diagnoseCropClientSide(selectedCrop, selectedSample, selectedImageBase64, voiceSymptoms);
      }

      setDiagnosis(resolvedResult);
      offlineStorageService.saveDiseaseReport(resolvedResult);
      onDiagnosisComplete(resolvedResult);
      setUiError(null);
    } catch (err: any) {
      const liveFallback = diagnoseCropClientSide(selectedCrop, selectedSample, selectedImageBase64, voiceSymptoms);
      setDiagnosis(liveFallback);
      onDiagnosisComplete(liveFallback);
      setUiError(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t('doctorPipelineBadge')}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">{t('doctorTitle')}</h1>
            <p className="text-xs text-slate-500 max-w-xl">{t('doctorSubtitle')}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700">
              {language === 'sw' ? 'Magonjwa 16 ya Mazao' : '16 Folio Pathologies'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload & Sample Leaf Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-sm">
                1. {language === 'sw' ? 'Chagua Zao na Jani' : 'Choose Crop & Leaf'}
              </h2>
              <span className="text-[10px] font-bold uppercase text-slate-400">
                {language === 'sw' ? 'Kipengele' : 'Input'}
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{t('selectCropToAnalyze')}</label>
              <select
                id="select-crop-doctor"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value as CropType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-emerald-500 min-h-[44px]"
              >
                {CROPS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile & Desktop Photo Capture Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">{t('doctorUploadPrompt')}</label>
              <div className="grid grid-cols-2 gap-2">
                {/* Native Smartphone Camera Snap */}
                <label className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-300 bg-emerald-50/50 hover:bg-emerald-100/60 active:scale-[0.98] transition-all cursor-pointer min-h-[64px] text-center">
                  <Camera className="w-5 h-5 text-emerald-700 mb-1" />
                  <span className="text-xs font-bold text-emerald-950">
                    {language === 'sw' ? 'Piga Picha' : 'Take Photo'}
                  </span>
                  <span className="text-[10px] text-emerald-700">
                    {language === 'sw' ? 'Kamera ya simu' : 'Phone camera'}
                  </span>
                  <input
                    id="input-leaf-camera"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* File Upload from Device */}
                <label className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 active:scale-[0.98] transition-all cursor-pointer min-h-[64px] text-center">
                  <Upload className="w-5 h-5 text-slate-600 mb-1" />
                  <span className="text-xs font-bold text-slate-800">
                    {language === 'sw' ? 'Pakia Faili' : 'Upload File'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {language === 'sw' ? 'Picha zilizohifadhiwa' : 'Gallery / Drive'}
                  </span>
                  <input
                    id="input-leaf-file"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Hands-Free Voice Symptoms Reporter */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{language === 'sw' ? 'Au Eleza Dalili kwa Sauti (Hands-Free)' : 'Or Report Symptoms by Voice (Hands-Free)'}</span>
                </label>
                <VoiceInputButton
                  lang={language}
                  size="sm"
                  label={language === 'sw' ? 'Ongea' : 'Speak'}
                  onTranscript={(text) => {
                    setVoiceSymptoms((prev) => (prev ? `${prev} ${text}` : text));
                  }}
                />
              </div>

              <div className="relative">
                <textarea
                  rows={2}
                  value={voiceSymptoms}
                  onChange={(e) => setVoiceSymptoms(e.target.value)}
                  placeholder={
                    language === 'sw'
                      ? 'Bonyeza "Ongea" na ueleze unachokiona shambani (mf. majani yanageuka manjano na shina linanyauka)...'
                      : 'Tap "Speak" and describe plant symptoms hands-free (e.g. yellow leaf spots, wilting stem)...'
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                {voiceSymptoms && (
                  <button
                    type="button"
                    onClick={() => setVoiceSymptoms('')}
                    className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 text-xs p-1"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Quick Symptom Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[10px] text-slate-400 font-bold shrink-0">
                  {language === 'sw' ? 'Mifano:' : 'Quick:'}
                </span>
                {[
                  { sw: 'Madoa ya manjano na kukausha majani', en: 'Yellow spots with dry leaf edges' },
                  { sw: 'Ukungu mweupe wa poda kwenye majani', en: 'White powdery mildew on leaves' },
                  { sw: 'Mnyauko wa ghafla na shina kulegea', en: 'Sudden wilting and soft stem' },
                ].map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setVoiceSymptoms((prev) =>
                        prev ? `${prev}. ${language === 'sw' ? s.sw : s.en}` : language === 'sw' ? s.sw : s.en
                      )
                    }
                    className="text-[10px] bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 px-2 py-0.5 rounded-md shrink-0 border border-slate-200 transition-all cursor-pointer"
                  >
                    + {language === 'sw' ? s.sw : s.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick-Pick Test Samples */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  {t('doctorSelectSamplePrompt')}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold uppercase">
                  {language === 'sw' ? 'Bila Intaneti' : 'Instant'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_LEAVES.map((leaf) => {
                  const isCur = selectedSample?.id === leaf.id;
                  return (
                    <button
                      key={leaf.id}
                      type="button"
                      onClick={() => handleSelectSample(leaf)}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                        isCur
                          ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={leaf.previewUrl}
                          alt={leaf.title}
                          className="w-8 h-8 rounded-md object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="truncate">
                          <p className="text-xs truncate">{leaf.crop}</p>
                          <p className="text-[10px] text-slate-500 truncate">{leaf.conditionName}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preview Box with Diagnostic Scan Frame */}
            {(imagePreviewUrl || selectedSample) && (
              <div className="p-3 bg-slate-900 rounded-xl relative overflow-hidden flex flex-col items-center">
                <div className="relative">
                  <img
                    src={imagePreviewUrl || selectedSample?.previewUrl}
                    alt="Selected Leaf"
                    className="max-h-40 rounded-lg object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 right-2 bottom-2 border border-red-500/80 rounded pointer-events-none" />
                  <div className="absolute bottom-1 left-1 bg-red-500 text-[8px] text-white px-1 font-bold rounded-xs">
                    SCAN REGION
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-2">
                  {selectedSample
                    ? `Sample: ${selectedSample.title}`
                    : language === 'sw'
                    ? 'Picha iko tayari kwa uchunguzi'
                    : 'Uploaded image ready for inference'}
                </p>
              </div>
            )}

            {uiError && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{uiError}</span>
              </div>
            )}

            <button
              id="btn-run-diagnosis"
              onClick={handleRunAnalysis}
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer disabled:opacity-50 min-h-[44px]"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              {isLoading ? t('doctorScanning') : t('doctorBtnScan')}
            </button>
          </div>
        </div>

        {/* Diagnosis Output (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {diagnosis ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {language === 'sw' ? 'Matokeo ya Uchunguzi' : 'Diagnostic Finding'}
                    </span>
                    {diagnosis.isDemo ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800">
                        <Cpu className="w-3 h-3 text-amber-600" />
                        KALRO Baseline Dataset
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        Live Vision • {diagnosis.provider.replace('-vision', '')}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                    {diagnosis.possibleCondition}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {language === 'sw'
                      ? `Imechunguzwa kwa zao la ${diagnosis.cropType}`
                      : `Evaluated on ${diagnosis.cropType}`}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Audio Narration Button */}
                  <button
                    onClick={handleSpeakDiagnosis}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                      isSpeaking
                        ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                        : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                    }`}
                    aria-label="Read diagnosis aloud"
                    title={isSpeaking ? 'Stop speaking' : 'Read diagnosis aloud'}
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-blue-700" />}
                    <span>{isSpeaking ? (language === 'sw' ? 'Simamisha' : 'Stop') : (language === 'sw' ? 'Sikiliza Tiba' : 'Listen')}</span>
                  </button>

                  {diagnosis.isDemo && (
                    <button
                      onClick={handleRunAnalysis}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 px-2.5 py-1 rounded-full cursor-pointer transition-colors"
                      title="Run live scan with Gemini"
                    >
                      <RotateCcw className="w-3 h-3" />
                      {language === 'sw' ? 'Pima Tena Mtandaoni' : 'Re-scan Live'}
                    </button>
                  )}
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      diagnosis.severity === 'Severe'
                        ? 'bg-red-50 text-red-600 border border-red-100'
                        : diagnosis.severity === 'Moderate'
                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}
                  >
                    {diagnosis.severity === 'Severe'
                      ? t('severitySevere')
                      : diagnosis.severity === 'Low'
                      ? t('severityLow')
                      : t('severityModerate')}
                  </span>
                </div>
              </div>

              {/* Confidence Meter */}
              <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {t('doctorConfidence')}
                  </span>
                  <span className="text-emerald-700 font-extrabold">
                    {diagnosis.confidencePercent.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${diagnosis.confidencePercent}%` }}
                  />
                </div>
              </div>

              {/* Observed Symptoms */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {t('doctorIndicators')}
                </h3>
                <div className="space-y-1.5">
                  {diagnosis.observedIndicators.map((ind, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Field Actions */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {t('doctorNextSteps')}
                </h3>
                <div className="space-y-2">
                  {diagnosis.recommendedNextSteps.map((step, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800"
                    >
                      <span className="w-5 h-5 rounded-md bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Long-Term Cultural Strategies */}
              {diagnosis.preventionSuggestions.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {t('doctorPrevention')}
                  </h3>
                  <div className="space-y-1.5">
                    {diagnosis.preventionSuggestions.map((p, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety Mandate */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">
                    {language === 'sw' ? 'Mwongozo wa Usalama wa Kilimo:' : 'Agronomic Safety Boundary:'}
                  </p>
                  <p className="leading-relaxed text-amber-900">{diagnosis.safetyDisclaimer}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 flex flex-col items-center justify-center text-center space-y-4 text-slate-400">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                <Stethoscope className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-slate-700 text-base">
                  {language === 'sw' ? 'Hakuna Kipimo cha Jani Kilichofanyika' : 'No Active Leaf Diagnosis'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  {language === 'sw'
                    ? 'Piga picha au chagua mfano wa jani upande wa kushoto, kisha bonyeza "Anza Uchunguzi wa Jani".'
                    : 'Upload a photo or choose one of the demo samples on the left, then click "Run Diagnostic Scan".'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
