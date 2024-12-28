import { useEffect, useRef, useState } from "react"
import "./EmergencyButton.css"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { getCurrentLocation } from "../store/slices/locationSlice"

const EmergencyButton = ({ onToiletFound }) => {
  const [nearLocation, setNearLocation] = useState()
  const dispatch = useDispatch()
  const { coordinate = { latitude: null, longitude: null }, success, error } = useSelector((state) => state.location)
  useEffect(() => {
    dispatch(getCurrentLocation()) //불러오기 -> 현 위치
  }, []) //컴포넌트 마운트시 호출

   const onClickEmergencyBtn = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/emergency/?latitude=${coordinate.latitude}&longitude=${coordinate.longitude}`)
       setNearLocation(response.data) //해당 프로마이스를 어떻게 다루면 좋을지? => data undefined?
    } catch (e) {
      console.log(e, "error 내용 확인")
      new Error("주변 화장실을 받아오는 과정에서 문제가 발생했습니다.")
    }
  }

  // }, [nearLocation, coordinate])

  useEffect(() => {
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
