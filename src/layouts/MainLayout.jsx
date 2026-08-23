// import { useState } from 'react';
// import Sidebar from '../components/Sidebar';
// import Topbar from '../components/Topbar';

// export default function MainLayout({ children }) {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="w-full">
//       {/* ---- TOP BAR ---- */}
//       <Topbar onMenuClick={() => setOpen(true)} />

//       <div className="flex">
//         {/* ---- MOBILE SIDEBAR (Slide-in) ---- */}
//         <div className="lg:hidden">
//           <Sidebar open={open} setOpen={setOpen} />
//         </div>

//         {/* ---- DESKTOP SIDEBAR (Visible Always) ---- */}
//         <div className="hidden lg:block">
//           <Sidebar open={true} setOpen={setOpen} />
//         </div>

//         {/* ---- MAIN CONTENT ---- */}
//         <main className="mx-5 mt-4 grow md:mx-10">{children}</main>
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function MainLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      {/* TOP BAR */}
      <Topbar open={open} setOpen={setOpen} />

      <div className="flex">
        {/* MOBILE SIDEBAR */}
        <div className="lg:hidden">
          <Sidebar open={open} />
        </div>

        {/* DESKTOP SIDEBAR */}
        <div className="hidden lg:block">
          <Sidebar open={true} />
        </div>

        {/* MAIN CONTENT */}
        <main className="mx-5 mt-4 grow md:mx-10">{children}</main>
      </div>
    </div>
  );
}
