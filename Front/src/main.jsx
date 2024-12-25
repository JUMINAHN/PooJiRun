import "./index.css"
import App from "./App.jsx"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { configureStore } from "@reduxjs/toolkit"

// store 자체를 사용할 것이긴 한데
// export const store = configureStore({

// })

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
