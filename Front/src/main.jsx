import "./index.css"
import App from "./App.jsx"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { configureStore } from "@reduxjs/toolkit"
import store from "./store/index.js"
import { Provider } from "react-redux"

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)
