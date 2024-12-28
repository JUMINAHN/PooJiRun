import { useState } from "react"
import { Route, Routes } from "react-router-dom"
import "./App.css"
import KakaoMap from "./components/KakaoMap"
import useGeolocation from "./hooks/useGeolocation"
import EmergencyButton from "./components/EmergencyButton"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import AddToilet from "./pages/AddToilet"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import Likes from "./pages/Likes"
import Notify from "./pages/Notify"
import Settings from "./pages/Settings"

// display 기준
// 마우스 커서 똥으로 만들기
// 버튼 컴포넌트
// 공동 useState or useContextAPI => 실제 reducer 사용

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        Home
      </Route>
      <Route path="/addtoilet" element={<AddToilet />}>
        AddToilet
      </Route>
      <Route path="/login" element={<Login />}>
        Login
      </Route>
      <Route path="/signup" element={<SignUp />}>
        SignUp
      </Route>
      <Route path="/likes" element={<Likes />}>
        Likes
      </Route>
      <Route path="/notify" element={<Notify />}>
        Notify
      </Route>
      <Route path="/settings" element={<Settings />}>
        Settings
      </Route>
    </Routes>
  )
}

export default App
