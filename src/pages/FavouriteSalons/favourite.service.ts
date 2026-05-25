import api from "~/api/apiInstance"; // adjust to your axios instance path

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FavouriteSalon {
    id: number;
    created_at: string;
    salon: {
        id: number;
        name: string;
        salon_type: string;
        status: string;
        email: string;
        contact_number: string;
        address: {
            line1: string;
            line2?: string;
            area?: string;
            city: string;
            state: string;
            pincode: string;
            latitude?: number;
            longitude?: number;
        };
        images: {
            id: number;
            image_url: string;
        }[];
    };
}

export interface ToggleResult {
    action: "added" | "removed";
}

// ── API calls ─────────────────────────────────────────────────────────────────

export const favouriteSalonsApi = {

    /** List all favourite salons for the logged-in customer */
    list: async (): Promise<FavouriteSalon[]> => {
        const res = await api.get("/favourite-salons");
        return res.data;
    },

    /** Toggle favourite status for a salon */
    toggle: async (salonId: number): Promise<ToggleResult> => {
        const res = await api.post(`/favourite-salons/toggle/${salonId}`);
        return res.data;
    },

    /** Explicitly add a salon to favourites */
    add: async (salonId: number): Promise<FavouriteSalon> => {
        const res = await api.post(`/favourite-salons/${salonId}`);
        return res.data;
    },

    /** Explicitly remove a salon from favourites */
    remove: async (salonId: number): Promise<void> => {
        await api.delete(`/favourite-salons/${salonId}`);
    },

    /** Check if a specific salon is favourited */
    check: async (salonId: number): Promise<{ is_favourite: boolean }> => {
        const res = await api.get(`/favourite-salons/check/${salonId}`);
        return res.data;
    },
};