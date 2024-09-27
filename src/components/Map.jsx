import React, { useEffect, useState } from 'react'
import styles from './Map.module.css'
import { useNavigate , useSearchParams } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import { useCities } from '../contexts/CitiesContext'
import Button from './Button'
import { UseGeolocation } from '../hooks/UseGeolocation'
import { useUrlPositions } from '../hooks/useUrlPositions'

export default function Map() {
  const [mapPosition, setMapPostion] = useState([40 , 0])
  const { cities } = useCities()
  // console.log(cities)

  
  const {isLoading:isLoadingPosition , position:geolocationPosition , getPosition} = UseGeolocation()
  
  // const [searchParams] = useSearchParams()
  // const mapLat = searchParams.get('lat')
  // const mapLng= searchParams.get('lng')
  
  const [mapLat , mapLng] = useUrlPositions()
  // console.log(mapLat , mapLng)
  
  useEffect(function(){
   if(mapLat && mapLng) setMapPostion([mapLat , mapLng])
  },[mapLat , mapLng])

  useEffect(function(){
    if(geolocationPosition){
      setMapPostion([geolocationPosition.lat , geolocationPosition.lng])
    }
  },[geolocationPosition])
  return (
    <div className={styles.mapContainer} >
      {!geolocationPosition && <Button type='position' onClick={getPosition}>{isLoadingPosition ? 'Loading...' : 'Use Your Position'}</Button>}

      <MapContainer center={mapPosition} zoom={6} scrollWheelZoom={true} className={styles.map}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (<Marker position={[city.position.lat, city.position.lng]} key={city.id}>
          <Popup>
            <span>{city.emoji}</span>
            <span>{city.cityName}</span>
          </Popup>
        </Marker>))}

        <ChangeCenter position={mapPosition}/>
        <DetectClick/>
      </MapContainer>
    </div>

  )
}

function ChangeCenter({position}){
  const map = useMap()
  map.setView(position)
  return null
}

function DetectClick(){
  const navigate = useNavigate()
  useMapEvents({
    click: (e) => {
    // console.log(e)
    navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    }
  })
}
