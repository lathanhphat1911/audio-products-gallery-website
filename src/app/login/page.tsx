"use client";

import { signIn } from "next-auth/react";
import { loginSchema, LoginInput } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const error = searchParams.get("error");

  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);

    const result = await signIn("credentials", {
      ...data,
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      setIsLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    setIsOAuthLoading(provider);
    await signIn(provider, { callbackUrl });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Thành Nam Audio Admin
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Đăng nhập để quản trị hệ thống
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error === "403" && "Bạn không có quyền truy cập. Vui lòng đăng nhập tài khoản ADMIN."}
              {error === "CredentialsSignin" && "Email hoặc mật khẩu không đúng."}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                id="email"
                placeholder="admin@aurasound.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Mật khẩu
              </label>
              <input
                {...register("password")}
                type="password"
                id="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-500 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Đăng nhập
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Hoặc đăng nhập bằng
            </span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleOAuthSignIn("google")}
              disabled={!!isOAuthLoading}
              className="w-full py-3 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isOAuthLoading === "google" && <Loader2 className="w-4 h-4 animate-spin" />}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.72-1 7.7-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.47.78-2.23-.37-1.37-.95-2.53-1.73-3.31H5.9v2.77c2.22 1.39 4.53 3.73 5.69 6.43l3.41-2.71z"
                />
                <path
                  fill="#FBBC05"
                  d="M7.93 14.91c-.18-.55-.28-1.13-.28-1.71s.1-1.16.28-1.71V9.68H4.43a7.98 7.98 0 0 0-.36 3.32c0 1.25.45 2.44 1.24 3.38l2.26-1.71z"
                />
                <path
                  fill="none"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  stroke="#EA4335"
                  strokeWidth="1.5"
                  d="M12 5.34c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.95 2.09 15.21 1 12 1 8.91 1 6.17 1.97 4.43 3.68l3.5 2.71c.68-.94 1.58-1.56 2.67-1.93z"
                />
              </svg>
              Sign in with Google
            </button>

            <button
              onClick={() => handleOAuthSignIn("github")}
              disabled={!!isOAuthLoading}
              className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-700 text-white font-medium rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isOAuthLoading === "github" && <Loader2 className="w-4 h-4 animate-spin" />}
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.422-4.043-1.422-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.799 1.799 1.799 1.205 2.849 5.9.571.787-.772.46-1.561-2.275-.572-.571-.857-1.223.857-1.223 1.204.074 2.234.772 2.234 1.422v2.849c0 .319.192.694.8.576 4.765-1.589 8.199-6.086 8.199-11.386 0-.173-.032-.343-.089-.503 0 0 .655-.213 2.2-.828 0 0 .525-.223-.149-.672 0 0 .475-.729 1.029-1.413 0 0 .435.262.713.512 0 0 .345-.269.709-.27 0 0 .41-.104 1.02-.515 0 0 .265.235.639.47.735.402l.095.067.049.035c.193-.68.352-1.34.475-2.03.123-.688.188-1.388.188-2.088 0-.71-.154-1.41-.44-2.088z" />
              </svg>
              Sign in with GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}