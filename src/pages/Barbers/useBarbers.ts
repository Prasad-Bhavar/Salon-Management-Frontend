// OPTIONAL NEXT FILE
// src/pages/Barbers/useBarbers.ts

import {
    useEffect,
    useState,
} from "react";

import {
    getBarbers,
} from "./barbers.service";

export function useBarbers() {

    const [loading, setLoading] =
        useState(false);

    const [barbers, setBarbers] =
        useState<any[]>([]);

    const [stats, setStats] =
        useState<any>(null);

    //
    // FETCH
    //

    const fetchBarbers =
        async () => {

            try {

                setLoading(true);

                const response =
                    await getBarbers();

                setBarbers(
                    response.barbers
                );

                setStats(
                    response.stats
                );

            } finally {

                setLoading(false);
            }
        };

    useEffect(() => {

        fetchBarbers();

    }, []);

    return {

        loading,

        barbers,

        stats,

        refetch:
            fetchBarbers,
    };
}