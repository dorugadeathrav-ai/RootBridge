import React, { createContext, useContext, useState, useEffect } from 'react'

type LocationContextType = {
  location: { lat: number; lng: number } | null;
  locationError: string | null;
  manualLocation: { city: string; pincode: string } | null;
  setManualLocation: (loc: { city: string; pincode: string }) => void;
  requestLocation: () => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [manualLocation, setManualLocation] = useState<{ city: string; pincode: string } | null>(null);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationError(null);
        },
        (err) => {
          console.warn('Location permission denied or error:', err);
          setLocationError('Location unavailable');
        }
      );
    } else {
      setLocationError('Geolocation not supported by this browser.');
    }
  };

  useEffect(() => {
    // Optionally auto-request on load, but better to let user click or just try it silently
    // requestLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, locationError, manualLocation, setManualLocation, requestLocation }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocationContext must be used within LocationProvider');
  return context;
}
