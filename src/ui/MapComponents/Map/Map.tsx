import { LatLngExpression } from 'leaflet';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvent } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ROUTES } from '../../../App';
import { useCitiesContext } from '../../../contexts/CitiesContext';
import { useGeolocation } from '../../../hooks/useGeolocation';
import { useUrlPosition } from '../../../hooks/useUrlPosition';
import { Button } from '../../common/Buttons';

const Container = styled.div`
  height: 100%;
  background-color: var(--color-dark--2);
  position: relative;

  & .map {
    height: 100%;
  }
`;

export function Map() {
  const [mapPosition, setMapPosition] = useState<[number, number]>([51.505, -0.09]);
  const { cities } = useCitiesContext();
  const { getPosition, position, isLoading: isLoadingPosition, error } = useGeolocation();

  const [lat, lng] = useUrlPosition();

  useEffect(() => {
    if (lat && lng) setMapPosition([lat, lng]);
  }, [lat, lng]);

  useEffect(() => {
    if (position) setMapPosition([position.lat, position.lng]);
  }, [position]);

  return (
    <Container>
      <MapContainer center={mapPosition} zoom={7} className="map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map(city => {
          return (
            <Marker
              key={city.id}
              position={city.position}
              eventHandlers={{ click: () => setMapPosition([city.position.lat, city.position.lng]) }}>
              <Popup>{city.cityName}</Popup>
            </Marker>
          );
        })}

        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
      <Button $type="position" onClick={getPosition}>
        {isLoadingPosition ? 'Getting location...' : error ? "Can't access" : '🔍'}
      </Button>
    </Container>
  );
}

function ChangeCenter({ position }: { position: LatLngExpression }) {
  const map = useMap();
  map.flyTo(position, map.getZoom());
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvent('click', e => navigate(`${ROUTES.form}?lat=${e.latlng.lat}&lng=${e.latlng.lng}`));
  return null;
}
