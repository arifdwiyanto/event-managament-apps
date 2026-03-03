import ManagePromotionsView from "@/features/promotions/components/ManagePromotionsView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Promotions - Dashboard",
  description: "Manage your promotions and discounts.",
};

const PromotionsPage = () => {
  return <ManagePromotionsView />;
};

export default PromotionsPage;
