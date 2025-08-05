import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, Building2, UserCheck } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const USER_TYPES = [
  { label: 'Investor', value: 'investor', icon: UserCheck, description: 'Access company data and analysis' },
  { label: 'Company', value: 'company', icon: Building2, description: 'Manage your company profile' },
];

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState(USER_TYPES[0].value);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    if (!name || !email || !password) {
      setError('Please fill all fields.');
      setIsLoading(false);
      return;
    }
    
    try {
      const res = await fetch(API_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, userType })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      
      setSuccess('Signup successful! You can now log in.');
      setTimeout(() => navigate('/auth'), 1500);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full opacity-10 animate-float"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-600 to-red-600 rounded-full opacity-10 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join Investable</h1>
          <p className="text-gray-300 mb-2">Create your account to get started</p>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            <span className="text-xs">Empowering</span>
            <span className="font-bold">Investment Readiness</span>
          </div>
        </div>

        {/* Signup Form */}
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border/20 p-8 animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-muted/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-muted/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-10 pr-12 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-muted/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* User Type Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">Account Type</label>
              <div className="grid grid-cols-1 gap-3">
                {USER_TYPES.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setUserType(type.value)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        userType === type.value
                          ? 'border-primary bg-primary/10 shadow-md'
                          : 'border-border bg-muted/50 hover:border-border/60'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          userType === type.value ? 'bg-primary/20' : 'bg-muted'
                        }`}>
                          <IconComponent className={`w-5 h-5 ${
                            userType === type.value ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                        </div>
                        <div>
                          <div className={`font-medium ${
                            userType === type.value ? 'text-primary' : 'text-foreground'
                          }`}>
                            {type.label}
                          </div>
                          <div className="text-sm text-muted-foreground">{type.description}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-950/20 border border-red-800/30 rounded-xl p-4 animate-slide-in-left">
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-950/20 border border-green-800/30 rounded-xl p-4 animate-slide-in-left">
                <p className="text-green-400 text-sm font-medium">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !!success}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </>
              ) : success ? (
                <>
                  <span>Account Created ✓</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/auth')}
                className="text-primary hover:text-primary/80 font-semibold transition-colors duration-200 hover:underline"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground mb-2">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>
          <p className="text-xs text-muted-foreground">
            © 2024 Investable. Empowering investment readiness.
          </p>
        </div>
      </div>
    </div>
  );
}
