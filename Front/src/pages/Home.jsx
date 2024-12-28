import { createContext, useContext, useReducer, useState } from "react"
import Navbar from "../components/Navbar"
import KakaoMap from "../components/KakaoMap"
import useGeolocation from "../hooks/useGeolocation"
import EmergencyButton from "../components/EmergencyButton"
import "./Home.css"
import LoadingPage from "../components/LoadingPage"
import SearchBar from "../components/SearchBar"

const Home = () => {
  // 자체적으로 초기 랜더링시에 발생되는 내용을 수행하게 해주는 것

  const location = useGeolocation()
  const [nearestToilet, setNearestToilet] = useState(null)
  //searchData
  const [searchData, setSearchData] = useState("") //일단 초기값

  //searchData를 통해서 카카오 map 내용 검색 가능해야함

  const changeAddress = (addressChange) => {
    setSearchData(addressChange)
  }

  const onChangeSearch = (e) => {
    setSearchData(e.target.value)
  }

  const onClickSearch = () => {
    // 서버에 데이터 전송
  }

  if (searchData !== "") {
    console.log(searchData, "주소지로 반환 완료?? => 못받아오는데")
  }

  return (
    <div className="Home">
      <main className="monitor_container">
        <section className="site_title">
          <Navbar />
        </section>

        <section className="main_section">
          {location.loaded ? (
            // kakaomap자체가 컴포넌트인데
            // button자체가 컴포넌트인데 화면안에 어떻게 올릴 수 있을까
            <>
              <div className="map_section">
                <KakaoMap currentLocation={location.coordinates} nearestToilet={nearestToilet} changeAddress={changeAddress} />
              </div>
              <div className="btn_section">
                <EmergencyButton location={location} onToiletFound={setNearestToilet} />
              </div>
            </>
          ) : (
            <div className="no_content">
              <LoadingPage />
            </div>
          )}
        </section>
        <section className="under_nav">
          <SearchBar searchData={searchData}/>
        </section>
      </main>
    </div>
  )
}

export default Home
