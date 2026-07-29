import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, Navbar, Footer } from '../components/layout';

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main column */}
            <div className="flex flex-1 flex-col overflow-hidden w-full">
                <Navbar onMenuClick={() => setSidebarOpen((o) => !o)} />

                {/* Scrollable content */}
                <main className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-8">
                    <Outlet />
                </main>

                <Footer />
            </div>
        </div>
    );
}
