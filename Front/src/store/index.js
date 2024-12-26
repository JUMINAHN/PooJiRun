import { configureStore } from "@reduxjs/toolkit"
import locationReducer from "./slices/locationSlice"
// redux스토에 전달된 리듀서가 유효하지 않다는 의미

const store = configureStore({
  reducer: {
    // 각 redure의 값을 넣을 애들
    location: locationReducer, //reducer를 명시적으로 표기해야 함 => slice는 액션 리듀서 모두 포함
  },
})

export default store
