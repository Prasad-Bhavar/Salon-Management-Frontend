import { useState, useEffect } from "react";
import { salonDetailApi } from "./explore-salons.service";
import {
    SalonDetail,
    AvailableDatesResponse,
    ServiceCategory,
} from "./salon-detail.types";

export function useSalonDetail(salonId: number) {
    const [salon, setSalon] = useState<SalonDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!salonId) return;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await salonDetailApi.getDetail(salonId);
                setSalon(data);
            } catch (err: any) {
                setError(err?.response?.data?.message ?? "Failed to load salon");
            } finally {
                setLoading(false);
            }
        })();
    }, [salonId]);

    return { salon, loading, error };
}

export function useAvailableDates(salonId: number) {
    const [data, setData] = useState<AvailableDatesResponse | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!salonId) return;
        (async () => {
            try {
                setLoading(true);
                const res = await salonDetailApi.getAvailableDates(salonId);
                setData(res);
            } catch {
                setData(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [salonId]);

    return { data, loading };
}

export function useSalonServices(salonId: number) {
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!salonId) return;
        (async () => {
            try {
                setLoading(true);
                const res = await salonDetailApi.getServices(salonId);
                setCategories(res);
            } catch {
                setCategories([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [salonId]);

    return { categories, loading };
}