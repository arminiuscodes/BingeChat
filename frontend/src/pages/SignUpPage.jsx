import React, { useState } from 'react';
import { UseAuthStore } from '../store/UseAuthStore.js';
import { Mail, MessageSquare, User, Lock, Eye, EyeOff, Send } from 'lucide-react';
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';
import AuthImagePattern from '../components/authImagePattern.jsx';

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const { signUp, isSigningUp } = UseAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full Name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signUp(formData);
  };

  return (
    <div className='min-h-screen pt-16 bg-base-200 flex relative overflow-hidden'>
      {/* Theme-adaptive Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-32 translate-y-32"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent/3 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Form Side */}
      <div className='flex-1 flex items-center justify-center p-4 sm:p-8 relative z-10'>
        <div className='w-full max-w-md'>
          {/* Enhanced Branding */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative group">
                {/* Main logo container with theme-adaptive styling */}
                <div className="relative p-4 bg-primary rounded-2xl shadow-xl transform group-hover:scale-105 transition-all duration-300 border-2 border-primary/20">
                  <MessageSquare className="w-8 h-8 text-primary-content" />
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-primary rounded-2xl opacity-20 blur-md scale-110"></div>
                </div>
                {/* Notification dot with theme colors */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full animate-pulse border-2 border-base-100 shadow-lg">
                  <div className="absolute inset-0 bg-secondary rounded-full animate-ping opacity-75"></div>
                </div>
                {/* Additional accent elements */}
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-accent rounded-full opacity-60"></div>
                <div className="absolute -top-2 -left-2 w-2 h-2 bg-accent rounded-full opacity-40"></div>
              </div>
            </div>
            
            {/* Theme-adaptive title */}
            <div className="relative mb-2">
              <h1 className="text-4xl font-bold text-base-content mb-2 relative z-10">
                <span className="relative">
                  Join BingeChat
                  {/* Subtle underline accent */}
                  <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full opacity-30"></div>
                </span>
              </h1>
              {/* Background text shadow for better visibility */}
              <div className="absolute inset-0 text-4xl font-bold text-primary/10 blur-sm">
                Join BingeChat
              </div>
            </div>
            
            {/* Enhanced subtitle with better contrast */}
            <p className="text-base-content/80 text-lg font-medium relative">
              <span className="relative z-10 bg-base-100/50 backdrop-blur-sm px-4 py-1 rounded-full border border-base-300/50">
                Where conversations come alive
              </span>
            </p>
            
            {/* Brand accent line */}
            <div className="flex justify-center mt-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>

          {/* Enhanced Sign Up Form */}
          <div className="bg-base-100/80 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-base-300/50 p-8 relative overflow-hidden">
            {/* Form background pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/5 rounded-full blur-2xl translate-y-12 -translate-x-12"></div>
            
            <form onSubmit={handleSubmit} className='space-y-6 relative z-10'>
              {/* Full Name */}
              <div className="group">
                <label className="block text-base-content font-semibold mb-3 text-sm">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/60 group-focus-within:text-primary transition-colors duration-300" />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-4 bg-base-200/80 border-2 border-base-300/80 rounded-xl text-base-content placeholder-base-content/60 focus:border-primary focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-base-content/40 hover:bg-base-200"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="group">
                <label className="block text-base-content font-semibold mb-3 text-sm">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/60 group-focus-within:text-primary transition-colors duration-300" />
                  <input
                    type="email"
                    className="w-full pl-12 pr-4 py-4 bg-base-200/80 border-2 border-base-300/80 rounded-xl text-base-content placeholder-base-content/60 focus:border-primary focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-base-content/40 hover:bg-base-200"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="group">
                <label className="block text-base-content font-semibold mb-3 text-sm">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/60 group-focus-within:text-primary transition-colors duration-300" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-12 pr-14 py-4 bg-base-200/80 border-2 border-base-300/80 rounded-xl text-base-content placeholder-base-content/60 focus:border-primary focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-base-content/40 hover:bg-base-200"
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-base-content/60 hover:text-primary transition-colors duration-300 p-1 rounded-md hover:bg-primary/10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Enhanced Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-primary text-primary-content font-semibold rounded-xl hover:bg-primary/90 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 shadow-lg border-2 border-primary/20 relative overflow-hidden group"
                disabled={isSigningUp}
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                
                {isSigningUp ? (
                  <div className="flex items-center justify-center gap-3 relative z-10">
                    <div className="w-5 h-5 border-2 border-primary-content/30 border-t-primary-content rounded-full animate-spin"></div>
                    Creating your account...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 relative z-10">
                    <Send className="w-5 h-5" />
                    Create My Account
                  </div>
                )}
              </button>
            </form>

            {/* Enhanced Login Link */}
            <div className="text-center mt-8 relative z-10">
              <div className="inline-block bg-base-200/50 backdrop-blur-sm rounded-full px-6 py-3 border border-base-300/50">
                <p className="text-base-content/80">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-primary hover:text-secondary font-semibold transition-colors hover:underline decoration-2 underline-offset-2 decoration-primary/50 hover:decoration-secondary/50"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Visuals */}
      <AuthImagePattern />
    </div>
  );
};

export default SignUpPage;