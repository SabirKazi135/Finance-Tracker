// src/pages/Auth/components/LoginForm.jsx
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }

    if (password.length < 4) {
      setError('Password should be at least 4 characters (demo).');
      return;
    }

    setIsSubmitting(true);
    const result = login({ email, password });
    setIsSubmitting(false);

    if (!result?.success) {
      setError(result?.message || 'Unable to login. Please try again.');
      return;
    }

    navigate('/total', { replace: true });
  };

  const handleDemoLogin = () => {
    // Optional: set demo credentials in UI (for realism)
    setEmail('demo@finance.com');
    setPassword('1234');

    // Call your login store with demo data
    login({ email: 'demo@finance.com', password: '1234' });

    // Go directly to dashboard
    navigate('/total', { replace: true });
  };

  return (
    <div className="flex h-[70%] w-[70%] flex-col items-stretch justify-center space-y-3">
      <div>
        <div className="text-[20px] font-semibold leading-[28px]">
          Welcome Back
        </div>
        <p className="mb-[24px] mt-[5px] text-xs leading-[16px] text-slate-700">
          Please enter your details to login
        </p>
      </div>

      <form className="w-full space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="mb-2 block cursor-pointer">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-[4px] border border-gray-300 bg-[#F1F5F9] px-4 py-3 focus:border-[#00C951] focus:bg-[#E8F0FE] focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block cursor-pointer">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-[4px] border border-gray-300 bg-[#F1F5F9] px-4 py-3 pr-10 focus:border-[#00C951] focus:bg-[#E8F0FE] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              {showPassword ? (
                <EyeOff size={20} color="#00C951" />
              ) : (
                <Eye size={20} color="#B9C5D4" />
              )}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-[6px] bg-[#00C951] py-3 font-semibold text-white hover:bg-[#D6EFDF] hover:text-[#00C951] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>

        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full rounded-[6px] border border-[#00C951] bg-white py-3 font-semibold text-[#00C951] transition hover:bg-[#00C951] hover:text-white"
        >
          Continue with Demo
        </button>

        <p className="mt-[12px] text-[13px]">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="cursor-pointer font-semibold text-[#16a34a] underline"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
