import React, { useState } from "react";
import api from "../../api";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, githubProvider, googleProvider } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setBackendUser } = useAuth();
  const [error, setError] = useState("");

  const handleBackendAuth = async (firebaseUser, providerId) => {
    try {
      const response = await api.post(`/api/auth/firebase`, {
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        firebaseUid: firebaseUser.uid,
        avatar: firebaseUser.photoURL,
        authProvider: providerId,
      });
      const data = response.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setBackendUser(data.user);
      navigate("/");
    } catch (err) {
      console.error("Backend auth error:", err);
      setError(err.response?.data?.message || "Authentication failed on server.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post(`/api/auth/login`, {
        email,
        password,
      });
      const data = response.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setBackendUser(data.user);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  const handleGithubLogin = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      await handleBackendAuth(result.user, "github");
    } catch (error) {
      console.error("GitHub login error:", error);
      setError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleBackendAuth(result.user, "google");
    } catch (error) {
      console.error("Google login error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="flex w-full min-h-screen">
      {/* Left Side: Branding & Quote */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface-container-lowest flex-col justify-between p-8 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 opacity-20 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC0amjdQ0eJPjmJwK78It734Gjzwb9cFtaTInaMQBqgoNahn0IbXB_qky81yCCE9PsivDBEruT9Zlx3FuSZVLNUN7_8mWzCh89E3Ux-78gvMvI7O8l1eKV7pVjAdXf6HBSFZ6vV-WxEw35_DRRemTPcUXaFLmts72WcBILbYDmVnO6znUpbLQ_bT_HrDwwxcKuleRWHphdLeaT8rQDs4MulIArbNSp82lU25NBH7Ah9KfkP8NIf6KBSvtz0fLViDkqvmf7FLVxSyW4u')",
          }}
        ></div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-background/90 to-background/40"></div>
        {/* Content Container */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          {/* Logo */}
          <div>
            <Link className="flex items-center gap-2" to="/">
              <img src="/excode.svg" alt="excode logo" className="w-10 h-10" />
              <span className="font-geist text-3xl font-bold tracking-tighter text-primary">
                code
              </span>
            </Link>
          </div>
          {/* Quote Box */}
          <div
            className="p-6 rounded-2xl mb-8"
            style={{
              background: "rgba(17, 24, 39, 0.7)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <span className="material-symbols-outlined text-primary/50 text-[48px] mb-4 block">
              format_quote
            </span>
            <p className="font-geist text-2xl text-on-surface mb-6">
              "The gap between theory and production is where careers are made.
              excode bridges that gap with ruthless precision."
            </p>
            <div className="flex items-center gap-4">
              <img
                alt="Profile of Sarah Jenkins"
                className="w-12 h-12 rounded-full border border-outline-variant/30 grayscale opacity-80"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgCkzaUoBjhVnrJycAuwKziG7yGPEMO8Cc0GFC5SD82XhmxAWsSB7tVPM9ASLZ9mmJLplsdVrkgmgcubjx3Om5JCZxIrOeB3EZbxDoLceyJtfUKPNhQwKGd082yJ6l5ajnJxVAlvH_LpNEQE6tdFAuBaV1Gn-gYZ5TrUovplZ6_3mHrt_Hs0jdeNdwvT3J1Z3ln-vukVlNoIEfZVR42JEul69zNF87MM6DpxeAeaMuNuI8pJctAfNnOlGFmO5BiYfJaPToDVB01rC_"
              />
              <div>
                <p className="font-inter text-base text-on-surface font-semibold">
                  Sarah Jenkins
                </p>
                <p className="font-jetbrains text-sm text-on-surface-variant">
                  Principal Engineer, CloudScale
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Log In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8 bg-background relative z-10">
        <div>
          {/* Mobile Logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <Link className="flex items-center gap-2" to="/">
              <img src="/excode.svg" alt="excode logo" className="w-8 h-8" />
              <span className="font-geist text-2xl font-bold tracking-tighter text-primary">
                code
              </span>
            </Link>
          </div>
          {/* Header */}
          <div className="mb-6 text-center lg:text-left">
            <h1 className="font-geist text-3xl font-bold tracking-tight text-on-surface mb-1">
              Welcome Back
            </h1>
            <p className="font-inter text-base text-on-surface-variant">
              Log in to your account to continue.
            </p>
          </div>
          {error && <div className="mb-4 text-red-500 font-inter text-sm">{error}</div>}
          {/* Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            {/* OAuth Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGithubLogin}
                className="w-full flex items-center justify-center gap-2 bg-primary-container text-on-primary-container py-2.5 px-6 rounded-2xl font-jetbrains text-xs font-semibold tracking-wider transition-all duration-200 shadow-[0_0_15px_rgba(77,142,255,0.3)] hover:scale-[0.98] hover:shadow-[0_0_20px_rgba(77,142,255,0.5)]"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    fillRule="evenodd"
                  ></path>
                </svg>
                CONTINUE WITH GITHUB
              </button>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2 bg-surface-container hover:bg-surface-container-high text-on-surface py-2.5 px-6 rounded-2xl font-jetbrains text-xs font-semibold tracking-wider border border-outline-variant/30 transition-all duration-200 hover:scale-[0.98]"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  ></path>
                </svg>
                CONTINUE WITH GOOGLE
              </button>
            </div>
            {/* Divider */}
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-outline-variant/30"></div>
              <span className="flex-shrink-0 mx-4 font-jetbrains text-xs font-semibold tracking-wider text-on-surface-variant">
                OR EMAIL
              </span>
              <div className="flex-grow border-t border-outline-variant/30"></div>
            </div>
            {/* Email & Password Inputs */}
            <div className="space-y-4">
              <div>
                <label className="sr-only" htmlFor="email">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline text-[20px]">
                      mail
                    </span>
                  </div>
                  <input
                    autoComplete="email"
                    className="w-full pl-[44px] pr-4 py-3 bg-surface-container-lowest border border-outline-variant text-on-surface font-inter text-base rounded-2xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all placeholder-on-surface-variant/50"
                    id="email"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="developer@example.com"
                    required
                    type="email"
                    value={email}
                  />
                </div>
              </div>
              <div>
                <label className="sr-only" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline text-[20px]">
                      lock
                    </span>
                  </div>
                  <input
                    autoComplete="current-password"
                    className="w-full pl-[44px] pr-4 py-3 bg-surface-container-lowest border border-outline-variant text-on-surface font-inter text-base rounded-2xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all placeholder-on-surface-variant/50"
                    id="password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    type="password"
                    value={password}
                  />
                </div>
              </div>
            </div>
            {/* Action */}
            <div className="pt-1">
              <button
                className="w-full bg-primary text-on-primary py-3 px-6 rounded-2xl font-jetbrains text-xs font-semibold tracking-wider transition-all duration-200 shadow-[0_0_15px_rgba(77,142,255,0.3)] hover:scale-[0.98] hover:shadow-[0_0_20px_rgba(77,142,255,0.5)]"
                type="submit"
              >
                SIGN IN
              </button>
            </div>
          </form>
          {/* Footer Text */}
          <p className="mt-4 text-center font-inter text-sm text-on-surface-variant">
            Don't have an account?{" "}
            <Link
              className="font-semibold text-primary hover:text-primary-fixed transition-colors"
              to="/signup"
            >
              Sign up here
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
