"use client";
import { useEffect, useState } from "react";
import VisitorInsights from "@/components/admin/VisitorInsights";

const VISITOR_INSIGHTS_TAB = "Visitor Insights";

type LeadItem = {
  _id: string;
  name?: string;
  phone?: string;
  city?: string;
  property?: string;
  email?: string;
  message?: string;
  date?: string;
};

export default function AdminPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [activeTab, setActiveTab] = useState("Lead");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (activeTab === VISITOR_INSIGHTS_TAB) return;

    let ignore = false;

    const loadLeads = async () => {
      const res = await fetch(`/api/leads?type=${activeTab}`);
      const data: unknown = await res.json();

      if (!ignore) {
        setLeads(Array.isArray(data) ? data : []);
      }
    };

    void loadLeads();

    return () => {
      ignore = true;
    };
  }, [activeTab]);

  // 🔍 FILTER LOGIC
  const filteredLeads = leads.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.phone?.includes(search)
  );

  return (
    <div className="flex min-h-screen bg-[#0B0B0B] text-white">

      {/* 🔥 SIDEBAR */}
      <div className="w-64 bg-[#111] border-r border-white/10 p-6">
        <h1 className="text-xl font-bold text-[#D4AF37] mb-8">
          Paramshiv Estate
        </h1>

        <div className="flex flex-col gap-3">
          {["Lead", "Visit", "Contact", VISITOR_INSIGHTS_TAB].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-4 py-3 rounded-lg transition-all ${
                activeTab === tab
                  ? "bg-[#D4AF37] text-black font-semibold"
                  : "text-gray-400 hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 🔥 MAIN */}
      <div className="flex-1 p-8">

        {/* 🔥 HEADER */}
        <div className="flex justify-between items-center mb-8">

  <div>
    <h2 className="text-3xl font-bold text-[#D4AF37]">
      {activeTab === VISITOR_INSIGHTS_TAB ? "Admin Dashboard" : `${activeTab} Dashboard`}
    </h2>
    <p className="text-gray-400 text-sm">
      {activeTab === VISITOR_INSIGHTS_TAB
        ? "Review captured property interest and existing lead data"
        : `Manage all ${activeTab.toLowerCase()} data`}
    </p>
  </div>

  <div className="flex items-center gap-3">

    {/* 🔍 SEARCH */}
    {activeTab !== VISITOR_INSIGHTS_TAB && (
      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-4 py-2 bg-[#111] border border-white/10 rounded-lg"
      />
    )}

    {/* 🔴 LOGOUT BUTTON */}
    <button
      onClick={async () => {
        await fetch("/api/logout");
        window.location.href = "/login";
      }}
      className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition"
    >
      Logout
    </button>

  </div>
</div>

        {activeTab === VISITOR_INSIGHTS_TAB ? (
          <VisitorInsights />
        ) : (
          <>
        {/* 🔥 STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#111] p-6 rounded-xl border border-white/10">
            <p className="text-gray-400 text-sm">Total {activeTab}</p>
            <h3 className="text-2xl font-bold mt-1">
              {leads.length}
            </h3>
          </div>

          <div className="bg-[#111] p-6 rounded-xl border border-white/10">
            <p className="text-gray-400 text-sm">Latest Entry</p>
            <h3 className="text-sm mt-1">
              {leads[0]?.name || "No data"}
            </h3>
          </div>

          <div className="bg-[#111] p-6 rounded-xl border border-white/10">
            <p className="text-gray-400 text-sm">Status</p>
            <h3 className="text-sm mt-1 text-green-400">
              Active
            </h3>
          </div>
        </div>

        {/* 🔥 DATA GRID */}
        {filteredLeads.length === 0 ? (
          <p className="text-gray-500">No {activeTab} data found</p>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {filteredLeads.map((item) => (
              <div
                key={item._id}
                className="relative bg-[#111] border border-white/10 p-5 rounded-xl hover:border-[#D4AF37]/40 transition-all"
              >

                {/* 🔴 DELETE */}
                <button
                  onClick={async () => {
                    const confirmDelete = confirm("Delete this record?");
                    if (!confirmDelete) return;

                    await fetch("/api/leads", {
                      method: "DELETE",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ id: item._id }),
                    });

                    setLeads((prev) =>
                      prev.filter((l) => l._id !== item._id)
                    );
                  }}
                  className="absolute top-4 right-4 text-xs bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white transition-all"
                >
                  Delete
                </button>

                {/* DATA */}
                <p className="text-lg font-semibold text-[#D4AF37]">
                  {item.name}
                </p>

                <p className="text-sm text-gray-300 mt-1">
                  📞 {item.phone}
                </p>

                {item.city && (
                  <p className="text-sm text-gray-400 mt-1">
                    📍 {item.city}
                  </p>
                )}

                {item.property && (
                  <p className="text-sm text-gray-400 mt-1">
                    🏠 {item.property}
                  </p>
                )}

                {item.email && (
                  <p className="text-sm text-gray-400 mt-1">
                    ✉ {item.email}
                  </p>
                )}

                {item.message && (
                  <p className="text-sm text-gray-400 mt-2 italic">
                    &quot;{item.message}&quot;
                  </p>
                )}

                <p className="text-xs text-gray-500 mt-4">
                  {item.date}
                </p>
              </div>
            ))}

          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
}
