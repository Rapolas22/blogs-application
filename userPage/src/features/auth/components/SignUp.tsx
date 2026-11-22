import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm, type SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import {} from "../api.ts"
import { useCreateUser } from "../hooks/useCreateUser.ts"
import type { signUpProps } from "../types"

const schema = z.object({
  email: z.email("Invalid email").min(1, "Email field cannot be empty"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().nonempty(),
})

type FormFields = z.infer<typeof schema>

export default function SignUpPage() {
  const navigate = useNavigate()
  const mutation = useCreateUser()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  })

  const onSubmit: SubmitHandler<FormFields> = async (data: signUpProps) => {
    mutation.mutate(data, {
      onSuccess: () => navigate("/signin"),
      onError: () => setError("root", { message: "Check inputs" }),
    })
  }

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* <Logo
            aria-hidden={true}
            className="mx-auto h-10 w-10 text-foreground dark:text-foreground"
          /> */}
          <h3 className="mt-2 text-center text-lg font-bold text-balance text-foreground dark:text-foreground">
            Create an account for your workspace
          </h3>
        </div>

        <Card className="mt-4 shadow-2xs sm:mx-auto sm:w-full sm:max-w-md">
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label
                  className="text-sm font-medium text-foreground dark:text-foreground"
                  htmlFor="name"
                >
                  Name
                </Label>
                <Input
                  autoComplete="name"
                  className="mt-2"
                  placeholder="Peter"
                  type="name"
                  id="name"
                  {...register("name", { required: true })}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
              <div>
                <Label
                  className="text-sm font-medium text-foreground dark:text-foreground"
                  htmlFor="email"
                >
                  Email
                </Label>
                <Input
                  autoComplete="email"
                  className="mt-2"
                  placeholder="ephraim@blocks.so"
                  type="email"
                  id="email"
                  {...register("email", { required: true })}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}

              <div>
                <Label
                  className="text-sm font-medium text-foreground dark:text-foreground"
                  htmlFor="password"
                >
                  Password
                </Label>
                <Input
                  autoComplete="current-password"
                  className="mt-2"
                  id="password"
                  placeholder="Password"
                  type="password"
                  {...register("password", { required: true })}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}

              {errors.root && (
                <p role="alert" className="text-sm text-red-500">
                  {errors.root.message}
                </p>
              )}

              <Button
                className="mt-4 w-full bg-[#D9532C] py-2 font-medium text-white hover:bg-[#C74B2A]"
                type="submit"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-pretty text-muted-foreground dark:text-muted-foreground">
          Already have an account?{" "}
          <a
            className="font-medium text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90"
            href="/signup"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  )
}
