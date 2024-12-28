import { useEffect, useState } from "react"
import AdvertiseContainer from "./AdvertiseContainer"
import "./SearchBar.css"
import { useDispatch, useSelector } from "react-redux"
import { getCurrentLocation } from "../store/slices/locationSlice"

const SearchBar = ({ searchData }) => {
  //초기값을 무엇으로 사용할건지?
  // console.log("searchBar", searchData)
  const dispatch = useDispatch()
  const { coordinate, success, error } = useSelector((state) => state.location)

  const [myLocation, setSearchData] = useState(searchData) // 뭐지 또 돌아감 => 아 초기랜더링!!
  useEffect(() => {
    // 계속해서 set에 넣어줘야 문제가 해결됨
    setSearchData(searchData)
  }, [searchData]) //props로 받아오는 실시간 값 조심

  // const [myLocation, setSearchData] = useState(`${searchData}`) //일단 초기값 => 입력 내용
  // 이렇게하면 값은 뜸
  //보류

  //search도 redux로 관리해줘야할 것 같음 => 음?
  //입력창에 나오는 그 주소만 활용하면 되는 것.. => 입력 내용 검색 값 자체를 관리하고 저장해서 사용하느게 아니기 떄문에
  //단순 useState 사용해도 괜찮을 듯?

  // 시간이 지나면 useState의 searchData에 현 위치가 들어가도록
  //따라서 coordinate 자체가 바뀌는 것 => dispatch는 임시
  useEffect(() => {
    dispatch(getCurrentLocation()) //현재 위치값을 넣게 되면 => 이게 또 카카오로 값을 반환해줘야하는 문제가 발생 => 일단 현재값만 제대로 가져와야함
  }, [coordinate, dispatch])

  // console.log(dispatch)
  //action => dispatch 즉 coordinate 확인하면됨
  console.log(coordinate, "?") //이 내용을 카카오에서 변환해야 함

  const onChangeSearch = (e) => {
    setSearchData(e.target.value)
  }

  const onClickSearch = () => {
    // 서버에 데이터 전송
  }

  return (
    <div className="SearchBar">
      <section className="search_section">
        <input value={myLocation} onChange={onChangeSearch} type="text" placeholder={`현재 실시간 주소입니다. : ${searchData}`} />
        <button onClick={onClickSearch}>🔍</button>
      </section>
      <section className="advertise_section">
        <AdvertiseContainer />
      </section>
    </div>
  )
}

export default SearchBar
