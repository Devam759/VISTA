import Protected from "../../components/Protected";

export default function HostelsPage() {
  const data = [
    { hostelId: 1, name: "BH1", type: "Boys", warden: "Mr. Verma" },
    { hostelId: 2, name: "BH2", type: "Boys", warden: "Mr. Rao" },
    { hostelId: 3, name: "GH1", type: "Girls", warden: "Ms. Kapoor" },
    { hostelId: 4, name: "GH2", type: "Girls", warden: "Ms. Sharma" },
  ];

  return (
    <Protected allow={["Warden"]}>
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Hostels</h1>
        <p className="text-sm text-foreground/70">List of hostels and wardens</p>
      </div>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left border-b border-black/[.06]">
              <th className="py-2 pr-4">Hostel ID</th>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Type</th>
              <th className="py-2 pr-4">Warden</th>
            </tr>
          </thead>
          <tbody>
            {data.map((h) => (
              <tr key={h.hostelId} className="border-b border-black/[.06]">
                <td className="py-2 pr-4">{h.hostelId}</td>
                <td className="py-2 pr-4">{h.name}</td>
                <td className="py-2 pr-4">{h.type}</td>
                <td className="py-2 pr-4">{h.warden}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {data.map((h) => (
          <div key={h.hostelId} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{h.name}</h3>
                <p className="text-sm text-gray-600">ID: {h.hostelId}</p>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                h.type === 'Boys' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-pink-100 text-pink-800'
              }`}>
                {h.type}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Warden:</span>
              <span className="ml-2 font-medium text-gray-900">{h.warden}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
    </Protected>
  );
}


