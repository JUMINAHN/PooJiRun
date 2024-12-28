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
          <p>
            <strong>이름:</strong> {toilet.name}
          </p>
          <p>
            <strong>주소:</strong> {toilet.address}
          </p>
          <p>
            <strong>거리:</strong> {toilet.estimated_distance}
          </p>
          <p>
            <strong>예상 소요시간:</strong> {toilet.estimated_duration}
          </p>
          <p>
            <strong>운영시간:</strong> {toilet.opening_hours}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ToiletInfoModal
