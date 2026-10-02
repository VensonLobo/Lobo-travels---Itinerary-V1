'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';
import ItineraryBuilder from '@/components/ItineraryBuilder';
import ItineraryPreview from '@/components/ItineraryPreview';
import TravelVoucherView from '@/components/TravelVoucherView';
import HotelsManager from '@/components/HotelsManager';
import DestinationsManager from '@/components/DestinationsManager';
import SettingsManager from '@/components/SettingsManager';

import {
  Itinerary,
  Hotel
} from '@/types';

import {
  useItineraries,
  useHotels,
  useDestinations,
  useAttractions,
  useVehicles,
  useSettings,
  saveItinerary,
  deleteItinerary,
  duplicateItinerary,
  getNextReferenceNumber,
  saveHotel,
  deleteHotel,
  saveDestination,
  deleteDestination,
  saveAttraction,
  deleteAttraction,
  saveSettings,
  resetAllToDefaults,
  getItineraryById
} from '@/lib/storage';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Synchronized stores with SSR snapshot hydration safety
  const itineraries = useItineraries();
  const hotels = useHotels();
  const destinations = useDestinations();
  const attractions = useAttractions();
  const vehicles = useVehicles();
  const settings = useSettings();

  // Active Itinerary for Builder, Preview, or Voucher
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);

  // Handlers
  const handleNewItinerary = () => {
    const nextRef = getNextReferenceNumber();
    const uniqueId = 'itn-' + Math.random().toString(36).substring(2, 9);
    const blankItinerary: Itinerary = {
      id: uniqueId,
      referenceNumber: nextRef,
      tourName: 'Golden Triangle Tour – Delhi, Agra & Jaipur',
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      datesNotConfirmed: false,
      startDate: '2026-10-20',
      endDate: '2026-10-24',
      durationText: '4 Nights / 5 Days',
      nights: 4,
      daysCount: 5,
      adults: 2,
      children: 0,
      childrenDetails: [],
      totalPax: 2,
      paxSummary: '2 Adults',
      vehicleBrand: 'Kia',
      vehicleModel: 'Carens',
      vehicleCategory: 'MUV',
      vehicleDisplay: 'Kia Carens – Private Air-Conditioned Vehicle',
      showCostInItinerary: false,
      costDisplayType: 'total_only',
      currency: 'INR',
      currencySymbol: '₹',
      totalCost: 49000,
      costBreakdown: {
        vehicle: 18000,
        accommodation: 21000,
        sightseeing: 5000,
        guide: 5000
      },
      advancePaid: 0,
      pendingAmount: 49000,
      paymentStatus: 'Unpaid',
      inclusions: [...settings.defaultInclusions],
      exclusions: [...settings.defaultExclusions],
      specialNotes: 'Taj Mahal is closed every Friday. Monument entry permits, cameras, and personal expenses are paid directly.',
      coverImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
      flightBookings: {
        flightsBookedByUs: false,
        flights: []
      },
      status: 'Draft',
      createdAt: '2026-09-28T09:00:00.000Z',
      updatedAt: '2026-09-28T09:00:00.000Z',
      days: [
        {
          id: 'day-1',
          dayNumber: 1,
          title: 'Arrival in Delhi & Capital Heritage Tour',
          destination: 'Delhi',
          attractionIds: ['delhi-qutub', 'delhi-lotus'],
          attractionNames: ['Qutub Minar', 'Lotus Temple'],
          description: 'Arrive in New Delhi and meet your Lobo Travels chauffeur. Begin your sightseeing with the UNESCO-listed Qutub Minar and the serene Baháʼí Lotus Temple before checking into your hotel.',
          isOvernightSameLocation: true,
          overnightLocation: 'Delhi',
          arrivalDetails: {
            enabled: true,
            point: 'Airport',
            flightOrTrainNumber: '',
            arrivalTime: '',
            includeHotelCheckIn: true,
            checkInTiming: 'before_sightseeing'
          },
          meals: {
            breakfast: false,
            lunch: false,
            dinner: true,
            note: 'Dinner at hotel'
          },
          hotel: {
            name: 'The Lalit New Delhi',
            city: 'Delhi',
            roomCategory: 'Deluxe Room',
            mealPlan: 'Breakfast Included (CP)',
            starCategory: 5
          },
          images: []
        }
      ]
    };

    setSelectedItinerary(blankItinerary);
    setActiveTab('builder');
  };

  const handleViewItinerary = (id: string) => {
    const item = getItineraryById(id);
    if (item) {
      setSelectedItinerary(item);
      setActiveTab('preview');
    }
  };

  const handleEditItinerary = (id: string) => {
    const item = getItineraryById(id);
    if (item) {
      setSelectedItinerary(item);
      setActiveTab('builder');
    }
  };

  const handleDuplicate = (id: string) => {
    const duplicated = duplicateItinerary(id);
    if (duplicated) {
      setSelectedItinerary(duplicated);
      setActiveTab('preview');
    }
  };

  const handleDelete = (id: string) => {
    deleteItinerary(id);
    if (selectedItinerary?.id === id) {
      setSelectedItinerary(null);
    }
  };

  const handleConfirmBooking = (id: string) => {
    const item = getItineraryById(id);
    if (item) {
      const updated = saveItinerary({
        ...item,
        status: 'Confirmed',
        confirmedAt: '2026-09-28T09:00:00.000Z'
      });
      setSelectedItinerary(updated);
    }
  };

  const handleGenerateVoucher = (id: string) => {
    const item = getItineraryById(id);
    if (item) {
      setSelectedItinerary(item);
      setActiveTab('voucher');
    }
  };

  const handleSaveDraft = (itn: Itinerary) => {
    const saved = saveItinerary(itn);
    setSelectedItinerary(saved);
    alert(`Itinerary ${saved.referenceNumber} successfully saved!`);
  };

  const handleGeneratePreview = (itn: Itinerary) => {
    const saved = saveItinerary({
      ...itn,
      status: itn.status === 'Draft' ? 'Generated' : itn.status
    });
    setSelectedItinerary(saved);
    setActiveTab('preview');
  };

  const handleAddNewHotelQuick = (data: Partial<Hotel>): Hotel => {
    const newHotel: Hotel = {
      id: 'ht-' + Math.random().toString(36).substring(2, 9),
      name: data.name || 'New Hotel',
      city: data.city || 'Delhi',
      state: data.state || 'India',
      address: data.address || `${data.name}, City Center`,
      starCategory: data.starCategory || 4,
      rating: data.rating || 4.5,
      reviewCount: data.reviewCount || 400,
      phone: data.phone || '+91 11 0000 0000',
      email: data.email || 'reservations@hotel.com',
      website: data.website || 'https://www.hotel.com',
      description: data.description || `Registered partner property: ${data.name}.`,
      roomCategories: data.roomCategories || ['Deluxe Room', 'Superior Room'],
      mealPlans: data.mealPlans || ['Breakfast Included (CP)', 'Breakfast & Dinner (MAP)'],
      checkInTime: '14:00',
      checkOutTime: '12:00',
      image: data.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      partnershipStatus: 'Preferred'
    };

    saveHotel(newHotel);
    return newHotel;
  };

  // Global search filtering
  const displayedItineraries = itineraries.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      item.referenceNumber.toLowerCase().includes(q) ||
      item.clientName.toLowerCase().includes(q) ||
      item.tourName.toLowerCase().includes(q) ||
      item.clientPhone.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#151521] flex flex-col font-sans selection:bg-amber-200">
      
      {/* Global Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        onNewItinerary={handleNewItinerary}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <Dashboard
            itineraries={displayedItineraries}
            onNewItinerary={handleNewItinerary}
            onViewItinerary={handleViewItinerary}
            onEditItinerary={handleEditItinerary}
            onDuplicateItinerary={handleDuplicate}
            onDeleteItinerary={handleDelete}
            onGenerateVoucher={handleGenerateVoucher}
            onExportPdf={(itn) => handleViewItinerary(itn.id)}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* ALL ITINERARIES LIST TAB */}
        {activeTab === 'itineraries' && (
          <Dashboard
            itineraries={displayedItineraries}
            onNewItinerary={handleNewItinerary}
            onViewItinerary={handleViewItinerary}
            onEditItinerary={handleEditItinerary}
            onDuplicateItinerary={handleDuplicate}
            onDeleteItinerary={handleDelete}
            onGenerateVoucher={handleGenerateVoucher}
            onExportPdf={(itn) => handleViewItinerary(itn.id)}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* BUILDER TAB */}
        {activeTab === 'builder' && (
          <ItineraryBuilder
            initialItinerary={selectedItinerary}
            destinations={destinations}
            attractions={attractions}
            hotels={hotels}
            vehicles={vehicles}
            settings={settings}
            onSaveDraft={handleSaveDraft}
            onGeneratePreview={handleGeneratePreview}
            onCancel={() => setActiveTab('dashboard')}
            onAddNewHotelQuick={handleAddNewHotelQuick}
          />
        )}

        {/* PREVIEW TAB */}
        {activeTab === 'preview' && selectedItinerary && (
          <ItineraryPreview
            itinerary={selectedItinerary}
            settings={settings}
            destinations={destinations}
            attractions={attractions}
            onEdit={() => setActiveTab('builder')}
            onSave={(updated) => {
              const saved = saveItinerary(updated);
              setSelectedItinerary(saved);
            }}
            onDuplicate={handleDuplicate}
            onConfirmBooking={handleConfirmBooking}
            onGenerateVoucher={handleGenerateVoucher}
            onBack={() => setActiveTab('dashboard')}
          />
        )}

        {/* TRAVEL VOUCHER TAB */}
        {activeTab === 'voucher' && selectedItinerary && (
          <TravelVoucherView
            itinerary={selectedItinerary}
            settings={settings}
            onBack={() => setActiveTab('preview')}
          />
        )}

        {/* HOTELS MANAGER TAB */}
        {activeTab === 'hotels' && (
          <HotelsManager
            hotels={hotels}
            onSaveHotel={(h) => {
              saveHotel(h);
            }}
            onDeleteHotel={(id) => {
              deleteHotel(id);
            }}
          />
        )}

        {/* DESTINATIONS & ATTRACTIONS TAB */}
        {activeTab === 'destinations' && (
          <DestinationsManager
            destinations={destinations}
            attractions={attractions}
            onSaveDestination={(d) => {
              saveDestination(d);
            }}
            onDeleteDestination={(id) => {
              deleteDestination(id);
            }}
            onSaveAttraction={(a) => {
              saveAttraction(a);
            }}
            onDeleteAttraction={(id) => {
              deleteAttraction(id);
            }}
          />
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <SettingsManager
            settings={settings}
            onSaveSettings={(st) => {
              saveSettings(st);
            }}
            onResetDefaults={() => {
              resetAllToDefaults();
            }}
          />
        )}

      </main>

      {/* Persistent Quiet App Footer */}
      <footer className="no-print bg-[#151521] text-slate-400 py-6 border-t border-[#26214F] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wide">
              {settings.companyName.toUpperCase()}
            </span>
            <span>·</span>
            <span>{settings.tagline}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Helpline: {settings.phones[0]}</span>
            <span>·</span>
            <span>{settings.email}</span>
            <span>·</span>
            <span>{settings.address}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
