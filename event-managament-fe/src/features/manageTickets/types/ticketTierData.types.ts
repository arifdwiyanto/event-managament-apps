export interface TicketTierData {
  id: string;
  name: string;
  priceStr: string;
  subtitle: string;
  status: "ACTIVE" | "SOLD OUT" | "PAUSED";
  sold: number;
  total: number;
  colorHex: number;
}
