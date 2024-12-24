// src/hooks/useGeolocation.js

import { useState, useEffect } from 'react';

const useGeolocation = () => {
    const [location, setLocation] = useState({ loaded: false, coordinates: { lat: null, lng: null } });

    useEffect(() => {
        const onSuccess = (location) => {
            setLocation({
                loaded: true,
                coordinates: {
                    lat: location.coords.latitude,
                    lng: location.coords.longitude,
                },
            });
        };

        const onError = (error) => {
            console.error(error);
            setLocation({ loaded: true, error });
        };

        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }, []);

    return location;
};

export default useGeolocation;
