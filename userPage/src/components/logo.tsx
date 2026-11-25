// The Homerow mark: one keycap with a homing bar, the little bump
// on the F and J keys that your fingers find without looking.
// It uses the theme colours, so it changes with the colourway.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      {/* the keycap */}
      <rect x="2" y="2" width="28" height="28" rx="8" fill="var(--primary)" />
      {/* its top surface, a little lighter and set back like a real key */}
      <rect
        x="6"
        y="4"
        width="20"
        height="21"
        rx="6"
        fill="white"
        opacity="0.14"
      />
      {/* the homing bar */}
      <rect
        x="11"
        y="19"
        width="10"
        height="3"
        rx="1.5"
        fill="var(--primary-foreground)"
      />
    </svg>
  )
}

// The mark next to the name. Used in the header and on the sign-in pages.
// hideNameOnSmall: on very narrow phones (under 380px) show only the mark,
// so the header still has room for the theme keys and the menu button.
export default function Logo({
  className,
  hideNameOnSmall = false,
}: {
  className?: string
  hideNameOnSmall?: boolean
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <LogoMark className="size-8" />
      <span
        className={`font-display text-2xl font-bold tracking-tight ${
          hideNameOnSmall ? "hidden min-[380px]:inline" : ""
        }`}
      >
        Homerow
      </span>
    </span>
  )
}
