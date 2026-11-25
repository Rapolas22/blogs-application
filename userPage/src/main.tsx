import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"

// The colour theme is set by the small script in index.html and
// changed by ThemeSwitcher (src/features/theme), so no provider is needed.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
