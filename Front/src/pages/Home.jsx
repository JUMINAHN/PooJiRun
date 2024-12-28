import { createContext, useContext, useReducer, useState } from "react"
import Navbar from "../components/Navbar"
import KakaoMap from "../components/KakaoMap"
import useGeolocation from "../hooks/useGeolocation"
import EmergencyButton from "../components/EmergencyButton"
import "./Home.css"
import LoadingPage from "../components/LoadingPage"
import SearchBar from "../components/SearchBar"

const Home = () => {
  const [nearestToilet, setNearestToilet] = useState(null) //이미 선언 nearestTodlet
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

  return (
    <div className="Home">
      <main className="monitor_container">
        <section className="site_title">
          <Navbar />
        </section>

        <section className="main_section">
          <>
            <div className="map_section">
              <KakaoMap nearestToilet={nearestToilet} changeAddress={changeAddress} />
            </div>
            <div className="btn_section">
              <EmergencyButton onToiletFound={setNearestToilet} />
            </div>
          </>
        </section>
        <section className="under_nav">
          <SearchBar searchData={searchData} />
        </section>
      </main>
    </div>
  )
}

export default Home
