// src/App.js

import { useState } from "react"
import "./App.css"
import KakaoMap from "./components/KakaoMap"
import useGeolocation from "./hooks/useGeolocation"
import EmergencyButton from "./components/EmergencyButton"

function App() {
  const location = useGeolocation() // 훅을 호출하여 위치 정보를 가져옵니다.

  return (
    <>
      <h1>내 위치</h1>
      {location.loaded ? (
        <div>
          <p>위도: {location.coordinates.lat}</p>
          <p>경도: {location.coordinates.lng}</p>
        </div>
      ) : (
        <p>위치 정보를 가져오는 중입니다...</p>
      )}
      <EmergencyButton /> {/* 긴급 버튼 컴포넌트 추가 */}
    </>
  )
}

export default App
