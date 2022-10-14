import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Link } from 'react-router-dom';


const MapPage = ({ currentPosition, zoom, markers, spots }) => {

    const { lat, lng } = currentPosition;
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_MAPS_KEY
    })

    const containerStyle = {
        width: '100%',
        height: '100%'
    };

    const [map, setMap] = useState(null)

    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, [])

    const image =
        "https://i.imgur.com/uCSKTmI.png";

    return (
        <>
            {isLoaded && <GoogleMap
                mapContainerStyle={containerStyle}
                zoom={zoom}
                center={{ lat: Number(lat), lng: Number(lng) }}
                onUnmount={onUnmount}
            >
                {markers.length > 0 && markers.map((marker, idx) =>
                    <Marker key={idx}
                        position={{ lat: Number(marker.lat), lng: Number(marker.lng) }}
                        title='Where you stay'
                        icon={image}
                        clickable={true}
                        streetView={false} />
                )}
                {spots.length > 0 && spots.map((spot) =>
                    <InfoWindow key={spot.id}
                        position={{ lat: Number(spot.lat), lng: Number(spot.lng) }}
                        options={{ disableAutoPen: true }}
                    >
                        <Link className="google-map-infowindow" to={`/spots/${spot.id}`}>
                            <span>${spot.price}</span>
                        </Link>
                    </InfoWindow>
                )}
            </GoogleMap>}
        </>
    );

}

export default MapPage;
