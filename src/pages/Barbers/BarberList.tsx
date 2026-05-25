import { useNavigate } from "react-router-dom";
import { Eye, MoreVertical, Plus, Users, UserCheck } from "lucide-react";
import { useBarbers } from "./useBarbers";
import DataTable, { ColumnDef, FilterDef } from "~/components/DataTable";
import StatusBadge from "~/components/StatusBadge";

// ── Avatar initials ───────────────────────────────────────────
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

// ── Service chips ─────────────────────────────────────────────
const SERVICE_COLORS = [
    "bg-purple-100 text-purple-700", "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700", "bg-orange-100 text-orange-700",
    "bg-pink-100 text-pink-700",
];

function ServiceChip({ name, index }: { name: string; index: number }) {
    return (
        <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold ${SERVICE_COLORS[index % SERVICE_COLORS.length]}`}>
            {name.slice(0, 2).toUpperCase()}
        </span>
    );
}

// ── Stat card ─────────────────────────────────────────────────
function StatCard({ label, sub, value, badge, icon, iconBg }: {
    label: string; sub: string; value: React.ReactNode;
    badge?: string; icon: React.ReactNode; iconBg: string;
}) {
    return (
        <div className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>{icon}</span>
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

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────
export default function BarberList() {
    const navigate = useNavigate();
    const { barbers, stats, loading } = useBarbers();

    const activePercent = stats?.total_staff
        ? Math.round((stats.active_staff / stats.total_staff) * 100)
        : 0;

    // ── Column definitions ────────────────────────────────────
    const columns: ColumnDef[] = [
        {
            key: "user.name",
            label: "Barber",
            sortable: true,
            render: (barber) => (
                <div className="flex items-center gap-3">
                    <Avatar name={barber.user?.name} />
                    <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">{barber.user?.name}</p>
                        <p className="text-xs text-gray-400">{barber.user?.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "user.contact1",
            label: "Contact",
            render: (barber) => barber.user?.contact1 ?? "—",
        },
        {
            key: "specialization",
            label: "Specialization",
            sortable: true,
        },
        {
            key: "barber_services",
            label: "Services",
            render: (barber) => {
                const services = barber.barber_services ?? [];
                const visible = services.slice(0, 3);
                const overflow = services.length - 3;
                return (
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
                );
            },
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            render: (barber) => <StatusBadge status={barber.status} />,
        },
        {
            key: "created_at",
            label: "Joined On",
            sortable: true,
            render: (barber) =>
                barber.created_at
                    ? new Date(barber.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                    : "—",
        },
        {
            key: "_actions",
            label: "Actions",
            align: "right",
            render: (barber) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/barbers/view/${barber.id}`); }}
                        title="View"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-brand-500 dark:border-white/[0.05] dark:hover:bg-white/[0.05]"
                    >
                        <Eye size={15} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/barbers/edit/${barber.id}`); }}
                        title="Edit"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 dark:border-white/[0.05] dark:hover:bg-white/[0.05]"
                    >
                        <MoreVertical size={15} />
                    </button>
                </div>
            ),
        },
    ];

    // ── Filter definitions ────────────────────────────────────
    const filters: FilterDef[] = [
        {
            key: "user.name",
            type: "search",
            placeholder: "Search by name, email or contact…",
        },
        {
            key: "status",
            type: "select",
            placeholder: "All Status",
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
                { label: "On Leave", value: "on_leave" },
            ],
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">Barbers / Staff</h1>
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Total staff members and their performance overview.</p>
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
                <StatCard label="Total Staff" sub="All barbers & staff members" value={stats?.total_staff ?? 0}
                    icon={<Users size={22} className="text-purple-500" />} iconBg="bg-purple-50 dark:bg-purple-500/10" />
                <StatCard label="Active Staff" sub="Active and working" value={stats?.active_staff ?? 0}
                    badge={`${activePercent}%`}
                    icon={<UserCheck size={22} className="text-green-500" />} iconBg="bg-green-50 dark:bg-green-500/10" />
            </div>

            {/* DataTable */}
            <DataTable
                mode="client"
                data={barbers}
                loading={loading}
                columns={columns}
                filters={filters}
                rowKey={(b) => b.id}
                showRowNumbers
                emptyText="No barbers found."
                loadingText="Loading barbers…"
            />
        </div>
    );
}