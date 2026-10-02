'use client';

import React, { useState } from 'react';
import { 
  Compass, 
  PlusCircle, 
  Search, 
  Building2, 
  MapPin, 
  Settings, 
  FileText, 
  CheckCircle2, 
  Menu, 
  X,
  PhoneCall
} from 'lucide-react';
import { AppSettings } from '@/types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  settings: AppSettings;
  onSearch: (query: string) => void;
  searchQuery: string;
  onNewItinerary: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  settings,
  onSearch,
  searchQuery,
  onNewItinerary
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'itineraries', label: 'Itineraries', icon: FileText },
    { id: 'hotels', label: 'Hotels', icon: Building2 },
    { id: 'destinations', label: 'Destinations', icon: MapPin },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="no-print sticky top-0 z-40 bg-[#151521] text-white border-b border-[#26214F]/80 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Company Title */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          >
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg bg-white/10 p-1 flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-white/30 transition-colors">
              <img 
                src={settings.logoUrl} 
                alt={settings.companyName} 
                className="h-full w-full object-contain"
                onError={(e) => {
                  // Fallback if logo fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-amber-200 transition-colors">
                  {settings.companyName.toUpperCase()}
                </span>
                <span className="hidden md:inline-block text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-[#26214F] text-amber-300 border border-amber-400/20">
                  Tour Operations
                </span>
              </div>
              <p className="text-[11px] text-[#9899A1] hidden sm:block truncate max-w-[260px]">
                {settings.tagline}
              </p>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs relative">
            <Search className="w-4 h-4 text-[#9899A1] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Ref (e.g. LT-2026-0001), client..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#26214F]/60 text-white placeholder-[#9899A1] rounded-lg border border-[#26214F] focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#9899A1] hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    isActive
                      ? 'bg-[#26214F] text-amber-300 shadow-sm border border-amber-400/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-[#9899A1]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onNewItinerary}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-sm transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span className="hidden sm:inline">Create Itinerary</span>
              <span className="sm:hidden">New</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-[#26214F] space-y-2">
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-[#9899A1] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search reference no., client, tour..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#26214F] text-white placeholder-[#9899A1] rounded-lg border border-[#26214F] focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg ${
                    isActive ? 'bg-[#26214F] text-amber-300' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
