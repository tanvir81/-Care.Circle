"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result.error) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.success("Welcome back to the Circle!");
        // Fetch session to check role for redirection
        const res = await fetch("/api/auth/session");
        const session = await res.json();
        
        if (session?.user?.role === "admin") {
          router.push("/manage-bookings");
        } else {
          router.push(redirect === "/" ? "/my-bookings" : redirect);
        }
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    await signIn(provider, { callbackUrl: redirect });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-card p-10 rounded-[2.5rem] shadow-2xl border border-primary/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 relative flex items-center justify-center">
              <img src="/logo.png" alt="Care.Circle Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <h2 className="text-center text-4xl font-black text-foreground tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access your care services
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                disabled={loading}
                placeholder="john@example.com"
                className="w-full px-5 py-4 bg-muted border border-primary/5 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none font-bold text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                disabled={loading}
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-muted border border-primary/5 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none font-bold text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-4 bg-primary text-primary-foreground rounded-2xl font-black shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
          >
            {loading ? "Verifying..." : "Enter the Circle"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <button
          onClick={() => handleSocialLogin("google")}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>

        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href={`/register${redirect !== "/" ? `?redirect=${redirect}` : ""}`} className="font-black text-primary hover:underline transition-all">
            Join the Circle
          </Link>
        </p>
      </div>
    </div>
  );
}

