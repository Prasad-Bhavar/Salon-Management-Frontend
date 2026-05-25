// src/pages/MyBookings/MyBookingDetails.tsx
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft, CalendarDays, Clock3, Scissors,
    MapPin, Phone, CreditCard, CheckCircle2,
    XCircle, AlertCircle, Loader2, BadgeCheck,
    ReceiptText, Building2,
} from "lucide-react";
import { useMyBookingDetail } from "./useMyBooking";
import { BookingStatus } from "./myBooking.service";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt12(t: string) {
    const [h, m] = t.split(":").map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function fmtDate(s: string) {
    return new Date(s + "T00:00:00").toLocaleDateString("en-IN", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
}

function fmtDateTime(s: string) {
    return new Date(s).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<BookingStatus, {
    label: string; icon: React.ReactNode;
    cls: string; bg: string; border: string;
}> = {
    pending: {
        label: "Pending Payment",
        icon: <AlertCircle size={20} />,
        cls: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-500/10",
        border: "border-amber-200 dark:border-amber-500/20",
    },
    confirmed: {
        label: "Confirmed",
        icon: <BadgeCheck size={20} />,
        cls: "text-brand-600 dark:text-brand-400",
        bg: "bg-brand-50 dark:bg-brand-500/10",
        border: "border-brand-200 dark:border-brand-500/20",
    },
    completed: {
        label: "Completed",
        icon: <CheckCircle2 size={20} />,
        cls: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-500/10",
        border: "border-emerald-200 dark:border-emerald-500/20",
    },
    cancelled: {
        label: "Cancelled",
        icon: <XCircle size={20} />,
        cls: "text-red-500 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-500/10",
        border: "border-red-200 dark:border-red-500/20",
    },
};

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({ title, icon, children }: {
    title: string; icon: React.ReactNode; children: React.ReactNode;
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.06] dark:bg-white/[0.02]">
            <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-3.5 dark:border-white/[0.05]">
                <span className="text-brand-500">{icon}</span>
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</h2>
            </div>
            <div className="px-5 py-4">{children}</div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────

export default function MyBookingDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const bookingId = Number(id);

    const { booking, loading, error, cancelling, handleCancel } = useMyBookingDetail(bookingId);

    // ── Loading ───────────────────────────────────────────────
    if (loading) return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        </div>
    );

    if (error || !booking) return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
            <XCircle size={40} className="text-red-400" />
            <p className="text-sm text-gray-500">{error ?? "Booking not found"}</p>
            <button onClick={() => navigate(-1)} className="rounded-xl bg-brand-500 px-4 py-2 text-sm text-white">
                Go Back
            </button>
        </div>
    );

    const status = booking.status as BookingStatus;
    const statusConfig = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
    const slot = booking.booking_slots?.[0];
    const payment = booking.payments?.[0];
    const totalPrice = booking.booking_services.reduce((s, i) => s + Number(i.price), 0);
    const canCancel = status === "pending" || status === "confirmed";
    const coverImage = booking.salon.images?.[0]?.image_url;

    return (
        <div className="space-y-6">

            {/* Back header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50 dark:border-white/[0.08] dark:hover:bg-white/[0.05]"
                >
                    <ArrowLeft size={16} />
                </button>
                <div>
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                        Booking #{booking.id}
                    </h1>
                    <p className="text-xs text-gray-400">
                        Booked on {fmtDateTime(booking.created_at)}
                    </p>
                </div>
            </div>

            {/* Status banner */}
            <div className={`flex items-center gap-3 rounded-2xl border px-5 py-4 ${statusConfig.bg} ${statusConfig.border}`}>
                <span className={statusConfig.cls}>{statusConfig.icon}</span>
                <div>
                    <p className={`font-semibold ${statusConfig.cls}`}>{statusConfig.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {status === "pending" && "Complete payment to confirm your booking."}
                        {status === "confirmed" && "Your appointment is confirmed. See you there!"}
                        {status === "completed" && "Thanks for visiting. Hope you enjoyed the experience!"}
                        {status === "cancelled" && "This booking has been cancelled."}
                    </p>
                </div>
                {canCancel && (
                    <button
                        onClick={handleCancel}
                        disabled={cancelling}
                        className="ml-auto flex shrink-0 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-500/20 dark:bg-transparent"
                    >
                        {cancelling ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                        Cancel Booking
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">

                {/* LEFT */}
                <div className="space-y-5">

                    {/* Salon info */}
                    <Section title="Salon" icon={<Building2 size={16} />}>
                        <div className="flex items-start gap-4">
                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-white/[0.04]">
                                {coverImage
                                    ? <img src={coverImage} alt={booking.salon.name} className="h-full w-full object-cover" />
                                    : <div className="flex h-full items-center justify-center text-2xl text-gray-300">✂</div>
                                }
                            </div>
                            <div className="space-y-1">
                                <p className="font-semibold text-gray-900 dark:text-white">{booking.salon.name}</p>
                                <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 capitalize">
                                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                                    {booking.salon.salon_type} Salon
                                </p>
                                {booking.salon.address && (
                                    <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                        <MapPin size={11} className="text-brand-400" />
                                        {booking.salon.address.area ? `${booking.salon.address.area}, ` : ""}
                                        {booking.salon.address.city}, {booking.salon.address.state}
                                    </p>
                                )}
                                {booking.salon.contact_number && (
                                    <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                        <Phone size={11} className="text-brand-400" />
                                        +91 {booking.salon.contact_number}
                                    </p>
                                )}
                            </div>
                        </div>
                    </Section>

                    {/* Appointment */}
                    <Section title="Appointment" icon={<CalendarDays size={16} />}>
                        {slot ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-white/[0.05] dark:bg-white/[0.02]">
                                    <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                                        <CalendarDays size={11} className="text-brand-500" /> Date
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {new Date(slot.slot_date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(slot.slot_date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long" })}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-white/[0.05] dark:bg-white/[0.02]">
                                    <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                                        <Clock3 size={11} className="text-brand-500" /> Time
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {fmt12(slot.start_time)}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {booking.total_duration} mins total
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400">No slot information available.</p>
                        )}
                    </Section>

                    {/* Services */}
                    <Section title="Services" icon={<Scissors size={16} />}>
                        <div className="space-y-3">
                            {booking.booking_services.map(svc => (
                                <div key={svc.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">{svc.service.name}</p>
                                        <p className="text-xs text-gray-400">{svc.duration} mins</p>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-800 dark:text-white/90">
                                        ₹{Number(svc.price).toLocaleString("en-IN")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>

                {/* RIGHT */}
                <div className="space-y-5">

                    {/* Payment summary */}
                    <Section title="Payment" icon={<CreditCard size={16} />}>
                        <div className="space-y-3">
                            {booking.booking_services.map(svc => (
                                <div key={svc.id} className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                                    <span className="truncate">{svc.service.name}</span>
                                    <span className="ml-3 shrink-0 font-medium">₹{Number(svc.price).toLocaleString("en-IN")}</span>
                                </div>
                            ))}
                            <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-white/[0.05]">
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total</span>
                                <span className="text-base font-bold text-brand-600 dark:text-brand-400">
                                    ₹{totalPrice.toLocaleString("en-IN")}
                                </span>
                            </div>
                        </div>
                    </Section>

                    {/* Transaction info */}
                    {payment && (
                        <Section title="Transaction" icon={<ReceiptText size={16} />}>
                            <div className="space-y-3 text-sm">
                                <Row label="Status">
                                    <span className={[
                                        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                                        payment.status === "paid" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" :
                                            payment.status === "failed" ? "bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400" :
                                                "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
                                    ].join(" ")}>
                                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                    </span>
                                </Row>
                                {payment.payment_method && (
                                    <Row label="Method">
                                        <span className="capitalize">{payment.payment_method}</span>
                                    </Row>
                                )}
                                {payment.transaction_ref && (
                                    <Row label="Ref ID">
                                        <span className="max-w-[160px] truncate font-mono text-xs text-gray-500" title={payment.transaction_ref}>
                                            {payment.transaction_ref}
                                        </span>
                                    </Row>
                                )}
                                {payment.paid_at && (
                                    <Row label="Paid At">
                                        {fmtDateTime(payment.paid_at)}
                                    </Row>
                                )}
                                <Row label="Amount">
                                    <span className="font-semibold text-gray-800 dark:text-white/90">
                                        ₹{Number(payment.amount).toLocaleString("en-IN")}
                                    </span>
                                </Row>
                            </div>
                        </Section>
                    )}

                    {/* Actions */}
                    <div className="space-y-2">
                        <button
                            onClick={() => navigate(`/explore-salons/${booking.salon.id}`)}
                            className="w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-white/[0.08] dark:text-gray-300 dark:hover:bg-white/[0.05]"
                        >
                            Visit Salon Page
                        </button>
                        <button
                            onClick={() => navigate("/explore-salons")}
                            className="w-full rounded-xl bg-brand-500 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
                        >
                            Book Another Service
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Small helper for transaction rows
function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{label}</span>
            <span className="text-xs text-gray-700 dark:text-gray-300">
                {children}
            </span>
        </div>
    );
}