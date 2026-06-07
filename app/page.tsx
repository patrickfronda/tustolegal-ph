import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import StatsGrid from "@/app/components/StatsGrid";
import PollChart from "@/app/components/PollChart";
import SentimentChart from "@/app/components/SentimentChart";
import RegionalSupport from "@/app/components/RegionalSupport";
import IssuesTracker from "@/app/components/IssuesTracker";
import SocialMetrics from "@/app/components/SocialMetrics";
import DemographicsChart from "@/app/components/DemographicsChart";
import RecentEvents from "@/app/components/RecentEvents";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          {/* Candidate banner */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-5 mb-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">M</div>
            <div>
              <h2 className="text-lg font-bold">Maria Santos — Progressive Alliance</h2>
              <p className="text-blue-200 text-sm">2025 General Election · Updated live</p>
            </div>
            <div className="ml-auto text-right hidden sm:block">
              <div className="text-3xl font-extrabold">43%</div>
              <div className="text-blue-200 text-xs">National avg. poll</div>
            </div>
          </div>

          {/* KPI cards */}
          <StatsGrid />

          {/* Charts row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div className="lg:col-span-2">
              <PollChart />
            </div>
            <SentimentChart />
          </div>

          {/* Charts row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <RegionalSupport />
            <DemographicsChart />
          </div>

          {/* Charts row 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <IssuesTracker />
            <SocialMetrics />
            <RecentEvents />
          </div>
        </main>
      </div>
    </div>
  );
}
