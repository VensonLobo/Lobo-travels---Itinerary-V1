'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Hash, 
  ShieldCheck, 
  AlertCircle,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { AppSettings } from '@/types';

interface SettingsManagerProps {
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onResetDefaults: () => void;
}

export default function SettingsManager({
  settings: initialSettings,
  onSaveSettings,
  onResetDefaults
}: SettingsManagerProps) {
  const [formData, setFormData] = useState<AppSettings>(initialSettings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePhoneChange = (index: number, val: string) => {
    const updated = [...formData.phones];
    updated[index] = val;
    setFormData({ ...formData, phones: updated });
  };

  const handleAddPhone = () => {
    setFormData({ ...formData, phones: [...formData.phones, ''] });
  };

  const handleRemovePhone = (index: number) => {
    setFormData({ ...formData, phones: formData.phones.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-700" />
            Lobo Travels Company Settings & Configuration
          </h1>
          <p className="text-xs text-slate-500">
            Configure agency details, logo URL, reference number sequencing, and voucher statements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset application data and settings to default seed catalog?')) {
                onResetDefaults();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo DB</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Company settings and configuration updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Brand & Identity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Company Identity & Logo
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          {/* Logo URL & Live Preview */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-slate-700">
              Agency Logo Image URL (Used across UI, Itinerary PDF & Voucher)
            </label>
            <input
              type="text"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-xs"
            />
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Live Logo Preview:</span>
              <div className="h-12 w-28 bg-white p-1 rounded-md border border-slate-200 flex items-center justify-center overflow-hidden">
                <img src={formData.logoUrl} alt="Logo Preview" className="h-full w-full object-contain" />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Coordinates */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Contact Coordinates (Displayed in Footers)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Website URL</label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">Physical Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
            />
          </div>

          {/* Contact Phones */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700">Telephone / Operations Helplines</label>
              <button
                type="button"
                onClick={handleAddPhone}
                className="text-[11px] font-bold text-indigo-600 hover:underline"
              >
                + Add Phone
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {formData.phones.map((phone, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => handlePhoneChange(idx, e.target.value)}
                    placeholder="9811240072"
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                  {formData.phones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePhone(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reference Prefix & Voucher Terms */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Reference Number Sequencing & Voucher Terms
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Reference Number Prefix (e.g. LT-2026-)
              </label>
              <input
                type="text"
                value={formData.referencePrefix}
                onChange={(e) => setFormData({ ...formData, referencePrefix: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold text-slate-900"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Next generated record will appear as: {formData.referencePrefix}000X
              </span>
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">
              Travel Voucher Terms & Reconfirmation Statement
            </label>
            <textarea
              rows={3}
              value={formData.voucherTerms}
              onChange={(e) => setFormData({ ...formData, voucherTerms: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg leading-relaxed"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition"
          >
            Save All Settings
          </button>
        </div>

      </form>

    </div>
  );
}
