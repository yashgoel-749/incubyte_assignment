export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="py-4 text-center text-xs text-slate-500 bg-transparent">
            © {year} Premium Deluxe Motors. All rights reserved.
        </footer>
    );
}
