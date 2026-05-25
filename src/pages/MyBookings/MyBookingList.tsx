// src/pages/MyBookings/MyBookingList.tsx
import { useNavigate } from "react-router-dom";
import {
    CalendarDays, Clock3, Scissors, ChevronRight,
    XCircle, Loader2, BookOpen, ChevronLeft,
} from "lucide-react";
import { useMyBookings } from "./useMyBooking";
import { BookingStatus, MyBookingListItem } from "./myBooking.service";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt12(t: string) {
    const [h, m] = t.split(":").map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function fmtDate(s: string) {
    return new Date(s + "T00:00:00").toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
    });
}

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<BookingStatus, { label: string; cls: string; dot: string }> = {
    pending: { label: "Pending", cls: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400", dot: "bg-amber-400" },
    confirmed: { label: "Confirmed", cls: "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400", dot: "bg-brand-400" },
    completed: { label: "Completed", cls: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400", dot: "bg-emerald-400" },
    cancelled: { label: "Cancelled", cls: "bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400", dot: "bg-red-400" },
};

function StatusBadge({ status }: { status: BookingStatus }) {
    const s = STATUS_STYLE[status] ?? STATUS_STYLE.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.cls}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {s.label}
        </span>
    );
}

// ── Skeleton card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
    return (
        <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/[0.06] dark:bg-white/[0.02]">
            <div className="flex gap-4">
                <div className="h-20 w-20 shrink-0 rounded-xl bg-gray-100 dark:bg-white/[0.06]" />
                <div className="flex-1 space-y-2.5">
                    <div className="h-4 w-2/3 rounded-lg bg-gray-100 dark:bg-white/[0.06]" />
                    <div className="h-3 w-1/2 rounded-lg bg-gray-100 dark:bg-white/[0.06]" />
                    <div className="h-3 w-3/4 rounded-lg bg-gray-100 dark:bg-white/[0.06]" />
                </div>
            </div>
        </div>
    );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ hasFilter }: { hasFilter: boolean }) {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-white/[0.05]">
                <BookOpen size={28} className="text-gray-400" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-gray-800 dark:text-white/90">
                {hasFilter ? "No bookings match this filter" : "No bookings yet"}
            </h3>
            <p className="mt-1 max-w-xs text-sm text-gray-400">
                {hasFilter ? "Try a different status filter." : "Book your first salon appointment to get started."}
            </p>
            {!hasFilter && (
                <button
                    onClick={() => navigate("/explore-salons")}
                    className="mt-5 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
                >
                    Explore Salons
                </button>
            )}
        </div>
    );
}

// ── Booking card ──────────────────────────────────────────────────────────────

function BookingCard({
    booking,
    onCancel,
    cancelling,
}: {
    booking: MyBookingListItem;
    onCancel: (id: number) => void;
    cancelling: boolean;
}) {
    const navigate = useNavigate();
    const slot = booking.booking_slots?.[0];
    const coverImage = booking.salon.images?.[0]?.image_url;
    const canCancel = booking.status === "pending" || booking.status === "confirmed";
    const serviceNames = booking.booking_services.map(s => s.service.name).join(", ");

    return (
        <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:shadow-md dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:border-white/[0.1]">

            <div className="flex gap-4 p-5">

                {/* Salon image */}
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-white/[0.04]">
                    {coverImage ? (
                        <img src={coverImage} alt={booking.salon.name} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full items-center justify-center text-2xl text-gray-200">✂</div>
                    )}
                </div>

                {/* Details */}
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <p className="truncate font-semibold text-gray-900 dark:text-white">
                                {booking.salon.name}
                            </p>
                            <p className="text-xs text-gray-400">
                                {booking.salon.address.area ? `${booking.salon.address.area}, ` : ""}
                                {booking.salon.address.city}
                            </p>
                        </div>
                        <StatusBadge status={booking.status} />
                    </div>

                    {/* Date + time */}
                    {slot && (
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                                <CalendarDays size={11} className="text-brand-400" />
                                {fmtDate(slot.slot_date)}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock3 size={11} className="text-brand-400" />
                                {fmt12(slot.start_time)}
                            </span>
                        </div>
                    )}

                    {/* Services */}
                    <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Scissors size={11} className="shrink-0 text-brand-400" />
                        <span className="truncate">{serviceNames || "—"}</span>
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 dark:border-white/[0.05]">
                <div>
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                        ₹{Number(booking.total_price).toLocaleString("en-IN")}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {canCancel && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onCancel(booking.id); }}
                            disabled={cancelling}
                            className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
                        >
                            {cancelling
                                ? <Loader2 size={11} className="animate-spin" />
                                : <XCircle size={11} />
                            }
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={() => navigate(`/my-bookings/${booking.id}`)}
                        className="flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-600"
                    >
                        View Details
                        <ChevronRight size={11} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Filter tabs ───────────────────────────────────────────────────────────────

const FILTER_OPTIONS: { label: string; value: BookingStatus | "" }[] = [
    { label: "All", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
];

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────

export default function MyBookingList() {
    const {
        bookings, loading, pagination, page, setPage,
        statusFilter, handleStatusFilter,
        cancellingId, handleCancel,
    } = useMyBookings();

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">My Bookings</h1>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                    Track and manage all your salon appointments.
                </p>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {FILTER_OPTIONS.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => handleStatusFilter(opt.value)}
                        className={[
                            "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                            statusFilter === opt.value
                                ? "bg-brand-500 text-white shadow-sm"
                                : "border border-gray-200 bg-white text-gray-600 hover:border-brand-300 hover:text-brand-500 dark:border-white/[0.08] dark:bg-white/[0.02] dark:text-gray-400",
                        ].join(" ")}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* List */}
            {loading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : bookings.length === 0 ? (
                <EmptyState hasFilter={!!statusFilter} />
            ) : (
                <div className="space-y-4">
                    {bookings.map(b => (
                        <BookingCard
                            key={b.id}
                            booking={b}
                            onCancel={handleCancel}
                            cancelling={cancellingId === b.id}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && pagination.total_pages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-white/[0.05]">
                    <p className="text-xs text-gray-400">
                        Page {pagination.page} of {pagination.total_pages} · {pagination.total} bookings
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[0.08] dark:hover:bg-white/[0.05]"
                        >
                            <ChevronLeft size={14} />
                        </button>
                        <button
                            disabled={page >= pagination.total_pages}
                            onClick={() => setPage(p => p + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[0.08] dark:hover:bg-white/[0.05]"
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}