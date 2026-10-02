'use client';

import React, { useRef, useState } from 'react';
import { 
  Printer, 
  Download, 
  ChevronLeft, 
  Building2, 
  MapPin, 
  Calendar, 
  Users, 
  Car, 
  CheckCircle2, 
  IndianRupee, 
  ShieldCheck, 
  AlertCircle,
  FileCheck2,
  Phone,
  Mail,
  Plane,
  Train,
  Clock
} from 'lucide-react';
import { exportElementToPdf } from '@/lib/pdf-export';
import { getVoucherReferenceNumber } from '@/lib/storage';
import { formatDateDMY } from '@/lib/utils';
import { Itinerary, AppSettings } from '@/types';

interface TravelVoucherViewProps {
  itinerary: Itinerary;
  settings: AppSettings;
  onBack: () => void;
}

export default function TravelVoucherView({
  itinerary,
  settings,
  onBack
}: TravelVoucherViewProps) {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const voucherRef = useRef<HTMLDivElement>(null);

  // Voucher reference number with LTV prefix (e.g. LT-2026-0001 -> LTV-2026-0001)
  const voucherReference = getVoucherReferenceNumber(itinerary.referenceNumber);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = async () => {
    if (!voucherRef.current) return;
    setIsExporting(true);

    try {
      const sanitizedTour = (itinerary.tourName || 'Tour').replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-');
      const filename = `${voucherReference}_${sanitizedTour}_Travel-Voucher.pdf`;
      await exportElementToPdf(voucherRef.current, filename);
    } catch (e) {
      console.error('Voucher PDF generation error', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      
      {/* Top Floating Controls */}
      <div className="no-print sticky top-16 z-30 bg-[#151521]/95 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-[#26214F] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Return to Tour</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-300">
                {voucherReference}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                CONFIRMED TRAVEL VOUCHER
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate max-w-[200px]">
              Guest: {itinerary.clientName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-slate-200 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print A4</span>
          </button>

          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition active:scale-95 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-slate-950" />
            <span>{isExporting ? 'Generating Voucher...' : 'Download Voucher PDF'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FIXED A4 VOUCHER CONTAINER (794px × 1123px - Standard A4 96 DPI) */}
      {/* ========================================================================= */}
      <div className="flex justify-center overflow-x-auto p-1 sm:p-4">
        <div 
          ref={voucherRef}
          style={{ width: '794px' }}
          className="bg-slate-100 shadow-2xl transition-transform space-y-6 print:space-y-0 print:shadow-none print:transform-none"
        >
          
          {/* ===================================================================== */}
          {/* VOUCHER PAGE 1: Guest Coordinates, Accommodations & Operational Route */}
          {/* ===================================================================== */}
          <div 
            className="pdf-page bg-white text-[#151521] border border-slate-200 overflow-hidden relative font-sans flex flex-col justify-between"
            style={{ width: '794px', height: '1123px', minHeight: '1123px', maxHeight: '1123px', padding: '44px', boxSizing: 'border-box' }}
          >
            <div className="space-y-4">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-[#151521] pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg overflow-hidden flex items-center justify-center p-1 bg-slate-50 border border-slate-200">
                    <img 
                      src={settings.logoUrl} 
                      alt={settings.companyName} 
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-lg font-black tracking-tight text-[#151521]">
                      {settings.companyName.toUpperCase()}
                    </h1>
                    <p className="text-[10px] text-[#9899A1] font-medium">
                      {settings.tagline}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block px-2.5 py-0.5 rounded bg-[#151521] text-amber-300 font-extrabold text-[10px] tracking-widest uppercase mb-1">
                    CONFIRMED SERVICE VOUCHER
                  </div>
                  <div className="font-mono text-sm font-black text-[#26214F]">
                    Voucher Ref: {voucherReference}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Tour Ref: {itinerary.referenceNumber} · Issued: {itinerary.confirmedAt ? new Date(itinerary.confirmedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Client & Tour Details Box */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                
                {/* Client Coordinates */}
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                    Lead Guest / Booking Holder
                  </span>
                  <div className="text-xs font-bold text-slate-900">
                    {itinerary.clientName}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{itinerary.clientPhone}</span>
                  </div>
                  {itinerary.clientEmail && (
                    <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{itinerary.clientEmail}</span>
                    </div>
                  )}
                </div>

                {/* Tour & Vehicle Coordinates */}
                <div className="space-y-1 border-l border-slate-200 pl-4">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                    Tour Circuit & Vehicle Assigned
                  </span>
                  <div className="font-bold text-slate-900 text-xs truncate">
                    {itinerary.tourName}
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    <strong>Dates:</strong> {itinerary.datesNotConfirmed ? 'To Be Confirmed' : `${formatDateDMY(itinerary.startDate)} to ${formatDateDMY(itinerary.endDate)} (${itinerary.durationText})`}
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    <strong>Guests:</strong> {itinerary.paxSummary}
                  </div>
                  <div className="text-slate-900 font-semibold flex items-center gap-1 text-[11px]">
                    <Car className="w-3 h-3 text-amber-600" />
                    <span>{itinerary.vehicleDisplay}</span>
                  </div>
                </div>

              </div>

              {/* Confirmed Flight Tickets & Sector Logistics (if flights booked) */}
              {itinerary.flightBookings?.flightsBookedByUs && itinerary.flightBookings.flights?.length > 0 && (
                <div className="space-y-1.5">
                  <h3 className="text-[11px] font-bold text-sky-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-sky-600" />
                    Confirmed Flight Tickets & Transit Logistics
                  </h3>
                  <div className="rounded-lg border border-sky-200 overflow-hidden shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#151521] text-sky-300 font-semibold text-[10px]">
                        <tr>
                          <th className="py-1.5 px-3">Sector</th>
                          <th className="py-1.5 px-3">Flight / Airline</th>
                          <th className="py-1.5 px-3">Route (From ➔ To)</th>
                          <th className="py-1.5 px-3">Timings</th>
                          <th className="py-1.5 px-3">PNR / E-Ticket</th>
                          <th className="py-1.5 px-3">Baggage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-sky-100 text-slate-700 text-[10px] bg-sky-50/20">
                        {itinerary.flightBookings.flights.map((fl) => (
                          <tr key={fl.id} className="hover:bg-sky-50/50">
                            <td className="py-1.5 px-3 font-semibold text-slate-900">
                              {fl.sectorTitle}
                            </td>
                            <td className="py-1.5 px-3 font-bold text-slate-900">
                              {fl.airline} {fl.flightNumber}
                            </td>
                            <td className="py-1.5 px-3 font-medium text-slate-800">
                              {fl.departureCity} ➔ {fl.arrivalCity}
                            </td>
                            <td className="py-1.5 px-3 text-slate-800 font-medium">
                              {fl.departureTime} – {fl.arrivalTime}
                            </td>
                            <td className="py-1.5 px-3 font-mono font-bold text-sky-900">
                              {fl.pnr || 'Confirmed'}
                            </td>
                            <td className="py-1.5 px-3 text-slate-500">
                              {fl.baggage || '15 Kg + 7 Kg'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Concise Day-wise Operations Summary (Comes First) */}
              <div className="space-y-2">
                <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-amber-600" />
                  Day-Wise Sightseeing & Transfer Logistics
                </h3>
                <div className="space-y-1.5">
                  {itinerary.days.map((day) => (
                    <div key={day.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px]">
                      <div className="flex items-center justify-between font-bold text-slate-900 mb-0.5">
                        <span>
                          Day {day.dayNumber} — {day.isMultiCity ? (day.cities?.map(c => c.destination).join(' → ') || day.destination) : day.destination}
                        </span>
                        <span className="text-[10px] text-slate-500 font-normal">
                          Overnight: {day.overnightLocation}
                        </span>
                      </div>

                      {/* Day 1 Arrival Info */}
                      {day.dayNumber === 1 && day.arrivalDetails?.enabled && (
                        <div className="text-indigo-900 text-[10px] font-medium bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 inline-block mb-1 mr-2">
                          Arrival: {day.arrivalDetails.point} {day.arrivalDetails.flightOrTrainNumber && `(${day.arrivalDetails.flightOrTrainNumber})`} {day.arrivalDetails.arrivalTime && `at ${day.arrivalDetails.arrivalTime}`} · {day.arrivalDetails.checkInTiming === 'after_sightseeing' ? 'Check-in After Tour' : 'Hotel Check-in First'}
                        </div>
                      )}

                      {/* Final Day Departure Info */}
                      {day.departureDetails?.enabled && (
                        <div className="text-sky-900 text-[10px] font-medium bg-sky-50 px-2 py-0.5 rounded border border-sky-100 inline-block mb-1">
                          Departure: {day.departureDetails.point} {day.departureDetails.flightOrTrainNumber && `(${day.departureDetails.flightOrTrainNumber})`} {day.departureDetails.departureTime && `at ${day.departureDetails.departureTime}`}
                        </div>
                      )}

                      {/* Sights */}
                      {day.attractionNames && day.attractionNames.length > 0 && (
                        <div className="text-slate-600 text-[10px] mb-0.5">
                          <strong>Sights:</strong> {day.attractionNames.join(', ')}
                        </div>
                      )}

                      {/* Multi-city or inter-city transits (Car, Flight, Train) */}
                      {day.isMultiCity && day.cities && day.cities.length > 1 && (
                        <div className="text-[10px] font-medium flex flex-wrap gap-2 text-slate-700">
                          {day.cities.map((c, cIdx) => {
                            if (cIdx >= day.cities!.length - 1) return null;
                            const nextC = day.cities![cIdx + 1]?.destination;
                            if (c.transitType === 'flight') {
                              return (
                                <span key={c.id || cIdx} className="text-indigo-800 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200 flex items-center gap-1 font-semibold">
                                  <Plane className="w-3 h-3 text-indigo-600" />
                                  <span>Flight: {c.destination} → {nextC} ({c.flightToNext?.airline || ''} {c.flightToNext?.flightNumber || ''} · {c.flightToNext?.departureTime || ''} - {c.flightToNext?.arrivalTime || ''})</span>
                                </span>
                              );
                            } else if (c.transitType === 'train') {
                              return (
                                <span key={c.id || cIdx} className="text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1 font-semibold">
                                  <Train className="w-3 h-3 text-emerald-600" />
                                  <span>Train: {c.destination} → {nextC} ({c.trainToNext?.trainName || ''} {c.trainToNext?.trainNumber || ''} · {c.trainToNext?.departureTime || ''} - {c.trainToNext?.arrivalTime || ''})</span>
                                </span>
                              );
                            } else {
                              return (
                                <span key={c.id || cIdx} className="text-amber-800 flex items-center gap-1">
                                  <Car className="w-3 h-3 text-amber-600" />
                                  <span>Drive: {c.destination} → {nextC}{c.driveToNext?.routeVia ? ` via ${c.driveToNext.routeVia}` : ''}</span>
                                </span>
                              );
                            }
                          })}
                        </div>
                      )}
                      {!day.isMultiCity && day.transfer && (
                        <div className="text-amber-800 text-[10px] font-medium flex items-center gap-1">
                          <Car className="w-3 h-3 text-amber-600" />
                          <span>Transfer: {day.transfer.from} → {day.transfer.to}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirmed Hotels Matrix (Comes Second) */}
              <div className="space-y-1.5">
                <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  Confirmed Hotel Accommodations
                </h3>
                <div className="rounded-lg border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#151521] text-amber-300 font-semibold text-[10px]">
                      <tr>
                        <th className="py-1.5 px-3">Day</th>
                        <th className="py-1.5 px-3">Destination</th>
                        <th className="py-1.5 px-3">Hotel Partner</th>
                        <th className="py-1.5 px-3">Room Category</th>
                        <th className="py-1.5 px-3">Meal Plan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 text-[10px]">
                      {itinerary.days.map((day) => (
                        <tr key={day.id} className="hover:bg-slate-50/50">
                          <td className="py-1.5 px-3 font-semibold text-slate-900">
                            Day {day.dayNumber}
                          </td>
                          <td className="py-1.5 px-3">{day.overnightLocation}</td>
                          <td className="py-1.5 px-3 font-bold text-slate-900">
                            {day.hotel?.name || `Partner Hotel Confirmed (${day.overnightLocation})`}
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

            </div>

            {/* Pinned Page 1 Footer */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#151521]">{settings.companyName} Operations</span>
                <span>·</span>
                <span>24/7 Helpline: {settings.phones[0]}</span>
              </div>
              <div className="font-mono">Voucher Ref: {voucherReference}</div>
              <div>Page 1 of 2</div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* VOUCHER PAGE 2: Financial Ledger, Inclusions, Terms & Chauffeur Guidelines */}
          {/* ===================================================================== */}
          <div 
            className="pdf-page bg-white text-[#151521] border border-slate-200 overflow-hidden relative font-sans flex flex-col justify-between"
            style={{ width: '794px', height: '1123px', minHeight: '1123px', maxHeight: '1123px', padding: '44px', boxSizing: 'border-box' }}
          >
            <div className="space-y-5">
              
              {/* Top Page 2 Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-xs font-black tracking-tight text-[#151521] uppercase">
                    Service Voucher Commercial Settlement & Terms
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    {itinerary.tourName} · Guest: {itinerary.clientName}
                  </p>
                </div>
                <div className="text-right font-mono text-xs font-bold text-[#26214F]">
                  Voucher: {voucherReference}
                </div>
              </div>

              {/* Payment & Financial Ledger Section */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                  Voucher Payment Settlement Ledger
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px] mb-0.5">Total Package Value</span>
                    <span className="font-black text-slate-900 text-xs">
                      {itinerary.currencySymbol}{itinerary.totalCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px] mb-0.5">Advance Received</span>
                    <span className="font-black text-emerald-700 text-xs">
                      {itinerary.currencySymbol}{itinerary.advancePaid.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-amber-200 bg-amber-50/50">
                    <span className="text-amber-800 block text-[10px] mb-0.5 font-semibold">Pending Amount Due</span>
                    <span className="font-black text-amber-950 text-xs">
                      {itinerary.currencySymbol}{itinerary.pendingAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] text-slate-500 block">Status: {itinerary.paymentStatus}</span>
                  </div>
                </div>
              </div>

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block text-[11px] mb-1 uppercase tracking-wider">
                    Services Included Under Voucher
                  </span>
                  <ul className="space-y-1 text-slate-600 text-[10px]">
                    {itinerary.inclusions.slice(0, 7).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block text-[11px] mb-1 uppercase tracking-wider">
                    Services Excluded
                  </span>
                  <ul className="space-y-1 text-slate-600 text-[10px]">
                    {itinerary.exclusions.slice(0, 6).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-rose-500 font-bold">✕</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Important Operating Instructions */}
              <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-300 text-xs text-amber-950 space-y-1 leading-relaxed">
                <span className="font-bold block text-[11px] uppercase tracking-wider">
                  Important Tour Instructions & Reconfirmation:
                </span>
                <p className="text-[10px] text-slate-700">
                  {settings.voucherTerms}
                </p>
              </div>

              {/* Chauffeur Guidelines */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[10px] text-slate-600 space-y-1">
                <span className="font-bold text-slate-900 text-[11px] block uppercase tracking-wider">
                  Chauffeur Duty & Fleet Service Guidelines:
                </span>
                <p>
                  1. The chauffeur will report at the scheduled time with an air-conditioned vehicle sanitized for your journey.
                </p>
                <p>
                  2. Chauffeur duty hours: 08:00 AM to 08:00 PM for all local sightseeing, except for scheduled early-morning airport transfers or sunrise visits.
                </p>
                <p>
                  3. Please carry original government-issued photo identity cards (Aadhaar, Passport, or Voter ID) for all guests for hotel check-ins.
                </p>
              </div>

              {/* Footer & Contacts */}
              <div className="pt-4 border-t-2 border-[#151521] text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 text-xs">{settings.companyName} Operations Desk</div>
                  <div className="font-mono text-[11px] font-bold text-[#26214F]">Voucher: {voucherReference}</div>
                </div>
                <div className="text-[10px] text-slate-500">
                  Chauffeur Helplines: {settings.phones.join(' | ')} · Email: {settings.email} · {settings.website}
                </div>
                <div className="text-[9px] text-slate-400">
                  {settings.address}
                </div>
              </div>

            </div>

            {/* Pinned Page 2 Footer */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#151521]">{settings.companyName}</span>
                <span>·</span>
                <span>{settings.phones[0]}</span>
              </div>
              <div className="font-mono">Voucher Ref: {voucherReference}</div>
              <div>Page 2 of 2</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
