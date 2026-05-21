import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Eye, MoreVertical, Plus, Search, SlidersHorizontal, Users, UserCheck,
} from "lucide-react";
import { useBarbers } from "./useBarbers";
import StatusBadge from "~/components/StatusBadge";

// ── Avatar initials ───────────────────────────────────────────────────────────
function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
    const initials = name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "B";
    const colors = ["bg-purple-100 text-purple-600", "bg-blue-100 text-blue-600", "bg-green-100 text-green-600", "bg-orange-100 text-orange-600", "bg-pink-100 text-pink-600"];
    const color = colors[name?.charCodeAt(0) % colors.length] ?? colors[0];
    return (
        <div className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm"} ${color}`}>
            {initials}
        </div>
    );
}

// ── Service badge ─────────────────────────────────────────────────────────────
const SERVICE_COLORS = [
    "bg-purple-100 text-purple-700",
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-orange-100 text-orange-700",
    "bg-pink-100 text-pink-700",
];

function ServiceChip({ name, index }: { name: string; index: number }) {
    const color = SERVICE_COLORS[index % SERVICE_COLORS.length];
    return (
        <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold ${color}`}>
            {name.slice(0, 2).toUpperCase()}
        </span>
    );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
    label, sub, value, badge, icon, iconBg,
}: {
    label: string; sub: string; value: React.ReactNode;
    badge?: string; icon: React.ReactNode; iconBg: string;
}) {
    return (
        <div className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
                {icon}
            </span>
            <div className="flex-1">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                        <p className="mt-1 text-3xl font-bold text-gray-800 dark:text-white/90">{value}</p>
                        <p className="mt-0.5 text-xs text-gray-400">{sub}</p>
                    </div>
                    {badge && (
                        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-600 dark:bg-green-500/10 dark:text-green-400">
                            {badge}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function BarberList() {
    const navigate = useNavigate();
    const { barbers, stats, loading } = useBarbers();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filtered = barbers.filter((b) => {
        const matchSearch =
            b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
            b.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
            b.user?.contact1?.includes(search);
        const matchStatus = statusFilter === "all" || b.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const activePercent = stats?.total_staff
        ? Math.round((stats.active_staff / stats.total_staff) * 100)
        : 0;

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                        Barbers / Staff
                    </h1>
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                        Total staff members and their performance overview.
                    </p>
                </div>
                <button
                    onClick={() => navigate("/barbers/create")}
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
                >
                    <Plus size={16} />
                    Add Barber
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StatCard
                    label="Total Staff"
                    sub="All barbers & staff members"
                    value={stats?.total_staff ?? 0}
                    icon={<Users size={22} className="text-purple-500" />}
                    iconBg="bg-purple-50 dark:bg-purple-500/10"
                />
                <StatCard
                    label="Active Staff"
                    sub="Active and working"
                    value={stats?.active_staff ?? 0}
                    badge={`${activePercent}%`}
                    icon={<UserCheck size={22} className="text-green-500" />}
                    iconBg="bg-green-50 dark:bg-green-500/10"
                />
            </div>

            {/* Table card */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">

                {/* Filters */}
                <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 dark:border-white/[0.05] sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-sm">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, email or contact..."
                            className="h-10 w-full rounded-lg border border-gray-300 bg-transparent pl-9 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 shadow-theme-xs focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="on_leave">On Leave</option>
                        </select>
                        <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                            <SlidersHorizontal size={15} />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-white/[0.05]">
                                {["#", "Barber", "Contact", "Specialization", "Services", "Status", "Joined On", "Actions"].map((col) => (
                                    <th key={col} className={`px-5 py-3.5 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500 ${col === "Actions" ? "text-right" : "text-left"}`}>
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-5 py-12 text-center text-sm text-gray-400">
                                        Loading barbers...
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-5 py-12 text-center text-sm text-gray-400">
                                        No barbers found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((barber, idx) => {
                                    const services = barber.barber_services ?? [];
                                    const visible = services.slice(0, 3);
                                    const overflow = services.length - 3;
                                    return (
                                        <tr key={barber.id} className="border-b border-gray-100 last:border-0 dark:border-white/[0.05]">

                                            {/* # */}
                                            <td className="px-5 py-4 text-sm text-gray-400">{idx + 1}</td>

                                            {/* Barber */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar name={barber.user?.name} />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                            {barber.user?.name}
                                                        </p>
                                                        <p className="text-xs text-gray-400">{barber.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact */}
                                            <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                                                {barber.user?.contact1}
                                            </td>

                                            {/* Specialization */}
                                            <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                                                {barber.specialization ?? "—"}
                                            </td>

                                            {/* Services chips */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-1">
                                                    {visible.map((s: any, i: number) => (
                                                        <ServiceChip key={s.id} name={s.service?.name ?? ""} index={i} />
                                                    ))}
                                                    {overflow > 0 && (
                                                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-white/[0.05] dark:text-gray-400">
                                                            +{overflow}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-5 py-4">
                                                <StatusBadge status={barber.status} />
                                            </td>

                                            {/* Joined */}
                                            <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                {barber.created_at
                                                    ? new Date(barber.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                                                    : "—"}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => navigate(`/barbers/view/${barber.id}`)}
                                                        title="View"
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-brand-500 dark:border-white/[0.05] dark:hover:bg-white/[0.05]"
                                                    >
                                                        <Eye size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/barbers/edit/${barber.id}`)}
                                                        title="More"
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 dark:border-white/[0.05] dark:hover:bg-white/[0.05]"
                                                    >
                                                        <MoreVertical size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer pagination */}
                {filtered.length > 0 && (
                    <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3.5 dark:border-white/[0.05]">
                        <p className="text-xs text-gray-400">
                            Showing 1 to {filtered.length} of {filtered.length} entries
                        </p>
                        <div className="flex items-center gap-1">
                            {[1].map((p) => (
                                <button key={p} className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-xs font-medium text-white">
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}