// src/pages/MyBookings/useMyBooking.ts
import { useState, useEffect, useCallback } from "react";
import {
    myBookingService,
    MyBookingListItem,
    MyBookingDetail,
    BookingStatus,
} from "./myBooking.service";

// ── List hook ──────────────────────────────────────────────────────────────────

export function useMyBookings() {
    const [bookings, setBookings] = useState<MyBookingListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<BookingStatus | "">("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        page: 1, limit: 10, total: 0, total_pages: 1,
    });
    const [cancellingId, setCancellingId] = useState<number | null>(null);

    const fetch = useCallback(async (p = page, status = statusFilter) => {
        try {
            setLoading(true);
            const res = await myBookingService.list({ page: p, limit: 10, status: status || undefined });
            setBookings(res.items);
            setPagination(res.pagination);
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter]);

    useEffect(() => { fetch(); }, [page, statusFilter]);

    const handleStatusFilter = (s: BookingStatus | "") => {
        setStatusFilter(s);
        setPage(1);
    };

    const handleCancel = async (bookingId: number) => {
        try {
            setCancellingId(bookingId);
            await myBookingService.cancel(bookingId);
            // Optimistically update status in list
            setBookings(prev =>
                prev.map(b => b.id === bookingId ? { ...b, status: "cancelled" as BookingStatus } : b)
            );
        } catch (err) {
            console.error("Failed to cancel booking:", err);
        } finally {
            setCancellingId(null);
        }
    };

    return {
        bookings,
        loading,
        pagination,
        page,
        setPage,
        statusFilter,
        handleStatusFilter,
        cancellingId,
        handleCancel,
        refetch: fetch,
    };
}

// ── Detail hook ────────────────────────────────────────────────────────────────

export function useMyBookingDetail(bookingId: number) {
    const [booking, setBooking] = useState<MyBookingDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        if (!bookingId) return;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await myBookingService.detail(bookingId);
                setBooking(data);
            } catch (err: any) {
                setError(err?.response?.data?.message ?? "Failed to load booking");
            } finally {
                setLoading(false);
            }
        })();
    }, [bookingId]);

    const handleCancel = async () => {
        if (!booking) return;
        try {
            setCancelling(true);
            await myBookingService.cancel(booking.id);
            setBooking(prev => prev ? { ...prev, status: "cancelled" } : prev);
        } catch (err) {
            console.error("Failed to cancel:", err);
        } finally {
            setCancelling(false);
        }
    };

    return { booking, loading, error, cancelling, handleCancel };
}