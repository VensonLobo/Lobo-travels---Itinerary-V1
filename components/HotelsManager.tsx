'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Star, 
  MapPin, 
  Phone, 
  Globe, 
  Mail, 
  Trash2, 
  Edit3, 
  DownloadCloud, 
  X,
  ExternalLink,
  Check,
  Sparkles
} from 'lucide-react';
import { Hotel } from '@/types';

interface HotelsManagerProps {
  hotels: Hotel[];
  onSaveHotel: (hotel: Hotel) => void;
  onDeleteHotel: (id: string) => void;
}

function generateHotelId(): string {
  return 'ht-' + Math.random().toString(36).substring(2, 10);
}

export default function HotelsManager({
  hotels,
  onSaveHotel,
  onDeleteHotel
}: HotelsManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [starFilter, setStarFilter] = useState('all');

  // Google Search / Import modal state
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleQuery, setGoogleQuery] = useState('');
  const [googleCity, setGoogleCity] = useState('');
  const [googleSearching, setGoogleSearching] = useState(false);
  const [googleResults, setGoogleResults] = useState<any[]>([]);

  // Manual Add/Edit modal state
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Available unique cities
  const uniqueCities = Array.from(new Set(hotels.map(h => h.city))).sort();

  // Filtered hotels
  const filteredHotels = hotels.filter(h => {
    const matchesSearch = !searchTerm || 
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = cityFilter === 'all' || h.city.toLowerCase() === cityFilter.toLowerCase();
    const matchesStar = starFilter === 'all' || h.starCategory.toString() === starFilter;
    return matchesSearch && matchesCity && matchesStar;
  });

  // Google Places search handler
  const handleGoogleSearch = async () => {
    if (!googleQuery.trim()) return;
    setGoogleSearching(true);
    setGoogleResults([]);
    try {
      const res = await fetch(`/api/places?query=${encodeURIComponent(googleQuery)}&city=${encodeURIComponent(googleCity)}`);
      const data = await res.json();
      setGoogleResults(data.results || []);
    } catch (e) {
      console.error('Google search failed', e);
    } finally {
      setGoogleSearching(false);
    }
  };

  // Import hotel from Google Places result
  const handleImportResult = (res: any) => {
    const newHotel: Hotel = {
      id: generateHotelId(),
      name: res.name,
      city: res.city || googleCity || 'Delhi',
      state: res.state || 'India',
      address: res.address || `${res.name}, City Center`,
      starCategory: res.starCategory || 5,
      rating: res.rating || 4.7,
      reviewCount: res.reviewCount || 850,
      phone: res.phone || '+91 11 0000 0000',
      email: res.email || 'reservations@hotel.com',
      website: res.website || 'https://www.hotel.com',
      description: res.description || `Imported verified hotel partner: ${res.name}.`,
      roomCategories: res.roomCategories || ['Deluxe Room', 'Superior Room', 'Executive Suite'],
      mealPlans: res.mealPlans || ['Breakfast Included (CP)', 'Breakfast & Dinner (MAP)'],
      checkInTime: '14:00',
      checkOutTime: '12:00',
      image: res.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      partnershipStatus: 'Contracted',
      contractedRate: '₹6,000/night'
    };

    onSaveHotel(newHotel);
    setIsGoogleModalOpen(false);
    setGoogleQuery('');
    setGoogleCity('');
    setGoogleResults([]);
  };

  const handleOpenAddManual = () => {
    setEditingHotel({
      id: generateHotelId(),
      name: '',
      city: 'Delhi',
      state: 'Delhi',
      address: '',
      starCategory: 4,
      rating: 4.5,
      reviewCount: 350,
      phone: '+91 ',
      email: '',
      website: '',
      description: '',
      roomCategories: ['Deluxe Room', 'Executive Suite'],
      mealPlans: ['Breakfast Included (CP)', 'Breakfast & Dinner (MAP)'],
      checkInTime: '14:00',
      checkOutTime: '12:00',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      partnershipStatus: 'Preferred'
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingHotel || !editingHotel.name.trim()) return;
    onSaveHotel(editingHotel);
    setIsEditModalOpen(false);
    setEditingHotel(null);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            Lobo Travels Hotel Partner Directory
          </h1>
          <p className="text-xs text-slate-500">
            Registered supplier database for auto-populating accommodations during itinerary creation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Google Search / Import Button */}
          <button
            onClick={() => setIsGoogleModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition shadow-xs"
          >
            <DownloadCloud className="w-4 h-4 text-indigo-600" />
            <span>Search & Import on Google</span>
          </button>

          {/* Add Manual Button */}
          <button
            onClick={handleOpenAddManual}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Hotel</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search hotel name, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
          >
            <option value="all">All Cities ({hotels.length})</option>
            {uniqueCities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={starFilter}
            onChange={(e) => setStarFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
          >
            <option value="all">All Star Categories</option>
            <option value="5">5 Star Luxury</option>
            <option value="4">4 Star Premium</option>
            <option value="3">3 Star Comfort</option>
          </select>
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHotels.map((hotel) => (
          <div 
            key={hotel.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Hotel Image */}
              <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-amber-300 text-[11px] font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{hotel.rating} ({hotel.reviewCount})</span>
                </div>
                <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#151521]/80 backdrop-blur-xs text-white text-[10px] font-semibold">
                  {hotel.starCategory > 0 ? `${hotel.starCategory} Star` : 'Heritage Boutique'} · {hotel.partnershipStatus}
                </div>
              </div>

              {/* Hotel Body */}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {hotel.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{hotel.city}, {hotel.state}</span>
                </div>

                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                  {hotel.description}
                </p>

                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 space-y-0.5">
                  <div><strong>Rooms:</strong> {hotel.roomCategories.slice(0, 2).join(', ')}</div>
                  <div><strong>Plans:</strong> {hotel.mealPlans.slice(0, 2).join(', ')}</div>
                  {hotel.contractedRate && (
                    <div className="text-emerald-700 font-semibold">
                      Contracted: {hotel.contractedRate}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Card Action Footer */}
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-mono">
                {hotel.phone}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditingHotel(hotel);
                    setIsEditModalOpen(true);
                  }}
                  className="p-1 rounded text-slate-500 hover:text-indigo-600 hover:bg-slate-200 transition"
                  title="Edit Hotel"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Remove ${hotel.name} from directory?`)) {
                      onDeleteHotel(hotel.id);
                    }
                  }}
                  className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Delete Hotel"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Google Search & Import Modal */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <DownloadCloud className="w-5 h-5 text-indigo-600" />
                  Search & Import Hotel from Google
                </h3>
                <p className="text-xs text-slate-500">
                  Enter hotel name and city to retrieve verified ratings, address, and public profile.
                </p>
              </div>
              <button onClick={() => setIsGoogleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Hotel Name (e.g. The Oberoi Amarvilas, Rambagh Palace)"
                  value={googleQuery}
                  onChange={(e) => setGoogleQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGoogleSearch()}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="City (e.g. Agra, Jaipur)"
                  value={googleCity}
                  onChange={(e) => setGoogleCity(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGoogleSearch()}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              onClick={handleGoogleSearch}
              disabled={googleSearching || !googleQuery.trim()}
              className="w-full py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{googleSearching ? 'Querying Google Places...' : 'Search Google Places'}</span>
            </button>

            {/* Quick search suggestions */}
            <div className="flex flex-wrap gap-1 text-[11px] text-slate-500 items-center">
              <span>Suggestions:</span>
              {[
                { name: 'The Oberoi Amarvilas', city: 'Agra' },
                { name: 'Taj Palace', city: 'Delhi' },
                { name: 'Rambagh Palace', city: 'Jaipur' },
                { name: 'Taj Lake Palace', city: 'Udaipur' }
              ].map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setGoogleQuery(s.name);
                    setGoogleCity(s.city);
                  }}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px]"
                >
                  {s.name}
                </button>
              ))}
            </div>

            {/* Search Results */}
            {googleResults.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-800">
                  Available Google Places Matches:
                </span>
                <div className="space-y-2">
                  {googleResults.map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-500">{item.address}</div>
                        <div className="flex items-center gap-2 text-[10px] text-amber-700">
                          <span>★ {item.rating}</span>
                          <span>·</span>
                          <span>{item.reviewCount} verified reviews</span>
                          <span>·</span>
                          <span className="text-indigo-600">{item.starCategory} Star Standard</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleImportResult(item)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-xs flex-shrink-0 flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Import Hotel</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Manual Edit / Add Modal */}
      {isEditModalOpen && editingHotel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingHotel.id.startsWith('ht-') ? 'Edit Hotel Details' : 'Register New Hotel'}
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hotel Name *</label>
                <input
                  type="text"
                  value={editingHotel.name}
                  onChange={(e) => setEditingHotel({ ...editingHotel, name: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={editingHotel.city}
                    onChange={(e) => setEditingHotel({ ...editingHotel, city: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={editingHotel.state}
                    onChange={(e) => setEditingHotel({ ...editingHotel, state: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={editingHotel.address}
                  onChange={(e) => setEditingHotel({ ...editingHotel, address: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Star Category</label>
                  <select
                    value={editingHotel.starCategory}
                    onChange={(e) => setEditingHotel({ ...editingHotel, starCategory: parseInt(e.target.value) || 4 })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                  >
                    <option value="5">5 Star</option>
                    <option value="4">4 Star</option>
                    <option value="3">3 Star</option>
                    <option value="0">Heritage</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Google Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={editingHotel.rating}
                    onChange={(e) => setEditingHotel({ ...editingHotel, rating: parseFloat(e.target.value) || 4.5 })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contract Rate</label>
                  <input
                    type="text"
                    value={editingHotel.contractedRate || ''}
                    placeholder="₹6,500/night"
                    onChange={(e) => setEditingHotel({ ...editingHotel, contractedRate: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Photo Image URL</label>
                <input
                  type="text"
                  value={editingHotel.image}
                  onChange={(e) => setEditingHotel({ ...editingHotel, image: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingHotel.description}
                  onChange={(e) => setEditingHotel({ ...editingHotel, description: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
              >
                Save Hotel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
