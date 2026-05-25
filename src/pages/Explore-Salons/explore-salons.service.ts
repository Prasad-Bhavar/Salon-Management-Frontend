import api from "~/api/apiInstance";


import {
    SalonDetail,
    AvailableDatesResponse,
    ServiceCategory,
} from "./salon-detail.types";

//
// TYPES
//

export interface ExploreSalon {

    id: number;

    name: string;

    salon_type: "male" | "female" | "unisex";

    status: string;

    contact_number: string;

    rating: number;

    review_count: number;

    starting_price: number;

    is_favourite: boolean;

    address: {
        id: number;
        area?: string;
        city: string;
        state: string;
    };

    images: {
        id: number;
        image_url: string;
    }[];
}

export interface ExploreSalonsResponse {

    items: ExploreSalon[];

    pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}

export interface ExploreSalonsQuery {

    page?: number;

    limit?: number;

    search?: string;

    city?: string;

    salon_type?: "male" | "female" | "unisex";
}

//
// API
//

export const exploreSalonsApi = {

    //
    // LIST
    //

    list: async (
        query?: ExploreSalonsQuery
    ): Promise<ExploreSalonsResponse> => {

        const res =
            await api.get(
                "/explore-salons",
                {
                    params: query,
                }
            );

        return res.data;
    },
};



export const salonDetailApi = {

    /** GET /explore-salons/:id */
    getDetail: async (id: number): Promise<SalonDetail> => {
        const res = await api.get(`/explore-salons/${id}`);
        return res.data;
    },

    /** GET /explore-salons/:id/available-dates */
    getAvailableDates: async (id: number): Promise<AvailableDatesResponse> => {
        const res = await api.get(`/explore-salons/${id}/available-dates`);
        return res.data;
    },

    /** GET /explore-salons/:id/services */
    getServices: async (id: number): Promise<ServiceCategory[]> => {
        const res = await api.get(`/explore-salons/${id}/services`);
        return res.data;
    },
};
