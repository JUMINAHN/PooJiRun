import { useEffect, useRef, useState } from "react"
import "./EmergencyButton.css"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { getCurrentLocation } from "../store/slices/locationSlice"

//onToiletFound로 => jsx => 위에서 주는 위치 값
const EmergencyButton = ({ onToiletFound }) => {
  //emergencyButton을 누르고 정보 찾기 => 긴급 화장실 찾기 => 일단 여기서만 사용
  const [nearLocation, setNearLocation] = useState()
  //nearLocation 값을 받아오기
  // 모달열기 => 여기가 아니라 검색할 때? -> 이멀전시도 뭐 사용하니깐

  // 현재 위치 받아와야 함
  const dispatch = useDispatch()
  const { coordinate = { latitude: null, longitude: null }, success, error } = useSelector((state) => state.location)
  useEffect(() => {
    dispatch(getCurrentLocation()) //불러오기 -> 현 위치
  }, []) //컴포넌트 마운트시 호출

  // useEffect(() => {
  // axios로 데이터 받아오기 => 대신 try / catch로 비동기
  //cordinate로 바로 못한 이유는 store에서 값을 받아오기 떄문 => 그리고 불필요한 랜더링 방지를 위해서
  const onClickEmergencyBtn = async () => {
    try {
      // 비동기처리를 안했네 => AXIOS 받아올떄 비동기 처리하기
      const response = await axios.get(`http://localhost:8000/api/emergency/?latitude=${coordinate.latitude}&longitude=${coordinate.longitude}`)
      // console.log(response, "response : 응답 확인")
      //정상적으로 응답을 받게되면 -> 거리와 소요시간을 계산함 => 그리고 가까운 toilet 위치를 반환함 => 이 정보를 카카오에게 줄 것
      //따라서 Home에서 진행해야 함 => 여기서 데이터 받아와 어떻게 할 것?
      //promise 객체 => response () => responsedata로 받았는데 이건 뭐..? => data로 받을게없는데
      setNearLocation(response.data) //해당 프로마이스를 어떻게 다루면 좋을지? => data undefined?
    } catch (e) {
      console.log(e, "error 내용 확인")
      new Error("주변 화장실을 받아오는 과정에서 문제가 발생했습니다.")
    }
  }

  // }, [nearLocation, coordinate])

  useEffect(() => {
    if (nearLocation) {
      console.log("response 값이 들어갔나요?", nearLocation)
      //nearlocation이 담기면 다시 => 어케하지
      //관련 내용이 들어간 것을 볼 수 있음
      //해당 내용과 관련된 모달창이 필요함 => 그리고 이 정보를 Home에 주면 KAKAOMAP이 좌표를 만들 것
    }
    onToiletFound(nearLocation)
  }, [nearLocation])

  return (
    <div className="EmergencyButton">
      <button className="btn" onClick={onClickEmergencyBtn}>
        {/* 긴급 화장실 찾기 */}
        💩
      </button>
    </div>
  )
}

export default EmergencyButton
