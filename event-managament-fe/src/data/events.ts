// Mock Data - Events
// Simulates API response structure

export interface Event {
  id: string;
  title: string;
  slug: string;
  category: {
    id: string;
    name: string;
    color: "pink" | "cyan" | "purple" | "green" | "lime";
  };
  date: string;
  time: string;
  location: {
    city: string;
  };
  price: number;
  currency: string;
  isFree: boolean;
  image: string;
  isFavorite: boolean;
}

export interface EventsResponse {
  data: Event[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export const mockEvents: EventsResponse = {
  data: [
    {
      id: "evt-001",
      title: "Neon Nights Festival 2024",
      slug: "neon-nights-festival-2024",
      category: { id: "cat-music", name: "Music", color: "pink" },
      date: "Sat, Oct 24",
      time: "8:00 PM",
      location: { city: "Jakarta" },
      price: 450000,
      currency: "IDR",
      isFree: false,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD1WMCZoHaSjngfsapkDhVHLgDTxMNqXxRRTUYcoJvyzaHyf1gLIIKM-DQCIwjlZzN5mxDCzT4AUx_zb-gP4hfAj4JTp8JzT5wPom0D0KSK2wvAvXdIbvfZvK1bxv_DtasgZTq26l03bjJpOvcLTm3-W5OHiXcCf1VwVVQzQo4sa6IzmQgw7f5mzBeDl3crEd42p99COQmTx5fkdNWtT9s7jxs-gf8ocM5UGeI15OE0GCGiv5MEDTATjQy4ypZJ7OsWWDItnoSDYQA",
      isFavorite: false,
    },
    {
      id: "evt-002",
      title: "Pottery & Wine Evening",
      slug: "pottery-wine-evening",
      category: { id: "cat-workshop", name: "Workshop", color: "cyan" },
      date: "Sun, Oct 25",
      time: "4:00 PM",
      location: { city: "Jaksel" },
      price: 350000,
      currency: "IDR",
      isFree: false,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCJnPkYGfBE5cP94vJ88oI0Z0uDmkb5vidVRnfhJtB4oUGVxbXQbPo7cxw4ebcegpwuZu7_Io5yTdVtdkwziG0zf8co13cWWQf-5OZch7HavJSxyfp_BTyL02lGn8TKHxwnLq9i-Xn6l_1BXTYZF8uqHyYjLtcPd704eZAV05qcKzAsPks5rEx7_LzssuT6WGVSkaIpQmBDEZmt-zCgXaeZwK2h3N-5F9nrnD3105xfIj7diU4RB6kNtRIGUjrTMljPW-Op5FKtITQ",
      isFavorite: false,
    },
    {
      id: "evt-003",
      title: "Underground Techno Bash",
      slug: "underground-techno-bash",
      category: { id: "cat-nightlife", name: "Nightlife", color: "purple" },
      date: "Fri, Oct 30",
      time: "10:00 PM",
      location: { city: "Jakarta" },
      price: 200000,
      currency: "IDR",
      isFree: false,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD1WMCZoHaSjngfsapkDhVHLgDTxMNqXxRRTUYcoJvyzaHyf1gLIIKM-DQCIwjlZzN5mxDCzT4AUx_zb-gP4hfAj4JTp8JzT5wPom0D0KSK2wvAvXdIbvfZvK1bxv_DtasgZTq26l03bjJpOvcLTm3-W5OHiXcCf1VwVVQzQo4sa6IzmQgw7f5mzBeDl3crEd42p99COQmTx5fkdNWtT9s7jxs-gf8ocM5UGeI15OE0GCGiv5MEDTATjQy4ypZJ7OsWWDItnoSDYQA",
      isFavorite: true,
    },
    {
      id: "evt-004",
      title: "Smooth Jazz & Cocktails",
      slug: "smooth-jazz-cocktails",
      category: { id: "cat-music", name: "Music", color: "pink" },
      date: "Thu, Nov 02",
      time: "7:30 PM",
      location: { city: "Jakarta" },
      price: 150000,
      currency: "IDR",
      isFree: false,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBSC_qi23849UgaBqsquDgdbtxVQxBYKND7DI_Z96-n8dzgd4mtKW7kHVa-G6J8a5YQfdlOaZ955OFDaYad5r4wM_kW8307jICKVE72ZtnhNVP0a0-d9BilegHv3z4YKRg2jvOzpjorv1XpG6uqZi-8AkNQvRjCRZb9Vr33U9qqHPlVNZfQL6Qmi27oKQYyr9oUF1hu-oq6lCX3C9xymV1xWCUNE9FpP9JV33thRSXAcWXHINBYliDOgzmOlbqFCQhH7v6xK2nXzVQ",
      isFavorite: false,
    },
    {
      id: "evt-005",
      title: "Startup Founders Meetup",
      slug: "startup-founders-meetup",
      category: { id: "cat-tech", name: "Tech", color: "green" },
      date: "Tue, Nov 05",
      time: "6:30 PM",
      location: { city: "Jakarta" },
      price: 0,
      currency: "IDR",
      isFree: true,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAieRbDC6ZpJa9_QUxpKKLJQCWKs9X0cxi6be1u8HXFg9GcQIanTEQaIGl631IgsE-jnOAY0b5xRSEtQx5vh8MTEe4_iEOjCqUyp9PqoZEsXtJQzc8n5jQEBXEhA_qjpJncYdjassGmE3oWswDqzYuz9Ex3ZVQVoQ-Dx4MHxEa1t18ydLshGc4SUQCvXx36XraAu778htb1-2rQIAmNV1bhvf4vn6hV0ByveeL57n36kFv0NiA4MGugWIddgr7xyrrkvifyTH0wCCI",
      isFavorite: false,
    },
    {
      id: "evt-006",
      title: "Modern Art Gallery Tour",
      slug: "modern-art-gallery-tour",
      category: { id: "cat-art", name: "Art", color: "cyan" },
      date: "Sat, Nov 09",
      time: "10:00 AM",
      location: { city: "Jakarta" },
      price: 100000,
      currency: "IDR",
      isFree: false,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCJnPkYGfBE5cP94vJ88oI0Z0uDmkb5vidVRnfhJtB4oUGVxbXQbPo7cxw4ebcegpwuZu7_Io5yTdVtdkwziG0zf8co13cWWQf-5OZch7HavJSxyfp_BTyL02lGn8TKHxwnLq9i-Xn6l_1BXTYZF8uqHyYjLtcPd704eZAV05qcKzAsPks5rEx7_LzssuT6WGVSkaIpQmBDEZmt-zCgXaeZwK2h3N-5F9nrnD3105xfIj7diU4RB6kNtRIGUjrTMljPW-Op5FKtITQ",
      isFavorite: false,
    },
  ],
  meta: {
    total: 156,
    page: 1,
    perPage: 6,
    totalPages: 26,
  },
};

// Simulated API fetch function
export const fetchEvents = async (page = 1): Promise<EventsResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockEvents;
};
