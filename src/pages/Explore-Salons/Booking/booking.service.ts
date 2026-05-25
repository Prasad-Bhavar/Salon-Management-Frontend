// src/pages/Explore-Salons/booking.api.ts
import api from "~/api/apiInstance";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface CreateBookingPayload {
    salon_id: number;
    date: string;   // "YYYY-MM-DD"
    start_time: string;   // "HH:MM"
    service_ids: number[]; // salon_service ids
    notes?: string;
}

export interface PaymentIntentResponse {
    booking_id: number;
    payment_id: number;
    client_secret: string;
    publishable_key: string;
    amount: number;
    currency: string;
    payment_intent_id: string;
}

export interface BookingDetail {
    id: number;
    status: string;
    total_price: number;
    total_duration: number;
    created_at: string;
    salon: {
        id: number;
        name: string;
    };
    booking_services: {
        id: number;
        price: number;
        duration: number;
        service: { id: number; name: string };
    }[];
    booking_slots: {
        id: number;
        slot_date: string;
        start_time: string;
        end_time: string;
    }[];
    payments: {
        id: number;
        amount: number;
        status: string;
        transaction_ref: string;
        paid_at: string;
    }[];
}

// ── API calls ──────────────────────────────────────────────────────────────────

export const bookingApi = {

    /** Create pending booking and get Stripe client_secret */
    create: async (payload: CreateBookingPayload): Promise<PaymentIntentResponse> => {
        const res = await api.post("/bookings/confirm", payload);
        console.log("Booking creation response:", res.data);
        return res.data;
    },

    /** Confirm payment after Stripe resolves */
    confirmPayment: async (bookingId: number, paymentIntentId: string) => {
        const res = await api.post("/bookings/confirm-payment", {
            booking_id: bookingId,
            payment_intent_id: paymentIntentId,
        });
        return res.data;
    },

    /** Get booking detail */
    getBooking: async (bookingId: number): Promise<BookingDetail> => {
        const res = await api.get(`/bookings/confirm/${bookingId}`);
        return res.data;
    },
};