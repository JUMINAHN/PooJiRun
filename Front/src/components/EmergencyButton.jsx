// src/components/EmergencyButton.js
import useGeolocation from "../hooks/useGeolocation"

const EmergencyButton = () => {
  const location = useGeolocation()
  const handleEmergencyClick = async () => {
    if (location.loaded && location.coordinates.lat && location.coordinates.lng) {
      // proxy 설정을 위해 전체 URL 사용
      const response = await fetch(`http://localhost:8000/api/emergency/?latitude=${location.coordinates.lat}&longitude=${location.coordinates.lng}`)

      try {
        const data = await response.json() // 직접 text로 변환하지 않고 json() 사용
        if (response.ok) {
          alert(`가장 가까운 화장실: ${data.name} (위도: ${data.latitude}, 경도: ${data.longitude})`)
        } else {
          alert(data.error)
        }
      } catch (error) {
        console.error("JSON 파싱 오류:", error)
        alert("서버에서 올바른 JSON 응답을 받지 못했습니다.")
      }
    } else {
      alert("위치 정보를 가져오는 중입니다.")
    }
  }

  return <button onClick={handleEmergencyClick}>긴급 화장실 찾기</button>
}

export default EmergencyButton
