// ToiletInfoModal.jsx
import "./ToiletInfoModal.css"
const ToiletInfoModal = ({ toilet, onClose }) => {
  if (!toilet) return null

  return (
    <div className="toilet-modal">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h3>가장 가까운 화장실</h3>
        <div className="info-content">
          <div className="info-section">
            <p>
              <strong>이름:</strong> {toilet.name}
            </p>
            <p>
              <strong>주소:</strong> {toilet.address}
            </p>
          </div>
          <div className="info-section">
            <p>
              <strong>예상 거리:</strong> {toilet.estimated_distance}
            </p>
            <p>
              <strong>예상 소요시간:</strong> {toilet.estimated_duration}
            </p>
          </div>
          <div className="info-section">
            <p>
              <strong>남성용:</strong> {toilet.total_stalls?.male}칸
            </p>
            <p>
              <strong>여성용:</strong> {toilet.total_stalls?.female}칸
            </p>
            <p>
              <strong>장애인 전용칸:</strong> {toilet.is_accessible ? "보유" : "미보유"}
            </p>
          </div>
          <div className="info-section">
            <p>
              <strong>관리기관:</strong> {toilet.management?.agency}
            </p>
            <p>
              <strong>연락처:</strong> {toilet.management?.phone}
            </p>
          </div>
          <div className="info-section">
            <p>
              <strong>CCTV:</strong> {toilet.security?.cctv ? "설치" : "미설치"}
            </p>
            <p>
              <strong>비상벨:</strong> {toilet.security?.emergency_bell ? "설치" : "미설치"}
            </p>
          </div>
          <div className="info-section">
            <p>
              <strong>기본 운영시간:</strong> {toilet.facilities?.opening_hours}
            </p>
            <p>
              <strong>상세 운영시간:</strong> {toilet.facilities?.opening_hours_detail}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ToiletInfoModal
