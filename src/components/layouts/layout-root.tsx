import { Outlet } from 'react-router-dom';

import NavigationBar from '@components/elements/navbar';
import Sidebar from '@components/elements/sidebar';

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function RootLayout() {
  return (
    <div className="min-h-screen">
      <NavigationBar />
      <div className="pt-16">
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
