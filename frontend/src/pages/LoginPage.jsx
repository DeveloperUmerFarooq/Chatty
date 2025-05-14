import React, { useState } from 'react'
import { useAuthStore } from '../../store/useAuthStore';
import { Eye, EyeOff, Mail, MessageSquare, Lock, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;
    login(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-base-200">
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Logo and Heading */}
          <div className="text-center">
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2 text-base-content">
                Welcome Back
              </h1>
              <p className="text-base-content/60">
                Login with your credentials
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <label className="input input-bordered flex items-center gap-3 w-full">
              <Mail className="text-base-content/40" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email Address"
                className="grow"
              />
            </label>

            {/* Password */}
            <label className="input input-bordered flex items-center gap-3 relative w-full">
              <Lock className="text-base-content/40" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
                minLength={8}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                className="grow"
              />
              <div
                className="cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="text-base-content/50" />
                ) : (
                  <Eye className="text-base-content/50" />
                )}
              </div>
            </label>
            <div className="text-xs text-base-content/50 ml-1">
              Min 8 chars, include number, lowercase, and uppercase letters.
            </div>

            {/* Sign up link */}
              <p>Don't have an account? <Link className='text-primary underline' to="/signup">Sign Up</Link></p>
            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ?<><Loader2 className="size-5 animate-spin"/>Loading...</> : "Login"}
            </button>
          </form>
        </div>
      </div>

      {/* Right Side Image or Design */}
      <div className="hidden lg:flex items-center justify-center bg-primary/40">
        <img
          src="/SignUp.svg"
          alt="Sign Up Illustration" 
          className="w-2/3"
        />
      </div>
    </div>
  );
}
