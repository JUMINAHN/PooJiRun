import React, { useState } from "react"

// 거리 계산 함수
const calculateDistance = (startLat, startLng, endLat, endLng) => {
  return new Promise((resolve, reject) => {
    // 직선거리 계산
    const start = new kakao.maps.LatLng(startLat, startLng)
    const end = new kakao.maps.LatLng(endLat, endLng)

    // getDistance 메서드를 사용하여 미터 단위의 직선거리 계산
    const lineDistance = Math.round(start.getLat() - end.getLat()) * 111000

    // 피타고라스 정리를 사용하여 대략적인 직선거리 계산
    const latDistance = (start.getLat() - end.getLat()) * 111000 // 위도 1도당 약 111km
    const lngDistance = (start.getLng() - end.getLng()) * 88400 // 위도 38도 기준 경도 1도당 약 88.4km
    const distance = Math.sqrt(Math.pow(latDistance, 2) + Math.pow(lngDistance, 2))

    resolve({
      distance: `${(distance / 1000).toFixed(1)}km`,
      duration: `약 ${Math.round((distance / 1000) * 15)}분`, // 도보 평균 속도 4km/h 기준
    })
  })
}
const EmergencyButton = ({ location, onToiletFound }) => {
  const [nearestToiletInfo, setNearestToiletInfo] = useState(null)

  const handleEmergencyClick = async () => {
    if (location.loaded && location.coordinates.lat && location.coordinates.lng) {
      try {
        const response = await fetch(`http://localhost:8000/api/emergency/?latitude=${location.coordinates.lat}&longitude=${location.coordinates.lng}`)
        const data = await response.json()

        if (response.ok) {
          const distanceInfo = await calculateDistance(location.coordinates.lat, location.coordinates.lng, data.latitude, data.longitude)

          setNearestToiletInfo({
            ...data,
            estimated_distance: distanceInfo.distance,
            estimated_duration: distanceInfo.duration,
          })
        }
      } catch (error) {
        console.error("에러:", error)
        alert("거리 계산에 실패했습니다.")
      }
    }
  }
  return (
    <div>
      <button onClick={handleEmergencyClick}>긴급 화장실 찾기</button>
      {nearestToiletInfo && (
        <div>
          <h3>가장 가까운 화장실 정보</h3>
          <p>이름: {nearestToiletInfo.name}</p>
          <p>거리: {nearestToiletInfo.estimated_distance}</p>
          <p>예상 소요 시간: {nearestToiletInfo.estimated_duration}</p>
        </div>
      )}
    </div>
  )
}

export default EmergencyButton
