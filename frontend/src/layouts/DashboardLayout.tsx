import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, Navbar, Footer } from '../components/layout';

/**
 * DashboardLayout
 * ─────────────────────────────────────────────────────────────────────────
 * Wraps every authenticated page with:
 *   - Fixed sidebar (desktop) / slide-in drawer (mobile)
 *   - Sticky top navbar with hamburger trigger
 *   - Scrollable main content area via <Outlet />
 *   - Footer fixed to the bottom of the content column
 */
export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-slate-900">
            {/* ── Sidebar ──────────────────────────────────────────────── */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* ── Main column ──────────────────────────────────────────── */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <Navbar onMenuClick={() => setSidebarOpen((o) => !o)} />

                {/* Scrollable content */}
                <main
                    id="dashboard-main"
                    className="flex-1 overflow-y-auto bg-slate-950 p-4 lg:p-6"
                >
                    <Outlet />
                </main>

                <Footer />
            </div>
        </div>
    );
}
