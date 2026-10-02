'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Clock, 
  Sparkles, 
  X,
  Compass,
  Check
} from 'lucide-react';
import { Destination, Attraction } from '@/types';

interface DestinationsManagerProps {
  destinations: Destination[];
  attractions: Attraction[];
  onSaveDestination: (dest: Destination) => void;
  onDeleteDestination: (id: string) => void;
  onSaveAttraction: (att: Attraction) => void;
  onDeleteAttraction: (id: string) => void;
}

export default function DestinationsManager({
  destinations,
  attractions,
  onSaveDestination,
  onDeleteDestination,
  onSaveAttraction,
  onDeleteAttraction
}: DestinationsManagerProps) {
  const [selectedDestinationId, setSelectedDestinationId] = useState<string>(
    destinations[0]?.id || 'delhi'
  );
  const [stateFilter, setStateFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddDestModalOpen, setIsAddDestModalOpen] = useState(false);
  const [newDestData, setNewDestData] = useState<Partial<Destination>>({
    name: '',
    state: 'Rajasthan',
    shortDescription: '',
    detailedDescription: '',
    recommendedDuration: '2 Days',
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    gallery: []
  });

  const [isAddAttractionModalOpen, setIsAddAttractionModalOpen] = useState(false);
  const [editingAttraction, setEditingAttraction] = useState<Partial<Attraction> | null>(null);

  const activeDestination = destinations.find(d => d.id === selectedDestinationId) || destinations[0];
  const activeAttractions = attractions.filter(
    a => (a.destinationId && a.destinationId.toLowerCase() === activeDestination?.id?.toLowerCase()) ||
         (a.destinationName && a.destinationName.toLowerCase() === (activeDestination?.name || '').toLowerCase())
  );

  const uniqueStates = Array.from(new Set(destinations.map(d => d.state))).sort();

  const filteredDestinations = destinations.filter(d => {
    const matchesState = stateFilter === 'all' || d.state.toLowerCase() === stateFilter.toLowerCase();
    const matchesSearch = !searchQuery || d.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesState && matchesSearch;
  });

  const handleSaveNewDestination = () => {
    if (!newDestData.name?.trim()) return;
    const dest: Destination = {
      id: newDestData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: newDestData.name.trim(),
      state: newDestData.state || 'North India',
      shortDescription: newDestData.shortDescription || 'Premier Indian travel destination.',
      detailedDescription: newDestData.detailedDescription || newDestData.shortDescription || '',
      recommendedDuration: newDestData.recommendedDuration || '2 Days',
      heroImage: newDestData.heroImage || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      gallery: []
    };
    onSaveDestination(dest);
    setSelectedDestinationId(dest.id);
    setIsAddDestModalOpen(false);
    setNewDestData({
      name: '',
      state: 'Rajasthan',
      shortDescription: '',
      detailedDescription: '',
      recommendedDuration: '2 Days',
      heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      gallery: []
    });
  };

  const handleOpenAddAttraction = () => {
    if (!activeDestination) return;
    setEditingAttraction({
      destinationId: activeDestination.id,
      destinationName: activeDestination.name,
      name: '',
      shortDescription: '',
      detailedDescription: '',
      duration: '1.5–2 Hours',
      category: 'Historical Monument',
      unesco: false,
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'
    });
    setIsAddAttractionModalOpen(true);
  };

  const handleEditAttraction = (att: Attraction) => {
    setEditingAttraction({ ...att });
    setIsAddAttractionModalOpen(true);
  };

  const handleSaveAttraction = () => {
    if (!editingAttraction || !editingAttraction.name?.trim() || !activeDestination) return;
    const attId = editingAttraction.id || `${activeDestination.id}-${editingAttraction.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const att: Attraction = {
      id: attId,
      destinationId: editingAttraction.destinationId || activeDestination.id,
      destinationName: editingAttraction.destinationName || activeDestination.name,
      name: editingAttraction.name.trim(),
      shortDescription: editingAttraction.shortDescription || 'Key sightseeing attraction.',
      detailedDescription: editingAttraction.detailedDescription || editingAttraction.shortDescription || '',
      duration: editingAttraction.duration || '1.5–2 Hours',
      category: editingAttraction.category || 'Historical Monument',
      unesco: !!editingAttraction.unesco,
      image: editingAttraction.image || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80'
    };
    onSaveAttraction(att);
    setIsAddAttractionModalOpen(false);
    setEditingAttraction(null);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-purple-600" />
            Destinations & Attractions Database
          </h1>
          <p className="text-xs text-slate-500">
            North India tourism database: managed sightseeing points, visit durations, and UNESCO monuments.
          </p>
        </div>

        <button
          onClick={() => setIsAddDestModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Destination</span>
        </button>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Destinations List */}
        <div className="lg:col-span-4 space-y-3">
          
          {/* Filter Bar */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
              />
            </div>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
            >
              <option value="all">All States / Circuits ({destinations.length})</option>
              {uniqueStates.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Destinations Scroll List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs space-y-1 max-h-[600px] overflow-y-auto">
            {filteredDestinations.map((dest) => {
              const isSelected = dest.id === selectedDestinationId;
              const count = attractions.filter(a => a.destinationName.toLowerCase() === dest.name.toLowerCase()).length;
              return (
                <div
                  key={dest.id}
                  onClick={() => setSelectedDestinationId(dest.id)}
                  className={`p-3 rounded-xl cursor-pointer transition flex items-center justify-between text-xs ${
                    isSelected
                      ? 'bg-[#151521] text-white shadow-xs'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                      <img src={dest.heroImage} alt={dest.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold truncate">{dest.name}</div>
                      <div className={`text-[10px] truncate ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>
                        {dest.state} · {dest.recommendedDuration}
                      </div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isSelected ? 'bg-[#26214F] text-amber-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {count} sights
                  </span>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Destination Details & Attractions */}
        <div className="lg:col-span-8 space-y-6">
          {activeDestination && (
            <>
              {/* Destination Hero Banner */}
              <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 h-52 bg-slate-900 text-white flex flex-col justify-end p-6">
                <img
                  src={activeDestination.heroImage}
                  alt={activeDestination.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="relative z-10">
                  <div className="inline-block px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-bold text-[10px] uppercase mb-1">
                    {activeDestination.state}
                  </div>
                  <h2 className="text-2xl font-black">{activeDestination.name}</h2>
                  <p className="text-xs text-slate-200 max-w-xl line-clamp-2">
                    {activeDestination.detailedDescription || activeDestination.shortDescription}
                  </p>
                </div>
              </div>

              {/* Attractions Section */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Key Sights & Monuments in {activeDestination.name} ({activeAttractions.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      These attractions automatically load in the Day Builder when {activeDestination.name} is chosen.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddAttraction}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Attraction</span>
                  </button>
                </div>

                {activeAttractions.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No attractions added for {activeDestination.name} yet. Click &quot;Add Attraction&quot; to record monuments.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeAttractions.map((att) => (
                      <div
                        key={att.id}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition flex gap-3 text-xs"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                          <img src={att.image} alt={att.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-bold text-slate-900 truncate">{att.name}</h4>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                title="Edit Info & Image"
                                onClick={() => handleEditAttraction(att)}
                                className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                title="Delete"
                                onClick={() => {
                                  if (confirm(`Delete ${att.name}?`)) onDeleteAttraction(att.id);
                                }}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2">
                            {att.shortDescription}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {att.duration}
                            </span>
                            {att.unesco && (
                              <span className="text-indigo-600 font-bold">· UNESCO World Heritage</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

      </div>

      {/* Add Destination Modal */}
      {isAddDestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Add New Destination</h3>
              <button onClick={() => setIsAddDestModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Destination Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Khajuraho, Jodhpur, Katra"
                  value={newDestData.name || ''}
                  onChange={(e) => setNewDestData({ ...newDestData, name: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">State / Region</label>
                <input
                  type="text"
                  placeholder="e.g. Madhya Pradesh, Rajasthan"
                  value={newDestData.state || ''}
                  onChange={(e) => setNewDestData({ ...newDestData, state: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Recommended Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 2–3 Days"
                  value={newDestData.recommendedDuration || ''}
                  onChange={(e) => setNewDestData({ ...newDestData, recommendedDuration: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hero Image URL</label>
                <input
                  type="text"
                  value={newDestData.heroImage || ''}
                  onChange={(e) => setNewDestData({ ...newDestData, heroImage: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={newDestData.shortDescription || ''}
                  onChange={(e) => setNewDestData({ ...newDestData, shortDescription: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddDestModalOpen(false)}
                className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNewDestination}
                className="px-4 py-1.5 font-bold text-white bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg"
              >
                Save Destination
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Attraction Modal */}
      {isAddAttractionModalOpen && activeDestination && editingAttraction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingAttraction.id ? `Edit: ${editingAttraction.name}` : `Add Attraction in ${activeDestination.name}`}
              </h3>
              <button 
                onClick={() => {
                  setIsAddAttractionModalOpen(false);
                  setEditingAttraction(null);
                }} 
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Attraction / Activity Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Amber Fort & Palace, Taj Mahal, Solang Valley"
                  value={editingAttraction.name || ''}
                  onChange={(e) => setEditingAttraction({ ...editingAttraction, name: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 1.5–2 Hours"
                    value={editingAttraction.duration || ''}
                    onChange={(e) => setEditingAttraction({ ...editingAttraction, duration: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Hilltop Fort, Wildlife, Shrine"
                    value={editingAttraction.category || ''}
                    onChange={(e) => setEditingAttraction({ ...editingAttraction, category: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="inline-flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={!!editingAttraction.unesco}
                    onChange={(e) => setEditingAttraction({ ...editingAttraction, unesco: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                  <span className="font-semibold text-indigo-900">
                    UNESCO World Heritage Monument
                  </span>
                </label>
              </div>

              {/* Photo Image URL & Live Preview */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Attraction Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={editingAttraction.image || ''}
                  onChange={(e) => setEditingAttraction({ ...editingAttraction, image: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-mono text-[11px]"
                />
                {editingAttraction.image && (
                  <div className="mt-2 flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="w-14 h-14 rounded bg-slate-200 overflow-hidden flex-shrink-0">
                      <img 
                        src={editingAttraction.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-500">Live Image Preview</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Description (Used in cards & highlights)</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary sentence..."
                  value={editingAttraction.shortDescription || ''}
                  onChange={(e) => setEditingAttraction({ ...editingAttraction, shortDescription: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Description (Used in day narrative)</label>
                <textarea
                  rows={2}
                  placeholder="Detailed architectural and historical narrative..."
                  value={editingAttraction.detailedDescription || ''}
                  onChange={(e) => setEditingAttraction({ ...editingAttraction, detailedDescription: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsAddAttractionModalOpen(false);
                  setEditingAttraction(null);
                }}
                className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAttraction}
                className="px-4 py-1.5 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
