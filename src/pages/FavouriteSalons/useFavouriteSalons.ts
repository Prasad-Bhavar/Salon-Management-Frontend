import { useState, useEffect, useCallback } from "react";
import {
    favouriteSalonsApi,
    FavouriteSalon,
} from "./favourite.service";

export function useFavouriteSalons() {

    const [favourites, setFavourites] = useState<FavouriteSalon[]>([]);
    const [loading, setLoading] = useState(true);
    const [togglingId, setTogglingId] = useState<number | null>(null);

    // ── Fetch list ────────────────────────────────────────────────────────────

    const fetchFavourites = useCallback(async () => {
        try {
            setLoading(true);
            const data = await favouriteSalonsApi.list();
            setFavourites(data);
        } catch (err) {
            console.error("Failed to fetch favourite salons:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFavourites();
    }, [fetchFavourites]);

    // ── Toggle ────────────────────────────────────────────────────────────────

    const toggle = useCallback(async (salonId: number) => {
        setTogglingId(salonId);
        try {
            const result = await favouriteSalonsApi.toggle(salonId);

            if (result.action === "removed") {
                // Optimistically remove from list
                setFavourites((prev) =>
                    prev.filter((f) => f.salon.id !== salonId)
                );
            } else {
                // Re-fetch to get full salon details
                await fetchFavourites();
            }

            return result;
        } catch (err) {
            console.error("Failed to toggle favourite:", err);
        } finally {
            setTogglingId(null);
        }
    }, [fetchFavourites]);

    // ── Check if a salon is in the current list ───────────────────────────────

    const isFavourite = useCallback(
        (salonId: number) => favourites.some((f) => f.salon.id === salonId),
        [favourites]
    );

    return {
        favourites,
        loading,
        togglingId,
        toggle,
        isFavourite,
        refetch: fetchFavourites,
    };
}

// ── Single-salon favourite hook (for detail pages) ────────────────────────────

export function useSalonFavourite(salonId: number) {

    const [isFavourite, setIsFavourite] = useState(false);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState(false);

    useEffect(() => {
        if (!salonId) return;
        (async () => {
            try {
                setLoading(true);
                const data = await favouriteSalonsApi.check(salonId);
                setIsFavourite(data.is_favourite);
            } catch (err) {
                console.error("Failed to check favourite status:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [salonId]);

    const toggle = useCallback(async () => {
        setToggling(true);
        try {
            const result = await favouriteSalonsApi.toggle(salonId);
            setIsFavourite(result.action === "added");
            return result;
        } catch (err) {
            console.error("Failed to toggle favourite:", err);
        } finally {
            setToggling(false);
        }
    }, [salonId]);

    return {
        isFavourite,
        loading,
        toggling,
        toggle,
    };
}