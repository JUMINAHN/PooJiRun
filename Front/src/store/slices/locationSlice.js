import { createSlice } from "@reduxjs/toolkit";

const locationSlice = createSlice({
  name : 'location', //위치
  initialState : [], //초기값
  reducers : { //여기서도 reducer 값

  }
})

console.log(locationSlice) // console.log
// https://redux-toolkit.js.org/usage/usage-guide => simplifying slices with createslice

// reducer로 들어갈 actions 값 호출
// 이것도 test 가능