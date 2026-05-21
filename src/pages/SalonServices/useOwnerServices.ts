import {
    useEffect,
    useState,
} from "react";

import {
    getOwnerServices,
} from "./services.service";

export function useOwnerServices() {

    const [loading, setLoading] =
        useState(false);

    const [services, setServices] =
        useState<any[]>([]);

    const [stats, setStats] =
        useState<any>(null);

    const fetchServices =
        async () => {

            try {

                setLoading(true);

                const res =
                    await getOwnerServices();

                console.log("services", res);

                setServices(
                    res.services || []
                );

                setStats(
                    res.stats || null
                );

            } finally {

                setLoading(false);
            }
        };

    useEffect(() => {

        fetchServices();

    }, []);

    return {

        loading,

        services,

        stats,

        refetch:
            fetchServices,
    };
}