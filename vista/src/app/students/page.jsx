import Protected from "../../components/Protected";

function Badge({ children }) {
  return <span className="px-2 py-0.5 rounded-full text-xs bg-black/[.06] dark:bg-white/[.09]">{children}</span>;
}

export default function StudentsPage() {
  const data = [
    { studentId: 1, rollNo: "23BCS001", name: "Aarav Patel", roomNo: "B-205", hostel: "BH1" },
    { studentId: 2, rollNo: "23BCS002", name: "Isha Sharma", roomNo: "G-310", hostel: "GH1" },
    { studentId: 3, rollNo: "23BCS003", name: "Rohan Mehta", roomNo: "B-110", hostel: "BH2" },
  ];

  return (
    <Protected allow={["Warden", "ChiefWarden"]}>
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Students</h1>
        <p className="text-sm text-foreground/70">Roster across hostels with rooms</p>
      </div>
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left border-b border-black/[.06]">
              <th className="py-2 pr-4">Student ID</th>
              <th className="py-2 pr-4">Roll No</th>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Room No</th>
              <th className="py-2 pr-4">Hostel</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((s) => (
              <tr key={s.studentId} className="border-b border-black/[.06]">
                <td className="py-2 pr-4">{s.studentId}</td>
                <td className="py-2 pr-4 font-mono">{s.rollNo}</td>
                <td className="py-2 pr-4">{s.name}</td>
                <td className="py-2 pr-4">{s.roomNo}</td>
                <td className="py-2 pr-4"><Badge>{s.hostel}</Badge></td>
                <td className="py-2 pr-4">
                  <button className="text-xs underline mr-2">View</button>
                  <button className="text-xs underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </Protected>
  );
}


