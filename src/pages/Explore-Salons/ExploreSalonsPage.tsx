import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExploreFilters from "./ExploreFilters";
import SalonCard, { SalonCardData } from "./SalonCard";
import { useExploreSalons } from "./useExploreSalons";
import { ExploreSalon } from "./explore-salons.service";

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.06] dark:bg-white/[0.03]">
            <div className="h-48 bg-gray-100 dark:bg-white/[0.06]" />
            <div className="space-y-3 p-4">
                <div className="h-4 w-2/3 rounded-lg bg-gray-100 dark:bg-white/[0.06]" />
                <div className="h-3 w-1/2 rounded-lg bg-gray-100 dark:bg-white/[0.06]" />
                <div className="h-3 w-3/4 rounded-lg bg-gray-100 dark:bg-white/[0.06]" />
                <div className="mt-4 h-9 w-full rounded-xl bg-gray-100 dark:bg-white/[0.06]" />
            </div>
        </div>
    );
}

// ── Adapter: ExploreSalon → SalonCardData ─────────────────────────────────────
function toCardData(salon: ExploreSalon): SalonCardData {
    return {
        id: salon.id,
        name: salon.name,
        salon_type: salon.salon_type as SalonCardData["salon_type"],
        status: salon.status,
        contact_number: salon.contact_number,
        address: salon.address,
        images: salon.images,
        rating: salon.rating,
        review_count: salon.review_count,
        starting_price: salon.starting_price,
        is_favourite: salon.is_favourite,
    };
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function ExploreSalonsPage() {

    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [city, setCity] = useState("");
    const [salonType, setSalonType] = useState("");

    const { salons, loading, pagination, updateFilters, changePage } = useExploreSalons();

    // Debounced filter effect — unchanged from original
    useEffect(() => {
        const timeout = setTimeout(() => {
            updateFilters({
                search,
                city,
                salon_type: salonType as "male" | "female" | "unisex",
            });
        }, 400);
        return () => clearTimeout(timeout);
    }, [search, city, salonType]);

    const handleViewDetails = (salon: SalonCardData) => {
        navigate(`/explore-salons/${salon.id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-4 dark:bg-black">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-5">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Explore Salons
                    </h1>
                    <p className="mt-2 text-gray-500">
                        Find and book the best salons near you
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8">
                    <ExploreFilters
                        search={search}
                        city={city}
                        salon_type={salonType}
                        onSearchChange={setSearch}
                        onCityChange={setCity}
                        onSalonTypeChange={setSalonType}
                    />
                </div>

                {/* Loading */}
                {loading && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                )}

                {/* Empty */}
                {!loading && salons.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-gray-300 bg-white py-20 text-center dark:border-white/[0.08] dark:bg-white/[0.03]">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            No salons found
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Try changing filters
                        </p>
                    </div>
                )}

                {/* Grid */}
                {!loading && salons.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {salons.map((salon) => (
                                <SalonCard
                                    key={salon.id}
                                    salon={toCardData(salon)}
                                    variant="explore"
                                    onViewDetails={handleViewDetails}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-10 flex items-center justify-center gap-3">
                            <button
                                disabled={pagination.page === 1}
                                onClick={() => changePage(pagination.page - 1)}
                                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm disabled:opacity-50 dark:border-white/[0.08] dark:bg-white/[0.03]"
                            >
                                Previous
                            </button>
                            <div className="text-sm text-gray-500">
                                Page <span className="font-semibold">{pagination.page}</span>
                                {" "}of{" "}
                                <span className="font-semibold">{pagination.total_pages}</span>
                            </div>
                            <button
                                disabled={pagination.page === pagination.total_pages}
                                onClick={() => changePage(pagination.page + 1)}
                                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm disabled:opacity-50 dark:border-white/[0.08] dark:bg-white/[0.03]"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}