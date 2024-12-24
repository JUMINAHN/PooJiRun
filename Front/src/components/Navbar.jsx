import { useNavigate } from "react-router-dom"
import "./Navbar.css"
import { useState } from "react"

const navCategory = [
  // 링크로 이동하게 만들기
  { id: 1, category: "X", link: "/" },
  { id: 2, category: "🔐 로그인", link: "/login" },
  { id: 3, category: "🧻 화장실 등록", link: "/addtoilet" },
  { id: 4, category: "❤️ 찜", link: "/likes" },
  { id: 5, category: "📢 공지", link: "/notify" },
  { id: 6, category: "⚙️ 설정", link: "/settings" },
]

const Navbar = () => {
  const nav = useNavigate() // => 관련 링크
  // navbar의 클릭여부에 따라서 bar가 펼쳐지고 안펼쳐지고 => long, short
  const [moveBar, setMoveBar] = useState("short") //short와 long

  const onClickChangeNav = () => {
    // onClickOpenNav() //이거 전달해주고 => 이건 필요없을 것 같음 일단 보류
    setMoveBar((prev) => (prev === "short" ? "long" : "short")) //toggle로 진행
  }

  if (moveBar === "short") {
    //삼항 연산자 넣으니까 에러
    return (
      <div className="Navbar Navbar_short" onClick={onClickChangeNav}>
        {/* font size 간격 */}
        <p className="short_nav">≡</p>
      </div>
    )
  }

  return (
    // {
    // 	moveBar === 'short' ? () : () => why error?
    // }
    <div className="Navbar Navbar_long" onClick={onClickChangeNav}>
      {navCategory.map((item) => (
        <div className="long_nav" key={item.id} onClick={() => nav(item.link)}>
          <p>{item.category}</p>
        </div>
      ))}
    </div>
  )
}

export default Navbar
