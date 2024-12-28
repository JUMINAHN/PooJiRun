import { useCallback, useEffect, useRef, useState } from "react"
import LoadingPage from "./LoadingPage"
import { useDispatch, useSelector } from "react-redux"
import { getCurrentLocation } from "../store/slices/locationSlice" //action 파일

// 일단 2. 긴급 버튼 위치 => 마커 1개 === nearestToiles
// 일단 3. 검색 위치 => 주변 검색 5개? === toilet

const KakaoMap = ({ nearestToilet, changeAddress }) => {
  const [addressChange, setAddressChange] = useState("") //초기값
  const [loadMap, setLoadMap] = useState(false) //맵이 로드되었을 때 실행되도록
  //map이랑 geolocator, marker 인스턴스 생성
  const mapInstance = useRef(null) //초기값 null로
  const markerInstance = useRef(null)
  const geocoderInstance = useRef(null)

  const giveAddressData = useCallback((result, status) => {
    // isSubscribed: 컴포넌트가 마운트된 상태인지 확인
    // status === OK: API 호출이 성공했는지 확인
    if (status === window.kakao.maps.services.Status.OK) {
      // result[0].address.address_name: 첫 번째 결과의 주소명을 가져옴
      setAddressChange(result[0].address.address_name)
    }
  }, [])

  //저장소에서 가져오기
  const dispatch = useDispatch()
  const { coordinate = { latitude: null, longitude: null }, success, error } = useSelector((state) => state.location)
  useEffect(() => {
    dispatch(getCurrentLocation())
  }, []) //컴포넌트 마운트시에만 호출 => Q. 궁금한게 그럼 추후 위치가 변경될때는? -> 한번 위치받아오면 끝이 아닌지?? QQ

  if (nearestToilet) {
    console.log(nearestToilet, "innerkakomap")
  }
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "text/javascript"
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_APP_KEY}&libraries=services&autoload=false`
    script.async = true
    script.onload = () => {
      window.kakao.maps.load(() => {
        setLoadMap(true)
        geocoderInstance.current = new window.kakao.maps.services.Geocoder() //이때 geocoder 생성 => map이 로드되었을떄 geocoder 생성!
      })
    }
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [])

  useEffect(() => {
    let isSubscribed = true
    if (loadMap && coordinate.latitude !== null && coordinate.longitude !== null) {
      const container = document.getElementById("map")
      if (container && isSubscribed) {
        if (!mapInstance.current) {
          mapInstance.current = new window.kakao.maps.Map(container, {
            center: new window.kakao.maps.LatLng(coordinate.latitude, coordinate.longitude),
            level: 3,
          })
        } else {
          const newCenter = new window.kakao.maps.LatLng(coordinate.latitude, coordinate.longitude)
          mapInstance.current.setCenter(newCenter) //여기서 set은 뭔지? ref 자체에 set컴포넌트가 생기는건지..? => 해당 내용뭔지 모르겠음
        }

        if (markerInstance.current) {
          markerInstance.current.setMap(null) //이건 기존 kakao맵에 있는 setMap을 사용하는 것 같긴한데
        }
        markerInstance.current = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(coordinate.latitude, coordinate.longitude),
          map: mapInstance.current,
        })
        geocoderInstance.current?.coord2Address(coordinate.longitude, coordinate.latitude, giveAddressData)
      }
    } //if문
    return () => {
      isSubscribed = false //
    }
  }, [loadMap, coordinate, nearestToilet]) //현재 위치가 바뀔 떄 마다 => 원래 Q. 원래 loadMap을 넣었었는데 그럼 맵을 로드할때마다 새로운곳에 가지기 때문에 상관이 없는건지?
  //그냥 맵은 로딩한번되고, 그뒤에 coordinate에 의해서 좌표가 바꾸는거 아닌지..?

  //다음 랜더링 사이클로 지연
  useEffect(() => {
    if (addressChange) {
      //이러면 undefined랑 ""이 아닐때가 자동 필터림 => undefined는 false이고 ""는 ?? false?
      changeAddress(addressChange)
    }
  }, [addressChange])

  //return문
  return <div className="KakaoMap">{loadMap ? <div id="map" style={{ width: "100%", height: "500px" }}></div> : <LoadingPage />}</div>
}

export default KakaoMap
