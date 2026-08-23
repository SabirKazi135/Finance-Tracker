// src/pages/Auth/components/SignupForm.jsx
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signup = useAuthStore((state) => state.signup);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password) {
      setError('Please fill out all fields.');
      return;
    }

    if (password.length < 4) {
      setError('Password should be at least 4 characters (demo).');
      return;
    }

    setIsSubmitting(true);
    const result = signup({ fullName, email, password });
    setIsSubmitting(false);

    if (!result?.success) {
      setError(result?.message || 'Unable to sign up. Please try again.');
      return;
    }

    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="flex h-[70%] w-[70%] flex-col items-stretch justify-center space-y-3">
      <div>
        <div className="text-[20px] font-semibold leading-[28px]">
          Create an Account
        </div>
        <p className="mb-[24px] mt-[5px] text-xs leading-[16px] text-slate-700">
          Please enter your details to sign up
        </p>
      </div>

      <form className="w-full space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fullname" className="mb-2 block cursor-pointer">
            Full Name
          </label>
          <input
            id="fullname"
            type="text"
            placeholder="Alex Hill"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-[4px] border border-gray-300 bg-[#F1F5F9] px-4 py-3 focus:border-[#00C951] focus:bg-[#E8F0FE] focus:outline-none"
          />
        </div>

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
          {isSubmitting ? 'Signing up...' : 'Sign Up'}
        </button>

        <p className="mt-[12px] text-[13px]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="cursor-pointer font-semibold text-[#16a34a] underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
