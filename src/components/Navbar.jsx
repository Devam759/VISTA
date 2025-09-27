"use client";

import { useAuth } from "./AuthProvider";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
	const { role, logout } = useAuth();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	return (
		<>
			<header className="w-full navbar-glass sticky top-0 z-30">
				<div className="container-app py-4 flex items-center justify-between">
					<div className="flex items-center gap-4">
						{/* Mobile hamburger menu */}
						<button
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="md:hidden p-2 rounded-lg hover:bg-[color:var(--muted)]/50 transition-colors"
							aria-label="Toggle mobile menu"
						>
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								{isMobileMenuOpen ? (
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								) : (
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
								)}
							</svg>
						</button>
						
						<Link href="/" className="flex items-center group">
							<img src="/logo.webp" alt="VISTA" className="h-12 w-30 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-200" />
						</Link>
					</div>
					
					{/* Desktop navigation */}
					<nav className="hidden md:flex gap-5 text-sm items-center">
						{role ? (
							<>
								<Link href="/" className="hover:underline underline-offset-4">Dashboard</Link>
								{role !== "Student" && (
									<>
										<Link href="/students" className="hover:underline underline-offset-4">Students</Link>
										<Link href="/hostels" className="hover:underline underline-offset-4">Hostels</Link>
									</>
								)}
								<Link href="/attendance" className="hover:underline underline-offset-4">Attendance</Link>
								<span className="text-xs px-2 py-0.5 rounded-full pill">{role}</span>
								<button onClick={logout} className="btn">Logout</button>
							</>
						) : (
							<Link href="/login" className="btn btn-primary">Login</Link>
						)}
						<ThemeToggle />
					</nav>
					
					{/* Mobile theme toggle */}
					<div className="md:hidden">
						<ThemeToggle />
					</div>
				</div>
			</header>
			
			{/* Mobile menu overlay */}
			<div className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ease-in-out ${
				isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
			}`}>
				<div 
					className="fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out" 
					onClick={() => setIsMobileMenuOpen(false)} 
				/>
				<div className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-[color:var(--card)] shadow-xl transform transition-all duration-300 ease-in-out ${
					isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
				}`}>
					{/* Mobile navbar header */}
					<div className="flex items-center justify-between p-4 border-b border-[color:var(--border)]">
						<Link href="/" className="flex items-center group" onClick={() => setIsMobileMenuOpen(false)}>
							<img src="/logo.webp" alt="VISTA" className="h-10 w-10 rounded-xl shadow-sm" />
						</Link>
						<button
							onClick={() => setIsMobileMenuOpen(false)}
							className="p-2 rounded-lg hover:bg-[color:var(--muted)]/50 transition-colors"
							aria-label="Close mobile menu"
						>
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
					
					{/* Mobile navigation - simplified without quick stats */}
					<nav className="p-4 space-y-2">
						{role ? (
							<>
								<div className="space-y-2">
									<Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-[color:var(--accent)]/10 hover:text-[color:var(--accent)] transition-all" onClick={() => setIsMobileMenuOpen(false)}>
										<span className="flex-1">Dashboard</span>
									</Link>
									{role !== "Student" && (
										<>
											<Link href="/students" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-[color:var(--accent)]/10 hover:text-[color:var(--accent)] transition-all" onClick={() => setIsMobileMenuOpen(false)}>
												<span className="flex-1">Students</span>
											</Link>
											<Link href="/hostels" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-[color:var(--accent)]/10 hover:text-[color:var(--accent)] transition-all" onClick={() => setIsMobileMenuOpen(false)}>
												<span className="flex-1">Hostels</span>
											</Link>
										</>
									)}
									<Link href="/attendance" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-[color:var(--accent)]/10 hover:text-[color:var(--accent)] transition-all" onClick={() => setIsMobileMenuOpen(false)}>
										<span className="flex-1">Attendance</span>
									</Link>
									{role === "Student" && (
										<Link href="/mark" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-[color:var(--accent)]/10 hover:text-[color:var(--accent)] transition-all" onClick={() => setIsMobileMenuOpen(false)}>
											<span className="flex-1">Mark Attendance</span>
										</Link>
									)}
								</div>
								
								<div className="pt-4 border-t border-[color:var(--border)]">
									<div className="flex items-center justify-between px-4 py-2 mb-4">
										<span className="text-sm text-foreground/60">Role:</span>
										<span className="text-xs px-3 py-1 rounded-full pill">{role}</span>
									</div>
									<button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full mx-4 btn">Logout</button>
								</div>
							</>
						) : (
							<div className="space-y-2">
								<Link href="/login" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-[color:var(--accent)]/10 hover:text-[color:var(--accent)] transition-all" onClick={() => setIsMobileMenuOpen(false)}>
									<span className="flex-1">Login</span>
								</Link>
							</div>
						)}
					</nav>
				</div>
			</div>
		</>
	);
}


