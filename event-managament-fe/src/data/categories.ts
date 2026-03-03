// Mock Data - Categories
// Simulates API response structure

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  eventCount: number;
  thumbnail: string;
  color: string;
  badge?: string;
}

export interface CategoriesResponse {
  data: Category[];
}

export const mockCategories: CategoriesResponse = {
  data: [
    {
      id: "cat-nightlife",
      name: "Nightlife",
      slug: "nightlife",
      icon: "SparklesIcon",
      eventCount: 120,
      thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1WMCZoHaSjngfsapkDhVHLgDTxMNqXxRRTUYcoJvyzaHyf1gLIIKM-DQCIwjlZzN5mxDCzT4AUx_zb-gP4hfAj4JTp8JzT5wPom0D0KSK2wvAvXdIbvfZvK1bxv_DtasgZTq26l03bjJpOvcLTm3-W5OHiXcCf1VwVVQzQo4sa6IzmQgw7f5mzBeDl3crEd42p99COQmTx5fkdNWtT9s7jxs-gf8ocM5UGeI15OE0GCGiv5MEDTATjQy4ypZJ7OsWWDItnoSDYQA",
      color: "#00F0FF", // Cyan hex
      badge: "120+ Events",
    },
    {
      id: "cat-creative",
      name: "Creative",
      slug: "creative",
      icon: "PaintBrushIcon",
      eventCount: 85,
      thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJnPkYGfBE5cP94vJ88oI0Z0uDmkb5vidVRnfhJtB4oUGVxbXQbPo7cxw4ebcegpwuZu7_Io5yTdVtdkwziG0zf8co13cWWQf-5OZch7HavJSxyfp_BTyL02lGn8TKHxwnLq9i-Xn6l_1BXTYZF8uqHyYjLtcPd704eZAV05qcKzAsPks5rEx7_LzssuT6WGVSkaIpQmBDEZmt-zCgXaeZwK2h3N-5F9nrnD3105xfIj7diU4RB6kNtRIGUjrTMljPW-Op5FKtITQ",
      color: "#FFBB00", // Gold hex
      badge: "Daily",
    },
    {
      id: "cat-concerts",
      name: "Concerts",
      slug: "concerts",
      icon: "MusicalNoteIcon",
      eventCount: 64,
      thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1WMCZoHaSjngfsapkDhVHLgDTxMNqXxRRTUYcoJvyzaHyf1gLIIKM-DQCIwjlZzN5mxDCzT4AUx_zb-gP4hfAj4JTp8JzT5wPom0D0KSK2wvAvXdIbvfZvK1bxv_DtasgZTq26l03bjJpOvcLTm3-W5OHiXcCf1VwVVQzQo4sa6IzmQgw7f5mzBeDl3crEd42p99COQmTx5fkdNWtT9s7jxs-gf8ocM5UGeI15OE0GCGiv5MEDTATjQy4ypZJ7OsWWDItnoSDYQA",
      color: "#FF00E5", // Pink hex
      badge: "Live",
    },
  ],
};

// Filter categories for filter bar
export interface FilterCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const filterCategories: FilterCategory[] = [
  { id: "all", name: "All Vibes", icon: "grid_view", color: "#FF00E5" },
  { id: "music", name: "Music", icon: "music_note", color: "#A855F7" },
  { id: "nightlife", name: "Nightlife", icon: "nightlife", color: "#00F0FF" },
  { id: "workshop", name: "Workshop", icon: "palette", color: "#FFBB00" },
  { id: "food", name: "Food", icon: "restaurant", color: "#00FF00" },
];

// Simulated API fetch function
export const fetchCategories = async (): Promise<CategoriesResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockCategories;
};
