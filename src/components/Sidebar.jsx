import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Sidebar({ open }) {
  const { pathname } = useLocation();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // USER DETAILS
  const fullName = user?.fullName || 'Guest User';

  // GET INITIALS → First letter of first + last name
  const getInitials = () => {
    if (!fullName) return 'G';

    const parts = fullName.trim().split(' ');
    const first = parts[0]?.charAt(0) || '';
    const second = parts[1]?.charAt(0) || '';

    return (first + second).toUpperCase();
  };

  const initials = getInitials();

  const menu = [
    { name: 'Dashboard', path: '/dashboard', icon: <DashboardSVG /> },
    { name: 'Income', path: '/income', icon: <IncomeSVG /> },
    { name: 'Expense', path: '/expense', icon: <ExpenseSVG /> },
    { name: 'Logout', action: 'logout', icon: <LogoutSVG /> },
  ];

  return (
    <>
      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-[70px] z-40 -ml-4 h-[calc(100vh-61px)] w-64 border-r border-gray-200/50 bg-white p-5 transition-all duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}
      >
        <SidebarContent
          pathname={pathname}
          menu={menu}
          fullName={fullName}
          initials={initials}
          handleLogout={handleLogout}
        />
      </div>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block">
        <div className="sticky top-[70px] h-[calc(100vh-61px)] w-64 border-r border-gray-200/50 bg-white p-5">
          <SidebarContent
            pathname={pathname}
            menu={menu}
            fullName={fullName}
            initials={initials}
            handleLogout={handleLogout}
          />
        </div>
      </div>
    </>
  );
}

function SidebarContent({ pathname, menu, fullName, initials, handleLogout }) {
  return (
    <>
      {/* PROFILE */}
      <div className="mb-7 mt-3 flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 font-medium text-gray-900">
          {initials}
        </div>
        <h5 className="font-medium leading-6 text-gray-950">{fullName}</h5>
      </div>

      {/* MENU */}
      {menu.map((item) => {
        if (item.action === 'logout') {
          return (
            <button
              key="logout"
              onClick={handleLogout}
              className="mb-3 flex w-full cursor-pointer items-center gap-4 rounded-lg px-6 py-3 text-[15px] hover:bg-gray-100"
            >
              <span className="text-xl">{item.icon}</span>
              Logout
            </button>
          );
        }

        return (
          <Link to={item.path} key={item.name}>
            <button
              className={`mb-3 flex w-full cursor-pointer items-center gap-4 rounded-lg px-6 py-3 text-[15px] ${
                pathname === item.path
                  ? 'bg-[#16a24a] text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.name}
            </button>
          </Link>
        );
      })}
    </>
  );
}

////////////////////////////////////////////////////////////////////////////////
// SVG ICONS (NO CHANGE)
////////////////////////////////////////////////////////////////////////////////


function DashboardSVG() {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-xl"
      height="1em"
      width="1em"
    >
      <rect width="7" height="9" x="3" y="3" rx="1"></rect>
      <rect width="7" height="5" x="14" y="3" rx="1"></rect>
      <rect width="7" height="9" x="14" y="12" rx="1"></rect>
      <rect width="7" height="5" x="3" y="16" rx="1"></rect>
    </svg>
  );
}

function IncomeSVG() {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-xl"
      height="1em"
      width="1em"
    >
      <path d="M17 14h.01"></path>
      <path
        d="M7 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 
      2 0 0 1-2-2V5a2 2 0 0 1 2-2h14"
      ></path>
    </svg>
  );
}

function ExpenseSVG() {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-xl"
      height="1em"
      width="1em"
    >
      <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"></path>
      <path
        d="m7 21 1.6-1.4c.3-.4.8-.6 
      1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 
      2 0 0 0-2.75-2.91l-4.2 3.9"
      ></path>
      <path d="m2 16 6 6"></path>
      <circle cx="16" cy="9" r="2.9"></circle>
      <circle cx="6" cy="5" r="3"></circle>
    </svg>
  );
}

function LogoutSVG() {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-xl"
      height="1em"
      width="1em"
    >
      <path
        d="M9 21H5a2 2 0 0 1-2-2V5a2 
      2 0 0 1 2-2h4"
      ></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  );
}
