// src/components/EmergencyButton.js
const EmergencyButton = ({ location, onToiletFound }) => {
    const handleEmergencyClick = async () => {
      if (location.loaded && location.coordinates.lat && location.coordinates.lng) {
        try {
          const response = await fetch(
            `http://localhost:8000/api/emergency/?latitude=${location.coordinates.lat}&longitude=${location.coordinates.lng}`
          )
          const data = await response.json()
          
          if (response.ok) {
            onToiletFound(data)  // 찾은 화장실 정보를 상위 컴포넌트에 전달
            alert(`가장 가까운 화장실을 찾았습니다: ${data.name}`)
          } else {
            alert(data.error)
          }
        } catch (error) {
          console.error("에러:", error)
          alert("서버 연결에 실패했습니다.")
        }
      } else {
        alert("위치 정보를 가져오는 중입니다.")
      }
    }
  
    return <button onClick={handleEmergencyClick}>긴급 화장실 찾기</button>
  }
  
  export default EmergencyButton
  