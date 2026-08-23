import { Menu, X } from 'lucide-react';

export default function Topbar({ open, setOpen }) {
  return (
    <div className="sticky top-0 z-30 flex gap-5 border-b border-gray-200/50 bg-white px-7 py-3 backdrop-blur-[2px]">
      {/* Mobile Button */}
      <button
        className="block text-black lg:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="text-2xl" /> : <Menu className="text-2xl" />}
      </button>

      {/* Logo */}
      <img
        alt=""
        className="w-35 h-14 cursor-pointer bg-transparent object-contain md:ml-5"
        src="logo1.png"
      />
    </div>
  );
}
