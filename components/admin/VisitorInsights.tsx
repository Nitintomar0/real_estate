"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Home,
  Loader2,
  Phone,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { formatIndianMobileNumber } from "@/components/visitor-interest/validation";

type VisitorListItem = {
  _id: string;
  name: string;
  phone: string;
  firstCapturedAt: string;
  propertyCount: number;
  totalVisitCount: number;
  totalActiveTimeSeconds: number;
  contactActivityCount: number;
  propertyPreview: string[];
};

type VisitRecord = {
  activeDurationSeconds: number;
  visitedAt: string;
};

type PropertyHistoryRecord = {
  propertyId: string;
  propertyTitle: string;
  propertyLocation?: string;
  propertyUrl?: string;
  visitCount: number;
  totalActiveTimeSeconds: number;
  visits: VisitRecord[];
};

type ContactActivityRecord = {
  source: string;
  sourceLabel: string;
  submittedAt: string;
  relatedPropertyId?: string;
  relatedPropertyTitle?: string;
  details?: {
    city?: string;
    email?: string;
    message?: string;
    preferredDate?: string;
    leadType?: string;
  };
};

type VisitorDetail = {
  _id: string;
  name: string;
  phone: string;
  firstCapturedAt: string;
  propertyHistory: PropertyHistoryRecord[];
  contactActivities?: ContactActivityRecord[];
};

type ApiStats = {
  totalVisitors: number;
  totalMeaningfulPropertyViews: number;
  totalActiveTimeSeconds: number;
  totalContactActivities: number;
  mostViewedProperties: Array<{
    _id: string;
    propertyTitle: string;
    propertyLocation?: string;
    totalVisits: number;
    totalActiveTimeSeconds: number;
  }>;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const defaultStats: ApiStats = {
  totalVisitors: 0,
  totalMeaningfulPropertyViews: 0,
  totalActiveTimeSeconds: 0,
  totalContactActivities: 0,
  mostViewedProperties: [],
};

function formatDuration(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds || 0));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${remainingSeconds}s`;
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unknown";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function displayPhone(phone: string) {
  return /^\d{10}$/.test(phone) ? formatIndianMobileNumber(phone) : phone;
}

export default function VisitorInsights() {
  const [visitors, setVisitors] = useState<VisitorListItem[]>([]);
  const [stats, setStats] = useState<ApiStats>(defaultStats);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [propertySearch, setPropertySearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorDetail | null>(
    null
  );
  const [detailLoading, setDetailLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<VisitorListItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const topProperty = stats.mostViewedProperties[0];

  const listUrl = useMemo(() => {
    const params = new URLSearchParams({
      page: String(page),
      limit: "12",
    });

    if (search.trim()) params.set("search", search.trim());
    if (propertySearch.trim()) params.set("property", propertySearch.trim());

    return `/api/visitor-interest?${params.toString()}`;
  }, [page, propertySearch, search]);

  useEffect(() => {
    setPage(1);
  }, [propertySearch, search]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(listUrl, {
          cache: "no-store",
          signal: controller.signal,
        });
        const data = await res.json();

        if (!res.ok || data.success === false) {
          throw new Error(data.error || "Unable to load visitor insights.");
        }

        setVisitors(data.visitors || []);
        setStats(data.stats || defaultStats);
        setPagination(data.pagination);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load visitor insights."
        );
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [listUrl]);

  useEffect(() => {
    if (!notice) return;

    const timer = window.setTimeout(() => setNotice(""), 2800);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const loadDetails = async (visitorId: string) => {
    if (selectedId === visitorId && selectedVisitor) return;

    setSelectedId(visitorId);
    setDetailLoading(true);
    setSelectedVisitor(null);

    try {
      const res = await fetch(`/api/visitor-interest/${visitorId}`, {
        cache: "no-store",
      });
      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.error || "Unable to fetch visitor details.");
      }

      setSelectedVisitor(data.visitor);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to fetch visitor details."
      );
      setSelectedId("");
    } finally {
      setDetailLoading(false);
    }
  };

  const deleteVisitor = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      const res = await fetch(`/api/visitor-interest/${deleteTarget._id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || data?.success === false) {
        throw new Error(data?.error || "Unable to delete visitor.");
      }

      setVisitors((current) =>
        current.filter((visitor) => visitor._id !== deleteTarget._id)
      );
      setDeleteTarget(null);
      setNotice(`${deleteTarget.name} was deleted permanently.`);

      if (selectedId === deleteTarget._id) {
        setSelectedId("");
        setSelectedVisitor(null);
      }

      setPage(1);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete visitor."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="relative">
      {notice && (
        <div className="fixed right-5 top-5 z-[60] rounded-xl border border-emerald-400/25 bg-emerald-500/12 px-4 py-3 text-sm text-emerald-200 shadow-2xl backdrop-blur-xl">
          {notice}
        </div>
      )}

      <div className="mb-7">
        <h2 className="text-3xl font-bold text-[#D4AF37]">
          Visitor Insights
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Property interest linked only after visitors share contact details.
        </p>
      </div>

      <div className="mb-7 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-[#111] p-5">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#D4AF37]/12 text-[#D4AF37]">
            <UserRound size={20} />
          </div>
          <p className="text-sm text-gray-400">Captured Visitors</p>
          <h3 className="mt-1 text-3xl font-semibold">
            {stats.totalVisitors}
          </h3>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#111] p-5">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#D4AF37]/12 text-[#D4AF37]">
            <Eye size={20} />
          </div>
          <p className="text-sm text-gray-400">Meaningful Views</p>
          <h3 className="mt-1 text-3xl font-semibold">
            {stats.totalMeaningfulPropertyViews}
          </h3>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#111] p-5">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#D4AF37]/12 text-[#D4AF37]">
            <BarChart3 size={20} />
          </div>
          <p className="text-sm text-gray-400">Most Viewed Property</p>
          <h3 className="mt-1 line-clamp-1 text-lg font-semibold">
            {topProperty?.propertyTitle || "No data yet"}
          </h3>
          {topProperty && (
            <p className="mt-1 text-xs text-gray-500">
              {topProperty.totalVisits} visits
            </p>
          )}
          <p className="mt-3 text-xs text-gray-500">
            {stats.totalContactActivities} contact activities recorded
          </p>
        </div>
      </div>

      <div className="mb-7 grid gap-3 lg:grid-cols-2">
        <label className="relative block">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search visitor name or mobile"
            className="h-12 w-full rounded-xl border border-white/10 bg-[#111] pl-11 pr-4 text-sm outline-none transition focus:border-[#D4AF37]/60"
          />
        </label>

        <label className="relative block">
          <Home
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]"
          />
          <input
            value={propertySearch}
            onChange={(event) => setPropertySearch(event.target.value)}
            placeholder="Filter by property"
            className="h-12 w-full rounded-xl border border-white/10 bg-[#111] pl-11 pr-4 text-sm outline-none transition focus:border-[#D4AF37]/60"
          />
        </label>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
        <div>
          {loading ? (
            <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-white/10 bg-[#111] text-gray-400">
              <Loader2 className="mr-2 animate-spin text-[#D4AF37]" size={20} />
              Loading visitor intelligence...
            </div>
          ) : visitors.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/15 bg-[#111] p-8 text-center text-gray-400">
              No captured visitor interest found.
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {visitors.map((visitor) => (
                <div
                  key={visitor._id}
                  className={`rounded-xl border bg-[#111] p-5 transition ${
                    selectedId === visitor._id
                      ? "border-[#D4AF37]/55 shadow-[0_0_28px_rgba(212,175,55,0.10)]"
                      : "border-white/10 hover:border-[#D4AF37]/35"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-[#D4AF37]">
                        {visitor.name}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-300">
                        <Phone size={15} />
                        {displayPhone(visitor.phone)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(visitor)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-400/25 bg-red-500/10 text-red-300 transition hover:bg-red-500 hover:text-white"
                      aria-label={`Delete ${visitor.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-white/[0.035] p-3">
                      <p className="text-gray-500">Properties</p>
                      <p className="mt-1 font-semibold">
                        {visitor.propertyCount}
                      </p>
                    </div>
                    <div className="rounded-lg bg-white/[0.035] p-3">
                      <p className="text-gray-500">Submissions</p>
                      <p className="mt-1 font-semibold">
                        {visitor.contactActivityCount}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-lg bg-white/[0.035] p-3 text-sm">
                    <p className="text-gray-500">Active Time</p>
                    <p className="mt-1 font-semibold">
                      {formatDuration(visitor.totalActiveTimeSeconds)}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                    <CalendarDays size={14} />
                    {formatDateTime(visitor.firstCapturedAt)}
                  </div>

                  {visitor.propertyPreview.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {visitor.propertyPreview.map((property) => (
                        <span
                          key={property}
                          className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/8 px-3 py-1 text-xs text-[#F5D061]"
                        >
                          {property}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => loadDetails(visitor._id)}
                    className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#D4AF37]/30 text-sm font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
                  >
                    <Eye size={16} />
                    View Property History
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-gray-400 sm:flex-row">
            <span>
              Page {pagination.page} of {pagination.totalPages} -{" "}
              {pagination.total} visitors
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="flex h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-white transition hover:border-[#D4AF37]/40 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <button
                type="button"
                disabled={page >= pagination.totalPages}
                onClick={() =>
                  setPage((current) =>
                    Math.min(pagination.totalPages, current + 1)
                  )
                }
                className="flex h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-white transition hover:border-[#D4AF37]/40 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <aside className="rounded-xl border border-white/10 bg-[#111] p-5 xl:sticky xl:top-6 xl:max-h-[calc(100vh-48px)] xl:overflow-y-auto">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-[#D4AF37]">Selected Visitor</p>
              <h3 className="mt-1 text-xl font-semibold">Property History</h3>
            </div>
            {selectedVisitor && (
              <button
                type="button"
                onClick={() => {
                  setSelectedId("");
                  setSelectedVisitor(null);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:text-white"
                aria-label="Close details"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {detailLoading ? (
            <div className="flex min-h-[220px] items-center justify-center text-gray-400">
              <Loader2 className="mr-2 animate-spin text-[#D4AF37]" size={18} />
              Loading details...
            </div>
          ) : !selectedVisitor ? (
            <div className="rounded-xl border border-dashed border-white/15 p-6 text-sm leading-6 text-gray-500">
              Select a visitor to see property-level visits, active viewing
              time, and timestamps.
            </div>
          ) : (
            <div>
              <div className="mb-5 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/8 p-4">
                <p className="text-lg font-semibold text-[#F5D061]">
                  {selectedVisitor.name}
                </p>
                <p className="mt-1 text-sm text-gray-300">
                  {displayPhone(selectedVisitor.phone)}
                </p>
                <p className="mt-3 text-xs text-gray-500">
                  First captured {formatDateTime(selectedVisitor.firstCapturedAt)}
                </p>
              </div>

              <div className="mb-6">
                <p className="mb-3 text-sm font-semibold text-[#D4AF37]">
                  Property Interest
                </p>
                {selectedVisitor.propertyHistory.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/15 p-4 text-sm text-gray-500">
                    No meaningful property views were linked yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedVisitor.propertyHistory.map((property) => (
                      <div
                        key={property.propertyId}
                        className="rounded-xl border border-white/10 bg-black/25 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-white">
                              {property.propertyTitle}
                            </p>
                            {property.propertyLocation && (
                              <p className="mt-1 text-sm text-gray-500">
                                {property.propertyLocation}
                              </p>
                            )}
                          </div>
                          <span className="rounded-full bg-[#D4AF37]/12 px-3 py-1 text-xs text-[#F5D061]">
                            {property.visitCount} visits
                          </span>
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-300">
                          <Clock3 size={15} className="text-[#D4AF37]" />
                          {formatDuration(property.totalActiveTimeSeconds)}{" "}
                          active viewing
                        </div>

                        <div className="mt-4 space-y-2">
                          {property.visits.map((visit, index) => (
                            <div
                              key={`${property.propertyId}-${visit.visitedAt}-${index}`}
                              className="flex items-center justify-between rounded-lg bg-white/[0.035] px-3 py-2 text-sm"
                            >
                              <span className="text-gray-400">
                                {formatDateTime(visit.visitedAt)}
                              </span>
                              <span className="font-medium text-white">
                                {formatDuration(visit.activeDurationSeconds)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-[#D4AF37]">
                  Contact Activity
                </p>
                {selectedVisitor.contactActivities?.length ? (
                  <div className="space-y-3">
                    {[...selectedVisitor.contactActivities]
                      .sort(
                        (a, b) =>
                          new Date(b.submittedAt).getTime() -
                          new Date(a.submittedAt).getTime()
                      )
                      .map((activity, index) => (
                        <div
                          key={`${activity.source}-${activity.submittedAt}-${index}`}
                          className="rounded-xl border border-white/10 bg-white/[0.035] p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold text-white">
                                {activity.sourceLabel || activity.source}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                {formatDateTime(activity.submittedAt)}
                              </p>
                            </div>
                            {activity.details?.leadType && (
                              <span className="rounded-full border border-[#D4AF37]/20 px-3 py-1 text-xs text-[#F5D061]">
                                {activity.details.leadType}
                              </span>
                            )}
                          </div>
                          {activity.relatedPropertyTitle && (
                            <p className="mt-3 text-sm text-gray-400">
                              Property: {activity.relatedPropertyTitle}
                            </p>
                          )}
                          {activity.details?.preferredDate && (
                            <p className="mt-2 text-sm text-gray-400">
                              Preferred date: {activity.details.preferredDate}
                            </p>
                          )}
                          {activity.details?.city && (
                            <p className="mt-2 text-sm text-gray-400">
                              City: {activity.details.city}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-white/15 p-4 text-sm text-gray-500">
                    No contact activity recorded yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-red-400/25 bg-[#111] p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/12 text-red-300">
              <Trash2 size={22} />
            </div>
            <h3 className="text-xl font-semibold text-white">
              Delete {deleteTarget.name}?
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              Delete {deleteTarget.name} and all associated property viewing
              history? This permanently removes the MongoDB record.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="h-11 rounded-lg border border-white/10 px-4 text-sm font-semibold text-white transition hover:border-white/25 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={deleteVisitor}
                className="flex h-11 items-center justify-center gap-2 rounded-lg bg-red-500 px-4 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {deleting && <Loader2 size={16} className="animate-spin" />}
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
