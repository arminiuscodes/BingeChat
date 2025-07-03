import { useState } from "react";
import { UseAuthStore } from "../store/UseAuthStore.js";
import AuthImagePattern from "../components/authImagePattern.jsx";
// import { Link } from "react-router-dom"; // Router import removed for artifact compatibility
import { Eye, EyeOff, Lock, Mail, MessageSquare, LogIn } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = UseAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen pt-16 grid lg:grid-cols-2 bg-base-300 relative overflow-hidden">
      {/* Adaptive background decorations */}
      {/* You can remove these if you want even less decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-32 translate-y-32"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-accent/3 rounded-full blur-2xl"></div>
      </div>

      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md space-y-8">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Professional logo container */}
                <div className="p-4 bg-base-200 border border-base-300 rounded-2xl shadow-md">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                {/* Static notification dot */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-base-100"></div>
              </div>
            </div>
            {/* Professional heading */}
            <h1 className="text-4xl font-bold mb-2 text-base-content">
              Welcome Back
            </h1>
            <p className="text-base-content/80 text-lg font-medium">Sign in to your account</p>
          </div>

          {/* Form */}
          <div className="bg-base-100 rounded-2xl shadow-md border border-base-300 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="form-control group">
                <label className="label">
                  <span className="label-text font-semibold text-base-content">Email Address</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
                  <input
                    type="email"
                    className="input input-bordered w-full pl-12 pr-4 py-4 bg-base-200 border focus:border-primary text-base-content placeholder:text-base-content/40"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              {/* Password Field */}
              <div className="form-control group">
                <label className="label">
                  <span className="label-text font-semibold text-base-content">Password</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input input-bordered w-full pl-12 pr-14 py-4 bg-base-200 border focus:border-primary text-base-content placeholder:text-base-content/40"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-primary btn btn-ghost btn-sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn btn-primary w-full py-4 h-auto min-h-[3.5rem] font-semibold text-lg transition-all duration-200 shadow"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <div className="flex items-center justify-center gap-3">
                    <span className="loading loading-spinner loading-sm"></span>
                    Signing you in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </div>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-8">
              <p className="text-base-content/70">
                Don't have an account?{" "}
                <a 
                  href="/signup" 
                  className="link link-primary font-semibold hover:underline"
                >
                  Create account
                </a>
              </p>
            </div>
          </div>

          {/* Additional branding element */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-base-content/40 text-sm">
              <div className="w-8 h-[1px] bg-base-300"></div>
              <MessageSquare className="w-4 h-4 text-primary/60" />
              <span className="font-medium">Secure Login</span>
              <MessageSquare className="w-4 h-4 text-primary/60" />
              <div className="w-8 h-[1px] bg-base-300"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern/>
    </div>
  );
};

export default LoginPage;
