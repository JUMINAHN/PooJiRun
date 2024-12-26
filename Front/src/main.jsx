import "./index.css"
import App from "./App.jsx"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { configureStore } from "@reduxjs/toolkit"
import store from "./store/index.js"
import { Provider } from "react-redux"

// store 자체를 사용할 것이긴 한데
// export const store = configureStore({

// })

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)
