import Protected from "../../components/Protected";

export default function HostelsPage() {
  const data = [
    { hostelId: 1, name: "BH1", type: "Boys", warden: "Mr. Verma" },
    { hostelId: 2, name: "BH2", type: "Boys", warden: "Mr. Rao" },
    { hostelId: 3, name: "GH1", type: "Girls", warden: "Ms. Kapoor" },
  ];

  return (
    <Protected allow={["ChiefWarden", "Warden"]}>
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Hostels</h1>
        <p className="text-sm text-foreground/70">List of hostels and wardens</p>
      </div>
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
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
    </div>
    </Protected>
  );
}


