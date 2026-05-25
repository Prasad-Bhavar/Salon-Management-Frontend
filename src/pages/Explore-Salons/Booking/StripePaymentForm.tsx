// src/pages/Explore-Salons/StripePaymentForm.tsx
import { useState } from "react";
import {
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { ShieldCheck, Lock, AlertCircle, Loader2 } from "lucide-react";

interface StripePaymentFormProps {
    bookingId: number;
    amount: number;
    onSuccess: (paymentIntentId: string) => void;
    onError: (msg: string) => void;
}

export default function StripePaymentForm({
    bookingId,
    amount,
    onSuccess,
    onError,
}: StripePaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();

    const [processing, setProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);
        setErrorMsg(null);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
        });

        if (error) {
            const msg = error.message ?? "Payment failed. Please try again.";
            setErrorMsg(msg);
            onError(msg);
            setProcessing(false);
            return;
        }

        if (paymentIntent?.status === "succeeded") {
            onSuccess(paymentIntent.id);
        } else {
            const msg = "Payment could not be processed. Please try again.";
            setErrorMsg(msg);
            onError(msg);
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">

            {/* Card element */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.08] dark:bg-gray-900">
                <PaymentElement
                    options={{
                        layout: "tabs",
                        defaultValues: {
                            billingDetails: { address: { country: "IN" } },
                        },
                    }}
                />
            </div>

            {/* Error */}
            {errorMsg && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-500/20 dark:bg-red-500/10">
                    <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
                    <p className="text-sm text-red-600 dark:text-red-400">{errorMsg}</p>
                </div>
            )}

            {/* Amount summary */}
            <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-white/[0.05] dark:bg-white/[0.02]">
                <span className="text-sm text-gray-500 dark:text-gray-400">Total to pay</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                    ₹{amount.toLocaleString("en-IN")}
                </span>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={!stripe || processing}
                className={[
                    "flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all duration-200",
                    stripe && !processing
                        ? "bg-brand-500 text-white hover:bg-brand-600 active:scale-[0.98] shadow-lg shadow-brand-500/20"
                        : "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-white/[0.06] dark:text-white/30",
                ].join(" ")}
            >
                {processing ? (
                    <>
                        <Loader2 size={16} className="animate-spin" />
                        Processing Payment...
                    </>
                ) : (
                    <>
                        <Lock size={14} />
                        Pay ₹{amount.toLocaleString("en-IN")} Securely
                    </>
                )}
            </button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                    <ShieldCheck size={12} className="text-emerald-500" />
                    SSL Secured
                </span>
                <span className="flex items-center gap-1">
                    <Lock size={12} className="text-brand-400" />
                    Powered by Stripe
                </span>
            </div>
        </form>
    );
}