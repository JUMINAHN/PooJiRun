import "./MainContainer.css"
import { useState } from "react"
import Navbar from "../components/Navbar"
import KakaoMap from "../components/KakaoMap"
import useGeolocation from "../hooks/useGeolocation"
import EmergencyButton from "../components/EmergencyButton"
import AdvertiseContainer from "../components/AdvertiseContainer"

// 얘네가 공통 컴포넌트 기준점들이 되어야 함?
// 아니다 그냥 HomeComponent자체에서만 활용됨
const MainContainer = () => {
  const location = useGeolocation()
  const [nearestToilet, setNearestToilet] = useState(null)
  const [searchData, setSearchData] = useState(location) //일단 초기값
  console.log(location.coordinates) //lat lng 기반 주소명 찾기?
  // kakao로 뽑아내기
  // 가까운 화장실 정보 modal

  //searchData를 통해서 카카오 map 내용 검색 가능해야함

  const onChangeSearch = (e) => {
    setSearchData(e.target.value)
  }

  const onClickSearch = () => {
    // 서버에 데이터 전송
  }

  return (
    <div className="MainContainer">
      <section className="title_section">
        <Navbar />
      </section>
      {/* <h1>POOJIRUN🏃‍♂️</h1> */}
      {/* <div className="site_navbar"> */}
      {/* </div> */}

      <section className="main_section">
        {location.loaded ? (
          // kakaomap자체가 컴포넌트인데
          // button자체가 컴포넌트인데 화면안에 어떻게 올릴 수 있을까
          <>
            <div className="map_section">
              <KakaoMap currentLocation={location.coordinates} nearestToilet={nearestToilet} />
            </div>
            <div className="btn_section">
              <EmergencyButton location={location} onToiletFound={setNearestToilet} />
            </div>
          </>
        ) : (
          <div className="no_content">
            <p>잠시만 기다려주세요! 위치 정보를 가져오는 중입니다...</p>
          </div>
        )}
      </section>

      <section className="under_nav">
        {/* 여기에 각진 상단 navbar */}
        <div className="search_bar">
          {/* 자동 auto Focusing 되어있게 만들거나 or 현재 주소 자동으로 주소값 받아오거나*/}
          {/* 글씨 폰트 크게 만들기 */}
          {/* placeholder 내용 가운데 */}
          <input value={searchData} onChange={onChangeSearch} type="text" placeholder="   ex) SK법원 앞 Self주유소 OR 양덕동 778-1" />
          <button onClick={onClickSearch}>🔍</button>
          {/* button click시 위치 기준 화장실 찾기 */}
        </div>
        <div className="ad_bar">
          <AdvertiseContainer />
        </div>
      </section>
    </div>
  )
}
export default MainContainer