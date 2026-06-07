"use client";
import { TrendingUp, Users, Share2, MapPin } from "lucide-react";
import StatCard from "@/app/components/StatCard";

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard label="National Poll Lead" value="+15pts" sub="vs. closest rival" trend="2.1pts this week" trendUp icon={TrendingUp} color="bg-blue-500" />
      <StatCard label="Registered Supporters" value="2.4M" sub="Across all regions" trend="+82K this month" trendUp icon={Users} color="bg-violet-500" />
      <StatCard label="Social Reach" value="502K" sub="Mentions last 30 days" trend="+18% vs last month" trendUp icon={Share2} color="bg-pink-500" />
      <StatCard label="Regions Leading" value="3 / 5" sub="National Capital, Luzon N/S" icon={MapPin} color="bg-emerald-500" />
    </div>
  );
}
