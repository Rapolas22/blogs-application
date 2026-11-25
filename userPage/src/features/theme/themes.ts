// The four colourways a reader can pick. The real colours live in
// index.css under [data-theme="..."]. The two colours here are only
// used to paint the little keycap button for each theme.
export const themes = [
  { id: "paper", name: "Paper", key: "#f8f4ea", bar: "#c8432b" },
  { id: "matcha", name: "Matcha", key: "#9fbf98", bar: "#24332a" },
  { id: "retro", name: "Retro", key: "#e8892f", bar: "#34302a" },
  { id: "midnight", name: "Midnight", key: "#2a3560", bar: "#7cc7ff" },
] as const

export type ThemeId = (typeof themes)[number]["id"]

const STORAGE_KEY = "homerow-theme"

// Puts the theme on <html> and remembers it for the next visit.
// Midnight also gets the "dark" class, so shadcn's dark: styles kick in.
export function applyTheme(id: ThemeId) {
  const root = document.documentElement
  root.dataset.theme = id
  root.classList.toggle("dark", id === "midnight")
  localStorage.setItem(STORAGE_KEY, id)
}

// The theme that index.html already applied before React started.
export function getCurrentTheme(): ThemeId {
  return (document.documentElement.dataset.theme as ThemeId) ?? "paper"
}
