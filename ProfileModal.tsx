import React, { useState, useEffect, useRef } from 'react';
import { X, Check, MapPin, User, Sprout, ArrowLeft } from 'lucide-react';
import { FarmerProfile, County, FarmingExperience } from '../types/index.ts';

interface ProfileModalProps {
  farmer: FarmerProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: FarmerProfile) => void;
}

const COUNTIES: County[] = [
  'Kisii',
  'Nakuru',
  'Uasin Gishu',
  'Kiambu',
  'Machakos',
  'Meru',
  'Trans Nzoia',
  'Nyeri',
  'Kilifi',
  'Kakamega',
  'Bungoma',
  'Migori',
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  farmer,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(farmer.name);
  const [county, setCounty] = useState<County>(farmer.county);
  const [subCounty, setSubCounty] = useState(farmer.subCounty);
  const [town, setTown] = useState(farmer.town);
  const [farmSizeAcres, setFarmSizeAcres] = useState(farmer.farmSizeAcres);
  const [currentCrop, setCurrentCrop] = useState(farmer.currentCrop);
  const [experience, setExperience] = useState<FarmingExperience>(farmer.experience);
  const [isSaving, setIsSaving] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      const t = setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
      }, 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/farms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          county,
          subCounty,
          town,
          farmSizeAcres,
          currentCrop,
          experience,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onSave(data.farmer);
        onClose();
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 w-full h-full bg-cover bg-center bg-fixed flex flex-col overflow-hidden animate-in fade-in duration-150"
      style={{
        backgroundImage: "url('/assets/crop_harvest_bg.jpg')",
      }}
    >
      {/* Translucent Backdrop so background image is clearly seen */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/50 backdrop-blur-sm pointer-events-none" />

      {/* Full-width header spanning the entire screen */}
      <div className="relative z-10 bg-gradient-to-r from-[#2E7D32]/85 via-[#246B28]/85 to-[#1B5E20]/85 backdrop-blur-xl text-white px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between shrink-0 shadow-md border-b border-white/20">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white cursor-pointer transition-all active:scale-95"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/15 text-white">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base sm:text-lg">Farmer & Shamba Profile</h2>
              <p className="text-xs text-emerald-100">Configure your farm location and acreage</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/20 text-white cursor-pointer transition-all active:scale-95"
          aria-label="Close"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Full-page scrollable content (always starts at top) */}
      <div ref={scrollContainerRef} className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center pb-20">
        <div className="max-w-2xl mx-auto w-full bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700">Farmer Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">County</label>
                <select
                  value={county}
                  onChange={(e) => setCounty(e.target.value as County)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  {COUNTIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">Sub-County</label>
                <input
                  type="text"
                  value={subCounty}
                  onChange={(e) => setSubCounty(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">Farm Size (Acres)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.2"
                  value={farmSizeAcres}
                  onChange={(e) => setFarmSizeAcres(parseFloat(e.target.value) || 1)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">Current / Target Crop</label>
                <input
                  type="text"
                  value={currentCrop}
                  onChange={(e) => setCurrentCrop(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <div className="pt-5 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <Check className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
