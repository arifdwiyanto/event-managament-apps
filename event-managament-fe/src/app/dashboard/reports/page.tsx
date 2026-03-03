import { ReportView } from "@/features/reports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports - Hype",
  description: "Detailed transaction and sales reports for your events",
};

export default function ReportPage() {
  return <ReportView />;
}
