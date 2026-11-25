import { useState } from "react"
import { cn } from "@/lib/utils"
import { applyTheme, getCurrentTheme, themes, type ThemeId } from "./themes"

// A row of four keycaps. Pressing one switches the colourway.
export default function ThemeSwitcher({ className }: { className?: string }) {
  const [current, setCurrent] = useState<ThemeId>(getCurrentTheme)

  function handleClick(
    event: React.MouseEvent<HTMLButtonElement>,
    id: ThemeId
  ) {
    if (id === current) return

    // Tell the CSS animation where to start the circle:
    // the middle of the key that was pressed.
    const rect = event.currentTarget.getBoundingClientRect()
    const root = document.documentElement
    root.style.setProperty("--click-x", `${rect.left + rect.width / 2}px`)
    root.style.setProperty("--click-y", `${rect.top + rect.height / 2}px`)

    setCurrent(id)

    // Older browsers don't have view transitions: just switch instantly.
    if (!document.startViewTransition) {
      applyTheme(id)
      return
    }
    document.startViewTransition(() => applyTheme(id))
  }

  return (
    <div
      role="group"
      aria-label="Colour theme"
      className={cn("flex items-center gap-1.5", className)}
    >
      {themes.map((theme) => {
        const isActive = theme.id === current
        return (
          <button
            key={theme.id}
            type="button"
            title={theme.name}
            aria-label={`${theme.name} theme`}
            aria-pressed={isActive}
            onClick={(event) => handleClick(event, theme.id)}
            style={{ backgroundColor: theme.key }}
            className={cn(
              // a small keycap: darker bottom edge, pushed down while pressed
              "relative size-7 rounded-[8px] shadow-[inset_0_-3px_0_rgb(0_0_0/0.25),0_1px_2px_rgb(0_0_0/0.2)] transition-[translate,box-shadow] duration-150 ease-out outline-none hover:-translate-y-px focus-visible:ring-3 focus-visible:ring-ring/60 active:translate-y-0.5 active:shadow-[inset_0_-1px_0_rgb(0_0_0/0.25)] sm:size-8 sm:rounded-[9px]",
              isActive &&
                "translate-y-0.5 shadow-[inset_0_-1px_0_rgb(0_0_0/0.25)] ring-2 ring-foreground/70 ring-offset-2 ring-offset-background"
            )}
          >
            {/* the homing bar, like on the F and J keys */}
            <span
              className="absolute inset-x-2 bottom-1.5 h-[3px] rounded-full sm:inset-x-2.5 sm:bottom-2"
              style={{ backgroundColor: theme.bar }}
            />
          </button>
        )
      })}
    </div>
  )
}
