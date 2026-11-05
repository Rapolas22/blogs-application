import Hero14 from "./components/ui/hero-14"
import SecondPage from "./pages/secondPage"
import { useRef } from "react"
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom"
import ViewBlog from "./pages/viewBlog"

export function App() {
  const scrollToSecondPage = () => {
    secondPageRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  const secondPageRef = useRef<HTMLDivElement>(null)
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <Hero14 onCtaClick={scrollToSecondPage} />
                <SecondPage ref={secondPageRef} />
              </div>
            }
          />
          <Route path="user/posts/:id" element={<ViewBlog />} />
        </Routes>
      </BrowserRouter>
    </main>
  )
}

export default App
