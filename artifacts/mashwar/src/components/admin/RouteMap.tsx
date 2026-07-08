import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Order } from '@/lib/meshwarApi';

// Fix for default markers in Leaflet not loading correctly in some bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Helper component to adjust bounds
function MapBounds({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, bounds]);
  return null;
}

export function RouteMap({ order }: { order: Order }) {
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

  useEffect(() => {
    const coords: [number, number][] = [];
    
    // First, add the polyline points if available
    if (order.points && order.points.length > 0) {
      order.points.forEach(p => {
        const lat = parseFloat(p.lat as string);
        const lng = parseFloat(p.lng as string);
        if (!isNaN(lat) && !isNaN(lng)) {
          coords.push([lat, lng]);
        }
      });
    } else {
      // If no points, just use lat_from/to
      const fromLat = parseFloat(order.lat_from as string);
      const fromLng = parseFloat(order.lng_from as string);
      if (!isNaN(fromLat) && !isNaN(fromLng)) coords.push([fromLat, fromLng]);
      
      const toLat = parseFloat(order.lat_to as string);
      const toLng = parseFloat(order.lng_to as string);
      if (!isNaN(toLat) && !isNaN(toLng)) coords.push([toLat, toLng]);
    }
    
    setRouteCoords(coords);
  }, [order]);

  if (routeCoords.length === 0) {
    return (
      <div className="w-full h-full bg-gray-50 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200">
        <p className="text-gray-500 font-bold text-sm">لا تتوفر إحداثيات للمسار</p>
      </div>
    );
  }

  const startCoord = routeCoords[0];
  const endCoord = routeCoords[routeCoords.length - 1];
  const bounds = L.latLngBounds(routeCoords);

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden z-10 border border-gray-200 shadow-inner">
      <MapContainer 
        center={startCoord} 
        zoom={13} 
        style={{ width: '100%', height: '100%', zIndex: 0 }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {startCoord && <Marker position={startCoord} />}
        {endCoord && endCoord !== startCoord && <Marker position={endCoord} />}
        
        {routeCoords.length > 1 && (
          <Polyline positions={routeCoords} color="#22c55e" weight={5} opacity={0.8} />
        )}
        
        <MapBounds bounds={bounds} />
      </MapContainer>
    </div>
  );
}
