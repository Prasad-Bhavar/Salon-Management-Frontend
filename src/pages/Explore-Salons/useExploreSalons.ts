import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    exploreSalonsApi,
    ExploreSalon,
    ExploreSalonsQuery,
} from "./explore-salons.service";

export function useExploreSalons(
    initialQuery?: ExploreSalonsQuery
) {

    //
    // STATES
    //

    const [loading, setLoading] =
        useState(true);

    const [salons, setSalons] =
        useState<ExploreSalon[]>([]);

    const [pagination, setPagination] =
        useState({

            page: 1,
            limit: 10,
            total: 0,
            total_pages: 0,
        });

    const [query, setQuery] =
        useState<ExploreSalonsQuery>({
            page: 1,
            limit: 10,
            ...initialQuery,
        });

    //
    // FETCH
    //

    const fetchSalons =
        useCallback(
            async (
                customQuery?: ExploreSalonsQuery
            ) => {

                try {

                    setLoading(true);

                    const finalQuery = {
                        ...query,
                        ...customQuery,
                    };

                    const response =
                        await exploreSalonsApi.list(
                            finalQuery
                        );

                    setSalons(
                        response.items
                    );

                    setPagination(
                        response.pagination
                    );

                } catch (error) {

                    console.error(
                        "Failed to fetch salons:",
                        error
                    );

                } finally {

                    setLoading(false);
                }
            },
            [query]
        );

    //
    // INITIAL FETCH
    //

    useEffect(() => {

        fetchSalons();

    }, []);

    //
    // FILTER UPDATE
    //

    const updateFilters =
        (
            filters: Partial<ExploreSalonsQuery>
        ) => {

            const updatedQuery = {

                ...query,

                ...filters,

                page: 1,
            };

            setQuery(
                updatedQuery
            );

            fetchSalons(
                updatedQuery
            );
        };

    //
    // PAGE CHANGE
    //

    const changePage =
        (
            page: number
        ) => {

            const updatedQuery = {

                ...query,

                page,
            };

            setQuery(
                updatedQuery
            );

            fetchSalons(
                updatedQuery
            );
        };

    //
    // REFETCH
    //

    const refetch =
        () => fetchSalons();

    return {

        loading,

        salons,

        pagination,

        query,

        updateFilters,

        changePage,

        refetch,
    };
}