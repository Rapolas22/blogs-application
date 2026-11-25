import { ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "../header"

interface Hero14Props {
  onCtaClick?: () => void
}

export default function Hero14({ onCtaClick }: Hero14Props) {
  return (
    <section className="bg-background">
      <Header />

      <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-14 pb-20 sm:px-8 lg:box-content lg:grid-cols-[1fr_20rem] lg:items-end lg:px-12 lg:pt-24 lg:pb-28">
        <h1 className="font-display text-[clamp(3rem,8.5vw,6.75rem)] leading-[0.92] font-extrabold tracking-[-0.04em] text-balance">
          Notes from the{" "}
          <em className="font-serif font-medium tracking-[-0.02em] text-primary-ink">
            home row
          </em>{" "}
          of a developer.
        </h1>

        <div>
          <p className="text-lg leading-relaxed text-pretty text-muted-foreground">
            Long posts about building web apps: how things work, why they break,
            and the code that fixes them.
          </p>
          <Button size="lg" onClick={onCtaClick} className="mt-6 h-11 px-5">
            Read the latest posts
            <ArrowDown />
          </Button>
        </div>
      </div>
    </section>
  )
}
