import { Button, buttonVariants } from "@/components/ui/button"
import { Menu } from "lucide-react"
import Logo from "@/components/logo"
import ThemeSwitcher from "@/features/theme/ThemeSwitcher"
import { useEffect, useState } from "react"
import { getMe } from "../features/auth/api"

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function NavbarSection() {
  const [user, setUser] = useState<number | null>(null)

  useEffect(() => {
    const fetchUser = getMe().then((data) => setUser(data))
  }, [])

  const handleLogout = () => {
    const logout = async () => {
      const response = await fetch("/api/logout")
    }
    logout()
    setUser(null)
  }

  return (
    // Same width and side padding as the rest of the page,
    // so the logo lines up with the headline and the posts.
    <nav className="mx-auto flex h-20 w-full max-w-6xl items-center px-5 sm:px-8 lg:box-content lg:px-12">
      <a href="/" aria-label="Homerow home" className="rounded-md">
        <Logo hideNameOnSmall />
      </a>

      {/* The colourway keys are visible at every screen size */}
      <ThemeSwitcher className="ml-auto" />

      <div className="hidden items-center gap-5 pl-5 lg:flex">
        <span className="h-6 w-px bg-border" aria-hidden="true" />
        <div className="flex items-center gap-2">
          {user ? (
            <Button variant="ghost" onClick={() => handleLogout()}>
              Logout
            </Button>
          ) : (
            <div>
              <a
                href="/signin"
                className={buttonVariants({ variant: "ghost", size: "lg" })}
              >
                Log in
              </a>
              <a href="/signup" className={buttonVariants({ size: "lg" })}>
                Sign up
              </a>
            </div>
          )}
        </div>
      </div>

      <Sheet>
        <SheetTrigger
          render={
            <Button
              variant="outline"
              size="icon-lg"
              aria-label="Open menu"
              className="ml-3 lg:hidden"
            />
          }
        >
          <Menu />
        </SheetTrigger>
        <SheetContent side="right" className="w-[85%] max-w-xs gap-8 p-6">
          <SheetTitle>
            <a href="/">
              <Logo />
            </a>
          </SheetTitle>
          {user ? (
            <Button variant="destructive" onClick={() => handleLogout()}>
              Logout
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <a
                href="/signin"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Log in
              </a>
              <a href="/signup" className={buttonVariants({ size: "lg" })}>
                Sign up
              </a>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </nav>
  )
}
