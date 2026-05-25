import { MapPin, Phone, Star, Calendar, Heart } from "lucide-react";
import FavouriteButton from "~/pages/FavouriteSalons/FavouriteButton";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface SalonCardData {
    id: number;
    name: string;
    salon_type: "male" | "female" | "unisex";
    status?: string;
    email?: string;
    contact_number?: string;
    address?: {
        line1?: string;
        line2?: string;
        area?: string;
        city: string;
        state: string;
        pincode?: string;
        latitude?: number;
        longitude?: number;
    };
    images?: { id?: number; image_url: string }[];

    // Explore-only extras (optional)
    rating?: number;
    review_count?: number;
    starting_price?: number;
    is_favourite?: boolean;

    // Favourites-only extras (optional)
    saved_at?: string; // created_at from FavoriteSalons join
}

export type SalonCardVariant = "explore" | "favourite";

export interface SalonCardProps {
    salon: SalonCardData;
    /** Controls which extra info row is shown at the bottom */
    variant?: SalonCardVariant;
    /** Called when the CTA button is clicked */
    onViewDetails?: (salon: SalonCardData) => void;
    /** Called when the remove-favourite button is clicked (favourite variant) */
    onRemove?: (salonId: number) => void;
    /** Show spinner / disabled state on the remove button */
    removing?: boolean;
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const TYPE_STYLES: Record<string, { bg: string; dot: string; label: string }> = {
    male: { bg: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400", dot: "bg-sky-400", label: "Male" },
    female: { bg: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400", dot: "bg-rose-400", label: "Female" },
    unisex: { bg: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400", dot: "bg-violet-400", label: "Unisex" },
};

const STATUS_DOT: Record<string, string> = {
    active: "bg-emerald-400",
    inactive: "bg-gray-400",
    pending: "bg-amber-400",
    blocked: "bg-red-400",
};

function StarRow({ rating, count }: { rating: number; count: number }) {
    return (
        <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                        key={s}
                        size={11}
                        className={s <= Math.round(rating) ? "text-amber-400" : "text-gray-200 dark:text-white/10"}
                        fill="currentColor"
                    />
                ))}
            </div>
            <span className="text-xs font-semibold text-gray-700 dark:text-white/80">
                {rating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">({count})</span>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────

export default function SalonCard({
    salon,
    variant = "explore",
    onViewDetails,
    onRemove,
    removing = false,
}: SalonCardProps) {

    const coverImage = salon.images?.[0]?.image_url;
    const typeStyle = TYPE_STYLES[salon.salon_type] ?? TYPE_STYLES.unisex;

    const addressLine = salon.address
        ? [salon.address.area, salon.address.city, salon.address.state]
            .filter(Boolean)
            .join(", ")
        : null;

    const isFavouriteVariant = variant === "favourite";

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-white/[0.06] dark:bg-white/[0.03] dark:hover:border-white/[0.1]">

            {/* ── IMAGE ───────────────────────────────────────────── */}
            <div className="relative h-48 w-full shrink-0 overflow-hidden bg-gray-100 dark:bg-white/[0.04]">

                {coverImage ? (
                    <img
                        src={coverImage}
                        alt={salon.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <span className="text-5xl opacity-10 dark:opacity-[0.06]">✂</span>
                    </div>
                )}

                {/* Scrim so bottom badges stay legible over any image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                {/* Salon type pill — top left */}
                <span className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-sm ${typeStyle.bg}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${typeStyle.dot}`} />
                    {typeStyle.label}
                </span>

                {/* Status dot — top left, below type pill, only when status provided */}
                {salon.status && (
                    <span className="absolute left-3 top-11 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium capitalize text-gray-700 backdrop-blur-sm dark:bg-black/60 dark:text-white/80">
                        <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[salon.status] ?? "bg-gray-400"}`} />
                        {salon.status}
                    </span>
                )}

                {/* Top-right action button */}
                <div className="absolute right-3 top-3">
                    {isFavouriteVariant ? (
                        /* Favourite variant: solid red heart to remove */
                        <button
                            onClick={(e) => { e.stopPropagation(); e.preventDefault(); onRemove?.(salon.id); }}
                            disabled={removing}
                            title="Remove from favourites"
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-red-200 bg-white/95 text-red-500 shadow-sm backdrop-blur-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/30 dark:bg-black/60 dark:text-red-400"
                        >
                            <Heart size={14} fill="currentColor" className={removing ? "animate-pulse" : ""} />
                        </button>
                    ) : (
                        /* Explore variant: toggle heart via FavouriteButton */
                        <FavouriteButton
                            salonId={salon.id}
                            initialState={salon.is_favourite}
                            size="sm"
                            className="backdrop-blur-sm shadow-sm"
                        />
                    )}
                </div>

                {/* Explore variant: rating pill on image bottom-left */}
                {!isFavouriteVariant && salon.rating !== undefined && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-lg bg-white/95 px-2 py-1 text-xs font-semibold text-amber-600 shadow-sm backdrop-blur-sm dark:bg-black/70 dark:text-amber-400">
                        <Star size={11} fill="currentColor" />
                        {salon.rating.toFixed(1)}
                        {salon.review_count !== undefined && (
                            <span className="ml-0.5 font-normal text-gray-400 dark:text-white/40">
                                ({salon.review_count})
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* ── BODY ────────────────────────────────────────────── */}
            <div className="flex flex-1 flex-col gap-3 p-4">

                {/* Name */}
                <div>
                    <h3 className="truncate text-[15px] font-semibold leading-snug text-gray-900 dark:text-white">
                        {salon.name}
                    </h3>

                    {/* Favourite variant: show rating below name */}
                    {isFavouriteVariant && salon.rating !== undefined && salon.review_count !== undefined && (
                        <div className="mt-1">
                            <StarRow rating={salon.rating} count={salon.review_count} />
                        </div>
                    )}
                </div>

                {/* Address */}
                {addressLine && (
                    <p className="flex items-start gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin size={12} className="mt-0.5 shrink-0 text-gray-400" />
                        <span className="line-clamp-1">{addressLine}</span>
                    </p>
                )}

                {/* Contact — shown when available */}
                {salon.contact_number && (
                    <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <Phone size={12} className="shrink-0 text-gray-400" />
                        {salon.contact_number}
                    </p>
                )}

                {/* Variant-specific bottom row */}
                {isFavouriteVariant ? (
                    /* Favourite: saved date */
                    salon.saved_at && (
                        <p className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                            <Calendar size={12} className="shrink-0" />
                            Saved {new Date(salon.saved_at).toLocaleDateString("en-IN", {
                                day: "numeric", month: "short", year: "numeric",
                            })}
                        </p>
                    )
                ) : (
                    /* Explore: starting price */
                    salon.starting_price !== undefined && (
                        <div className="flex items-baseline gap-1">
                            <span className="text-xs text-gray-400">Starts at</span>
                            <span className="text-base font-bold text-gray-900 dark:text-white">
                                ₹{salon.starting_price}
                            </span>
                        </div>
                    )
                )}

                {/* Spacer pushes CTA to bottom */}
                <div className="flex-1" />

                {/* CTA */}
                <button
                    onClick={() => onViewDetails?.(salon)}
                    className="w-full rounded-xl bg-gray-900 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-white/90"
                >
                    View Salon
                </button>
            </div>
        </div>
    );
}