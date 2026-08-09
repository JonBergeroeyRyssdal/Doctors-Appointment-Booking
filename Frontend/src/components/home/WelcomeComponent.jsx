import DashboardCardGrid from "../dashboard/DashboardCardGrid";
import { welcomeCards } from "../../data/welcomeCards";

function WelcomeComponent() {
  return <DashboardCardGrid cards={welcomeCards} columns={3} />;
}

export default WelcomeComponent;
