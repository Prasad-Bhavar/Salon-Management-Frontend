import {
    useEffect,
    useState,
} from "react";

import {
    getBookings,
} from "./bookings.service";

import {
    Booking,
    PaginationParams,
} from "./booking.types";

export function useBookings() {

    //
    // STATES
    //

    const [bookings, setBookings] =
        useState<Booking[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [total, setTotal] =
        useState(0);

    //
    // TABLE
    //

    const [tableState, setTableState] =
        useState({

            first: 0,

            rows: 10,

            page: 1,

            sortField:
                "booking.created_at",

            sortOrder:
                -1 as 1 | -1,
        });

    //
    // FILTERS
    //

    const [searchInput, setSearchInput] =
        useState("");

    const [stagedStatus, setStagedStatus] =
        useState("");

    const [stagedSalon, setStagedSalon] =
        useState("");

    //
    // APPLIED FILTERS
    //

    const [appliedFilters, setAppliedFilters] =
        useState({

            search: "",

            status: "",

            salon_id:
                undefined as
                | number
                | undefined,
        });

    //
    // FETCH BOOKINGS
    //

    const fetchBookings =
        async () => {

            try {

                setLoading(true);

                const params: PaginationParams = {

                    page:
                        tableState.page,

                    limit:
                        tableState.rows,

                    search:
                        appliedFilters.search,

                    status:
                        appliedFilters.status,

                    salon_id:
                        appliedFilters.salon_id,

                    sort:
                        tableState.sortField,

                    order:
                        tableState.sortOrder ===
                            -1
                            ? "DESC"
                            : "ASC",
                };

                const res =
                    await getBookings(
                        params
                    );
                console.log("Bookings fetch response:-------", res.data);

                setBookings(
                    res.data
                );

                setTotal(
                    res.total
                );
                console.log("Total bookings:", res.data.pagination.total);
            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);
            }
        };

    //
    // INITIAL LOAD
    //

    useEffect(() => {

        fetchBookings();

    }, [

        tableState.page,

        tableState.rows,

        tableState.sortField,

        tableState.sortOrder,

        appliedFilters,
    ]);

    //
    // FILTER ACTIONS
    //

    const applyFilters = () => {

        setAppliedFilters({

            search:
                searchInput,

            status:
                stagedStatus,

            salon_id:
                stagedSalon
                    ? Number(
                        stagedSalon
                    )
                    : undefined,
        });

        setTableState(
            (prev) => ({

                ...prev,

                page: 1,

                first: 0,
            })
        );
    };

    const resetFilters = () => {

        setSearchInput("");

        setStagedStatus("");

        setStagedSalon("");

        setAppliedFilters({

            search: "",

            status: "",

            salon_id:
                undefined,
        });
    };

    //
    // PAGINATION
    //

    const handlePage = (
        event: any
    ) => {

        setTableState(
            (prev) => ({

                ...prev,

                page:
                    event.page + 1,

                first:
                    event.first,

                rows:
                    event.rows,
            })
        );
    };

    //
    // SORTING
    //

    const handleSort = (
        field: string
    ) => {

        setTableState(
            (prev) => ({

                ...prev,

                sortField:
                    field,

                sortOrder:
                    prev.sortField ===
                        field
                        ? prev.sortOrder ===
                            1
                            ? -1
                            : 1
                        : 1,
            })
        );
    };

    return {

        bookings,

        loading,

        total,

        tableState,

        filters: {

            searchInput,

            setSearchInput,

            stagedStatus,

            setStagedStatus,

            stagedSalon,

            setStagedSalon,
        },

        actions: {

            applyFilters,

            resetFilters,

            handlePage,

            handleSort,

            refetch:
                fetchBookings,
        },
    };
}