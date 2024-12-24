// 지도 컴포넌트
import { useState } from "react"
import { useEffect } from "react"

const MapComponent = () => {
  const [userLocation, setUserLocation] = useState(null)

  useEffect(() => {
    // 실시간 위치 추적
    navigator.geolocation.watchPosition((position) => {
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
      // Django 서버로 현재 위치 전송
      sendLocationToServer(position.coords)
    })
  }, [])

  return <Map center={userLocation}>{/* 지도 마커 등 UI 컴포넌트 */}</Map>
}

export default MapComponent
