export default function Sidebar() {
  return (
    <aside className="hidden md:block md:w-60 shrink-0 border-r border-black/[.08] dark:border-white/[.145] py-6 px-4 sticky top-0 h-svh">
      <div className="text-sm font-semibold mb-4">Navigate</div>
      <ul className="space-y-2 text-sm">
        <li><a href="/" className="hover:underline">Dashboard</a></li>
        <li><a href="/students" className="hover:underline">Students</a></li>
        <li><a href="/hostels" className="hover:underline">Hostels</a></li>
        <li><a href="/attendance" className="hover:underline">Attendance</a></li>
        <li><a href="/face" className="hover:underline">Face Enrollment</a></li>
        <li><a href="/login" className="hover:underline">Login</a></li>
      </ul>
    </aside>
  );
}


