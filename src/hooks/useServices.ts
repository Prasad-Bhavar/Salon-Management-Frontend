import { useEffect, useState } from "react";

import { getOwnerServices } from "~/pages/SalonServices/services.service.ts";

export interface Service {

    id: number;

    name: string;

    category?: {
        id: number;
        name: string;
    };

    duration?: number;

    price?: number;

    status?: string;
}

export function useServices() {

    const [services, setServices] =
        useState<Service[]>([]);

    const [loading, setLoading] =
        useState(false);

    useEffect(() => {

        const fetchServices = async () => {

            try {

                setLoading(true);

                const res =
                    await getOwnerServices();

                setServices(
                    res || []
                );

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);
            }
        };

        fetchServices();

    }, []);

    return {

        services,

        loading,
    };
}