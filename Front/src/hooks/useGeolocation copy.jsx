import { useState, useEffect } from "react"

const getAddressFromCoordinates = (lat, lng) => {
  const geocoder = new window.kakao.maps.services.Geocoder()
  return new Promise((resolve, reject) => {
    geocoder.coord2Address(lng, lat, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        resolve(result[0].address.address_name)
      } else {
        reject("주소 변환 실패")
      }
    })
  })
}

const useGeolocation = () => {
  const [location, setLocation] = useState({ loaded: false, coordinates: { lat: null, lng: null }, error: null })

  useEffect(() => {
    const onSuccess = (location) => {
      setLocation({
        loaded: true,
        coordinates: {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        },
        error: null,
      })
    }

    const onError = (error) => {
      console.error("Geolocation Error:", error)
      let errorMessage
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "위치 정보 접근이 거부되었습니다."
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage = "위치 정보를 사용할 수 없습니다."
          break
        case error.TIMEOUT:
          errorMessage = "위치 정보를 가져오는 데 시간이 초과되었습니다."
          break
        case error.UNKNOWN_ERROR:
          errorMessage = "알 수 없는 오류가 발생했습니다."
          break
        default:
          errorMessage = "위치 정보를 가져오는 데 문제가 발생했습니다."
      }
      setLocation({ loaded: true, coordinates: { lat: null, lng: null }, error: errorMessage })
    }

    // 위치 정보 요청
    navigator.geolocation.getCurrentPosition(onSuccess, onError)

    // 클린업 함수 (옵션)
    return () => {
      // 여기서 위치 요청을 취소하는 로직을 추가할 수 있음
    }
  }, [])

  return location
}

export default useGeolocation
