// src/components/KakaoMap.js
import { useEffect } from "react"

const KakaoMap = ({ currentLocation, nearestToilet }) => {
  useEffect(() => {
    const mapScript = document.createElement("script")
    mapScript.async = true
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_APP_KEY}&autoload=false`
    document.head.appendChild(mapScript)

    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map")
        const options = {
          center: new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
          level: 3,
        }
        const map = new window.kakao.maps.Map(container, options)

        // 현재 위치 마커
        new window.kakao.maps.Marker({
          map: map,
          position: new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
          title: "현재 위치",
        })

        // 가까운 화장실 마커 (있을 경우)
        if (nearestToilet) {
          new window.kakao.maps.Marker({
            map: map,
            position: new window.kakao.maps.LatLng(nearestToilet.latitude, nearestToilet.longitude),
            title: nearestToilet.name,
          })
        }
      })
    }
    mapScript.addEventListener("load", onLoadKakaoMap)

    return () => mapScript.removeEventListener("load", onLoadKakaoMap)
  }, [currentLocation, nearestToilet])

  // 맵 넓이 가득차게 바꿔야 함
  return <div id="map" style={{ width: "100%", height: "400px" }} />
}

export default KakaoMap
