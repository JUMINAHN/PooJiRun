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

//지금해야할 것 -> 현 주소 경/위도값을 활용해서 현재 주소값 추출

const KakaoMap = ({ nearestToilet, changeAddress }) => {
  const [addressChange, setAddressChange] = useState("") //초기값
  const [loadMap, setLoadMap] = useState(false) //맵이 로드되었을 때 실행되도록

  //저장소에서 가져오기
  const dispatch = useDispatch()
  const { coordinate = { latitude: null, longitude: null }, success, error } = useSelector((state) => state.location)
  useEffect(() => {
    dispatch(getCurrentLocation())
  }, [coordinate]) //위치가 바뀔때마다 호출됨

  if (nearestToilet) {
    console.log(nearestToilet, "innerkakomap")
  }

  //kakao Map 사용을 위한 script 생성
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "text/javascript"
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_APP_KEY}&libraries=services&autoload=false`
    script.async = true
    // 스크립트가 로드되면 호출되는 함수
    script.onload = () => {
      window.kakao.maps.load(() => {
        setLoadMap(true)
      })
    }
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [])

  //지금 약간 호출 속도 느려짐 => 지금 보면 랜더링 겁나 많이 됨.. 뭐지?
  //map이 로드되고, 경/위도를 받아온 경우만 동작
  useEffect(() => {
    if (loadMap && coordinate.latitude !== null && coordinate.longitude !== null) {
      const container = document.getElementById("map")
      if (container) {
        const options = {
          center: new window.kakao.maps.LatLng(coordinate.latitude, coordinate.longitude),
          level: 3,
        }
        const map = new window.kakao.maps.Map(container, options)

        const markerPosition = new window.kakao.maps.LatLng(coordinate.latitude, coordinate.longitude)
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        })
        marker.setMap(map)

        // 주소-좌표 변환 객체를 생성합니다 => 이제 문제가 없음, 의존성 배열 문제
        const geocoder = new window.kakao.maps.services.Geocoder()
        // 좌표로 행정동 주소 정보를 요청합니다
        // 여기서 그냥 callback함수 빼면 안되는지?
        geocoder.coord2Address(coordinate.longitude, coordinate.latitude, giveAddressData)
        //props에서 전달한 changeAddress에 전달할 데이터입니다.
        function giveAddressData(result, status) {
          if (status === window.kakao.maps.services.Status.OK) {
            //만약 카카오맵의 상태에서 OK가 난다면?
            // console.log(result, "result?")
            // console.log(result[0], "result[0]")
            //regionCOde
            // console.log(result[0].address.address_name, "이름")
            const address = result[0].address.address_name
            // console.log(address, "address 값이 먼가요? => undefined")
            setAddressChange(address)
          }
        }

        //따라서 searchAdd를 실행한다. => 근데 문제는 여기서의 result가 latlng를 말하는건지..?
        // searchAddrFromCoords(coordinate, giveAddressData(coordinate, window.kakao.maps.load))

        //단순 호출만 해본다면? => 단순 호출 자체가 문제가 됨
        console.log(coordinate, "innerkakomap") //근데 이게 단순 coordinate라서 문제인듯
        //카카오자체에서 lag lng로 받음 => 내가 lag lng로 바꿔줘야함 store에서
        //   const coords = {
        //     lat: coordinate.latitude,
        //     lng: coordinate.longitude,
        //   }
        //   searchAddrFromCoords(coords)
        // }
      }
    } //if문
  }, [coordinate, nearestToilet]) //현재 위치가 바뀔 떄 마다

  if (addressChange !== "" && addressChange !== undefined) {
    // console.log(addressChange, "?, 공백이 아니면이라했는데")
    changeAddress(addressChange) //changeAddress
  }

  //return문
  return <div className="KakaoMap">{loadMap ? <div id="map" style={{ width: "100%", height: "500px" }}></div> : <LoadingPage />}</div>
}

export default KakaoMap
