import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft, Calendar, Mail, Pencil, Phone,
    Star, User, CheckCircle, TrendingUp, BookOpen,
} from "lucide-react";
import { getBarberById } from "./barbers.service";
import StatusBadge from "~/components/StatusBadge";

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ name }: { name: string }) {
    const initials = name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "B";
    return (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-2xl font-bold text-brand-500 dark:bg-brand-500/10 dark:text-brand-400">
            {initials}
        </div>
    );
}

// ── Info item ─────────────────────────────────────────────────────────────────
function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2.5">
            <span className="text-brand-500 dark:text-brand-400">{icon}</span>
            <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{value}</p>
            </div>
        </div>
    );
}

// ── Perf row ──────────────────────────────────────────────────────────────────
function PerfRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-sm text-gray-500 dark:text-gray-400">
                <span className="text-gray-400">{icon}</span>
                {label}
            </div>
            <span className="text-sm font-semibold text-gray-800 dark:text-white/90">{value}</span>
        </div>
    );
}

// ── Service card ──────────────────────────────────────────────────────────────
const ICON_COLORS = [
    { bg: "bg-purple-50 dark:bg-purple-500/10", text: "text-purple-500" },
    { bg: "bg-green-50 dark:bg-green-500/10", text: "text-green-500" },
    { bg: "bg-orange-50 dark:bg-orange-500/10", text: "text-orange-500" },
    { bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-500" },
    { bg: "bg-pink-50 dark:bg-pink-500/10", text: "text-pink-500" },
];

// ── Main ──────────────────────────────────────────────────────────────────────
export default function BarberDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [barber, setBarber] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                setLoading(true);
                const res = await getBarberById(id);
                setBarber(res);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-60 items-center justify-center">
                <p className="text-sm text-gray-400">Loading barber details...</p>
            </div>
        );
    }

    if (!barber) return null;

    // Mock bookings — wire to API later
    const recentBookings = [
        { name: "Emma Johnson", date: "20 May 2024, 02:30 PM", amount: 300, status: "completed" },
        { name: "Olivia Smith", date: "24 May 2024, 11:00 AM", amount: 800, status: "completed" },
        { name: "Ava Brown", date: "23 May 2024, 03:15 PM", amount: 300, status: "completed" },
        { name: "Sophia Davis", date: "23 May 2024, 10:45 AM", amount: 200, status: "completed" },
    ];

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/barbers")}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-theme-xs transition hover:bg-gray-50 dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-gray-400"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                            Barber Details
                        </h1>
                        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                            View barber/staff information
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => navigate(`/barbers/edit/${barber.id}`)}
                    className="inline-flex items-center gap-2 rounded-lg border border-brand-300 bg-white px-4 py-2.5 text-sm font-medium text-brand-600 shadow-theme-xs transition hover:bg-brand-50 dark:border-brand-500/30 dark:bg-white/[0.03] dark:text-brand-400 dark:hover:bg-brand-500/10"
                >
                    <Pencil size={15} />
                    Edit
                </button>
            </div>

            {/* Top row */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                {/* Profile card */}
                <div className="xl:col-span-2">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                            <Avatar name={barber.user?.name ?? ""} />
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                                        {barber.user?.name}
                                    </h2>
                                    <StatusBadge status={barber.status} />
                                </div>
                                <p className="mt-0.5 text-sm text-gray-400">Barber</p>
                                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    <InfoItem icon={<Mail size={15} />} label="Email" value={barber.user?.email ?? "—"} />
                                    <InfoItem icon={<Phone size={15} />} label="Contact" value={barber.user?.contact1 ?? "—"} />
                                    <InfoItem icon={<User size={15} />} label="Gender" value={<span className="capitalize">{barber.user?.gender ?? "—"}</span>} />
                                    <InfoItem
                                        icon={<Calendar size={15} />}
                                        label="Joined On"
                                        value={barber.created_at
                                            ? new Date(barber.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                                            : "—"}
                                    />
                                </div>
                            </div>
                        </div>

                        {barber.specialization && (
                            <div className="mt-6 border-t border-gray-100 pt-5 dark:border-white/[0.05]">
                                <p className="mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Specialization / Description
                                </p>
                                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                                    {barber.specialization}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Performance card */}
                {/* <div className="xl:col-span-1">
                    <div className="h-full rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <h3 className="mb-5 text-sm font-medium text-gray-700 dark:text-white/80">
                            Performance Overview
                        </h3>
                        <div className="space-y-4">
                            <PerfRow icon={<BookOpen size={15} />} label="Total Bookings" value="128" />
                            <PerfRow icon={<CheckCircle size={15} />} label="Completed Bookings" value="120" />
                            <PerfRow icon={<TrendingUp size={15} />} label="Total Revenue" value="₹38,450" />
                            <PerfRow
                                icon={<Star size={15} />}
                                label="Average Rating"
                                value={
                                    <span className="flex items-center gap-1">
                                        4.8
                                        <Star size={13} className="fill-yellow-400 text-yellow-400" />
                                    </span>
                                }
                            />
                        </div>
                    </div>
                </div> */}
            </div>

            {/* Bottom row */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                {/* Assigned services */}
                <div className="xl:col-span-2">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <h3 className="mb-5 text-sm font-medium text-gray-700 dark:text-white/80">
                            Assigned Services
                        </h3>
                        {(barber.barber_services ?? []).length === 0 ? (
                            <p className="text-sm text-gray-400">No services assigned.</p>
                        ) : (
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {barber.barber_services.map((item: any, idx: number) => {
                                    const color = ICON_COLORS[idx % ICON_COLORS.length];
                                    return (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-3 rounded-xl border border-gray-100 p-4 dark:border-white/[0.05]"
                                        >
                                            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${color.bg} ${color.text}`}>
                                                {item.service?.name?.charAt(0) ?? "S"}
                                            </span>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                    {item.service?.name}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {item.service?.category?.name ?? "—"}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent bookings */}
                {/* <div className="xl:col-span-1">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="mb-5 flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-white/80">
                                Recent Bookings
                            </h3>
                            <button className="text-xs font-medium text-brand-500 hover:text-brand-600">
                                View All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recentBookings.map((b, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 dark:bg-white/[0.05] dark:text-gray-300">
                                            {b.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                {b.name}
                                            </p>
                                            <p className="text-xs text-gray-400">{b.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                            ₹{b.amount}
                                        </p>
                                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600 dark:bg-green-500/10 dark:text-green-400">
                                            Completed
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
}