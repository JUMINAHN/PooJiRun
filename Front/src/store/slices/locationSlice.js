import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const getCurrentLocation = createAsyncThunk("location/getCurrentLocation", async () => {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          reject(new Error("위치 정보를 가져오는데 실패했습니다.") + error.message)
        }
      )
    } else {
      //error -> 자체적으로 => 얘는 리젝트
      // reject => 반환하지 못할 때
      //  reject => 자체로 new Error 반환
      //Q. new Error 이부분 확인 필요 => new Error 하는 이유
      reject(new Error("Geolocation API를 지원하지 않는 브라우저입니다.")) //error 메서드 반환
    }
  })
  // 일단 괜찮은 것 => success, error 관련 처리를 해야함
})

const initialState = {
  success: null,
  error: null,
  coordinate: {
    latitude: null,
    longitude: null,
  },
}

// blog builder 부분 참고
export const locationSlice = createSlice({
  //액션과 리듀서를 모두 포함하는 객체
  name: "location",
  initialState: initialState,
  reducers: {},
  // async에 따른 extraReducer 설정
  extraReducers: (builder) => {
    //비동기적 상태 변경
    builder.addCase(getCurrentLocation.pending, (state) => {
      // 초기값 그대로 설정 + 그대로 값 유지
      state.success = null
      state.error = null
    })
    builder.addCase(getCurrentLocation.fulfilled, (state, action) => {
      state.success = true
      state.coordinate = action.payload //새로운 payload
    })
    builder.addCase(getCurrentLocation.rejected, (state, action) => {
      state.error = action.error.message // payload 값 갱신
      state.success = null
      // 좌표 자체로
      state.coordinate = {
        latitude: null,
        longitude: null,
      }
    })
  },
})

// 진정한 action reducer
export default locationSlice.reducer
