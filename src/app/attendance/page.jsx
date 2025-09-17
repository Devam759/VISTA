function StatusBadge({ status }) {
  const color = status === "Present" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : status === "Late" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" : "bg-rose-500/15 text-rose-600 dark:text-rose-400";
  return <span className={`px-2 py-0.5 rounded-full text-xs ${color}`}>{status}</span>;
}

import Protected from "../../components/Protected";
import AttendanceView from "../../components/AttendanceView";

export default function AttendancePage() {
  return (
    <Protected allow={["Student", "Warden"]}>
      <AttendanceView />
    </Protected>
  );
}


