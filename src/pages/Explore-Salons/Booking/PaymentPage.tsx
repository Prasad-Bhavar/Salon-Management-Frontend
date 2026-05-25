// src/pages/Explore-Salons/PaymentPage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import {
    ArrowLeft, CalendarDays, Clock3, Scissors,
    CheckCircle2, XCircle, Loader2,
} from "lucide-react";
import StripePaymentForm from "./StripePaymentForm";
import { bookingApi, PaymentIntentResponse } from "./booking.service";

// ── Stripe promise (lazy-loaded with publishable key from backend) ─────────────

let stripePromise: ReturnType<typeof loadStripe> | null = null;

function getStripe(publishableKey: string) {
    if (!stripePromise) {
        stripePromise = loadStripe(publishableKey);
    }
    return stripePromise;
}

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

// ── Success screen ────────────────────────────────────────────────────────────

function SuccessScreen({ bookingId }: { bookingId: number }) {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/10">
                <CheckCircle2 size={40} className="text-emerald-500" />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-gray-900 dark:text-white">
                Booking Confirmed! 🎉
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Your appointment has been successfully booked.<br />
                Booking ID: <strong className="text-gray-700 dark:text-gray-200">#{bookingId}</strong>
            </p>
            <div className="mt-8 flex gap-3">
                <button
                    onClick={() => navigate("/bookings")}
                    className="rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
                >
                    View My Bookings
                </button>
                <button
                    onClick={() => navigate("/explore-salons")}
                    className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-white/[0.08] dark:text-gray-400 dark:hover:bg-white/[0.05]"
                >
                    Explore More Salons
                </button>
            </div>
        </div>
    );
}

// ── Failed screen ─────────────────────────────────────────────────────────────

function FailedScreen({ onRetry }: { onRetry: () => void }) {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
                <XCircle size={40} className="text-red-500" />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-gray-900 dark:text-white">
                Payment Failed
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                We couldn't process your payment. Your booking has been cancelled.
            </p>
            <div className="mt-8 flex gap-3">
                <button
                    onClick={onRetry}
                    className="rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
                >
                    Try Again
                </button>
                <button
                    onClick={() => navigate("/explore-salons")}
                    className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-white/[0.08] dark:text-gray-400"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

// ── Order summary sidebar ─────────────────────────────────────────────────────

interface OrderSummaryProps {
    data: PaymentIntentResponse;
    draft: any; // the BookingDraft from BookingDrawer
}

function OrderSummary({ data, draft }: OrderSummaryProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-[15px] font-semibold text-gray-800 dark:text-white/90">
                Order Summary
            </h3>

            {/* Date + time */}
            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-200 bg-white p-3.5 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                        <CalendarDays size={11} className="text-brand-500" />
                        Date
                    </div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                        {new Date(draft.date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                    <p className="text-xs text-gray-400">
                        {new Date(draft.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long" })}
                    </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-3.5 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                        <Clock3 size={11} className="text-brand-500" />
                        Time
                    </div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                        {fmt12(draft.time)}
                    </p>
                    <p className="text-xs text-gray-400">
                        {draft.items.reduce((s: number, i: any) => s + i.duration, 0)} mins
                    </p>
                </div>
            </div>

            {/* Services */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                    <Scissors size={11} className="text-brand-500" />
                    Services
                </div>
                <div className="space-y-2.5">
                    {draft.items.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-700 dark:text-white/80">{item.name}</p>
                                <p className="text-xs text-gray-400">{item.duration} mins</p>
                            </div>
                            <span className="text-sm font-semibold text-gray-800 dark:text-white/90">
                                ₹{item.price}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-white/[0.05]">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total</span>
                    <span className="text-base font-bold text-brand-600 dark:text-brand-400">
                        ₹{data.amount.toLocaleString("en-IN")}
                    </span>
                </div>
            </div>

            {/* Booking ID */}
            <p className="text-center text-xs text-gray-400">
                Booking ID: <span className="font-semibold text-gray-600 dark:text-gray-300">#{data.booking_id}</span>
            </p>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────

export default function PaymentPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // Data passed via navigate state from BookingDrawer
    const paymentData: PaymentIntentResponse = location.state?.paymentData;
    const bookingDraft = location.state?.draft;
    const salonName: string = location.state?.salonName ?? "Salon";

    const [status, setStatus] = useState<"idle" | "confirming" | "success" | "failed">("idle");
    const [confirmedBookingId, setConfirmedBookingId] = useState<number | null>(null);

    // Guard: if no payment data, redirect
    useEffect(() => {
        if (!paymentData?.client_secret) {
            navigate("/explore-salons", { replace: true });
        }
    }, [paymentData]);

    if (!paymentData?.client_secret) return null;

    const stripe = getStripe(paymentData.publishable_key);

    const handlePaymentSuccess = async (paymentIntentId: string) => {
        setStatus("confirming");
        try {
            await bookingApi.confirmPayment(paymentData.booking_id, paymentIntentId);
            setConfirmedBookingId(paymentData.booking_id);
            setStatus("success");
        } catch {
            setStatus("failed");
        }
    };

    const handlePaymentError = () => {
        setStatus("failed");
    };

    const handleRetry = () => {
        // Go back to the salon detail page so user can restart
        navigate(-2);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

            {/* Top nav */}
            <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-gray-200 bg-white/95 px-4 py-3.5 backdrop-blur-sm dark:border-white/[0.06] dark:bg-gray-950/95">
                <button
                    onClick={() => navigate(-1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-white/[0.08] dark:text-gray-400 dark:hover:bg-white/[0.05]"
                >
                    <ArrowLeft size={15} />
                </button>
                <div>
                    <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {status === "success" ? "Booking Confirmed" : "Complete Payment"}
                    </h1>
                    <p className="text-xs text-gray-400">{salonName}</p>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 py-8">

                {/* Success / Failed states */}
                {status === "success" && confirmedBookingId && (
                    <SuccessScreen bookingId={confirmedBookingId} />
                )}

                {status === "failed" && (
                    <FailedScreen onRetry={handleRetry} />
                )}

                {/* Confirming overlay */}
                {status === "confirming" && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 size={36} className="animate-spin text-brand-500" />
                        <p className="mt-4 text-sm text-gray-500">Confirming your booking...</p>
                    </div>
                )}

                {/* Payment form */}
                {status === "idle" && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">

                        {/* Left: Stripe form */}
                        <div className="space-y-5">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Payment Details
                                </h2>
                                <p className="mt-0.5 text-sm text-gray-500">
                                    Your payment is secured by Stripe
                                </p>
                            </div>

                            <Elements
                                stripe={stripe}
                                options={{
                                    clientSecret: paymentData.client_secret,
                                    appearance: {
                                        theme: "stripe",
                                        variables: {
                                            colorPrimary: "#6366f1",
                                            colorBackground: "#ffffff",
                                            colorText: "#1f2937",
                                            borderRadius: "12px",
                                            fontFamily: "Inter, system-ui, sans-serif",
                                        },
                                    },
                                }}
                            >
                                <StripePaymentForm
                                    bookingId={paymentData.booking_id}
                                    amount={paymentData.amount}
                                    onSuccess={handlePaymentSuccess}
                                    onError={handlePaymentError}
                                />
                            </Elements>
                        </div>

                        {/* Right: Order summary */}
                        <div className="lg:sticky lg:top-20 lg:self-start">
                            <OrderSummary data={paymentData} draft={bookingDraft} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}