import Hero14 from "./components/ui/hero-14"
import SecondPage from "./features/secondPage/pages/secondPage"
import { useRef } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import ViewBlog from "./features/viewABlog/pages/viewBlog"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export function App() {
  const scrollToSecondPage = () => {
    secondPageRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  const secondPageRef = useRef<HTMLDivElement>(null)
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  )
}

export default App
