import React, { forwardRef } from 'react';
import { GoogleMap, Marker, Polyline, useLoadScript, GoogleMapProps } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 17.3850,
  lng: 78.4867
};

interface MapMarker {
  position: google.maps.LatLngLiteral;
  title: string;
  color?: string;
}

interface MapPolyline {
  path: google.maps.LatLngLiteral[];
  color: string;
}

interface MapComponentProps {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  markers?: MapMarker[];
  polylines?: MapPolyline[];
  onMapClick?: (latLng: google.maps.LatLngLiteral) => void;
  onMarkerDragEnd?: (e: google.maps.MapMouseEvent) => void;
  draggableMarker?: google.maps.LatLngLiteral;
}

const MapComponent = forwardRef<GoogleMap | null, MapComponentProps>(
  (
    {
      center = defaultCenter,
      zoom = 14,
      markers = [],
      polylines = [],
      onMapClick,
      onMarkerDragEnd,
      draggableMarker
    },
    ref
  ) => {
    const { isLoaded } = useLoadScript({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'
    });

    if (!isLoaded) return <div>Loading Map...</div>;

    return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onClick={(e) => {
          if (onMapClick && e.latLng) {
            onMapClick({
              lat: e.latLng.lat(),
              lng: e.latLng.lng()
            });
          }
        }}
        ref={ref}
      >
        {draggableMarker && (
          <Marker
            position={draggableMarker}
            title="Your Location"
            draggable
            onDragEnd={onMarkerDragEnd}
          />
        )}
        
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            title={marker.title}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: marker.color || '#FF0000',
              fillOpacity: 1,
              strokeWeight: 0,
              scale: 10
            }}
          />
        ))}
        
        {polylines.map((polyline, index) => (
          <Polyline
            key={index}
            path={polyline.path}
            options={{
              strokeColor: polyline.color,
              strokeOpacity: 1,
              strokeWeight: 4
            }}
          />
        ))}
      </GoogleMap>
    );
  }
);

MapComponent.displayName = 'MapComponent';

export default MapComponent;