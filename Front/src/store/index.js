import { configureStore } from "@reduxjs/toolkit"
import { thunk } from "redux-thunk" //thunk 사용
//named export를 가져와야 할 수 있다.

//Redux의 미들웨어로 비동기 액션 처리
//액션 생성자가 일반 객체 대신 함수를 반환 => dispatch, getState
//thunkMiddleWare == 기본 내보내기 기능

import locationReducer from "./slices/locationSlice"
// redux스토에 전달된 리듀서가 유효하지 않다는 의미

const store = configureStore({
  reducer: {
    // 각 redure의 값을 넣을 애들
    location: locationReducer, //reducer를 명시적으로 표기해야 함 => slice는 액션 리듀서 모두 포함
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  //thunk middleware 추가
})

export default store
