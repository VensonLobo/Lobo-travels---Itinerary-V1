'use client';

import React, { useState, useRef } from 'react';
import { 
  Download, 
  Printer, 
  Edit3, 
  Save, 
  Copy, 
  Ticket, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Users, 
  Car, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Building2, 
  Utensils, 
  ShieldCheck, 
  AlertCircle, 
  ZoomIn, 
  ZoomOut, 
  Sparkles,
  ChevronLeft,
  Plane,
  Train,
  Compass,
  ArrowRight,
  IndianRupee,
  Camera
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { exportElementToPdf } from '@/lib/pdf-export';
import { getVoucherReferenceNumber } from '@/lib/storage';
import { COMPREHENSIVE_ATTRACTIONS, COMPREHENSIVE_DESTINATIONS } from '@/lib/catalog-data';
import { formatDateDMY } from '@/lib/utils';
import { Itinerary, AppSettings, ItineraryDay, Destination, Attraction } from '@/types';

interface ItineraryPreviewProps {
  itinerary: Itinerary;
  settings: AppSettings;
  destinations?: Destination[];
  attractions?: Attraction[];
  onEdit: () => void;
  onSave: (updated: Itinerary) => void;
  onDuplicate: (id: string) => void;
  onConfirmBooking: (id: string) => void;
  onGenerateVoucher: (id: string) => void;
  onBack: () => void;
}

export default function ItineraryPreview({
  itinerary: initialItinerary,
  settings,
  destinations = [],
  attractions = [],
  onEdit,
  onSave,
  onDuplicate,
  onConfirmBooking,
  onGenerateVoucher,
  onBack
}: ItineraryPreviewProps) {
  const [itinerary, setItinerary] = useState<Itinerary>(initialItinerary);
  const [isInlineEditMode, setIsInlineEditMode] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<boolean>(false);

  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Dynamic lookup catalogues
  const activeAttractions = React.useMemo(() => {
    return (attractions && attractions.length > 0) ? attractions : COMPREHENSIVE_ATTRACTIONS;
  }, [attractions]);

  const activeDestinations = React.useMemo(() => {
    return (destinations && destinations.length > 0) ? destinations : COMPREHENSIVE_DESTINATIONS;
  }, [destinations]);

  // Derived route subtitle
  const routeSubtitle = React.useMemo(() => {
    const cities: string[] = [];
    itinerary.days.forEach(d => {
      if (d.isMultiCity && d.cities) {
        d.cities.forEach(c => {
          if (c.destination && !cities.includes(c.destination)) cities.push(c.destination);
        });
      } else {
        if (d.destination && !cities.includes(d.destination)) cities.push(d.destination);
      }
      if (d.overnightLocation && !cities.includes(d.overnightLocation)) cities.push(d.overnightLocation);
    });
    return cities.join(' • ');
  }, [itinerary.days]);

  // Helper to retrieve authentic photos of key highlight sights and monuments for a day
  const getDayPhotos = React.useCallback((day: ItineraryDay) => {
    const list: { id: string; name: string; image: string; unesco?: boolean }[] = [];
    const seenUrls = new Set<string>();

    // 1. Check day attractionIds (including multi-city circuits)
    const attIds: string[] = [...(day.attractionIds || [])];
    if (day.isMultiCity && day.cities) {
      day.cities.forEach(c => {
        if (c.attractionIds) attIds.push(...c.attractionIds);
      });
    }

    for (const id of attIds) {
      const att = activeAttractions.find(a => a.id === id || a.name.toLowerCase() === id.toLowerCase());
      if (att && att.image && !seenUrls.has(att.image)) {
        seenUrls.add(att.image);
        list.push({ id: att.id, name: att.name, image: att.image, unesco: att.unesco });
      }
    }

    // 2. Only if no attractions were found, check if day images match registered attractions (no generic highlights)
    if (list.length === 0 && day.images && day.images.length > 0) {
      for (const img of day.images) {
        if (img && !seenUrls.has(img)) {
          const match = activeAttractions.find(a => a.image === img);
          if (match) {
            seenUrls.add(img);
            list.push({
              id: match.id,
              name: match.name,
              image: img,
              unesco: match.unesco
            });
          }
        }
      }
    }

    // 3. Fallback to destination attractions ONLY if list is completely empty
    if (list.length === 0 && day.destination) {
      const destAtts = activeAttractions.filter(
        a => a.destinationName.toLowerCase() === day.destination.toLowerCase() && a.image
      );
      for (const att of destAtts.slice(0, 2)) {
        if (!seenUrls.has(att.image)) {
          seenUrls.add(att.image);
          list.push({ id: att.id, name: att.name, image: att.image, unesco: att.unesco });
        }
      }
    }

    return list.slice(0, 4); // Up to 4 authentic highlight photos per day card
  }, [activeAttractions]);

  // Main hero cover image for Page 1 of the itinerary proposal
  const smartCoverImage = React.useMemo(() => {
    // 1. If itinerary has a custom or configured coverImage, respect it immediately
    if (itinerary.coverImage && itinerary.coverImage.trim()) {
      return itinerary.coverImage.trim();
    }

    // 2. Pick the first authentic major attraction/monument photo from the selected tour sights
    for (const day of itinerary.days) {
      const dayPhotos = getDayPhotos(day);
      if (dayPhotos.length > 0 && dayPhotos[0].image) {
        return dayPhotos[0].image;
      }
    }

    // 3. Pick the hero image of the itinerary's starting destination
    const firstDestName = itinerary.days[0]?.destination ||
      (itinerary.days[0]?.isMultiCity && itinerary.days[0]?.cities?.[0]?.destination) ||
      'Delhi';

    const matchedDest = activeDestinations.find(
      d => d.name.toLowerCase() === firstDestName.toLowerCase() ||
           d.id.toLowerCase() === firstDestName.toLowerCase()
    );

    if (matchedDest?.heroImage) {
      return matchedDest.heroImage;
    }

    // 4. Default Taj Mahal iconic cover
    return 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80';
  }, [itinerary.coverImage, itinerary.days, activeDestinations, getDayPhotos]);

  // Intelligently pack days onto A4 pages to eliminate half-empty gaps and prevent content cutoff
  const dayChunks = React.useMemo(() => {
    const days = itinerary.days;
    const n = days.length;
    if (n === 0) return [];
    if (n === 1) return [[days[0]]];

    // If 2 days: exactly 1 balanced page
    if (n === 2) {
      return [days];
    }

    // If 3 days: fit all 3 on 1 page if text is concise, avoiding a lonely half-empty page 2
    if (n === 3) {
      const hasLongDay = days.some(d => (d.description || '').length > 280 || d.isMultiCity);
      if (!hasLongDay) {
        return [days]; // All 3 on 1 full, balanced page!
      }
      return [days.slice(0, 2), days.slice(2, 3)];
    }

    // If 4 days: 2 days on page 1, 2 days on page 2
    if (n === 4) {
      return [days.slice(0, 2), days.slice(2, 4)];
    }

    // If 5 days: 3 days on page 1, 2 days on page 2
    if (n === 5) {
      return [days.slice(0, 3), days.slice(3, 5)];
    }

    // General dynamic chunking: 2 to 3 days per page
    const chunks: ItineraryDay[][] = [];
    let i = 0;
    while (i < n) {
      const remaining = n - i;
      if (remaining === 4) {
        chunks.push(days.slice(i, i + 2));
        chunks.push(days.slice(i + 2, i + 4));
        break;
      } else if (remaining === 3) {
        const hasLongDay = days.slice(i, i + 3).some(d => (d.description || '').length > 280 || d.isMultiCity);
        if (!hasLongDay) {
          chunks.push(days.slice(i, i + 3));
        } else {
          chunks.push(days.slice(i, i + 2));
          chunks.push(days.slice(i + 2, i + 3));
        }
        break;
      } else {
        chunks.push(days.slice(i, i + 2));
        i += 2;
      }
    }
    return chunks;
  }, [itinerary.days]);

  // Total pages = 1 (Cover) + dayChunks.length (Day Pages) + 1 (Accommodations & Terms)
  const totalPages = 1 + dayChunks.length + 1;

  // Handle inline edits
  const updateField = (field: keyof Itinerary, val: any) => {
    setItinerary(prev => ({ ...prev, [field]: val }));
  };

  const handleSaveInline = () => {
    onSave(itinerary);
    setIsInlineEditMode(false);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  // Trigger booking confirmation
  const handleConfirmClick = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setItinerary(prev => ({
      ...prev,
      status: 'Confirmed',
      confirmedAt: new Date().toISOString()
    }));
    onConfirmBooking(itinerary.id);
  };

  // Direct PDF Download via native discrete A4 pages rendering
  const handleExportPdf = async () => {
    if (!previewContainerRef.current) return;
    setIsExporting(true);

    try {
      const sanitizedName = (itinerary.tourName || 'Tour')
        .replace(/[^a-zA-Z0-9_-]/g, '-')
        .replace(/-+/g, '-');
      const filename = `${itinerary.referenceNumber}_${sanitizedName}_Proposal.pdf`;

      await exportElementToPdf(previewContainerRef.current, filename);
    } catch (e) {
      console.error('PDF export failed, print fallback executed', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      
      {/* Top Floating Control Bar (Hidden in Print) */}
      <div className="no-print bg-[#151521] text-white p-4 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4 border border-[#26214F]">
        
        {/* Left: Back & Tour Meta */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition flex items-center gap-1 text-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-300">
                {itinerary.referenceNumber}
              </span>
              <span className="text-[11px] text-slate-400">·</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                itinerary.status === 'Confirmed'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {itinerary.status}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate max-w-[200px]">
              {itinerary.clientName}
            </p>
          </div>
        </div>

        {/* Center: Zoom and Inline Editing Toggle */}
        <div className="flex items-center gap-2 bg-[#26214F]/60 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setZoomLevel(Math.max(60, zoomLevel - 10))}
            className="p-1 rounded text-slate-300 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono px-1 text-amber-200">{zoomLevel}%</span>
          <button
            onClick={() => setZoomLevel(Math.min(140, zoomLevel + 10))}
            className="p-1 rounded text-slate-300 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-white/20 mx-1" />

          {/* Inline Edit Toggle */}
          <button
            onClick={() => setIsInlineEditMode(!isInlineEditMode)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              isInlineEditMode
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>{isInlineEditMode ? 'Exit Inline Edit' : 'Inline Edit'}</span>
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          
          {isInlineEditMode ? (
            <button
              onClick={handleSaveInline}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition"
            >
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </button>
          ) : (
            <>
              {/* Confirm Booking CTA */}
              {itinerary.status !== 'Confirmed' ? (
                <button
                  onClick={handleConfirmClick}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-sm transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Confirm Booking
                </button>
              ) : (
                <button
                  onClick={() => onGenerateVoucher(itinerary.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-xs font-semibold transition"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  View Voucher ({getVoucherReferenceNumber(itinerary.referenceNumber)})
                </button>
              )}

              {/* Edit Full Form */}
              <button
                onClick={onEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-slate-200 transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Form Edit</span>
              </button>

              {/* Duplicate */}
              <button
                onClick={() => onDuplicate(itinerary.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-slate-200 transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Duplicate</span>
              </button>

              {/* Print Vector A4 */}
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-slate-200 transition"
                title="Print Vector A4 PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print / A4</span>
              </button>

              {/* Download PDF file */}
              <button
                onClick={handleExportPdf}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition active:scale-95 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-slate-950" />
                <span>{isExporting ? 'Generating A4 PDF...' : 'Download A4 PDF'}</span>
              </button>
            </>
          )}

        </div>
      </div>

      {/* Success Notification */}
      {saveSuccessNotice && (
        <div className="no-print p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Itinerary changes successfully saved and updated.</span>
        </div>
      )}

      {/* Inline Editing Guide */}
      {isInlineEditMode && (
        <div className="no-print p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Inline Editing Active: Click directly on tour titles, dates, descriptions, and notes on the document to edit them. Click &quot;Save Changes&quot; when done.</span>
          </div>
          <button onClick={handleSaveInline} className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-md">
            Save Changes
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FIXED A4 DOCUMENT CONTAINER (794px × 1123px - Standard A4 96 DPI) */}
      {/* ========================================================================= */}
      <div className="flex justify-center overflow-x-auto p-1 sm:p-4">
        <div
          ref={previewContainerRef}
          style={{ 
            transform: `scale(${zoomLevel / 100})`, 
            transformOrigin: 'top center',
            width: '794px'
          }}
          className="bg-slate-100 shadow-2xl transition-transform space-y-6 print:space-y-0 print:shadow-none print:transform-none"
        >
          
          {/* ===================================================================== */}
          {/* PAGE 1: COVER PAGE (Fixed A4: 794px × 1123px) */}
          {/* ===================================================================== */}
          <div 
            className="pdf-page bg-white text-[#151521] border border-slate-200 overflow-hidden relative font-sans flex flex-col justify-between"
            style={{ width: '794px', height: '1123px', minHeight: '1123px', maxHeight: '1123px', padding: '48px', boxSizing: 'border-box' }}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-[#151521] pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg overflow-hidden flex items-center justify-center p-1 bg-slate-50 border border-slate-200">
                    <img 
                      src={settings.logoUrl} 
                      alt={settings.companyName} 
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-black tracking-tight text-[#151521]">
                      {settings.companyName.toUpperCase()}
                    </h2>
                    <p className="text-[10px] text-[#9899A1] font-medium tracking-wide">
                      {settings.tagline}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[9px] uppercase font-bold tracking-widest text-[#9899A1]">
                    Itinerary Proposal Reference
                  </div>
                  <div className="font-mono text-sm font-black text-[#26214F]">
                    {itinerary.referenceNumber}
                  </div>
                </div>
              </div>

              {/* Tour Titles */}
              <div className="space-y-2 mb-6">
                <div className="inline-block px-2.5 py-0.5 rounded bg-[#26214F] text-amber-300 font-bold text-[10px] uppercase tracking-widest">
                  Custom Tailored Travel Proposal
                </div>

                {isInlineEditMode ? (
                  <input
                    type="text"
                    value={itinerary.tourName}
                    onChange={(e) => updateField('tourName', e.target.value)}
                    className="text-2xl font-black text-[#151521] tracking-tight border-b-2 border-amber-500 w-full bg-amber-50 px-2 py-1"
                  />
                ) : (
                  <h1 className="text-2xl font-black text-[#151521] tracking-tight leading-tight">
                    {itinerary.tourName.toUpperCase()}
                  </h1>
                )}

                <p className="text-xs font-semibold tracking-wider text-[#26214F] uppercase">
                  {routeSubtitle}
                </p>
              </div>

              {/* Cover Hero Image - Dynamically selected from tour sights or starting destination */}
              <div className={`rounded-xl overflow-hidden shadow-md border border-slate-200 mb-4 relative group ${
                itinerary.flightBookings?.flightsBookedByUs && itinerary.flightBookings.flights?.length ? 'h-60' : 'h-80'
              }`}>
                <img
                  src={smartCoverImage}
                  alt={itinerary.tourName || 'Tour Destination'}
                  className="w-full h-full object-cover"
                />
                {isInlineEditMode && (
                  <div className="absolute bottom-2 right-2 bg-slate-900/90 backdrop-blur-xs text-white text-[10px] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md border border-slate-700">
                    <span className="font-semibold text-amber-300">Cover URL:</span>
                    <input
                      type="text"
                      value={itinerary.coverImage || ''}
                      onChange={(e) => updateField('coverImage', e.target.value)}
                      placeholder="Paste custom cover image link"
                      className="text-[10px] bg-slate-800 text-white border border-slate-600 rounded px-1.5 py-0.5 w-52 focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                )}
              </div>

              {/* Key Facts Grid */}
              <div className="grid grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-3.5">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block mb-0.5">
                    Prepared For
                  </span>
                  {isInlineEditMode ? (
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={itinerary.clientName}
                        onChange={(e) => updateField('clientName', e.target.value)}
                        placeholder="Client Name"
                        className="w-full text-xs font-bold text-slate-900 border-b border-amber-500 bg-amber-50 px-1 py-0.5"
                      />
                      <input
                        type="text"
                        value={itinerary.clientPhone}
                        onChange={(e) => updateField('clientPhone', e.target.value)}
                        placeholder="Phone Number"
                        className="w-full text-[10px] text-slate-700 border-b border-amber-500 bg-amber-50 px-1 py-0.5"
                      />
                      <input
                        type="text"
                        value={itinerary.clientEmail || ''}
                        onChange={(e) => updateField('clientEmail', e.target.value)}
                        placeholder="Email ID"
                        className="w-full text-[10px] text-slate-700 border-b border-amber-500 bg-amber-50 px-1 py-0.5"
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="font-bold text-slate-900 truncate">
                        {itinerary.clientName || 'Valued Guests'}
                      </div>
                      {itinerary.clientPhone && (
                        <div className="text-[10px] text-slate-600 font-medium flex items-center gap-1 mt-0.5 truncate" title={itinerary.clientPhone}>
                          <Phone className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" />
                          <span>{itinerary.clientPhone}</span>
                        </div>
                      )}
                      {itinerary.clientEmail && (
                        <div className="text-[10px] text-slate-600 font-medium flex items-center gap-1 mt-0.5 truncate" title={itinerary.clientEmail}>
                          <Mail className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" />
                          <span>{itinerary.clientEmail}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block mb-0.5">
                    Travel Dates
                  </span>
                  {isInlineEditMode ? (
                    <div className="space-y-1">
                      <input
                        type="date"
                        value={itinerary.startDate || ''}
                        onChange={(e) => updateField('startDate', e.target.value)}
                        className="w-full text-[10px] font-bold text-slate-900 border-b border-amber-500 bg-amber-50 px-1 py-0.5"
                      />
                      <input
                        type="date"
                        value={itinerary.endDate || ''}
                        onChange={(e) => updateField('endDate', e.target.value)}
                        className="w-full text-[10px] font-bold text-slate-900 border-b border-amber-500 bg-amber-50 px-1 py-0.5"
                      />
                    </div>
                  ) : (
                    <div className="font-bold text-slate-900">
                      {itinerary.datesNotConfirmed
                        ? 'To Be Confirmed'
                        : `${formatDateDMY(itinerary.startDate)} to ${formatDateDMY(itinerary.endDate)}`}
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block mb-0.5">
                    Duration
                  </span>
                  <div className="font-bold text-slate-900">
                    {itinerary.durationText}
                  </div>
                </div>

                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block mb-0.5">
                    Vehicle Standard
                  </span>
                  <div className="font-bold text-slate-900 truncate" title={itinerary.vehicleDisplay}>
                    {itinerary.vehicleBrand} {itinerary.vehicleModel}
                  </div>
                </div>
              </div>

              {/* Confirmed Flight Travel Details & Tickets (Arrival & Departure Details) */}
              {itinerary.flightBookings?.flightsBookedByUs && itinerary.flightBookings.flights?.length > 0 && (
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-sky-50 to-indigo-50/60 border border-sky-200 text-xs space-y-2 mb-3.5">
                  <div className="flex items-center justify-between border-b border-sky-200/80 pb-1.5">
                    <span className="font-bold text-sky-950 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                      <Plane className="w-3.5 h-3.5 text-sky-600" />
                      Flight Travel Details & Tickets (Confirmed Flights)
                    </span>
                    <span className="text-[10px] font-bold text-sky-800 bg-sky-200/60 px-2 py-0.5 rounded">
                      Flights Booked by {settings.companyName}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    {itinerary.flightBookings.flights.map((fl) => (
                      <div key={fl.id} className="bg-white/95 p-2 rounded-lg border border-sky-100 shadow-2xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                            fl.type === 'arrival' 
                              ? 'bg-indigo-100 text-indigo-800' 
                              : fl.type === 'departure' 
                              ? 'bg-sky-100 text-sky-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {fl.type === 'arrival' ? 'Inbound / Arrival' : fl.type === 'departure' ? 'Outbound / Return' : 'Domestic Sector'}
                          </span>
                          {fl.pnr && (
                            <span className="font-mono text-[10px] font-bold text-slate-700">
                              PNR: {fl.pnr}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between font-bold text-slate-900 pt-0.5">
                          <span className="truncate">{fl.departureCity}</span>
                          <span className="text-sky-600 px-1 text-xs">➔</span>
                          <span className="truncate">{fl.arrivalCity}</span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-600">
                          <span>
                            <strong>{fl.airline}</strong> {fl.flightNumber}
                          </span>
                          <span className="font-semibold text-slate-800">
                            {fl.departureTime} – {fl.arrivalTime}
                          </span>
                        </div>
                        {fl.baggage && (
                          <div className="text-[9px] text-slate-400">
                            Baggage: {fl.baggage}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Passengers & Commercial Summary */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#151521] text-white text-xs">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span><strong>Total Guests:</strong> {itinerary.paxSummary}</span>
                </div>
                {itinerary.showCostInItinerary && (
                  <div className="flex items-center gap-2 text-right">
                    <span className="text-slate-300 text-[11px]">Total Package Value:</span>
                    <span className="font-black text-amber-300 text-sm">
                      {itinerary.currencySymbol}{itinerary.totalCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Pinned Page 1 Footer */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#151521]">{settings.companyName}</span>
                <span>·</span>
                <span>{settings.phones[0]}</span>
                <span>·</span>
                <span>{settings.website}</span>
              </div>
              <div className="font-mono">Ref: {itinerary.referenceNumber}</div>
              <div>Page 1 of {totalPages}</div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* DAY-BY-DAY SIGHTSEEING PAGES (2 Days Per Fixed A4 Page) */}
          {/* ===================================================================== */}
          {dayChunks.map((chunk, chunkIdx) => {
            const pageNum = 2 + chunkIdx;
            return (
              <div
                key={`page-days-${chunkIdx}`}
                className="pdf-page bg-white text-[#151521] border border-slate-200 overflow-hidden relative font-sans flex flex-col justify-between"
                style={{ width: '794px', height: '1123px', minHeight: '1123px', maxHeight: '1123px', padding: '48px', boxSizing: 'border-box' }}
              >
                <div>
                  {/* Top Page Header */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-5">
                    <div>
                      <h3 className="text-sm font-black tracking-tight text-[#151521] uppercase">
                        Daily Sightseeing & Travel Schedule
                      </h3>
                      <p className="text-[10px] text-slate-500">
                        {itinerary.tourName} · Days {chunk[0].dayNumber} to {chunk[chunk.length - 1].dayNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-[#26214F]">
                        {itinerary.referenceNumber}
                      </span>
                    </div>
                  </div>

                  {/* Day Cards (2 per page) */}
                  <div className="space-y-4">
                    {chunk.map((day) => (
                      <div 
                        key={day.id} 
                        className="rounded-xl border border-slate-200 p-4 space-y-3 bg-white shadow-2xs"
                      >
                        {/* Day Card Header Bar */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-[#151521] text-amber-300 font-black text-xs flex items-center justify-center">
                              D{day.dayNumber}
                            </span>
                            <div>
                              <h4 className="font-black text-sm text-slate-900 leading-tight">
                                {day.title}
                              </h4>
                              <div className="text-[10px] text-slate-500 font-medium">
                                Sightseeing: <strong>{day.isMultiCity ? (day.cities?.map(c => c.destination).join(' & ') || day.destination) : day.destination}</strong>
                                {' · '}
                                Overnight: <strong>{day.overnightLocation}</strong>
                              </div>
                            </div>
                          </div>

                          {/* Meal badges */}
                          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                            <Utensils className="w-3 h-3 text-amber-600" />
                            <span>
                              {[day.meals.breakfast && 'B', day.meals.lunch && 'L', day.meals.dinner && 'D'].filter(Boolean).join(' • ') || 'At leisure'}
                            </span>
                          </div>
                        </div>

                        {/* Day 1 Arrival Banner if enabled */}
                        {day.dayNumber === 1 && day.arrivalDetails?.enabled && (
                          <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200 text-xs flex items-center justify-between text-indigo-950">
                            <div className="flex items-center gap-2">
                              <Plane className="w-3.5 h-3.5 text-indigo-600" />
                              <span className="font-bold">Arrival: {day.arrivalDetails.point}</span>
                              {day.arrivalDetails.flightOrTrainNumber && (
                                <span className="text-[11px] font-mono text-indigo-800">
                                  ({day.arrivalDetails.flightOrTrainNumber})
                                </span>
                              )}
                              {day.arrivalDetails.arrivalTime && (
                                <span className="text-[11px] text-indigo-700">
                                  at {day.arrivalDetails.arrivalTime}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-200/60 text-indigo-900">
                              {day.arrivalDetails.checkInTiming === 'after_sightseeing' ? 'Check-in After Tour' : 'Hotel Check-in First'}
                            </span>
                          </div>
                        )}

                        {/* Final Day Departure Banner if enabled */}
                        {day.departureDetails?.enabled && (
                          <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200 text-xs flex items-center justify-between text-sky-950">
                            <div className="flex items-center gap-2">
                              <Plane className="w-3.5 h-3.5 text-sky-600" />
                              <span className="font-bold">Departure / Drop: {day.departureDetails.point}</span>
                              {day.departureDetails.flightOrTrainNumber && (
                                <span className="text-[11px] font-mono text-sky-800">
                                  ({day.departureDetails.flightOrTrainNumber})
                                </span>
                              )}
                              {day.departureDetails.departureTime && (
                                <span className="text-[11px] text-sky-700">
                                  at {day.departureDetails.departureTime}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-200/60 text-sky-900">
                              Return Transfer
                            </span>
                          </div>
                        )}

                        {/* Multi-City Circuit Legs Banner (Car, Flight, Train) */}
                        {day.isMultiCity && day.cities && day.cities.length > 0 && (
                          <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200 text-xs space-y-1.5">
                            <span className="font-bold text-purple-950 block text-[10px] uppercase tracking-wider">
                              Multi-City Circuit Route:
                            </span>
                            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-purple-900 font-medium">
                              {day.cities.map((city, cIdx) => (
                                <React.Fragment key={city.id || cIdx}>
                                  <span className="bg-white px-2 py-0.5 rounded border border-purple-200 font-semibold text-slate-800">
                                    {city.destination}
                                    {city.checkOut && ' (Check-Out)'}
                                    {city.checkIn && ' (Check-In)'}
                                  </span>

                                  {/* Inter-city transit between cities */}
                                  {cIdx < day.cities!.length - 1 && (
                                    <>
                                      {city.transitType === 'flight' ? (
                                        <span className="text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 flex items-center gap-1 font-bold text-[10px]">
                                          <Plane className="w-3 h-3 text-indigo-600" />
                                          <span>Flight {city.flightToNext?.airline ? `${city.flightToNext.airline} ` : ''}{city.flightToNext?.flightNumber || ''}</span>
                                          {city.flightToNext?.departureTime && (
                                            <span className="text-indigo-950 font-normal">({city.flightToNext.departureTime} → {city.flightToNext.arrivalTime || ''})</span>
                                          )}
                                        </span>
                                      ) : city.transitType === 'train' ? (
                                        <span className="text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 font-bold text-[10px]">
                                          <Train className="w-3 h-3 text-emerald-600" />
                                          <span>Train {city.trainToNext?.trainName || ''} {city.trainToNext?.trainNumber || ''}</span>
                                          {city.trainToNext?.departureTime && (
                                            <span className="text-emerald-950 font-normal">({city.trainToNext.departureTime} → {city.trainToNext.arrivalTime || ''})</span>
                                          )}
                                        </span>
                                      ) : (
                                        <span className="text-amber-800 bg-white px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1 font-semibold text-[10px]">
                                          <Car className="w-3 h-3 text-amber-600" />
                                          <span>Drive{city.driveToNext?.routeVia ? ` via ${city.driveToNext.routeVia}` : ''}</span>
                                        </span>
                                      )}
                                      <span className="text-purple-400 font-bold">➔</span>
                                    </>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Inter-City Transfer Banner if single destination with different overnight */}
                        {!day.isMultiCity && day.transfer && (
                          <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] flex items-center justify-between text-amber-950">
                            <div className="flex items-center gap-1.5 font-semibold">
                              <Car className="w-3.5 h-3.5 text-amber-600" />
                              <span>Inter-City Transfer: {day.transfer.from} → {day.transfer.to}</span>
                            </div>
                            <span className="text-amber-800 font-bold">
                              {day.transfer.distanceKm} km · {day.transfer.driveTime}
                            </span>
                          </div>
                        )}

                        {/* Sights Covered Badges */}
                        {day.attractionNames && day.attractionNames.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {day.attractionNames.map((name, i) => (
                              <span 
                                key={i} 
                                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-semibold border border-slate-200"
                              >
                                ✓ {name}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Sightseeing Narrative Description */}
                        <p className="text-xs text-slate-700 leading-relaxed font-sans">
                          {day.description}
                        </p>

                        {/* Key Highlight Attractions & Monuments Photos Grid (Strictly Square 1:1 Images) */}
                        {(() => {
                          const dayPhotos = getDayPhotos(day);
                          if (dayPhotos.length === 0) return null;
                          const isDense = chunk.length >= 3;
                          const photoDim = isDense ? 96 : 110;

                          return (
                            <div className="pt-1">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                  <Camera className="w-3 h-3 text-amber-600" />
                                  Featured Sightseeing Highlights & Monuments:
                                </span>
                                <span className="text-[9px] text-slate-400 font-medium">
                                  {dayPhotos.length} {dayPhotos.length === 1 ? 'Site' : 'Sites'} Photographed
                                </span>
                              </div>
                              <div className="flex flex-wrap items-start gap-2.5">
                                {dayPhotos.map((photo, pIdx) => (
                                  <div 
                                    key={photo.id || pIdx} 
                                    className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex flex-col shadow-2xs group flex-shrink-0"
                                    style={{ width: `${photoDim}px` }}
                                  >
                                    <div 
                                      className="relative bg-slate-200 overflow-hidden"
                                      style={{ 
                                        width: `${photoDim}px`, 
                                        height: `${photoDim}px`,
                                        minWidth: `${photoDim}px`,
                                        minHeight: `${photoDim}px`,
                                        maxWidth: `${photoDim}px`,
                                        maxHeight: `${photoDim}px`
                                      }}
                                    >
                                      <img 
                                        src={photo.image} 
                                        alt={photo.name} 
                                        loading="eager"
                                        className="w-full h-full object-cover block transition duration-300 group-hover:scale-105" 
                                        style={{ 
                                          width: `${photoDim}px`, 
                                          height: `${photoDim}px`,
                                          minWidth: `${photoDim}px`,
                                          minHeight: `${photoDim}px`,
                                          maxWidth: `${photoDim}px`,
                                          maxHeight: `${photoDim}px`,
                                          objectFit: 'cover'
                                        }}
                                      />
                                      {photo.unesco && (
                                        <span className="absolute top-1 left-1 bg-amber-500 text-slate-950 font-black text-[7px] px-1.5 py-0.5 rounded shadow leading-none">
                                          UNESCO
                                        </span>
                                      )}
                                    </div>
                                    <div 
                                      className="p-1 px-1.5 bg-white text-[10px] font-semibold text-slate-800 truncate" 
                                      title={photo.name}
                                      style={{ width: `${photoDim}px` }}
                                    >
                                      {photo.name}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Hotel & Night Stay */}
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px] flex items-center justify-between text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                            <span>
                              <strong>Hotel:</strong> {day.hotel?.name || `Partner Hotel in ${day.overnightLocation}`} ({day.hotel?.roomCategory || 'Deluxe Room'})
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {day.hotel?.mealPlan || 'Breakfast Included (CP)'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pinned Page Footer */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#151521]">{settings.companyName}</span>
                    <span>·</span>
                    <span>{settings.phones[0]}</span>
                  </div>
                  <div className="font-mono">Ref: {itinerary.referenceNumber}</div>
                  <div>Page {pageNum} of {totalPages}</div>
                </div>
              </div>
            );
          })}

          {/* ===================================================================== */}
          {/* FINAL PAGE: ACCOMMODATIONS, COMMERCIALS, INCLUSIONS & TERMS */}
          {/* ===================================================================== */}
          <div 
            className="pdf-page bg-white text-[#151521] border border-slate-200 overflow-hidden relative font-sans flex flex-col justify-between"
            style={{ width: '794px', height: '1123px', minHeight: '1123px', maxHeight: '1123px', padding: '48px', boxSizing: 'border-box' }}
          >
            <div className="space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-sm font-black tracking-tight text-[#151521] uppercase">
                    Accommodations, Inclusions & Tour Guidelines
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Comprehensive commercial terms, hotel schedule, and contractual inclusions
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-[#26214F]">
                    {itinerary.referenceNumber}
                  </span>
                </div>
              </div>

              {/* Confirmed Hotels Matrix Table */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  Hotel Accommodations Plan
                </span>
                <div className="rounded-lg border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#151521] text-amber-300 font-semibold text-[11px]">
                      <tr>
                        <th className="py-2 px-3">Day / Night</th>
                        <th className="py-2 px-3">Destination</th>
                        <th className="py-2 px-3">Hotel Property</th>
                        <th className="py-2 px-3">Room Category</th>
                        <th className="py-2 px-3">Meal Plan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 text-[11px]">
                      {itinerary.days.map((day) => (
                        <tr key={day.id} className="hover:bg-slate-50/50">
                          <td className="py-1.5 px-3 font-semibold text-slate-900">
                            Day {day.dayNumber}
                          </td>
                          <td className="py-1.5 px-3">{day.overnightLocation}</td>
                          <td className="py-1.5 px-3 font-bold text-slate-900">
                            {day.hotel?.name || `Partner Hotel (${day.overnightLocation})`}
                          </td>
                          <td className="py-1.5 px-3 text-slate-600">
                            {day.hotel?.roomCategory || 'Deluxe Room'}
                          </td>
                          <td className="py-1.5 px-3 text-slate-600">
                            {day.hotel?.mealPlan || 'Breakfast Included (CP)'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Commercial Price & Payment Plan (If Enabled) */}
              {itinerary.showCostInItinerary && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                      Commercial Tour Valuation & Terms
                    </span>
                    <span className="font-black text-slate-950 text-base">
                      {itinerary.currencySymbol}{itinerary.totalCost.toLocaleString('en-IN')} Total Net
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Total Package</span>
                      <span className="font-bold text-slate-900">
                        {itinerary.currencySymbol}{itinerary.totalCost.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Advance Deposit</span>
                      <span className="font-bold text-emerald-700">
                        {itinerary.currencySymbol}{itinerary.advancePaid.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-amber-200 bg-amber-50/40">
                      <span className="text-amber-800 block text-[10px] font-semibold">Balance Due</span>
                      <span className="font-bold text-amber-950">
                        {itinerary.currencySymbol}{itinerary.pendingAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Inclusions & Exclusions Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">
                    Tour Inclusions
                  </span>
                  <ul className="space-y-1 text-slate-700 text-[11px]">
                    {itinerary.inclusions.slice(0, 8).map((inc, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">
                    Tour Exclusions
                  </span>
                  <ul className="space-y-1 text-slate-700 text-[11px]">
                    {itinerary.exclusions.slice(0, 7).map((exc, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-500 font-bold">✕</span>
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Special Notes & Destination Reminders */}
              {itinerary.specialNotes && (
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-300 text-xs text-amber-950 space-y-1">
                  <span className="font-bold block text-[11px] uppercase tracking-wider">
                    Important Travel Guidelines & Notes:
                  </span>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    {itinerary.specialNotes}
                  </p>
                </div>
              )}

              {/* Company Signoff & Verification */}
              <div className="p-3 rounded-xl bg-[#151521] text-white text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-amber-300">{settings.companyName} Operations Desk</div>
                  <div className="text-[10px] text-slate-300">{settings.address}</div>
                </div>
                <div className="text-right text-[10px] text-slate-300">
                  <div>Chauffeur Helplines: {settings.phones.join(' | ')}</div>
                  <div>Email: {settings.email} · {settings.website}</div>
                </div>
              </div>

            </div>

            {/* Pinned Final Page Footer */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#151521]">{settings.companyName}</span>
                <span>·</span>
                <span>{settings.phones[0]}</span>
              </div>
              <div className="font-mono">Ref: {itinerary.referenceNumber}</div>
              <div>Page {totalPages} of {totalPages}</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
