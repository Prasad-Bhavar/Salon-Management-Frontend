import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import SalonCard, { SalonCardData } from "~/pages/Explore-Salons/SalonCard";
import { useFavouriteSalons } from "./useFavouriteSalons";
import { FavouriteSalon } from "./favourite.service";

// ── Skeleton ───────────────────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
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

// ── Adapter: FavouriteSalon → SalonCardData ────────────────────────────────────
function toCardData(fav: FavouriteSalon): SalonCardData {
    return {
        id: fav.salon.id,
        name: fav.salon.name,
        salon_type: fav.salon.salon_type as SalonCardData["salon_type"],
        status: fav.salon.status,
        email: fav.salon.email,
        contact_number: fav.salon.contact_number,
        address: fav.salon.address,
        images: fav.salon.images,
        saved_at: fav.created_at,
        // rating / review_count / starting_price not returned by favourites API
        // include them here if your backend is extended to return them
    };
}

// ── Empty state ────────────────────────────────────────────────────────────────
function EmptyState() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10">
                <Heart size={28} className="text-red-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                No favourite salons yet
            </h3>
            <p className="mt-1 max-w-xs text-sm text-gray-500 dark:text-gray-400">
                Browse salons and tap the heart icon to save your favourites here.
            </p>
            <button
                onClick={() => navigate("/explore-salons")}
                className="mt-6 rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600"
            >
                Explore Salons
            </button>
        </div>
    );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function FavouriteSalonsList() {

    const navigate = useNavigate();
    const { favourites, loading, togglingId, toggle } = useFavouriteSalons();

    const handleViewDetails = (salon: SalonCardData) => {
        navigate(`/explore-salons/${salon.id}`);
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                        Favourite Salons
                    </h1>
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                        Salons you have saved for quick access.
                    </p>
                </div>
                {!loading && favourites.length > 0 && (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-500 dark:bg-red-500/10 dark:text-red-400">
                        {favourites.length} saved
                    </span>
                )}
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : favourites.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {favourites.map((fav) => (
                        <SalonCard
                            key={fav.id}
                            salon={toCardData(fav)}
                            variant="favourite"
                            onViewDetails={handleViewDetails}
                            onRemove={toggle}
                            removing={togglingId === fav.salon.id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}