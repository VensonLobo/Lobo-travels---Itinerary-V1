import { useSyncExternalStore } from 'react';
import { Itinerary, Hotel, Destination, Attraction, VehicleOption, AppSettings } from '@/types';
import {
  DEFAULT_SETTINGS,
  INITIAL_VEHICLES,
  INITIAL_DESTINATIONS,
  INITIAL_ATTRACTIONS,
  INITIAL_HOTELS,
  INITIAL_ITINERARIES
} from './mock-data';

const STORAGE_KEYS = {
  SETTINGS: 'lobo_settings_v1',
  VEHICLES: 'lobo_vehicles_v1',
  DESTINATIONS: 'lobo_destinations_v2',
  ATTRACTIONS: 'lobo_attractions_v2',
  HOTELS: 'lobo_hotels_v1',
  ITINERARIES: 'lobo_itineraries_v3',
  NEXT_REF: 'lobo_next_ref_v1',
};

// In-memory cache for synchronous snapshots
let itinerariesCache: Itinerary[] | null = null;
let hotelsCache: Hotel[] | null = null;
let destinationsCache: Destination[] | null = null;
let attractionsCache: Attraction[] | null = null;
let vehiclesCache: VehicleOption[] | null = null;
let settingsCache: AppSettings | null = null;

function getStorageItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key} from storage`, e);
    return fallback;
  }
}

function refreshAllCaches(): void {
  if (typeof window === 'undefined') return;
  
  // Load itineraries v3 with fallback to v2 or INITIAL_ITINERARIES
  let loadedItins = getStorageItem<Itinerary[] | null>(STORAGE_KEYS.ITINERARIES, null);
  if (!loadedItins) {
    const v2 = getStorageItem<Itinerary[] | null>('lobo_itineraries_v2', null);
    if (v2 && Array.isArray(v2)) {
      // Sanitize v2 itineraries by clearing unmapped dummy day images
      loadedItins = v2.map(itin => ({
        ...itin,
        days: itin.days.map(d => ({
          ...d,
          images: []
        }))
      }));
    } else {
      loadedItins = INITIAL_ITINERARIES;
    }
    setStorageItem(STORAGE_KEYS.ITINERARIES, loadedItins);
  }
  itinerariesCache = loadedItins;
  hotelsCache = getStorageItem<Hotel[]>(STORAGE_KEYS.HOTELS, INITIAL_HOTELS);

  // Auto-merge newly loaded destinations catalog (v2)
  const storedDests = getStorageItem<Destination[]>(STORAGE_KEYS.DESTINATIONS, INITIAL_DESTINATIONS);
  const destMap = new Map<string, Destination>();
  INITIAL_DESTINATIONS.forEach(d => destMap.set(d.id.toLowerCase(), d));
  storedDests.forEach(d => destMap.set(d.id.toLowerCase(), d)); // stored overrides or adds
  destinationsCache = Array.from(destMap.values());

  // Auto-merge newly loaded attractions catalog (v2)
  const storedAtts = getStorageItem<Attraction[]>(STORAGE_KEYS.ATTRACTIONS, INITIAL_ATTRACTIONS);
  const attMap = new Map<string, Attraction>();
  INITIAL_ATTRACTIONS.forEach(a => attMap.set(a.id.toLowerCase(), a));
  storedAtts.forEach(a => {
    // preserve user edits or custom additions
    attMap.set(a.id.toLowerCase(), a);
  });
  attractionsCache = Array.from(attMap.values());

  vehiclesCache = getStorageItem<VehicleOption[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
  settingsCache = getStorageItem<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

// Convert Itinerary Ref (e.g. LT-2026-0001) to Voucher Ref (LTV-2026-0001)
export function getVoucherReferenceNumber(itineraryRef: string): string {
  if (!itineraryRef) return 'LTV-2026-0001';
  if (itineraryRef.startsWith('LT-')) {
    return itineraryRef.replace(/^LT-/, 'LTV-');
  }
  if (itineraryRef.startsWith('LT')) {
    return itineraryRef.replace(/^LT/, 'LTV');
  }
  return `LTV-${itineraryRef}`;
}

function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    refreshAllCaches();
    window.dispatchEvent(new Event('lobo_storage_updated'));
  } catch (e) {
    console.error(`Error saving ${key} to storage`, e);
  }
}

function subscribeStorage(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleUpdate = () => {
    refreshAllCaches();
    callback();
  };

  window.addEventListener('lobo_storage_updated', handleUpdate);
  window.addEventListener('storage', handleUpdate);

  return () => {
    window.removeEventListener('lobo_storage_updated', handleUpdate);
    window.removeEventListener('storage', handleUpdate);
  };
}

// React useSyncExternalStore Hooks (Guarantees zero SSR hydration mismatches)
export function useItineraries(): Itinerary[] {
  return useSyncExternalStore(
    subscribeStorage,
    () => {
      if (!itinerariesCache) refreshAllCaches();
      return itinerariesCache || INITIAL_ITINERARIES;
    },
    () => INITIAL_ITINERARIES
  );
}

export function useHotels(): Hotel[] {
  return useSyncExternalStore(
    subscribeStorage,
    () => {
      if (!hotelsCache) refreshAllCaches();
      return hotelsCache || INITIAL_HOTELS;
    },
    () => INITIAL_HOTELS
  );
}

export function useDestinations(): Destination[] {
  return useSyncExternalStore(
    subscribeStorage,
    () => {
      if (!destinationsCache) refreshAllCaches();
      return destinationsCache || INITIAL_DESTINATIONS;
    },
    () => INITIAL_DESTINATIONS
  );
}

export function useAttractions(): Attraction[] {
  return useSyncExternalStore(
    subscribeStorage,
    () => {
      if (!attractionsCache) refreshAllCaches();
      return attractionsCache || INITIAL_ATTRACTIONS;
    },
    () => INITIAL_ATTRACTIONS
  );
}

export function useVehicles(): VehicleOption[] {
  return useSyncExternalStore(
    subscribeStorage,
    () => {
      if (!vehiclesCache) refreshAllCaches();
      return vehiclesCache || INITIAL_VEHICLES;
    },
    () => INITIAL_VEHICLES
  );
}

export function useSettings(): AppSettings {
  return useSyncExternalStore(
    subscribeStorage,
    () => {
      if (!settingsCache) refreshAllCaches();
      return settingsCache || DEFAULT_SETTINGS;
    },
    () => DEFAULT_SETTINGS
  );
}

// Standard synchronous getters (fallbacks)
export function getSettings(): AppSettings {
  return getStorageItem<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export function saveSettings(settings: AppSettings): void {
  setStorageItem(STORAGE_KEYS.SETTINGS, settings);
}

// Vehicles
export function getVehicles(): VehicleOption[] {
  return getStorageItem<VehicleOption[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
}

export function saveVehicles(vehicles: VehicleOption[]): void {
  setStorageItem(STORAGE_KEYS.VEHICLES, vehicles);
}

// Destinations
export function getDestinations(): Destination[] {
  return getStorageItem<Destination[]>(STORAGE_KEYS.DESTINATIONS, INITIAL_DESTINATIONS);
}

export function saveDestination(destination: Destination): void {
  const current = getDestinations();
  const index = current.findIndex(d => d.id === destination.id);
  let updated: Destination[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = destination;
  } else {
    updated = [destination, ...current];
  }
  setStorageItem(STORAGE_KEYS.DESTINATIONS, updated);
}

export function deleteDestination(id: string): void {
  const current = getDestinations();
  setStorageItem(STORAGE_KEYS.DESTINATIONS, current.filter(d => d.id !== id));
}

// Attractions
export function getAttractions(): Attraction[] {
  return getStorageItem<Attraction[]>(STORAGE_KEYS.ATTRACTIONS, INITIAL_ATTRACTIONS);
}

export function saveAttraction(attraction: Attraction): void {
  const current = getAttractions();
  const index = current.findIndex(a => a.id === attraction.id);
  let updated: Attraction[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = attraction;
  } else {
    updated = [attraction, ...current];
  }
  setStorageItem(STORAGE_KEYS.ATTRACTIONS, updated);
}

export function deleteAttraction(id: string): void {
  const current = getAttractions();
  setStorageItem(STORAGE_KEYS.ATTRACTIONS, current.filter(a => a.id !== id));
}

// Hotels
export function getHotels(): Hotel[] {
  return getStorageItem<Hotel[]>(STORAGE_KEYS.HOTELS, INITIAL_HOTELS);
}

export function saveHotel(hotel: Hotel): void {
  const current = getHotels();
  const index = current.findIndex(h => h.id === hotel.id);
  let updated: Hotel[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = hotel;
  } else {
    updated = [hotel, ...current];
  }
  setStorageItem(STORAGE_KEYS.HOTELS, updated);
}

export function deleteHotel(id: string): void {
  const current = getHotels();
  setStorageItem(STORAGE_KEYS.HOTELS, current.filter(h => h.id !== id));
}

// Reference Number Generator
export function getNextReferenceNumber(): string {
  const settings = getSettings();
  const prefix = settings.referencePrefix || 'LT-2026-';
  const currentSeq = getStorageItem<number>(STORAGE_KEYS.NEXT_REF, settings.nextReferenceSequence || 3);
  const formatted = `${prefix}${String(currentSeq).padStart(4, '0')}`;
  setStorageItem(STORAGE_KEYS.NEXT_REF, currentSeq + 1);
  return formatted;
}

// Itineraries
export function getItineraries(): Itinerary[] {
  return getStorageItem<Itinerary[]>(STORAGE_KEYS.ITINERARIES, INITIAL_ITINERARIES);
}

export function getItineraryById(id: string): Itinerary | undefined {
  const all = getItineraries();
  return all.find(item => item.id === id || item.referenceNumber.toLowerCase() === id.toLowerCase());
}

export function saveItinerary(itinerary: Itinerary): Itinerary {
  const current = getItineraries();
  const index = current.findIndex(item => item.id === itinerary.id);
  const now = new Date().toISOString();
  let updated: Itinerary[];

  const updatedRecord = {
    ...itinerary,
    updatedAt: now,
  };

  if (index >= 0) {
    updated = [...current];
    updated[index] = updatedRecord;
  } else {
    updatedRecord.createdAt = updatedRecord.createdAt || now;
    updated = [updatedRecord, ...current];
  }

  setStorageItem(STORAGE_KEYS.ITINERARIES, updated);
  return updatedRecord;
}

export function deleteItinerary(id: string): void {
  const current = getItineraries();
  setStorageItem(STORAGE_KEYS.ITINERARIES, current.filter(item => item.id !== id));
}

export function duplicateItinerary(sourceId: string): Itinerary | null {
  const source = getItineraryById(sourceId);
  if (!source) return null;

  const newRef = getNextReferenceNumber();
  const newId = 'itn-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();

  const duplicated: Itinerary = {
    ...JSON.parse(JSON.stringify(source)),
    id: newId,
    referenceNumber: newRef,
    tourName: `${source.tourName} (Copy)`,
    status: 'Draft',
    advancePaid: 0,
    pendingAmount: source.totalCost,
    paymentStatus: 'Unpaid',
    confirmedAt: undefined,
    createdAt: now,
    updatedAt: now,
  };

  saveItinerary(duplicated);
  return duplicated;
}

export function resetAllToDefaults(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.VEHICLES);
  localStorage.removeItem(STORAGE_KEYS.DESTINATIONS);
  localStorage.removeItem(STORAGE_KEYS.ATTRACTIONS);
  localStorage.removeItem(STORAGE_KEYS.HOTELS);
  localStorage.removeItem(STORAGE_KEYS.ITINERARIES);
  localStorage.removeItem(STORAGE_KEYS.NEXT_REF);
  refreshAllCaches();
  window.dispatchEvent(new Event('lobo_storage_updated'));
}
