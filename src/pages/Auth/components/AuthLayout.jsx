// src/pages/Auth/components/AuthLayout.jsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';

export default function AuthLayout({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      {/* Right side design */}
      <div className="absolute right-0 top-0 z-0 hidden h-full w-[40%] bg-[#F0FDF4] md:block">
        <div className="absolute -left-4 -top-7 z-10 size-[192px] rounded-[40px] bg-[#00A63E]" />
        <div className="absolute -bottom-7 -left-4 z-10 size-[192px] rounded-[40px] bg-[#00C951]" />
        <div className="absolute -right-10 top-[10%] z-10 size-[192px] rounded-[40px] bg-[#15803D] p-5">
          <div className="size-full rounded-[20px] bg-[#F0FDF4]" />
        </div>

        <img
          src="logo3.png"
          alt=""
          className="absolute bottom-[10px] left-8 z-50 size-[256px] h-auto rounded-[12px] shadow-lg shadow-green-400/15 lg:aspect-square lg:w-[calc(100%-64px)]"
        />

        <div className="absolute left-8 right-8 top-8 z-[100] flex gap-6 rounded-xl border-gray-200/50 bg-white p-4 shadow-md shadow-green-400/10">
          <div className="flex size-12 items-center justify-center rounded-full bg-[#00A63E] text-[26px] text-white drop-shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={26}
              height={26}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.828 14.828 21 21" />
              <path d="M21 16v5h-5" />
              <path d="m21 3-9 9-4-4-6 6" />
              <path d="M21 8V3h-5" />
            </svg>
          </div>
          <div>
            <h6 className="mb-1 text-[12px] text-gray-500">
              Track Your Income & Expenses
            </h6>
            <span className="text-[20px]">₹4,40,000</span>
          </div>
        </div>
      </div>

      {/* Left side (form area) */}
      <div className="relative z-50 flex h-full w-full flex-col items-center justify-center bg-white md:w-[60%]">
        <img
          src="logo1.png"
          alt="symbol"
          className="h-[121px] w-[320px] text-[24px] leading-[32px]"
        />
        {children}
      </div>
    </div>
  );
}
