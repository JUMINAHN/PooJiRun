// src/App.js
import { useState } from "react"
import "./App.css"
import KakaoMap from "./components/KakaoMap"
import useGeolocation from "./hooks/useGeolocation"
import EmergencyButton from "./components/EmergencyButton"

function App() {
  const location = useGeolocation()
  const [nearestToilet, setNearestToilet] = useState(null)

  return (
    <div className="App">
      <h1>긴급 화장실 찾기</h1>
      {location.loaded ? (
        <>
          <KakaoMap 
            currentLocation={location.coordinates} 
            nearestToilet={nearestToilet}
          />
          <EmergencyButton 
            location={location} 
            onToiletFound={setNearestToilet}
          />
        </>
      ) : (
        <p>위치 정보를 가져오는 중입니다...</p>
      )}
    </div>
  )
}

export default App
