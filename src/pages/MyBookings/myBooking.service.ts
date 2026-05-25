// src/pages/MyBookings/myBooking.service.ts
import api from "~/api/apiInstance";

// ── Types ──────────────────────────────────────────────────────────────────────

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface MyBookingListItem {
    id: number;
    status: BookingStatus;
    total_price: number;
    total_duration: number;
    created_at: string;
    salon: {
        id: number;
        name: string;
        salon_type: string;
        contact_number?: string;
        address: {
            area?: string;
            city: string;
            state: string;
        };
        images: { id: number; image_url: string }[];
    };
    booking_slots: {
        id: number;
        slot_date: string;   // "YYYY-MM-DD"
        start_time: string;  // "HH:MM:SS"
        end_time: string;
    }[];
    booking_services: {
        id: number;
        price: number;
        duration: number;
        service: { id: number; name: string };
    }[];
    payments: {
        id: number;
        amount: number;
        status: string;
        payment_method?: string;
        transaction_ref?: string;
        paid_at?: string;
    }[];
}

export interface MyBookingDetail extends MyBookingListItem {
    // same shape, detail endpoint returns everything
}

export interface BookingsResponse {
    items: MyBookingListItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}

// ── API ────────────────────────────────────────────────────────────────────────

export const myBookingService = {

    /** GET /bookings/customer  — list all bookings for logged-in customer */
    list: async (params?: {
        page?: number;
        limit?: number;
        status?: BookingStatus | "";
    }): Promise<BookingsResponse> => {
        const res = await api.get("/bookings/customer", { params });
        console.log("Fetched bookings:", res.data);
        return res.data;
    },

    /** GET /bookings/:id  — single booking detail */
    detail: async (bookingId: number): Promise<MyBookingDetail> => {
        const res = await api.get(`/bookings/${bookingId}`);
        return res.data;
    },

    /** POST /bookings/:id/cancel  — cancel a pending/confirmed booking */
    cancel: async (bookingId: number): Promise<void> => {
        await api.post(`/bookings/${bookingId}/cancel`);
    },
};