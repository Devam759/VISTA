"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";

const getNavItems = (role) => {
	const allItems = [
		{ href: "/", label: "Dashboard" },
		{ href: "/students", label: "Students", roles: ["Warden"] },
		{ href: "/hostels", label: "Hostels", roles: ["Warden"] },
		{ href: "/attendance", label: "Attendance" },
		{ href: "/face", label: "Face Enrollment", roles: ["Student"] },
		{ href: "/mark", label: "Mark Attendance", roles: ["Student"] },
		{ href: "/login", label: "Login", roles: [] }, // Only show when not logged in
	];
	
	const filteredItems = allItems.filter(item => {
		if (!item.roles) return true; // Show items without role restrictions
		if (item.roles.length === 0) return !role; // Show login only when not logged in
		return role && item.roles.includes(role); // Show role-specific items
	});
	
	return filteredItems;
};

export default function Sidebar() {
	const pathname = usePathname();
	const { role } = useAuth();
	const isActive = (href) => pathname === href;
	const navItems = getNavItems(role);
	
	return (
		<aside className="block w-72 shrink-0 sidebar-glass py-8 px-6 sticky top-[73px] h-[calc(100svh-73px)] overflow-y-auto">
			<div className="space-y-8">
				<div>
					<h2 className="text-sm font-semibold text-foreground/80 mb-4 tracking-wide">Navigation</h2>
					<nav className="space-y-2">
						{navItems.map((item) => (
							<a
								key={item.href}
								href={item.href}
								className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
									isActive(item.href)
										? "bg-gradient-to-r from-[color:var(--accent)]/15 to-[color:var(--accent)]/10 text-[color:var(--accent)] border border-[color:var(--accent)]/30 shadow-sm"
										: "text-foreground/70 hover:text-foreground hover:bg-gradient-to-r hover:from-foreground/5 hover:to-foreground/3 hover:shadow-sm"
								}`}
							>
								<span className="flex-1">{item.label}</span>
								{isActive(item.href) && (
									<div className="w-2 h-2 rounded-full bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--accent)] shadow-sm"></div>
								)}
							</a>
						))}
					</nav>
				</div>
			</div>
		</aside>
	);
}


