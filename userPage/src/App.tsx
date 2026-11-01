import Hero14 from "./components/ui/hero-14"
import SecondPage from "./pages/secondPage"
import { useRef } from "react"

export function App() {
  const scrollToSecondPage = () => {
    secondPageRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  const secondPageRef = useRef<HTMLDivElement>(null)

  return (
    <main>
      <Hero14 onCtaClick={scrollToSecondPage} />
      <SecondPage ref={secondPageRef} />
    </main>
  )
}

export default App
