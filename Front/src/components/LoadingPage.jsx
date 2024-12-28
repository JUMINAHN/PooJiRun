import loadingImg from "../assets/loading/loadingbar.gif"
import skateloading from "../assets/loading/skateloading.gif"
import loading from "../assets/loading/loading.gif"
import "./LoadingPage.css"

const LoadingPage = () => {
  return (
    <div className="LoadingPage">
      <p>데이터 불러오는 중...</p>
      <div className="loading_img">
        <img src={loading} alt="loadingImg" />
      </div>
    </div>
  )
}

export default LoadingPage
