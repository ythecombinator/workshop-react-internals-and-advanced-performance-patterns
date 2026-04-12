import { Outlet } from 'react-router-dom';

import NavigationBar from '@components/elements/navbar';
import Sidebar from '@components/elements/sidebar';

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <div className="pt-14">
        <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-muted/40 p-6">
            <div className="max-w-7xl mx-auto animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
