import { Particles } from "@/components/ui/particles"

export function App() {
  return (
    <main className="flex min-h-screen max-w-screen flex-col p-5">
      <Particles intensity="subtle" className="min-h-screen">
        <div className="flex h-20 justify-center">
          <p>header</p>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <p>Content</p>
        </div>
      </Particles>
    </main>
  )
}

export default App
