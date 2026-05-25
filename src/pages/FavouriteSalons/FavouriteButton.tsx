import { Heart } from "lucide-react";
import { useSalonFavourite } from "./useFavouriteSalons";

interface FavouriteButtonProps {
    salonId: number;
    /** Optional: pass the current state from a parent hook to avoid an extra API call */
    initialState?: boolean;
    size?: "sm" | "md";
    className?: string;
}

export default function FavouriteButton({
    salonId,
    size = "md",
    className = "",
}: FavouriteButtonProps) {

    const { isFavourite, toggling, toggle } = useSalonFavourite(salonId);
    const active = isFavourite;
    const sizeClass = size === "sm"
        ? "h-8 w-8"
        : "h-9 w-9";

    const iconSize = size === "sm" ? 14 : 16;

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toggle();
            }}
            disabled={toggling}
            title={active ? "Remove from favourites" : "Add to favourites"}
            className={[
                "flex items-center justify-center rounded-full border transition-all",
                "disabled:cursor-not-allowed disabled:opacity-60",
                active
                    ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400"
                    : "border-gray-200 bg-white text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-400 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-gray-500",
                sizeClass,
                className,
            ].join(" ")}
        >
            <Heart
                size={iconSize}
                className={`transition-all ${toggling ? "scale-90 opacity-50" : "scale-100"}`}
                fill={active ? "currentColor" : "none"}
            />
        </button>
    );
}