import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "./logo.tsx";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { sendLoginRequest } from "../api.ts";

const schema = z.object({
  email: z.string().email("Invalid email").min(2),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormFields = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await sendLoginRequest(data);
      navigate("/");
    } catch (error) {
      errors;
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Logo
            aria-hidden={true}
            className="mx-auto h-10 w-10 text-foreground dark:text-foreground"
          />
          <h3 className="mt-2 text-balance text-center font-bold text-foreground text-lg dark:text-foreground">
            Sign in to your account for workspace
          </h3>
        </div>

        <Card className="mt-4 shadow-2xs sm:mx-auto sm:w-full sm:max-w-md">
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label
                  className="font-medium text-foreground text-sm dark:text-foreground"
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
                  className="font-medium text-foreground text-sm dark:text-foreground"
                  htmlFor="password"
                >
                  Password
                </Label>
                <Input
                  autoComplete="password"
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

              <Button
                className="mt-4 w-full py-2 bg-[#D9532C] hover:bg-[#C74B2A] font-medium text-white"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-pretty text-center text-muted-foreground text-sm dark:text-muted-foreground">
          Don't have an account?{" "}
          <a
            className="font-medium text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90"
            href="/signup"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
