'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  Calendar, 
  Users, 
  Car, 
  MapPin, 
  Building2, 
  Utensils, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  Save, 
  Eye, 
  X,
  IndianRupee,
  Compass,
  Clock,
  Info,
  Plane,
  Train,
  Edit3,
  RefreshCw,
  CheckCircle2,
  Phone,
  Mail,
  Image as ImageIcon,
  Upload,
  Search,
  Filter,
  SlidersHorizontal
} from 'lucide-react';
import { 
  Itinerary, 
  ItineraryDay, 
  Destination, 
  Attraction, 
  Hotel, 
  VehicleOption, 
  AppSettings,
  ChildInfo,
  CitySightseeing,
  DayArrivalDetails,
  DayDepartureDetails,
  InterCityTransitType,
  InterCityFlightDetails,
  InterCityTrainDetails,
  BookedFlightInfo,
  TourFlightsBooking
} from '@/types';
import { PRESET_ROUTES } from '@/lib/mock-data';
import { INTERCITY_ROUTES } from '@/lib/catalog-data';
import { saveAttraction as persistAttraction } from '@/lib/storage';

export const COVER_IMAGE_PRESETS = [
  { name: 'Taj Mahal (Agra)', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80' },
  { name: 'India Gate (Delhi)', image: 'https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Hawa Mahal (Jaipur)', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Amber Fort (Amer)', image: 'https://images.unsplash.com/photo-1600100397608-f010f44383a1?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Kerala Backwaters', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Varanasi Ghats', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Dal Lake (Kashmir)', image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Golden Temple (Amritsar)', image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Goa Coastal Beach', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Ladakh Snow Peaks', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80' }
];

interface ItineraryBuilderProps {
  initialItinerary?: Itinerary | null;
  destinations: Destination[];
  attractions: Attraction[];
  hotels: Hotel[];
  vehicles: VehicleOption[];
  settings: AppSettings;
  onSaveDraft: (itinerary: Itinerary) => void;
  onGeneratePreview: (itinerary: Itinerary) => void;
  onCancel: () => void;
  onAddNewHotelQuick: (hotel: Partial<Hotel>) => Hotel;
}

// Helper calculations
function computeDuration(startDate?: string, endDate?: string, datesNotConfirmed?: boolean) {
  if (datesNotConfirmed) return { durationText: 'Travel Dates: To Be Confirmed', nights: 0, daysCount: 1 };
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      return { nights: diffDays, daysCount: diffDays + 1, durationText: `${diffDays} Nights / ${diffDays + 1} Days` };
    }
  }
  return { durationText: '4 Nights / 5 Days', nights: 4, daysCount: 5 };
}

function computePax(adults: number, children: number, childrenDetails: ChildInfo[]) {
  const ad = adults || 1;
  const ch = children || 0;
  const total = ad + ch;
  let summary = `${ad} Adult${ad > 1 ? 's' : ''}`;
  if (ch > 0) {
    const ages = childrenDetails.map(c => `Age ${c.age}`).join(', ');
    summary += ` + ${ch} Child${ch > 1 ? 'ren' : ''}${ages ? ` (${ages})` : ''}`;
  }
  return { totalPax: total, paxSummary: summary };
}

function computePayment(totalCost: number, advancePaid: number) {
  const total = Number(totalCost) || 0;
  const advance = Number(advancePaid) || 0;
  const pending = Math.max(0, total - advance);
  let paymentStatus: any = 'Unpaid';
  if (advance >= total && total > 0) {
    paymentStatus = 'Paid';
  } else if (advance > 0 && advance < total) {
    paymentStatus = 'Partially Paid';
  }
  return { pendingAmount: pending, paymentStatus };
}

// Dynamic Day Sightseeing Narrative Generator
export function generateAutoDayDescription(day: ItineraryDay, dayIndex: number): string {
  // Meal summary helper
  const getMealsSentence = () => {
    const includedMeals: string[] = [];
    if (day.meals?.breakfast) includedMeals.push('breakfast');
    if (day.meals?.lunch) includedMeals.push('lunch');
    if (day.meals?.dinner) includedMeals.push('dinner');

    let text = '';
    if (includedMeals.length === 3) {
      text = 'All meals (breakfast, lunch, and dinner) are included for the day.';
    } else if (includedMeals.length === 2 && day.meals.breakfast && day.meals.dinner) {
      text = 'Breakfast and dinner are included for the day.';
    } else if (includedMeals.length > 0) {
      const mealNames = includedMeals.join(' and ');
      text = `Included meals: ${mealNames.charAt(0).toUpperCase() + mealNames.slice(1)}.`;
    }

    if (day.meals?.note && day.meals.note.trim()) {
      text = text ? `${text} (${day.meals.note.trim()})` : `Meals: ${day.meals.note.trim()}`;
    }
    return text;
  };

  // Multi-city sightseeing narrative
  if (day.isMultiCity && day.cities && day.cities.length > 0) {
    const parts: string[] = [];

    // Day 1 (or any day) arrival check
    if (day.arrivalDetails?.enabled) {
      const arr = day.arrivalDetails;
      const pointStr = arr.point === 'Airport' ? 'Airport' : arr.point === 'Railway Station' ? 'Railway Station' : arr.point;
      const flightStr = arr.flightOrTrainNumber ? ` (${arr.flightOrTrainNumber})` : '';
      const timeStr = arr.arrivalTime ? ` at ${arr.arrivalTime}` : '';
      const startCity = day.cities[0]?.destination || day.destination;
      parts.push(`Welcome to ${startCity}! Upon arrival at ${startCity} ${pointStr}${flightStr}${timeStr}, meet and greet with our representative and private chauffeur.`);
      
      if (arr.includeHotelCheckIn !== false) {
        if (arr.checkInTiming !== 'after_sightseeing') {
          parts.push(`Transfer directly to your hotel in ${startCity} for check-in and leisure time to freshen up before commencing the tour.`);
        }
      }
    }

    day.cities.forEach((city, idx) => {
      const isFirst = idx === 0;
      const isLast = idx === day.cities!.length - 1;
      const nextCity = day.cities![idx + 1]?.destination || city.driveToNext?.toCity;

      if (city.checkOut) {
        if (city.skipSightseeing && nextCity) {
          parts.push(`Morning check-out from hotel in ${city.destination} and proceed directly on your journey to ${nextCity}.`);
        } else {
          parts.push(`Morning check-out from hotel in ${city.destination}.`);
        }
      }

      // Only describe sightseeing if NOT skipping sightseeing in this city
      if (!city.skipSightseeing) {
        const sightsStr = city.attractionNames && city.attractionNames.length > 0
          ? city.attractionNames.join(', ')
          : '';

        if (sightsStr) {
          parts.push(`In ${city.destination}, proceed for sightseeing including ${sightsStr}.`);
        } else {
          parts.push(`Enjoy sightseeing and cultural highlights of ${city.destination}.`);
        }
      }

      // Inter-City Transit to next city: Car, Flight, or Train
      if (!isLast) {
        const transit = city.transitType || 'car';
        const targetNext = day.cities![idx + 1]?.destination || city.driveToNext?.toCity || (transit === 'flight' ? city.flightToNext?.arrivalCity : transit === 'train' ? city.trainToNext?.arrivalStation : 'the next destination');

        if (transit === 'flight' && city.flightToNext) {
          const fl = city.flightToNext;
          const airlineStr = fl.airline ? `${fl.airline} ` : '';
          const flightNumStr = fl.flightNumber ? `flight ${airlineStr}${fl.flightNumber}` : 'your domestic flight';
          const depTimeStr = fl.departureTime ? ` departing at ${fl.departureTime}` : '';
          const depPortStr = fl.departureAirport ? ` from ${fl.departureAirport}` : ` from ${city.destination}`;
          const arrPortStr = fl.arrivalAirport ? ` to ${fl.arrivalAirport} (${targetNext})` : ` to ${targetNext}`;
          const arrTimeStr = fl.arrivalTime ? `, arriving at ${fl.arrivalTime}` : '';
          parts.push(`Later, transfer to the airport to board ${flightNumStr}${depPortStr}${depTimeStr}${arrPortStr}${arrTimeStr}. Upon arrival, our representative will receive you.`);
        } else if (transit === 'train' && city.trainToNext) {
          const tr = city.trainToNext;
          const trainStr = tr.trainName || tr.trainNumber ? `the ${tr.trainName || ''} (${tr.trainNumber || ''})` : 'your express train';
          const depTimeStr = tr.departureTime ? ` departing at ${tr.departureTime}` : '';
          const depStationStr = tr.departureStation ? ` from ${tr.departureStation}` : ` from ${city.destination}`;
          const arrStationStr = tr.arrivalStation ? ` for ${tr.arrivalStation} (${targetNext})` : ` for ${targetNext}`;
          const arrTimeStr = tr.arrivalTime ? `, arriving at ${tr.arrivalTime}` : '';
          parts.push(`Later, transfer to the railway station to board ${trainStr}${depStationStr}${depTimeStr}${arrStationStr}${arrTimeStr}. Upon arrival, meet our chauffeur and proceed to your hotel.`);
        } else if (city.driveToNext) {
          const viaStr = city.driveToNext.routeVia ? ` via ${city.driveToNext.routeVia}` : '';
          // If not already said "proceed directly on your journey to nextCity"
          if (!city.checkOut || !city.skipSightseeing) {
            parts.push(`Later, embark on a comfortable highway drive to ${targetNext}${viaStr}.`);
          }
        }
      }

      if (city.checkIn) {
        parts.push(`Upon arrival in ${city.destination}, transfer and check-in at your designated hotel.`);
      }
    });

    if (day.arrivalDetails?.enabled && day.arrivalDetails.includeHotelCheckIn !== false && day.arrivalDetails.checkInTiming === 'after_sightseeing') {
      parts.push(`Following the day's tour and travel, transfer to your hotel for smooth check-in and relaxation.`);
    }

    // Departure logistics if configured on this day
    if (day.departureDetails?.enabled) {
      const dep = day.departureDetails;
      const pointStr = dep.point === 'Airport' ? 'Airport' : dep.point === 'Railway Station' ? 'Railway Station' : dep.point;
      const numStr = dep.flightOrTrainNumber ? ` (${dep.flightOrTrainNumber})` : '';
      const timeStr = dep.departureTime ? ` scheduled at ${dep.departureTime}` : '';
      const dropCity = day.overnightLocation || day.destination;
      parts.push(`Later, transfer to ${dropCity} ${pointStr}${numStr}${timeStr} for your onward journey home with fond travel memories.`);
    }

    const mealSentence = getMealsSentence();
    if (mealSentence) {
      parts.push(mealSentence);
    }

    if (day.overnightLocation && !day.departureDetails?.enabled) {
      parts.push(`Overnight stay at your designated hotel in ${day.overnightLocation}.`);
    }

    return parts.join(' ');
  }

  // Standard single destination day
  const parts: string[] = [];

  if (day.arrivalDetails?.enabled) {
    const arr = day.arrivalDetails;
    const pointStr = arr.point === 'Airport' ? 'Airport' : arr.point === 'Railway Station' ? 'Railway Station' : arr.point;
    const flightStr = arr.flightOrTrainNumber ? ` (${arr.flightOrTrainNumber})` : '';
    const timeStr = arr.arrivalTime ? ` at ${arr.arrivalTime}` : '';
    parts.push(`Welcome to ${day.destination}! Upon arrival at ${day.destination} ${pointStr}${flightStr}${timeStr}, meet and greet with our representative and private chauffeur.`);
    
    if (arr.includeHotelCheckIn !== false) {
      if (arr.checkInTiming !== 'after_sightseeing') {
        parts.push(`Transfer directly to your pre-booked hotel for check-in and leisure time to freshen up before commencing sightseeing.`);
      }
    }
  } else if (dayIndex > 0) {
    if (day.meals?.breakfast) {
      parts.push(`After a wholesome breakfast at your hotel,`);
    } else {
      parts.push(`In the morning,`);
    }
  }

  const sightsStr = day.attractionNames && day.attractionNames.length > 0
    ? day.attractionNames.join(', ')
    : '';

  if (sightsStr) {
    parts.push(`proceed for a comprehensive sightseeing tour of ${day.destination}, visiting prominent landmarks including ${sightsStr}.`);
  } else {
    parts.push(`proceed for a full-day sightseeing tour exploring the iconic architectural wonders, bazaars, and cultural sights of ${day.destination}.`);
  }

  if (day.arrivalDetails?.enabled && day.arrivalDetails.includeHotelCheckIn !== false && day.arrivalDetails.checkInTiming === 'after_sightseeing') {
    parts.push(`Following the sightseeing tour, transfer to your hotel for smooth check-in and relaxation.`);
  }

  // Highway transfer to overnight location without mentioning Kms or hours
  if (!day.isOvernightSameLocation && day.overnightLocation && day.overnightLocation.toLowerCase() !== day.destination.toLowerCase()) {
    parts.push(`Later in the afternoon, commence your comfortable highway drive to ${day.overnightLocation}. Upon arrival, check-in to your hotel.`);
  }

  // Departure logistics for single destination day (e.g. final day airport transfer)
  if (day.departureDetails?.enabled) {
    const dep = day.departureDetails;
    const pointStr = dep.point === 'Airport' ? 'Airport' : dep.point === 'Railway Station' ? 'Railway Station' : dep.point;
    const numStr = dep.flightOrTrainNumber ? ` (${dep.flightOrTrainNumber})` : '';
    const timeStr = dep.departureTime ? ` scheduled at ${dep.departureTime}` : '';
    parts.push(`Later, you will be transferred to ${day.destination} ${pointStr}${numStr}${timeStr} for your onward journey home with cherished memories.`);
  }

  const mealSentence = getMealsSentence();
  if (mealSentence) {
    parts.push(mealSentence);
  }

  if (!day.departureDetails?.enabled) {
    parts.push(`Overnight stay at your designated hotel in ${day.overnightLocation || day.destination}.`);
  }

  return parts.join(' ');
}

export default function ItineraryBuilder({
  initialItinerary,
  destinations,
  attractions: initialAttractions,
  hotels,
  vehicles,
  settings,
  onSaveDraft,
  onGeneratePreview,
  onCancel,
  onAddNewHotelQuick
}: ItineraryBuilderProps) {
  // Active Builder Step Tab
  const [activeStep, setActiveStep] = useState<number>(1);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [aiLoadingDayId, setAiLoadingDayId] = useState<string | null>(null);
  const [quickHotelModalDayId, setQuickHotelModalDayId] = useState<string | null>(null);

  // Local attractions list to support immediate updates when user edits an attraction
  const [localAttractions, setLocalAttractions] = useState<Attraction[]>(initialAttractions);

  // Edit Attraction Modal state
  const [editingAttraction, setEditingAttraction] = useState<Attraction | null>(null);
  const [isEditAttractionOpen, setIsEditAttractionOpen] = useState(false);

  // Quick hotel creation state
  const [quickHotelData, setQuickHotelData] = useState({
    name: '',
    city: '',
    starCategory: 4,
    roomCategory: 'Deluxe Room',
    mealPlan: 'Breakfast Included (CP)',
    address: ''
  });

  // State initialization
  const [itinerary, setItinerary] = useState<Itinerary>(() => {
    if (initialItinerary) {
      return JSON.parse(JSON.stringify(initialItinerary));
    }

    const defaultInclusions = settings.defaultInclusions || [];
    const defaultExclusions = settings.defaultExclusions || [];

    const defaultDay: ItineraryDay = {
      id: 'day-' + Date.now(),
      dayNumber: 1,
      title: 'Arrival & City Sightseeing',
      destination: 'Delhi',
      attractionIds: ['delhi-qutub', 'delhi-lotus'],
      attractionNames: ['Qutub Minar Complex', 'Lotus Temple (Baháʼí House of Worship)'],
      description: 'Welcome to Delhi! Upon arrival, meet and greet with our representative and private chauffeur. Transfer to hotel for check-in and freshen up. Later, proceed for a comprehensive sightseeing tour of Delhi, visiting prominent landmarks including Qutub Minar Complex, Lotus Temple. Overnight stay at your designated hotel in Delhi.',
      isOvernightSameLocation: true,
      overnightLocation: 'Delhi',
      arrivalDetails: {
        enabled: true,
        point: 'Airport',
        flightOrTrainNumber: 'IndiGo 6E-204',
        arrivalTime: '09:30 AM',
        includeHotelCheckIn: true,
        checkInTiming: 'before_sightseeing'
      },
      meals: {
        breakfast: false,
        lunch: false,
        dinner: false,
        note: ''
      },
      hotel: {
        name: 'The Lalit New Delhi',
        city: 'Delhi',
        roomCategory: 'Deluxe Room',
        mealPlan: 'Breakfast Included (CP)',
        starCategory: 5
      },
      images: []
    };

    return {
      id: 'itn-' + Date.now().toString(36),
      referenceNumber: `${settings.referencePrefix || 'LT-2026-'}0001`,
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
      days: [defaultDay],
      showCostInItinerary: true,
      costDisplayType: 'total_only',
      currency: 'INR',
      currencySymbol: '₹',
      totalCost: 45000,
      costBreakdown: {
        vehicle: 18000,
        accommodation: 22000,
        sightseeing: 3000,
        guide: 2000,
        transfers: 0,
        taxes: 0
      },
      advancePaid: 15000,
      pendingAmount: 30000,
      paymentStatus: 'Partially Paid',
      inclusions: defaultInclusions,
      exclusions: defaultExclusions,
      specialNotes: 'Early check-in is subject to hotel availability. Valid government-issued photo ID is mandatory for all guests during check-in.',
      coverImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });

  // Extract authentic sight photos chosen in the itinerary days for 1-click cover photo selection
  const tourAttractionPhotos = React.useMemo(() => {
    const list: { id: string; name: string; destinationName: string; image: string }[] = [];
    const seenUrls = new Set<string>();

    itinerary.days.forEach(d => {
      const attIds = [...(d.attractionIds || [])];
      if (d.isMultiCity && d.cities) {
        d.cities.forEach(c => {
          if (c.attractionIds) attIds.push(...c.attractionIds);
        });
      }
      attIds.forEach(id => {
        const att = localAttractions.find(a => a.id === id || a.name.toLowerCase() === id.toLowerCase());
        if (att && att.image && !seenUrls.has(att.image)) {
          seenUrls.add(att.image);
          list.push({
            id: att.id,
            name: att.name,
            destinationName: att.destinationName || d.destination,
            image: att.image
          });
        }
      });
    });

    return list.slice(0, 10);
  }, [itinerary.days, localAttractions]);

  // Catalog Cover Photo Search & Filter State
  const [coverPhotoSearchQuery, setCoverPhotoSearchQuery] = useState('');
  const [coverPhotoDestFilter, setCoverPhotoDestFilter] = useState('ALL');
  const [coverPhotoTypeFilter, setCoverPhotoTypeFilter] = useState<'ALL' | 'monument' | 'destination'>('ALL');
  const [isCoverPhotoModalOpen, setIsCoverPhotoModalOpen] = useState(false);
  const [visibleCatalogLimit, setVisibleCatalogLimit] = useState(12);

  // Combine all pre-loaded attractions/monuments and destination hero/gallery images into a searchable catalog
  const allCatalogPhotos = React.useMemo(() => {
    const items: {
      id: string;
      name: string;
      subtitle: string;
      type: 'monument' | 'destination';
      image: string;
      destinationName: string;
      unesco?: boolean;
    }[] = [];
    const seenUrls = new Set<string>();

    // 1. All authentic attractions and monuments
    localAttractions.forEach(att => {
      if (att.image && !seenUrls.has(att.image)) {
        seenUrls.add(att.image);
        items.push({
          id: att.id,
          name: att.name,
          subtitle: `${att.destinationName} · ${att.category || 'Sightseeing'}`,
          type: 'monument',
          image: att.image,
          destinationName: att.destinationName,
          unesco: att.unesco
        });
      }
    });

    // 2. All destination hero and gallery images
    destinations.forEach(dest => {
      if (dest.heroImage && !seenUrls.has(dest.heroImage)) {
        seenUrls.add(dest.heroImage);
        items.push({
          id: `dest-${dest.id}`,
          name: `${dest.name} Highlights`,
          subtitle: `${dest.state} · Destination Panorama`,
          type: 'destination',
          image: dest.heroImage,
          destinationName: dest.name
        });
      }
      if (dest.gallery && Array.isArray(dest.gallery)) {
        dest.gallery.forEach((gImg, gIdx) => {
          if (gImg && !seenUrls.has(gImg)) {
            seenUrls.add(gImg);
            items.push({
              id: `dest-gal-${dest.id}-${gIdx}`,
              name: `${dest.name} Scenic View ${gIdx + 1}`,
              subtitle: `${dest.state} · Gallery`,
              type: 'destination',
              image: gImg,
              destinationName: dest.name
            });
          }
        });
      }
    });

    return items;
  }, [localAttractions, destinations]);

  // Unique destinations list for the search filter dropdown
  const uniqueDestNames = React.useMemo(() => {
    const set = new Set<string>();
    allCatalogPhotos.forEach(p => {
      if (p.destinationName) set.add(p.destinationName);
    });
    return Array.from(set).sort();
  }, [allCatalogPhotos]);

  // Filtered photos based on query, destination, and type
  const filteredCatalogPhotos = React.useMemo(() => {
    const q = coverPhotoSearchQuery.trim().toLowerCase();
    return allCatalogPhotos.filter(item => {
      if (coverPhotoDestFilter !== 'ALL' && item.destinationName.toLowerCase() !== coverPhotoDestFilter.toLowerCase()) {
        return false;
      }
      if (coverPhotoTypeFilter !== 'ALL' && item.type !== coverPhotoTypeFilter) {
        return false;
      }
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.destinationName.toLowerCase().includes(q)
      );
    });
  }, [allCatalogPhotos, coverPhotoSearchQuery, coverPhotoDestFilter, coverPhotoTypeFilter]);

  // Travel dates handlers
  const handleDatesNotConfirmedChange = (checked: boolean) => {
    const duration = computeDuration(itinerary.startDate, itinerary.endDate, checked);
    setItinerary(prev => ({
      ...prev,
      datesNotConfirmed: checked,
      ...duration
    }));
  };

  const handleStartDateChange = (val: string) => {
    const duration = computeDuration(val, itinerary.endDate, itinerary.datesNotConfirmed);
    setItinerary(prev => ({
      ...prev,
      startDate: val,
      ...duration
    }));
  };

  const handleEndDateChange = (val: string) => {
    const duration = computeDuration(itinerary.startDate, val, itinerary.datesNotConfirmed);
    setItinerary(prev => ({
      ...prev,
      endDate: val,
      ...duration
    }));
  };

  const handleAdultsChange = (val: number) => {
    const pax = computePax(val, itinerary.children, itinerary.childrenDetails);
    setItinerary(prev => ({
      ...prev,
      adults: val,
      ...pax
    }));
  };

  const handleTotalCostChange = (val: number) => {
    const payment = computePayment(val, itinerary.advancePaid);
    setItinerary(prev => ({
      ...prev,
      totalCost: val,
      ...payment
    }));
  };

  const handleAdvancePaidChange = (val: number) => {
    const payment = computePayment(itinerary.totalCost, val);
    setItinerary(prev => ({
      ...prev,
      advancePaid: val,
      ...payment
    }));
  };

  // Vehicle change handler
  const handleVehicleChange = (brand: string, model: string, category: string, custom?: string) => {
    const display = brand === 'Other' && custom ? custom : `${brand} ${model} – Private Air-Conditioned ${category}`;
    setItinerary(prev => ({
      ...prev,
      vehicleBrand: brand,
      vehicleModel: model,
      vehicleCategory: category,
      customVehicle: custom,
      vehicleDisplay: display
    }));
  };

  // Passenger children ages management
  const handleChildrenCountChange = (count: number) => {
    const currentDetails = [...itinerary.childrenDetails];
    if (count > currentDetails.length) {
      for (let i = currentDetails.length; i < count; i++) {
        currentDetails.push({ id: `c-${i + 1}`, age: 8 });
      }
    } else if (count < currentDetails.length) {
      currentDetails.splice(count);
    }
    const pax = computePax(itinerary.adults, count, currentDetails);
    setItinerary(prev => ({
      ...prev,
      children: count,
      childrenDetails: currentDetails,
      ...pax
    }));
  };

  const updateChildAge = (index: number, age: number) => {
    const updated = [...itinerary.childrenDetails];
    if (updated[index]) {
      updated[index].age = age;
      const pax = computePax(itinerary.adults, itinerary.children, updated);
      setItinerary(prev => ({
        ...prev,
        childrenDetails: updated,
        ...pax
      }));
    }
  };

  // Day Operations
  const handleAddDay = () => {
    const nextDayNum = itinerary.days.length + 1;
    const lastDay = itinerary.days[itinerary.days.length - 1];
    const defaultDest = lastDay ? lastDay.overnightLocation || lastDay.destination : 'Delhi';

    const newDay: ItineraryDay = {
      id: 'day-' + Date.now() + '-' + nextDayNum,
      dayNumber: nextDayNum,
      title: `Day ${nextDayNum} Sightseeing`,
      destination: defaultDest,
      attractionIds: [],
      attractionNames: [],
      description: '',
      isOvernightSameLocation: true,
      overnightLocation: defaultDest,
      meals: { breakfast: false, lunch: false, dinner: false, note: '' },
      images: []
    };
    newDay.description = generateAutoDayDescription(newDay, nextDayNum - 1);

    const updatedDays = [...itinerary.days, newDay];
    setItinerary(prev => ({
      ...prev,
      days: updatedDays,
      daysCount: updatedDays.length,
      durationText: `${updatedDays.length - 1} Nights / ${updatedDays.length} Days`
    }));
  };

  // Add Day directly after a specific Day
  const handleAddDayAfter = (afterIndex: number) => {
    const prevDay = itinerary.days[afterIndex];
    const defaultDest = prevDay ? (prevDay.overnightLocation || prevDay.destination) : 'Delhi';
    const nextDayNum = afterIndex + 2;

    const newDay: ItineraryDay = {
      id: 'day-' + Date.now() + '-' + nextDayNum,
      dayNumber: nextDayNum,
      title: `Day ${nextDayNum} Sightseeing`,
      destination: defaultDest,
      attractionIds: [],
      attractionNames: [],
      description: '',
      isOvernightSameLocation: true,
      overnightLocation: defaultDest,
      meals: { breakfast: false, lunch: false, dinner: false, note: '' },
      images: []
    };
    newDay.description = generateAutoDayDescription(newDay, afterIndex + 1);

    const newDays = [...itinerary.days];
    newDays.splice(afterIndex + 1, 0, newDay);
    newDays.forEach((d, idx) => {
      d.dayNumber = idx + 1;
    });

    setItinerary(prev => ({
      ...prev,
      days: newDays,
      daysCount: newDays.length,
      durationText: `${newDays.length - 1} Nights / ${newDays.length} Days`
    }));
  };

  const handleDuplicateDay = (index: number) => {
    const target = itinerary.days[index];
    if (!target) return;
    const newDay: ItineraryDay = {
      ...JSON.parse(JSON.stringify(target)),
      id: 'day-' + Date.now(),
      dayNumber: itinerary.days.length + 1,
      title: `${target.title} (Continued)`
    };

    const newDays = [...itinerary.days];
    newDays.splice(index + 1, 0, newDay);
    newDays.forEach((d, idx) => {
      d.dayNumber = idx + 1;
    });

    setItinerary(prev => ({ ...prev, days: newDays, daysCount: newDays.length }));
  };

  const handleDeleteDay = (index: number) => {
    if (itinerary.days.length <= 1) {
      alert('An itinerary must contain at least one day.');
      return;
    }
    const updated = itinerary.days.filter((_, idx) => idx !== index);
    updated.forEach((d, idx) => {
      d.dayNumber = idx + 1;
    });
    setItinerary(prev => ({ ...prev, days: updated, daysCount: updated.length }));
  };

  const handleMoveDay = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= itinerary.days.length) return;

    const updated = [...itinerary.days];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    updated.forEach((d, idx) => {
      d.dayNumber = idx + 1;
    });

    setItinerary(prev => ({ ...prev, days: updated }));
  };

  // Update field in a day
  const handleUpdateDayField = (dayIndex: number, field: keyof ItineraryDay, value: any) => {
    const updatedDays = [...itinerary.days];
    const targetDay = { ...updatedDays[dayIndex], [field]: value };

    // Automatic Transfer Calculation when overnight location differs
    if (field === 'isOvernightSameLocation' || field === 'destination' || field === 'overnightLocation') {
      let dest = targetDay.destination;
      let overLoc = targetDay.overnightLocation;
      let isSame = targetDay.isOvernightSameLocation;

      if (field === 'destination') {
        dest = value;
        targetDay.destination = value;
        if (targetDay.isOvernightSameLocation) {
          overLoc = value;
          targetDay.overnightLocation = value;
        }
      } else if (field === 'isOvernightSameLocation') {
        isSame = value;
        targetDay.isOvernightSameLocation = value;
        if (value) {
          overLoc = targetDay.destination;
          targetDay.overnightLocation = targetDay.destination;
        }
      } else if (field === 'overnightLocation') {
        overLoc = value;
        targetDay.overnightLocation = value;
        targetDay.isOvernightSameLocation = (value.toLowerCase() === targetDay.destination.toLowerCase());
        isSame = targetDay.isOvernightSameLocation;

        // Auto update hotel if overnight city changes and current hotel is in a different city
        if (targetDay.hotel && targetDay.hotel.city && targetDay.hotel.city.toLowerCase() !== value.toLowerCase()) {
          const matchingH = hotels.find(h => h.city.toLowerCase() === value.toLowerCase());
          if (matchingH) {
            targetDay.hotel = {
              hotelId: matchingH.id,
              name: matchingH.name,
              city: matchingH.city,
              roomCategory: matchingH.roomCategories[0] || 'Deluxe Room',
              mealPlan: matchingH.mealPlans[0] || 'Breakfast Included (CP)',
              starCategory: matchingH.starCategory
            };
          }
        }
      }

      if (!isSame && dest && overLoc && dest.toLowerCase() !== overLoc.toLowerCase()) {
        const routeKey = `${dest.toLowerCase()}-${overLoc.toLowerCase()}`.replace(/\s+/g, '-');
        const reverseKey = `${overLoc.toLowerCase()}-${dest.toLowerCase()}`.replace(/\s+/g, '-');
        const routeData = INTERCITY_ROUTES[routeKey] || INTERCITY_ROUTES[reverseKey] || PRESET_ROUTES[routeKey] || PRESET_ROUTES[reverseKey];

        targetDay.transfer = {
          from: dest,
          to: overLoc,
          distanceKm: routeData ? routeData.distanceKm : 220,
          driveTime: routeData ? routeData.driveTime : '4–5 Hours',
          description: `After sightseeing in ${dest}, embark on your drive to ${overLoc} for overnight stay.`
        };
      } else {
        targetDay.transfer = undefined;
      }

      // Automatically update the sightseeing description when destination or overnight changes!
      targetDay.description = generateAutoDayDescription(targetDay, dayIndex);
    }

    // Automatically update the sightseeing description when meal selections change!
    if (field === 'meals') {
      targetDay.description = generateAutoDayDescription(targetDay, dayIndex);
    }

    updatedDays[dayIndex] = targetDay;
    setItinerary(prev => ({ ...prev, days: updatedDays }));
  };

  // Day 1 Arrival details toggle & update
  const handleUpdateArrivalDetails = (dayIndex: number, partialArrival: Partial<DayArrivalDetails>) => {
    const updatedDays = [...itinerary.days];
    const targetDay = { ...updatedDays[dayIndex] };
    const currentArrival = targetDay.arrivalDetails || {
      enabled: true,
      point: 'Airport',
      flightOrTrainNumber: '',
      arrivalTime: '',
      includeHotelCheckIn: true,
      checkInTiming: 'before_sightseeing'
    };

    targetDay.arrivalDetails = { ...currentArrival, ...partialArrival };
    targetDay.description = generateAutoDayDescription(targetDay, dayIndex);

    updatedDays[dayIndex] = targetDay;
    setItinerary(prev => ({ ...prev, days: updatedDays }));
  };

  // Final Day / Any Day Departure details toggle & update
  const handleUpdateDepartureDetails = (dayIndex: number, partialDeparture: Partial<DayDepartureDetails>) => {
    const updatedDays = [...itinerary.days];
    const targetDay = { ...updatedDays[dayIndex] };
    const currentDeparture = targetDay.departureDetails || {
      enabled: true,
      point: 'Airport',
      flightOrTrainNumber: '',
      departureTime: '',
      dropLocation: ''
    };

    targetDay.departureDetails = { ...currentDeparture, ...partialDeparture };
    targetDay.description = generateAutoDayDescription(targetDay, dayIndex);

    updatedDays[dayIndex] = targetDay;
    setItinerary(prev => ({ ...prev, days: updatedDays }));
  };

  // Tour-level Flights Booking Handlers
  const handleToggleFlightsBookedByUs = (enabled: boolean) => {
    setItinerary(prev => {
      const current = prev.flightBookings || {
        flightsBookedByUs: false,
        flights: []
      };

      let flights = [...(current.flights || [])];
      if (enabled && flights.length === 0) {
        const firstCity = prev.days[0]?.destination || 'Delhi';
        const lastCity = prev.days[prev.days.length - 1]?.destination || 'Delhi';
        flights = [
          {
            id: 'fl-' + Date.now() + '-1',
            type: 'arrival',
            sectorTitle: `Inbound / Arrival Flight (to ${firstCity})`,
            airline: 'IndiGo',
            flightNumber: '6E-204',
            departureCity: 'Mumbai (BOM)',
            departureDate: prev.startDate || '',
            departureTime: '07:15 AM',
            arrivalCity: `${firstCity} (Airport)`,
            arrivalDate: prev.startDate || '',
            arrivalTime: '09:30 AM',
            pnr: '6E-DIR204',
            cabinClass: 'Economy',
            baggage: '15 Kg Check-in + 7 Kg Cabin',
            notes: 'Confirmed e-ticket'
          },
          {
            id: 'fl-' + Date.now() + '-2',
            type: 'departure',
            sectorTitle: `Outbound / Return Flight (from ${lastCity})`,
            airline: 'Air India',
            flightNumber: 'AI-402',
            departureCity: `${lastCity} (Airport)`,
            departureDate: prev.endDate || '',
            departureTime: '18:45 PM',
            arrivalCity: 'Mumbai (BOM)',
            arrivalDate: prev.endDate || '',
            arrivalTime: '20:55 PM',
            pnr: 'AI-DIR402',
            cabinClass: 'Economy',
            baggage: '15 Kg Check-in + 7 Kg Cabin',
            notes: 'Confirmed e-ticket'
          }
        ];
      }

      return {
        ...prev,
        flightBookings: {
          ...current,
          flightsBookedByUs: enabled,
          flights
        }
      };
    });
  };

  const handleUpdateFlightSector = (flightId: string, field: keyof BookedFlightInfo, value: any) => {
    setItinerary(prev => {
      if (!prev.flightBookings) return prev;
      const updatedFlights = prev.flightBookings.flights.map(fl => {
        if (fl.id === flightId) {
          return { ...fl, [field]: value };
        }
        return fl;
      });
      return {
        ...prev,
        flightBookings: {
          ...prev.flightBookings,
          flights: updatedFlights
        }
      };
    });
  };

  const handleAddFlightSector = () => {
    setItinerary(prev => {
      const current = prev.flightBookings || {
        flightsBookedByUs: true,
        flights: []
      };
      const newSector: BookedFlightInfo = {
        id: 'fl-' + Date.now(),
        type: 'intercity',
        sectorTitle: 'Domestic / Internal Flight Sector',
        airline: 'IndiGo',
        flightNumber: '',
        departureCity: '',
        departureTime: '',
        arrivalCity: '',
        arrivalTime: '',
        pnr: '',
        cabinClass: 'Economy',
        baggage: '15 Kg Check-in + 7 Kg Cabin'
      };
      return {
        ...prev,
        flightBookings: {
          ...current,
          flightsBookedByUs: true,
          flights: [...current.flights, newSector]
        }
      };
    });
  };

  const handleRemoveFlightSector = (flightId: string) => {
    setItinerary(prev => {
      if (!prev.flightBookings) return prev;
      return {
        ...prev,
        flightBookings: {
          ...prev.flightBookings,
          flights: prev.flightBookings.flights.filter(fl => fl.id !== flightId)
        }
      };
    });
  };

  // One-click sync flight arrival & departure to Day 1 and Final Day
  const handleSyncFlightsToDays = () => {
    if (!itinerary.flightBookings?.flights || itinerary.flightBookings.flights.length === 0) return;
    const arrFlight = itinerary.flightBookings.flights.find(f => f.type === 'arrival');
    const depFlight = itinerary.flightBookings.flights.find(f => f.type === 'departure');

    const updatedDays = [...itinerary.days];
    if (arrFlight && updatedDays.length > 0) {
      const day1 = { ...updatedDays[0] };
      day1.arrivalDetails = {
        enabled: true,
        point: 'Airport',
        flightOrTrainNumber: `${arrFlight.airline} ${arrFlight.flightNumber}`.trim(),
        arrivalTime: arrFlight.arrivalTime,
        pickupLocation: arrFlight.arrivalCity,
        includeHotelCheckIn: day1.arrivalDetails?.includeHotelCheckIn ?? true,
        checkInTiming: day1.arrivalDetails?.checkInTiming || 'before_sightseeing'
      };
      day1.description = generateAutoDayDescription(day1, 0);
      updatedDays[0] = day1;
    }

    if (depFlight && updatedDays.length > 0) {
      const lastIdx = updatedDays.length - 1;
      const lastDay = { ...updatedDays[lastIdx] };
      lastDay.departureDetails = {
        enabled: true,
        point: 'Airport',
        flightOrTrainNumber: `${depFlight.airline} ${depFlight.flightNumber}`.trim(),
        departureTime: depFlight.departureTime,
        dropLocation: depFlight.departureCity
      };
      lastDay.description = generateAutoDayDescription(lastDay, lastIdx);
      updatedDays[lastIdx] = lastDay;
    }

    setItinerary(prev => ({ ...prev, days: updatedDays }));
  };

  // Toggle Attraction selection in Day
  const handleToggleAttractionInDay = (dayIndex: number, attraction: Attraction) => {
    const day = itinerary.days[dayIndex];
    const exists = day.attractionIds.includes(attraction.id);

    let updatedIds: string[];
    let updatedNames: string[];
    let updatedImages = [...day.images];

    if (exists) {
      updatedIds = day.attractionIds.filter(id => id !== attraction.id);
      updatedNames = day.attractionNames.filter(name => name !== attraction.name);
      if (attraction.image) {
        updatedImages = updatedImages.filter(img => img !== attraction.image);
      }
    } else {
      updatedIds = [...day.attractionIds, attraction.id];
      updatedNames = [...day.attractionNames, attraction.name];
      if (attraction.image && !updatedImages.includes(attraction.image)) {
        updatedImages.push(attraction.image);
      }
    }

    const updatedDays = [...itinerary.days];
    const updatedDay: ItineraryDay = {
      ...day,
      attractionIds: updatedIds,
      attractionNames: updatedNames,
      images: updatedImages
    };

    // Auto-update description with the selected attractions
    updatedDay.description = generateAutoDayDescription(updatedDay, dayIndex);

    updatedDays[dayIndex] = updatedDay;
    setItinerary(prev => ({ ...prev, days: updatedDays }));
  };

  // Multi-City Management in Day
  const handleToggleMultiCity = (dayIndex: number, enabled: boolean) => {
    const updatedDays = [...itinerary.days];
    const targetDay = { ...updatedDays[dayIndex] };
    targetDay.isMultiCity = enabled;

    if (enabled) {
      if (!targetDay.cities || targetDay.cities.length === 0) {
        const city1Name = targetDay.destination || 'Agra';
        const city2Name = targetDay.overnightLocation !== city1Name ? targetDay.overnightLocation : 'Fatehpur Sikri';
        
        const routeKey = `${city1Name.toLowerCase()}-${city2Name.toLowerCase()}`.replace(/\s+/g, '-');
        const routeData = INTERCITY_ROUTES[routeKey] || { distanceKm: 40, driveTime: '1 Hour', routeVia: 'Highway' };

        targetDay.cities = [
          {
            id: 'c-' + Date.now() + '-1',
            destination: city1Name,
            attractionIds: [...targetDay.attractionIds],
            attractionNames: [...targetDay.attractionNames],
            checkOut: true,
            checkIn: false,
            driveToNext: {
              toCity: city2Name,
              distanceKm: routeData.distanceKm,
              driveTime: routeData.driveTime,
              routeVia: routeData.routeVia
            }
          },
          {
            id: 'c-' + Date.now() + '-2',
            destination: city2Name,
            attractionIds: [],
            attractionNames: [],
            checkOut: false,
            checkIn: true
          }
        ];
        targetDay.overnightLocation = city2Name;
      }
    }

    targetDay.description = generateAutoDayDescription(targetDay, dayIndex);
    updatedDays[dayIndex] = targetDay;
    setItinerary(prev => ({ ...prev, days: updatedDays }));
  };

  const handleAddCityToDay = (dayIndex: number) => {
    const updatedDays = [...itinerary.days];
    const targetDay = { ...updatedDays[dayIndex] };
    const currentCities = [...(targetDay.cities || [])];
    const lastCity = currentCities[currentCities.length - 1];
    const newCityName = destinations.find(d => !currentCities.some(c => c.destination.toLowerCase() === d.name.toLowerCase()))?.name || 'Jaipur';

    if (lastCity) {
      const routeKey = `${lastCity.destination.toLowerCase()}-${newCityName.toLowerCase()}`.replace(/\s+/g, '-');
      const routeData = INTERCITY_ROUTES[routeKey] || { distanceKm: 180, driveTime: '3.5 Hours' };
      lastCity.driveToNext = {
        toCity: newCityName,
        distanceKm: routeData.distanceKm,
        driveTime: routeData.driveTime,
        routeVia: routeData.routeVia
      };
    }

    currentCities.push({
      id: 'c-' + Date.now(),
      destination: newCityName,
      attractionIds: [],
      attractionNames: [],
      checkOut: false,
      checkIn: true
    });

    targetDay.cities = currentCities;
    targetDay.overnightLocation = newCityName;
    targetDay.description = generateAutoDayDescription(targetDay, dayIndex);

    updatedDays[dayIndex] = targetDay;
    setItinerary(prev => ({ ...prev, days: updatedDays }));
  };

  const handleUpdateCityInDay = (dayIndex: number, cityIndex: number, field: keyof CitySightseeing, value: any) => {
    const updatedDays = [...itinerary.days];
    const targetDay = { ...updatedDays[dayIndex] };
    const currentCities = [...(targetDay.cities || [])];
    const targetCity = { ...currentCities[cityIndex], [field]: value };

    if (field === 'destination') {
      // Recalculate route if destination changed
      if (cityIndex > 0 && currentCities[cityIndex - 1]?.driveToNext) {
        const prevCity = currentCities[cityIndex - 1];
        const routeKey = `${prevCity.destination.toLowerCase()}-${value.toLowerCase()}`.replace(/\s+/g, '-');
        const routeData = INTERCITY_ROUTES[routeKey] || { distanceKm: 120, driveTime: '2.5 Hours' };
        prevCity.driveToNext = {
          toCity: value,
          distanceKm: routeData.distanceKm,
          driveTime: routeData.driveTime,
          routeVia: routeData.routeVia
        };
      }
      if (targetCity.driveToNext && currentCities[cityIndex + 1]) {
        const nextCity = currentCities[cityIndex + 1];
        const routeKey = `${value.toLowerCase()}-${nextCity.destination.toLowerCase()}`.replace(/\s+/g, '-');
        const routeData = INTERCITY_ROUTES[routeKey] || { distanceKm: 150, driveTime: '3 Hours' };
        targetCity.driveToNext = {
          toCity: nextCity.destination,
          distanceKm: routeData.distanceKm,
          driveTime: routeData.driveTime,
          routeVia: routeData.routeVia
        };
      }
    }

    currentCities[cityIndex] = targetCity;
    targetDay.cities = currentCities;

    // Collect all attraction names & images across cities
    const allAttractionNames: string[] = [];
    const allImages: string[] = [];
    currentCities.forEach(c => {
      if (c.attractionNames) allAttractionNames.push(...c.attractionNames);
    });
    targetDay.attractionNames = allAttractionNames;

    targetDay.description = generateAutoDayDescription(targetDay, dayIndex);
    updatedDays[dayIndex] = targetDay;
    setItinerary(prev => ({ ...prev, days: updatedDays }));
  };

  const handleToggleCityAttraction = (dayIndex: number, cityIndex: number, attraction: Attraction) => {
    const updatedDays = [...itinerary.days];
    const targetDay = { ...updatedDays[dayIndex] };
    const currentCities = [...(targetDay.cities || [])];
    const targetCity = { ...currentCities[cityIndex] };

    const exists = targetCity.attractionIds.includes(attraction.id);
    if (exists) {
      targetCity.attractionIds = targetCity.attractionIds.filter(id => id !== attraction.id);
      targetCity.attractionNames = targetCity.attractionNames.filter(name => name !== attraction.name);
    } else {
      targetCity.attractionIds = [...targetCity.attractionIds, attraction.id];
      targetCity.attractionNames = [...targetCity.attractionNames, attraction.name];
    }

    currentCities[cityIndex] = targetCity;
    targetDay.cities = currentCities;

    // Collect all attraction names & images
    const allAttractionNames: string[] = [];
    const allImages: string[] = [];
    currentCities.forEach(c => {
      if (c.attractionNames) allAttractionNames.push(...c.attractionNames);
      c.attractionIds.forEach(id => {
        const att = localAttractions.find(a => a.id === id);
        if (att?.image && !allImages.includes(att.image)) allImages.push(att.image);
      });
    });
    targetDay.attractionNames = allAttractionNames;
    targetDay.images = allImages.length > 0 ? allImages : targetDay.images;

    targetDay.description = generateAutoDayDescription(targetDay, dayIndex);
    updatedDays[dayIndex] = targetDay;
    setItinerary(prev => ({ ...prev, days: updatedDays }));
  };

  const handleRemoveCityFromDay = (dayIndex: number, cityIndex: number) => {
    const updatedDays = [...itinerary.days];
    const targetDay = { ...updatedDays[dayIndex] };
    const currentCities = [...(targetDay.cities || [])];

    if (currentCities.length <= 1) {
      handleToggleMultiCity(dayIndex, false);
      return;
    }

    currentCities.splice(cityIndex, 1);
    // Link drives if needed
    if (cityIndex > 0 && currentCities[cityIndex]) {
      const prev = currentCities[cityIndex - 1];
      const next = currentCities[cityIndex];
      const routeKey = `${prev.destination.toLowerCase()}-${next.destination.toLowerCase()}`.replace(/\s+/g, '-');
      const routeData = INTERCITY_ROUTES[routeKey] || { distanceKm: 150, driveTime: '3 Hours' };
      prev.driveToNext = {
        toCity: next.destination,
        distanceKm: routeData.distanceKm,
        driveTime: routeData.driveTime,
        routeVia: routeData.routeVia
      };
    } else if (currentCities.length > 0) {
      delete currentCities[currentCities.length - 1].driveToNext;
    }

    targetDay.cities = currentCities;
    targetDay.overnightLocation = currentCities[currentCities.length - 1].destination;
    targetDay.description = generateAutoDayDescription(targetDay, dayIndex);

    updatedDays[dayIndex] = targetDay;
    setItinerary(prev => ({ ...prev, days: updatedDays }));
  };

  // Attraction Edit modal handler
  const handleOpenEditAttraction = (attraction: Attraction, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAttraction({ ...attraction });
    setIsEditAttractionOpen(true);
  };

  const handleSaveEditedAttraction = () => {
    if (!editingAttraction || !editingAttraction.name) return;

    persistAttraction(editingAttraction);

    // Update local attractions
    setLocalAttractions(prev => {
      const idx = prev.findIndex(a => a.id === editingAttraction.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = editingAttraction;
        return copy;
      }
      return [editingAttraction, ...prev];
    });

    setIsEditAttractionOpen(false);
    setEditingAttraction(null);
  };

  // AI Generator for Day Description
  const handleGenerateDayAi = async (dayIndex: number, style: string = 'professional') => {
    const day = itinerary.days[dayIndex];
    setAiLoadingDayId(day.id);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'day-description',
          destination: day.destination,
          attractions: day.attractionNames,
          style
        })
      });
      const data = await res.json();
      if (data.result) {
        handleUpdateDayField(dayIndex, 'description', data.result);
      }
    } catch (e) {
      console.error('AI generation error', e);
    } finally {
      setAiLoadingDayId(null);
    }
  };

  // Validate Step 1 Before Proceeding
  const validateAndProceed = (nextStep: number) => {
    setValidationError(null);
    if (activeStep === 1) {
      if (!itinerary.tourName.trim()) {
        setValidationError('Tour Proposal Name is required.');
        return;
      }
      if (!itinerary.clientName.trim()) {
        setValidationError('Lead Guest Name is required.');
        return;
      }
      if (!itinerary.clientPhone.trim()) {
        setValidationError('Guest WhatsApp / Mobile Phone is required.');
        return;
      }
    }
    setActiveStep(nextStep);
  };

  // Helper to ensure itinerary has a smart, authentic cover image matching its destinations and sights
  const prepareItineraryForOutput = (itn: Itinerary): Itinerary => {
    const copy: Itinerary = { ...itn };
    const DEFAULT_TAJ_MAHAL = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80';
    
    // Only auto-fill if user has left coverImage empty
    if (!copy.coverImage || !copy.coverImage.trim()) {
      let smartImg = '';
      for (const d of copy.days) {
        const attIds = [...(d.attractionIds || [])];
        if (d.isMultiCity && d.cities) {
          d.cities.forEach(c => {
            if (c.attractionIds) attIds.push(...c.attractionIds);
          });
        }
        for (const attId of attIds) {
          const match = localAttractions.find(a => a.id === attId || a.name.toLowerCase() === attId.toLowerCase());
          if (match?.image) {
            smartImg = match.image;
            break;
          }
        }
        if (smartImg) break;
      }

      // If none, check starting destination hero
      if (!smartImg) {
        const firstDest = copy.days[0]?.destination || (copy.days[0]?.cities && copy.days[0].cities[0]?.destination);
        if (firstDest) {
          const dest = destinations.find(d => d.name.toLowerCase() === firstDest.toLowerCase() || d.id.toLowerCase() === firstDest.toLowerCase());
          if (dest?.heroImage) {
            smartImg = dest.heroImage;
          }
        }
      }

      copy.coverImage = smartImg || DEFAULT_TAJ_MAHAL;
    }
    return copy;
  };

  const availableModels = vehicles.find(v => v.brand === itinerary.vehicleBrand)?.models || [];

  return (
    <div className="space-y-6 pb-20">
      
      {/* Builder Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {itinerary.referenceNumber}
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-semibold text-slate-600">
              {itinerary.durationText}
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {itinerary.tourName || 'New Itinerary'}
          </h1>
        </div>

        {/* Global Save Actions */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSaveDraft(prepareItineraryForOutput(itinerary))}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>
          <button
            type="button"
            onClick={() => onGeneratePreview(prepareItineraryForOutput(itinerary))}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-sm transition active:scale-95"
          >
            <Eye className="w-3.5 h-3.5 text-slate-950" />
            <span>Generate & Preview Proposal</span>
          </button>
        </div>
      </div>

      {/* Wizard Progress Tabs */}
      <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs flex overflow-x-auto text-xs font-semibold">
        {[
          { num: 1, label: '1. Client & Dates' },
          { num: 2, label: '2. Pax, Vehicle & Flights' },
          { num: 3, label: '3. Day-by-Day Tour' },
          { num: 4, label: '4. Inclusions & Notes' },
          { num: 5, label: '5. Cover Image & Pricing' }
        ].map((tab) => (
          <button
            key={tab.num}
            onClick={() => validateAndProceed(tab.num)}
            className={`flex-1 min-w-[140px] py-2 px-3 rounded-lg transition text-center whitespace-nowrap ${
              activeStep === tab.num
                ? 'bg-[#151521] text-amber-300 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {validationError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 1: Client Coordinates & Travel Dates */}
      {/* ========================================================================= */}
      {activeStep === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Step 1 — Client Coordinates & Travel Dates</h2>
            <p className="text-xs text-slate-500">Record lead guest details, tour naming, and confirmed or tentative trip dates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Tour Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tour Package Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={itinerary.tourName}
                onChange={(e) => setItinerary(prev => ({ ...prev, tourName: e.target.value }))}
                placeholder="e.g. Golden Triangle Luxury Tour – Delhi, Agra & Jaipur"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
              />
            </div>

            {/* Client Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Guest / Lead Passenger Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={itinerary.clientName}
                onChange={(e) => setItinerary(prev => ({ ...prev, clientName: e.target.value }))}
                placeholder="e.g. Mr. Rajesh Sharma"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Client Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp / Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={itinerary.clientPhone}
                onChange={(e) => setItinerary(prev => ({ ...prev, clientPhone: e.target.value }))}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
              />
            </div>

            {/* Client Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={itinerary.clientEmail || ''}
                onChange={(e) => setItinerary(prev => ({ ...prev, clientEmail: e.target.value }))}
                placeholder="client@example.com"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Reference Number Override */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Itinerary Reference Number
              </label>
              <input
                type="text"
                value={itinerary.referenceNumber}
                onChange={(e) => setItinerary(prev => ({ ...prev, referenceNumber: e.target.value }))}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-800"
              />
            </div>

            {/* Travel Dates Section */}
            <div className="md:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  Travel Dates & Tour Duration
                </span>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itinerary.datesNotConfirmed}
                    onChange={(e) => handleDatesNotConfirmedChange(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    Dates not confirmed (Tentative)
                  </span>
                </label>
              </div>

              {itinerary.datesNotConfirmed ? (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
                  <strong>Notice:</strong> Specific travel dates will be omitted from the client proposal and rendered as &quot;To Be Confirmed&quot;.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={itinerary.startDate || ''}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={itinerary.endDate || ''}
                      onChange={(e) => handleEndDateChange(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Calculated Duration
                    </label>
                    <input
                      type="text"
                      disabled
                      value={itinerary.durationText}
                      className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg font-bold text-slate-800 cursor-not-allowed"
                    />
                  </div>
                </div>
              )}
            </div>

          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => validateAndProceed(2)}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#151521] hover:bg-[#26214F] rounded-lg shadow-sm transition"
            >
              Proceed to Pax & Vehicle →
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: Passengers & Vehicle Fleet */}
      {/* ========================================================================= */}
      {activeStep === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Step 2 — Passengers & Vehicle Fleet Standard</h2>
            <p className="text-xs text-slate-500">Configure adult and child occupancy counts, specific child ages, and assign private chauffeur vehicles.</p>
          </div>

          {/* Pax Breakdown */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-600" />
                Passenger Breakdown ({itinerary.paxSummary})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Adults (12+ Years)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleAdultsChange(num)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition ${
                        itinerary.adults === num
                          ? 'bg-[#151521] text-white border-[#151521]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={itinerary.adults}
                    onChange={(e) => handleAdultsChange(parseInt(e.target.value) || 1)}
                    className="w-16 px-2 py-1 text-xs text-center border border-slate-200 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Children (Under 12 Years)
                </label>
                <div className="flex items-center gap-2">
                  {[0, 1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleChildrenCountChange(num)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition ${
                        itinerary.children === num
                          ? 'bg-[#151521] text-white border-[#151521]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Individual Child Ages */}
            {itinerary.children > 0 && (
              <div className="pt-2 border-t border-slate-200">
                <span className="text-xs font-semibold text-slate-800 block mb-2">
                  Specify Child Ages (required for hotel extra bed and sightseeing policies):
                </span>
                <div className="flex flex-wrap gap-3">
                  {itinerary.childrenDetails.map((child, index) => (
                    <div key={child.id || index} className="flex items-center gap-1.5 bg-white p-1.5 px-3 rounded-lg border border-slate-200 text-xs">
                      <span className="text-slate-500">Child {index + 1}:</span>
                      <select
                        value={child.age}
                        onChange={(e) => updateChildAge(index, parseInt(e.target.value) || 5)}
                        className="font-semibold text-slate-900 bg-transparent focus:outline-none"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((age) => (
                          <option key={age} value={age}>
                            {age} {age === 1 ? 'year' : 'years'}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Vehicle Database Selector */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Vehicle Selection & Fleet Category
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vehicle Brand <span className="text-rose-500">*</span>
                </label>
                <select
                  value={itinerary.vehicleBrand}
                  onChange={(e) => {
                    const newBrand = e.target.value;
                    const brandObj = vehicles.find(v => v.brand === newBrand);
                    const firstModel = brandObj && brandObj.models.length > 0 ? brandObj.models[0] : '';
                    const cat = brandObj ? brandObj.category : 'MUV';
                    handleVehicleChange(newBrand, firstModel, cat, itinerary.customVehicle);
                  }}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                >
                  {vehicles.map((v) => (
                    <option key={v.brand} value={v.brand}>
                      {v.brand}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vehicle Model <span className="text-rose-500">*</span>
                </label>
                {itinerary.vehicleBrand === 'Other' ? (
                  <input
                    type="text"
                    placeholder="Enter custom vehicle"
                    value={itinerary.customVehicle || ''}
                    onChange={(e) => handleVehicleChange('Other', 'Custom', itinerary.vehicleCategory, e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
                  />
                ) : (
                  <select
                    value={itinerary.vehicleModel}
                    onChange={(e) => handleVehicleChange(itinerary.vehicleBrand, e.target.value, itinerary.vehicleCategory, itinerary.customVehicle)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    {availableModels.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={itinerary.vehicleCategory}
                  onChange={(e) => handleVehicleChange(itinerary.vehicleBrand, itinerary.vehicleModel, e.target.value, itinerary.customVehicle)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                >
                  {['Sedan', 'MUV', 'SUV', 'Luxury', 'Tempo Traveller', 'Coach/Bus', 'Other'].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Brochure Vehicle Display Text
              </label>
              <input
                type="text"
                value={itinerary.vehicleDisplay}
                onChange={(e) => setItinerary(prev => ({ ...prev, vehicleDisplay: e.target.value }))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800"
              />
            </div>
          </div>

          {/* Flight Booking & Tickets Section (Arrival and Departure Details) */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold flex-shrink-0">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    Flight Booking Details (Arrival & Departure Logistics)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Specify official flight tickets, arrival & departure times, PNRs, and baggage if flights are booked by your agency.
                  </p>
                </div>
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                <input
                  type="checkbox"
                  checked={!!itinerary.flightBookings?.flightsBookedByUs}
                  onChange={(e) => handleToggleFlightsBookedByUs(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                />
                <span className="text-xs font-bold text-sky-950">
                  {itinerary.flightBookings?.flightsBookedByUs ? 'Flights Booked By Us (Active)' : 'Booked Flights Included?'}
                </span>
              </label>
            </div>

            {itinerary.flightBookings?.flightsBookedByUs ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-700">
                    Confirmed Flight Sectors ({itinerary.flightBookings.flights?.length || 0}):
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSyncFlightsToDays}
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-sky-800 bg-sky-100 hover:bg-sky-200 rounded-lg border border-sky-300 transition"
                      title="Sync arrival flight with Day 1 and return flight with Final Day"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Sync to Day 1 & Final Day Schedule</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAddFlightSector}
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Flight Sector</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {itinerary.flightBookings.flights?.map((flight, fIdx) => (
                    <div
                      key={flight.id || fIdx}
                      className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            flight.type === 'arrival' 
                              ? 'bg-indigo-100 text-indigo-800' 
                              : flight.type === 'departure' 
                              ? 'bg-sky-100 text-sky-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {flight.type === 'arrival' ? 'Inbound / Arrival Flight' : flight.type === 'departure' ? 'Outbound / Return Flight' : 'Domestic / Connecting Flight'}
                          </span>
                          <input
                            type="text"
                            value={flight.sectorTitle}
                            onChange={(e) => handleUpdateFlightSector(flight.id, 'sectorTitle', e.target.value)}
                            placeholder="Sector Title (e.g. Mumbai → Delhi)"
                            className="text-xs font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none bg-transparent flex-1"
                          />
                        </div>

                        {itinerary.flightBookings!.flights.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFlightSector(flight.id)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                            title="Remove flight sector"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Airline Partner
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. IndiGo, Air India, Vistara"
                            value={flight.airline || ''}
                            onChange={(e) => handleUpdateFlightSector(flight.id, 'airline', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Flight Number
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 6E-204 / AI-402"
                            value={flight.flightNumber || ''}
                            onChange={(e) => handleUpdateFlightSector(flight.id, 'flightNumber', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-mono font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            PNR / Booking Reference
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 6E-J982KL"
                            value={flight.pnr || ''}
                            onChange={(e) => handleUpdateFlightSector(flight.id, 'pnr', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-mono text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Cabin & Baggage
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 15 Kg Check-in + 7 Kg Cabin"
                            value={flight.baggage || ''}
                            onChange={(e) => handleUpdateFlightSector(flight.id, 'baggage', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none text-slate-700"
                          />
                        </div>
                      </div>

                      {/* Origin & Destination Schedule Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-2.5 rounded-lg bg-slate-50/70 border border-slate-200 text-xs">
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            🛫 Departure Schedule
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <input
                                type="text"
                                placeholder="Departure City / Airport"
                                value={flight.departureCity || ''}
                                onChange={(e) => handleUpdateFlightSector(flight.id, 'departureCity', e.target.value)}
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                placeholder="Departure Time (e.g. 07:15 AM)"
                                value={flight.departureTime || ''}
                                onChange={(e) => handleUpdateFlightSector(flight.id, 'departureTime', e.target.value)}
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-semibold text-slate-800"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            🛬 Arrival Schedule
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <input
                                type="text"
                                placeholder="Arrival City / Airport"
                                value={flight.arrivalCity || ''}
                                onChange={(e) => handleUpdateFlightSector(flight.id, 'arrivalCity', e.target.value)}
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                placeholder="Arrival Time (e.g. 09:30 AM)"
                                value={flight.arrivalTime || ''}
                                onChange={(e) => handleUpdateFlightSector(flight.id, 'arrivalTime', e.target.value)}
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-semibold text-slate-800"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-white rounded-lg border border-dashed border-slate-300 text-center text-xs text-slate-500">
                <span>Flight booking details are currently disabled. If you are booking the client&apos;s flights, toggle the switch above to include verified flight arrival & departure tickets in the proposal and voucher.</span>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            >
              ← Back to Client & Dates
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#151521] hover:bg-[#26214F] rounded-lg shadow-sm transition"
            >
              Proceed to Day Builder →
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: Daily Itinerary Builder */}
      {/* ========================================================================= */}
      {activeStep === 3 && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Step 3 — Visual Day-by-Day Tour Builder</h2>
              <p className="text-xs text-slate-500">
                Select destinations, tick monuments & activities, configure arrival & multi-city circuits, and watch narratives dynamically generate.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddDay}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Add Day {itinerary.days.length + 1}
            </button>
          </div>

          {/* Days List */}
          <div className="space-y-6">
            {itinerary.days.map((day, dayIndex) => {
              // Preloaded attractions matching the day's selected primary destination
              const matchingAttractions = localAttractions.filter(
                a => a.destinationName.toLowerCase() === day.destination.toLowerCase()
              );

              // Hotels matching the overnight location
              const matchingHotels = hotels.filter(
                h => h.city.toLowerCase() === day.overnightLocation.toLowerCase()
              );

              return (
                <div key={day.id} className="space-y-3">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    
                    {/* Day Card Header */}
                    <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#151521] text-amber-300 font-bold text-xs flex items-center justify-center">
                          D{day.dayNumber}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={day.title}
                              onChange={(e) => handleUpdateDayField(dayIndex, 'title', e.target.value)}
                              placeholder="Day Title"
                              className="font-bold text-sm text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-amber-500 focus:outline-none"
                            />
                          </div>
                          <span className="text-[11px] text-slate-400">
                            Day {day.dayNumber} · Sightseeing: <strong>{day.isMultiCity ? (day.cities?.map(c => c.destination).join(' & ') || day.destination) : day.destination}</strong> · Overnight: <strong>{day.overnightLocation}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Day Action Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveDay(dayIndex, 'up')}
                          disabled={dayIndex === 0}
                          title="Move Day Up"
                          className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-30"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveDay(dayIndex, 'down')}
                          disabled={dayIndex === itinerary.days.length - 1}
                          title="Move Day Down"
                          className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-30"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicateDay(dayIndex)}
                          title="Duplicate Day"
                          className="p-1.5 rounded hover:bg-slate-200 text-slate-600 hover:text-blue-600 transition"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDay(dayIndex)}
                          title="Delete Day"
                          className="p-1.5 rounded hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Day Card Body */}
                    <div className="p-5 space-y-5">
                      
                      {/* Day 1 Arrival & Check-in Option */}
                      {dayIndex === 0 && (
                        <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                              <Plane className="w-4 h-4 text-indigo-600" />
                              Day 1 Guest Arrival & Check-in Logistics
                            </span>

                            <label className="inline-flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={day.arrivalDetails?.enabled ?? true}
                                onChange={(e) => handleUpdateArrivalDetails(dayIndex, { enabled: e.target.checked })}
                                className="w-4 h-4 rounded text-indigo-600"
                              />
                              <span className="text-xs font-semibold text-indigo-900">
                                Include Arrival on Day 1
                              </span>
                            </label>
                          </div>

                          {(day.arrivalDetails?.enabled ?? true) && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                              <div>
                                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                  Arrival Point
                                </label>
                                <select
                                  value={day.arrivalDetails?.point || 'Airport'}
                                  onChange={(e) => handleUpdateArrivalDetails(dayIndex, { point: e.target.value as any })}
                                  className="w-full px-2.5 py-1.5 bg-white border border-indigo-200 rounded-lg focus:outline-none"
                                >
                                  <option value="Airport">Airport (Domestic / International)</option>
                                  <option value="Railway Station">Railway Station</option>
                                  <option value="Bus Terminal">Bus Terminal</option>
                                  <option value="Hotel Pickup">Hotel Pickup</option>
                                  <option value="Other">City Center / Other Location</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                  Flight / Train No. or Terminal
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. IndiGo 6E-204 / T3"
                                  value={day.arrivalDetails?.flightOrTrainNumber || ''}
                                  onChange={(e) => handleUpdateArrivalDetails(dayIndex, { flightOrTrainNumber: e.target.value })}
                                  className="w-full px-2.5 py-1.5 bg-white border border-indigo-200 rounded-lg focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                  Arrival Time
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. 09:30 AM"
                                  value={day.arrivalDetails?.arrivalTime || ''}
                                  onChange={(e) => handleUpdateArrivalDetails(dayIndex, { arrivalTime: e.target.value })}
                                  className="w-full px-2.5 py-1.5 bg-white border border-indigo-200 rounded-lg focus:outline-none"
                                />
                              </div>

                              {/* Hotel Check-in Inclusion & Timing */}
                              <div className="sm:col-span-3 pt-3 border-t border-indigo-100 space-y-2">
                                <div className="flex items-center justify-between">
                                  <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-xs text-indigo-950">
                                    <input
                                      type="checkbox"
                                      checked={day.arrivalDetails?.includeHotelCheckIn !== false}
                                      onChange={(e) => handleUpdateArrivalDetails(dayIndex, { includeHotelCheckIn: e.target.checked })}
                                      className="w-4 h-4 rounded text-indigo-600"
                                    />
                                    <span>Include Hotel Check-in on Arrival Day</span>
                                  </label>
                                  <span className="text-[10px] text-indigo-700 bg-indigo-100/60 px-2 py-0.5 rounded font-medium">
                                    Integrated into Day 1 Sightseeing Narrative
                                  </span>
                                </div>

                                {day.arrivalDetails?.includeHotelCheckIn !== false && (
                                  <div className="flex flex-wrap items-center gap-4 text-xs text-indigo-900 pt-1 pl-6">
                                    <span className="font-semibold text-[11px] text-slate-600">Check-in Sequence:</span>
                                    
                                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                                      <input
                                        type="radio"
                                        name={`checkin-timing-${day.id}`}
                                        checked={day.arrivalDetails?.checkInTiming !== 'after_sightseeing'}
                                        onChange={() => handleUpdateArrivalDetails(dayIndex, { includeHotelCheckIn: true, checkInTiming: 'before_sightseeing' })}
                                        className="w-3.5 h-3.5 text-indigo-600"
                                      />
                                      <span>Check-in & freshen up first, then start sightseeing</span>
                                    </label>

                                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                                      <input
                                        type="radio"
                                        name={`checkin-timing-${day.id}`}
                                        checked={day.arrivalDetails?.checkInTiming === 'after_sightseeing'}
                                        onChange={() => handleUpdateArrivalDetails(dayIndex, { includeHotelCheckIn: true, checkInTiming: 'after_sightseeing' })}
                                        className="w-3.5 h-3.5 text-indigo-600"
                                      />
                                      <span>Directly proceed for sightseeing, hotel check-in later</span>
                                    </label>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Final Day Guest Departure & Airport / Station Transfer Logistics */}
                      {dayIndex === itinerary.days.length - 1 && (
                        <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Plane className="w-4 h-4 text-sky-600" />
                              <div>
                                <span className="text-xs font-bold text-sky-950 block">
                                  Day {day.dayNumber} Guest Departure & Airport / Station Logistics
                                </span>
                                <span className="text-[10px] text-sky-700">
                                  {itinerary.flightBookings?.flightsBookedByUs ? 'Linked with Confirmed Return Flight' : 'Final day airport / railway station departure drop'}
                                </span>
                              </div>
                            </div>

                            <label className="inline-flex items-center gap-1.5 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-sky-200">
                              <input
                                type="checkbox"
                                checked={day.departureDetails?.enabled ?? true}
                                onChange={(e) => handleUpdateDepartureDetails(dayIndex, { enabled: e.target.checked })}
                                className="w-4 h-4 rounded text-sky-600"
                              />
                              <span className="text-xs font-semibold text-sky-900">
                                Include Departure on Final Day
                              </span>
                            </label>
                          </div>

                          {(day.departureDetails?.enabled ?? true) && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                              <div>
                                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                  Departure Point / Drop-Off
                                </label>
                                <select
                                  value={day.departureDetails?.point || 'Airport'}
                                  onChange={(e) => handleUpdateDepartureDetails(dayIndex, { point: e.target.value as any })}
                                  className="w-full px-2.5 py-1.5 bg-white border border-sky-200 rounded-lg focus:outline-none"
                                >
                                  <option value="Airport">Airport (Domestic / International)</option>
                                  <option value="Railway Station">Railway Station</option>
                                  <option value="Bus Terminal">Bus Terminal</option>
                                  <option value="Hotel Drop">Hotel Drop-off</option>
                                  <option value="Other">City Center / Other Location</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                  Flight / Train No. or Terminal
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. Air India AI-402 / T2"
                                  value={day.departureDetails?.flightOrTrainNumber || ''}
                                  onChange={(e) => handleUpdateDepartureDetails(dayIndex, { flightOrTrainNumber: e.target.value })}
                                  className="w-full px-2.5 py-1.5 bg-white border border-sky-200 rounded-lg focus:outline-none font-mono"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                  Departure Time
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. 18:45 PM"
                                  value={day.departureDetails?.departureTime || ''}
                                  onChange={(e) => handleUpdateDepartureDetails(dayIndex, { departureTime: e.target.value })}
                                  className="w-full px-2.5 py-1.5 bg-white border border-sky-200 rounded-lg focus:outline-none"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Multi-City Circuit Toggle */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center gap-2">
                          <Compass className="w-4 h-4 text-purple-600" />
                          <div>
                            <span className="text-xs font-bold text-slate-900">
                              Multi-City Sightseeing Circuit for Day {day.dayNumber}
                            </span>
                            <span className="text-[11px] text-slate-500 block">
                              Add intermediate cities (e.g. Agra + Fatehpur Sikri + Jaipur) with inter-city drives and check-ins
                            </span>
                          </div>
                        </div>

                        <label className="inline-flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                          <input
                            type="checkbox"
                            checked={!!day.isMultiCity}
                            onChange={(e) => handleToggleMultiCity(dayIndex, e.target.checked)}
                            className="w-4 h-4 rounded text-purple-600"
                          />
                          <span className="text-xs font-bold text-purple-900">
                            {day.isMultiCity ? 'Multi-City Enabled' : 'Enable Multi-City'}
                          </span>
                        </label>
                      </div>

                      {/* MULTI-CITY BUILDER INTERFACE */}
                      {day.isMultiCity ? (
                        <div className="space-y-4 p-4 rounded-xl bg-purple-50/40 border border-purple-200">
                          <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                            <span className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                              Multi-City Sightseeing Legs ({day.cities?.length || 0} Cities)
                            </span>
                            <button
                              type="button"
                              onClick={() => handleAddCityToDay(dayIndex)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-white hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 transition"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add City to Day</span>
                            </button>
                          </div>

                          <div className="space-y-4">
                            {day.cities?.map((city, cityIdx) => {
                              const allCities = day.cities || [];
                              const nextCityObj = allCities[cityIdx + 1];
                              const nextCityName = nextCityObj?.destination || 'Next Destination';
                              const hasNextCity = cityIdx < allCities.length - 1;
                              const cityAttractions = localAttractions.filter(
                                a => a.destinationName.toLowerCase() === city.destination.toLowerCase()
                              );

                              return (
                                <div key={city.id || cityIdx} className="bg-white rounded-xl p-4 border border-purple-200 shadow-2xs space-y-3">
                                  
                                  {/* City Bar */}
                                  <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                                        {cityIdx + 1}
                                      </span>
                                      <select
                                        value={city.destination}
                                        onChange={(e) => handleUpdateCityInDay(dayIndex, cityIdx, 'destination', e.target.value)}
                                        className="font-bold text-xs bg-purple-50 border border-purple-200 rounded-lg px-2.5 py-1 text-purple-950 focus:outline-none"
                                      >
                                        {destinations.map(d => (
                                          <option key={d.id} value={d.name}>{d.name} ({d.state})</option>
                                        ))}
                                      </select>
                                    </div>

                                    {/* Check-in, Check-out and Direct Transfer checkboxes */}
                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                      <label className="inline-flex items-center gap-1 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={!!city.checkOut}
                                          onChange={(e) => handleUpdateCityInDay(dayIndex, cityIdx, 'checkOut', e.target.checked)}
                                          className="w-3.5 h-3.5 rounded text-amber-600"
                                        />
                                        <span className="text-[11px] font-medium text-slate-700">Hotel Check-Out</span>
                                      </label>

                                      <label className="inline-flex items-center gap-1 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={!!city.checkIn}
                                          onChange={(e) => handleUpdateCityInDay(dayIndex, cityIdx, 'checkIn', e.target.checked)}
                                          className="w-3.5 h-3.5 rounded text-indigo-600"
                                        />
                                        <span className="text-[11px] font-medium text-slate-700">Hotel Check-In</span>
                                      </label>

                                      {/* Skip sightseeing / direct transfer option */}
                                      <label className="inline-flex items-center gap-1 cursor-pointer bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                        <input
                                          type="checkbox"
                                          checked={!!city.skipSightseeing}
                                          onChange={(e) => handleUpdateCityInDay(dayIndex, cityIdx, 'skipSightseeing', e.target.checked)}
                                          className="w-3.5 h-3.5 rounded text-amber-700"
                                        />
                                        <span className="text-[10px] font-semibold text-amber-900">
                                          Proceed to next destination without sightseeing in {city.destination}
                                        </span>
                                      </label>

                                      {day.cities && day.cities.length > 1 && (
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveCityFromDay(dayIndex, cityIdx)}
                                          className="text-slate-400 hover:text-rose-600 p-1 ml-auto"
                                          title="Remove City"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  {/* Sights in this city or Direct Transfer Notice */}
                                  {city.skipSightseeing ? (
                                    <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                                      <span>✓ Direct transfer mode active: Guests check out and proceed directly to next destination without sightseeing in {city.destination}. (Reflected in narrative)</span>
                                    </div>
                                  ) : (
                                    <div>
                                      <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                                        Sights in {city.destination} ({city.attractionNames.length} selected):
                                      </label>
                                      {cityAttractions.length === 0 ? (
                                        <div className="text-[11px] text-slate-400 italic">
                                          No preloaded attractions for {city.destination}.
                                        </div>
                                      ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                          {cityAttractions.map(att => {
                                            const isSelected = city.attractionIds.includes(att.id);
                                            return (
                                              <div
                                                key={att.id}
                                                onClick={() => handleToggleCityAttraction(dayIndex, cityIdx, att)}
                                                className={`flex items-start gap-2 p-1.5 rounded-lg border text-[11px] cursor-pointer transition ${
                                                  isSelected
                                                    ? 'bg-purple-50/80 border-purple-400 text-purple-950 font-medium'
                                                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                                                }`}
                                              >
                                                <div className={`w-3.5 h-3.5 mt-0.5 rounded flex items-center justify-center border ${
                                                  isSelected ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300'
                                                }`}>
                                                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                  <div className="truncate font-semibold">{att.name}</div>
                                                  <div className="text-[9px] text-slate-400">{att.duration}</div>
                                                </div>
                                                <button
                                                  type="button"
                                                  onClick={(e) => handleOpenEditAttraction(att, e)}
                                                  className="text-slate-400 hover:text-purple-600 p-0.5"
                                                  title="Edit attraction info & image"
                                                >
                                                  <Edit3 className="w-3 h-3" />
                                                </button>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Inter-City Transit Options (Car, Flight, Train) */}
                                  {hasNextCity && (
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                                          <span>Transit to {nextCityName}:</span>
                                        </div>

                                        {/* Mode Selector Tabs */}
                                        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              handleUpdateCityInDay(dayIndex, cityIdx, 'transitType', 'car');
                                            }}
                                            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition ${
                                              (!city.transitType || city.transitType === 'car')
                                                ? 'bg-amber-500 text-slate-950 shadow-2xs'
                                                : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                          >
                                            <Car className="w-3.5 h-3.5" />
                                            <span>Car / Drive</span>
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => {
                                              const currentFl = city.flightToNext || {
                                                airline: 'IndiGo',
                                                flightNumber: '6E-452',
                                                departureAirport: `${city.destination} Airport`,
                                                departureCity: city.destination,
                                                departureTime: '11:00 AM',
                                                arrivalAirport: `${nextCityName} Airport`,
                                                arrivalCity: nextCityName,
                                                arrivalTime: '12:15 PM',
                                                pnr: ''
                                              };
                                              handleUpdateCityInDay(dayIndex, cityIdx, 'transitType', 'flight');
                                              handleUpdateCityInDay(dayIndex, cityIdx, 'flightToNext', currentFl);
                                            }}
                                            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition ${
                                              city.transitType === 'flight'
                                                ? 'bg-indigo-600 text-white shadow-2xs'
                                                : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                          >
                                            <Plane className="w-3.5 h-3.5" />
                                            <span>Flight</span>
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => {
                                              const currentTr = city.trainToNext || {
                                                trainNumber: '12002',
                                                trainName: 'Shatabdi Express',
                                                departureStation: `${city.destination} Junction`,
                                                departureTime: '06:15 AM',
                                                arrivalStation: `${nextCityName} Cantt`,
                                                arrivalTime: '08:45 AM',
                                                coachClass: 'Executive Chair Car (EC)',
                                                pnr: ''
                                              };
                                              handleUpdateCityInDay(dayIndex, cityIdx, 'transitType', 'train');
                                              handleUpdateCityInDay(dayIndex, cityIdx, 'trainToNext', currentTr);
                                            }}
                                            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition ${
                                              city.transitType === 'train'
                                                ? 'bg-emerald-600 text-white shadow-2xs'
                                                : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                          >
                                            <Train className="w-3.5 h-3.5" />
                                            <span>Train</span>
                                          </button>
                                        </div>
                                      </div>

                                      {/* CAR MODE DETAILS */}
                                      {(!city.transitType || city.transitType === 'car') && (
                                        <div className="space-y-2">
                                          <div className="flex items-center justify-between text-[11px] font-semibold text-amber-900">
                                            <div className="flex items-center gap-1.5">
                                              <Car className="w-3.5 h-3.5 text-amber-600" />
                                              <span>Highway Drive: {city.destination} → {nextCityName}</span>
                                            </div>
                                          </div>
                                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                                            <div>
                                              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Route / Via</label>
                                              <input
                                                type="text"
                                                placeholder="Route via (e.g. Expressway / Highway)"
                                                value={city.driveToNext?.routeVia || ''}
                                                onChange={(e) => {
                                                  const updatedDrive = {
                                                    toCity: nextCityName,
                                                    distanceKm: city.driveToNext?.distanceKm || 0,
                                                    driveTime: city.driveToNext?.driveTime || '',
                                                    routeVia: e.target.value
                                                  };
                                                  handleUpdateCityInDay(dayIndex, cityIdx, 'driveToNext', updatedDrive);
                                                }}
                                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Distance (km)</label>
                                              <input
                                                type="number"
                                                placeholder="Distance (km)"
                                                value={city.driveToNext?.distanceKm || ''}
                                                onChange={(e) => {
                                                  const updatedDrive = {
                                                    toCity: nextCityName,
                                                    distanceKm: parseInt(e.target.value) || 0,
                                                    driveTime: city.driveToNext?.driveTime || '',
                                                    routeVia: city.driveToNext?.routeVia
                                                  };
                                                  handleUpdateCityInDay(dayIndex, cityIdx, 'driveToNext', updatedDrive);
                                                }}
                                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Drive Time</label>
                                              <input
                                                type="text"
                                                placeholder="Drive Time (e.g. 4 Hours)"
                                                value={city.driveToNext?.driveTime || ''}
                                                onChange={(e) => {
                                                  const updatedDrive = {
                                                    toCity: nextCityName,
                                                    distanceKm: city.driveToNext?.distanceKm || 0,
                                                    driveTime: e.target.value,
                                                    routeVia: city.driveToNext?.routeVia
                                                  };
                                                  handleUpdateCityInDay(dayIndex, cityIdx, 'driveToNext', updatedDrive);
                                                }}
                                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {/* FLIGHT MODE DETAILS */}
                                      {city.transitType === 'flight' && (
                                        <div className="space-y-2 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100">
                                          <div className="flex items-center gap-1.5 font-bold text-indigo-950 text-[11px]">
                                            <Plane className="w-3.5 h-3.5 text-indigo-600" />
                                            <span>Flight Sector: {city.destination} ➔ {nextCityName}</span>
                                          </div>

                                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px]">
                                            <div>
                                              <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Airline</label>
                                              <input
                                                type="text"
                                                placeholder="e.g. IndiGo, Air India"
                                                value={city.flightToNext?.airline || ''}
                                                onChange={(e) => {
                                                  const updatedFl = { ...city.flightToNext!, flightNumber: city.flightToNext?.flightNumber || '', airline: e.target.value };
                                                  handleUpdateCityInDay(dayIndex, cityIdx, 'flightToNext', updatedFl);
                                                }}
                                                className="w-full px-2 py-1 bg-white border border-indigo-200 rounded"
                                              />
                                            </div>

                                            <div>
                                              <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Flight Number</label>
                                              <input
                                                type="text"
                                                placeholder="e.g. 6E-452"
                                                value={city.flightToNext?.flightNumber || ''}
                                                onChange={(e) => {
                                                  const updatedFl = { ...city.flightToNext!, flightNumber: e.target.value };
                                                  handleUpdateCityInDay(dayIndex, cityIdx, 'flightToNext', updatedFl);
                                                }}
                                                className="w-full px-2 py-1 bg-white border border-indigo-200 rounded font-mono font-semibold"
                                              />
                                            </div>

                                            <div>
                                              <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Departure Airport & Time</label>
                                              <div className="grid grid-cols-2 gap-1">
                                                <input
                                                  type="text"
                                                  placeholder="Port"
                                                  value={city.flightToNext?.departureAirport || ''}
                                                  onChange={(e) => {
                                                    const updatedFl = { ...city.flightToNext!, flightNumber: city.flightToNext?.flightNumber || '', departureAirport: e.target.value };
                                                    handleUpdateCityInDay(dayIndex, cityIdx, 'flightToNext', updatedFl);
                                                  }}
                                                  className="px-1.5 py-1 bg-white border border-indigo-200 rounded text-[10px]"
                                                />
                                                <input
                                                  type="text"
                                                  placeholder="Time"
                                                  value={city.flightToNext?.departureTime || ''}
                                                  onChange={(e) => {
                                                    const updatedFl = { ...city.flightToNext!, flightNumber: city.flightToNext?.flightNumber || '', departureTime: e.target.value };
                                                    handleUpdateCityInDay(dayIndex, cityIdx, 'flightToNext', updatedFl);
                                                  }}
                                                  className="px-1.5 py-1 bg-white border border-indigo-200 rounded text-[10px]"
                                                />
                                              </div>
                                            </div>

                                            <div>
                                              <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Arrival Airport & Time</label>
                                              <div className="grid grid-cols-2 gap-1">
                                                <input
                                                  type="text"
                                                  placeholder="Port"
                                                  value={city.flightToNext?.arrivalAirport || ''}
                                                  onChange={(e) => {
                                                    const updatedFl = { ...city.flightToNext!, flightNumber: city.flightToNext?.flightNumber || '', arrivalAirport: e.target.value };
                                                    handleUpdateCityInDay(dayIndex, cityIdx, 'flightToNext', updatedFl);
                                                  }}
                                                  className="px-1.5 py-1 bg-white border border-indigo-200 rounded text-[10px]"
                                                />
                                                <input
                                                  type="text"
                                                  placeholder="Time"
                                                  value={city.flightToNext?.arrivalTime || ''}
                                                  onChange={(e) => {
                                                    const updatedFl = { ...city.flightToNext!, flightNumber: city.flightToNext?.flightNumber || '', arrivalTime: e.target.value };
                                                    handleUpdateCityInDay(dayIndex, cityIdx, 'flightToNext', updatedFl);
                                                  }}
                                                  className="px-1.5 py-1 bg-white border border-indigo-200 rounded text-[10px]"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {/* TRAIN MODE DETAILS */}
                                      {city.transitType === 'train' && (
                                        <div className="space-y-2 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                                          <div className="flex items-center gap-1.5 font-bold text-emerald-950 text-[11px]">
                                            <Train className="w-3.5 h-3.5 text-emerald-600" />
                                            <span>Train Sector: {city.destination} ➔ {nextCityName}</span>
                                          </div>

                                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px]">
                                            <div>
                                              <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Train Name</label>
                                              <input
                                                type="text"
                                                placeholder="e.g. Shatabdi / Vande Bharat"
                                                value={city.trainToNext?.trainName || ''}
                                                onChange={(e) => {
                                                  const updatedTr = { ...city.trainToNext!, trainNumber: city.trainToNext?.trainNumber || '', trainName: e.target.value };
                                                  handleUpdateCityInDay(dayIndex, cityIdx, 'trainToNext', updatedTr);
                                                }}
                                                className="w-full px-2 py-1 bg-white border border-emerald-200 rounded"
                                              />
                                            </div>

                                            <div>
                                              <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Train Number</label>
                                              <input
                                                type="text"
                                                placeholder="e.g. 12002"
                                                value={city.trainToNext?.trainNumber || ''}
                                                onChange={(e) => {
                                                  const updatedTr = { ...city.trainToNext!, trainNumber: e.target.value };
                                                  handleUpdateCityInDay(dayIndex, cityIdx, 'trainToNext', updatedTr);
                                                }}
                                                className="w-full px-2 py-1 bg-white border border-emerald-200 rounded font-mono font-semibold"
                                              />
                                            </div>

                                            <div>
                                              <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Departure Station & Time</label>
                                              <div className="grid grid-cols-2 gap-1">
                                                <input
                                                  type="text"
                                                  placeholder="Stn"
                                                  value={city.trainToNext?.departureStation || ''}
                                                  onChange={(e) => {
                                                    const updatedTr = { ...city.trainToNext!, trainNumber: city.trainToNext?.trainNumber || '', departureStation: e.target.value };
                                                    handleUpdateCityInDay(dayIndex, cityIdx, 'trainToNext', updatedTr);
                                                  }}
                                                  className="px-1.5 py-1 bg-white border border-emerald-200 rounded text-[10px]"
                                                />
                                                <input
                                                  type="text"
                                                  placeholder="Time"
                                                  value={city.trainToNext?.departureTime || ''}
                                                  onChange={(e) => {
                                                    const updatedTr = { ...city.trainToNext!, trainNumber: city.trainToNext?.trainNumber || '', departureTime: e.target.value };
                                                    handleUpdateCityInDay(dayIndex, cityIdx, 'trainToNext', updatedTr);
                                                  }}
                                                  className="px-1.5 py-1 bg-white border border-emerald-200 rounded text-[10px]"
                                                />
                                              </div>
                                            </div>

                                            <div>
                                              <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Arrival Station & Time</label>
                                              <div className="grid grid-cols-2 gap-1">
                                                <input
                                                  type="text"
                                                  placeholder="Stn"
                                                  value={city.trainToNext?.arrivalStation || ''}
                                                  onChange={(e) => {
                                                    const updatedTr = { ...city.trainToNext!, trainNumber: city.trainToNext?.trainNumber || '', arrivalStation: e.target.value };
                                                    handleUpdateCityInDay(dayIndex, cityIdx, 'trainToNext', updatedTr);
                                                  }}
                                                  className="px-1.5 py-1 bg-white border border-emerald-200 rounded text-[10px]"
                                                />
                                                <input
                                                  type="text"
                                                  placeholder="Time"
                                                  value={city.trainToNext?.arrivalTime || ''}
                                                  onChange={(e) => {
                                                    const updatedTr = { ...city.trainToNext!, trainNumber: city.trainToNext?.trainNumber || '', arrivalTime: e.target.value };
                                                    handleUpdateCityInDay(dayIndex, cityIdx, 'trainToNext', updatedTr);
                                                  }}
                                                  className="px-1.5 py-1 bg-white border border-emerald-200 rounded text-[10px]"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                </div>
                              );
                            })}
                          </div>

                          {/* Overnight Stay City selection for multi-city */}
                          <div className="p-3 bg-white rounded-xl border border-purple-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div>
                              <span className="font-bold text-slate-800 block">
                                Which city is the overnight stay?
                              </span>
                              <span className="text-[11px] text-slate-500">
                                Current overnight: <strong className="text-purple-700">{day.overnightLocation}</strong>
                              </span>
                            </div>
                            <select
                              value={day.overnightLocation}
                              onChange={(e) => handleUpdateDayField(dayIndex, 'overnightLocation', e.target.value)}
                              className="font-bold text-xs bg-purple-50 border border-purple-300 rounded-lg px-3 py-1.5 text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            >
                              <optgroup label="Cities in Today's Circuit">
                                {day.cities?.map(c => (
                                  <option key={c.id || c.destination} value={c.destination}>
                                    Overnight in {c.destination}
                                  </option>
                                ))}
                              </optgroup>
                              <optgroup label="All Destinations">
                                {destinations
                                  .filter(d => !day.cities?.some(c => c.destination.toLowerCase() === d.name.toLowerCase()))
                                  .map(d => (
                                    <option key={d.id} value={d.name}>
                                      Overnight in {d.name} ({d.state})
                                    </option>
                                  ))}
                              </optgroup>
                            </select>
                          </div>
                        </div>
                      ) : (
                        /* SINGLE DESTINATION DAY */
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50/70 border border-slate-200">
                            {/* Sightseeing Location */}
                            <div>
                              <label className="block text-xs font-semibold text-slate-800 mb-1">
                                Primary Sightseeing Destination <span className="text-rose-500">*</span>
                              </label>
                              <select
                                value={day.destination}
                                onChange={(e) => handleUpdateDayField(dayIndex, 'destination', e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                              >
                                {destinations.map((d) => (
                                  <option key={d.id} value={d.name}>
                                    {d.name} ({d.state})
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Overnight Stay Checkbox & Location */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-semibold text-slate-800">
                                  Overnight Stay Location
                                </label>
                                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={day.isOvernightSameLocation}
                                    onChange={(e) => handleUpdateDayField(dayIndex, 'isOvernightSameLocation', e.target.checked)}
                                    className="w-3.5 h-3.5 rounded text-indigo-600"
                                  />
                                  <span className="text-[11px] font-medium text-indigo-900">
                                    Same as sightseeing ({day.destination})
                                  </span>
                                </label>
                              </div>

                              {day.isOvernightSameLocation ? (
                                <div className="px-3 py-2 text-xs bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-medium">
                                  Overnight in {day.destination} (Local Stay)
                                </div>
                              ) : (
                                <select
                                  value={day.overnightLocation}
                                  onChange={(e) => handleUpdateDayField(dayIndex, 'overnightLocation', e.target.value)}
                                  className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-lg focus:outline-none font-medium text-amber-900"
                                >
                                  {destinations.map((d) => (
                                    <option key={d.id} value={d.name}>
                                      Overnight in {d.name}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </div>
                          </div>

                          {/* Automatic Transfer Alert when overnight differs */}
                          {day.transfer && (
                            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-300 text-xs space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                                  <Car className="w-4 h-4 text-amber-600" />
                                  <span>Inter-City Transfer: {day.transfer.from} → {day.transfer.to}</span>
                                </div>
                                <span className="text-[11px] font-semibold text-amber-800">
                                  Approx. {day.transfer.distanceKm} km · {day.transfer.driveTime}
                                </span>
                              </div>
                              <input
                                type="text"
                                value={day.transfer.description || ''}
                                onChange={(e) => {
                                  const updatedTransfer = { ...day.transfer!, description: e.target.value };
                                  handleUpdateDayField(dayIndex, 'transfer', updatedTransfer);
                                }}
                                placeholder="Transfer narrative"
                                className="w-full px-3 py-1.5 text-xs bg-white border border-amber-200 rounded-md text-slate-800"
                              />
                            </div>
                          )}

                          {/* Attractions Selection for Single Destination */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-xs font-bold text-slate-900">
                                Attractions to Cover in {day.destination} ({day.attractionNames.length} Selected)
                              </label>
                              <span className="text-[11px] text-slate-400">
                                Click attraction to toggle · Click pencil icon to edit info & image
                              </span>
                            </div>

                            {matchingAttractions.length === 0 ? (
                              <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-500">
                                No preloaded attractions registered for {day.destination}. You can enter custom sights in the narrative below.
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {matchingAttractions.map((attraction) => {
                                  const isSelected = day.attractionIds.includes(attraction.id);
                                  return (
                                    <div
                                      key={attraction.id}
                                      onClick={() => handleToggleAttractionInDay(dayIndex, attraction)}
                                      className={`flex items-start gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition ${
                                        isSelected
                                          ? 'bg-amber-50/60 border-amber-400 text-slate-900 shadow-2xs'
                                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                                      }`}
                                    >
                                      <div className={`w-4 h-4 mt-0.5 rounded flex items-center justify-center border transition ${
                                        isSelected ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-300 bg-white'
                                      }`}>
                                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="font-semibold truncate">{attraction.name}</div>
                                        <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                                          <span>{attraction.duration}</span>
                                          {attraction.unesco && (
                                            <span className="text-indigo-600 font-medium">· UNESCO</span>
                                          )}
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={(e) => handleOpenEditAttraction(attraction, e)}
                                        className="text-slate-400 hover:text-amber-600 p-1"
                                        title="Edit attraction info & image"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      {/* Day Narrative Description with AI & Re-sync */}
                      <div>
                        <div className="flex flex-wrap items-center justify-between mb-1.5 gap-2">
                          <div className="flex items-center gap-2">
                            <label className="text-xs font-bold text-slate-900">
                              Day Sightseeing Description
                            </label>
                            <span className="text-[10px] text-slate-400">
                              (Auto-updates when places or attractions change)
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            {/* Re-sync Narrative button */}
                            <button
                              type="button"
                              onClick={() => {
                                const freshDesc = generateAutoDayDescription(day, dayIndex);
                                handleUpdateDayField(dayIndex, 'description', freshDesc);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                              title="Re-generate narrative based on selected destination and sights"
                            >
                              <RefreshCw className="w-3 h-3 text-slate-600" />
                              <span>Re-Sync Description</span>
                            </button>

                            {/* AI buttons */}
                            <button
                              type="button"
                              onClick={() => handleGenerateDayAi(dayIndex, 'professional')}
                              disabled={aiLoadingDayId === day.id}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-md bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition disabled:opacity-50"
                            >
                              <Sparkles className="w-3 h-3 text-amber-600" />
                              {aiLoadingDayId === day.id ? 'Writing...' : 'AI Polish'}
                            </button>
                          </div>
                        </div>

                        <textarea
                          rows={3}
                          value={day.description}
                          onChange={(e) => handleUpdateDayField(dayIndex, 'description', e.target.value)}
                          placeholder="Factual day narrative..."
                          className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed font-sans"
                        />
                      </div>

                      {/* Hotel & Meals Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                        
                        {/* Hotel Selection */}
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                              Hotel for Overnight in {day.overnightLocation}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setQuickHotelData({
                                  ...quickHotelData,
                                  city: day.overnightLocation
                                });
                                setQuickHotelModalDayId(day.id);
                              }}
                              className="text-[11px] font-bold text-indigo-600 hover:underline"
                            >
                              + Add New Hotel
                            </button>
                          </div>

                          <div className="space-y-2">
                            <select
                              value={day.hotel?.hotelId || ''}
                              onChange={(e) => {
                                const selectedHotel = hotels.find(h => h.id === e.target.value);
                                if (selectedHotel) {
                                  handleUpdateDayField(dayIndex, 'hotel', {
                                    hotelId: selectedHotel.id,
                                    name: selectedHotel.name,
                                    city: selectedHotel.city,
                                    roomCategory: selectedHotel.roomCategories[0] || 'Deluxe Room',
                                    mealPlan: selectedHotel.mealPlans[0] || 'Breakfast Included (CP)',
                                    starCategory: selectedHotel.starCategory
                                  });
                                }
                              }}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                            >
                              <option value="">-- Select Hotel for {day.overnightLocation} --</option>
                              {matchingHotels.length > 0 && (
                                <optgroup label={`Partner Hotels in ${day.overnightLocation}`}>
                                  {matchingHotels.map((h) => (
                                    <option key={h.id} value={h.id}>
                                      {h.name} ({h.starCategory}★) - {h.partnershipStatus}
                                    </option>
                                  ))}
                                </optgroup>
                              )}
                              <optgroup label="Other Destination Hotels">
                                {hotels.filter(h => h.city.toLowerCase() !== day.overnightLocation.toLowerCase()).map((h) => (
                                  <option key={h.id} value={h.id}>
                                    {h.name} ({h.city} · {h.starCategory}★)
                                  </option>
                                ))}
                              </optgroup>
                            </select>

                            {day.hotel && (
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <input
                                  type="text"
                                  value={day.hotel.roomCategory}
                                  onChange={(e) => {
                                    const updated = { ...day.hotel!, roomCategory: e.target.value };
                                    handleUpdateDayField(dayIndex, 'hotel', updated);
                                  }}
                                  placeholder="Room Category"
                                  className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px]"
                                />
                                <input
                                  type="text"
                                  value={day.hotel.mealPlan}
                                  onChange={(e) => {
                                    const updated = { ...day.hotel!, mealPlan: e.target.value };
                                    handleUpdateDayField(dayIndex, 'hotel', updated);
                                  }}
                                  placeholder="Meal Plan"
                                  className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px]"
                                />
                              </div>
                            )}

                            {matchingHotels.length === 0 && (
                              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                                <span>No local partner hotels registered in {day.overnightLocation} yet.</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setQuickHotelData({
                                      ...quickHotelData,
                                      city: day.overnightLocation
                                    });
                                    setQuickHotelModalDayId(day.id);
                                  }}
                                  className="text-indigo-600 font-semibold hover:underline text-[11px]"
                                >
                                  + Register hotel now
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Meals Selection */}
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <Utensils className="w-3.5 h-3.5 text-amber-600" />
                            Meal Inclusions for Day {day.dayNumber}
                          </span>

                          <div className="flex items-center gap-4 text-xs">
                            <label className="inline-flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={day.meals.breakfast}
                                onChange={(e) => {
                                  const updatedMeals = { ...day.meals, breakfast: e.target.checked };
                                  handleUpdateDayField(dayIndex, 'meals', updatedMeals);
                                }}
                                className="w-3.5 h-3.5 rounded text-amber-600"
                              />
                              <span>Breakfast</span>
                            </label>

                            <label className="inline-flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={day.meals.lunch}
                                onChange={(e) => {
                                  const updatedMeals = { ...day.meals, lunch: e.target.checked };
                                  handleUpdateDayField(dayIndex, 'meals', updatedMeals);
                                }}
                                className="w-3.5 h-3.5 rounded text-amber-600"
                              />
                              <span>Lunch</span>
                            </label>

                            <label className="inline-flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={day.meals.dinner}
                                onChange={(e) => {
                                  const updatedMeals = { ...day.meals, dinner: e.target.checked };
                                  handleUpdateDayField(dayIndex, 'meals', updatedMeals);
                                }}
                                className="w-3.5 h-3.5 rounded text-amber-600"
                              />
                              <span>Dinner</span>
                            </label>
                          </div>

                          <input
                            type="text"
                            value={day.meals.note || ''}
                            onChange={(e) => {
                              const updatedMeals = { ...day.meals, note: e.target.value };
                              handleUpdateDayField(dayIndex, 'meals', updatedMeals);
                            }}
                            placeholder="e.g. Breakfast at hotel, dinner at leisure"
                            className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-md"
                          />
                        </div>

                      </div>

                    </div>
                  </div>

                  {/* Add Day Button AFTER Each Day */}
                  <div className="flex justify-center py-1">
                    <button
                      type="button"
                      onClick={() => handleAddDayAfter(dayIndex)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-dashed border-amber-400 bg-amber-50/70 hover:bg-amber-100 text-amber-950 font-bold text-xs shadow-2xs transition active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-600" />
                      <span>+ Add Day After Day {day.dayNumber}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            >
              ← Back to Pax & Vehicle
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(4)}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#151521] hover:bg-[#26214F] rounded-lg shadow-sm transition"
            >
              Proceed to Inclusions & Notes →
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: Inclusions, Exclusions & Special Notes */}
      {/* ========================================================================= */}
      {activeStep === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Step 4 — Inclusions, Exclusions & Important Terms</h2>
            <p className="text-xs text-slate-500">Curate contractual inclusions, exclusions, and destination-specific alerts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Inclusions */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Tour Inclusions
              </span>
              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {itinerary.inclusions.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 text-xs">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const copy = [...itinerary.inclusions];
                        copy[idx] = e.target.value;
                        setItinerary(prev => ({ ...prev, inclusions: copy }));
                      }}
                      className="flex-1 bg-transparent focus:outline-none text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const copy = itinerary.inclusions.filter((_, i) => i !== idx);
                        setItinerary(prev => ({ ...prev, inclusions: copy }));
                      }}
                      className="text-slate-300 hover:text-rose-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setItinerary(prev => ({ ...prev, inclusions: [...prev.inclusions, 'New inclusion'] }))}
                className="text-xs font-bold text-amber-600 hover:underline"
              >
                + Add Another Inclusion
              </button>
            </div>

            {/* Exclusions */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Tour Exclusions
              </span>
              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {itinerary.exclusions.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 text-xs">
                    <X className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const copy = [...itinerary.exclusions];
                        copy[idx] = e.target.value;
                        setItinerary(prev => ({ ...prev, exclusions: copy }));
                      }}
                      className="flex-1 bg-transparent focus:outline-none text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const copy = itinerary.exclusions.filter((_, i) => i !== idx);
                        setItinerary(prev => ({ ...prev, exclusions: copy }));
                      }}
                      className="text-slate-300 hover:text-rose-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setItinerary(prev => ({ ...prev, exclusions: [...prev.exclusions, 'New exclusion'] }))}
                className="text-xs font-bold text-amber-600 hover:underline"
              >
                + Add Another Exclusion
              </button>
            </div>

          </div>

          {/* Special Notes & Destination Reminders */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-900">
              Special Notes, Advisories & Hotel Terms
            </label>
            <p className="text-[11px] text-slate-500">
              Examples: &quot;Taj Mahal is closed every Friday&quot;, &quot;Early check-in subject to hotel availability&quot;, &quot;Carry original passport or voter ID&quot;.
            </p>
            <textarea
              rows={4}
              value={itinerary.specialNotes}
              onChange={(e) => setItinerary(prev => ({ ...prev, specialNotes: e.target.value }))}
              placeholder="Important tour notes for clients..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none leading-relaxed"
            />
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            >
              ← Back to Day Builder
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(5)}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#151521] hover:bg-[#26214F] rounded-lg shadow-sm transition"
            >
              Proceed to Pricing & Ledger →
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: Cover Image, Pricing & Commercials */}
      {/* ========================================================================= */}
      {activeStep === 5 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Step 5 — Cover Photo, Commercials & Payment Ledger</h2>
            <p className="text-xs text-slate-500">Configure the Page 1 itinerary cover photo, set tour package commercials, and record payment deposits.</p>
          </div>

          {/* First Page Main Cover Photo (Hero Image) */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-600" />
                  First Page Main Cover Photo (Hero Banner)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Customize the primary hero photo displayed on the cover of the client itinerary proposal (Page 1).
                </p>
              </div>
              {itinerary.coverImage && (
                <button
                  type="button"
                  onClick={() => setItinerary(prev => ({ ...prev, coverImage: '' }))}
                  className="text-[11px] font-semibold text-slate-600 hover:text-amber-700 underline text-left sm:text-right"
                >
                  Reset to Auto-Selected Tour Sight
                </button>
              )}
            </div>

            {/* Current Cover Preview & Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              {/* Preview Box */}
              <div className="relative rounded-xl overflow-hidden border-2 border-slate-300 bg-slate-900 shadow-sm aspect-video group flex flex-col justify-end">
                <img
                  src={itinerary.coverImage || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80'}
                  alt="Cover Hero Preview"
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105 absolute inset-0"
                />
                <div className="relative z-10 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 pt-6">
                  <span className="text-[9px] font-extrabold text-amber-300 tracking-wider uppercase block">
                    Page 1 Main Cover Image
                  </span>
                  <span className="text-xs font-semibold text-white truncate block">
                    {itinerary.tourName || 'Tour Itinerary'}
                  </span>
                </div>
              </div>

              {/* URL & Upload Inputs */}
              <div className="md:col-span-2 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Custom Image Link or Upload
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={itinerary.coverImage || ''}
                      onChange={(e) => setItinerary(prev => ({ ...prev, coverImage: e.target.value }))}
                      placeholder="Paste image URL (https://...)"
                      className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                    />
                    <label className="cursor-pointer px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (uploadEvent) => {
                              if (uploadEvent.target?.result) {
                                setItinerary(prev => ({ ...prev, coverImage: uploadEvent.target!.result as string }));
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Quick Pick: Tour Itinerary Attractions */}
                {tourAttractionPhotos.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                      Pick from Your Itinerary Sights & Monuments:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {tourAttractionPhotos.map(att => {
                        const isSelected = itinerary.coverImage === att.image;
                        return (
                          <button
                            key={att.id}
                            type="button"
                            onClick={() => setItinerary(prev => ({ ...prev, coverImage: att.image }))}
                            className={`flex items-center gap-2 p-1 pr-2.5 rounded-lg border text-left transition ${
                              isSelected
                                ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-400'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <img src={att.image} alt={att.name} className="w-8 h-8 rounded object-cover flex-shrink-0" />
                            <div className="truncate max-w-[130px]">
                              <span className="block text-[10px] font-bold text-slate-800 truncate">{att.name}</span>
                              <span className="block text-[9px] text-slate-500 truncate">{att.destinationName}</span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 ml-auto" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Popular Iconic India Presets */}
                <div>
                  <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                    Or Choose from Iconic Indian Landmark Presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {COVER_IMAGE_PRESETS.map(preset => {
                      const isSelected = itinerary.coverImage === preset.image;
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setItinerary(prev => ({ ...prev, coverImage: preset.image }))}
                          className={`text-[10px] px-2.5 py-1 rounded-md border font-medium transition flex items-center gap-1 ${
                            isSelected
                              ? 'bg-[#151521] text-amber-300 border-[#151521] font-bold shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 text-amber-300" />}
                          {preset.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Search & Select from All Pre-Loaded Destinations & Monuments */}
                <div className="pt-3 border-t border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5 text-amber-600" />
                        Search Pre-Loaded Destinations & Monuments ({allCatalogPhotos.length}+ Photos)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Search and pick from authentic monuments, palaces, forts, temples, and landscape photos.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCoverPhotoModalOpen(true)}
                      className="text-[11px] font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg transition flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
                    >
                      <SlidersHorizontal className="w-3 h-3 text-amber-700" />
                      <span>Open Full Photo Library</span>
                    </button>
                  </div>

                  {/* Search & Filter Controls */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={coverPhotoSearchQuery}
                        onChange={(e) => {
                          setCoverPhotoSearchQuery(e.target.value);
                          setVisibleCatalogLimit(12);
                        }}
                        placeholder="Search monuments or destinations (e.g. Taj Mahal, Qutub, Jaipur, Fort, Beach, Lake, Delhi)..."
                        className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                      />
                      {coverPhotoSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setCoverPhotoSearchQuery('')}
                          className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    <select
                      value={coverPhotoDestFilter}
                      onChange={(e) => {
                        setCoverPhotoDestFilter(e.target.value);
                        setVisibleCatalogLimit(12);
                      }}
                      className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="ALL">All Destinations ({allCatalogPhotos.length})</option>
                      {uniqueDestNames.map(dName => (
                        <option key={dName} value={dName}>{dName}</option>
                      ))}
                    </select>

                    <div className="flex gap-1 bg-slate-200/70 p-0.5 rounded-lg text-[10px] font-semibold">
                      <button
                        type="button"
                        onClick={() => { setCoverPhotoTypeFilter('ALL'); setVisibleCatalogLimit(12); }}
                        className={`px-2 py-1 rounded-md transition ${
                          coverPhotoTypeFilter === 'ALL'
                            ? 'bg-white text-slate-900 shadow-2xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        All
                      </button>
                      <button
                        type="button"
                        onClick={() => { setCoverPhotoTypeFilter('monument'); setVisibleCatalogLimit(12); }}
                        className={`px-2 py-1 rounded-md transition ${
                          coverPhotoTypeFilter === 'monument'
                            ? 'bg-white text-slate-900 shadow-2xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Monuments
                      </button>
                      <button
                        type="button"
                        onClick={() => { setCoverPhotoTypeFilter('destination'); setVisibleCatalogLimit(12); }}
                        className={`px-2 py-1 rounded-md transition ${
                          coverPhotoTypeFilter === 'destination'
                            ? 'bg-white text-slate-900 shadow-2xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Destinations
                      </button>
                    </div>
                  </div>

                  {/* Photo Cards Grid */}
                  {filteredCatalogPhotos.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
                      No photos found matching &quot;{coverPhotoSearchQuery}&quot;. Try a different search term or select &quot;All Destinations&quot;.
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                        {filteredCatalogPhotos.slice(0, visibleCatalogLimit).map(item => {
                          const isSelected = itinerary.coverImage === item.image;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setItinerary(prev => ({ ...prev, coverImage: item.image }))}
                              className={`group relative text-left rounded-xl overflow-hidden border transition bg-white shadow-2xs flex flex-col ${
                                isSelected
                                  ? 'border-amber-500 ring-2 ring-amber-400 bg-amber-50/50'
                                  : 'border-slate-200 hover:border-amber-300 hover:shadow-xs'
                              }`}
                            >
                              <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  loading="lazy"
                                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                                />
                                {item.unesco && (
                                  <span className="absolute top-1 left-1 bg-amber-500 text-slate-950 font-black text-[7px] px-1 py-0.5 rounded shadow-2xs leading-none">
                                    UNESCO
                                  </span>
                                )}
                                <span className="absolute top-1 right-1 bg-slate-900/75 backdrop-blur-2xs text-white text-[7px] font-semibold px-1 py-0.5 rounded leading-none">
                                  {item.type === 'monument' ? 'Site' : 'Place'}
                                </span>
                                {isSelected && (
                                  <div className="absolute inset-0 bg-amber-500/25 flex items-center justify-center">
                                    <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                                      <Check className="w-3 h-3 text-slate-950 stroke-[3]" /> Selected
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="p-1.5 flex-1 flex flex-col justify-between">
                                <span className="text-[10px] font-bold text-slate-800 line-clamp-1 group-hover:text-amber-700" title={item.name}>
                                  {item.name}
                                </span>
                                <span className="text-[9px] text-slate-500 truncate" title={item.subtitle}>
                                  {item.subtitle}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {filteredCatalogPhotos.length > visibleCatalogLimit && (
                        <div className="pt-2 flex justify-center">
                          <button
                            type="button"
                            onClick={() => setVisibleCatalogLimit(prev => prev + 16)}
                            className="text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-4 py-1.5 rounded-lg transition"
                          >
                            Show More Photos (Showing {visibleCatalogLimit} of {filteredCatalogPhotos.length})
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cost Visibility Toggle */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Show Commercial Price in Client Itinerary
              </span>
              <span className="text-[11px] text-slate-500">
                Turn off if providing a route plan only without commercial quotes.
              </span>
            </div>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={itinerary.showCostInItinerary}
                onChange={(e) => setItinerary(prev => ({ ...prev, showCostInItinerary: e.target.checked }))}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
              />
              <span className="text-xs font-semibold text-slate-800">
                {itinerary.showCostInItinerary ? 'Price Enabled' : 'Price Hidden'}
              </span>
            </label>
          </div>

          {itinerary.showCostInItinerary && (
            <div className="space-y-6">
              
              {/* Financial Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Total Cost */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Tour Package Price (INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={itinerary.totalCost}
                      onChange={(e) => handleTotalCostChange(parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-3 py-2 text-base font-bold bg-white border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                </div>

                {/* Advance Paid */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Advance Amount Paid (INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 font-bold text-emerald-600">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={itinerary.advancePaid}
                      onChange={(e) => handleAdvancePaidChange(parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-3 py-2 text-base font-bold bg-white border border-slate-200 rounded-lg text-emerald-700"
                    />
                  </div>
                </div>

                {/* Pending Balance */}
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-300">
                  <span className="block text-xs font-semibold text-amber-900 mb-1">
                    Pending Balance Due
                  </span>
                  <div className="text-xl font-black text-amber-950">
                    ₹{itinerary.pendingAmount.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-amber-800 font-semibold block mt-1">
                    Ledger Status: {itinerary.paymentStatus}
                  </span>
                </div>

              </div>

            </div>
          )}

          <div className="flex justify-between pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setActiveStep(4)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            >
              ← Back to Inclusions & Notes
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSaveDraft(prepareItineraryForOutput(itinerary))}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => onGeneratePreview(prepareItineraryForOutput(itinerary))}
                className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-sm transition active:scale-95"
              >
                Generate & Preview Proposal →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* QUICK HOTEL MODAL */}
      {/* ========================================================================= */}
      {quickHotelModalDayId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Register New Partner Hotel</h3>
              <button onClick={() => setQuickHotelModalDayId(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hotel Property Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Trident Hotel Jaipur"
                  value={quickHotelData.name}
                  onChange={(e) => setQuickHotelData({ ...quickHotelData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City / Location</label>
                  <input
                    type="text"
                    value={quickHotelData.city}
                    onChange={(e) => setQuickHotelData({ ...quickHotelData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Star Category</label>
                  <select
                    value={quickHotelData.starCategory}
                    onChange={(e) => setQuickHotelData({ ...quickHotelData, starCategory: parseInt(e.target.value) || 4 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    {[3, 4, 5].map((s) => (
                      <option key={s} value={s}>{s} Stars</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Default Room Category</label>
                <input
                  type="text"
                  value={quickHotelData.roomCategory}
                  onChange={(e) => setQuickHotelData({ ...quickHotelData, roomCategory: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setQuickHotelModalDayId(null)}
                className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!quickHotelData.name.trim()) return;
                  const newHotel = onAddNewHotelQuick(quickHotelData);
                  const dayIdx = itinerary.days.findIndex(d => d.id === quickHotelModalDayId);
                  if (dayIdx >= 0) {
                    handleUpdateDayField(dayIdx, 'hotel', {
                      hotelId: newHotel.id,
                      name: newHotel.name,
                      city: newHotel.city,
                      roomCategory: newHotel.roomCategories[0] || quickHotelData.roomCategory,
                      mealPlan: newHotel.mealPlans[0] || quickHotelData.mealPlan,
                      starCategory: newHotel.starCategory
                    });
                  }
                  setQuickHotelModalDayId(null);
                }}
                className="px-4 py-2 bg-[#151521] hover:bg-[#26214F] text-white font-bold rounded-lg"
              >
                Save & Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT ATTRACTION MODAL */}
      {/* ========================================================================= */}
      {isEditAttractionOpen && editingAttraction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Edit Attraction Info & Image</h3>
                <p className="text-[11px] text-slate-500">Update monument name, verified image, duration, or description.</p>
              </div>
              <button onClick={() => setIsEditAttractionOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Image Preview */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingAttraction.image}
                  onChange={(e) => setEditingAttraction({ ...editingAttraction, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
                {editingAttraction.image && (
                  <div className="mt-2 h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img
                      src={editingAttraction.image}
                      alt={editingAttraction.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Attraction Name *</label>
                <input
                  type="text"
                  value={editingAttraction.name}
                  onChange={(e) => setEditingAttraction({ ...editingAttraction, name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={editingAttraction.category}
                    onChange={(e) => setEditingAttraction({ ...editingAttraction, category: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Recommended Duration</label>
                  <input
                    type="text"
                    value={editingAttraction.duration}
                    onChange={(e) => setEditingAttraction({ ...editingAttraction, duration: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingAttraction.shortDescription}
                  onChange={(e) => setEditingAttraction({ ...editingAttraction, shortDescription: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!editingAttraction.unesco}
                  onChange={(e) => setEditingAttraction({ ...editingAttraction, unesco: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <span className="font-semibold text-slate-800">UNESCO World Heritage Site</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditAttractionOpen(false)}
                className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditedAttraction}
                className="px-4 py-2 bg-[#151521] hover:bg-[#26214F] text-amber-300 font-bold rounded-lg shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Pre-Loaded Photo Library Modal */}
      {isCoverPhotoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-amber-600" />
                  Pre-Loaded Destinations & Monuments Library ({allCatalogPhotos.length}+ Photos)
                </h3>
                <p className="text-xs text-slate-500">
                  Click on any photo to immediately select it as the Page 1 Main Cover Photo for your client proposal.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCoverPhotoModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Search Controls */}
            <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={coverPhotoSearchQuery}
                  onChange={(e) => setCoverPhotoSearchQuery(e.target.value)}
                  placeholder="Search monuments or destinations (e.g. Taj Mahal, Qutub, Jaipur, Fort, Beach, Lake, Delhi)..."
                  className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
                {coverPhotoSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setCoverPhotoSearchQuery('')}
                    className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              <select
                value={coverPhotoDestFilter}
                onChange={(e) => setCoverPhotoDestFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              >
                <option value="ALL">All Destinations ({allCatalogPhotos.length})</option>
                {uniqueDestNames.map(dName => (
                  <option key={dName} value={dName}>{dName}</option>
                ))}
              </select>

              <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setCoverPhotoTypeFilter('ALL')}
                  className={`px-3 py-1.5 rounded-md transition ${
                    coverPhotoTypeFilter === 'ALL'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setCoverPhotoTypeFilter('monument')}
                  className={`px-3 py-1.5 rounded-md transition ${
                    coverPhotoTypeFilter === 'monument'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Monuments
                </button>
                <button
                  type="button"
                  onClick={() => setCoverPhotoTypeFilter('destination')}
                  className={`px-3 py-1.5 rounded-md transition ${
                    coverPhotoTypeFilter === 'destination'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Destinations
                </button>
              </div>
            </div>

            {/* Modal Photo Grid */}
            <div className="p-4 overflow-y-auto flex-1">
              {filteredCatalogPhotos.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <ImageIcon className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No photos match your filter</p>
                  <p className="text-xs text-slate-400 mt-1">Try clearing your search query or selecting a different destination.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                  {filteredCatalogPhotos.map(item => {
                    const isSelected = itinerary.coverImage === item.image;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setItinerary(prev => ({ ...prev, coverImage: item.image }));
                          setIsCoverPhotoModalOpen(false);
                        }}
                        className={`group relative text-left rounded-xl overflow-hidden border transition bg-white shadow-2xs flex flex-col ${
                          isSelected
                            ? 'border-amber-500 ring-2 ring-amber-400 bg-amber-50/50'
                            : 'border-slate-200 hover:border-amber-400 hover:shadow-md'
                        }`}
                      >
                        <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                          />
                          {item.unesco && (
                            <span className="absolute top-1.5 left-1.5 bg-amber-500 text-slate-950 font-black text-[8px] px-1.5 py-0.5 rounded shadow-2xs leading-none">
                              UNESCO
                            </span>
                          )}
                          <span className="absolute top-1.5 right-1.5 bg-slate-900/75 backdrop-blur-2xs text-white text-[8px] font-semibold px-1.5 py-0.5 rounded leading-none">
                            {item.type === 'monument' ? 'Monument' : 'Destination'}
                          </span>
                          {isSelected && (
                            <div className="absolute inset-0 bg-amber-500/25 flex items-center justify-center">
                              <span className="bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                                <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" /> Active Cover
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-2.5 flex-1 flex flex-col justify-between">
                          <span className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-amber-700" title={item.name}>
                            {item.name}
                          </span>
                          <span className="text-[10px] text-slate-500 truncate mt-0.5" title={item.subtitle}>
                            {item.subtitle}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>Showing {filteredCatalogPhotos.length} of {allCatalogPhotos.length} photos</span>
              <button
                type="button"
                onClick={() => setIsCoverPhotoModalOpen(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition"
              >
                Close Library
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
