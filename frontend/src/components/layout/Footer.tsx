import { Zap } from 'lucide-react';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer
            id="app-footer"
            className="border-t border-slate-800 bg-slate-900/50 px-6 py-4"
        >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
                {/* Brand mark */}
                <div className="flex items-center gap-1.5">
                    <Zap size={13} className="text-blue-500" />
                    <span className="font-semibold text-slate-400">AutoCommand</span>
                    <span>Executive Suite</span>
                </div>

                {/* Copyright */}
                <p>© {year} AutoCommand. All rights reserved.</p>

                {/* Version */}
                <p className="text-slate-600 font-mono">v1.0.0</p>
            </div>
        </footer>
    );
}
