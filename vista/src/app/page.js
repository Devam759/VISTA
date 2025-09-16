import Protected from "../components/Protected";
import DashboardSwitch from "../components/DashboardSwitch";

export default function Home() {
  return (
    <Protected>
      <DashboardSwitch />
    </Protected>
  );
}
