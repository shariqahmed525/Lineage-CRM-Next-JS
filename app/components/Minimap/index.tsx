import { Box } from '@chakra-ui/react';
import React, { useEffect, useState, useRef } from 'react';
import Map, { Source, Layer, MapRef } from 'react-map-gl';

interface MinimapProps {
  coordinates: { lat: number; lng: number }[];
}

const Minimap: React.FC<MinimapProps> = ({ coordinates }) => {
  const mapRef = useRef<MapRef>(null);
  const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

  const [viewport, setViewport] = useState({
    latitude: coordinates?.[0]?.lat || 0,
    longitude: coordinates?.[0]?.lng || 0,
    zoom: 12,
  });

  useEffect(() => {
    if (coordinates?.length > 0) {
      setViewport({
        latitude: coordinates?.[0]?.lat,
        longitude: coordinates?.[0]?.lng,
        zoom: 12,
      });
    }
  }, [coordinates]);

  const markerGeoJSON = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [coordinates?.[0]?.lng, coordinates?.[0]?.lat],
        },
      },
    ],
  };

  const markerLayer = {
    id: 'marker-layer',
    type: 'circle',
    source: 'marker',
    paint: {
      'circle-radius': 10,
      'circle-color': '#008D3F',
    },
  };

  return (
    <Box mt={4} width="100%" height="100%">
      <Map
        ref={mapRef}
        {...viewport}
        onMove={evt => setViewport(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={mapboxAccessToken}
        attributionControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        <Source id="marker" type="geojson" data={markerGeoJSON} />
        <Layer {...markerLayer} />
      </Map>
    </Box>
  );
};

export default Minimap;