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
  const [moveBar, setMoveBar] = useState("short") //short와 long

  const onClickChangeNav = () => {
    setMoveBar((prev) => (prev === "short" ? "long" : "short")) //toggle로 진행
  }

  return (
    <header className="Navbar">
      <h1>POOJIRUN🏃‍♂️</h1>
      {/* nav_btn 속성을 short와 long으로 바꿔야 할 것 같음 */}
      <div className={`nav_btn nav_btn_${moveBar}`}>
        {moveBar === "short" ? (
          <div className="nav_short_wrap" onClick={onClickChangeNav}>
            {/* font size 간격 */}
            <div className="nav_short">
              <p>≡</p>
            </div>
          </div>
        ) : (
          <div className="nav_long_wrap" onClick={onClickChangeNav}>
            {navCategory.map((item) => (
              <div className="nav_long" key={item.id} onClick={() => nav(item.link)}>
                <p>{item.category}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
