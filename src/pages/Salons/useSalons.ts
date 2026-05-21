import { useEffect, useRef, useState } from "react";

import {
    getSalons,
    Salon,
    SalonStatus,
    SalonType,
    PaginationParams,
} from "./salons.service";

import { useDebounce } from "~/hooks/useDebounce";

//
// TABLE STATE
//

interface TableState {

    first: number;

    rows: number;

    page: number;

    sortField: string;

    sortOrder:
    | 1
    | -1
    | 0
    | null
    | undefined;
}

export function useSalons() {

    //
    // STATES
    //

    const [salons, setSalons] =
        useState<Salon[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [total, setTotal] =
        useState(0);

    //
    // TABLE STATE
    //

    const [tableState, setTableState] =
        useState<TableState>({
            first: 0,
            rows: 10,
            page: 1,
            sortField: "created_at",
            sortOrder: -1,
        });

    //
    // FILTER STATES
    //

    const [searchInput, setSearchInput] =
        useState("");

    const [stagedStatus, setStagedStatus] =
        useState<SalonStatus | "">("");

    const [stagedSalonType, setStagedSalonType] =
        useState<SalonType | "">("");

    //
    // APPLIED FILTERS
    //

    const [appliedFilters, setAppliedFilters] =
        useState<{

            search: string;

            status: SalonStatus | "";

            salon_type: SalonType | "";
        }>({

            search: "",

            status: "",

            salon_type: "",
        });

    //
    // DEBOUNCE
    //

    const debouncedSearch =
        useDebounce(
            searchInput,
            500
        );

    //
    // PREVENT MULTIPLE CALLS
    //

    const isFetchingRef =
        useRef(false);

    //
    // FETCH SALONS
    //

    const fetchSalons = async () => {

        if (isFetchingRef.current) {
            return;
        }

        isFetchingRef.current = true;

        setLoading(true);

        try {

            const params:
                PaginationParams = {

                page:
                    tableState.page,

                limit:
                    tableState.rows,

                search:
                    appliedFilters.search,

                status:
                    appliedFilters.status,

                salon_type:
                    appliedFilters.salon_type,

                sort:
                    tableState.sortField,

                order:
                    tableState.sortOrder === -1
                        ? "desc"
                        : "asc",
            };

            const res =
                await getSalons(params);

            setSalons(res.data);

            setTotal(res.total);

        } finally {

            setLoading(false);

            isFetchingRef.current = false;
        }
    };

    //
    // SEARCH EFFECT
    //

    useEffect(() => {

        setAppliedFilters((prev) => ({
            ...prev,

            search:
                debouncedSearch,
        }));

        //
        // RESET PAGE
        //

        setTableState((prev) => ({
            ...prev,

            page: 1,

            first: 0,
        }));

    }, [debouncedSearch]);

    //
    // FETCH EFFECT
    //

    useEffect(() => {

        fetchSalons();

    }, [

        tableState.page,

        tableState.rows,

        tableState.sortField,

        tableState.sortOrder,

        appliedFilters.search,

        appliedFilters.status,

        appliedFilters.salon_type,
    ]);

    //
    // APPLY FILTERS
    //

    const applyFilters = () => {

        setAppliedFilters({

            search: searchInput,

            status: stagedStatus,

            salon_type:
                stagedSalonType,
        });

        //
        // RESET PAGE
        //

        setTableState((prev) => ({
            ...prev,

            page: 1,

            first: 0,
        }));
    };

    //
    // RESET FILTERS
    //

    const resetFilters = () => {

        setSearchInput("");

        setStagedStatus("");

        setStagedSalonType("");

        setAppliedFilters({

            search: "",

            status: "",

            salon_type: "",
        });

        //
        // RESET PAGE
        //

        setTableState((prev) => ({
            ...prev,

            page: 1,

            first: 0,
        }));
    };

    //
    // PAGINATION
    //

    const handlePage = (event: any) => {

        setTableState((prev) => ({
            ...prev,

            first: event.first,

            rows: event.rows,

            page:
                (event.page ?? 0) + 1,
        }));
    };

    //
    // SORTING
    //

    const handleSort = (event: any) => {

        setTableState((prev) => ({
            ...prev,

            sortField:
                event.sortField,

            sortOrder:
                event.sortOrder,
        }));
    };

    return {

        salons,

        loading,

        total,

        tableState,

        //
        // FILTERS
        //

        filters: {

            searchInput,

            setSearchInput,

            stagedStatus,

            setStagedStatus,

            stagedSalonType,

            setStagedSalonType,
        },

        //
        // ACTIONS
        //

        actions: {

            applyFilters,

            resetFilters,

            handlePage,

            handleSort,

            refetch:
                fetchSalons,
        },
    };
}