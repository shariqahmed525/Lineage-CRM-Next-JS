// @ts-ignore

'use client';

import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button,
} from '@chakra-ui/react';
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import Map, {
  NavigationControl,
  Layer,
  Source,
  MapRef,
  GeolocateControl,
  Popup,
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { WebMercatorViewport } from 'viewport-mercator-project';
import {
  Spinner, Flex, Text, Box,
} from '@chakra-ui/react'; // Import additional components

import ErrorBoundary from '@/app/components/ErrorBoundary';
import { useData } from '@/app/contexts/DataFetchContext';
import { useLeads } from '@/app/contexts/LeadsContext';


const LeadMap = () => {
  'use client';

  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const mapRef = useRef<MapRef>(null);

  const {
    filteredLeads,
    selectedLead,
    setSelectedLead,
    getLeadById,
    isLoading,
  } = useLeads();

  const { getLeadStatusById } = useData();

  console.log(filteredLeads);

  const [selectedMarker, setSelectedMarker] = useState<string | null>('');
  const [popoverInfo, setPopoverInfo] = useState(null);

  const [isInitiallyLoading, setIsInitiallyLoading] = useState(true); // New state to track initial loading

  // Memoize the valid leads by filtering out any with invalid lat/lng values
  const validLeads = useMemo(() => filteredLeads?.filter((lead) => {
    const lat = lead?.leads_locations?.[0]?.locations?.lat;
    const lng = lead?.leads_locations?.[0]?.locations?.lng;
    return !Number.isNaN(lat) && !Number.isNaN(lng);
  }),
  [filteredLeads]);

  const MIN_ZOOM = 0; // Minimum zoom level allowed by the map
  const MAX_ZOOM = 22; // Maximum zoom level allowed by the map

  const getGeographicalCenter = (leads) => {
    if (!leads.length) return { latitude: 0, longitude: 0 }; // Default to a valid location if no leads

    const sumCoords = leads.reduce((acc, lead) => {
      const lat = lead?.leads_locations?.[0]?.locations?.lat;
      const lng = lead?.leads_locations?.[0]?.locations?.lng;
      if (typeof lat === 'number' && typeof lng === 'number') {
        acc.lat += lat;
        acc.lng += lng;
      }
      return acc;
    },
    { lat: 0, lng: 0 });

    const count = leads.length;
    const latitude = sumCoords.lat / count;
    const longitude = sumCoords.lng / count;

    return {
      latitude: isNaN(latitude) ? 0 : latitude,
      longitude: isNaN(longitude) ? 0 : longitude,
    };
  };

  const getViewportBounds = (leads) => {
    if (!leads?.length) return null;

    const lats = leads
      ?.map(lead => parseFloat(lead?.leads_locations[0]?.locations?.lat))
      ?.filter(lat => !isNaN(lat)) || [];
    const lngs = leads
      ?.map(lead => parseFloat(lead?.leads_locations[0]?.locations?.lng))
      ?.filter(lng => !isNaN(lng)) || [];

    // console.log('Got to hear baby', {
    //   minLat,
    //   maxLat,
    //   minLng,
    //   maxLng,
    // });

    if (lats.length === 0 || lngs.length === 0) return null;

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // Validate coordinates before calling fitBounds
    if (isNaN(minLat) || isNaN(maxLat) || isNaN(minLng) || isNaN(maxLng)) {
      console.error('Invalid coordinates:', {
        minLat,
        maxLat,
        minLng,
        maxLng,
      });
      return null;
    }

    const width = window?.innerWidth;
    const height = window?.innerHeight;

    const viewport = new WebMercatorViewport({ width, height });
    const viewportResult = viewport?.fitBounds([
      [minLng, minLat],
      [maxLng, maxLat],
    ],
    { padding: 50 });
    const longitude = viewportResult?.longitude;
    const latitude = viewportResult?.latitude;
    const zoom = viewportResult?.zoom;

    const adjustedZoom = Math.max(MIN_ZOOM, Math.min(zoom - 1, MAX_ZOOM));

    return { longitude, latitude, zoom: adjustedZoom };
  };

  const [viewport, setViewport] = useState(() => {
    const initialCenter = getGeographicalCenter(validLeads);
    return {
      latitude: initialCenter?.latitude || 0,
      longitude: initialCenter?.longitude || 0,
      zoom: 5,
      transitionDuration: 2000,
    };
  });

  useEffect(() => {
    const bounds = getViewportBounds(filteredLeads);
    if (bounds) {
      setViewport(prevViewport => ({
        ...prevViewport,
        latitude: bounds?.latitude || 0,
        longitude: bounds?.longitude || 0,
        zoom: bounds?.zoom,
        transitionDuration: 2000,
      }));
    }
  }, [filteredLeads]);

  useEffect(() => {
    if (isInitiallyLoading && !isLoading) {
      setIsInitiallyLoading(false);
    }
  }, [isLoading, isInitiallyLoading]);

  const handleMove = useCallback((event: any) => {
    setViewport(event?.viewState);
  }, []);

  const handleHover = useCallback((event) => {
    const map = mapRef.current?.getMap();
    if (!map) return; // Add this line
    const features = map.queryRenderedFeatures(event.point, {
      layers: ['unclustered-point'],
    });
    if (features?.length) {
      const feature = features[0];
      const { properties } = feature;
      if (
        properties?.lead_status_id
          && properties?.id
          && getLeadById(properties.id)?.persons
      ) {
        setPopoverInfo({
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0],
          statusName:
              getLeadStatusById(properties.lead_status_id)?.status_name
              || 'Status Unknown',
          names:
              getLeadById(properties.id)
                ?.persons?.map(person => `${person.first_name} ${person.last_name}`)
                .join('\n') || 'Names not available',
          date:
              getLeadById(properties.id)?.record_day || 'Date not available',
        });
      } else {
        setPopoverInfo(null);
      }
      map.getCanvas().style.cursor = 'pointer';
    } else {
      setPopoverInfo(null);
      map.getCanvas().style.cursor = '';
    }
  },
  [getLeadById, getLeadStatusById]);

  const handleMouseLeave = useCallback((event) => {
    const map = mapRef.current?.getMap();
    if (map?.getCanvas()?.style) {
      map.getCanvas().style.cursor = '';
    }
  }, []);

  const leadsGeoJSON = useMemo(() => {
    const geoJSON = {
      type: 'FeatureCollection',
      features: validLeads.map((lead) => {
        const lat = lead?.leads_locations?.[0]?.locations?.lat || 0;
        const lng = lead?.leads_locations?.[0]?.locations?.lng || 0;
        const leadStatus = getLeadStatusById(lead?.lead_status_id);
        const badgeColor = leadStatus?.badge_color_hexcode || '#000000'; // Default to black if no color is specified
        const name = leadStatus?.status_name || ''; // Fetch the name property

        // Calculate the code based on the name
        let code = '';
        if (name) {
          const words = name.split(' ');
          if (words.length > 1) {
            code = `${words[0][0]}${words[1][0]}`; // First letter of the first two words
          } else {
            code = name.slice(0, 2); // First two letters of the name
          }
        }

        return {
          type: 'Feature',
          properties: {
            ...lead,
            badgeColor,
            name,
            code,
          }, // Include code in properties
          geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
        };
      }),
    };
    console.log(geoJSON); // Debugging to see the structure
    return geoJSON;
  }, [validLeads, getLeadStatusById]); // Include getLeadStatusById in dependencies

  useEffect(() => {
    if (selectedLead) {
      const lat = selectedLead?.leads_locations?.[0]?.locations?.lat;
      const lng = selectedLead?.leads_locations?.[0]?.locations?.lng;

      if (lat && lng) {
        setViewport({
          latitude: lat,
          longitude: lng,
          zoom: 14,
          transitionDuration: 2000,
        });
      }
    }
  }, [selectedLead]);

  useEffect(() => {
    if (selectedLead) {
      setSelectedMarker(selectedLead.id);
    } else {
      setSelectedMarker('');
    }
  }, [selectedLead]);

  const handleMapClick = useCallback((event: any) => {
    const features = mapRef.current?.queryRenderedFeatures(event.point, {
      layers: ['clusters', 'unclustered-point'],
    });

    if (features?.length) {
      const cluster = features[0];
      console.log('Cluster clicked:', cluster); // Debugging output to inspect the cluster structure

      if (cluster.properties.cluster) {
        const longitude = cluster?.geometry?.coordinates[0];
        const latitude = cluster?.geometry?.coordinates[1];

        if (typeof longitude === 'number' && typeof latitude === 'number') {
          setViewport(prevViewport => ({
            ...prevViewport,
            longitude,
            latitude,
            zoom: Math.min(prevViewport.zoom + 1, MAX_ZOOM), // Safely increase zoom
            transitionDuration: 500,
          }));
        } else {
          console.error('Invalid coordinates:', longitude, latitude);
        }
      } else {
        const clickedFeatureProperties = cluster.properties;
        if (clickedFeatureProperties && 'id' in clickedFeatureProperties) {
          const leadToSelect = getLeadById(clickedFeatureProperties.id);
          setSelectedLead(leadToSelect);
          setSelectedMarker(clickedFeatureProperties?.id?.toString());
        } else {
          setSelectedLead(null);
          setSelectedMarker('');
        }
      }
    }
  },
  [MAX_ZOOM, setSelectedLead, getLeadById]);

  const clusterLayer = useMemo(() => ({
    id: 'clusters',
    type: 'circle' as const,
    source: 'leads',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#7EC8E3', // Light blue for 1-10 points
        11,
        '#fff9c4', // Light yellow for 11-99 points
        100,
        '#f28cb1', // Pink for 100-900 points
        900,
        '#D8BFD8', // Light purple for 900+ points
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        15, // 1-10 points
        11,
        20, // 11-99 points
        100,
        25, // 100-900 points
        900,
        30, // 900+ points
      ],
    },
  }),
  [selectedMarker]);

  const unclusteredPointLayer = useMemo(() => ({
    id: 'unclustered-point',
    type: 'circle' as const,
    source: 'leads',
    filter: ['!', ['has', 'point_count']],
    layout: {
      'text-field': ['get', 'code', ['properties']], // Use the code property from properties
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12,
      'text-transform': 'uppercase', // Ensure text is in uppercase
      'text-allow-overlap': true, // Ensure text overlaps with the circles if needed
    },
    paint: {
      'circle-color': [
        'case',
        ['==', ['get', 'id'], selectedMarker],
        'green', // Highlight color for selected marker
        ['get', 'badgeColor', ['properties']], // Use badgeColor from properties
      ],
      'circle-radius': 12,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
    },
  }),
  [selectedMarker]);

  const clusterCountLayer = useMemo(() => ({
    id: 'cluster-count',
    type: 'symbol' as const,
    source: 'leads',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12,
    },
    paint: {
      'text-color': '#000000', // Black text color
    },
  }),
  []); // No dependencies needed here unless they affect the layer

  const unclusteredPointCountLayer = {
    id: 'unclustered-point-count',
    type: 'symbol' as const,
    source: 'leads',
    filter: ['!', ['has', 'point_count']], // Apply to features not in a cluster
    layout: {
      'text-field': ['get', 'code', ['properties']], // Use the code property from properties
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12,
      'text-transform': 'uppercase', // Ensure text is in uppercase
      'text-allow-overlap': true, // Ensure text overlaps with the circles if needed
    },
    paint: {
      'text-color': '#000000', // Text color black
    },
  };

  return (
    <ErrorBoundary>
      {showLocationModal && (
        <Modal
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Location Services Required</ModalHeader>
            <ModalBody>
              <Text>Please enable location services to use this feature.</Text>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="green"
                onClick={() => {
                  setShowLocationModal(false);
                  navigator.geolocation.getCurrentPosition((position) => {
                    console.log('Location access granted');
                    // You can also trigger the GeolocateControl here if needed
                    const geolocateControl = mapRef.current
                      ?.getMap()
                      ?.getControlByType('GeolocateControl');
                    if (geolocateControl) {
                      geolocateControl.trigger();
                    }
                  },
                  (error) => {
                    console.error('Error accessing location:', error);
                  });
                }}
              >
                Enable Location Services
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {isInitiallyLoading ? (
        <Flex
          width="100%"
          height="100vh"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner color="green.500" size="xl" />
          <Text mt={4} ml={4}>
            Hang tight, we are gathering your leads.
          </Text>
        </Flex>
      ) : (
        <Box
          width="100%"
          height="100%"
          minHeight="100%"
          minWidth="100%"
          maxWidth="100%"
        >
          <Map
            ref={mapRef}
            {...viewport}
            onMove={handleMove}
            onClick={handleMapClick}
            onMouseMove={handleHover}
            onMouseLeave={handleMouseLeave}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            interactiveLayerIds={['clusters', 'unclustered-point']}
          >
            <Source
              id="leads"
              type="geojson"
              data={leadsGeoJSON}
              cluster
              clusterMaxZoom={14}
              clusterRadius={50}
            >
              <Layer {...clusterLayer} />
              <Layer {...unclusteredPointLayer} />
              <Layer
                id={clusterCountLayer.id}
                type={clusterCountLayer.type}
                source={clusterCountLayer.source}
                layout={clusterCountLayer.layout}
                paint={clusterCountLayer.paint}
              />
              <Layer
                id={unclusteredPointCountLayer.id}
                type={unclusteredPointCountLayer.type}
                source={unclusteredPointCountLayer.source}
                layout={unclusteredPointCountLayer.layout}
                paint={unclusteredPointCountLayer.paint}
              />
            </Source>
            <NavigationControl />
            <GeolocateControl
              positionOptions={{ enableHighAccuracy: true }}
              trackUserLocation={isLocationEnabled}
              showUserLocation
              onError={() => setShowLocationModal(true)}
            />
            {popoverInfo && (
              <Popup
                latitude={popoverInfo.latitude}
                longitude={popoverInfo.longitude}
                closeButton={false}
                closeOnClick={false}
                offset={7}
              >
                <div>
                  <strong>Names:</strong>
                  {' '}
                  {popoverInfo.names}
                  <br />
                  <strong>Status:</strong>
                  {' '}
                  {popoverInfo.statusName}
                  <br />
                  <strong>Date:</strong>
                  {' '}
                  {new Date(popoverInfo?.date).toLocaleDateString('en-US', {
                    year: '2-digit',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </div>
              </Popup>
            )}
          </Map>
        </Box>
      )}
    </ErrorBoundary>
  );
};

export default LeadMap;
