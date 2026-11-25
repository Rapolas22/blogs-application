import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm, type SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { sendLoginDataToApi } from "../api.ts"
import Logo from "@/components/logo"
import ThemeSwitcher from "@/features/theme/ThemeSwitcher"

const schema = z.object({
  email: z.email("Invalid email").min(1, "Email field cannot be empty"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type FormFields = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  })

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await sendLoginDataToApi(data)
      navigate("/")
    } catch {
      setError("root", { message: "Wrong email or password" })
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8 lg:box-content lg:px-12">
        <a href="/" aria-label="Homerow home">
          <Logo />
        </a>
        <ThemeSwitcher />
      </header>

      <main className="flex flex-1 items-center justify-center px-5 pt-6 pb-16">
        <div className="w-full max-w-md">
          <h1 className="font-display text-5xl leading-none font-extrabold tracking-[-0.04em] text-balance">
            Welcome{" "}
            <em className="font-serif font-medium tracking-[-0.02em] text-primary-ink">
              back
            </em>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Log in to read posts and join the comments.
          </p>

          {/* the form is one big key sitting on the dark plate */}
          <div className="mt-8 rounded-3xl bg-plate p-3">
            <Card className="rounded-2xl pb-6 shadow-[inset_0_-6px_0_var(--key-edge)] ring-0">
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      autoComplete="email"
                      className="mt-2 h-10"
                      placeholder="you@example.com"
                      type="email"
                      id="email"
                      {...register("email", { required: true })}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-sm text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      autoComplete="current-password"
                      className="mt-2 h-10"
                      id="password"
                      type="password"
                      {...register("password", { required: true })}
                    />
                    {errors.password && (
                      <p className="mt-1.5 text-sm text-destructive">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {errors.root && (
                    <p role="alert" className="text-sm text-destructive">
                      {errors.root.message}
                    </p>
                  )}

                  <Button
                    className="h-10 w-full"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Logging in…" : "Log in"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a
              className="font-medium text-primary-ink underline-offset-4 hover:underline"
              href="/signup"
            >
              Sign up
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}
