import LoginPage from "../components/login-05.tsx";

export default function Login() {
  return <LoginPage />;
}

// <main className="bg-gray-50 px-4 md:px-8 dark:bg-gray-800">
//   <div className="min-h-screen flex flex-col items-center justify-center">
//     <div className="max-w-md w-full">
//       <div className="p-6 rounded-lg bg-white border border-slate-300 shadow-xs md:p-8 dark:bg-neutral-800 dark:border-neutral-700">
//         <h1 className="text-slate-900 text-center text-3xl font-bold dark:text-slate-50">
//           Sign in
//         </h1>

//         <form
//           className="space-y-6 mt-10"
//           onSubmit={handleSubmit(onSubmit)}
//           noValidate
//         >
//           <div>
//             <label htmlFor="email" className={labelClass}>
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               placeholder="john@example.com"
//               className={inputClass}
//               {...register("email")}
//             />
//             {errors.email && (
//               <p className="mt-1 text-sm text-red-500">
//                 {errors.email.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <label htmlFor="password" className={labelClass}>
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               placeholder="••••••••"
//               className={inputClass}
//               {...register("password")}
//             />
//             {errors.password && (
//               <p className="mt-1 text-sm text-red-500">
//                 {errors.password.message}
//               </p>
//             )}
//           </div>

//           {errors.root && (
//             <p className="text-sm text-red-500">{errors.root.message}</p>
//           )}

//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60"
//           >
//             {isSubmitting ? "Signing in..." : "Sign in"}
//           </button>

//           <div className="text-slate-900 text-sm text-center dark:text-slate-50">
//             Don&apos;t have an account?
//             <Link
//               to="/signup"
//               className="text-blue-700 hover:underline ml-1 font-medium dark:text-blue-500"
//             >
//               Sign up
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   </div>
// </main>
