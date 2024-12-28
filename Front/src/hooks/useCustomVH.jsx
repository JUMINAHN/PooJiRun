import { useEffect } from "react"

const useCustomVH = () => {
  //실제 vh를 모바일 버전에 맞춰서 자체적으로 설정
  const setVH = () => {
    //자체적으로 setVH
    const vh = window.innerHeight * 0.01 //100등분한 값 => window자체의 innerHeight 자체
    //css 변수로 설정하기
    document.documentElement.style.setProperty("--vh", `${vh}px`)
    // document의 -> element.style의 property를 지정? => Q.?? 이부분 이해가 잘 안됨
  }

  useEffect(() => {
    setVH() //setVH자체를 실행하기
    //왜 또 초기 실행을 하는지?? 밑에가 있는데??

    //Q. 초기 랜더링시에 addEventListner가 동작하게 되어있는데 이게 메모리 자체에 남는건지>?
    window.addEventListener("resize", setVH) //화면 크기 변경시 실행

    //컴포넌트 언마운트시 이벤트 리스너 제거
    // 이벤트 리스너 자체적으로 제거
    // return () => 리턴 자체의 함수 호출은 이 useEffect 종료될 시점에서 이 동작이 일어나면 종료가 사라진다고
    //되는 내용인지?
    return () => window.removeEventListener("resize", setVH)
  }, []) //초기 랜더링시 첫번쨰

  return (
    <div>
      <h1>usCustomVH</h1>
    </div>
  )
}

export default useCustomVH
