// env에 있는 데이터 접근
// vite에는 process가 아님

import { useEffect, useState } from "react"
import LoadingPage from "./LoadingPage"
import { useDispatch, useSelector } from "react-redux"
import { getCurrentLocation } from "../store/slices/locationSlice" //action 파일

// 여기 KAKAOMAP으로 전달받는 내용을 maker들로 표시하는데
// 일단 1. 현위치 == coordinate
// 일단 2. 긴급 버튼 위치 => 마커 1개 === nearestToiles
// 일단 3. 검색 위치 => 주변 검색 5개? === toilet

// geoLocation으로 받은 것을 => redux state로 담는게 현재 best일 것 같음
// 그리고 가까운 화장실 마커 한개
// 근처 화장실 마커

// currentLocation을 받는게 아니라 여기서 직접적으로 사용하게
const KakaoMap = ({ nearestToilet }) => {
  //coordinate 미이용
  const dispatch = useDispatch() // dispatch => action 즉 state값 바꿀 친구
  //state명이 location
  //redux 자체값 가져오기
  const { coordinate = { latitude: null, longitude: null }, success, error } = useSelector((state) => state.location) || {} //내부에 있는 초기값들
  //reudx가져오고 => {}는 왜? QQQ

  //초기값들이 설정이되고 => 얘 자체는 state
  //위치값 가져오는 것 한번이면 됨
  useEffect(() => {
    dispatch(getCurrentLocation()) //dispatch로 선언한거에 => 비동기 메서드 => 즉 set + action 값
  }, [dispatch]) //위치가 바뀔때마다 호출됨

  if (nearestToilet) {
    console.log(nearestToilet)
  }
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
    // loadMap && coordinate?.latitude && coordinate?.longitude
    if (loadMap && coordinate.latitude !== null && coordinate.longitude !== null) {
      //좌표가 유효한 경우에만 실행
      //map이 로드되었을때만 컴포넌트를 띄우겠따.
      const container = document.getElementById("map")
      if (container) {
        const options = {
          // 받아오는 값이 잘못됨
          center: new window.kakao.maps.LatLng(coordinate.latitude, coordinate.longitude),
          level: 3,
        }
        const map = new window.kakao.maps.Map(container, options)

        // 지도 마커 표시 => 그대로 kakaoMap
        const markerPosition = new window.kakao.maps.LatLng(coordinate.latitude, coordinate.longitude)

        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        })
        marker.setMap(map)

        // if (nearestToilet) {
        //   const markerPosition = new window.kakao.maps.LatLng(nearestToilet.lat, nearestToilet.lng)
        //   const marker = new window.kakao.maps.Marker({
        //     position: markerPosition,
        //   })
        //   marker.setMap(map)
        // }
        //지도 위에 표시하도록 설정
        // const iwContent =
        //     '<div style="padding:10px;">현재 위치<br><a href="https://map.kakao.com/link/map/Hello World!,33.450701,126.570667" style="color:blue" target="_blank">카카오맵으로 보기</a> <a href="https://map.kakao.com/link/to/Hello World!,33.450701,126.570667" style="color:blue" target="_blank">카카오 맵으로 길찾기</a></div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
        //   iwPosition = new window.kakao.maps.LatLng(33.450701, 126.570667) //인포윈도우 표시 위치입니다

        // 인포윈도우를 생성합니다
        // const infowindow = new window.kakao.maps.InfoWindow({
        //   position: iwPosition,
        //   content: iwContent,
        // })

        // 마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다
        // infowindow.open(map, marker)
      }
    }
  }, [loadMap, coordinate, nearestToilet]) //map이 로드될떄마다, 현재 위치가 바뀔 떄 마다

  return <div className="KakaoMap">{loadMap ? <div id="map" style={{ width: "100%", height: "500px" }}></div> : <LoadingPage />}</div>
}

export default KakaoMap
