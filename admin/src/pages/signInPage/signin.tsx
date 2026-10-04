import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Neteisingas el. pašto formatas"),
  password: z.string().min(1, "Įveskite slaptažodį"),
});

type FormFields = z.infer<typeof schema>;

export default function LoginForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status === 401) {
        setError("root", {
          message: "Neteisingas el. paštas arba slaptažodis",
        });
        return;
      }

      if (!res.ok) {
        setError("root", { message: "Serverio klaida, bandykite vėliau" });
        return;
      }

      navigate("/");
    } catch {
      setError("root", { message: "Nepavyko prisijungti prie serverio" });
    }
  };

  const inputClass =
    "px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:text-slate-50 dark:bg-neutral-700 dark:outline-neutral-600";
  const labelClass =
    "mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50";

  return (
    <main className="bg-gray-50 px-4 md:px-8 dark:bg-gray-800">
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="max-w-md w-full">
          <div className="p-6 rounded-lg bg-white border border-slate-300 shadow-xs md:p-8 dark:bg-neutral-800 dark:border-neutral-700">
            <h1 className="text-slate-900 text-center text-3xl font-bold dark:text-slate-50">
              Sign in
            </h1>

            <form
              className="space-y-6 mt-10"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="john@example.com"
                  className={inputClass}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className={inputClass}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {errors.root && (
                <p className="text-sm text-red-500">{errors.root.message}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>

              <div className="text-slate-900 text-sm text-center dark:text-slate-50">
                Don&apos;t have an account?
                <Link
                  to="/signup"
                  className="text-blue-700 hover:underline ml-1 font-medium dark:text-blue-500"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
