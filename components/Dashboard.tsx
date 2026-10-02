'use client';

import React, { useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  FileCheck2, 
  IndianRupee, 
  Building2, 
  MapPin, 
  Settings, 
  Eye, 
  Edit3, 
  Copy, 
  Download, 
  Ticket, 
  Trash2, 
  ChevronRight,
  Filter,
  Calendar,
  Users,
  Car
} from 'lucide-react';
import { Itinerary, BookingStatus } from '@/types';
import { formatDateDMY } from '@/lib/utils';

interface DashboardProps {
  itineraries: Itinerary[];
  onNewItinerary: () => void;
  onViewItinerary: (id: string) => void;
  onEditItinerary: (id: string) => void;
  onDuplicateItinerary: (id: string) => void;
  onDeleteItinerary: (id: string) => void;
  onGenerateVoucher: (id: string) => void;
  onExportPdf: (itinerary: Itinerary) => void;
  onNavigateTab: (tab: string) => void;
}

export default function Dashboard({
  itineraries,
  onNewItinerary,
  onViewItinerary,
  onEditItinerary,
  onDuplicateItinerary,
  onDeleteItinerary,
  onGenerateVoucher,
  onExportPdf,
  onNavigateTab
}: DashboardProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Statistics calculation
  const totalCount = itineraries.length;
  const draftCount = itineraries.filter(i => i.status === 'Draft').length;
  const sentOrGenCount = itineraries.filter(i => i.status === 'Generated' || i.status === 'Sent').length;
  const confirmedCount = itineraries.filter(i => i.status === 'Confirmed').length;
  const cancelledCount = itineraries.filter(i => i.status === 'Cancelled').length;

  const totalTourValue = itineraries
    .filter(i => i.status !== 'Cancelled')
    .reduce((sum, item) => sum + (item.totalCost || 0), 0);

  // Filtered list
  const filteredItineraries = itineraries.filter(item => {
    const matchesStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();
    const cleanSearch = searchTerm.toLowerCase().trim();
    const matchesSearch = !cleanSearch ||
      item.referenceNumber.toLowerCase().includes(cleanSearch) ||
      item.clientName.toLowerCase().includes(cleanSearch) ||
      item.tourName.toLowerCase().includes(cleanSearch) ||
      item.clientPhone.toLowerCase().includes(cleanSearch);

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Confirmed
          </span>
        );
      case 'Draft':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            Draft
          </span>
        );
      case 'Generated':
      case 'Sent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
            <FileCheck2 className="w-3 h-3 text-blue-600" />
            {status}
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3 h-3 text-rose-600" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-[#151521] via-[#26214F] to-[#151521] rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-[#26214F] relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-medium mb-3 backdrop-blur-sm border border-white/10">
            <span>Official Lobo Travels Tour Platform</span>
            <span>·</span>
            <span>Mandir Marg, New Delhi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Itinerary & Fleet Operations
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-5">
            Handcraft high-converting multi-day client travel brochures, automatically compute transfers, coordinate contracted hotels, and generate instant operations vouchers.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNewItinerary}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs tracking-wide shadow-md transition transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              Create New Itinerary
            </button>
            <button
              onClick={() => {
                setStatusFilter('confirmed');
                const el = document.getElementById('itinerary-table-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/20 transition backdrop-blur-sm"
            >
              <Ticket className="w-4 h-4 text-amber-300" />
              Confirmed Bookings ({confirmedCount})
            </button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-8 opacity-10 pointer-events-none">
          <Car className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Top Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Tours</span>
            <FileCheck2 className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalCount}</p>
          <span className="text-[11px] text-slate-400">All registered records</span>
        </div>

        {/* Drafts */}
        <div 
          onClick={() => setStatusFilter('draft')}
          className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-sm hover:border-amber-400 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-medium">Drafts</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-900">{draftCount}</p>
          <span className="text-[11px] text-amber-600">In preparation</span>
        </div>

        {/* Sent / Generated */}
        <div 
          onClick={() => setStatusFilter('generated')}
          className="bg-white p-4 rounded-xl border border-blue-200/80 shadow-sm hover:border-blue-400 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-blue-700 mb-2">
            <span className="text-xs font-medium">Generated / Sent</span>
            <FileCheck2 className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-900">{sentOrGenCount}</p>
          <span className="text-[11px] text-blue-600">Client proposals</span>
        </div>

        {/* Confirmed */}
        <div 
          onClick={() => setStatusFilter('confirmed')}
          className="bg-white p-4 rounded-xl border border-emerald-200/80 shadow-sm hover:border-emerald-400 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-medium">Confirmed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-900">{confirmedCount}</p>
          <span className="text-[11px] text-emerald-600">Vouchers available</span>
        </div>

        {/* Cancelled */}
        <div 
          onClick={() => setStatusFilter('cancelled')}
          className="bg-white p-4 rounded-xl border border-rose-200/80 shadow-sm hover:border-rose-400 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-xs font-medium">Cancelled</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-rose-900">{cancelledCount}</p>
          <span className="text-[11px] text-rose-600">Void / Archived</span>
        </div>

        {/* Total Value */}
        <div className="bg-gradient-to-br from-[#151521] to-[#26214F] p-4 rounded-xl border border-[#26214F] text-white shadow-sm">
          <div className="flex items-center justify-between text-amber-300 mb-2">
            <span className="text-xs font-medium">Tour Value</span>
            <IndianRupee className="w-4 h-4 text-amber-300" />
          </div>
          <p className="text-xl font-extrabold text-white truncate">
            ₹{totalTourValue.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-300">Active portfolio</span>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Tour Management Shortcuts
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <button
            onClick={onNewItinerary}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center mb-2 transition">
              <PlusCircle className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-xs font-semibold text-slate-900 group-hover:text-amber-700">
              New Itinerary
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Step-by-step wizard</span>
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('itinerary-table-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center mb-2 transition">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-700">
              Search Itinerary
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">By Ref / Name</span>
          </button>

          <button
            onClick={() => {
              setStatusFilter('confirmed');
              const el = document.getElementById('itinerary-table-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center mb-2 transition">
              <Ticket className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700">
              Confirmed Tours
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Voucher issuance</span>
          </button>

          <button
            onClick={() => onNavigateTab('hotels')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center mb-2 transition">
              <Building2 className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-xs font-semibold text-slate-900 group-hover:text-indigo-700">
              Hotels Directory
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Google place import</span>
          </button>

          <button
            onClick={() => onNavigateTab('destinations')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-200 hover:border-purple-400 hover:shadow-md transition text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center mb-2 transition">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs font-semibold text-slate-900 group-hover:text-purple-700">
              Destinations
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Attractions catalog</span>
          </button>

          <button
            onClick={() => onNavigateTab('settings')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md transition text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center mb-2 transition">
              <Settings className="w-5 h-5 text-slate-700" />
            </div>
            <span className="text-xs font-semibold text-slate-900 group-hover:text-slate-800">
              Settings & Brand
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Prefix & Contacts</span>
          </button>
        </div>
      </div>

      {/* Recent Itineraries Section */}
      <div id="itinerary-table-section" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Table Header & Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Tour Itineraries</h2>
            <p className="text-xs text-slate-500">
              Manage client records, print brochures, and issue operational travel vouchers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter by ref, client, tour..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
              {[
                { id: 'all', label: 'All' },
                { id: 'confirmed', label: 'Confirmed' },
                { id: 'draft', label: 'Draft' },
                { id: 'generated', label: 'Generated' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-md transition ${
                    statusFilter === tab.id
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Content */}
        {filteredItineraries.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              No itineraries found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'No records match your search filter. Try clearing your query.'
                : 'No itineraries have been created yet. Build your first client itinerary now.'}
            </p>
            <button
              onClick={onNewItinerary}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#151521] text-white text-xs font-medium hover:bg-[#26214F] transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Create Itinerary
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Reference No.</th>
                  <th className="py-3 px-4">Tour Name</th>
                  <th className="py-3 px-4">Client Details</th>
                  <th className="py-3 px-4">Travel Dates</th>
                  <th className="py-3 px-4">Pax & Vehicle</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Tour Cost</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredItineraries.map((itn) => (
                  <tr key={itn.id} className="hover:bg-slate-50/70 transition">
                    
                    {/* Reference No */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      <button 
                        onClick={() => onViewItinerary(itn.id)}
                        className="hover:text-indigo-600 hover:underline"
                      >
                        {itn.referenceNumber}
                      </button>
                    </td>

                    {/* Tour Name */}
                    <td className="py-3 px-4 max-w-[200px]">
                      <div className="font-semibold text-slate-900 truncate" title={itn.tourName}>
                        {itn.tourName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {itn.days?.length || 0} Days Itinerary
                      </div>
                    </td>

                    {/* Client */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">{itn.clientName}</div>
                      <div className="text-[11px] text-slate-400">{itn.clientPhone}</div>
                    </td>

                    {/* Travel Dates */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {itn.datesNotConfirmed ? (
                        <span className="text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded text-[11px] border border-amber-200">
                          To Be Confirmed
                        </span>
                      ) : (
                        <div>
                          <div className="text-slate-900 font-medium">
                            {formatDateDMY(itn.startDate) || '—'}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {itn.durationText || `${itn.nights}N / ${itn.daysCount}D`}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Pax & Vehicle */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-medium text-slate-800">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{itn.paxSummary}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 truncate max-w-[160px]" title={itn.vehicleDisplay}>
                        <Car className="w-3 h-3 text-slate-400" />
                        <span>{itn.vehicleModel || itn.vehicleDisplay}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(itn.status)}
                    </td>

                    {/* Tour Cost */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">
                        ₹{(itn.totalCost || 0).toLocaleString('en-IN')}
                      </div>
                      {itn.advancePaid > 0 && (
                        <div className="text-[10px] text-emerald-600">
                          Adv: ₹{itn.advancePaid.toLocaleString('en-IN')}
                        </div>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        
                        {/* View / Preview */}
                        <button
                          onClick={() => onViewItinerary(itn.id)}
                          title="View Itinerary"
                          className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => onEditItinerary(itn.id)}
                          title="Edit Itinerary"
                          className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 hover:text-indigo-600 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Duplicate */}
                        <button
                          onClick={() => onDuplicateItinerary(itn.id)}
                          title="Duplicate Itinerary"
                          className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 hover:text-blue-600 transition"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Export PDF */}
                        <button
                          onClick={() => onExportPdf(itn)}
                          title="Export PDF Itinerary"
                          className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 hover:text-emerald-600 transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        {/* Travel Voucher (Active when confirmed, or can be generated) */}
                        <button
                          onClick={() => onGenerateVoucher(itn.id)}
                          title={itn.status === 'Confirmed' ? "View Travel Voucher" : "Generate Travel Voucher"}
                          className={`p-1.5 rounded-md transition ${
                            itn.status === 'Confirmed'
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              : 'hover:bg-slate-200 text-slate-600 hover:text-amber-700'
                          }`}
                        >
                          <Ticket className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteConfirmId(itn.id)}
                          title="Delete Record"
                          className="p-1.5 rounded-md hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">Delete Itinerary?</h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Are you sure you want to permanently delete this itinerary record? All custom day entries, hotels, and vehicle selections will be removed.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteItinerary(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
