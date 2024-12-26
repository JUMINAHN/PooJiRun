// env에 있는 데이터 접근
// vite에는 process가 아님

import { useEffect, useState } from "react"
import LoadingPage from "./LoadingPage"

// geoLocation으로 받은 것을 => redux state로 담는게 현재 best일 것 같음

const KakaoMap = ({ currentLocation, nearestToilet }) => {
  const [loadMap, setLoadMap] = useState(false) //초기에는 false
  //script 자체를 생성
  useEffect(() => {
    const script = document.createElement("script") //script 자체를 생성
    script.type = "text/javascript"
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_APP_KEY}&autoload=false`
    script.async = true
    // 스크립트 자체가 로드가 완료되면?
    script.onload = () => {
      //load되면
      window.kakao.maps.load(() => {
        setLoadMap(true)
      })
    }
    // script 로드가 완료된 후에 appendChild
    document.head.appendChild(script) //이거하고 난뒤에 chrome => thirdy-party가 이루어짐
    return () => {
      document.head.removeChild(script) //append한 내용 제거
    }
  }, [])

  useEffect(() => {
    if (loadMap) {
      //map이 로드되었을때만 컴포넌트를 띄우겠따.
      const container = document.getElementById("map")
      if (container) {
        const options = {
          // state로 받아오는 반응이 늦어서 이부분 조금 위험하긴 함
          // 초기에 lat, lng : null => 일단 이거 추후 반응형 redux로 관리
          center: new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
          level: 3,
        }
        const map = new window.kakao.maps.Map(container, options)

        // 지도 마커 표시 => 그대로 kakaoMap
        const markerPosition = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng)
        //마커 생성
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        })
        marker.setMap(map) //지도 위에 표시하도록 설정

        // 여기 근처 화장실 더 생기면 하나 더 추가 표시하기
      }
    }
  }, [loadMap, currentLocation]) //map이 로드될떄마다, 현재 위치가 바뀔 떄 마다

  // script가 로드가 완료되면 => 초기화할 수 있도록 해야한다. => 스크립트가 로드된이후 맵 초기화
  return <div className="KakaoMap">{loadMap ? <div id="map" style={{ width: "100%", height: "500px" }}></div> : <LoadingPage />}</div>
}

export default KakaoMap
