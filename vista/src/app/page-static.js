export default function HomeStatic() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">VISTA</h1>
        <p className="text-gray-600 mb-8">Night Attendance System</p>
        <div className="space-y-4">
          <a href="/attendance" className="block btn btn-primary">View Attendance</a>
          <a href="/mark" className="block btn">Mark Attendance</a>
        </div>
      </div>
    </div>
  );
}
