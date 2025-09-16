"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
	const [theme, setTheme] = useState("light");
	useEffect(() => {
		const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
		const initial = saved || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
		setTheme(initial);
		document.documentElement.setAttribute("data-theme", initial === "dark" ? "dark" : "light");
	}, []);
	useEffect(() => {
		if (!theme) return;
		localStorage.setItem("theme", theme);
		document.documentElement.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
	}, [theme]);
	
	return (
		<button 
			aria-label="Toggle theme" 
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
			className="relative inline-flex h-6 w-12 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] focus:ring-offset-2 dark:bg-gray-700"
		>
			{/* Sun icon for light mode */}
			<span className={`absolute left-1 text-xs transition-opacity ${theme === "light" ? "opacity-100" : "opacity-40"}`}>
				☀️
			</span>
			
			{/* Moon icon for dark mode */}
			<span className={`absolute right-1 text-xs transition-opacity ${theme === "dark" ? "opacity-100" : "opacity-40"}`}>
				🌙
			</span>
			
			{/* Toggle circle */}
			<span
				className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
					theme === "dark" ? "translate-x-6" : "translate-x-1"
				}`}
			/>
		</button>
	);
}
